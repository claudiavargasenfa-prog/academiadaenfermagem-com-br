import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell, Card, PageHeader } from "@/components/AppShell";
import { AppAccessGate } from "@/components/ContentProtection";
import { MonitorMultiparametrico } from "@/components/MonitorMultiparametrico";
import { CASOS, type CasoClinico, type StatusPaciente } from "@/data/simulacoes-reais";
import { PROCEDIMENTOS, type Procedimento } from "@/data/procedimentos";
import { ProcedimentoPlayer } from "@/components/procedimentos/ProcedimentoPlayer";
import { ProcedimentoChecklist } from "@/components/procedimentos/ProcedimentoChecklist";
import {
  CheckCircle2,
  XCircle,
  Star,
  ArrowRight,
  Stethoscope,
  Film,
  ChevronRight,
  ArrowLeft,
  Hourglass,
} from "lucide-react";

export const Route = createFileRoute("/simulacoes-reais")({
  head: () => ({
    meta: [
      { title: "Simulações Reais — Academia de Enfermagem" },
      {
        name: "description",
        content:
          "Casos clínicos hospitalares com monitor multiparamétrico e procedimentos de enfermagem animados passo a passo (SNG, SVD, punção venosa, jugular externa).",
      },
    ],
  }),
  component: () => (
    <AppAccessGate slug="simulacoes-reais">
      <SimulacoesPage />
    </AppAccessGate>
  ),
});

type Tab = "casos" | "procedimentos";

function SimulacoesPage() {
  const [tab, setTab] = useState<Tab>("casos");

  return (
    <AppShell>
      <PageHeader
        eyebrow="Plantão simulado"
        title="Simulações Reais"
        description="Casos clínicos com monitor em tempo real e procedimentos de enfermagem animados passo a passo."
      />

      <div className="mb-4 grid grid-cols-2 gap-1 rounded-2xl border border-gold/30 bg-card p-1">
        <button
          onClick={() => setTab("casos")}
          className={`flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold uppercase tracking-wider transition ${
            tab === "casos"
              ? "bg-primary text-primary-foreground"
              : "text-foreground/60 hover:text-foreground"
          }`}
        >
          <Stethoscope className="h-3.5 w-3.5" /> Casos clínicos
        </button>
        <button
          onClick={() => setTab("procedimentos")}
          className={`flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold uppercase tracking-wider transition ${
            tab === "procedimentos"
              ? "bg-primary text-primary-foreground"
              : "text-foreground/60 hover:text-foreground"
          }`}
        >
          <Film className="h-3.5 w-3.5" /> Procedimentos
        </button>
      </div>

      {tab === "casos" ? <CasosView /> : <ProcedimentosView />}

      <p className="mt-4 text-center text-[11px] text-muted-foreground">
        Conteúdo educacional. Sempre siga os protocolos da sua instituição.
      </p>
    </AppShell>
  );
}

// =============================================================
// CASOS CLÍNICOS
// =============================================================

const STATUS_LABEL: Record<StatusPaciente, { label: string; cls: string }> = {
  estavel: { label: "estável", cls: "bg-emerald-100 text-emerald-700" },
  atencao: { label: "atenção", cls: "bg-amber-100 text-amber-700" },
  critico: { label: "crítico", cls: "bg-red-100 text-red-700" },
};

function shuffleIndices(n: number): number[] {
  const arr = Array.from({ length: n }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function CasosView() {
  const [ordem, setOrdem] = useState<number[]>(() => shuffleIndices(CASOS.length));
  const [pos, setPos] = useState(0);
  const [escolhida, setEscolhida] = useState<number | null>(null);
  const [pontos, setPontos] = useState(0);
  const [acertos, setAcertos] = useState(0);

  const caso: CasoClinico = CASOS[ordem[pos]];
  const finalizado = escolhida !== null;
  const opcaoEscolhida = finalizado ? caso.opcoes[escolhida!] : null;
  const fimDoCiclo = pos >= ordem.length - 1 && finalizado;

  const opcoesOrdenadas = useMemo(() => {
    const idx = shuffleIndices(caso.opcoes.length);
    return idx.map((i) => ({ ...caso.opcoes[i], _i: i }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caso.id]);

  function escolher(i: number) {
    if (finalizado) return;
    setEscolhida(i);
    if (caso.opcoes[i].correta) {
      setPontos((p) => p + 15);
      setAcertos((a) => a + 1);
    }
  }

  function proximo() {
    if (fimDoCiclo) {
      setOrdem(shuffleIndices(CASOS.length));
      setPos(0);
    } else {
      setPos((p) => p + 1);
    }
    setEscolhida(null);
  }

  const status = STATUS_LABEL[caso.paciente.status];

  return (
    <>
      <div className="mb-4 flex items-center justify-between rounded-2xl border border-gold/40 bg-gradient-to-br from-primary to-primary/80 px-4 py-3 text-primary-foreground">
        <div>
          <div className="text-[11px] uppercase tracking-widest opacity-80">Plantão</div>
          <div className="text-sm font-bold">
            Caso {pos + 1} / {ordem.length}
            <span className="ml-2 opacity-70">· {acertos} acerto{acertos === 1 ? "" : "s"}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end gap-1 text-2xl font-extrabold">
            <Star className="h-5 w-5 fill-gold text-gold" />
            {pontos}
          </div>
          <div className="text-[10px] uppercase tracking-widest opacity-80">pontos</div>
        </div>
      </div>

      <Card className="mb-4 p-4">
        <div className="flex items-start gap-3">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-foreground/5 text-3xl">
            {caso.paciente.avatar}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-display text-base font-bold">{caso.paciente.nome}</h3>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${status.cls}`}>
                ● {status.label}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              {caso.paciente.idade} anos · Leito {caso.paciente.leito} · {caso.setor}
            </div>
            <div className="mt-1.5 text-sm">
              <span className="font-semibold">Dx:</span> {caso.paciente.diagnostico}
            </div>
            <div className="mt-0.5 text-xs italic text-muted-foreground">"{caso.paciente.queixa}"</div>
          </div>
        </div>
      </Card>

      <div className="mb-4">
        <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Monitor
        </div>
        <MonitorMultiparametrico vitais={caso.vitais} />
      </div>

      <Card className="mb-4 p-4">
        <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          <Stethoscope className="h-3.5 w-3.5" /> Decisão clínica
        </div>
        <p className="mb-3 text-sm leading-relaxed">{caso.pergunta}</p>

        <div className="space-y-2">
          {opcoesOrdenadas.map((op, idx) => {
            const originalIndex = op._i;
            const isEscolhida = escolhida === originalIndex;
            const correta = op.correta;
            const showAsRight = finalizado && correta;
            const showAsWrong = finalizado && isEscolhida && !correta;

            const base =
              "w-full rounded-xl border px-3 py-2.5 text-left text-sm transition";
            const cls = showAsRight
              ? "border-emerald-500 bg-emerald-50 text-emerald-900"
              : showAsWrong
                ? "border-red-500 bg-red-50 text-red-900"
                : finalizado
                  ? "border-foreground/10 bg-foreground/5 text-muted-foreground"
                  : "border-foreground/15 bg-card hover:border-primary hover:bg-primary/5";

            return (
              <button
                key={idx}
                disabled={finalizado}
                onClick={() => escolher(originalIndex)}
                className={`${base} ${cls}`}
              >
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-current text-[10px] font-bold">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1">{op.texto}</span>
                  {showAsRight && <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />}
                  {showAsWrong && <XCircle className="h-4 w-4 shrink-0 text-red-600" />}
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      {finalizado && opcaoEscolhida && (
        <Card
          className={`mb-4 border-2 p-4 ${
            opcaoEscolhida.correta ? "border-emerald-500 bg-emerald-50" : "border-red-500 bg-red-50"
          }`}
        >
          <div className="flex items-start gap-2">
            {opcaoEscolhida.correta ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
            ) : (
              <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
            )}
            <p
              className={`text-sm leading-relaxed ${
                opcaoEscolhida.correta ? "text-emerald-900" : "text-red-900"
              }`}
            >
              {opcaoEscolhida.feedback}
            </p>
          </div>

          {caso.referencias.length > 0 && (
            <details className="mt-3 text-xs text-foreground/70">
              <summary className="cursor-pointer font-semibold">Referências</summary>
              <ul className="mt-1.5 space-y-1 pl-4">
                {caso.referencias.map((r, i) => (
                  <li key={i} className="list-disc">{r}</li>
                ))}
              </ul>
            </details>
          )}

          <button
            onClick={proximo}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl gold-gradient py-2.5 text-sm font-bold text-foreground"
          >
            {fimDoCiclo ? "Reiniciar plantão" : "Próximo caso"} <ArrowRight className="h-4 w-4" />
          </button>
        </Card>
      )}
    </>
  );
}

// =============================================================
// PROCEDIMENTOS ANIMADOS
// =============================================================

function ProcedimentosView() {
  const [slug, setSlug] = useState<string | null>(null);
  const proc = slug ? PROCEDIMENTOS.find((p) => p.slug === slug) : null;

  if (proc) {
    return <ProcedimentoDetalhe proc={proc} onVoltar={() => setSlug(null)} />;
  }

  return (
    <div className="space-y-2">
      <p className="mb-2 text-sm text-foreground/70">
        Escolha o procedimento. Cada um abre uma animação 2D passo a passo, com checklist e referências.
      </p>
      {PROCEDIMENTOS.map((p) => (
        <button
          key={p.slug}
          onClick={() => setSlug(p.slug)}
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
