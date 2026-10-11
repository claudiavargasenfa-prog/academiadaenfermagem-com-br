import {Link} from '@tanstack/react-router';
import {Button} from '@/components/ui/button';
import {ANNUAL_PLANS} from '@/lib/annual-plans';
import {formatPriceBRL} from '@/lib/access';
export default function ComparativoUpgrade(){return <section className="mt-8 border-t border-border py-6"><h2 className="font-display text-xl font-bold">Academias — acesso anual</h2><div className="mt-4 grid gap-4 sm:grid-cols-2">{Object.entries(ANNUAL_PLANS).map(([slug,plan])=><article key={slug} className="rounded-lg border border-border p-4"><h3 className="font-bold">{plan.name}</h3><p className="my-3 text-xl font-bold text-primary">{formatPriceBRL(plan.cents)}/ano</p><Button asChild><Link to="/checkout" search={{plan:slug,period:'anual'}}>Adquirir</Link></Button></article>)}</div></section>;}
