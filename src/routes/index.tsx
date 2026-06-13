import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Stethoscope,
  Calculator,
  Activity,
  ClipboardList,
  Target,
  NotebookPen,
  TrendingUp,
} from "lucide-react";
import { AppShell, Card, PageHeader } from "@/components/AppShell";
import { useLocal } from "@/lib/storage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Início — Acadêmico de Bolso" },
      {
        name: "description",
        content: "Painel do estágio com progresso PDCA e atalhos para procedimentos.",
      },
    ],
  }),
  component: Dashboard,
});

const shortcuts = [
  { to: "/procedimentos", label: "Procedimentos", icon: Stethoscope, hint: "Cefalocaudal & checklist" },
  { to: "/calculadora", label: "Cálculo de Medicamentos", icon: Calculator, hint: "Regra de três, gotejamento" },
  { to: "/sinais-vitais", label: "SV Adulto", icon: Activity, hint: "PA, FC, FR, SatO₂, T°" },
  { to: "/sv-pediatrico", label: "SV Pediátrico", icon: Activity, hint: "Por faixa etária + PALS" },
  { to: "/sv-gestante", label: "SV Gestante", icon: Activity, hint: "Pré-eclâmpsia, hemorragia" },
  { to: "/escalas", label: "Escalas Clínicas", icon: ClipboardList, hint: "Glasgow, Braden, NIHSS" },
  { to: "/pdca", label: "PDCA & ODS 3", icon: Target, hint: "Planejamento do ciclo" },
  { to: "/diario", label: "Diário de Bordo", icon: NotebookPen, hint: "Anotações + PDF ABNT" },
] as const;

function Dashboard() {
  const [pdca] = useLocal("pdca-state", { p: "", d: "", c: "", a: "" });
  const filled = (["p", "d", "c", "a"] as const).filter((k) => (pdca[k] || "").trim().length > 20).length;
  const progress = (filled / 4) * 100;

  const [diario] = useLocal<{ id: string; data: string; texto: string }[]>("diario-entries", []);
  const [estagio] = useLocal("estagio-info", { campo: "", preceptor: "", periodo: "" });

  return (
    <AppShell>
      <PageHeader
        eyebrow="Bem-vindo(a)"
        title="Seu estágio, em um só lugar."
        description="Reúna referências clínicas, calcule doses com segurança e acompanhe seu Ciclo PDCA do início ao fim."
      />

      <section className="mb-6 grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                Ciclo PDCA
              </p>
              <h2 className="mt-1 font-display text-2xl font-bold">Progresso do estágio</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {filled} de 4 fases preenchidas com profundidade.
              </p>
            </div>
            <div className="grid h-12 w-12 place-items-center rounded-2xl surface-gradient">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full surface-gradient transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2 text-center text-[11px] font-medium">
            {(["P", "D", "C", "A"] as const).map((l, i) => (
              <div
                key={l}
                className={`rounded-lg py-1.5 ${
                  i < filled ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                }`}
              >
                {l}
              </div>
            ))}
          </div>
          <Link
            to="/pdca"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            Continuar planejamento →
          </Link>
        </Card>

        <Card>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Identificação
          </p>
          <h3 className="mt-1 font-display text-lg font-bold">Meu estágio</h3>
          <dl className="mt-3 space-y-2 text-sm">
            <div>
              <dt className="text-muted-foreground">Campo</dt>
              <dd className="font-medium">{estagio.campo || "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Preceptor(a)</dt>
              <dd className="font-medium">{estagio.preceptor || "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Período</dt>
              <dd className="font-medium">{estagio.periodo || "—"}</dd>
            </div>
          </dl>
          <Link
            to="/pdca"
            className="mt-3 inline-block text-sm font-semibold text-primary hover:underline"
          >
            Editar dados
          </Link>
        </Card>
      </section>

      <section>
        <h2 className="mb-3 font-display text-xl font-bold">Atalhos rápidos</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {shortcuts.map((s) => {
            const Icon = s.icon;
            return (
              <Link
                key={s.to}
                to={s.to}
                className="group glass rounded-2xl p-4 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow)]"
              >
                <div className="grid h-11 w-11 place-items-center rounded-xl surface-gradient">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mt-3 font-display text-base font-bold text-foreground">{s.label}</p>
                <p className="text-xs text-muted-foreground">{s.hint}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-8">
        <Card>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                Diário de bordo
              </p>
              <h3 className="mt-1 font-display text-lg font-bold">
                {diario.length} {diario.length === 1 ? "registro" : "registros"}
              </h3>
              <p className="text-sm text-muted-foreground">
                Documente cada plantão e exporte tudo em PDF formatado em ABNT.
              </p>
            </div>
            <Link
              to="/diario"
              className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              Abrir
            </Link>
          </div>
        </Card>
      </section>
    </AppShell>
  );
}
