import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, Card, PageHeader } from "@/components/AppShell";
import { AppAccessGate } from "@/components/ContentProtection";
import { MiniAppContent } from "@/components/MiniAppContent";
import { PROCEDIMENTOS, type Procedimento } from "@/data/procedimentos";
import { ProcedimentoPlayer } from "@/components/procedimentos/ProcedimentoPlayer";
import { FlebitePanel } from "@/components/procedimentos/FlebitePanel";
import { ComparativoSVDPanel } from "@/components/procedimentos/ComparativoSVDPanel";
import { ProcedimentoChecklist } from "@/components/procedimentos/ProcedimentoChecklist";
import { ChevronRight, ArrowLeft, Hourglass } from "lucide-react";

export const Route = createFileRoute("/procedimentos-enfermagem")({
  head: () => ({
    meta: [
      { title: "Procedimentos de Enfermagem — Academia da Enfermagem" },
      {
        name: "description",
        content:
          "Procedimentos de enfermagem animados passo a passo: SNG/SNE, SVD, SVA, punção venosa periférica e jugular externa.",
      },
    ],
  }),
  component: () => (
    <AppAccessGate slug="procedimentos-enfermagem">
        <MiniAppContent slug="procedimentos-enfermagem" />
      <ProcedimentosPage />
    </AppAccessGate>
  ),
});

function ProcedimentosPage() {
  const [slug, setSlug] = useState<string | null>(null);
  const proc = slug ? PROCEDIMENTOS.find((p) => p.slug === slug) : null;

  return (
    <AppShell>
      <PageHeader
        eyebrow="Guia clínico exclusivo"
        title="Procedimentos de Enfermagem"
        description="Animações 2D passo a passo, com materiais, indicações, contraindicações, complicações e checklist."
      />

      {proc ? (
        <ProcedimentoDetalhe proc={proc} onVoltar={() => setSlug(null)} />
      ) : (
        <ProcedimentosLista onSelect={setSlug} />
      )}

      <p className="mt-4 text-center text-[11px] text-muted-foreground">
        Conteúdo educacional. Sempre siga os protocolos da sua instituição.
      </p>
    </AppShell>
  );
}

function ProcedimentosLista({ onSelect }: { onSelect: (slug: string) => void }) {
  return (
    <div className="space-y-2">
      <p className="mb-2 text-sm text-foreground/70">
        Escolha o procedimento. Cada um abre uma animação 2D passo a passo, com checklist e referências.
      </p>
      {PROCEDIMENTOS.map((p) => (
        <button
          key={p.slug}
          onClick={() => onSelect(p.slug)}
          className="flex w-full items-center gap-3 rounded-2xl border border-gold/30 bg-card p-3 text-left shadow-sm transition hover:border-primary hover:shadow-md"
        >
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-foreground/5 text-2xl">
            {p.icon}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h4 className="truncate font-display text-sm font-bold">{p.titulo}</h4>
              {p.emProducao && (
                <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold uppercase text-amber-700">
                  Em breve
                </span>
              )}
            </div>
            <p className="truncate text-xs text-muted-foreground">{p.subtitulo}</p>
            <p className="mt-0.5 text-[11px] text-foreground/50">{p.publico}</p>
          </div>
          <ChevronRight className="h-4 w-4 shrink-0 text-foreground/40" />
        </button>
      ))}
    </div>
  );
}

function ProcedimentoDetalhe({ proc, onVoltar }: { proc: Procedimento; onVoltar: () => void }) {
  return (
    <div>
      <button
        onClick={onVoltar}
        className="mb-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Voltar aos procedimentos
      </button>

      <div className="mb-3">
        <h2 className="font-display text-lg font-extrabold leading-tight">{proc.titulo}</h2>
        <p className="text-xs text-muted-foreground">
          {proc.subtitulo} · {proc.publico}
        </p>
      </div>

      {proc.cenas.length > 0 ? (
        <div className="mb-4">
          <ProcedimentoPlayer cenas={proc.cenas} />
        </div>
      ) : (
        <Card className="mb-4 border-amber-300/60 bg-amber-50 p-4">
          <div className="flex items-start gap-2">
            <Hourglass className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
            <div className="text-sm text-amber-900">
              <strong>Animação em produção.</strong> As ilustrações deste procedimento ainda
              estão sendo geradas. Por enquanto, consulte abaixo materiais, indicações,
              contraindicações, complicações e o checklist completo.
            </div>
          </div>
        </Card>
      )}

      <Card className="mb-3 p-4">
        <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Materiais necessários
        </h3>
        <ul className="space-y-1 text-sm">
          {proc.materiais.map((m, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
              <span>{m}</span>
            </li>
          ))}
        </ul>
      </Card>

      <div className="mb-3 grid gap-3 md:grid-cols-3">
        <Card className="p-4">
          <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-emerald-700">
            Indicações
          </h3>
          <ul className="space-y-1 text-xs leading-relaxed">
            {proc.indicacoes.map((x, i) => (
              <li key={i}>• {x}</li>
            ))}
          </ul>
        </Card>
        <Card className="p-4">
          <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-red-700">
            Contraindicações
          </h3>
          <ul className="space-y-1 text-xs leading-relaxed">
            {proc.contraindicacoes.map((x, i) => (
              <li key={i}>• {x}</li>
            ))}
          </ul>
        </Card>
        <Card className="p-4">
          <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-amber-700">
            Complicações
          </h3>
          <ul className="space-y-1 text-xs leading-relaxed">
            {proc.complicacoes.map((x, i) => (
              <li key={i}>• {x}</li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="mb-3 p-4">
        <ProcedimentoChecklist slug={proc.slug} itens={proc.checklist} />
      </Card>

      {proc.slug.startsWith("svd") && (
        <Card className="mb-3 p-4">
          <ComparativoSVDPanel />
        </Card>
      )}

      {proc.slug.startsWith("puncao-venosa") && (
        <Card className="mb-3 p-4">
          <FlebitePanel />
        </Card>
      )}


      <Card className="p-4">
        <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Referências
        </h3>
        <ol className="space-y-1 pl-4 text-[11px] leading-relaxed text-foreground/70">
          {proc.referencias.map((r, i) => (
            <li key={i} className="list-decimal">
              {r}
            </li>
          ))}
        </ol>
      </Card>
    </div>
  );
}
