import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Stethoscope,
  Calculator,
  Activity,
  NotebookPen,
  Baby,
  HeartPulse,
  ShieldCheck,
  HandHeart,
  GraduationCap,
  FileText,
} from "lucide-react";
import { AppShell, Card, PageHeader } from "@/components/AppShell";
import { useLocal } from "@/lib/storage";
import logoAsset from "@/assets/logo.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Início — Acadêmico de Bolso" },
      {
        name: "description",
        content: "Caderno de estágio interativo: IRAS, Segurança do Paciente, escalas e cálculos.",
      },
    ],
  }),
  component: Dashboard,
});

const shortcuts = [
  { to: "/postura-etica", label: "Postura e Ética Profissional", icon: GraduationCap, hint: "Manual de conduta no estágio" },
  { to: "/iras", label: "Time Contra as IRAS", icon: HandHeart, hint: "5 Momentos da OMS" },
  { to: "/seguranca", label: "Segurança do Paciente", icon: ShieldCheck, hint: "6 Metas Internacionais" },
  { to: "/exame-fisico-escalas", label: "Exame Físico e Escalas de Avaliação", icon: Stethoscope, hint: "Cefalocaudal + Glasgow, Braden, Morse..." },
  { to: "/calculadora", label: "Cálculos de Medicamentos", icon: Calculator, hint: "Regra de três, gotejamento, dose/peso" },
  { to: "/sinais-vitais", label: "Sinais Vitais", icon: Activity, hint: "PA, FC, FR, SatO₂, T°" },
  { to: "/sv-pediatrico", label: "Sinais Vitais Pediátricos", icon: Baby, hint: "Por faixa etária + PALS + dor" },
  { to: "/sv-gestante", label: "Sinais Vitais Gestante", icon: HeartPulse, hint: "Pré-eclâmpsia, hemorragia" },
  { to: "/diario", label: "Diário de Bordo", icon: NotebookPen, hint: "Anotações de plantão" },
  { to: "/relatorio-abnt", label: "Relatório de Estágio (ABNT)", icon: FileText, hint: "Gerar relatório automático" },
] as const;


function Dashboard() {
  const [diario] = useLocal<{ id: string; data: string; texto: string }[]>("diario-entries", []);
  const [estagio] = useLocal("estagio-info", { campo: "", preceptor: "", periodo: "" });

  return (
    <AppShell>
      <PageHeader
        eyebrow="Bem-vindo(a)"
        title="Seu estágio, em um só lugar."
        description="Reúna referências clínicas, calcule doses com segurança e fortaleça sua prática como acadêmico(a) de enfermagem."
      />

      <section className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="overflow-hidden rounded-3xl border border-gold/40 bg-primary p-5 text-primary-foreground shadow-[var(--shadow-glass)] md:col-span-2">
          <div className="flex items-start gap-4">
            <img
              src={logoAsset.url}
              alt="Logotipo Acadêmico de Bolso"
              className="h-16 w-16 shrink-0 rounded-2xl bg-white/10 object-contain p-1 ring-1 ring-gold/40"

            />
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-gold">
                Acadêmico de Bolso
              </p>
              <h2 className="font-display text-xl font-extrabold leading-tight">
                Conhecimento que cabe no <span className="text-gold">bolso do jaleco</span>.
              </h2>
              <p className="mt-2 text-sm text-primary-foreground/80">
                Faça login e tenha acesso a todo o conteúdo — tudo salvo no seu app, mesmo offline.
              </p>

            </div>
          </div>
        </div>

        <Card>
          <p className="text-xs font-semibold uppercase tracking-widest text-gold">
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
            to="/diario"
            className="mt-3 inline-block text-sm font-semibold text-primary hover:underline"
          >
            Editar no Diário
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
                <div className="grid h-11 w-11 place-items-center rounded-xl gold-gradient">
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
              <p className="text-xs font-semibold uppercase tracking-widest text-gold">
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
