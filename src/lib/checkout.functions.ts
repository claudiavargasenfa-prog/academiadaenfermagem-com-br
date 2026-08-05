import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

export const createOrder = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z
      .object({
        planSlug: z.string(),
        amountCents: z.number(),
        paymentMethod: z.enum(["pix", "credit_card"]),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;

    if (!user) {
      throw new Error("Unauthorized");
    }

    // No Mercado Pago, o external_reference é usado para identificar o pedido no nosso banco.
    const orderData = {
      user_id: user.id,
      plan_slug: data.planSlug,
      amount_cents: data.amountCents,
      payment_method: data.paymentMethod,
      status: "pending",
      external_id: `mp_${Math.random().toString(36).substring(2, 9)}`, // Simulado para o MP
      pix_copy_paste:
        data.paymentMethod === "pix"
          ? "00020126580014BR.GOV.BCB.PIX0136ADEC-PIX-KEY-FAKE-1234-5678-90125204000053039865405" +
            (data.amountCents / 100).toFixed(2).replace(".", "") +
            "5802BR5913ACADEMIA ENF6009SAO PAULO62070503***6304"
          : null,
      pix_qr_code:
        data.paymentMethod === "pix"
          ? "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=PIX-FAKE-PAYMENT"
          : null,
      metadata: { 
        simulated: true,
        full_name: user.user_metadata?.full_name,
        email: user.email 
      },
    };

    const { data: order, error } = await supabase
      .from("orders")
      .insert(orderData)
      .select("*")
      .single();

    if (error) throw error;
    return order;
  });

export const getOrderStatus = createServerFn({ method: "GET" })
  .inputValidator((data) => z.object({ orderId: z.string() }).parse(data))
  .handler(async ({ data }) => {
    const { data: order, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", data.orderId)
      .single();

    if (error) throw error;
    return order;
  });
