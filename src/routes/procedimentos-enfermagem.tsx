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
      { title: "Punção Venosa Periférica e Prevenção de Flebite — ADEC" },
      {
        name: "description",
        content:
          "PUNÇÃO VENOSA PERIFÉRICA E PREVENÇÃO DE FLEBITE: Guia clínico com animações, checklist e prevenção baseada em evidências.",
      },
      { property: "og:title", content: "Punção Venosa Periférica e Prevenção de Flebite — ADEC" },
      { property: "og:description", content: "PUNÇÃO VENOSA PERIFÉRICA E PREVENÇÃO DE FLEBITE: Guia clínico com animações, checklist e prevenção baseada em evidências." },
      { property: "og:url", content: "https://academiadaenfermagem.com.br/procedimentos-enfermagem" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Punção Venosa Periférica e Prevenção de Flebite — ADEC" },
      { name: "twitter:description", content: "PUNÇÃO VENOSA PERIFÉRICA E PREVENÇÃO DE FLEBITE: Guia clínico com animações, checklist e prevenção baseada em evidências." },
    ],
    links: [{ rel: "canonical", href: "https://academiadaenfermagem.com.br/procedimentos-enfermagem" }],
  }),
  component: () => (
    <AppAccessGate slug="procedimentos-enfermagem">
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
        eyebrow="Técnica e Prevenção Baseada em Evidências"
        title="Punção Venosa e Flebite 💉"
        description="PUNÇÃO VENOSA PERIFÉRICA E PREVENÇÃO DE FLEBITE: 12 fotos reais da técnica passo a passo, escala de flebite Maddox e materiais essenciais."
      />

      {proc ? (
        <ProcedimentoDetalhe proc={proc} onVoltar={() => setSlug(null)} />
      ) : (
        <ProcedimentosLista onSelect={(s) => {
          console.log("Selecionado:", s);
          setSlug(s);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }} />
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
          className="flex w-full items-center gap-3 rounded-2xl border border-gold/30 bg-card p-3 text-left shadow-sm transition hover:border-primary hover:shadow-md relative overflow-hidden"
        >
          {p.emProducao && (
            <div className="absolute top-0 right-0 bg-amber-500 text-white text-[8px] font-bold px-2 py-0.5 rounded-bl-lg uppercase tracking-tighter">
              Em Breve
            </div>
          )}
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-foreground/5 text-2xl">
            {p.icon}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h4 className="truncate font-display text-sm font-bold">{p.titulo}</h4>
            </div>
            <p className="truncate text-xs text-muted-foreground">{p.subtitulo}</p>
            <p className="mt-0.5 text-[11px] text-foreground/50">{p.publico} {p.cenas.length > 0 ? "· ✓ Com Imagens" : "· (Sem imagens ainda)"}</p>
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

      {proc.cenas.length > 0 && (
        <div className="mb-4">
          <ProcedimentoPlayer
            cenas={proc.cenas}
            mostrarSequencia={proc.slug === "puncao-venosa-adulto"}
          />
        </div>
      )}

      {!proc.cenas.length && (
        <Card className="mb-4 border-amber-300 bg-amber-50 p-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600">
            <Hourglass className="h-8 w-8 animate-pulse" />
          </div>
          <h3 className="mb-2 font-display text-lg font-bold text-amber-900">Ilustrações em Produção</h3>
          <p className="mx-auto max-w-sm text-sm text-amber-800">
            Estamos gerando as fotos reais e animações deste procedimento específico. 
            <strong> Por enquanto, as imagens não estão disponíveis.</strong>
          </p>
          <div className="mt-4 inline-block rounded-full bg-amber-200 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-900">
            Disponível apenas em texto
          </div>
        </Card>
      )}

      <div className="mb-4 grid gap-3 lg:grid-cols-2">
        <Card className="flex flex-col border-primary/20 bg-primary/5 p-4 shadow-sm">
          <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white">1</span>
            Materiais Essenciais
          </h3>
          <ul className="grid grid-cols-1 gap-x-4 gap-y-2 text-xs sm:grid-cols-2">
            {proc.materiais.map((m, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-primary/40" />
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="flex flex-col border-emerald-200 bg-emerald-50/30 p-4 shadow-sm">
          <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-700">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] text-white">2</span>
            Indicações Clínicas
          </h3>
          <ul className="space-y-1.5 text-xs">
            {proc.indicacoes.map((x, i) => (
              <li key={i} className="flex items-start gap-2 italic">
                <span>• {x}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="flex flex-col border-red-200 bg-red-50/30 p-4 shadow-sm">
          <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-700">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] text-white">!</span>
            Contraindicações
          </h3>
          <ul className="space-y-1.5 text-xs">
            {proc.contraindicacoes.map((x, i) => (
              <li key={i} className="flex items-start gap-2 font-medium text-red-800">
                <span>✕ {x}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="flex flex-col border-amber-200 bg-amber-50/30 p-4 shadow-sm">
          <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-700">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-600 text-[10px] text-white">⚠️</span>
            Riscos e Complicações
          </h3>
          <ul className="space-y-1.5 text-xs">
            {proc.complicacoes.map((x, i) => (
              <li key={i} className="flex items-start gap-2 font-medium text-amber-800">
                <span>⚠ {x}</span>
              </li>
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
