export const REFERENCES: { n: string; src: string }[] = [
  { n: "COFEN", src: "Resolução COFEN nº 564/2017 — Código de Ética dos Profissionais de Enfermagem." },
  { n: "COREN", src: "Conselho Regional de Enfermagem — Pareceres técnicos e normativos vigentes." },
  { n: "Ministério da Saúde", src: "Protocolos clínicos e diretrizes terapêuticas (PCDT) — MS, Brasil." },
  { n: "ANVISA", src: "RDC nº 36/2013 — Segurança do paciente em serviços de saúde." },
  { n: "OPAS/OMS", src: "Metas Internacionais de Segurança do Paciente — OMS." },
  { n: "SBP", src: "Sociedade Brasileira de Pediatria — Tratado de Pediatria, 5ª ed." },
  { n: "FEBRASGO", src: "Manual de Assistência Pré-Natal — FEBRASGO, 2022." },
  { n: "AHA/PALS", src: "Pediatric Advanced Life Support — American Heart Association, 2020." },
  { n: "Potter & Perry", src: "Fundamentos de Enfermagem, 9ª ed., Elsevier." },
  { n: "Brunner & Suddarth", src: "Tratado de Enfermagem Médico-Cirúrgica, 14ª ed., Guanabara Koogan." },
  { n: "NANDA-I", src: "Diagnósticos de Enfermagem da NANDA-I: definições e classificação 2021–2023." },
  { n: "ONU/ODS 3", src: "Agenda 2030 — Objetivo de Desenvolvimento Sustentável nº 3: Saúde e Bem-Estar." },
];

export function ReferencesFooter({ compact = false }: { compact?: boolean }) {
  return (
    <section className="mt-10 rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur-md">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-primary">
        Referências bibliográficas
      </p>
      <ol className="grid gap-1.5 text-[11px] leading-relaxed text-muted-foreground md:grid-cols-2">
        {REFERENCES.slice(0, compact ? 6 : REFERENCES.length).map((r, i) => (
          <li key={r.n} className="flex gap-2">
            <span className="font-semibold text-foreground/80">{i + 1}.</span>
            <span>
              <span className="font-semibold text-foreground/90">{r.n}.</span> {r.src}
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-[10px] italic text-muted-foreground">
        Aviso: aplicativo educacional para apoio acadêmico — não substitui o julgamento clínico do profissional de saúde.
      </p>
    </section>
  );
}
