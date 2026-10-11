import { createFileRoute } from '@tanstack/react-router';
import { verifyMpSignature } from '@/lib/mp-signature';
import { validAnnualPayment } from '@/lib/annual-plans';

export const Route = createFileRoute('/api/public/payments')({server:{handlers:{POST:async({request})=>{
 const secret=process.env['MP_WEBHOOK_SECRET'],token=process.env['MP_ACCESS_TOKEN'];
 if (!secret || !token) return Response.json({error:'configuration_pending'},{status:503});
 try {
  const url=new URL(request.url);
  const payload = await request.json() as {data?:{id?:string|number};type?:string};
  const signatureId=url.searchParams.get('data.id') ?? '';
  if (!verifyMpSignature(secret,request.headers.get('x-signature'),request.headers.get('x-request-id'),signatureId)) return Response.json({error:'unauthorized'},{status:401});
  const id=String(payload.data?.id ?? signatureId);
  if (id!==signatureId || !/^\d+$/.test(id)) return Response.json({error:'invalid_payment'},{status:400});
  if (payload.type && payload.type!=='payment') return Response.json({received:true});
  const headers={Authorization:`Bearer ${token}`};
  const [payRes,meRes]=await Promise.all([fetch(`https://api.mercadopago.com/v1/payments/${id}`,{headers}),fetch('https://api.mercadopago.com/users/me',{headers})]);
  if (!payRes.ok || !meRes.ok) return Response.json({error:'verification_unavailable'},{status:503});
  const payment=await payRes.json() as {id:number;status:string;external_reference:string;transaction_amount:number;currency_id:string;collector_id:number;date_approved:string|null;transaction_amount_refunded?:number};
  const me=await meRes.json() as {id:number};
  if (!payment.external_reference) return Response.json({received:true});
  const {supabaseAdmin}=await import('@/integrations/supabase/client.server');
  const {data:order,error}=await supabaseAdmin.from('orders').select('id,amount_cents,metadata').eq('id',payment.external_reference).maybeSingle();
  if (error) return Response.json({error:'order_read_failed'},{status:503});
  if (!order) return Response.json({received:true});
  if (!validAnnualPayment(payment,order,me.id) || String(payment.id)!==id) return Response.json({error:'payment_mismatch'},{status:400});
  if ((order.metadata as {type?:string}|null)?.type!=='annual_membership') return Response.json({error:'legacy_order_requires_review'},{status:409});
  if (payment.status==='refunded' && (payment.transaction_amount_refunded ?? 0)<payment.transaction_amount) return Response.json({error:'partial_refund_requires_review'},{status:409});
  const {error:processError}=await supabaseAdmin.rpc('process_annual_payment',{_order_id:order.id,_payment_id:id,_status:payment.status,_amount_cents:Math.round(payment.transaction_amount*100),_approved_at:payment.date_approved ?? new Date().toISOString()});
  if (processError) {console.error('Falha na concessão transacional',processError.code);return Response.json({error:'processing_failed'},{status:503});}
  await supabaseAdmin.from('payment_webhooks').insert({provider:'mercadopago',payload:{payment_id:id,status:payment.status,order_id:order.id},processed:true});
  return Response.json({received:true});
 } catch { return Response.json({error:'processing_failed'},{status:503}); }
}}}});
