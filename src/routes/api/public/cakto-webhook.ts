import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Webhook da Cakto. Configurar na Cakto apontando para:
 *   https://{seu-dominio}/api/public/cakto-webhook
 *
 * O segredo do webhook deve ser salvo como variável CAKTO_WEBHOOK_SECRET.
 *
 * Payload esperado (formato genérico — ajustamos conforme docs reais da Cakto):
 *   {
 *     event: "purchase_approved" | "purchase_refunded" | "subscription_renewed" | "subscription_canceled",
 *     data: {
 *       customer: { email: string, name?: string },
 *       product:  { id: string },
 *       order_id?: string,
 *       subscription_id?: string,
 *       next_billing_date?: string  // ISO
 *     }
 *   }
 */
export const Route = createFileRoute("/api/public/cakto-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env.CAKTO_WEBHOOK_SECRET;
        const rawBody = await request.text();

        // Verificação de assinatura HMAC (Cakto envia em x-signature ou x-cakto-signature)
        if (secret) {
          const sig =
            request.headers.get("x-cakto-signature") ??
            request.headers.get("x-signature") ??
            "";
          const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
          const sigBuf = Buffer.from(sig);
          const expBuf = Buffer.from(expected);
          if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
            return new Response("Invalid signature", { status: 401 });
          }
        } else {
          // Sem segredo configurado: aceita pra teste, mas loga aviso.
          console.warn("[cakto-webhook] CAKTO_WEBHOOK_SECRET não configurado — aceitando sem verificar assinatura");
        }

        let payload: {
          event?: string;
          data?: {
            customer?: { email?: string; name?: string };
            product?: { id?: string };
            order_id?: string;
            subscription_id?: string;
            next_billing_date?: string;
          };
        };
        try {
          payload = JSON.parse(rawBody);
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }

        const event = payload.event;
        const email = payload.data?.customer?.email?.toLowerCase().trim();
        const productId = payload.data?.product?.id;

        if (!event || !email || !productId) {
          return new Response("Missing required fields", { status: 400 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        // 1) Encontrar o user pelo email (perfil)
        const { data: profile } = await supabaseAdmin
          .from("profiles")
          .select("id")
          .ilike("email", email)
          .maybeSingle();

        // 1b) Assinatura de app inteiro (plano)? Libera acesso pago e encerra gratuidade.
        // Primeiro procura uma oferta por período (mensal/semestral/anual).
        const { data: offer } = await supabaseAdmin
          .from("plan_offers")
          .select(
            "plan_slug, billing_period, period_days, certificates_included, report_quota, bonus_app_included",
          )
          .eq("cakto_product_id", productId)
          .eq("is_active", true)
          .maybeSingle();

        const { data: plan } = offer
          ? { data: { slug: offer.plan_slug } }
          : await supabaseAdmin
              .from("subscription_plans")
              .select("slug")
              .eq("cakto_product_id", productId)
              .maybeSingle();

        if (plan) {
          const approved =
            event === "purchase_approved" ||
            event === "subscription_renewed" ||
            event === "subscription_created";

          if (!approved) {
            return new Response(JSON.stringify({ ok: true, note: "plan_event_ignored" }), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          }

          const periodDays = offer?.period_days ?? 30;
          const billingPeriod = offer?.billing_period ?? "mensal";
          const certificates = offer?.certificates_included ?? 0;
          const reportQuota = offer?.report_quota ?? 0;
          const expiresAt = new Date(Date.now() + periodDays * 24 * 60 * 60 * 1000).toISOString();

          if (!profile) {
            // Comprou antes de criar conta: guarda para liberar no cadastro.
            await supabaseAdmin.from("pending_purchases").upsert(
              {
                email,
                plan_slug: plan.slug,
                order_id: payload.data?.order_id ?? null,
                next_billing_date: expiresAt,
                consumed_at: null,
              } as never,
              { onConflict: "email,plan_slug" },
            );
            return new Response(JSON.stringify({ ok: true, note: "purchase_pending_signup" }), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          }

          // Encerra qualquer gratuidade vigente deste aluno
          await supabaseAdmin
            .from("user_subscriptions")
            .update({ status: "expired", expires_at: new Date().toISOString() })
            .eq("user_id", profile.id)
            .eq("status", "trial");

          const { data: existing } = await supabaseAdmin
            .from("user_subscriptions")
            .select("id")
            .eq("user_id", profile.id)
            .eq("plan_slug", plan.slug)
            .eq("status", "active")
            .maybeSingle();

          if (existing) {
            await supabaseAdmin
              .from("user_subscriptions")
              .update({
                expires_at: expiresAt,
                billing_period: billingPeriod,
                certificates_allowed: certificates,
                report_quota: reportQuota,
              } as never)
              .eq("id", existing.id);
          } else {
            await supabaseAdmin.from("user_subscriptions").insert({
              user_id: profile.id,
              plan_slug: plan.slug,
              status: "active",
              started_at: new Date().toISOString(),
              expires_at: expiresAt,
              billing_period: billingPeriod,
              certificates_allowed: certificates,
              report_quota: reportQuota,
              notes: `Compra Cakto ${billingPeriod} ${payload.data?.order_id ?? ""}`.trim(),
            } as never);
          }


          return new Response(JSON.stringify({ ok: true, note: "plan_access_granted" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }

        if (!profile) {
          console.warn("[cakto-webhook] usuário não encontrado para email:", email);
          return new Response(JSON.stringify({ ok: true, note: "user_not_found" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }


        // 2) Encontrar o mini app pelo cakto_product_id
        const { data: miniApp } = await supabaseAdmin
          .from("mini_apps")
          .select("id, kind")
          .eq("cakto_product_id", productId)
          .maybeSingle();

        if (!miniApp) {
          console.warn("[cakto-webhook] mini_app não encontrado para product_id:", productId);
          return new Response(JSON.stringify({ ok: true, note: "product_not_mapped" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }

        const isApproval =
          event === "purchase_approved" ||
          event === "subscription_renewed" ||
          event === "subscription_created";
        const isCancellation =
          event === "purchase_refunded" ||
          event === "subscription_canceled" ||
          event === "subscription_cancelled" ||
          event === "purchase_chargeback";

        if (miniApp.kind === "basico") {
          // Assinatura recorrente
          if (isApproval) {
            await supabaseAdmin.from("subscriptions").upsert(
              {
                user_id: profile.id,
                mini_app_id: miniApp.id,
                status: "active",
                cakto_subscription_id: payload.data?.subscription_id ?? null,
                current_period_end: payload.data?.next_billing_date ?? null,
                cancelled_at: null,
              },
              { onConflict: "user_id,mini_app_id" },
            );
          } else if (isCancellation) {
            await supabaseAdmin
              .from("subscriptions")
              .update({ status: "cancelled", cancelled_at: new Date().toISOString() })
              .eq("user_id", profile.id)
              .eq("mini_app_id", miniApp.id);
          }
        } else if (miniApp.kind === "relatorio") {
          // Relatório de Estágio (ABNT): 5 aberturas por compra (1 geração + 4 correções).
          if (isApproval) {
            await supabaseAdmin
              .from("relatorio_uses")
              .upsert(
                {
                  user_id: profile.id,
                  mini_app_id: miniApp.id,
                  opens_left: 5,
                  total_opens: 5,
                  generated_at: null,
                  cakto_order_id: payload.data?.order_id ?? null,
                },
                { onConflict: "user_id,mini_app_id" },
              );
          } else if (isCancellation) {
            await supabaseAdmin
              .from("relatorio_uses")
              .update({ opens_left: 0 })
              .eq("user_id", profile.id)
              .eq("mini_app_id", miniApp.id);
          }
        } else {
          // Extra: pagamento único = 150 dias de acesso
          if (isApproval) {
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 150);
            await supabaseAdmin.from("user_app_access").insert({
              user_id: profile.id,
              mini_app_id: miniApp.id,
              expires_at: expiresAt.toISOString(),
              cakto_order_id: payload.data?.order_id ?? null,
            });
          } else if (isCancellation && payload.data?.order_id) {
            await supabaseAdmin
              .from("user_app_access")
              .delete()
              .eq("user_id", profile.id)
              .eq("mini_app_id", miniApp.id)
              .eq("cakto_order_id", payload.data.order_id);
          }
        }



        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
