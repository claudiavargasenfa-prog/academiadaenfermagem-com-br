import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Lock,
  CheckCircle2,
  Clock,
  ExternalLink,
  Sparkles,
  ChevronLeft,
  ChevronRight,
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
  BookOpen,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { AppShell, Card, PageHeader } from "@/components/AppShell";
import { useLocal } from "@/lib/storage";
import logoAsset from "@/assets/logo.png.asset.json";
import {
  fetchMiniApps,
  fetchMyBasicSubscription,
  fetchMyExtraAccess,
  formatPriceBRL,
  daysUntil,
  summarizeAccess,
  type MiniApp,
} from "@/lib/access";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Loja — Academia de Enfermagem" },
      {
        name: "description",
        content:
          "Loja do app Academia de Enfermagem: assinatura básica e mini apps extras para o estágio.",
      },
    ],
  }),
  component: StoreHome,
});

// Mapa de slug → ícone + rota interna do mini app (quando liberado)
const SLUG_META: Record<string, { icon: typeof Stethoscope; to: string }> = {
  basico:                 { icon: BookOpen,       to: "/postura-etica" },
  "postura-etica":        { icon: GraduationCap,  to: "/postura-etica" },
  diario:                 { icon: NotebookPen,    to: "/diario" },
  "sinais-vitais":        { icon: Activity,       to: "/sinais-vitais" },
  iras:                   { icon: HandHeart,      to: "/iras" },
  seguranca:              { icon: ShieldCheck,    to: "/seguranca" },
  "exame-fisico-escalas": { icon: Stethoscope,    to: "/exame-fisico-escalas" },
  calculadora:            { icon: Calculator,     to: "/calculadora" },
  "sv-pediatrico":        { icon: Baby,           to: "/sv-pediatrico" },
  "sv-gestante":          { icon: HeartPulse,     to: "/sv-gestante" },
  "relatorio-abnt":       { icon: FileText,       to: "/relatorio-abnt" },
};

const BASICO_DISPLAY_NAME = "Manual de Sobrevivência: Postura, Ética e Segurança";

// Carrossel — 5 slides promocionais (inclui o conteúdo gratuito)
const SLIDES = [
  {
    eyebrow: "Grátis para começar",
    title: "Postura, Ética e Sinais Vitais",
    desc: "Conteúdo essencial liberado já na assinatura básica.",
    bg: "from-emerald-600 to-emerald-800",
  },
  {
    eyebrow: "Mais vendido",
    title: "Cálculos de Medicamentos",
    desc: "Regra de três, gotejamento e dose/peso, com checagem de segurança.",
    bg: "from-amber-500 to-amber-700",
  },
  {
    eyebrow: "Lançamento",
    title: "Relatório de Estágio (ABNT)",
    desc: "Gera automaticamente a partir do seu Diário de Bordo.",
    bg: "from-indigo-600 to-indigo-800",
  },
  {
    eyebrow: "Combo clínico",
    title: "Exame Físico + Escalas",
    desc: "Cefalocaudal + Glasgow, Braden, Morse e mais — em um só lugar.",
    bg: "from-rose-600 to-rose-800",
  },
  {
    eyebrow: "Segurança do paciente",
    title: "IRAS + 6 Metas Internacionais",
    desc: "Higienização das mãos e protocolos visuais para o plantão.",
    bg: "from-sky-600 to-sky-800",
  },
] as const;

function Carousel() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((x) => (x + 1) % SLIDES.length), 5000);
    return () => clearInterval(id);
  }, []);
  const slide = SLIDES[i];
  return (
    <section className="mb-6">
      <div
        className={`relative overflow-hidden rounded-3xl border border-gold/40 bg-gradient-to-br ${slide.bg} p-6 text-white shadow-[var(--shadow-glass)] transition-all`}
      >
        <p className="text-[11px] font-bold uppercase tracking-widest text-gold">
          {slide.eyebrow}
        </p>
        <h2 className="mt-1 font-display text-2xl font-extrabold leading-tight md:text-3xl">
          {slide.title}
        </h2>
        <p className="mt-2 max-w-xl text-sm text-white/85">{slide.desc}</p>

        <div className="mt-4 flex items-center gap-3">
          <button
            aria-label="Slide anterior"
            onClick={() => setI((x) => (x - 1 + SLIDES.length) % SLIDES.length)}
            className="grid h-9 w-9 place-items-center rounded-full bg-white/15 hover:bg-white/25"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex gap-1.5">
            {SLIDES.map((_, n) => (
              <button
                key={n}
                aria-label={`Ir ao slide ${n + 1}`}
                onClick={() => setI(n)}
                className={`h-2 rounded-full transition-all ${
                  n === i ? "w-6 bg-gold" : "w-2 bg-white/40"
                }`}
              />
            ))}
          </div>
          <button
            aria-label="Próximo slide"
            onClick={() => setI((x) => (x + 1) % SLIDES.length)}
            className="grid h-9 w-9 place-items-center rounded-full bg-white/15 hover:bg-white/25"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

function StoreHome() {
  const [estagio] = useLocal("estagio-info", { campo: "", preceptor: "", periodo: "" });

  const appsQ = useQuery({ queryKey: ["mini_apps"], queryFn: fetchMiniApps });
  const subQ = useQuery({ queryKey: ["my_basic_sub"], queryFn: fetchMyBasicSubscription });
  const extrasQ = useQuery({ queryKey: ["my_extras"], queryFn: fetchMyExtraAccess });

  const loading = appsQ.isLoading || subQ.isLoading || extrasQ.isLoading;
  const apps = appsQ.data ?? [];
  const access = summarizeAccess(subQ.data ?? null, extrasQ.data ?? []);
  const basico = apps.find((a) => a.kind === "basico");
  const extras = apps.filter((a) => a.kind === "extra");

  return (
    <AppShell>
      <PageHeader
        eyebrow="Loja"
        title="Academia de Enfermagem"
        description="Assine o Manual de Sobrevivência e adicione mini apps extras conforme precisar."
      />

      <Carousel />

      <section className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="overflow-hidden rounded-3xl border border-gold/40 bg-primary p-5 text-primary-foreground shadow-[var(--shadow-glass)] md:col-span-2">
          <div className="flex items-start gap-4">
            <img
              src={logoAsset.url}
              alt="Logotipo Academia de Enfermagem"
              className="h-16 w-16 shrink-0 rounded-2xl bg-white/10 object-contain p-1 ring-1 ring-gold/40"
            />
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-gold">
                Academia de Enfermagem
              </p>
              <h2 className="font-display text-xl font-extrabold leading-tight">
                Conhecimento que cabe no <span className="text-gold">bolso do jaleco</span>.
              </h2>
              <p className="mt-2 text-sm text-primary-foreground/80">
                Compre uma vez e tenha o conteúdo offline no seu app.
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
            to={access.basicActive ? "/diario" : "/"}
            className="mt-3 inline-block text-sm font-semibold text-primary hover:underline"
          >
            {access.basicActive ? "Editar no Diário" : "Assine para editar"}
          </Link>
        </Card>
      </section>

      {loading && (
        <Card>
          <p className="text-sm text-muted-foreground">Carregando catálogo…</p>
        </Card>
      )}

      {!loading && apps.length === 0 && (
        <Card>
          <p className="text-sm text-muted-foreground">
            Nenhum mini app cadastrado ainda. Cadastre os apps no painel admin para vê-los aqui.
          </p>
        </Card>
      )}

      {basico && (
        <section className="mb-8">
          <h2 className="mb-3 font-display text-lg font-bold">Assinatura básica</h2>
          <ProductCard
            app={basico}
            basicActive={access.basicActive}
            basicEndsAt={access.basicEndsAt}
          />
        </section>
      )}

      {extras.length > 0 && (
        <section>
          <h2 className="mb-3 font-display text-lg font-bold">Mini apps extras</h2>
          {!access.basicActive && (
            <Card className="mb-3 border-gold/40">
              <p className="text-sm">
                <Sparkles className="mr-1 inline h-4 w-4 text-gold" />
                Para usar os extras você precisa do <strong>Manual de Sobrevivência</strong> ativo.
              </p>
            </Card>
          )}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {extras.map((app) => (
              <ProductCard
                key={app.id}
                app={app}
                basicActive={access.basicActive}
                extraExpiresAt={access.extraAccessByApp[app.id] ?? null}
              />
            ))}
          </div>
        </section>
      )}
    </AppShell>
  );
}

function ProductCard({
  app,
  basicActive,
  basicEndsAt,
  extraExpiresAt,
}: {
  app: MiniApp;
  basicActive: boolean;
  basicEndsAt?: string | null;
  extraExpiresAt?: string | null;
}) {
  const isBasico = app.kind === "basico";
  const unlocked = isBasico ? basicActive : basicActive && !!extraExpiresAt;
  const daysLeft = daysUntil(isBasico ? basicEndsAt ?? null : extraExpiresAt ?? null);
  const meta = SLUG_META[app.slug] ?? { icon: BookOpen, to: "/" as const };
  const Icon = meta.icon;
  const displayName = isBasico ? BASICO_DISPLAY_NAME : app.name;

  // Preço "de" (sugerido) = 40% acima do preço atual, para destacar desconto
  const fromCents = Math.round(app.price_cents * 1.4);
  const hasDiscount = fromCents > app.price_cents;

  return (
    <div className="glass flex flex-col rounded-2xl p-4">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="grid h-11 w-11 place-items-center rounded-xl gold-gradient">
          <Icon className="h-5 w-5" />
        </div>
        {unlocked ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
            <CheckCircle2 className="h-3 w-3" /> Liberado
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-foreground/10 px-2 py-0.5 text-[10px] font-semibold text-foreground/70">
            <Lock className="h-3 w-3" /> Bloqueado
          </span>
        )}
      </div>

      <h3 className="font-display text-base font-bold">{displayName}</h3>
      {app.description && (
        <p className="mt-1 text-xs text-muted-foreground">{app.description}</p>
      )}

      <div className="mt-3">
        {hasDiscount && (
          <p className="text-xs text-muted-foreground line-through">
            de {formatPriceBRL(fromCents)}
          </p>
        )}
        <p className="text-lg font-bold text-foreground">
          {hasDiscount ? "por " : ""}
          {formatPriceBRL(app.price_cents)}
        </p>
        <p className="text-[11px] text-muted-foreground">
          {isBasico ? "por mês (recorrente)" : "pagamento único · 3 meses de acesso"}
        </p>
      </div>

      {unlocked && daysLeft !== null && daysLeft <= 30 && (
        <p className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700">
          <Clock className="h-3 w-3" /> Expira em {daysLeft} {daysLeft === 1 ? "dia" : "dias"}
        </p>
      )}

      <div className="mt-3">
        {unlocked ? (
          <Link
            to={meta.to}
            className="block w-full rounded-xl bg-primary py-2 text-center text-sm font-semibold text-primary-foreground"
          >
            Acessar
          </Link>
        ) : app.cakto_checkout_url ? (
          <a
            href={app.cakto_checkout_url}
            target="_blank"
            rel="noreferrer"
            className="flex w-full items-center justify-center gap-1 rounded-xl gold-gradient py-2 text-sm font-bold text-foreground"
          >
            {isBasico ? "Assinar" : "Comprar"} <ExternalLink className="h-3.5 w-3.5" />
          </a>
        ) : (
          <button
            disabled
            className="w-full cursor-not-allowed rounded-xl bg-foreground/10 py-2 text-sm font-semibold text-foreground/50"
          >
            Em breve
          </button>
        )}
      </div>
    </div>
  );
}
