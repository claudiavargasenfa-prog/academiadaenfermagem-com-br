import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "crypto";

/**
 * Webhook de pagamentos (Mercado Pago).
 *
 * SEGURANÇA:
 * - Nada do corpo da requisição é considerado confiável.
 * - Quando MP_WEBHOOK_SECRET existe, a assinatura x-signature é validada.
 * - O status real do pagamento é sempre buscado na API do Mercado Pago
 *   usando MP_ACCESS_TOKEN. Só então o pedido é liberado.
 * - Toda escrita é feita com o cliente de servidor (service role).
 */

function verifySignature(
  secret: string,
  xSignature: string | null,
  xRequestId: string | null,
  dataId: string,
): boolean {
  if (!xSignature) return false;
  const parts = Object.fromEntries(
    xSignature.split(",").map((p) => {
      const [k, ...rest] = p.split("=");
      return [k.trim(), rest.join("=").trim()];
    }),
  ) as Record<string, string>;
  const ts = parts["ts"];
  const v1 = parts["v1"];
  if (!ts || !v1) return false;
  const manifest = `id:${dataId};request-id:${xRequestId ?? ""};ts:${ts};`;
  const expected = createHmac("sha256", secret).update(manifest).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(v1);
  return a.length === b.length && timingSafeEqual(a, b);
}

export const Route = createFileRoute("/api/public/payments")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { supabaseAdmin } = await import(
          "@/integrations/supabase/client.server"
        );

        try {
          const raw = await request.text();
          let payload: any = {};
          try {
            payload = raw ? JSON.parse(raw) : {};
          } catch {
            return new Response(JSON.stringify({ error: "invalid_payload" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          const url = new URL(request.url);
          const paymentId = String(
            payload?.data?.id ??
              url.searchParams.get("data.id") ??
              url.searchParams.get("id") ??
              "",
          );

          // Registro de auditoria (nunca libera acesso por si só)
          await supabaseAdmin.from("payment_webhooks").insert({
            provider: "mercadopago",
            payload,
          });

          const secret = process.env["MP_WEBHOOK_SECRET"];
          if (secret) {
            const ok = verifySignature(
              secret,
              request.headers.get("x-signature"),
              request.headers.get("x-request-id"),
              paymentId,
            );
            if (!ok) {
              return new Response(JSON.stringify({ error: "unauthorized" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
              });
            }
          }

          const accessToken = process.env["MP_ACCESS_TOKEN"];
          if (!accessToken || !paymentId) {
            // Sem verificação possível: apenas registra e encerra.
            return new Response(JSON.stringify({ received: true }), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          }

          const mpRes = await fetch(
            `https://api.mercadopago.com/v1/payments/${encodeURIComponent(paymentId)}`,
            { headers: { Authorization: `Bearer ${accessToken}` } },
          );
          if (!mpRes.ok) {
            return new Response(JSON.stringify({ received: true }), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          }
          const payment: any = await mpRes.json();

          const approved = payment?.status === "approved";
          const orderId: string | null = payment?.external_reference ?? null;
          if (!approved || !orderId) {
            return new Response(JSON.stringify({ received: true }), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          }

          const { data: order } = await supabaseAdmin
            .from("orders")
            .select("id, user_id, plan_slug, status")
            .eq("id", orderId)
            .maybeSingle();

          if (!order || order.status === "paid") {
            return new Response(JSON.stringify({ received: true }), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          }

          await supabaseAdmin
            .from("orders")
            .update({ status: "paid", external_id: String(paymentId) })
            .eq("id", order.id)
            .eq("status", "pending");

          if (order.user_id) {
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 30);
            await supabaseAdmin.from("user_subscriptions").upsert({
              user_id: order.user_id,
              plan_slug: order.plan_slug,
              status: "active",
              expires_at: expiresAt.toISOString(),
              updated_at: new Date().toISOString(),
            });
          }

          return new Response(JSON.stringify({ received: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (err) {
          console.error("Erro no webhook de pagamento");
          return new Response(JSON.stringify({ error: "internal_error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
