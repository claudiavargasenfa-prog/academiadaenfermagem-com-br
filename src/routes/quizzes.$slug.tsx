import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell, Card, PageHeader } from "@/components/AppShell";
import { AppAccessGate } from "@/components/ContentProtection";
import { QUIZZES, type Quiz } from "@/data/quizzes";
import { ArrowLeft, Check, X, RotateCcw } from "lucide-react";

export const Route = createFileRoute("/quizzes/$slug")({
  head: ({ params }) => {
    const q = QUIZZES.find((x) => x.slug === params.slug);
    const title = q ? `${q.title} — Quiz` : "Quiz — Academia da Enfermagem";
    const desc = q?.description ?? "Quiz de enfermagem.";
    const url = `https://academiadaenfermagem.com.br/quizzes/${params.slug}`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:url", content: url },
        { property: "og:type", content: "article" },
        { name: "robots", content: "noindex, nofollow" },
        { name: "twitter:card", content: "summary" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: desc },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },

  loader: ({ params }) => {
    const quiz = QUIZZES.find((q) => q.slug === params.slug);
    if (!quiz) throw notFound();
    return { quiz };
  },
  notFoundComponent: () => (
    <AppShell>
      <PageHeader title="Quiz não encontrado" description="Verifique o link e volte para a lista." />
      <Link to="/quizzes" className="text-sm text-gold underline">Voltar para os quizzes</Link>
    </AppShell>
  ),
  errorComponent: ({ error }) => (
    <AppShell>
      <PageHeader title="Erro ao carregar o quiz" description={String(error)} />
    </AppShell>
  ),
  component: QuizPage,
});

function QuizPage() {
  const { quiz } = Route.useLoaderData() as { quiz: Quiz };
  const [answers, setAnswers] = useState<(number | null)[]>(() => quiz.questions.map(() => null));
  const [submitted, setSubmitted] = useState(false);

  const score = useMemo<number>(
    () => answers.reduce<number>((acc, a, i) => acc + (a === quiz.questions[i].a ? 1 : 0), 0),
    [answers, quiz],
  );

  const total = quiz.questions.length;
  const allAnswered = answers.every((a) => a !== null);

  function reset() {
    setAnswers(quiz.questions.map(() => null));
    setSubmitted(false);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <AppShell>
      <div className="mb-3">
        <Link to="/quizzes" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Todos os quizzes
        </Link>
      </div>
      <PageHeader eyebrow={quiz.category} title={quiz.title} description={quiz.description} />
      <AppAccessGate slug="quizzes">
        <div className="grid gap-3">
          {quiz.questions.map((q, qi) => {
            const chosen = answers[qi];
            return (
              <Card key={qi}>
                <h3 className="mb-3 font-display text-base font-bold text-foreground">
                  {qi + 1}. {q.q}
                </h3>
                <div className="grid gap-2">
                  {q.opts.map((opt, oi) => {
                    const isChosen = chosen === oi;
                    const isCorrect = submitted && oi === q.a;
                    const isWrongChoice = submitted && isChosen && oi !== q.a;
                    return (
                      <button
                        key={oi}
                        type="button"
                        disabled={submitted}
                        onClick={() => {
                          if (submitted) return;
                          setAnswers((prev) => {
                            const next = [...prev];
                            next[qi] = oi;
                            return next;
                          });
                        }}
                        className={[
                          "flex items-center justify-between rounded-md border px-3 py-2 text-left text-sm transition",
                          isCorrect
                            ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-200"
                            : isWrongChoice
                              ? "border-red-500/60 bg-red-500/10 text-red-200"
                              : isChosen
                                ? "border-gold/60 bg-gold/10 text-foreground"
                                : "border-border bg-card hover:border-gold/40",
                        ].join(" ")}
                      >
                        <span>{String.fromCharCode(65 + oi)}. {opt}</span>
                        {isCorrect && <Check className="h-4 w-4" />}
                        {isWrongChoice && <X className="h-4 w-4" />}
                      </button>
                    );
                  })}
                </div>
                {submitted && q.e && (
                  <p className="mt-3 rounded-md border border-border bg-background/50 px-3 py-2 text-xs text-muted-foreground">
                    <strong className="text-foreground">Explicação:</strong> {q.e}
                  </p>
                )}
              </Card>
            );
          })}

          <Card>
            {!submitted ? (
              <button
                type="button"
                disabled={!allAnswered}
                onClick={() => {
                  setSubmitted(true);
                  if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="w-full rounded-md bg-gold px-4 py-3 font-bold text-background disabled:opacity-50"
              >
                {allAnswered ? "Conferir respostas" : `Responda todas (${answers.filter((a) => a !== null).length}/${total})`}
              </button>
            ) : (
              <div className="grid gap-3 text-center">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Resultado</p>
                  <p className="font-display text-3xl font-bold text-foreground">
                    {score} / {total}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Aproveitamento: {Math.round((score / total) * 100)}%
                  </p>
                </div>
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm hover:border-gold/60"
                >
                  <RotateCcw className="h-4 w-4" /> Refazer quiz
                </button>
                <Link to="/quizzes" className="text-sm text-gold underline">
                  Escolher outro quiz
                </Link>
              </div>
            )}
          </Card>
        </div>
      </AppAccessGate>
    </AppShell>
  );
}
