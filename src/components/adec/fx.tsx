import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

/** Revelação por scroll: fade + subida + leve escala */
export function Reveal({
  children,
  delay = 0,
  y = 26,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Headline revelada palavra a palavra */
export function WordReveal({
  text,
  className,
  style,
  delay = 0,
}: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  if (reduce) {
    return (
      <h1 className={className} style={style}>
        {text}
      </h1>
    );
  }
  return (
    <h1 className={className} style={style}>
      {words.map((w, i) => (
        <motion.span
          key={`${w}-${i}`}
          className="inline-block"
          initial={{ opacity: 0, y: "0.5em", filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.55, delay: delay + i * 0.045, ease: [0.22, 1, 0.36, 1] }}
        >
          {w}
          {i < words.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </h1>
  );
}

/** Contador animado ao entrar na tela */
export function CountUp({
  value,
  suffix = "",
  prefix = "",
  duration = 1400,
  className,
  style,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setN(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration, reduce]);

  return (
    <p ref={ref} className={className} style={style}>
      {prefix}
      {n}
      {suffix}
    </p>
  );
}

/** Faixa infinita de selos/logos */
export function Marquee({ items, color }: { items: string[]; color: string }) {
  const row = [...items, ...items];
  return (
    <div className="relative overflow-hidden py-1">
      <div className="adec-marquee flex w-max gap-10 whitespace-nowrap">
        {row.map((it, i) => (
          <span
            key={`${it}-${i}`}
            className="text-xs font-extrabold uppercase tracking-[0.28em] md:text-sm"
            style={{ color }}
          >
            {it}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Botão CTA com brilho deslizante */
export function ShineCTA({
  href,
  children,
  style,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <motion.a
      href={href}
      whileHover={{ y: -3, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 320, damping: 20 }}
      className={`relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl px-7 py-4 text-sm font-extrabold uppercase tracking-wide md:text-base ${className}`}
      style={style}
    >
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
      <span
        className="adec-shine pointer-events-none absolute inset-y-0 -left-1/3 z-0 w-1/3"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)" }}
      />
    </motion.a>
  );
}

/** Barra de CTA fixa que aparece depois do hero */
export function StickyCTA({
  href,
  label,
  hint,
  bg,
  fg,
  accent,
}: {
  href: string;
  label: string;
  hint: string;
  bg: string;
  fg: string;
  accent: string;
}) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 720);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.div
      initial={false}
      animate={{ y: show ? 0 : 120, opacity: show ? 1 : 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 bottom-0 z-40 px-3 pb-3"
      style={{ pointerEvents: show ? "auto" : "none" }}
    >
      <div
        className="mx-auto flex max-w-3xl items-center justify-between gap-3 rounded-2xl px-4 py-3 shadow-2xl backdrop-blur"
        style={{ background: bg, border: `1px solid ${accent}` }}
      >
        <p className="hidden text-xs font-extrabold uppercase tracking-wide sm:block" style={{ color: fg }}>
          {hint}
        </p>
        <a
          href={href}
          className="w-full rounded-xl px-4 py-2.5 text-center text-xs font-extrabold uppercase tracking-wide sm:w-auto"
          style={{ background: accent, color: bg }}
        >
          {label}
        </a>
      </div>
    </motion.div>
  );
}
