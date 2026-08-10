import { createFileRoute } from "@tanstack/react-router";
import { ContentProtection } from "@/components/ContentProtection";
import { useEffect, useMemo, useState } from "react";
import { AppShell, Card, PageHeader } from "@/components/AppShell";
import {
  TreinamentoFeedback,
  type CriticaTreino,
} from "@/components/sae/TreinamentoFeedback";
import {
  matchDiagnosticos,
  separarSinaisSintomas,
  type SaeMatch,
  type SaeDiagnostico,
} from "@/lib/sae-engine";
import {
  ClipboardList,
  Stethoscope,
  Activity,
  ListChecks,
  FileText,
  NotebookPen,
  Printer,
  Copy,
  Download,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  RotateCcw,
  GraduationCap,
} from "lucide-react";

export const Route = createFileRoute("/diagnosticos-aede")({
  head: () => ({
    meta: [
      { title: "Treinamento: Anamnese, Diagnósticos, Prescrição e Evolução — ADEC" },
      {
        name: "description",
        content:
          "Treinamento clínico em 6 passos: anamnese, exame físico, evidências clínicas, diagnósticos com crítica pedagógica, prescrição de enfermagem e evolução gerada automaticamente.",
      },
      { property: "og:title", content: "Treinamento: Anamnese, Diagnósticos, Prescrição e Evolução — ADEC" },
      {
        property: "og:description",
        content:
          "Treine o raciocínio clínico: marque ou escreva os achados, receba as hipóteses da base ADEC com crítica, monte a prescrição e gere a evolução.",
      },
      { property: "og:url", content: "https://academiadaenfermagem.com.br/diagnosticos-aede" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Treinamento: Anamnese, Diagnósticos, Prescrição e Evolução — ADEC" },
      {
        name: "twitter:description",
        content:
          "Treine o raciocínio clínico: marque ou escreva os achados, receba as hipóteses da base ADEC com crítica, monte a prescrição e gere a evolução.",
      },
    ],
    links: [{ rel: "canonical", href: "https://academiadaenfermagem.com.br/diagnosticos-aede" }],
  }),
  component: DiagnosticosAedePage,
});

// ---------------- tipos ----------------
type Anamnese = {
  paciente: string;
  idade: string;
  sexo: string;
  leito: string;
  clinica: string;
  queixa: string;
  hda: string;
  antecedentes: string;
};

type Exame = {
  glasgow: string;
  pupilas: string;
  pa: string;
  fc: string;
  fr: string;
  sato2: string;
  temp: string;
  observacoes: string;
  chips: string[];
};

type LinhaPresc = {
  key: string;
  diagId: string;
  diagnostico: string;
  conduta: string;
  horario: string;
  aprazamento: string;
  prioridade: string;
  incluida: boolean;
};

type CasoTreino = {
  title: string;
  subtitle: string;
  anamnese: Partial<Anamnese>;
  exame: Partial<Exame>;
};

// ---------------- dados de apoio ----------------
const EXAME_CHIPS: Record<string, string[]> = {
  "Neurológico": ["Sonolência", "Rebaixamento do nível de consciência", "Agitação psicomotora", "Desorientação", "Pupilas anisocóricas", "Confusão mental"],
  "Cardiovascular": ["Hipertensão", "Hipotensão", "Taquicardia", "Bradicardia", "Edema de membros inferiores", "Má perfusão periférica", "Dor torácica"],
  "Respiratório": ["Dispneia", "Taquipneia", "Uso de musculatura acessória", "Cianose", "Sibilos", "Estertores", "Tosse produtiva", "Baixa saturação de oxigênio"],
  "Gastrointestinal": ["Náusea", "Vômito", "Distensão abdominal", "Dor abdominal", "Diarreia", "Constipação", "Inapetência"],
  "Urinário": ["Oligúria", "Anúria", "Disúria", "Urina turva", "Hematúria", "Incontinência urinária"],
  "Pele e Mucosas": ["Palidez cutânea", "Icterícia", "Ressecamento de pele", "Lesão por pressão", "Ferida operatória", "Hiperemia", "Flebite"],
  "Segurança / Mobilidade": ["Risco de queda", "Mobilidade prejudicada", "Restrição no leito", "Dispositivos invasivos", "Dor à movimentação"],
  "Sinais gerais": ["Febre", "Hipotermia", "Sudorese", "Dor", "Ansiedade", "Sangramento", "Desidratação"],
};

const CASOS: CasoTreino[] = [
  {
    title: "Caso 1 — Respiratório agudo",
    subtitle: "Dispneia, taquipneia, baixa saturação e cianose",
    anamnese: {
      paciente: "Paciente do treinamento",
      idade: "68",
      sexo: "Feminino",
      leito: "204-B",
      clinica: "Clínica médica",
      queixa: "Falta de ar e desconforto respiratório há 2 horas",
      hda: "Iniciou com tosse produtiva, evoluindo com dispneia progressiva, taquipneia e queda de saturação.",
      antecedentes: "HAS e DM. Nega alergias.",
    },
    exame: {
      pa: "140x90", fc: "104", fr: "28", sato2: "89", temp: "37.8", glasgow: "15", pupilas: "isocóricas",
      observacoes: "Uso de musculatura acessória, ansiosa, cianose discreta de extremidades.",
      chips: ["Dispneia", "Taquipneia", "Baixa saturação de oxigênio", "Cianose", "Uso de musculatura acessória", "Febre"],
    },
  },
  {
    title: "Caso 2 — Instabilidade hemodinâmica",
    subtitle: "Hipotensão, taquicardia, má perfusão e oligúria",
    anamnese: {
      paciente: "Paciente do treinamento",
      idade: "72",
      sexo: "Masculino",
      leito: "Emergência 03",
      clinica: "Urgência e emergência",
      queixa: "Fraqueza intensa, tontura e redução do volume urinário",
      hda: "Quadro de vômitos e diarreia há 3 dias, com ingesta hídrica reduzida.",
      antecedentes: "Insuficiência cardíaca em acompanhamento.",
    },
    exame: {
      pa: "85x50", fc: "122", fr: "22", sato2: "94", temp: "36.2", glasgow: "14", pupilas: "isocóricas",
      observacoes: "Extremidades frias, tempo de enchimento capilar lentificado, mucosas secas.",
      chips: ["Hipotensão", "Taquicardia", "Má perfusão periférica", "Oligúria", "Desidratação", "Palidez cutânea"],
    },
  },
  {
    title: "Caso 3 — Neurológico e segurança",
    subtitle: "Sonolência, desorientação e risco de queda",
    anamnese: {
      paciente: "Paciente do treinamento",
      idade: "80",
      sexo: "Feminino",
      leito: "112-A",
      clinica: "Clínica médica",
      queixa: "Confusão mental e sonolência desde a manhã",
      hda: "Familiar refere piora do estado de consciência e episódios de desorientação.",
      antecedentes: "Demência, HAS, uso de benzodiazepínico.",
    },
    exame: {
      pa: "150x85", fc: "88", fr: "18", sato2: "95", temp: "36.5", glasgow: "13", pupilas: "isocóricas",
      observacoes: "Agitação intermitente, tentativa de sair do leito sem auxílio.",
      chips: ["Sonolência", "Desorientação", "Confusão mental", "Risco de queda", "Mobilidade prejudicada"],
    },
  },
  {
    title: "Caso 4 — Pele e dispositivos",
    subtitle: "Lesão por pressão, flebite e imobilidade",
    anamnese: {
      paciente: "Paciente do treinamento",
      idade: "65",
      sexo: "Masculino",
      leito: "UTI 05",
      clinica: "Unidade de terapia intensiva",
      queixa: "Paciente acamado, com lesão em região sacral",
      hda: "Internado há 12 dias, restrito ao leito, em uso de acesso venoso periférico há 4 dias.",
      antecedentes: "Diabetes mellitus, obesidade.",
    },
    exame: {
      pa: "130x80", fc: "92", fr: "20", sato2: "96", temp: "37.2", glasgow: "15", pupilas: "isocóricas",
      observacoes: "Hiperemia e dor no trajeto venoso do antebraço direito; lesão sacral com perda parcial de espessura.",
      chips: ["Lesão por pressão", "Flebite", "Hiperemia", "Restrição no leito", "Mobilidade prejudicada", "Dor"],
    },
  },
];

const ANAMNESE_VAZIA: Anamnese = {
  paciente: "", idade: "", sexo: "", leito: "", clinica: "", queixa: "", hda: "", antecedentes: "",
};
const EXAME_VAZIO: Exame = {
  glasgow: "", pupilas: "", pa: "", fc: "", fr: "", sato2: "", temp: "", observacoes: "", chips: [],
};

const STORAGE_KEY = "adec-treino-aede-v1";

const PASSOS = [
  { n: 1, l: "Anamnese", I: ClipboardList },
  { n: 2, l: "Exame Físico", I: Stethoscope },
  { n: 3, l: "Evidências", I: Activity },
  { n: 4, l: "Diagnósticos", I: ListChecks },
  { n: 5, l: "Prescrição", I: FileText },
  { n: 6, l: "Evolução", I: NotebookPen },
];

function norm(s: string) {
  return (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

// ---------------- página ----------------
function DiagnosticosAedePage() {
  const [step, setStep] = useState(1);
  const [anamnese, setAnamnese] = useState<Anamnese>(ANAMNESE_VAZIA);
  const [exame, setExame] = useState<Exame>(EXAME_VAZIO);
  const [textoLivre, setTextoLivre] = useState("");
  const [excluidas, setExcluidas] = useState<string[]>([]);
  const [escolhas, setEscolhas] = useState<string[]>([]);
  const [revelado, setRevelado] = useState(false);
  const [selecionados, setSelecionados] = useState<string[]>([]);
  const [linhas, setLinhas] = useState<LinhaPresc[]>([]);
  const [criticaPresc, setCriticaPresc] = useState<CriticaTreino | null>(null);

  // ---- persistência local ----
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const s = JSON.parse(raw);
      if (s.anamnese) setAnamnese({ ...ANAMNESE_VAZIA, ...s.anamnese });
      if (s.exame) setExame({ ...EXAME_VAZIO, ...s.exame });
      if (typeof s.textoLivre === "string") setTextoLivre(s.textoLivre);
      if (Array.isArray(s.excluidas)) setExcluidas(s.excluidas);
    } catch {
      /* ignora */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ anamnese, exame, textoLivre, excluidas }),
      );
    } catch {
      /* ignora */
    }
  }, [anamnese, exame, textoLivre, excluidas]);

  // ---- evidências clínicas geradas automaticamente ----
  const textoBruto = useMemo(() => {
    const sv: string[] = [];
    if (exame.pa) sv.push(`PA ${exame.pa} mmHg`);
    if (exame.fc) sv.push(`FC ${exame.fc} bpm`);
    if (exame.fr) sv.push(`FR ${exame.fr} irpm`);
    if (exame.sato2) sv.push(`Saturação de oxigênio ${exame.sato2}%`);
    if (exame.temp) sv.push(`Temperatura ${exame.temp} °C`);
    if (exame.glasgow) sv.push(`Escala de coma de Glasgow ${exame.glasgow}`);
    if (exame.pupilas) sv.push(`Pupilas ${exame.pupilas}`);
    return [
      anamnese.queixa,
      anamnese.hda,
      anamnese.antecedentes,
      sv.join(". "),
      exame.chips.join(". "),
      exame.observacoes,
      textoLivre,
    ]
      .filter((t) => (t || "").trim())
      .join(". ");
  }, [anamnese, exame, textoLivre]);

  const separadas = useMemo(() => separarSinaisSintomas(textoBruto), [textoBruto]);

  const evidenciasAtivas = useMemo(
    () =>
      [...separadas.reconhecidos, ...separadas.restante].filter(
        (e) => !excluidas.includes(norm(e)),
      ),
    [separadas, excluidas],
  );

  const toggleEvidencia = (e: string) => {
    const k = norm(e);
    setExcluidas((prev) => (prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]));
  };

  // ---- busca na planilha mestre (col. 5 > 7 > 8 > 10) ----
  const matches: SaeMatch[] = useMemo(() => {
    const corpus = evidenciasAtivas.join(". ");
    if (!corpus.trim()) return [];
    return matchDiagnosticos(corpus, 12, {
      idade: anamnese.idade,
      sexo: anamnese.sexo,
      setor: anamnese.clinica,
    });
  }, [evidenciasAtivas, anamnese.idade, anamnese.sexo, anamnese.clinica]);

  // gabarito: hipóteses de alta correspondência (mínimo 2, máximo 5)
  const gabarito = useMemo(() => {
    const altas = matches.filter((m) => m.confianca === "Alta");
    const base = altas.length >= 2 ? altas : matches.slice(0, Math.min(3, matches.length));
    return base.slice(0, 5);
  }, [matches]);

  const criticaDiag: CriticaTreino | null = useMemo(() => {
    if (!revelado) return null;
    const ids = new Set(gabarito.map((m) => m.diag.id));
    const nome = (id: string) =>
      matches.find((m) => m.diag.id === id)?.diag.diagnostico ?? id;
    const acertos = escolhas.filter((id) => ids.has(id)).map(nome);
    const faltaram = gabarito.filter((m) => !escolhas.includes(m.diag.id)).map((m) => m.diag.diagnostico);
    const extras = escolhas.filter((id) => !ids.has(id)).map(nome);
    const total = gabarito.length || 1;
    const pct = Math.max(
      0,
      Math.round(((acertos.length - extras.length * 0.5) / total) * 100),
    );
    return { acertos, faltaram, extras, pct: Math.min(100, pct) };
  }, [revelado, gabarito, escolhas, matches]);

  const diagsSelecionados: SaeDiagnostico[] = useMemo(
    () => matches.filter((m) => selecionados.includes(m.diag.id)).map((m) => m.diag),
    [matches, selecionados],
  );

  // monta a prescrição a partir da COL. 8 dos diagnósticos escolhidos
  useEffect(() => {
    setLinhas((prev) => {
      const antigas = new Map(prev.map((l) => [l.key, l]));
      const novas: LinhaPresc[] = [];
      diagsSelecionados.forEach((d) => {
        d.condutas.forEach((c, i) => {
          const key = `${d.id}-${i}`;
          novas.push(
            antigas.get(key) ?? {
              key,
              diagId: d.id,
              diagnostico: d.diagnostico,
              conduta: c.conduta,
              horario: c.horario || "Rotina",
              aprazamento: c.aprazamento || "",
              prioridade: c.prioridade || "—",
              incluida: true,
            },
          );
        });
      });
      return novas;
    });
    setCriticaPresc(null);
  }, [diagsSelecionados]);

  const evolucao = useMemo(
    () =>
      montarEvolucao({
        anamnese,
        exame,
        evidencias: evidenciasAtivas,
        diags: diagsSelecionados,
        linhas: linhas.filter((l) => l.incluida),
      }),
    [anamnese, exame, evidenciasAtivas, diagsSelecionados, linhas],
  );

  const go = (n: number) => {
    setStep(n);
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 0);
  };

  const usarCaso = (c: CasoTreino) => {
    setAnamnese({ ...ANAMNESE_VAZIA, ...c.anamnese });
    setExame({ ...EXAME_VAZIO, ...c.exame });
    setTextoLivre("");
    setExcluidas([]);
    setEscolhas([]);
    setRevelado(false);
    setSelecionados([]);
    setCriticaPresc(null);
    go(2);
  };

  const reiniciar = () => {
    setAnamnese(ANAMNESE_VAZIA);
    setExame(EXAME_VAZIO);
    setTextoLivre("");
    setExcluidas([]);
    setEscolhas([]);
    setRevelado(false);
    setSelecionados([]);
    setLinhas([]);
    setCriticaPresc(null);
    go(1);
  };

  const confirmarEscolhas = () => {
    setRevelado(true);
    const uniao = Array.from(new Set([...escolhas, ...gabarito.map((m) => m.diag.id)]));
    setSelecionados(uniao);
  };

  const conferirPrescricao = () => {
    const incluidas = linhas.filter((l) => l.incluida);
    const fora = linhas.filter((l) => !l.incluida);
    const pct = linhas.length
      ? Math.round((incluidas.length / linhas.length) * 100)
      : 0;
    setCriticaPresc({
      acertos: incluidas.slice(0, 12).map((l) => l.conduta),
      faltaram: fora.map((l) => l.conduta),
      extras: [],
      pct,
    });
  };

  return (
    <AppShell>
      <ContentProtection allowPrint>
        <PageHeader
          eyebrow="Mini App · Treinamento"
          title="Anamnese, Exame Físico, Diagnósticos, Prescrição e Evolução"
          description="Treinamento clínico em 6 passos: tudo que você marcar ou escrever vira evidência clínica, a base ADEC sugere as hipóteses, você recebe a crítica pedagógica, monta a prescrição e a evolução sai pronta."
        />

        <Card className="mb-5 border-gold/40 bg-gradient-to-br from-primary/5 to-gold/10">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl gold-gradient">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div className="text-sm text-foreground/90">
              <p className="mb-2 font-display text-base font-bold">Como funciona o treinamento</p>
              <ol className="list-decimal space-y-1 pl-5">
                <li><strong>Anamnese e Exame Físico</strong> — marque ou escreva; nada se perde.</li>
                <li><strong>Evidências clínicas / sinais e sintomas</strong> — captadas automaticamente do que você registrou.</li>
                <li><strong>Diagnósticos</strong> — primeiro você escolhe, depois o app revela as hipóteses da base ADEC e mostra onde você acertou e o que faltou.</li>
                <li><strong>Prescrição</strong> — intervenções da base, com horário, aprazamento e prioridade clínica.</li>
                <li><strong>Evolução</strong> — texto final pronto para copiar, imprimir ou baixar.</li>
              </ol>
            </div>
          </div>
        </Card>

        {/* Stepper */}
        <div className="mb-5 flex flex-wrap items-center gap-2">
          {PASSOS.map(({ n, l, I }) => {
            const active = step === n;
            const done = step > n;
            return (
              <button
                key={n}
                onClick={() => go(n)}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors ${
                  active
                    ? "gold-gradient shadow-[var(--shadow-soft)]"
                    : done
                      ? "bg-primary/10 text-primary hover:bg-primary/20"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                <I className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{n}. {l}</span>
                <span className="sm:hidden">{n}</span>
              </button>
            );
          })}
          <button
            onClick={reiniciar}
            className="ml-auto inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-semibold hover:bg-muted"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Novo treino
          </button>
        </div>

        {step === 1 && (
          <StepAnamnese
            anamnese={anamnese}
            setAnamnese={setAnamnese}
            onNext={() => go(2)}
            onCaso={usarCaso}
          />
        )}

        {step === 2 && (
          <StepExame
            exame={exame}
            setExame={setExame}
            onBack={() => go(1)}
            onNext={() => go(3)}
          />
        )}

        {step === 3 && (
          <StepEvidencias
            reconhecidos={separadas.reconhecidos}
            restante={separadas.restante}
            excluidas={excluidas}
            toggle={toggleEvidencia}
            textoLivre={textoLivre}
            setTextoLivre={setTextoLivre}
            total={evidenciasAtivas.length}
            onBack={() => go(2)}
            onNext={() => go(4)}
          />
        )}

        {step === 4 && (
          <StepDiagnosticos
            matches={matches}
            gabarito={gabarito}
            escolhas={escolhas}
            setEscolhas={setEscolhas}
            revelado={revelado}
            critica={criticaDiag}
            selecionados={selecionados}
            setSelecionados={setSelecionados}
            onConfirmar={confirmarEscolhas}
            onBack={() => go(3)}
            onNext={() => go(5)}
          />
        )}

        {step === 5 && (
          <StepPrescricao
            anamnese={anamnese}
            linhas={linhas}
            setLinhas={setLinhas}
            critica={criticaPresc}
            onConferir={conferirPrescricao}
            onBack={() => go(4)}
            onNext={() => go(6)}
          />
        )}

        {step === 6 && (
          <StepEvolucao
            texto={evolucao}
            criticaDiag={criticaDiag}
            criticaPresc={criticaPresc}
            onBack={() => go(5)}
            onReiniciar={reiniciar}
          />
        )}
      </ContentProtection>
    </AppShell>
  );
}

// ============ STEP 1 ============
function StepAnamnese({
  anamnese, setAnamnese, onNext, onCaso,
}: {
  anamnese: Anamnese;
  setAnamnese: (a: Anamnese) => void;
  onNext: () => void;
  onCaso: (c: CasoTreino) => void;
}) {
  const F = (
    k: keyof Anamnese,
    label: string,
    opts: { textarea?: boolean; type?: string; placeholder?: string } = {},
  ) => (
    <label className="block text-sm font-semibold">
      {label}
      {opts.textarea ? (
        <textarea
          rows={3}
          value={anamnese[k]}
          onChange={(e) => setAnamnese({ ...anamnese, [k]: e.target.value })}
          placeholder={opts.placeholder}
          className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm font-normal"
        />
      ) : (
        <input
          type={opts.type ?? "text"}
          value={anamnese[k]}
          onChange={(e) => setAnamnese({ ...anamnese, [k]: e.target.value })}
          placeholder={opts.placeholder}
          className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm font-normal"
        />
      )}
    </label>
  );

  return (
    <Card>
      <SectionTitle
        icon={ClipboardList}
        title="1. Anamnese"
        subtitle="Escolha um caso de treino ou digite o seu paciente. Tudo que for escrito aqui vira evidência clínica no passo 3."
      />

      <div className="mb-4 grid gap-2 md:grid-cols-2">
        {CASOS.map((c) => (
          <button
            key={c.title}
            onClick={() => onCaso(c)}
            className="rounded-xl border border-gold/40 bg-gold/10 p-3 text-left transition-colors hover:border-gold hover:bg-gold/20"
          >
            <span className="block font-display text-sm font-bold text-foreground">{c.title}</span>
            <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{c.subtitle}</span>
          </button>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {F("paciente", "Nome do paciente", { placeholder: "Ex.: Maria S." })}
        {F("idade", "Idade", { type: "number", placeholder: "Ex.: 68" })}
        {F("sexo", "Sexo", { placeholder: "Ex.: Feminino" })}
        {F("leito", "Leito", { placeholder: "Ex.: 204-B" })}
        {F("clinica", "Clínica / Setor", { placeholder: "Ex.: Clínica médica" })}
        {F("queixa", "Queixa principal", { placeholder: "Ex.: dispneia há 2 horas" })}
      </div>
      <div className="mt-3 grid gap-3">
        {F("hda", "HDA — História da Doença Atual", { textarea: true, placeholder: "Ex.: iniciou com tosse, evoluiu com desconforto respiratório e queda de saturação." })}
        {F("antecedentes", "Antecedentes (comorbidades, alergias, medicações em uso)", { textarea: true, placeholder: "Ex.: HAS, DM, alergia negada, usa losartana." })}
      </div>
      <NavRow onNext={onNext} nextLabel="Avançar para Exame Físico" />
    </Card>
  );
}

// ============ STEP 2 ============
function StepExame({
  exame, setExame, onBack, onNext,
}: {
  exame: Exame;
  setExame: (e: Exame) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const toggle = (v: string) =>
    setExame({
      ...exame,
      chips: exame.chips.includes(v) ? exame.chips.filter((x) => x !== v) : [...exame.chips, v],
    });

  const N = (k: keyof Exame, label: string, ph?: string) => (
    <label className="block text-xs font-semibold">
      {label}
      <input
        value={exame[k] as string}
        onChange={(e) => setExame({ ...exame, [k]: e.target.value })}
        placeholder={ph}
        className="mt-1 w-full rounded-lg border border-border bg-background px-2 py-1.5 text-sm font-normal"
      />
    </label>
  );

  return (
    <Card>
      <SectionTitle
        icon={Stethoscope}
        title="2. Exame Físico"
        subtitle="Registre os valores e marque os achados. Cada marcação alimenta as evidências clínicas."
      />

      <div className="mb-4 grid grid-cols-2 gap-2 md:grid-cols-4">
        {N("pa", "PA (mmHg)", "120x80")}
        {N("fc", "FC (bpm)", "80")}
        {N("fr", "FR (irpm)", "18")}
        {N("sato2", "SatO₂ (%)", "97")}
        {N("temp", "Temp (°C)", "36.5")}
        {N("glasgow", "Glasgow", "15")}
        {N("pupilas", "Pupilas", "isocóricas")}
      </div>

      <div className="space-y-3">
        {Object.entries(EXAME_CHIPS).map(([sistema, chips]) => (
          <div key={sistema}>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-primary">{sistema}</p>
            <div className="flex flex-wrap gap-1.5">
              {chips.map((c) => {
                const active = exame.chips.includes(c);
                return (
                  <button
                    key={c}
                    onClick={() => toggle(c)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                      active
                        ? "gold-gradient border-transparent"
                        : "border-border bg-background hover:border-gold/60 hover:text-primary"
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3">
        <label className="block text-xs font-semibold">
          Observações do exame
          <textarea
            rows={2}
            value={exame.observacoes}
            onChange={(e) => setExame({ ...exame, observacoes: e.target.value })}
            className="mt-1 w-full rounded-lg border border-border bg-background px-2 py-1.5 text-sm font-normal"
          />
        </label>
      </div>

      <NavRow onBack={onBack} onNext={onNext} nextLabel="Ver evidências clínicas" />
    </Card>
  );
}

// ============ STEP 3 ============
function StepEvidencias({
  reconhecidos, restante, excluidas, toggle, textoLivre, setTextoLivre, total, onBack, onNext,
}: {
  reconhecidos: string[];
  restante: string[];
  excluidas: string[];
  toggle: (e: string) => void;
  textoLivre: string;
  setTextoLivre: (v: string) => void;
  total: number;
  onBack: () => void;
  onNext: () => void;
}) {
  const Item = ({ e, destaque }: { e: string; destaque: boolean }) => {
    const ativo = !excluidas.includes(norm(e));
    return (
      <button
        onClick={() => toggle(e)}
        className={`rounded-full border px-3 py-1 text-left text-xs font-medium transition-colors ${
          ativo
            ? destaque
              ? "gold-gradient border-transparent"
              : "border-primary/40 bg-primary/10 text-primary"
            : "border-border bg-background text-muted-foreground line-through"
        }`}
      >
        {e}
      </button>
    );
  };

  return (
    <Card>
      <SectionTitle
        icon={Activity}
        title="3. Evidências clínicas / Sinais e sintomas"
        subtitle="Captadas automaticamente de tudo que você marcou ou escreveu. Clique para incluir ou excluir um item."
      />

      <div className="mb-4">
        <p className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-primary">
          <Sparkles className="h-3.5 w-3.5" /> Reconhecidos pela base ADEC ({reconhecidos.length})
        </p>
        {reconhecidos.length ? (
          <div className="flex flex-wrap gap-1.5">
            {reconhecidos.map((e) => <Item key={e} e={e} destaque />)}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Nada reconhecido ainda — volte e marque achados no exame físico ou escreva abaixo.
          </p>
        )}
      </div>

      {restante.length > 0 && (
        <div className="mb-4">
          <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Outros registros do seu texto ({restante.length})
          </p>
          <div className="flex flex-wrap gap-1.5">
            {restante.map((e) => <Item key={e} e={e} destaque={false} />)}
          </div>
        </div>
      )}

      <label className="block text-xs font-semibold">
        Escreva ou dite outros sinais e sintomas
        <textarea
          rows={4}
          value={textoLivre}
          onChange={(e) => setTextoLivre(e.target.value)}
          placeholder="Ex.: sudorese fria, tontura súbita, dor em região lombar ao movimentar-se."
          className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm font-normal"
        />
      </label>

      <p className="mt-2 text-xs text-muted-foreground">
        {total} evidência{total === 1 ? "" : "s"} ativa{total === 1 ? "" : "s"} para a busca de diagnósticos.
      </p>

      <NavRow onBack={onBack} onNext={onNext} nextLabel="Ir para os diagnósticos" nextDisabled={total === 0} />
    </Card>
  );
}

// ============ STEP 4 ============
function StepDiagnosticos({
  matches, gabarito, escolhas, setEscolhas, revelado, critica,
  selecionados, setSelecionados, onConfirmar, onBack, onNext,
}: {
  matches: SaeMatch[];
  gabarito: SaeMatch[];
  escolhas: string[];
  setEscolhas: (v: string[]) => void;
  revelado: boolean;
  critica: CriticaTreino | null;
  selecionados: string[];
  setSelecionados: (v: string[]) => void;
  onConfirmar: () => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const noGabarito = (id: string) => gabarito.some((m) => m.diag.id === id);

  const toggle = (id: string) => {
    if (!revelado) {
      setEscolhas(escolhas.includes(id) ? escolhas.filter((x) => x !== id) : [...escolhas, id]);
    } else {
      setSelecionados(
        selecionados.includes(id) ? selecionados.filter((x) => x !== id) : [...selecionados, id],
      );
    }
  };

  return (
    <Card>
      <SectionTitle
        icon={ListChecks}
        title="4. Diagnósticos — treino do raciocínio clínico"
        subtitle={
          revelado
            ? "Veja a crítica e confirme quais diagnósticos vão para a prescrição."
            : "Antes de ver a resposta: marque quais hipóteses você considera corretas para este paciente."
        }
      />

      {critica && (
        <TreinamentoFeedback
          critica={critica}
          mensagem="Comparação entre a sua escolha e as hipóteses de alta correspondência da base ADEC, considerando os critérios essenciais (col. 5), a hipótese diagnóstica (col. 7), as intervenções (col. 8) e os objetivos (col. 10)."
        />
      )}

      {matches.length === 0 ? (
        <div className="rounded-xl border border-warning/40 bg-warning/10 p-4 text-sm">
          Nenhuma hipótese combinou com as evidências informadas. Volte ao passo 3 e acrescente achados.
        </div>
      ) : (
        <div className="space-y-4">
          {matches.map((m) => {
            const d = m.diag;
            const marcado = revelado ? selecionados.includes(d.id) : escolhas.includes(d.id);
            const certo = revelado && noGabarito(d.id);
            const objetivos = Array.from(
              new Set(d.condutas.map((c) => c.objetivo).filter(Boolean) as string[]),
            );
            return (
              <div
                key={d.id}
                className={`rounded-2xl border p-4 transition-colors ${
                  revelado && certo
                    ? "border-success/60 bg-success/5"
                    : marcado
                      ? "border-gold/70 bg-gold/10 shadow-[var(--shadow-soft)]"
                      : "border-border bg-card/70"
                }`}
              >
                <div className="mb-2 flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={marcado}
                    onChange={() => toggle(d.id)}
                    className="mt-1 h-5 w-5 accent-primary"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-mono text-muted-foreground">{d.id}</span>
                      {d.matriz && (
                        <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-primary">
                          {d.matriz}{d.eixo ? ` · ${d.eixo}` : ""}
                        </span>
                      )}
                      {revelado && (
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            certo ? "bg-success/20 text-success" : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {certo ? "Alta prioridade para este caso" : `Correspondência ${m.confianca}`}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-primary">
                      Hipótese diagnóstica ADEC (col. 7)
                    </p>
                    <h3 className="font-display text-base font-bold text-foreground">{d.diagnostico}</h3>
                  </div>
                </div>

                {m.hits.length > 0 && (
                  <p className="mb-2 text-xs text-success">
                    <strong>Achados do paciente que geraram esta hipótese:</strong>{" "}
                    {Array.from(new Set(m.hits)).slice(0, 8).join(" • ")}
                  </p>
                )}

                {revelado && (
                  <div className="space-y-2 text-sm">
                    {d.criteriosEssenciais && (
                      <div className="rounded-lg border border-primary/30 bg-primary/5 p-2.5">
                        <p className="mb-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">Critérios essenciais (col. 5)</p>
                        {d.criteriosEssenciais}
                      </div>
                    )}
                    {objetivos.length > 0 && (
                      <div className="rounded-lg border border-success/30 bg-success/10 p-2.5">
                        <p className="mb-0.5 text-[10px] font-bold uppercase tracking-wide text-success">Objetivo assistencial (col. 10)</p>
                        {objetivos.join(" • ")}
                      </div>
                    )}
                    {d.raciocinio && (
                      <div className="rounded-lg border border-gold/40 bg-gold/10 p-2.5">
                        <p className="mb-0.5 text-[10px] font-bold uppercase tracking-wide text-gold-foreground">Mecanismo científico — raciocínio clínico</p>
                        {d.raciocinio}
                      </div>
                    )}
                    <details>
                      <summary className="cursor-pointer text-xs font-semibold text-primary">
                        Ver intervenções (col. 8) — {d.condutas.length}
                      </summary>
                      <ol className="mt-2 space-y-1.5">
                        {d.condutas.map((c, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full gold-gradient text-[10px] font-bold">
                              {i + 1}
                            </span>
                            <div>
                              <p>{c.conduta}</p>
                              <p className="text-xs text-muted-foreground">
                                {c.horario && <><strong>Horário:</strong> {c.horario} · </>}
                                {c.aprazamento && <><strong>Aprazamento:</strong> {c.aprazamento} · </>}
                                {c.prioridade && <><strong>Prioridade:</strong> {c.prioridade}</>}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ol>
                    </details>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {!revelado ? (
        <NavRow
          onBack={onBack}
          onNext={onConfirmar}
          nextLabel={`Confirmar minhas escolhas (${escolhas.length})`}
          nextDisabled={escolhas.length === 0}
        />
      ) : (
        <NavRow
          onBack={onBack}
          onNext={onNext}
          nextLabel={`Montar prescrição (${selecionados.length})`}
          nextDisabled={selecionados.length === 0}
        />
      )}
    </Card>
  );
}

// ============ STEP 5 ============
function StepPrescricao({
  anamnese, linhas, setLinhas, critica, onConferir, onBack, onNext,
}: {
  anamnese: Anamnese;
  linhas: LinhaPresc[];
  setLinhas: React.Dispatch<React.SetStateAction<LinhaPresc[]>>;
  critica: CriticaTreino | null;
  onConferir: () => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const dataExt = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });

  const upd = (key: string, patch: Partial<LinhaPresc>) =>
    setLinhas((prev) => prev.map((l) => (l.key === key ? { ...l, ...patch } : l)));

  const incluidas = linhas.filter((l) => l.incluida);

  const handlePrint = () => {
    const esc = (s: string) => (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;");
    const body = incluidas
      .map(
        (l, i) =>
          `<tr><td>${String(i + 1).padStart(2, "0")}</td><td>${esc(l.diagnostico)}</td><td>${esc(l.conduta)}</td><td>${esc(l.horario)}</td><td>${esc(l.aprazamento)}</td><td>${esc(l.prioridade)}</td></tr>`,
      )
      .join("");
    const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<title>Prescrição de Enfermagem</title>
<style>
  @page { size: A4 landscape; margin: 1.2cm; }
  body { font-family: "Times New Roman", Times, serif; font-size: 10.5pt; color:#000; }
  h1 { font-size: 14pt; text-transform: uppercase; text-align:center; margin: 0 0 8pt 0; }
  .cab { font-size: 10pt; margin-bottom: 10pt; display:flex; justify-content:space-between; flex-wrap:wrap; gap:6pt; }
  table { width:100%; border-collapse: collapse; }
  th, td { border: 1px solid #000; padding: 4pt 5pt; text-align:left; vertical-align: top; }
  th { background:#e5e5e5; }
  td:nth-child(1) { width: 4%; text-align:center; }
</style></head><body>
<h1>Prescrição de Enfermagem</h1>
<div class="cab">
  <div><strong>Paciente:</strong> ${esc(anamnese.paciente || "—")}</div>
  <div><strong>Leito:</strong> ${esc(anamnese.leito || "—")} · <strong>Clínica:</strong> ${esc(anamnese.clinica || "—")}</div>
  <div><strong>Data:</strong> ${dataExt}</div>
</div>
<table>
  <thead><tr><th>Nº</th><th>Diagnóstico</th><th>Intervenção</th><th>Horário</th><th>Aprazamento</th><th>Prioridade clínica</th></tr></thead>
  <tbody>${body}</tbody>
</table>
<script>window.onload=()=>window.print();</script>
</body></html>`;
    const w = window.open("", "_blank");
    if (!w) { alert("Permita pop-ups para abrir a prescrição."); return; }
    w.document.write(html);
    w.document.close();
  };

  return (
    <Card>
      <SectionTitle
        icon={FileText}
        title="5. Prescrição de enfermagem"
        subtitle="Intervenções da base ADEC (col. 8). Ajuste horário, aprazamento e prioridade — depois confira o que você deixou de fora."
      />

      {critica && (
        <TreinamentoFeedback
          titulo="Crítica da prescrição"
          critica={critica}
          mensagem="Intervenções desmarcadas aparecem como pontos de atenção: reveja se a exclusão se sustenta clinicamente."
        />
      )}

      <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-background/80 p-3 text-sm">
        <div><strong>Paciente:</strong> {anamnese.paciente || "—"}</div>
        <div><strong>Leito:</strong> {anamnese.leito || "—"}</div>
        <div><strong>Clínica:</strong> {anamnese.clinica || "—"}</div>
        <div className="ml-auto"><strong>Data:</strong> {dataExt}</div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-primary text-primary-foreground">
            <tr>
              <th className="w-12 px-2 py-2 text-left">Nº</th>
              <th className="px-3 py-2 text-left">Diagnóstico / Intervenção</th>
              <th className="w-36 px-2 py-2 text-left">Horário</th>
              <th className="w-52 px-2 py-2 text-left">Aprazamento</th>
              <th className="w-36 px-2 py-2 text-left">Prioridade clínica</th>
            </tr>
          </thead>
          <tbody>
            {linhas.map((l, i) => (
              <tr key={l.key} className={`border-t border-border/60 align-top ${l.incluida ? "" : "opacity-45"}`}>
                <td className="px-2 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={l.incluida}
                    onChange={() => upd(l.key, { incluida: !l.incluida })}
                    className="h-4 w-4 accent-primary"
                  />
                  <div className="mt-1 text-[10px] font-semibold">{String(i + 1).padStart(2, "0")}</div>
                </td>
                <td className="px-3 py-2">
                  <p className="text-xs font-bold text-primary">{l.diagnostico}</p>
                  <p>{l.conduta}</p>
                </td>
                <td className="px-2 py-2">
                  <input
                    value={l.horario}
                    onChange={(e) => upd(l.key, { horario: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-2 py-1 text-xs"
                  />
                </td>
                <td className="px-2 py-2">
                  <textarea
                    rows={2}
                    value={l.aprazamento}
                    onChange={(e) => upd(l.key, { aprazamento: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-2 py-1 text-xs"
                  />
                </td>
                <td className="px-2 py-2">
                  <input
                    value={l.prioridade}
                    onChange={(e) => upd(l.key, { prioridade: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-2 py-1 text-center text-xs font-bold"
                  />
                </td>
              </tr>
            ))}
            {linhas.length === 0 && (
              <tr>
                <td colSpan={5} className="px-3 py-4 text-center text-sm text-muted-foreground">
                  Nenhum diagnóstico selecionado no passo 4.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={onConferir}
          disabled={linhas.length === 0}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground hover:opacity-90 disabled:opacity-40"
        >
          <GraduationCap className="h-4 w-4" /> Conferir minha prescrição
        </button>
        <button
          onClick={handlePrint}
          disabled={incluidas.length === 0}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold hover:bg-muted disabled:opacity-40"
        >
          <Printer className="h-4 w-4" /> Imprimir / Salvar PDF
        </button>
      </div>

      <NavRow onBack={onBack} onNext={onNext} nextLabel="Gerar evolução" nextDisabled={incluidas.length === 0} />
    </Card>
  );
}

// ============ STEP 6 ============
function StepEvolucao({
  texto, criticaDiag, criticaPresc, onBack, onReiniciar,
}: {
  texto: string;
  criticaDiag: CriticaTreino | null;
  criticaPresc: CriticaTreino | null;
  onBack: () => void;
  onReiniciar: () => void;
}) {
  const notas = [criticaDiag?.pct, criticaPresc?.pct].filter(
    (n): n is number => typeof n === "number",
  );
  const nota = notas.length ? Math.round(notas.reduce((a, b) => a + b, 0) / notas.length) : null;

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(texto);
      alert("Evolução copiada!");
    } catch {
      alert("Não foi possível copiar.");
    }
  };

  const baixar = () => {
    const blob = new Blob([texto], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "evolucao-enfermagem.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const imprimir = () => {
    const w = window.open("", "_blank");
    if (!w) { alert("Permita pop-ups para imprimir."); return; }
    w.document.write(
      `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Evolução de Enfermagem</title>
<style>@page{size:A4;margin:2cm}body{font-family:"Times New Roman",Times,serif;font-size:11.5pt;white-space:pre-wrap;line-height:1.5}</style>
</head><body>${texto.replace(/&/g, "&amp;").replace(/</g, "&lt;")}<script>window.onload=()=>window.print();</script></body></html>`,
    );
    w.document.close();
  };

  return (
    <Card>
      <SectionTitle
        icon={NotebookPen}
        title="6. Evolução de enfermagem"
        subtitle="Texto final reunindo anamnese, exame físico, evidências, diagnósticos e prescrição."
      />

      {nota !== null && (
        <div className="mb-4 rounded-2xl border border-gold/50 bg-gold/10 p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-gold-foreground">Placar do treinamento</p>
          <p className="font-display text-3xl font-bold text-foreground">{nota}%</p>
          <p className="text-sm text-muted-foreground">
            Diagnósticos: {criticaDiag ? `${criticaDiag.pct}%` : "não conferido"} · Prescrição:{" "}
            {criticaPresc ? `${criticaPresc.pct}%` : "não conferida"}
          </p>
        </div>
      )}

      <textarea
        readOnly
        value={texto}
        rows={22}
        className="w-full rounded-xl border border-border bg-background px-3 py-2 font-mono text-xs leading-relaxed"
      />

      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={copiar} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground hover:opacity-90">
          <Copy className="h-4 w-4" /> Copiar evolução
        </button>
        <button onClick={imprimir} className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold hover:bg-muted">
          <Printer className="h-4 w-4" /> Imprimir / PDF
        </button>
        <button onClick={baixar} className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold hover:bg-muted">
          <Download className="h-4 w-4" /> Baixar .txt
        </button>
        <button onClick={onReiniciar} className="inline-flex items-center gap-2 rounded-xl border border-gold/50 bg-gold/10 px-4 py-2.5 text-sm font-semibold hover:bg-gold/20">
          <RotateCcw className="h-4 w-4" /> Treinar outro caso
        </button>
      </div>

      <NavRow onBack={onBack} nextLabel="" />
    </Card>
  );
}

// ============ evolução ============
function montarEvolucao({
  anamnese, exame, evidencias, diags, linhas,
}: {
  anamnese: Anamnese;
  exame: Exame;
  evidencias: string[];
  diags: SaeDiagnostico[];
  linhas: LinhaPresc[];
}): string {
  const dt = new Date().toLocaleString("pt-BR");
  const ident = [
    anamnese.paciente && `Paciente: ${anamnese.paciente}`,
    anamnese.idade && `Idade: ${anamnese.idade}`,
    anamnese.sexo && `Sexo: ${anamnese.sexo}`,
    anamnese.leito && `Leito: ${anamnese.leito}`,
    anamnese.clinica && `Clínica: ${anamnese.clinica}`,
  ].filter(Boolean).join(" | ");

  const sv = [
    exame.pa && `PA ${exame.pa} mmHg`,
    exame.fc && `FC ${exame.fc} bpm`,
    exame.fr && `FR ${exame.fr} irpm`,
    exame.sato2 && `SatO₂ ${exame.sato2}%`,
    exame.temp && `Tax ${exame.temp} °C`,
    exame.glasgow && `Glasgow ${exame.glasgow}`,
    exame.pupilas && `Pupilas ${exame.pupilas}`,
  ].filter(Boolean).join(" · ");

  return [
    `EVOLUÇÃO DE ENFERMAGEM — ${dt}`,
    "---------------------------------------------------------------",
    ident,
    "",
    "ANAMNESE:",
    anamnese.queixa ? `Queixa principal: ${anamnese.queixa}` : "Queixa principal não informada.",
    anamnese.hda ? `HDA: ${anamnese.hda}` : "",
    anamnese.antecedentes ? `Antecedentes: ${anamnese.antecedentes}` : "",
    "",
    "EXAME FÍSICO:",
    sv || "Sinais vitais não informados.",
    exame.chips.length ? `Achados: ${exame.chips.join("; ")}.` : "",
    exame.observacoes ? `Observações: ${exame.observacoes}` : "",
    "",
    "EVIDÊNCIAS CLÍNICAS / SINAIS E SINTOMAS:",
    evidencias.length ? evidencias.map((e) => `• ${e}`).join("\n") : "• Nenhuma evidência registrada.",
    "",
    "DIAGNÓSTICOS DE ENFERMAGEM (base ADEC):",
    diags.length
      ? diags.map((d, i) => `${i + 1}. ${d.diagnostico} (${d.id})${d.meta ? ` — Meta: ${d.meta}` : ""}`).join("\n")
      : "• Nenhum diagnóstico selecionado.",
    "",
    "PRESCRIÇÃO DE ENFERMAGEM:",
    linhas.length
      ? linhas
          .map(
            (l, i) =>
              `${String(i + 1).padStart(2, "0")}. ${l.conduta} — Horário: ${l.horario || "—"} | Aprazamento: ${l.aprazamento || "—"} | Prioridade: ${l.prioridade || "—"}`,
          )
          .join("\n")
      : "• Nenhuma intervenção prescrita.",
    "",
    "Registro gerado em treinamento clínico no aplicativo Academia da Enfermagem (ADEC).",
  ]
    .filter((l) => l !== "")
    .join("\n");
}

// ============ helpers UI ============
function SectionTitle({
  icon: Icon, title, subtitle,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-4 flex items-start gap-3">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl gold-gradient">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h2 className="font-display text-lg font-bold">{title}</h2>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
    </div>
  );
}

function NavRow({
  onBack, onNext, nextLabel, nextDisabled,
}: {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel: string;
  nextDisabled?: boolean;
}) {
  return (
    <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4">
      {onBack ? (
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-sm font-semibold hover:bg-muted"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar
        </button>
      ) : <span />}
      {onNext && nextLabel && (
        <button
          onClick={onNext}
          disabled={nextDisabled}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:opacity-90 disabled:opacity-40"
        >
          {nextLabel} <ArrowRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
