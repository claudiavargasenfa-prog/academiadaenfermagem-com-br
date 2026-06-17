import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell, Card, PageHeader } from "@/components/AppShell";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Info,
  Stethoscope,
  ClipboardList,
} from "lucide-react";
import { useLocal } from "@/lib/storage";

export const Route = createFileRoute("/exame-fisico-escalas")({
  head: () => ({
    meta: [
      { title: "Exame Físico e Escalas de Avaliação — Academia de Enfermagem" },
      {
        name: "description",
        content:
          "Exame físico cefalocaudal com explicações por região e principais escalas clínicas (Glasgow, Braden, Morse, Fugulin, RASS).",
      },
    ],
  }),
  component: Page,
});

/* =========================================================
   EXAME FÍSICO — regiões com explicação + ilustração SVG
   ========================================================= */

type Regiao = {
  id: string;
  titulo: string;
  itens: { nome: string; oque: string }[];
  svg: React.ReactNode;
};

const G = "hsl(160 84% 30%)"; // verde mais escuro

const HeadSVG = (
  <svg viewBox="0 0 64 64" className="h-full w-full">
    <ellipse cx="32" cy="30" rx="18" ry="22" fill="#fde7c8" stroke={G} strokeWidth="2" />
    <path d="M14 26 Q32 4 50 26" fill="#4a2c1a" />
    <circle cx="26" cy="30" r="2" fill={G} />
    <circle cx="38" cy="30" r="2" fill={G} />
    <path d="M28 42 Q32 46 36 42" stroke={G} strokeWidth="2" fill="none" />
    <rect x="28" y="52" width="8" height="8" fill="#fde7c8" stroke={G} strokeWidth="2" />
  </svg>
);

const ToraxSVG = (
  <svg viewBox="0 0 64 64" className="h-full w-full">
    <rect x="14" y="12" width="36" height="40" rx="6" fill="#fde7c8" stroke={G} strokeWidth="2" />
    <path d="M18 22 H46 M18 30 H46 M18 38 H46" stroke={G} strokeWidth="1.5" />
    <path d="M32 20 v26" stroke={G} strokeWidth="2" />
    <circle cx="24" cy="34" r="2" fill={G} />
    <circle cx="40" cy="34" r="2" fill={G} />
  </svg>
);

const AbdomeSVG = (
  <svg viewBox="0 0 64 64" className="h-full w-full">
    <path d="M14 14 H50 V44 Q32 56 14 44 Z" fill="#fde7c8" stroke={G} strokeWidth="2" />
    <line x1="32" y1="14" x2="32" y2="44" stroke={G} strokeWidth="1" />
    <line x1="14" y1="29" x2="50" y2="29" stroke={G} strokeWidth="1" />
    <circle cx="32" cy="32" r="2" fill={G} />
  </svg>
);

const MembrosSVG = (
  <svg viewBox="0 0 64 64" className="h-full w-full">
    <rect x="20" y="10" width="6" height="44" rx="3" fill="#fde7c8" stroke={G} strokeWidth="2" />
    <rect x="38" y="10" width="6" height="44" rx="3" fill="#fde7c8" stroke={G} strokeWidth="2" />
    <circle cx="23" cy="58" r="3" fill={G} />
    <circle cx="41" cy="58" r="3" fill={G} />
  </svg>
);

const PeleSVG = (
  <svg viewBox="0 0 64 64" className="h-full w-full">
    <rect x="8" y="8" width="48" height="48" rx="6" fill="#fde7c8" stroke={G} strokeWidth="2" />
    <path d="M14 20 Q22 14 30 20 T46 20" stroke={G} strokeWidth="1.5" fill="none" />
    <path d="M14 32 Q22 26 30 32 T46 32" stroke={G} strokeWidth="1.5" fill="none" />
    <path d="M14 44 Q22 38 30 44 T46 44" stroke={G} strokeWidth="1.5" fill="none" />
  </svg>
);

const regioes: Regiao[] = [
  {
    id: "cabeca",
    titulo: "Cabeça e Pescoço",
    svg: HeadSVG,
    itens: [
      { nome: "Inspeção do couro cabeludo", oque: "Observe lesões, pediculose, simetria do crânio, presença de bossas ou afundamentos. Em RN, palpe fontanelas." },
      { nome: "Pupilas (PIFR)", oque: "Pupilas Isocóricas, Fotorreagentes e Redondas. Use lanterna; observe tamanho, simetria e reatividade à luz direta e consensual." },
      { nome: "Mucosas e hidratação", oque: "Inspecione lábios e mucosa oral: coradas e hidratadas? Avalie turgor da pele. Pálido = anemia; cianose = hipoxemia." },
      { nome: "Linfonodos cervicais", oque: "Palpe cadeias submandibular, cervical anterior/posterior e supraclavicular. Anote tamanho, mobilidade, consistência e dor." },
    ],
  },
  {
    id: "torax",
    titulo: "Tórax (Cardiopulmonar)",
    svg: ToraxSVG,
    itens: [
      { nome: "Expansibilidade torácica", oque: "Coloque as mãos no dorso do paciente e peça respiração profunda. Avalie simetria — assimetria sugere atelectasia, pneumotórax ou derrame." },
      { nome: "Ausculta pulmonar (MV e RA)", oque: "Ausculte em todos os campos (ápice, médio, base, anterior e posterior). MV preservado? Há ruídos adventícios (estertores, sibilos, roncos)?" },
      { nome: "Ausculta cardíaca (B1, B2, sopros)", oque: "Identifique focos aórtico, pulmonar, tricúspide e mitral. B1 (fechamento mitral/tricúspide) e B2 (aórtica/pulmonar). Anote sopros, ritmo e frequência." },
    ],
  },
  {
    id: "abdome",
    titulo: "Abdome",
    svg: AbdomeSVG,
    itens: [
      { nome: "Inspeção", oque: "Observe forma (plano, globoso, escavado), cicatrizes, distensão, circulação colateral, estomas e drenos." },
      { nome: "Ausculta de RHA", oque: "AUSCULTE ANTES DE PALPAR. Ruídos hidroaéreos em 4 quadrantes por pelo menos 1 minuto cada. Normal: 5–35/min." },
      { nome: "Percussão", oque: "Identifique áreas de timpanismo (gás) e macicez (líquido/órgãos). Macicez móvel sugere ascite." },
      { nome: "Palpação superficial e profunda", oque: "Comece longe da dor. Avalie dor, defesa, massas e visceromegalias. Sinal de Blumberg = irritação peritoneal." },
    ],
  },
  {
    id: "membros",
    titulo: "Membros (MMSS e MMII)",
    svg: MembrosSVG,
    itens: [
      { nome: "Pulsos periféricos", oque: "Palpe radial, braquial, femoral, poplíteo, tibial posterior e pedioso. Compare lado a lado. Classifique de 0 (ausente) a 4+ (saltitante)." },
      { nome: "Edema (cacifo)", oque: "Pressione tíbia ou maléolo por 5s. 1+ leve até 4+ profundo persistente. Sempre bilateral em insuf. cardíaca/renal." },
      { nome: "Perfusão (TEC < 3s)", oque: "Comprima o leito ungueal por 5s e solte. Tempo de enchimento capilar > 3s indica má perfusão / choque." },
      { nome: "Força e mobilidade", oque: "Teste de 0 (sem contração) a 5 (força normal contra resistência). Compare ambos os lados." },
    ],
  },
  {
    id: "pele",
    titulo: "Pele e Tegumentos",
    svg: PeleSVG,
    itens: [
      { nome: "Coloração", oque: "Corada / pálida / cianótica / ictérica / pletórica. Avalie em luz natural quando possível." },
      { nome: "Turgor", oque: "Pince a pele do dorso da mão. Retorno lento = desidratação. Em idosos, prefira região esternal." },
      { nome: "Lesões (avaliar Braden)", oque: "Procure proeminências ósseas (sacro, calcâneo, occipital, trocânter). Use a Escala de Braden para risco de LPP." },
      { nome: "Dispositivos invasivos", oque: "Inspecione AVP, AVC, SVD, SNG/SNE, drenos. Observe sinais flogísticos, fixação e data de troca." },
    ],
  },
];

function ExameFisico() {
  const [checks, setChecks] = useLocal<Record<string, boolean>>("exame-fisico-checks", {});
  const toggle = (k: string) => setChecks({ ...checks, [k]: !checks[k] });

  return (
    <Card>
      <div className="flex items-center gap-2">
        <Stethoscope className="h-5 w-5 text-primary" />
        <h2 className="font-display text-xl font-bold">Exame Físico Cefalocaudal</h2>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Toque em cada item para ver <strong>o que examinar</strong>. Marque conforme avança no atendimento.
      </p>

      <div className="mt-5 space-y-4">
        {regioes.map((r) => (
          <div key={r.id} className="rounded-2xl border border-border/60 bg-card/70 p-4">
            <div className="flex items-start gap-4">
              <div className="grid h-16 w-16 shrink-0 place-items-center rounded-xl bg-[hsl(160_84%_39%/0.12)] p-1">
                {r.svg}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-base font-bold text-[hsl(160_84%_25%)]">{r.titulo}</h3>
                <ul className="mt-2 space-y-1.5">
                  {r.itens.map((it) => {
                    const key = `${r.id}:${it.nome}`;
                    const done = !!checks[key];
                    return (
                      <li key={it.nome} className="flex items-center gap-1">
                        <button
                          onClick={() => toggle(key)}
                          className={`flex flex-1 items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition-colors ${
                            done ? "bg-[hsl(160_84%_39%/0.15)] text-foreground" : "hover:bg-secondary/60"
                          }`}
                        >
                          <CheckCircle2
                            className={`h-4 w-4 shrink-0 ${
                              done ? "text-[hsl(160_84%_30%)]" : "text-muted-foreground"
                            }`}
                          />
                          <span className={done ? "line-through opacity-70" : ""}>{it.nome}</span>
                        </button>
                        <Popover>
                          <PopoverTrigger asChild>
                            <button
                              aria-label={`Explicação: ${it.nome}`}
                              className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[hsl(160_84%_30%)] hover:bg-[hsl(160_84%_39%/0.15)]"
                            >
                              <Info className="h-4 w-4" />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-72 text-sm">
                            <p className="font-display text-sm font-bold text-[hsl(160_84%_25%)]">
                              {it.nome}
                            </p>
                            <p className="mt-1 text-sm text-foreground/85">{it.oque}</p>
                          </PopoverContent>
                        </Popover>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* =========================================================
   ESCALAS — Glasgow, Braden, Morse, Fugulin, RASS
   ========================================================= */

type Option = { label: string; value: number };
type Item = { id: string; label: string; options: Option[] };
type Scale = {
  id: string;
  name: string;
  subtitle: string;
  range: string;
  items: Item[];
  compute?: (sum: number, extras: Record<string, number>) => number;
  extras?: Item[];
  interpret: (score: number) => { label: string; tone: "good" | "warn" | "bad" };
  howTo: string[];
  indication: string[];
  contra: string[];
};

const scales: Scale[] = [
  {
    id: "glasgow",
    name: "Escala de Coma de Glasgow",
    subtitle: "Avaliação neurológica — TCE e rebaixamento de consciência",
    range: "1 a 15 pontos",
    items: [
      { id: "olhos", label: "Abertura ocular", options: [
        { label: "Espontânea", value: 4 }, { label: "Ao som / verbal", value: 3 },
        { label: "À pressão / dor", value: 2 }, { label: "Ausente", value: 1 },
      ]},
      { id: "verbal", label: "Resposta verbal", options: [
        { label: "Orientada", value: 5 }, { label: "Confusa", value: 4 },
        { label: "Palavras", value: 3 }, { label: "Sons", value: 2 }, { label: "Ausente", value: 1 },
      ]},
      { id: "motora", label: "Resposta motora", options: [
        { label: "Obedece comandos", value: 6 }, { label: "Localiza estímulo", value: 5 },
        { label: "Flexão normal", value: 4 }, { label: "Flexão anormal", value: 3 },
        { label: "Extensão", value: 2 }, { label: "Ausente", value: 1 },
      ]},
    ],
    extras: [{ id: "pupila", label: "Reatividade pupilar (subtrai)", options: [
      { label: "Ambas reagem", value: 0 }, { label: "1 não reage", value: -1 }, { label: "Nenhuma reage", value: -2 },
    ]}],
    compute: (sum, extras) => sum + (extras.pupila ?? 0),
    interpret: (n) => n <= 8 ? { label: "TCE grave", tone: "bad" }
      : n <= 12 ? { label: "TCE moderado", tone: "warn" } : { label: "TCE leve / sem alteração", tone: "good" },
    howTo: [
      "Avalie abertura ocular (1–4), resposta verbal (1–5) e motora (1–6).",
      "Teste a reatividade pupilar e subtraia 0 a 2 pontos do total.",
      "Score final varia de 1 a 15 — registre componentes separadamente (ex: O3 V4 M5).",
    ],
    indication: ["Trauma cranioencefálico (TCE).", "Rebaixamento agudo do nível de consciência.", "Pós-operatório neurocirúrgico."],
    contra: ["Sedação profunda ou bloqueio neuromuscular.", "Intubação limita resposta verbal.", "Edema palpebral, trauma facial, surdez."],
  },
  {
    id: "braden",
    name: "Escala de Braden",
    subtitle: "Risco de lesão por pressão",
    range: "6 a 23 pontos",
    items: [
      { id: "percepcao", label: "Percepção sensorial", options: [
        { label: "Totalmente limitada", value: 1 }, { label: "Muito limitada", value: 2 },
        { label: "Levemente limitada", value: 3 }, { label: "Nenhuma limitação", value: 4 },
      ]},
      { id: "umidade", label: "Umidade", options: [
        { label: "Constantemente úmida", value: 1 }, { label: "Muito úmida", value: 2 },
        { label: "Ocasionalmente úmida", value: 3 }, { label: "Raramente úmida", value: 4 },
      ]},
      { id: "atividade", label: "Atividade", options: [
        { label: "Acamado", value: 1 }, { label: "Confinado à cadeira", value: 2 },
        { label: "Anda ocasionalmente", value: 3 }, { label: "Anda frequentemente", value: 4 },
      ]},
      { id: "mobilidade", label: "Mobilidade", options: [
        { label: "Totalmente imóvel", value: 1 }, { label: "Muito limitada", value: 2 },
        { label: "Levemente limitada", value: 3 }, { label: "Não limitada", value: 4 },
      ]},
      { id: "nutricao", label: "Nutrição", options: [
        { label: "Muito pobre", value: 1 }, { label: "Provavelmente inadequada", value: 2 },
        { label: "Adequada", value: 3 }, { label: "Excelente", value: 4 },
      ]},
      { id: "friccao", label: "Fricção e cisalhamento", options: [
        { label: "Problema", value: 1 }, { label: "Problema potencial", value: 2 }, { label: "Nenhum problema", value: 3 },
      ]},
    ],
    interpret: (n) => n <= 9 ? { label: "Risco muito alto", tone: "bad" }
      : n <= 12 ? { label: "Risco alto", tone: "bad" }
      : n <= 14 ? { label: "Risco moderado", tone: "warn" }
      : n <= 18 ? { label: "Risco leve", tone: "warn" } : { label: "Sem risco", tone: "good" },
    howTo: ["Pontue as 6 subescalas e some.", "Total varia de 6 a 23.", "Escore ≤ 18 indica risco — iniciar prevenção."],
    indication: ["Pacientes acamados ou com restrição de mobilidade.", "Reavaliar a cada 24–48h."],
    contra: ["Pediatria — usar Braden Q.", "Não substitui inspeção diária da pele."],
  },
  {
    id: "morse",
    name: "Escala de Morse",
    subtitle: "Risco de queda em adultos",
    range: "0 a 125 pontos",
    items: [
      { id: "historico", label: "Histórico de quedas (3 meses)", options: [{ label: "Não", value: 0 }, { label: "Sim", value: 25 }]},
      { id: "diagnostico", label: "Diagnóstico secundário", options: [{ label: "Não", value: 0 }, { label: "Sim", value: 15 }]},
      { id: "auxilio", label: "Auxílio na deambulação", options: [
        { label: "Nenhum / acamado / cadeirante", value: 0 }, { label: "Muletas / bengala / andador", value: 15 }, { label: "Apoia-se em móveis", value: 30 },
      ]},
      { id: "iv", label: "Terapia IV / dispositivo", options: [{ label: "Não", value: 0 }, { label: "Sim", value: 20 }]},
      { id: "marcha", label: "Marcha", options: [{ label: "Normal / acamado", value: 0 }, { label: "Fraca", value: 10 }, { label: "Comprometida", value: 20 }]},
      { id: "mental", label: "Estado mental", options: [{ label: "Consciente das limitações", value: 0 }, { label: "Superestima limitações", value: 15 }]},
    ],
    interpret: (n) => n === 0 ? { label: "Sem risco", tone: "good" }
      : n <= 24 ? { label: "Risco baixo", tone: "good" }
      : n <= 44 ? { label: "Risco moderado", tone: "warn" } : { label: "Risco alto", tone: "bad" },
    howTo: ["Some os 6 critérios.", "0 = sem risco; 25–44 = moderado; ≥ 45 = alto.", "Reavalie a cada turno."],
    indication: ["Pacientes hospitalizados.", "Idosos, pós-op, em uso de sedativos/diuréticos."],
    contra: ["Repouso absoluto contínuo.", "Paralisia total.", "Pediatria — Humpty Dumpty."],
  },
  {
    id: "fugulin",
    name: "Escala de Fugulin",
    subtitle: "Classificação de cuidados de enfermagem",
    range: "9 a 36 pontos",
    items: ["Estado mental","Oxigenação","Sinais vitais","Motilidade","Deambulação","Alimentação","Cuidado corporal","Eliminação","Terapêutica"]
      .map<Item>((label, i) => ({ id: `f${i}`, label, options: [
        { label: "1", value: 1 }, { label: "2", value: 2 }, { label: "3", value: 3 }, { label: "4", value: 4 },
      ]})),
    interpret: (n) => n <= 14 ? { label: "Cuidado mínimo", tone: "good" }
      : n <= 20 ? { label: "Cuidado intermediário", tone: "good" }
      : n <= 26 ? { label: "Alta dependência", tone: "warn" }
      : n <= 31 ? { label: "Semi-intensivo", tone: "warn" } : { label: "Intensivo", tone: "bad" },
    howTo: ["Pontue 9 áreas de 1 a 4.", "Some para classificar a complexidade.", "Usada para dimensionamento de pessoal."],
    indication: ["Internação hospitalar.", "Planejamento de escala."],
    contra: ["Não usar como diagnóstico clínico.", "Inadequada em PS de alta rotatividade."],
  },
  {
    id: "rass",
    name: "Escala RASS",
    subtitle: "Richmond — sedação e agitação",
    range: "-5 a +4 pontos",
    items: [{ id: "rass", label: "Nível observado", options: [
      { label: "+4 Combativo", value: 4 }, { label: "+3 Muito agitado", value: 3 },
      { label: "+2 Agitado", value: 2 }, { label: "+1 Inquieto", value: 1 },
      { label: "0 Alerta e calmo", value: 0 }, { label: "-1 Sonolento", value: -1 },
      { label: "-2 Sedação leve", value: -2 }, { label: "-3 Sedação moderada", value: -3 },
      { label: "-4 Sedação profunda", value: -4 }, { label: "-5 Não desperta", value: -5 },
    ]}],
    interpret: (n) => n >= 2 ? { label: "Agitação importante", tone: "bad" }
      : n >= 1 ? { label: "Inquietação leve", tone: "warn" }
      : n === 0 ? { label: "Alvo ideal", tone: "good" }
      : n >= -2 ? { label: "Sedação leve", tone: "good" }
      : n >= -3 ? { label: "Sedação moderada", tone: "warn" } : { label: "Sedação profunda", tone: "bad" },
    howTo: ["Observe 10s: se calmo = 0; agitado de +1 a +4.", "Sem resposta verbal: estímulo físico, -1 a -5.", "Alvo em UTI: 0 a -2."],
    indication: ["Sedação em UTI.", "Ventilação mecânica e sedativos contínuos."],
    contra: ["Ambulatorial consciente e orientado.", "Sem distúrbios neuropsíquicos agudos."],
  },
];

function toneClasses(tone: "good" | "warn" | "bad") {
  if (tone === "good") return "bg-[hsl(160_84%_30%)] text-white";
  if (tone === "warn") return "bg-[hsl(38_92%_50%)] text-white";
  return "bg-[hsl(0_84%_60%)] text-white";
}

function ScaleCard({ scale }: { scale: Scale }) {
  const [values, setValues] = useState<Record<string, number>>({});
  const [extras, setExtras] = useState<Record<string, number>>({});

  const requiredIds = scale.items.map((i) => i.id);
  const complete = requiredIds.every((id) => values[id] !== undefined);
  const sum = Object.values(values).reduce((a, b) => a + b, 0);
  const score = useMemo(
    () => (scale.compute ? scale.compute(sum, extras) : sum),
    [sum, extras, scale],
  );
  const result = complete ? scale.interpret(score) : null;

  function reset() { setValues({}); setExtras({}); }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="calc" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-[hsl(160_84%_30%/0.1)]">
          <TabsTrigger
            value="calc"
            className="data-[state=active]:bg-[hsl(160_84%_25%)] data-[state=active]:text-white"
          >Calcular</TabsTrigger>
          <TabsTrigger
            value="como"
            className="data-[state=active]:bg-[hsl(160_84%_25%)] data-[state=active]:text-white"
          >Como usar</TabsTrigger>
          <TabsTrigger
            value="ind"
            className="data-[state=active]:bg-[hsl(160_84%_25%)] data-[state=active]:text-white"
          >Indicação</TabsTrigger>
          <TabsTrigger
            value="contra"
            className="data-[state=active]:bg-[hsl(160_84%_25%)] data-[state=active]:text-white"
          >Limites</TabsTrigger>
        </TabsList>

        <TabsContent value="calc" className="mt-4 space-y-4">
          {scale.items.map((item) => (
            <ScoreRow key={item.id} item={item} value={values[item.id]}
              onPick={(v) => setValues({ ...values, [item.id]: v })} />
          ))}
          {scale.extras?.map((item) => (
            <ScoreRow key={item.id} item={item} value={extras[item.id]}
              onPick={(v) => setExtras({ ...extras, [item.id]: v })} modifier />
          ))}

          {/* Score final destacado */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-[hsl(160_84%_30%)] bg-[hsl(160_84%_30%/0.08)] p-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[hsl(160_84%_25%)]">
                Score final · {scale.range}
              </p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-display text-4xl font-extrabold text-[hsl(160_84%_25%)]">
                  {complete ? score : "—"}
                </span>
                {result && (
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${toneClasses(result.tone)}`}>
                    {result.label}
                  </span>
                )}
              </div>
              {!complete && (
                <p className="mt-1 text-xs text-muted-foreground">Preencha todos os itens para ver o resultado.</p>
              )}
            </div>
            <button onClick={reset}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[hsl(160_84%_30%)] bg-background px-3 py-1.5 text-xs font-semibold text-[hsl(160_84%_25%)] hover:bg-[hsl(160_84%_30%/0.1)]">
              <RotateCcw className="h-3.5 w-3.5" /> Limpar
            </button>
          </div>
        </TabsContent>

        <TabsContent value="como" className="mt-4">
          <InfoList icon={<BookOpen className="h-4 w-4" />} items={scale.howTo} />
        </TabsContent>
        <TabsContent value="ind" className="mt-4">
          <InfoList icon={<CheckCircle2 className="h-4 w-4" />} items={scale.indication} />
        </TabsContent>
        <TabsContent value="contra" className="mt-4">
          <InfoList icon={<AlertTriangle className="h-4 w-4" />} items={scale.contra} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ScoreRow({ item, value, onPick, modifier }: {
  item: Item; value?: number; onPick: (v: number) => void; modifier?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/60 p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-foreground">{item.label}</p>
        {value !== undefined && (
          <span className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${
            modifier ? "bg-[hsl(38_92%_50%/0.15)] text-[hsl(38_92%_40%)]"
              : "bg-[hsl(160_84%_30%/0.15)] text-[hsl(160_84%_25%)]"
          }`}>{value > 0 ? `+${value}` : value}</span>
        )}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {item.options.map((opt) => {
          const active = value === opt.value;
          return (
            <button key={opt.label} onClick={() => onPick(opt.value)}
              className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
                active ? "border-transparent bg-[hsl(160_84%_25%)] text-white shadow-sm"
                  : "border-border/60 bg-background text-foreground hover:border-[hsl(160_84%_30%)] hover:text-[hsl(160_84%_25%)]"
              }`}>
              {opt.label}<span className="ml-1 opacity-70">{opt.value > 0 ? `+${opt.value}` : opt.value}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function InfoList({ icon, items }: { icon: React.ReactNode; items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((t, i) => (
        <li key={i} className="flex gap-2 text-sm text-foreground">
          <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md bg-[hsl(160_84%_30%/0.12)] text-[hsl(160_84%_25%)]">
            {icon}
          </span>
          <span className="leading-relaxed">{t}</span>
        </li>
      ))}
    </ul>
  );
}

function Escalas() {
  return (
    <Card className="p-2 md:p-3">
      <div className="flex items-center gap-2 px-3 pt-3">
        <ClipboardList className="h-5 w-5 text-primary" />
        <h2 className="font-display text-xl font-bold">Escalas e Scores</h2>
      </div>
      <p className="px-3 pb-2 text-sm text-muted-foreground">
        Toque na escala para abrir. O score final aparece destacado ao terminar.
      </p>
      <Accordion type="single" collapsible className="w-full">
        {scales.map((s, idx) => (
          <AccordionItem
            key={s.id}
            value={s.id}
            className={`border-0 ${idx > 0 ? "border-t-4 border-[hsl(160_84%_30%)]" : ""}`}
          >
            <AccordionTrigger className="px-3 py-4 hover:no-underline data-[state=open]:bg-[hsl(160_84%_30%/0.06)]">
              <div className="flex flex-col items-start text-left">
                <span className="font-display text-base font-bold text-foreground">{s.name}</span>
                <span className="text-xs font-normal text-muted-foreground">{s.subtitle}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-3 pb-4">
              <ScaleCard scale={s} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Card>
  );
}

function Page() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Avaliação Clínica"
        title="Exame Físico e Escalas de Avaliação"
        description="Roteiro cefalocaudal interativo e as principais escalas de enfermagem em um único lugar."
      />
      <div className="space-y-6">
        <ExameFisico />
        <Escalas />
      </div>
    </AppShell>
  );
}
