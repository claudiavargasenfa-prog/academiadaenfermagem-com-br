import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/api/public/payments")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const payload = await request.json();
          
          // Log do webhook do Mercado Pago ou Genérico
          const provider = payload.provider || (payload.type ? "mercadopago" : "generic");
          
          const { error: logError } = await supabase
            .from("payment_webhooks")
            .insert({
              provider: provider,
              payload: payload,
            });

          if (logError) console.error("Erro ao logar webhook:", logError);

          // Lógica Mercado Pago: O MP envia notificações de diferentes tipos.
          // Geralmente 'payment' ou 'merchant_order'.
          let orderId = payload.order_id || payload.id;
          let status = payload.status || "paid";

          // Se for Mercado Pago genuíno:
          if (payload.action === "payment.created" || payload.type === "payment") {
            const mpId = payload.data?.id || payload.id;
            // Aqui faríamos um fetch na API do MP com o ID para pegar o status real e external_reference
            console.log("Processando pagamento MP:", mpId);
          }

          if (orderId && (status === "paid" || status === "approved")) {
            const { data: order, error: orderError } = await supabase
              .from("orders")
              .update({ status: "paid" })
              .eq("id", orderId)
              .select()
              .single();

            if (orderError) throw orderError;

            // Se o pedido foi pago, atualiza/cria a assinatura do usuário
            if (order) {
              const expiresAt = new Date();
              expiresAt.setDate(expiresAt.getDate() + 30);

              const { error: subError } = await supabase
                .from("user_subscriptions")
                .upsert({
                  user_id: order.user_id!,
                  plan_slug: order.plan_slug,
                  status: "active",
                  expires_at: expiresAt.toISOString(),
                  updated_at: new Date().toISOString(),
                });
              
              if (subError) console.error("Erro ao atualizar assinatura:", subError);
            }
          }

          return new Response(JSON.stringify({ received: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (err: any) {
          console.error("Erro no webhook de pagamento:", err);
          return new Response(JSON.stringify({ error: err.message }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
