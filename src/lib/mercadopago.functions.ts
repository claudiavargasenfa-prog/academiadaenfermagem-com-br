import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const createMpPreference = createServerFn({ method: "POST" })
  .inputValidator((data) => 
    z.object({
      orderId: z.string(),
      title: z.string(),
      amount: z.number(),
      email: z.string(),
    }).parse(data)
  )
  .handler(async ({ data }) => {
    const accessToken = process.env['MP_ACCESS_TOKEN'];
    if (!accessToken) {
      throw new Error("MP_ACCESS_TOKEN não configurado no servidor.");
    }

    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: [
          {
            id: data.orderId,
            title: data.title,
            quantity: 1,
            unit_price: data.amount,
            currency_id: "BRL",
          },
        ],
        payer: {
          email: data.email,
        },
        external_reference: data.orderId,
        back_urls: {
          success: `${process.env['SITE_URL'] || 'https://academiadaenfermagem.com.br'}/minha-conta?status=success`,
          failure: `${process.env['SITE_URL'] || 'https://academiadaenfermagem.com.br'}/minha-conta?status=failure`,
          pending: `${process.env['SITE_URL'] || 'https://academiadaenfermagem.com.br'}/minha-conta?status=pending`,
        },
        auto_return: "approved",
        notification_url: `${process.env['SITE_URL'] || 'https://academiadaenfermagem.com.br'}/api/public/payments`,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro detalhado do Mercado Pago:", JSON.stringify(errorData, null, 2));
      throw new Error(`Erro MP (${response.status}): ${errorData.message || "Falha ao criar preferência."}`);
    }

    const preference = await response.json();
    console.log("Preferência criada com sucesso:", preference.id);
    return { 
      init_point: preference.init_point,
      sandbox_init_point: preference.sandbox_init_point
    };
  });
