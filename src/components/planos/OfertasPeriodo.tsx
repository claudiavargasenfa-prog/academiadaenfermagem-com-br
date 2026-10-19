import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { CreditCard } from 'lucide-react';
import { ANNUAL_PLANS,isAnnualPlan } from '@/lib/annual-plans';
import {formatPriceBRL} from '@/lib/access';

export default function OfertasPeriodo({slug,subscribed}:{slug:string;isLoggedIn:boolean;subscribed:boolean}){
  if(!isAnnualPlan(slug))return null;

  const price = ANNUAL_PLANS[slug].cents;

  return (
    <section className="mt-10 border-t border-border py-6">
      <h2 className="font-display text-xl font-bold">Acesso anual</h2>
      <p className="mt-3 text-3xl font-bold text-primary">
        Adquira todo o conteúdo por apenas {formatPriceBRL(price)} por ano
      </p>
    </section>
  );
}
