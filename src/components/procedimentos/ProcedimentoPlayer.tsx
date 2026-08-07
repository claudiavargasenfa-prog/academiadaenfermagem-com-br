import { useEffect, useState, useMemo } from "react";
import { Pause, Play, SkipBack, SkipForward, AlertTriangle } from "lucide-react";
import type { Cena } from "@/data/procedimentos";

const COR_OVERLAY: Record<string, string> = {
  gold: "ring-gold/70 bg-gold/30",
  danger: "ring-red-500/70 bg-red-500/30",
  success: "ring-emerald-500/70 bg-emerald-500/30",
};

export function ProcedimentoPlayer({ cenas, mostrarSequencia = false }: { cenas: Cena[]; mostrarSequencia?: boolean }) {
  const [idx, setIdx] = useState(0);
  const [tocando, setTocando] = useState(false);

  // Pré-carregamento de imagens para acesso offline/baixa conectividade
  useMemo(() => {
    if (typeof window !== "undefined") {
      cenas.forEach((cena) => {
        if (cena.imagem) {
          const img = new Image();
          img.src = cena.imagem;
        }
      });
    }
  }, [cenas]);

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
    <div className="space-y-5">
    <div className="overflow-hidden rounded-2xl border border-gold/30 bg-card shadow-[var(--shadow-soft)]">
      {/* Palco da animação */}
      <div className="relative aspect-[4/3] w-full bg-slate-900 overflow-hidden ring-4 ring-primary/20 flex items-center justify-center">
        {cena.imagem ? (
          <img
            key={cena.imagem}
            src={cena.imagem}
            alt={cena.titulo}
            className="h-full w-full object-contain"
            style={{ display: 'block', minHeight: '300px' }}
            loading="eager"
            onError={(e) => {
              console.error("Erro ao carregar imagem da cena:", cena.imagem);
              (e.target as HTMLImageElement).src = "https://via.placeholder.com/800x600?text=Erro+ao+carregar+imagem";
            }}
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
        <div className="absolute left-3 top-3 rounded-lg bg-black/60 backdrop-blur-md px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-white border border-white/20">
          ETAPA {cena.ordem} DE {cenas.length}
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
      <div className="grid gap-4 p-4 md:grid-cols-2">
        <div className="space-y-2">
          <h4 className="font-display text-base font-bold text-primary">{cena.titulo}</h4>
          <p className="text-sm leading-relaxed text-foreground/85">{cena.descricao}</p>
        </div>
        
        {cena.atencao && (
          <div className="flex h-fit items-start gap-2 rounded-xl border border-amber-300/60 bg-amber-50 px-3 py-2 text-[12px] leading-relaxed text-amber-900 shadow-sm">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>
              <strong className="uppercase tracking-wider">Atenção Técnica:</strong><br />
              {cena.atencao}
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
      <div className="flex gap-2 overflow-x-auto border-t border-foreground/10 p-3 bg-foreground/5 scrollbar-hide">
        {cenas.map((c, i) => (
          <button
            key={c.ordem}
            onClick={() => {
              setTocando(false);
              setIdx(i);
            }}
            className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
              i === idx
                ? "border-gold ring-2 ring-gold/20 scale-105"
                : "border-foreground/10 grayscale hover:grayscale-0 hover:border-primary"
            }`}
            aria-label={`Ir para etapa ${c.ordem}`}
          >
            {c.imagem ? (
              <img src={c.imagem} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="grid h-full w-full place-items-center bg-muted text-[10px]">{c.ordem}</div>
            )}
            <div className="absolute bottom-0 right-0 bg-black/60 px-1 text-[8px] font-bold text-white">
              {c.ordem}
            </div>
          </button>
        ))}
      </div>
    </div>

    {mostrarSequencia && (
      <section aria-labelledby="sequencia-puncao" className="space-y-4">
        <div className="border-b border-border pb-3">
          <p className="text-xs font-bold uppercase text-primary">Técnica completa ilustrada</p>
          <h3 id="sequencia-puncao" className="mt-1 font-display text-xl font-extrabold text-foreground">
            Punção venosa: passo a passo
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Veja todas as etapas e imagens em sequência, sem precisar usar as setas.
          </p>
        </div>

        {cenas.map((item) => (
          <article key={`sequencia-${item.ordem}`} className="overflow-hidden rounded-lg border border-border bg-card">
            {item.imagem && (
              <div className="flex min-h-56 w-full items-center justify-center bg-muted sm:min-h-80">
                <img
                  src={item.imagem}
                  alt={`${item.ordem}. ${item.titulo}`}
                  className="max-h-[34rem] w-full object-contain"
                  loading="eager"
                />
              </div>
            )}
            <div className="p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-sm font-extrabold text-primary-foreground">
                  {item.ordem}
                </span>
                <div className="min-w-0">
                  <h4 className="font-display text-base font-bold text-foreground">{item.titulo}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/85">{item.descricao}</p>
                </div>
              </div>
              {item.atencao && (
                <div className="mt-4 flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm leading-relaxed text-amber-950">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  <p><strong>Atenção técnica:</strong> {item.atencao}</p>
                </div>
              )}
            </div>
          </article>
        ))}
      </section>
    )}
    </div>
  );
}
