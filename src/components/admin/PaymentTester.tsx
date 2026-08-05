import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/AppShell";
import { ExternalLink, CheckCircle2, FlaskConical, AlertTriangle, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export function PaymentTester() {
  const { data: plans, isLoading } = useQuery({
    queryKey: ["subscription_plans_test"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscription_plans")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const categories = [
    { id: 'academico', name: 'Acadêmico', color: 'border-blue-500' },
    { id: 'tecnico', name: 'Técnico', color: 'border-emerald-500' },
    { id: 'enfermeiro', name: 'Enfermeiro', color: 'border-amber-500' },
    { id: 'tecnico-estudante', name: 'Estudante Técnico', color: 'border-purple-500' },
  ];

  if (isLoading) return <p className="p-8 text-center animate-pulse">Carregando planos para teste...</p>;

  return (
    <div className="space-y-6">
      <Card className="bg-amber-50 border-amber-200 p-5 flex items-start gap-4">
        <div className="bg-amber-100 p-2 rounded-xl shrink-0">
          <FlaskConical className="h-6 w-6 text-amber-600" />
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-black text-amber-800 uppercase tracking-tight">Ambiente de Teste de Links</h3>
          <p className="text-xs text-amber-700/80 leading-relaxed">
            Esta página serve para você <strong>validar se os links do Mercado Pago</strong> estão direcionando para os produtos corretos antes de divulgá-los para os alunos.
          </p>
          <div className="flex items-center gap-2 text-[10px] font-bold text-amber-600 uppercase">
            <ShieldCheck className="h-3 w-3" />
            <span>Somente administradores visualizam esta aba</span>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {categories.map(cat => (
          <section key={cat.id} className="space-y-4">
            <div className={`border-l-4 ${cat.color} pl-3 py-1`}>
              <h2 className="text-lg font-black uppercase tracking-tighter">{cat.name}</h2>
              <p className="text-[10px] text-muted-foreground font-bold uppercase">Planos Disponíveis</p>
            </div>

            <div className="space-y-2">
              {plans?.filter(p => p.slug.startsWith(cat.id)).map(plan => (
                <Card key={plan.id} className="p-4 flex items-center justify-between hover:bg-foreground/5 transition-colors border-foreground/5">
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase">{plan.name}</p>
                    <p className="text-[10px] text-muted-foreground font-mono">slug: {plan.slug}</p>
                  </div>

                  {plan.mp_link ? (
                    <a 
                      href={plan.mp_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-700 transition-all shadow-sm"
                    >
                      Testar Link <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <div className="flex items-center gap-1.5 text-red-500 text-[10px] font-black uppercase">
                      <AlertTriangle className="h-3 w-3" />
                      Sem Link
                    </div>
                  )}
                </Card>
              ))}

              {plans?.filter(p => p.slug.startsWith(cat.id)).length === 0 && (
                <p className="text-xs text-muted-foreground italic py-2">Nenhum plano configurado para esta categoria.</p>
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
