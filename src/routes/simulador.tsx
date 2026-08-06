import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { AppShell, Card, PageHeader } from "@/components/AppShell";
import { QUIZZES, type Question } from "@/data/quizzes";
import { fetchMyAttempts, fetchRanking, saveAttempt } from "@/lib/vip";
import { Trophy, Timer, Play, Medal, RotateCcw, Target, CheckCircle2, XCircle } from "lucide-react";

export const Route = createFileRoute("/simulador")({
  head: () => ({
    meta: [
      { title: "Simulador com Ranking — Academia da Enfermagem" },
      {
        name: "description",
        content:
          "Simulados cronometrados de enfermagem com correção imediata e ranking dos alunos ADEC. Teste seus conhecimentos e suba no pódio.",
      },
      { property: "og:title", content: "Simulador com Ranking — ADEC" },
      {
        property: "og:description",
        content: "Simulados cronometrados de enfermagem com ranking dos alunos.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://academiadaenfermagem.com.br/simulador" },
    ],
    links: [{ rel: "canonical", href: "https://academiadaenfermagem.com.br/simulador" }],
  }),
  component: SimuladorPage,
});

type Item = Question & { origem: string };

const MODES = [
  { key: "rapido", label: "Rápido", qty: 10, desc: "10 questões misturadas" },
  { key: "medio", label: "Intermediário", qty: 20, desc: "20 questões misturadas" },
  { key: "prova", label: "Prova Geral", qty: 40, desc: "40 questões — simulado completo" },
] as const;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function SimuladorPage() {
  const qc = useQueryClient();
  const [tab, setTab] = useState<"simulado" | "ranking">("simulado");
  const [category, setCategory] = useState<string>("Todas");
  const [mode, setMode] = useState<(typeof MODES)[number]["key"]>("rapido");
  const [items, setItems] = useState<Item[] | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [finished, setFinished] = useState(false);
  const startedAt = useRef<number>(0);
  const [elapsed, setElapsed] = useState(0);

  const rankingQ = useQuery({ queryKey: ["simulado-ranking"], queryFn: () => fetchRanking(30) });
  const myAttemptsQ = useQuery({ queryKey: ["simulado-my"], queryFn: fetchMyAttempts });

  const categories = useMemo(
    () => ["Todas", ...Array.from(new Set(QUIZZES.map((q) => q.category))).sort()],
    []
  );

  const pool = useMemo<Item[]>(() => {
    const source = category === "Todas" ? QUIZZES : QUIZZES.filter((q) => q.category === category);
    return source.flatMap((q) => q.questions.map((it) => ({ ...it, origem: q.title })));
  }, [category]);

  const save = useMutation({
    mutationFn: (payload: { score: number; total: number; seconds: number }) =>
      saveAttempt({
        quizSlug: `simulado-${mode}-${category.toLowerCase().replace(/\s+/g, "-")}`,
        quizTitle: `Simulado ${MODES.find((m) => m.key === mode)?.label} — ${category}`,
        category,
        score: payload.score,
        total: payload.total,
        durationSeconds: payload.seconds,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["simulado-ranking"] });
      qc.invalidateQueries({ queryKey: ["simulado-my"] });
    },
    onError: (e: any) => toast.error(e?.message ?? "Não foi possível registrar sua pontuação."),
  });

  function start() {
    const qty = MODES.find((m) => m.key === mode)!.qty;
    if (pool.length < 5) {
      toast.error("Poucas questões nessa categoria. Escolha outra.");
      return;
    }
    setItems(shuffle(pool).slice(0, Math.min(qty, pool.length)));
    setAnswers({});
    setFinished(false);
    setElapsed(0);
    startedAt.current = Date.now();
  }

  function finish() {
    if (!items) return;
    const seconds = Math.round((Date.now() - startedAt.current) / 1000);
    setElapsed(seconds);
    setFinished(true);
    const score = items.reduce((acc, it, i) => acc + (answers[i] === it.a ? 1 : 0), 0);
    save.mutate({ score, total: items.length, seconds });
    toast.success(`Você acertou ${score} de ${items.length}!`);
  }

  const score = items ? items.reduce((a, it, i) => a + (answers[i] === it.a ? 1 : 0), 0) : 0;
  const answeredCount = Object.keys(answers).length;

  return (
    <AppShell>
      <PageHeader
        eyebrow="Exclusivo para alunos"
        title="Simulador com Ranking"
        description="Monte seu simulado, responda contra o relógio e veja sua posição no pódio da Academia da Enfermagem."
      />

      <div className="mb-6 flex gap-2">
        {(["simulado", "ranking"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-wider transition ${
              tab === t
                ? "bg-gold text-black"
                : "bg-foreground/5 text-muted-foreground hover:bg-foreground/10"
            }`}
          >
            {t === "simulado" ? "Fazer simulado" : "🏆 Ranking"}
          </button>
        ))}
      </div>

      {tab === "ranking" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <div className="mb-4 flex items-center gap-2 text-gold">
              <Trophy className="h-5 w-5" />
              <h3 className="text-sm font-black uppercase tracking-tight">Ranking Geral</h3>
            </div>
            {rankingQ.isLoading && (
              <p className="animate-pulse text-sm text-muted-foreground">Carregando pódio...</p>
            )}
            {!rankingQ.isLoading && (rankingQ.data ?? []).length === 0 && (
              <p className="text-sm text-muted-foreground">
                Ninguém pontuou ainda. Faça o primeiro simulado e assuma a liderança!
              </p>
            )}
            <div className="space-y-2">
              {(rankingQ.data ?? []).map((r, i) => (
                <div
                  key={r.user_id}
                  className={`flex items-center justify-between rounded-2xl p-3 ${
                    i === 0
                      ? "border border-gold/50 bg-gold/10"
                      : "border border-foreground/5 bg-foreground/[0.03]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-sm font-black text-muted-foreground">
                      {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}º`}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-foreground">{r.display_name}</p>
                      <p className="text-[10px] uppercase text-muted-foreground">
                        {r.attempts} simulado(s) · {r.accuracy ?? 0}% de acerto
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-black text-gold-dark">{r.total_points} pts</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div className="mb-4 flex items-center gap-2 text-gold">
              <Medal className="h-5 w-5" />
              <h3 className="text-sm font-black uppercase tracking-tight">Meu histórico</h3>
            </div>
            {(myAttemptsQ.data ?? []).length === 0 && (
              <p className="text-sm text-muted-foreground">Você ainda não fez nenhum simulado.</p>
            )}
            <div className="space-y-2">
              {(myAttemptsQ.data ?? []).map((a: any) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between rounded-xl bg-foreground/5 p-3"
                >
                  <div>
                    <p className="text-xs font-bold text-foreground">{a.quiz_title}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {new Date(a.created_at).toLocaleDateString("pt-BR")} ·{" "}
                      {Math.round(a.duration_seconds / 60)} min
                    </p>
                  </div>
                  <span className="text-sm font-black text-gold-dark">
                    {a.score}/{a.total}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {tab === "simulado" && !items && (
        <Card>
          <div className="mb-4 flex items-center gap-2 text-gold">
            <Target className="h-5 w-5" />
            <h3 className="text-sm font-black uppercase tracking-tight">Monte seu simulado</h3>
          </div>

          <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            Tema
          </p>
          <div className="mb-5 flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                  category === c
                    ? "border-gold bg-gold/15 text-gold-dark"
                    : "border-foreground/10 text-muted-foreground hover:border-gold/40"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            Tamanho
          </p>
          <div className="mb-5 grid gap-3 sm:grid-cols-3">
            {MODES.map((m) => (
              <button
                key={m.key}
                onClick={() => setMode(m.key)}
                className={`rounded-2xl border p-4 text-left transition ${
                  mode === m.key
                    ? "border-gold bg-gold/10"
                    : "border-foreground/10 hover:border-gold/40"
                }`}
              >
                <p className="font-display text-sm font-bold text-foreground">{m.label}</p>
                <p className="text-[11px] text-muted-foreground">{m.desc}</p>
              </button>
            ))}
          </div>

          <p className="mb-4 text-xs text-muted-foreground">
            Banco disponível neste tema: <strong>{pool.length}</strong> questões.
          </p>

          <button
            onClick={start}
            className="inline-flex items-center gap-2 rounded-xl bg-gold px-5 py-2.5 text-sm font-black uppercase text-black"
          >
            <Play className="h-4 w-4" /> Começar
          </button>
        </Card>
      )}

      {tab === "simulado" && items && (
        <div className="space-y-4">
          <Card className="sticky top-2 z-10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-bold">
              <Timer className="h-4 w-4 text-gold" />
              {finished ? `${Math.floor(elapsed / 60)}min ${elapsed % 60}s` : "Em andamento"}
            </div>
            <div className="text-xs font-semibold text-muted-foreground">
              {answeredCount}/{items.length} respondidas
            </div>
            {finished ? (
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-gold/15 px-3 py-1 text-sm font-black text-gold-dark">
                  {score}/{items.length}
                </span>
                <button
                  onClick={() => setItems(null)}
                  className="inline-flex items-center gap-1 rounded-xl bg-foreground/10 px-3 py-2 text-xs font-bold"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Novo simulado
                </button>
              </div>
            ) : (
              <button
                onClick={finish}
                disabled={answeredCount === 0}
                className="rounded-xl bg-gold px-4 py-2 text-xs font-black uppercase text-black disabled:opacity-50"
              >
                Finalizar e pontuar
              </button>
            )}
          </Card>

          {items.map((it, i) => (
            <Card key={i}>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                {i + 1}. {it.origem}
              </p>
              <p className="mb-3 text-sm font-bold text-foreground">{it.q}</p>
              <div className="grid gap-2">
                {it.opts.map((o, oi) => {
                  const selected = answers[i] === oi;
                  const correct = finished && oi === it.a;
                  const wrong = finished && selected && oi !== it.a;
                  return (
                    <button
                      key={oi}
                      disabled={finished}
                      onClick={() => setAnswers((a) => ({ ...a, [i]: oi }))}
                      className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm transition ${
                        correct
                          ? "border-emerald-400 bg-emerald-50 text-emerald-800"
                          : wrong
                            ? "border-rose-300 bg-rose-50 text-rose-700"
                            : selected
                              ? "border-gold bg-gold/10"
                              : "border-foreground/10 hover:border-gold/40"
                      }`}
                    >
                      {correct && <CheckCircle2 className="h-4 w-4 shrink-0" />}
                      {wrong && <XCircle className="h-4 w-4 shrink-0" />}
                      <span>{o}</span>
                    </button>
                  );
                })}
              </div>
              {finished && it.e && (
                <p className="mt-2 rounded-xl bg-foreground/5 p-2 text-xs text-muted-foreground">
                  {it.e}
                </p>
              )}
            </Card>
          ))}
        </div>
      )}
    </AppShell>
  );
}
