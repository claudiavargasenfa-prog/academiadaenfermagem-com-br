import { CheckCircle2, XCircle, AlertTriangle, GraduationCap } from "lucide-react";

export type CriticaTreino = {
  acertos: string[];
  faltaram: string[];
  extras: string[];
  pct: number;
};

function Lista({
  titulo,
  itens,
  tone,
  Icon,
}: {
  titulo: string;
  itens: string[];
  tone: "ok" | "erro" | "alerta";
  Icon: React.ComponentType<{ className?: string }>;
}) {
  if (!itens.length) return null;
  const cls =
    tone === "ok"
      ? "border-success/40 bg-success/10 text-success"
      : tone === "erro"
        ? "border-destructive/40 bg-destructive/10 text-destructive"
        : "border-gold/50 bg-gold/10 text-gold-foreground";
  return (
    <div className={`rounded-xl border p-3 ${cls}`}>
      <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide">
        <Icon className="h-3.5 w-3.5" /> {titulo} ({itens.length})
      </p>
      <ul className="space-y-1 text-sm text-foreground/90">
        {itens.map((i) => (
          <li key={i} className="leading-snug">• {i}</li>
        ))}
      </ul>
    </div>
  );
}

export function TreinamentoFeedback({
  titulo = "Ensinamento crítico",
  mensagem,
  critica,
}: {
  titulo?: string;
  mensagem?: string;
  critica: CriticaTreino;
}) {
  const { acertos, faltaram, extras, pct } = critica;
  const cor = pct >= 80 ? "text-success" : pct >= 50 ? "text-gold-foreground" : "text-destructive";
  return (
    <div className="mb-4 rounded-2xl border border-primary/30 bg-primary/5 p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="flex items-center gap-2 font-display text-base font-bold">
          <GraduationCap className="h-5 w-5 text-primary" /> {titulo}
        </p>
        <span className={`font-display text-2xl font-bold ${cor}`}>{pct}%</span>
      </div>
      {mensagem && <p className="mb-3 text-sm text-muted-foreground">{mensagem}</p>}
      <div className="grid gap-2 md:grid-cols-3">
        <Lista titulo="Você acertou" itens={acertos} tone="ok" Icon={CheckCircle2} />
        <Lista titulo="Faltou identificar" itens={faltaram} tone="alerta" Icon={AlertTriangle} />
        <Lista titulo="Sem sustentação nos achados" itens={extras} tone="erro" Icon={XCircle} />
      </div>
    </div>
  );
}
