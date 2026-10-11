import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { useState, useEffect } from 'react';
import { AppShell } from '@/components/AppShell';
import { Button } from '@/components/ui/button';
import { CreditCard, Loader2, CheckCircle2, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthReady, formatPriceBRL } from '@/lib/access';
import { ANNUAL_PLANS, isAnnualPlan } from '@/lib/annual-plans';
import { createAnnualCheckout } from '@/lib/mercadopago.functions';
import { AuthScreen } from '@/components/AuthGate';
export const Route=createFileRoute('/checkout')({
 validateSearch:(s:Record<string,unknown>)=>({plan:typeof s.plan==='string'?s.plan:'academico',order:typeof s.order==='string'?s.order:undefined,status:typeof s.status==='string'?s.status:undefined,period:typeof s.period==='string'?s.period:undefined}),
 head:()=>({meta:[{title:'Adquirir acesso anual — ADEC'},{name:'description',content:'Pagamento único anual pelo Mercado Pago, com acesso após confirmação.'},{property:'og:title',content:'Adquirir acesso anual — ADEC'},{property:'og:description',content:'365 dias de acesso à academia escolhida.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary'},{name:'robots',content:'noindex, nofollow'}]}),
 component:CheckoutPage,
});
function CheckoutPage(){
 const search=Route.useSearch();
 const base=Object.keys(ANNUAL_PLANS).sort((a,b)=>b.length-a.length).find(k=>search.plan===k||search.plan.startsWith(`${k}-`));
 const {isReady,user}=useAuthReady();const checkout=useServerFn(createAnnualCheckout);const qc=useQueryClient();
 const [busy,setBusy]=useState(false),[error,setError]=useState('');
 const orderQ=useQuery({queryKey:['annual_order',search.order,user?.id],enabled:!!user&&!!search.order,refetchInterval:q=>['paid','rejected','cancelled','refunded','charged_back'].includes(q.state.data?.status??'')?false:5000,queryFn:async()=>{
  if(!search.order||!user)return null;
  const {data,error}=await supabase.from('orders').select('id,status,plan_slug').eq('id',search.order).eq('user_id',user.id).single();if(error)throw error;return data;
 }});
 useEffect(()=>{if(orderQ.data?.status==='paid'){qc.invalidateQueries({queryKey:['my_subs']});qc.invalidateQueries({queryKey:['app_access']});}},[orderQ.data?.status,qc]);
 if(!base||!isAnnualPlan(base))return <AppShell publicRoute><h1 className="font-display text-2xl">Academia indisponível</h1><Button asChild><Link to="/adec">Escolher academia</Link></Button></AppShell>;
 if(!isReady)return <AppShell publicRoute><Loader2 className="animate-spin"/></AppShell>;
 const plan=ANNUAL_PLANS[base];
 const paid=orderQ.data?.status==='paid';
 async function pay(){setBusy(true);setError('');try{const result=await checkout({data:{plan:base??''}});window.location.assign(result.url);}catch(e){setError(e instanceof Error?e.message:'Não foi possível abrir o pagamento.');}finally{setBusy(false);}}
 return <AppShell publicRoute hideReferences><main className="mx-auto max-w-xl py-8">
 <Button asChild variant="ghost"><Link to="/adec">Voltar às academias</Link></Button>
 <h1 className="mt-6 font-display text-3xl font-bold">{plan.name}</h1>
 <p className="mt-4 text-4xl font-bold text-primary">{formatPriceBRL(plan.cents)}<span className="ml-2 text-base text-muted-foreground">/ano</span></p>
 <p className="mt-3 text-muted-foreground">Pagamento único · 365 dias de acesso · Sem renovação automática</p>
 {!user?<div className="mt-8"><p className="mb-4">Entre ou crie sua conta para vincular o acesso à sua compra.</p><AuthScreen/></div>:<div className="mt-8 space-y-4">
 {paid?<><CheckCircle2 className="h-8 w-8 text-primary"/><h2 className="text-xl font-bold">Pagamento confirmado. Acesso liberado!</h2><Button asChild><Link to="/trilha/$slug" params={{slug:orderQ.data?.plan_slug??base}}>Acessar minha academia</Link></Button></>:<>
 {search.order&&<div className="border-l-2 border-primary pl-4"><p>{orderQ.isError?'Não foi possível consultar o pedido. Tente atualizar.':['rejected','cancelled'].includes(orderQ.data?.status??'')?'Pagamento não aprovado. Você pode tentar novamente.':['refunded','charged_back'].includes(orderQ.data?.status??'')?'Pagamento estornado ou contestado.':'Aguardando confirmação do Mercado Pago. O retorno à página não confirma o pagamento.'}</p><Button variant="outline" onClick={()=>orderQ.refetch()}><RefreshCw className="h-4 w-4"/>Atualizar situação</Button></div>}
 {error&&<p role="alert" className="text-destructive">{error}</p>}
 <Button disabled={busy||Boolean(search.order&&orderQ.data?.status==='pending')} onClick={pay} className="w-full">{busy?<Loader2 className="h-4 w-4 animate-spin"/>:<CreditCard className="h-4 w-4"/>}Adquirir pelo Mercado Pago</Button>
 <p className="text-sm text-muted-foreground">O acesso será liberado após a aprovação do pagamento. Pix e cartão conforme disponibilidade no Mercado Pago.</p></>}
 </div>}
 </main></AppShell>;
}
