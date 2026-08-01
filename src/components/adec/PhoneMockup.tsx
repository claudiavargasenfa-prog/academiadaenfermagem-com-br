import { motion } from "framer-motion";

/** Mockup de celular mostrando a prescrição/anotação gerada pelo app. */
export function PhoneMockup({
  ink,
  cta,
  gold,
  line,
}: {
  ink: string;
  cta: string;
  gold: string;
  line: string;
}) {
  const linhas = [
    { d: "Risco de queda", h: "6/6h", p: "Alta", cor: "#EA580C" },
    { d: "Integridade da pele prejudicada", h: "4/4h", p: "Média", cor: "#b07d1a" },
    { d: "Débito cardíaco diminuído", h: "2/2h", p: "Alta", cor: "#EA580C" },
    { d: "Ansiedade", h: "12/12h", p: "Baixa", cor: "#0d3b2e" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotate: -3 }}
      whileInView={{ opacity: 1, y: 0, rotate: -2 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="adec-float mx-auto w-[264px] shrink-0"
    >
      <div
        className="rounded-[2.2rem] p-2 shadow-2xl"
        style={{ background: cta, border: `2px solid ${gold}` }}
      >
        <div className="rounded-[1.7rem] bg-white p-3">
          <div className="mx-auto mb-3 h-1.5 w-16 rounded-full" style={{ background: line }} />
          <p className="text-[9px] font-extrabold uppercase tracking-[0.2em]" style={{ color: gold }}>
            SAE automatizada
          </p>
          <p className="mt-0.5 text-[13px] font-extrabold leading-tight" style={{ color: ink }}>
            Prescrição de enfermagem
          </p>

          <div className="mt-3 space-y-1.5">
            {linhas.map((l, i) => (
              <motion.div
                key={l.d}
                initial={{ opacity: 0, x: 14 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.35 + i * 0.15, duration: 0.45 }}
                className="rounded-lg border px-2 py-1.5"
                style={{ borderColor: line, background: "rgba(13,59,46,0.03)" }}
              >
                <p className="text-[10px] font-bold leading-snug" style={{ color: ink }}>
                  {l.d}
                </p>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-[9px] font-extrabold" style={{ color: cta }}>
                    {l.h}
                  </span>
                  <span
                    className="rounded-full px-1.5 py-0.5 text-[8px] font-extrabold uppercase tracking-wide"
                    style={{ background: `${l.cor}1a`, color: l.cor }}
                  >
                    {l.p}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.05 }}
            className="mt-3 rounded-lg px-2 py-2 text-center text-[10px] font-extrabold uppercase tracking-wide"
            style={{ background: cta, color: "#fff" }}
          >
            Baixar em PDF / DOC
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
