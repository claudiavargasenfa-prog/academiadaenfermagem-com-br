import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/AppShell";
import { ExternalLink, FlaskConical, AlertTriangle, ShieldCheck } from "lucide-react";

type Period = "mensal" | "trimestral" | "semestral" | "anual";

const PERIOD_LABEL: Record<Period, string> = {
  mensal: "Mensal",
  trimestral: "Trimestral",
  semestral: "Semestral",
  anual: "Anual",
};

const PERIOD_ORDER: Period[] = ["mensal", "trimestral", "semestral", "anual"];

type Category = {
  id: string;
  name: string;
  base: string;
  color: string;
  /** slug de cada período — links NÃO são alterados, só organizados */
  slugs: Record<Period, string>;
};

const CATEGORIES: Category[] = [
  {
    id: "academico",
    name: "Acadêmico",
    base: "Academia do Acadêmico",
    color: "border-blue-500",
    slugs: {
      mensal: "academico",
      trimestral: "academico-trimestral",
      semestral: "academico-semestral",
      anual: "academico-anual",
    },
  },
  {
    id: "enfermeiro",
    name: "Enfermeiro",
    base: "Academia do Enfermeiro",
    color: "border-amber-500",
    slugs: {
      mensal: "enfermeiro",
      trimestral: "enfermeiro-trimestral",
      semestral: "enfermeiro-semestral",
      anual: "enfermeiro-anual",
    },
  },
  {
    id: "tecnico",
    name: "Técnico",
    base: "Academia do Técnico",
    color: "border-emerald-500",
    slugs: {
      mensal: "tecnico",
      trimestral: "tecnico-trimestral-v2",
      semestral: "tecnico-semestral-v2",
      anual: "tecnico-anual-v2",
    },
  },
  {
    id: "tecnico-estudante",
    name: "Estudante de Técnico em Enfermagem",
    base: "Academia do Estudante de Técnico",
    color: "border-purple-500",
    slugs: {
      mensal: "tecnico-estudante",
      trimestral: "tecnico-trimestral",
      semestral: "tecnico-semestral",
      anual: "tecnico-estudante-anual",
    },
  },
];

export function PaymentTester() {
  const { data: plans, isLoading } = useQuery({
    queryKey: ["subscription_plans_test"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscription_plans")
        .select("*")
        .eq("is_active", true);

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <p className="p-8 text-center animate-pulse">Carregando planos para teste...</p>;

  const bySlug = new Map((plans ?? []).map((p: any) => [p.slug, p]));

  const renderSection = (cat: Category) => (
    <section key={cat.id} className="space-y-4">
      <div className={`border-l-4 ${cat.color} pl-3 py-1`}>
        <h2 className="text-lg font-black uppercase tracking-tighter">{cat.name}</h2>
        <p className="text-[10px] text-muted-foreground font-bold uppercase">Planos Disponíveis</p>
      </div>

      <div className="space-y-2">
        {PERIOD_ORDER.map((period) => {
          const slug = cat.slugs[period];
          const plan: any = bySlug.get(slug);
          if (!plan) return null;

          return (
            <Card
              key={slug}
              className="p-4 flex items-center justify-between hover:bg-foreground/5 transition-colors border-foreground/5"
            >
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase">
                  {cat.base} ({PERIOD_LABEL[period]})
                </p>
                <p className="text-[10px] text-muted-foreground font-mono">slug: {plan.slug}</p>
              </div>

              {plan.mp_link ? (
                <a
                  href={plan.mp_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-700 transition-all shadow-sm shrink-0"
                >
                  Testar Link <ExternalLink className="h-3 w-3" />
                </a>
              ) : (
                <div className="flex items-center gap-1.5 text-red-500 text-[10px] font-black uppercase shrink-0">
                  <AlertTriangle className="h-3 w-3" />
                  Sem Link
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </section>
  );

  const [academico, enfermeiro, tecnico, estudante] = CATEGORIES;

  return (
    <div className="space-y-6">
      <Card className="bg-amber-50 border-amber-200 p-5 flex items-start gap-4">
        <div className="bg-amber-100 p-2 rounded-xl shrink-0">
          <FlaskConical className="h-6 w-6 text-amber-600" />
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-black text-amber-800 uppercase tracking-tight">Ambiente de Teste de Links</h3>
          <p className="text-xs text-amber-700/80 leading-relaxed">
            Esta página serve para você <strong>validar se os links do Mercado Pago</strong> estão direcionando para os
            produtos corretos antes de divulgá-los para os alunos.
          </p>
          <div className="flex items-center gap-2 text-[10px] font-bold text-amber-600 uppercase">
            <ShieldCheck className="h-3 w-3" />
            <span>Somente administradores visualizam esta aba</span>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="flex flex-col gap-[2cm]">
          {renderSection(academico)}
          {renderSection(enfermeiro)}
        </div>
        <div className="flex flex-col gap-[2cm]">
          {renderSection(tecnico)}
          {renderSection(estudante)}
        </div>
      </div>
    </div>
  );
}
