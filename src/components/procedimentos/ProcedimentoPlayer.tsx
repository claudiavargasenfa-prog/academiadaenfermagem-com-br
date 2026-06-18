import { useEffect, useState } from "react";
import { Pause, Play, SkipBack, SkipForward, AlertTriangle } from "lucide-react";
import type { Cena } from "@/data/procedimentos";

const COR_OVERLAY: Record<string, string> = {
  gold: "ring-gold/70 bg-gold/30",
  danger: "ring-red-500/70 bg-red-500/30",
  success: "ring-emerald-500/70 bg-emerald-500/30",
};

export function ProcedimentoPlayer({ cenas }: { cenas: Cena[] }) {
  const [idx, setIdx] = useState(0);
  const [tocando, setTocando] = useState(false);

  const cena = cenas[idx];
  const duracao = cena?.duracaoMs ?? 5000;

  useEffect(() => {
    if (!tocando) return;
    const t = setTimeout(() => {
      setIdx((i) => (i + 1 < cenas.length ? i + 1 : (setTocando(false), i)));
    }, duracao);
    return () => clearTimeout(t);
  }, [tocando, idx, duracao, cenas.length]);

  if (!cena) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-gold/30 bg-card shadow-[var(--shadow-soft)]">
      {/* Palco da animação */}
      <div className="relative aspect-[4/3] w-full bg-gradient-to-br from-sky-50 to-slate-100">
        {cena.imagem ? (
          <img
            key={cena.ordem}
            src={cena.imagem}
            alt={cena.titulo}
            className="absolute inset-0 h-full w-full animate-fade-in object-contain"
            loading="lazy"
            width={1024}
            height={768}
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-foreground/40">
            <div className="text-center">
              <div className="text-4xl">🎬</div>
              <div className="mt-2 text-xs uppercase tracking-widest">Cena em produção</div>
            </div>
          </div>
        )}

        {/* Overlays pulsantes */}
        {cena.overlays?.map((o, i) => (
          <span
            key={i}
            className={`pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ${COR_OVERLAY[o.cor ?? "gold"]} animate-ping`}
            style={{
              left: `${o.x * 100}%`,
              top: `${o.y * 100}%`,
              width: "44px",
              height: "44px",
              animationDuration: "1.6s",
            }}
          />
        ))}

        {/* Indicador de etapa */}
        <div className="absolute left-3 top-3 rounded-full bg-primary/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-foreground">
          Etapa {cena.ordem} / {cenas.length}
        </div>

        {/* Barra de progresso */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-foreground/10">
          <div
            key={`bar-${cena.ordem}-${tocando}`}
            className="h-full bg-gold"
            style={{
              width: tocando ? "100%" : `${((idx + 1) / cenas.length) * 100}%`,
              transition: tocando ? `width ${duracao}ms linear` : "width 200ms ease",
            }}
          />
        </div>
      </div>

      {/* Conteúdo da cena */}
      <div className="space-y-2 p-4">
        <h4 className="font-display text-base font-bold">{cena.titulo}</h4>
        <p className="text-sm leading-relaxed text-foreground/85">{cena.descricao}</p>
        {cena.atencao && (
          <div className="flex items-start gap-2 rounded-xl border border-amber-300/60 bg-amber-50 px-3 py-2 text-[12px] leading-relaxed text-amber-900">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>
              <strong>Atenção:</strong> {cena.atencao}
            </span>
          </div>
        )}
      </div>

      {/* Controles */}
      <div className="flex items-center justify-between gap-2 border-t border-foreground/10 bg-foreground/5 px-3 py-2">
        <button
          onClick={() => {
            setTocando(false);
            setIdx((i) => Math.max(0, i - 1));
          }}
          disabled={idx === 0}
          className="grid h-9 w-9 place-items-center rounded-full bg-card text-foreground/70 shadow-sm hover:text-primary disabled:opacity-40"
          aria-label="Etapa anterior"
        >
          <SkipBack className="h-4 w-4" />
        </button>

        <button
          onClick={() => setTocando((t) => !t)}
          className="flex h-10 flex-1 items-center justify-center gap-2 rounded-full bg-primary text-sm font-bold text-primary-foreground hover:opacity-90"
        >
          {tocando ? (
            <>
              <Pause className="h-4 w-4" /> Pausar
            </>
          ) : (
            <>
              <Play className="h-4 w-4 fill-current" /> {idx === cenas.length - 1 ? "Reiniciar" : "Reproduzir"}
            </>
          )}
        </button>

        <button
          onClick={() => {
            setTocando(false);
            setIdx((i) => Math.min(cenas.length - 1, i + 1));
          }}
          disabled={idx === cenas.length - 1}
          className="grid h-9 w-9 place-items-center rounded-full bg-card text-foreground/70 shadow-sm hover:text-primary disabled:opacity-40"
          aria-label="Próxima etapa"
        >
          <SkipForward className="h-4 w-4" />
        </button>
      </div>

      {/* Mini-thumbnails */}
      <div className="flex gap-1 overflow-x-auto border-t border-foreground/10 p-2">
        {cenas.map((c, i) => (
          <button
            key={c.ordem}
            onClick={() => {
              setTocando(false);
              setIdx(i);
            }}
            className={`h-9 w-9 shrink-0 rounded-md border text-[10px] font-bold transition ${
              i === idx
                ? "border-gold bg-gold/20 text-foreground"
                : "border-foreground/15 bg-card text-foreground/50 hover:border-primary"
            }`}
            aria-label={`Ir para etapa ${c.ordem}`}
          >
            {c.ordem}
          </button>
        ))}
      </div>
    </div>
  );
}
