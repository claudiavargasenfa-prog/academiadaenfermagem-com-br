import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { CreditCard } from 'lucide-react';
import { ANNUAL_PLANS,isAnnualPlan } from '@/lib/annual-plans';
import {formatPriceBRL} from '@/lib/access';
export default function OfertasPeriodo({slug,subscribed}:{slug:string;isLoggedIn:boolean;subscribed:boolean}){
 if(!isAnnualPlan(slug))return null;
 return <section className="mt-10 border-t border-border py-6"><h2 className="font-display text-xl font-bold">Acesso anual</h2><p className="mt-3 text-3xl font-bold text-primary">{formatPriceBRL(ANNUAL_PLANS[slug].cents)}<span className="ml-2 text-sm text-muted-foreground">/ano</span></p><p className="my-4 text-muted-foreground">365 dias na academia escolhida. Pagamento único, sem renovação automática.</p><Button asChild><Link to="/checkout" search={{plan:slug,period:'anual'}}><CreditCard className="h-4 w-4"/>{subscribed?'Renovar acesso anual':'Adquirir acesso anual'}</Link></Button></section>;
}
