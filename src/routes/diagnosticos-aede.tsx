import { createFileRoute } from "@tanstack/react-router";
import { ContentProtection } from "@/components/ContentProtection";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppShell, Card, PageHeader } from "@/components/AppShell";
import { MiniAppContent } from "@/components/MiniAppContent";
import { supabase } from "@/integrations/supabase/client";
import { useAuthReady } from "@/lib/access";
import {
  ClipboardList,
  Stethoscope,
  Activity,
  ListChecks,
  FileText,
  Printer,
  Copy,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute("/diagnosticos-aede")({
  head: () => ({
    meta: [
      { title: "Diagnósticos e Prescrição AE/DE — Academia da Enfermagem" },
      {
        name: "description",
        content:
          "Monte anamnese, exame físico, sinais/sintomas, escolha diagnósticos com Condutas (CDE), Meta (MM), Raciocínio Clínico (RC) e gere a prescrição de enfermagem em 5 passos.",
      },
    ],
  }),
  component: DiagnosticosAedePage,
});

type Diag = {
  id: string;
  id_gatilho: string;
  bloco: string;
  bloco_label: string;
  titulo: string;
  sinais_sintomas: string[];
  meta_mm: string | null;
  raciocinio_rc: string | null;
  ordem: number;
};

type Conduta = {
  id: string;
  diagnostico_id: string;
  ordem: number;
  conduta_cde: string;
  aprazamento: string | null;
  horario_padrao: string | null;
};

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

type QuickCase = {
  title: string;
  subtitle: string;
  anamnese: Partial<Anamnese>;
  exame: Partial<Exame>;
  sintomas: string[];
};

// chips do exame físico (por sistema) → também alimentam os sinais/sintomas do passo 3
const EXAME_CHIPS: Record<string, string[]> = {
  "Neurológico": ["Sonolência", "Rebaixamento do nível de consciência", "Agitação psicomotora", "Desorientação", "Pupilas anisocóricas"],
  "Cardiovascular": ["Hipertensão", "Hipotensão", "Taquicardia", "Bradicardia", "Edema", "Má perfusão"],
  "Respiratório": ["Dispneia", "Taquipneia", "Uso de musculatura acessória", "Cianose", "Sibilos", "Estertores", "Baixa SatO₂"],
  "Gastrointestinal": ["Náusea", "Vômito", "Distensão abdominal", "Dor abdominal", "Diarreia", "Constipação"],
  "Urinário": ["Oligúria", "Anúria", "Disúria", "Urina turva", "Hematúria"],
  "Pele e Mucosas": ["Palidez", "Icterícia", "Ressecamento", "Lesão de pele", "Ferida operatória", "Hiperemia"],
  "Segurança / Mobilidade": ["Risco de queda", "Restrição no leito", "Dispositivos invasivos", "Dor à movimentação"],
  "Sinais gerais": ["Febre", "Hipotermia", "Sudorese", "Dor referida", "Ansiedade", "Sangramento"],
};

const QUICK_CASES: QuickCase[] = [
  {
    title: "Respiratório agudo",
    subtitle: "Dispneia, taquipneia, baixa SatO₂ e cianose",
    anamnese: { queixa: "Falta de ar e desconforto respiratório", clinica: "Clínica médica" },
    exame: { fr: "28", sato2: "89", chips: ["Dispneia", "Taquipneia", "Baixa SatO₂", "Cianose"] },
    sintomas: ["Dispneia", "Taquipneia", "Baixa SatO₂", "Cianose"],
  },
  {
    title: "Hemodinâmico",
    subtitle: "Hipotensão, taquicardia, má perfusão e oligúria",
    anamnese: { queixa: "Fraqueza intensa e tontura", clinica: "Urgência" },
    exame: { pa: "85x50", fc: "122", chips: ["Hipotensão", "Taquicardia", "Má perfusão", "Oligúria"] },
    sintomas: ["Hipotensão", "Taquicardia", "Má perfusão", "Oligúria"],
  },
  {
    title: "Neurológico",
    subtitle: "Sonolência, desorientação e risco de queda",
    anamnese: { queixa: "Confusão mental e sonolência", clinica: "Observação" },
    exame: { glasgow: "13", pupilas: "isocóricas", chips: ["Sonolência", "Desorientação", "Risco de queda"] },
    sintomas: ["Sonolência", "Desorientação", "Risco de queda"],
  },
];

const DEFAULT_ANAMNESE: Anamnese = {
  paciente: "Paciente exemplo",
  idade: "68",
  sexo: "Feminino",
  leito: "204-B",
  clinica: "Clínica médica",
  queixa: "Falta de ar e desconforto respiratório",
  hda: "Início há 2 horas, evoluindo com dispneia, taquipneia e queda de saturação.",
  antecedentes: "HAS e DM. Alergias negadas. Em uso de medicação anti-hipertensiva.",
};

const DEFAULT_EXAME: Exame = {
  glasgow: "15",
  pupilas: "isocóricas",
  pa: "140x90",
  fc: "104",
  fr: "28",
  sato2: "89",
  temp: "36.6",
  observacoes: "Paciente ansiosa, com uso de musculatura acessória e cianose discreta.",
  chips: ["Dispneia", "Taquipneia", "Baixa SatO₂", "Cianose"],
};

const DEFAULT_SINTOMAS = ["Dispneia", "Taquipneia", "Baixa SatO₂", "Cianose"];

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function DiagnosticosAedePage() {
  const [step, setStep] = useState(1);
  const [anamnese, setAnamnese] = useState<Anamnese>(DEFAULT_ANAMNESE);
  const [exame, setExame] = useState<Exame>(DEFAULT_EXAME);
  const [sintomas, setSintomas] = useState<string[]>(DEFAULT_SINTOMAS);
  const [outroSintoma, setOutroSintoma] = useState("");
  const [selecionados, setSelecionados] = useState<string[]>([]);
  const [autoSeededDiag, setAutoSeededDiag] = useState(false);
  const [filtroBloco, setFiltroBloco] = useState<string>("");

  const { isReady } = useAuthReady();

  const diagsQ = useQuery({
    queryKey: ["diag_aede_all"],
    enabled: isReady,
    staleTime: 5 * 60_000,
    queryFn: async () => {
      const [{ data: d, error: e1 }, { data: c, error: e2 }] = await Promise.all([
        supabase.from("diagnosticos_aede").select("*").order("bloco").order("ordem"),
        supabase.from("diagnosticos_condutas").select("*").order("ordem"),
      ]);
      if (e1) throw e1;
      if (e2) throw e2;
      return { diags: (d ?? []) as Diag[], condutas: (c ?? []) as Conduta[] };
    },
  });

  // sintomas globais (chips do passo 3), a partir da base
  const sintomasBase = useMemo(() => {
    const set = new Map<string, string>(); // norm → display
    (diagsQ.data?.diags ?? []).forEach((d) => {
      d.sinais_sintomas.forEach((s) => {
        const k = normalize(s);
        if (k && !set.has(k)) set.set(k, s);
      });
    });
    return Array.from(set.values()).sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, [diagsQ.data]);

  const blocos = useMemo(() => {
    const m = new Map<string, string>();
    (diagsQ.data?.diags ?? []).forEach((d) => m.set(d.bloco, d.bloco_label));
    return Array.from(m.entries()).map(([bloco, label]) => ({ bloco, label }));
  }, [diagsQ.data]);

  // ranking dos diagnósticos que combinam
  const ranked = useMemo(() => {
    if (!diagsQ.data) return [];
    const selNorm = new Set(
      [...sintomas, ...exame.chips, ...outroSintoma.split(/[,;]/).map((x) => x.trim()).filter(Boolean)]
        .map(normalize)
        .filter(Boolean)
    );
    if (selNorm.size === 0) return [];
    return diagsQ.data.diags
      .filter((d) => !filtroBloco || d.bloco === filtroBloco)
      .map((d) => {
        const hits = d.sinais_sintomas
          .map((s) => normalize(s))
          .filter((s) => {
            for (const q of selNorm) {
              if (!q) continue;
              if (s.includes(q) || q.includes(s)) return true;
            }
            return false;
          });
        return { d, score: hits.length };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score);
  }, [diagsQ.data, sintomas, exame.chips, outroSintoma, filtroBloco]);

  const toggle = (list: string[], setList: (v: string[]) => void, v: string) => {
    setList(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  };

  const stepOk = {
    1: true, // anamnese opcional
    2: true,
    3: sintomas.length > 0 || exame.chips.length > 0 || outroSintoma.trim().length > 0,
    4: selecionados.length > 0,
    5: true,
  } as Record<number, boolean>;

  const go = (n: number) => {
    if (n === 3 && sintomas.length === 0) {
      // pré-popula chips do exame como sintomas
      setSintomas(exame.chips.slice());
    }
    setStep(n);
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 0);
  };

  const useQuickCase = (quick: QuickCase) => {
    setAnamnese({ ...anamnese, ...quick.anamnese });
    setExame({ ...exame, ...quick.exame, chips: quick.exame.chips ?? quick.sintomas });
    setSintomas(quick.sintomas);
    setSelecionados([]);
    setAutoSeededDiag(false);
    setStep(4);
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 0);
  };

  const condutasDe = (id: string) =>
    (diagsQ.data?.condutas ?? []).filter((c) => c.diagnostico_id === id);

  useEffect(() => {
    if (!autoSeededDiag && ranked.length > 0) {
      setSelecionados([ranked[0].d.id]);
      setAutoSeededDiag(true);
    }
  }, [autoSeededDiag, ranked]);

  return (
    <AppShell>
      <ContentProtection allowPrint>
      <PageHeader
        eyebrow="Guia Clínico"
        title="Diagnósticos e Prescrição AE/DE"
        description="Wizard de 5 passos: em 2 minutos você monta anamnese, exame físico, sinais/sintomas, escolhe diagnósticos e imprime a prescrição."
      />




      {/* Instruções */}
      <Card className="mb-5 border-gold/40 bg-gradient-to-br from-primary/5 to-gold/10">
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl gold-gradient">
            <ClipboardList className="h-5 w-5" />
          </div>
          <div className="text-sm text-foreground/90">
            <p className="mb-2 font-display text-base font-bold">Como usar em 2 minutos</p>
            <ol className="list-decimal space-y-1 pl-5">
              <li><strong>Anamnese</strong> — dados do paciente e queixa principal.</li>
              <li><strong>Exame Físico</strong> — o que você observou (por sistema).</li>
              <li><strong>Sinais e Sintomas</strong> — marque os chips do quadro.</li>
              <li><strong>Diagnósticos</strong> — o app mostra os que combinam com Condutas (CDE), Meta (MM) e Raciocínio (RC). Selecione os que se aplicam.</li>
              <li><strong>Prescrição</strong> — tabela pronta com Nº, Diagnóstico, Horário e Aprazamento. Imprima ou salve em PDF.</li>
            </ol>
          </div>
        </div>
      </Card>

      <ClinicalOverview
        step={step}
        onStep={go}
        anamnese={anamnese}
        exame={exame}
        sintomas={sintomas}
        diagnosticosCount={ranked.length}
        prescricoesCount={selecionados.length}
      />

      {/* Stepper */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        {[
          { n: 1, l: "Anamnese", I: ClipboardList },
          { n: 2, l: "Exame Físico", I: Stethoscope },
          { n: 3, l: "Sinais/Sintomas", I: Activity },
          { n: 4, l: "Diagnósticos", I: ListChecks },
          { n: 5, l: "Prescrição", I: FileText },
        ].map(({ n, l, I }) => {
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
      </div>

      {step === 1 && (
        <StepAnamnese anamnese={anamnese} setAnamnese={setAnamnese} onNext={() => go(2)} onUseCase={useQuickCase} />
      )}
      {step === 2 && (
        <StepExame
          exame={exame}
          setExame={setExame}
          onBack={() => go(1)}
          onNext={() => go(3)}
          toggle={(v) => toggle(exame.chips, (x) => setExame({ ...exame, chips: x }), v)}
        />
      )}
      {step === 3 && (
        <StepSintomas
          sintomasBase={sintomasBase}
          sintomas={sintomas}
          setSintomas={setSintomas}
          outroSintoma={outroSintoma}
          setOutroSintoma={setOutroSintoma}
          blocos={blocos}
          filtroBloco={filtroBloco}
          setFiltroBloco={setFiltroBloco}
          onBack={() => go(2)}
          onNext={() => go(4)}
          canNext={stepOk[3]}
        />
      )}
      {step === 4 && (
        <StepDiagnosticos
          loading={diagsQ.isLoading}
          ranked={ranked}
          condutasDe={condutasDe}
          sintomas={sintomas}
          exameChips={exame.chips}
          selecionados={selecionados}
          setSelecionados={setSelecionados}
          onBack={() => go(3)}
          onNext={() => go(5)}
        />
      )}
      {step === 5 && diagsQ.data && (
        <StepPrescricao
          anamnese={anamnese}
          diagsSelecionados={diagsQ.data.diags.filter((d) => selecionados.includes(d.id))}
          condutas={diagsQ.data.condutas.filter((c) => selecionados.includes(c.diagnostico_id))}
          onBack={() => go(4)}
        />
      )}
    </ContentProtection>
    </AppShell>
  );
}

// ============ STEP 1 ============
function StepAnamnese({
  anamnese, setAnamnese, onNext, onUseCase,
}: {
  anamnese: Anamnese;
  setAnamnese: (a: Anamnese) => void;
  onNext: () => void;
  onUseCase: (quick: QuickCase) => void;
}) {
  const F = (k: keyof Anamnese, label: string, opts: { textarea?: boolean; type?: string; placeholder?: string } = {}) => (
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
      <SectionTitle icon={ClipboardList} title="1. Anamnese" subtitle="Todos os campos são opcionais — preencha o que quiser." />

      <div className="mb-4 grid gap-2 md:grid-cols-3">
        {QUICK_CASES.map((quick) => (
          <button
            key={quick.title}
            onClick={() => onUseCase(quick)}
            className="rounded-xl border border-gold/40 bg-gold/10 p-3 text-left transition-colors hover:border-gold hover:bg-gold/20"
          >
            <span className="block font-display text-sm font-bold text-foreground">{quick.title}</span>
            <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{quick.subtitle}</span>
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
  exame, setExame, onBack, onNext, toggle,
}: {
  exame: Exame;
  setExame: (e: Exame) => void;
  onBack: () => void;
  onNext: () => void;
  toggle: (v: string) => void;
}) {
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
      <SectionTitle icon={Stethoscope} title="2. Exame Físico" subtitle="Registre valores e marque os achados observados." />

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
          Observações
          <textarea
            rows={2}
            value={exame.observacoes}
            onChange={(e) => setExame({ ...exame, observacoes: e.target.value })}
            className="mt-1 w-full rounded-lg border border-border bg-background px-2 py-1.5 text-sm font-normal"
          />
        </label>
      </div>

      <NavRow onBack={onBack} onNext={onNext} nextLabel="Avançar para Sinais e Sintomas" />
    </Card>
  );
}

// ============ STEP 3 ============
function StepSintomas({
  sintomasBase, sintomas, setSintomas, outroSintoma, setOutroSintoma,
  blocos, filtroBloco, setFiltroBloco, onBack, onNext, canNext,
}: {
  sintomasBase: string[];
  sintomas: string[];
  setSintomas: (v: string[]) => void;
  outroSintoma: string;
  setOutroSintoma: (v: string) => void;
  blocos: { bloco: string; label: string }[];
  filtroBloco: string;
  setFiltroBloco: (v: string) => void;
  onBack: () => void;
  onNext: () => void;
  canNext: boolean;
}) {
  const toggle = (v: string) =>
    setSintomas(sintomas.includes(v) ? sintomas.filter((x) => x !== v) : [...sintomas, v]);

  return (
    <Card>
      <SectionTitle icon={Activity} title="3. Sinais e Sintomas" subtitle="Marque os chips do quadro do paciente. Você pode filtrar por sistema." />

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <label className="text-xs font-semibold">
          Sistema / Clínica
          <select
            value={filtroBloco}
            onChange={(e) => setFiltroBloco(e.target.value)}
            className="ml-2 rounded-lg border border-border bg-background px-2 py-1 text-sm"
          >
            <option value="">Todos</option>
            {blocos.map((b) => (
              <option key={b.bloco} value={b.bloco}>{b.label}</option>
            ))}
          </select>
        </label>
        <span className="text-xs text-muted-foreground">
          {sintomas.length} selecionado{sintomas.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {sintomasBase.map((s) => {
          const active = sintomas.includes(s);
          return (
            <button
              key={s}
              onClick={() => toggle(s)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                active
                  ? "gold-gradient border-transparent"
                  : "border-border bg-background hover:border-gold/60 hover:text-primary"
              }`}
            >
              {s}
            </button>
          );
        })}
      </div>

      <div className="mt-4">
        <label className="block text-xs font-semibold">
          Outro sintoma (separe por vírgula)
          <input
            value={outroSintoma}
            onChange={(e) => setOutroSintoma(e.target.value)}
            placeholder="Ex.: sudorese fria, tontura súbita"
            className="mt-1 w-full rounded-lg border border-border bg-background px-2 py-1.5 text-sm font-normal"
          />
        </label>
      </div>

      <NavRow onBack={onBack} onNext={onNext} nextLabel="Ver diagnósticos" nextDisabled={!canNext} />
    </Card>
  );
}

// ============ STEP 4 ============
function StepDiagnosticos({
  loading, ranked, condutasDe, sintomas, exameChips, selecionados, setSelecionados, onBack, onNext,
}: {
  loading: boolean;
  ranked: { d: Diag; score: number }[];
  condutasDe: (id: string) => Conduta[];
  sintomas: string[];
  exameChips: string[];
  selecionados: string[];
  setSelecionados: (v: string[]) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const toggleSel = (id: string) =>
    setSelecionados(
      selecionados.includes(id) ? selecionados.filter((x) => x !== id) : [...selecionados, id]
    );

  const selNorm = new Set([...sintomas, ...exameChips].map(normalize));
  const bateu = (s: string) => {
    const n = normalize(s);
    for (const q of selNorm) if (q && (n.includes(q) || q.includes(n))) return true;
    return false;
  };

  return (
    <Card>
      <SectionTitle icon={ListChecks} title="4. Diagnósticos sugeridos" subtitle="Marque os diagnósticos que se aplicam ao seu paciente." />

      {loading ? (
        <p className="text-sm text-muted-foreground">Carregando base…</p>
      ) : ranked.length === 0 ? (
        <div className="rounded-xl border border-warning/40 bg-warning/10 p-4 text-sm">
          Nenhum diagnóstico da base combinou com os sinais selecionados. Volte e ajuste os sintomas.
        </div>
      ) : (
        <div className="space-y-4">
          {ranked.map(({ d, score }) => {
            const on = selecionados.includes(d.id);
            const condutas = condutasDe(d.id);
            return (
              <div
                key={d.id}
                className={`rounded-2xl border p-4 transition-colors ${
                  on ? "border-gold/70 bg-gold/10 shadow-[var(--shadow-soft)]" : "border-border bg-card/70"
                }`}
              >
                <div className="mb-2 flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={() => toggleSel(d.id)}
                    className="mt-1 h-5 w-5 accent-primary"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-primary">
                        {d.bloco_label}
                      </span>
                      <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
                        {d.id_gatilho}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {score === 1 ? "1 sinal" : `${score} sinais`} em comum
                      </span>
                    </div>
                    <h3 className="mt-1 font-display text-base font-bold text-foreground">{d.titulo}</h3>
                  </div>
                </div>

                <div className="mb-3 flex flex-wrap gap-1.5">
                  {d.sinais_sintomas.map((s) => (
                    <span
                      key={s}
                      className={`rounded-full px-2 py-0.5 text-[11px] ${
                        bateu(s)
                          ? "gold-gradient font-semibold"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {s}
                    </span>
                  ))}
                </div>

                {d.meta_mm && (
                  <div className="mb-2 rounded-lg border border-success/30 bg-success/10 p-2.5 text-sm">
                    <p className="mb-0.5 text-[10px] font-bold uppercase tracking-wide text-success">Meta (MM)</p>
                    {d.meta_mm}
                  </div>
                )}
                {d.raciocinio_rc && (
                  <div className="mb-2 rounded-lg border border-gold/40 bg-gold/10 p-2.5 text-sm">
                    <p className="mb-0.5 text-[10px] font-bold uppercase tracking-wide text-gold-foreground">Raciocínio Clínico (RC)</p>
                    {d.raciocinio_rc}
                  </div>
                )}

                {condutas.length > 0 && (
                  <div>
                    <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wide text-primary">Condutas (CDE) e Aprazamento</p>
                    <ol className="space-y-1.5">
                      {condutas.map((c) => (
                        <li key={c.id} className="flex items-start gap-2 text-sm">
                          <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full gold-gradient text-[10px] font-bold">
                            {c.ordem}
                          </span>
                          <div className="flex-1">
                            <p>{c.conduta_cde}</p>
                            {c.aprazamento && (
                              <p className="text-xs text-muted-foreground">
                                <strong>Aprazamento:</strong> {c.aprazamento}
                                {c.horario_padrao && c.horario_padrao !== c.aprazamento ? (
                                  <> · <strong>Horários:</strong> {c.horario_padrao}</>
                                ) : null}
                              </p>
                            )}
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <NavRow
        onBack={onBack}
        onNext={onNext}
        nextLabel={`Gerar Prescrição (${selecionados.length})`}
        nextDisabled={selecionados.length === 0}
      />
    </Card>
  );
}

// ============ STEP 5 ============
function StepPrescricao({
  anamnese, diagsSelecionados, condutas, onBack,
}: {
  anamnese: Anamnese;
  diagsSelecionados: Diag[];
  condutas: Conduta[];
  onBack: () => void;
}) {
  const rows = useMemo(() => {
    const out: { n: number; diag: string; horario: string; aprazamento: string }[] = [];
    diagsSelecionados.forEach((d, i) => {
      const cs = condutas.filter((c) => c.diagnostico_id === d.id).sort((a, b) => a.ordem - b.ordem);
      cs.forEach((c) => {
        out.push({
          n: i + 1,
          diag: d.titulo,
          horario: c.horario_padrao || "—",
          aprazamento: `${c.conduta_cde}${c.aprazamento ? ` — ${c.aprazamento}` : ""}`,
        });
      });
    });
    return out;
  }, [diagsSelecionados, condutas]);

  const dataExt = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });

  const handlePrint = () => {
    const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
    const header = `
      <div class="cab">
        <div><strong>Paciente:</strong> ${esc(anamnese.paciente || "—")}</div>
        <div><strong>Leito:</strong> ${esc(anamnese.leito || "—")} · <strong>Clínica:</strong> ${esc(anamnese.clinica || "—")}</div>
        <div><strong>Data:</strong> ${dataExt}</div>
      </div>`;
    const body = rows
      .map((r) => `<tr><td>${r.n}</td><td>${esc(r.diag)}</td><td>${esc(r.horario)}</td><td>${esc(r.aprazamento)}</td></tr>`)
      .join("");
    const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<title>Prescrição de Enfermagem</title>
<style>
  @page { size: A4; margin: 1.8cm 1.5cm; }
  body { font-family: "Times New Roman", Times, serif; font-size: 11pt; color:#000; }
  h1 { font-size: 14pt; text-transform: uppercase; text-align:center; margin: 0 0 8pt 0; }
  .cab { font-size: 10.5pt; margin-bottom: 12pt; display:flex; justify-content:space-between; flex-wrap:wrap; gap:6pt; }
  table { width:100%; border-collapse: collapse; }
  th, td { border: 1px solid #000; padding: 5pt 6pt; text-align:left; vertical-align: top; }
  th { background:#e5e5e5; font-size: 10.5pt; }
  td:nth-child(1) { width: 5%; text-align:center; }
  td:nth-child(3) { width: 22%; }
  tbody tr:nth-child(even) td { background:#f7f7f7; }
</style></head><body>
<h1>Prescrição de Enfermagem</h1>
${header}
<table>
  <thead><tr><th>Nº</th><th>Diagnóstico</th><th>Horário</th><th>Aprazamento</th></tr></thead>
  <tbody>${body}</tbody>
</table>
<script>window.onload=()=>window.print();</script>
</body></html>`;
    const w = window.open("", "_blank");
    if (!w) { alert("Permita pop-ups para abrir a prescrição."); return; }
    w.document.write(html);
    w.document.close();
  };

  const handleCopy = async () => {
    const header = ["Nº", "Diagnóstico", "Horário", "Aprazamento"].join("\t");
    const body = rows.map((r) => [r.n, r.diag, r.horario, r.aprazamento].join("\t")).join("\n");
    try {
      await navigator.clipboard.writeText(header + "\n" + body);
      alert("Tabela copiada!");
    } catch {
      alert("Não foi possível copiar.");
    }
  };

  return (
    <Card>
      <SectionTitle icon={FileText} title="5. Prescrição gerada" subtitle="Confira, imprima ou salve em PDF." />

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
              <th className="px-3 py-2 text-left w-12">Nº</th>
              <th className="px-3 py-2 text-left">Diagnóstico</th>
              <th className="px-3 py-2 text-left w-56">Horário</th>
              <th className="px-3 py-2 text-left">Aprazamento</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-t border-border/60 align-top">
                <td className="px-3 py-2 text-center font-semibold">{r.n}</td>
                <td className="px-3 py-2">{r.diag}</td>
                <td className="px-3 py-2 whitespace-nowrap font-mono text-xs">{r.horario}</td>
                <td className="px-3 py-2">{r.aprazamento}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground hover:opacity-90"
        >
          <Printer className="h-4 w-4" /> Imprimir / Salvar PDF
        </button>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold hover:bg-muted"
        >
          <Copy className="h-4 w-4" /> Copiar tabela
        </button>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold hover:bg-muted"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar aos diagnósticos
        </button>
      </div>
    </Card>
  );
}

function ClinicalOverview({
  step,
  onStep,
  anamnese,
  exame,
  sintomas,
  diagnosticosCount,
  prescricoesCount,
}: {
  step: number;
  onStep: (n: number) => void;
  anamnese: Anamnese;
  exame: Exame;
  sintomas: string[];
  diagnosticosCount: number;
  prescricoesCount: number;
}) {
  const items = [
    {
      step: 1,
      title: "Anamnese",
      icon: ClipboardList,
      body: `${anamnese.queixa || "Queixa não informada"} · ${anamnese.clinica || "setor em branco"}`,
    },
    {
      step: 2,
      title: "Exame físico",
      icon: Stethoscope,
      body: `PA ${exame.pa || "—"} · FC ${exame.fc || "—"} · FR ${exame.fr || "—"} · SatO₂ ${exame.sato2 || "—"}`,
    },
    {
      step: 4,
      title: "Diagnósticos",
      icon: ListChecks,
      body: `${diagnosticosCount} ${diagnosticosCount === 1 ? "sugestão" : "sugestões"} com base em: ${sintomas.slice(0, 3).join(", ") || "—"}`,
    },
    {
      step: 5,
      title: "Prescrição",
      icon: FileText,
      body: `${prescricoesCount} diagnóstico${prescricoesCount === 1 ? "" : "s"} selecionado${prescricoesCount === 1 ? "" : "s"} para gerar tabela`,
    },
  ];

  return (
    <Card className="mb-5 border-primary/30 bg-primary/5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-primary">Caso clínico pronto para editar</p>
          <h2 className="font-display text-lg font-bold text-foreground">Anamnese, exame físico, diagnóstico e prescrição</h2>
        </div>
        <button
          onClick={() => onStep(5)}
          disabled={prescricoesCount === 0}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:opacity-90 disabled:opacity-40"
        >
          Ver prescrição <ArrowRight className="h-4 w-4" />
        </button>
      </div>
      <div className="grid gap-2 md:grid-cols-4">
        {items.map(({ step: n, title, icon: Icon, body }) => (
          <button
            key={title}
            onClick={() => onStep(n)}
            className={`rounded-xl border p-3 text-left transition-colors ${
              step === n ? "border-gold bg-gold/15" : "border-border bg-background/70 hover:border-gold/60"
            }`}
          >
            <span className="mb-2 flex items-center gap-2 text-sm font-bold text-foreground">
              <Icon className="h-4 w-4 text-primary" /> {title}
            </span>
            <span className="block text-xs leading-relaxed text-muted-foreground">{body}</span>
          </button>
        ))}
      </div>
    </Card>
  );
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
      {onNext && (
        <button
          onClick={onNext}
          disabled={nextDisabled}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:opacity-90 disabled:opacity-40"
        >
          {nextDisabled ? <CheckCircle2 className="h-4 w-4 opacity-50" /> : null}
          {nextLabel} <ArrowRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
