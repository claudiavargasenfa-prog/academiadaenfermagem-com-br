import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/api/public/payments")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const payload = await request.json();
          
          // Log do webhook
          const { error: logError } = await supabase
            .from("payment_webhooks")
            .insert({
              provider: payload.provider || "generic",
              payload: payload,
            });

          if (logError) console.error("Erro ao logar webhook:", logError);

          // Lógica de atualização de pedido para o MVP
          // Em produção, isso verificaria a assinatura do webhook (Stripe/MP)
          const orderId = payload.order_id || payload.id;
          const status = payload.status || "paid";

          if (orderId && status === "paid") {
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
              expiresAt.setDate(expiresAt.getDate() + 30); // 30 dias

              const { error: subError } = await supabase
                .from("user_subscriptions")
                .upsert({
                  user_id: order.user_id!,
                  plan_slug: order.plan_slug,
                  status: "active",
                  expires_at: expiresAt.toISOString(),
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
