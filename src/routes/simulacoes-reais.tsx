import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AppShell, Card, PageHeader } from "@/components/AppShell";
import { AppAccessGate } from "@/components/ContentProtection";
import { MonitorMultiparametrico } from "@/components/MonitorMultiparametrico";
import {
  CASOS,
  CATEGORIAS,
  categoriaDoCaso,
  type CasoClinico,
  type CategoriaCaso,
  type StatusPaciente,
} from "@/data/simulacoes-reais";
import {
  CheckCircle2,
  XCircle,
  Star,
  ArrowRight,
  Stethoscope,
} from "lucide-react";

export const Route = createFileRoute("/simulacoes-reais")({
  head: () => ({
    meta: [
      { title: "Simulações Reais — Academia de Enfermagem" },
      {
        name: "description",
        content:
          "Casos clínicos hospitalares com monitor multiparamétrico: Clínica Médica, Pediatria, Gineco/Obstetrícia, Neonatologia e Trauma.",
      },
    ],
  }),
  component: () => (
    <AppAccessGate slug="simulacoes-reais">
      <SimulacoesPage />
    </AppAccessGate>
  ),
});

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

function SimulacoesPage() {
  const [categoria, setCategoria] = useState<CategoriaCaso>("clinica");

  // Contagem por categoria para mostrar no chip.
  const contagem = useMemo(() => {
    const m: Record<string, number> = {};
    for (const c of CASOS) {
      const k = categoriaDoCaso(c.id);
      m[k] = (m[k] ?? 0) + 1;
    }
    return m;
  }, []);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Plantão simulado"
        title="Simulações Reais"
        description="Casos clínicos com monitor em tempo real. Escolha a área para iniciar o plantão."
      />

      <div className="mb-4 -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
        {CATEGORIAS.map((cat) => {
          const ativo = cat.id === categoria;
          const total = contagem[cat.id] ?? 0;
          const disponivel = total > 0;
          return (
            <button
              key={cat.id}
              onClick={() => disponivel && setCategoria(cat.id)}
              disabled={!disponivel}
              className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition ${
                ativo
                  ? "border-primary bg-primary text-primary-foreground"
                  : disponivel
                    ? "border-gold/30 bg-card text-foreground/70 hover:border-primary hover:text-foreground"
                    : "border-foreground/10 bg-foreground/5 text-foreground/30"
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
              <span
                className={`rounded-full px-1.5 text-[10px] ${
                  ativo ? "bg-white/20" : "bg-foreground/10"
                }`}
              >
                {total}
              </span>
            </button>
          );
        })}
      </div>

      <CasosView categoria={categoria} />

      <p className="mt-4 text-center text-[11px] text-muted-foreground">
        Conteúdo educacional. Sempre siga os protocolos da sua instituição.
      </p>
    </AppShell>
  );
}

function CasosView({ categoria }: { categoria: CategoriaCaso }) {
  const casosFiltrados = useMemo(
    () => CASOS.filter((c) => categoriaDoCaso(c.id) === categoria),
    [categoria],
  );

  const [ordem, setOrdem] = useState<number[]>(() =>
    shuffleIndices(casosFiltrados.length),
  );
  const [pos, setPos] = useState(0);
  const [escolhida, setEscolhida] = useState<number | null>(null);
  const [pontos, setPontos] = useState(0);
  const [acertos, setAcertos] = useState(0);

  // Reset quando muda a categoria.
  useEffect(() => {
    setOrdem(shuffleIndices(casosFiltrados.length));
    setPos(0);
    setEscolhida(null);
    setPontos(0);
    setAcertos(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoria]);

  if (casosFiltrados.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Em breve novos casos nesta área. Enquanto isso, escolha outra categoria acima.
        </p>
      </Card>
    );
  }

  const caso: CasoClinico = casosFiltrados[ordem[pos] ?? 0];
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
      setOrdem(shuffleIndices(casosFiltrados.length));
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
            <span className="ml-2 opacity-70">
              · {acertos} acerto{acertos === 1 ? "" : "s"}
            </span>
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
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${status.cls}`}
              >
                ● {status.label}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              {caso.paciente.idade} anos · Leito {caso.paciente.leito} · {caso.setor}
            </div>
            <div className="mt-1.5 text-sm">
              <span className="font-semibold">Dx:</span> {caso.paciente.diagnostico}
            </div>
            <div className="mt-0.5 text-xs italic text-muted-foreground">
              "{caso.paciente.queixa}"
            </div>
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
                  <li key={i} className="list-disc">
                    {r}
                  </li>
                ))}
              </ul>
            </details>
          )}

          <button
            onClick={proximo}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl gold-gradient py-2.5 text-sm font-bold text-foreground"
          >
            {fimDoCiclo ? "Reiniciar plantão" : "Próximo caso"}{" "}
            <ArrowRight className="h-4 w-4" />
          </button>
        </Card>
      )}
    </>
  );
}
