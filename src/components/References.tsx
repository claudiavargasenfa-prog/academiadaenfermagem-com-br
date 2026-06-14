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
    <section className="mt-10 rounded-2xl border border-gold/40 bg-primary/95 p-4 text-primary-foreground shadow-[var(--shadow-soft)]">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-gold">
        Fontes & referências
      </p>
      <p className="mb-3 text-[12px] leading-relaxed text-primary-foreground/85">
        <strong className="text-gold">Fontes:</strong> Diretrizes PALS/AHA, SBP, OMS, ANVISA, Ministério da Saúde e FEBRASGO.
      </p>
      <ol className="grid gap-1.5 text-[11px] leading-relaxed text-primary-foreground/75 md:grid-cols-2">
        {REFERENCES.slice(0, compact ? 6 : REFERENCES.length).map((r, i) => (
          <li key={r.n} className="flex gap-2">
            <span className="font-semibold text-gold/90">{i + 1}.</span>
            <span>
              <span className="font-semibold text-gold">{r.n}.</span> {r.src}
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-[10px] italic text-primary-foreground/65">
        Aviso: Este aplicativo tem caráter estritamente educacional para apoio acadêmico e não substitui o julgamento clínico do profissional de saúde.
      </p>
    </section>
  );
}
