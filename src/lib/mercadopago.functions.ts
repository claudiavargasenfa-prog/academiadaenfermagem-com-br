import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { ANNUAL_PLANS, isAnnualPlan } from './annual-plans';

export const createAnnualCheckout = createServerFn({ method: 'POST' })
 .middleware([requireSupabaseAuth])
 .inputValidator((input: unknown) => z.object({ plan: z.string() }).parse(input))
 .handler(async ({ data, context }) => {
  if (!isAnnualPlan(data.plan)) throw new Error('Academia indisponível para compra anual.');
  const token = process.env['MP_ACCESS_TOKEN'];
  if (!token || !process.env['MP_WEBHOOK_SECRET']) throw new Error('Pagamento temporariamente indisponível. A configuração de confirmação está pendente.');
  const { data: offer, error: offerError } = await context.supabase.from('plan_offers').select('price_cents,period_days').eq('plan_slug',data.plan).eq('billing_period','anual').eq('is_active',true).single();
  if (offerError || !offer || offer.period_days !== 365 || offer.price_cents !== ANNUAL_PLANS[data.plan].cents) throw new Error('Oferta anual indisponível.');
  const { data: orderId, error } = await context.supabase.rpc('create_annual_order',{_plan_slug:data.plan});
  if (error || !orderId) throw new Error('Não foi possível registrar seu pedido.');
  const site = 'https://academiadaenfermagem.com.br';
  const back = `${site}/checkout?plan=${encodeURIComponent(data.plan)}&order=${orderId}`;
  const response = await fetch('https://api.mercadopago.com/checkout/preferences',{
   method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json','X-Idempotency-Key':orderId},
   body:JSON.stringify({items:[{id:orderId,title:`${ANNUAL_PLANS[data.plan].name} — acesso anual`,quantity:1,unit_price:offer.price_cents/100,currency_id:'BRL'}],external_reference:orderId,metadata:{order_id:orderId},back_urls:{success:`${back}&status=success`,failure:`${back}&status=failure`,pending:`${back}&status=pending`},auto_return:'approved',notification_url:`${site}/api/public/payments`})
  });
  if (!response.ok) { console.error('Falha Mercado Pago ao criar checkout',response.status); throw new Error('Não foi possível abrir o Mercado Pago. Tente novamente.'); }
  const preference = await response.json() as {init_point?:string};
  if (!preference.init_point || !new URL(preference.init_point).hostname.endsWith('.mercadopago.com.br')) throw new Error('Endereço de pagamento inválido.');
  return {orderId,url:preference.init_point};
 });
