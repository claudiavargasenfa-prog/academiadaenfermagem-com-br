import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Brain,
  Check,
  ChevronDown,
  CircleHelp,
  ExternalLink,
  Eye,
  Heart,
  HeartHandshake,
  LifeBuoy,
  MessageCircle,
  Moon,
  RefreshCcw,
  Scale,
  Shield,
  Sparkles,
  Stethoscope,
  Users,
  Wind,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import espelhoImage from "@/assets/cuidando-espelho.jpg";
import { renderContent } from "@/lib/markdown";

const STORAGE_KEY = "adec-cuidando-quem-cuida-v2";

const moods = [
  { id: "bem", label: "Estou bem, mas quero me cuidar", note: "Cuidado não precisa começar somente quando algo dá errado.", icon: Sparkles },
  { id: "cansado", label: "Estou cansado e sobrecarregado", note: "Cansaço merece atenção, principalmente quando deixa de ser passageiro.", icon: Moon },
  { id: "automatico", label: "Estou funcionando no automático", note: "O automático pode proteger no curto prazo, mas também pode esconder necessidades.", icon: RefreshCcw },
  { id: "limite", label: "Sinto que estou chegando ao meu limite", note: "Reconhecer um limite é uma atitude de proteção, não de fraqueza.", icon: LifeBuoy },
];

const helpPaths = [
  {
    id: "entender",
    title: "Quero entender o que estou sentindo",
    text: "Comece observando sinais, frequência, duração, intensidade e impacto. Não tente transformar uma reflexão em diagnóstico.",
    action: "Ir para a Jornada 2 — Entender sinais",
    step: 1,
    icon: Brain,
  },
  {
    id: "trabalho",
    title: "O trabalho está me desgastando",
    text: "Olhe também para carga, ritmo, jornada, autonomia, relações, violência, assédio e apoio da liderança.",
    action: "Ir para a Jornada 5 — Trabalho e riscos",
    step: 4,
    icon: Shield,
  },
  {
    id: "conversa",
    title: "Preciso conversar com alguém",
    text: "Escolha uma pessoa segura, diga objetivamente o que mudou e peça o tipo de apoio de que você precisa.",
    action: "Ir para a Jornada 6 — Pedir ajuda",
    step: 5,
    icon: MessageCircle,
  },
  {
    id: "seguranca",
    title: "Estou em sofrimento intenso",
    text: "Não permaneça sozinho. Procure apoio profissional e, se houver risco imediato, utilize um serviço de emergência.",
    action: "Ver caminhos de apoio",
    step: 7,
    icon: AlertTriangle,
  },
];

const observationQuestions = [
  "Meu cansaço está durando mais do que o habitual?",
  "Estou tendo dificuldade para dormir, descansar ou recuperar energia?",
  "Estou mais irritado, ansioso, triste ou emocionalmente distante?",
  "Estou evitando pessoas, situações ou atividades que antes faziam parte da minha rotina?",
  "Tenho funcionado no automático durante o trabalho?",
  "Minha atenção, memória ou tomada de decisão parecem diferentes?",
  "O trabalho está interferindo de forma importante na minha vida fora dele?",
  "Tenho dificuldade para pedir ajuda ou admitir que não estou bem?",
  "Alguma mudança persistente no meu corpo ou comportamento merece avaliação?",
  "Tenho percebido sinais que estou tentando normalizar ou esconder?",
];

const kitItems = [
  { id: "autopercepcao", label: "Autopercepção", icon: Eye, action: "Reservar alguns minutos para perceber corpo, emoções, pensamentos e necessidades." },
  { id: "limites", label: "Limites", icon: Shield, action: "Identificar um limite realista e comunicar o que precisa mudar." },
  { id: "recuperacao", label: "Recuperação", icon: Moon, action: "Proteger sono, pausas e períodos de recuperação sempre que possível." },
  { id: "rede", label: "Rede de apoio", icon: Users, action: "Escolher alguém com quem seja possível falar sem precisar parecer forte." },
  { id: "comunicacao", label: "Comunicação", icon: HeartHandshake, action: "Nomear o problema, o impacto e o apoio necessário de forma objetiva." },
  { id: "ajuda", label: "Ajuda profissional", icon: Stethoscope, action: "Buscar avaliação qualificada quando o sofrimento for persistente, intenso ou estiver comprometendo a vida." },
  { id: "sinais", label: "Reconhecer sinais", icon: Zap, action: "Observar frequência, intensidade, duração e impacto sem se autodiagnosticar." },
  { id: "seguranca", label: "Segurança psicológica", icon: Heart, action: "Buscar ambientes onde seja possível relatar problemas sem humilhação ou retaliação." },
  { id: "trabalho", label: "Proteção no trabalho", icon: Scale, action: "Registrar riscos ocupacionais e utilizar os canais institucionais adequados." },
];

const risks = [
  "Carga de trabalho excessiva",
  "Ritmo e pressão por produtividade",
  "Jornada, turnos e recuperação insuficiente",
  "Baixa autonomia para decidir como executar o trabalho",
  "Conflitos e comunicação inadequada",
  "Violência, assédio ou humilhação",
  "Equipe insuficiente ou recursos inadequados",
  "Falta de apoio da liderança",
];

const references = [
  ["COFEN — Enfermagem em Números", "https://www.cofen.gov.br/enfermagem-em-numeros/"],
  ["COFEN — Perfil da Enfermagem no Brasil", "https://www.cofen.gov.br/perfilenfermagem/pdfs/relatoriofinal.pdf"],
  ["OMS — Mental health at work", "https://www.who.int/news-room/fact-sheets/detail/mental-health-at-work"],
  ["OMS — Guidelines on mental health at work", "https://www.who.int/publications/i/item/9789240053052"],
  ["OMS/OIT — Mental Health at Work: Policy Brief", "https://www.ilo.org/resource/news/who-and-ilo-call-new-measures-tackle-mental-health-issues-work-0"],
  ["OIT — Ambiente psicossocial de trabalho", "https://www.ilo.org/sites/default/files/2026-04/Sum%C3%A1rio%20Executivo%20O%20ambiente%20psicossocial%20de%20trabalho%20Tend%C3%AAncia%20globais%20e%20orienta%C3%A7%C3%B5es%20para%20a%20a%C3%A7%C3%A3o.pdf"],
  ["IHI — Guiding Principles for Workforce Well-Being", "https://www.ihi.org/library/publications/guiding-principles-improving-health-care-workforce-well-being"],
  ["Fundacentro — NR-1 e riscos psicossociais", "https://www.gov.br/fundacentro/pt-br/comunicacao/noticias/noticias/2026/maio/fundacentro-lanca-diretrizes-para-aplicar-nr-1-com-inclusao-dos-riscos-psicossociais"],
  ["MTE — Norma Regulamentadora nº 1", "https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados/comissao-tripartite-partitaria-permanente/normas-regulamentadora/normas-regulamentadoras-vigentes/nr-1"],
  ["Ministério da Saúde — Saúde do Trabalhador", "https://www.gov.br/saude/pt-br/composicao/svsa/saude-do-trabalhador"],
];

type SavedState = {
  mood?: string;
  observations: number[];
  kit: string[];
  helpPath?: string;
};

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
}

function SourceNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-5 flex items-start gap-2 rounded-2xl border border-cqc-line bg-cqc-mist p-4 text-xs leading-relaxed text-cqc-muted">
      <CircleHelp className="mt-0.5 h-4 w-4 shrink-0 text-cqc-teal" />
      <span><strong>Base técnica:</strong> {children}</span>
    </p>
  );
}

function JourneyHeader({ number, title, kicker }: { number: number; title: string; kicker: string }) {
  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-cqc-deep text-sm font-black text-cqc-paper shadow-lg">{number}</span>
        <span className="text-xs font-black uppercase tracking-[0.18em] text-cqc-teal">Jornada {number} de 8</span>
      </div>
      <p className="mb-2 text-sm font-black uppercase tracking-wide text-cqc-teal">{kicker}</p>
      <h2 className="font-display text-3xl font-black leading-tight text-cqc-ink md:text-5xl">{title}</h2>
    </div>
  );
}

export function CuidandoQuemCuida({ editableContent }: { editableContent?: string | null }) {
  const reduce = useReducedMotion();
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [mood, setMood] = useState<string>();
  const [observations, setObservations] = useState<number[]>([]);
  const [selectedRisks, setSelectedRisks] = useState<string[]>([]);
  const [kit, setKit] = useState<string[]>([]);
  const [helpPath, setHelpPath] = useState<string>();
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as SavedState;
      setMood(saved.mood);
      setObservations(saved.observations ?? []);
      setKit(saved.kit ?? []);
      setHelpPath(saved.helpPath);
    } catch {
      // Estado local inválido é simplesmente ignorado.
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ mood, observations, kit, helpPath }));
    } catch {
      // O conteúdo continua funcionando mesmo sem armazenamento local.
    }
  }, [mood, observations, kit, helpPath]);

  const selectedKit = useMemo(() => kitItems.filter((item) => kit.includes(item.id)), [kit]);
  const selectedHelp = helpPaths.find((item) => item.id === helpPath);

  const goTo = (target: number) => {
    setStep(Math.max(0, Math.min(8, target)));
    window.setTimeout(() => document.getElementById("cqc-stage")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }), 40);
  };
  const next = () => goTo(step + 1);
  const previous = () => goTo(step - 1);
  const toggleObservation = (i: number) => setObservations((v) => v.includes(i) ? v.filter((x) => x !== i) : [...v, i]);
  const toggleKit = (id: string) => setKit((v) => v.includes(id) ? v.filter((x) => x !== id) : [...v, id]);
  const reset = () => {
    setMood(undefined);
    setObservations([]);
    setSelectedRisks([]);
    setKit([]);
    setHelpPath(undefined);
    setStep(0);
    setStarted(false);
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  };

  const screens = [
    <section key="j1">
      <JourneyHeader number={1} kicker="Comece por você" title="Antes de cuidar do outro, perceba como você está chegando ao cuidado." />
      <div className="grid gap-4 md:grid-cols-[1.1fr_.9fr]">
        <div className="rounded-3xl bg-cqc-deep p-6 text-cqc-paper shadow-xl md:p-8">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-cqc-aqua">Uma ideia central</p>
          <p className="mt-4 text-xl font-bold leading-relaxed">Você aprendeu a reconhecer sinais no paciente. Esta jornada convida você a aplicar a mesma atenção — com humanidade — a si próprio.</p>
          <p className="mt-4 text-sm leading-relaxed text-cqc-paper/80">Não é um teste psicológico. Não é uma avaliação de desempenho. É uma ferramenta educativa para ajudar você a perceber o que merece atenção.</p>
        </div>
        <div className="grid gap-3">
          <div className="cqc-stat"><strong>Perceber</strong><span>o que mudou no corpo, no humor, no sono e no comportamento.</span></div>
          <div className="cqc-stat"><strong>Nomear</strong><span>o que está acontecendo sem culpa e sem rótulos precipitados.</span></div>
          <div className="cqc-stat"><strong>Agir</strong><span>escolher um próximo passo possível e seguro.</span></div>
        </div>
      </div>
      {editableContent?.trim() ? (
        <div className="cqc-editable-content mt-6">{renderContent(editableContent)}</div>
      ) : (
        <div className="mt-6 space-y-4 text-base leading-8 text-cqc-muted">
          <p>A rotina da enfermagem pode exigir presença emocional, atenção contínua, decisões rápidas e contato frequente com sofrimento, dor, morte, conflitos e situações imprevisíveis. Quando a jornada termina, porém, o profissional continua sendo uma pessoa com relações, responsabilidades, limites e necessidades próprias.</p>
          <p>Cuidar de si não significa abandonar o compromisso com o paciente. Significa reconhecer que segurança, qualidade do cuidado e saúde do trabalhador fazem parte da mesma conversa.</p>
        </div>
      )}
      <SourceNote>Saúde mental relacionada ao trabalho não deve ser reduzida a uma característica individual. OMS e OIT destacam a importância das condições e da organização do trabalho, além dos recursos de proteção e apoio.</SourceNote>
      <h3 className="cqc-question mt-8">Como você tem chegado ao fim dos seus dias?</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {moods.map(({ id, label, note, icon: Icon }) => (
          <button type="button" key={id} onClick={() => setMood(id)} className={`cqc-choice ${mood === id ? "cqc-choice-active" : ""}`} aria-pressed={mood === id}>
            <Icon className="h-5 w-5" />
            <span><strong>{label}</strong>{mood === id && <small>{note}</small>}</span>
          </button>
        ))}
      </div>
      <blockquote className="cqc-quote">Perceber não é diagnosticar. Perceber é abrir espaço para uma decisão mais consciente.</blockquote>
    </section>,

    <section key="j2">
      <JourneyHeader number={2} kicker="Entenda os sinais" title="Observe o padrão, não apenas o episódio." />
      <p className="cqc-lead">Uma noite ruim, um plantão difícil ou uma semana de muita pressão não definem sozinhos a saúde mental de ninguém. O que merece atenção é a combinação de persistência, intensidade, repetição e impacto.</p>
      <div className="grid gap-4 md:grid-cols-2">
        {[
          ["Sono e recuperação", "Você consegue descansar e recuperar energia ou acorda cansado de forma recorrente?", Moon],
          ["Humor e emoções", "Há mudanças persistentes de irritabilidade, tristeza, ansiedade, apatia ou distanciamento?", Heart],
          ["Atenção e memória", "Você percebe dificuldade nova ou relevante para concentrar, lembrar, organizar ou decidir?", Brain],
          ["Comportamento", "Você está evitando pessoas, situações ou atividades, ou usando estratégias que antes não faziam parte da rotina?", Eye],
        ].map(([title, text, Icon]) => {
          const I = Icon as typeof Brain;
          return <article key={String(title)} className="cqc-info rounded-3xl p-6 shadow-[0_14px_40px_-30px_rgba(0,0,0,.4)]"><I className="h-7 w-7 text-cqc-teal"/><h3 className="mt-4 text-xl font-black">{String(title)}</h3><p className="mt-2 leading-7">{String(text)}</p></article>;
        })}
      </div>
      <div className="mt-6 rounded-3xl border border-cqc-line bg-cqc-paper p-6">
        <h3 className="flex items-center gap-2 text-lg font-black"><CircleHelp className="text-cqc-teal"/> Uma regra útil</h3>
        <p className="mt-3 leading-7 text-cqc-muted"><strong>Frequência + intensidade + duração + impacto</strong> ajudam a decidir quando uma observação merece virar conversa com um profissional. Isso não substitui avaliação clínica.</p>
      </div>
      <SourceNote>Os sinais apresentados são educativos e inespecíficos. Vários deles podem ocorrer em condições diferentes, inclusive situações clínicas e circunstâncias temporárias. Não use esta jornada para autodiagnóstico.</SourceNote>
    </section>,

    <section key="j3">
      <JourneyHeader number={3} kicker="Faça uma pausa para observar" title="O que está pedindo sua atenção hoje?" />
      <p className="cqc-lead">Marque apenas aquilo que fizer sentido para você. O resultado não é uma pontuação clínica. Ele serve para organizar sua própria reflexão.</p>
      <div className="space-y-2">
        {observationQuestions.map((question, i) => (
          <button type="button" key={question} onClick={() => toggleObservation(i)} className={`cqc-check ${observations.includes(i) ? "cqc-check-active" : ""}`} aria-pressed={observations.includes(i)}>
            <span className="cqc-checkbox">{observations.includes(i) && <Check className="h-4 w-4"/>}</span><span>{question}</span>
          </button>
        ))}
      </div>
      {observations.length > 0 && (
        <div className="mt-6 rounded-3xl border border-cqc-teal bg-cqc-aqua/30 p-5">
          <p className="font-black text-cqc-deep">Você destacou {observations.length} {observations.length === 1 ? "ponto" : "pontos"} para observar.</p>
          <p className="mt-2 text-sm leading-6 text-cqc-muted">Não transforme isso em nota. Pergunte: isso é novo? Está persistindo? Está piorando? Está interferindo na minha vida ou no meu trabalho? O que eu precisaria para não lidar com isso sozinho?</p>
        </div>
      )}
      <div className="cqc-flow"><span>Perceber</span><ArrowRight/><span>Contextualizar</span><ArrowRight/><span>Conversar</span><ArrowRight/><span>Agir</span></div>
    </section>,

    <section key="j4">
      <JourneyHeader number={4} kicker="Proteção real" title="Seu cuidado precisa de mais de uma camada." />
      <p className="cqc-lead">O chamado “EPI psicológico” é apenas uma metáfora educativa. A proteção do trabalhador não pode depender exclusivamente da capacidade individual de suportar pressão.</p>
      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["Você", "Perceber sinais, estabelecer limites, recuperar-se e procurar ajuda.", Heart],
          ["Equipe", "Acolher, compartilhar carga, comunicar riscos e não normalizar violência.", Users],
          ["Organização", "Dimensionar, prevenir, investigar riscos e criar condições seguras de trabalho.", Shield],
        ].map(([title, text, Icon]) => { const I = Icon as typeof Heart; return <article key={String(title)} className="cqc-info rounded-3xl p-6"><I className="h-7 w-7 text-cqc-teal"/><h3 className="mt-4 text-xl font-black">{String(title)}</h3><p className="mt-2 leading-7">{String(text)}</p></article>; })}
      </div>
      <blockquote className="cqc-quote">Você não é o único responsável por se manter bem em um ambiente que também precisa ser saudável.</blockquote>
      <SourceNote>Modelos contemporâneos de bem-estar no trabalho em saúde combinam recursos individuais com mudanças de equipe, liderança e organização.</SourceNote>
    </section>,

    <section key="j5">
      <JourneyHeader number={5} kicker="Olhe para o ambiente" title="Quando o problema também está no jeito como o trabalho é organizado." />
      <p className="cqc-lead">Se várias pessoas estão adoecendo, se a mesma queixa se repete ou se o trabalhador precisa escolher entre segurança e produtividade, a pergunta não deve ser apenas “o que há de errado comigo?”.</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {risks.map((risk, i) => <div key={risk} className="flex items-center gap-3 rounded-2xl border border-cqc-line bg-cqc-paper p-4 shadow-sm"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-cqc-rose text-sm font-black text-cqc-deep">{i + 1}</span><span className="font-bold text-cqc-ink">{risk}</span></div>)}
      </div>
      <div className="mt-7 overflow-hidden rounded-3xl border border-cqc-line shadow-sm">
        <div className="grid grid-cols-3 bg-cqc-deep p-4 text-center text-xs font-black uppercase tracking-wide text-cqc-paper"><span>Profissional</span><span>Equipe / liderança</span><span>Organização</span></div>
        <div className="grid grid-cols-3 gap-px bg-cqc-line text-center text-sm text-cqc-muted"><p className="bg-cqc-paper p-5">Reconhecer e comunicar</p><p className="bg-cqc-paper p-5">Acolher e intervir</p><p className="bg-cqc-paper p-5">Prevenir, corrigir e acompanhar</p></div>
      </div>
      <SourceNote>A OIT considera fatores como carga e ritmo de trabalho, jornada, autonomia, apoio, relações, violência, assédio e interface trabalho–vida ao discutir riscos psicossociais.</SourceNote>
    </section>,

    <section key="j6">
      <JourneyHeader number={6} kicker="Pedir ajuda é uma competência" title="Você não precisa saber exatamente o nome do problema para pedir ajuda." />
      <p className="cqc-lead">Uma boa conversa começa descrevendo fatos: o que mudou, há quanto tempo, com que frequência acontece e como isso está afetando sua vida.</p>
      <div className="grid gap-3 md:grid-cols-2">
        {[
          ["1. Diga o que mudou", "“Nas últimas semanas, percebi que estou dormindo mal e chegando ao trabalho sem conseguir recuperar energia.”"],
          ["2. Diga o impacto", "“Isso está afetando minha concentração, meu humor e minha vida fora do trabalho.”"],
          ["3. Diga do que precisa", "“Preciso conversar com um profissional / preciso de apoio da equipe / preciso entender quais recursos estão disponíveis.”"],
          ["4. Aceite acompanhamento", "Se o sofrimento persistir ou estiver comprometendo sua vida, procure avaliação qualificada e siga o plano de cuidado acordado."],
        ].map(([title, text]) => <article key={String(title)} className="cqc-info rounded-3xl p-6"><h3 className="text-lg font-black text-cqc-deep">{String(title)}</h3><p className="mt-2 leading-7">{String(text)}</p></article>)}
      </div>
      <div className="mt-6 rounded-3xl bg-cqc-deep p-6 text-cqc-paper shadow-xl"><MessageCircle className="h-7 w-7 text-cqc-aqua"/><p className="mt-4 text-lg font-bold">Uma frase que você pode usar</p><p className="mt-2 leading-7 text-cqc-paper/80">“Eu não estou me sentindo como de costume e não quero esperar piorar para procurar ajuda. Você pode me ajudar a encontrar o caminho adequado?”</p></div>
      <SourceNote>Buscar ajuda não exige autodiagnóstico. A avaliação deve considerar história, contexto, condições clínicas, trabalho e outros fatores relevantes.</SourceNote>
    </section>,

    <section key="j7">
      <JourneyHeader number={7} kicker="Quando é urgente" title="Algumas situações não devem esperar." />
      <div className="rounded-3xl border border-cqc-rose bg-cqc-paper p-6 shadow-sm">
        <div className="flex items-start gap-4"><div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-cqc-rose text-cqc-deep"><AlertTriangle className="h-6 w-6"/></div><div><h3 className="text-xl font-black">Procure ajuda imediata se houver risco à segurança.</h3><p className="mt-2 leading-7 text-cqc-muted">Se você ou outra pessoa estiver em risco imediato, houver ameaça de violência, alteração grave do estado mental, emergência clínica ou risco de autoagressão, não use esta experiência como substituto de atendimento.</p></div></div>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <a className="cqc-help" href="tel:192"><Zap/> SAMU 192<span>Emergências e risco imediato</span></a>
          <a className="cqc-help" href="https://www.gov.br/saude/pt-br/composicao/saes/desmad/raps/caps" target="_blank" rel="noreferrer"><HeartHandshake/> CAPS / SUS<span>Procure a rede de atenção psicossocial</span></a>
          <a className="cqc-help" href="https://cvv.org.br/" target="_blank" rel="noreferrer"><LifeBuoy/> CVV 188<span>Apoio emocional gratuito e sigiloso</span></a>
        </div>
      </div>
      <p className="mt-6 text-sm leading-7 text-cqc-muted">Se não for uma emergência, mas o sofrimento estiver persistente ou comprometendo sua vida, procure uma unidade de saúde, serviço de saúde ocupacional, psicólogo, psiquiatra ou outro profissional habilitado, conforme a necessidade e disponibilidade da sua rede.</p>
      <div className="mt-6 rounded-3xl bg-cqc-mist p-6"><h3 className="flex items-center gap-2 text-lg font-black"><Shield className="text-cqc-teal"/> Segurança vem antes de produtividade.</h3><p className="mt-2 leading-7 text-cqc-muted">Pedir ajuda cedo pode ser uma decisão de proteção. Você não precisa provar que está “mal o suficiente” para merecer cuidado.</p></div>
    </section>,

    <section key="j8">
      <JourneyHeader number={8} kicker="Proteção sustentável" title="Leve daqui um plano simples para o próximo passo." />
      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-3xl bg-cqc-deep p-7 text-cqc-paper shadow-xl"><Sparkles className="h-7 w-7 text-cqc-aqua"/><h3 className="mt-4 text-2xl font-black">Hoje</h3><p className="mt-2 leading-7 text-cqc-paper/80">Escolha uma ação pequena e possível: descansar, conversar, registrar um risco, pedir apoio ou marcar uma avaliação.</p></article>
        <article className="rounded-3xl bg-cqc-paper p-7 shadow-sm"><Shield className="h-7 w-7 text-cqc-teal"/><h3 className="mt-4 text-2xl font-black">Nos próximos dias</h3><p className="mt-2 leading-7 text-cqc-muted">Observe se a situação melhora, permanece ou piora. Se persistir ou comprometer sua vida, não adie a busca por apoio qualificado.</p></article>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="cqc-pillar">PREVENIR</div><div className="cqc-pillar">PROTEGER</div><div className="cqc-pillar">APOIAR</div>
      </div>
      <p className="mt-6 text-center text-base font-bold leading-7 text-cqc-ink">Saúde mental no trabalho não é uma responsabilidade solitária. O cuidado precisa alcançar a pessoa, a equipe, a liderança e a organização.</p>
    </section>,
  ];

  return (
    <div className="cqc-root -mx-4 -mt-3 overflow-hidden md:mx-0 md:rounded-[2rem]" id="cuidando-quem-cuida">
      {!started ? (
        <section className="relative min-h-[720px] overflow-hidden bg-cqc-bg">
          <img src={espelhoImage} alt="Profissional de enfermagem observa seu reflexo após o plantão" width={1600} height={1000} fetchPriority="high" className="absolute inset-0 h-full w-full object-cover object-[62%_center]" />
          <div className="absolute inset-0 bg-cqc-hero" />
          <div className="absolute right-8 top-8 hidden h-32 w-32 rounded-full border border-white/40 bg-white/20 backdrop-blur-xl md:block" />
          <motion.div initial={reduce ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8 }} className="relative z-10 flex min-h-[720px] max-w-3xl flex-col justify-end px-6 pb-12 pt-24 md:px-12 md:pb-16">
            <div className="mb-5 flex w-fit items-center gap-2 rounded-full border border-white/60 bg-white/55 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-cqc-deep backdrop-blur-md"><Heart className="h-4 w-4"/> Academia da Enfermagem</div>
            <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-cqc-deep">Cuidando de Quem Cuida</p>
            <h2 className="font-display text-4xl font-black leading-[1.02] text-cqc-ink md:text-6xl">Uma viagem por dentro.</h2>
            <p className="mt-5 max-w-2xl text-xl font-bold leading-relaxed text-cqc-ink md:text-2xl">Você está pronto para olhar para quem quase sempre fica por último: você?</p>
            <div className="mt-5 grid max-w-2xl gap-2 text-sm leading-relaxed text-cqc-muted md:grid-cols-3"><span>Perceber.</span><span>Entender.</span><span>Escolher o próximo passo.</span></div>
            <Button size="lg" onClick={() => { setStarted(true); setStep(0); }} className="cqc-start mt-8 h-auto w-fit rounded-2xl px-7 py-4 text-base font-black shadow-xl">Começar minha viagem <ArrowRight /></Button>
          </motion.div>
        </section>
      ) : (
        <>
          <section className="bg-cqc-paper px-5 py-8 md:px-12">
            <div className="mx-auto max-w-5xl">
              <div className="mb-5 flex items-end justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-cqc-teal">Orientação rápida</p><h2 className="mt-1 font-display text-2xl font-black text-cqc-ink md:text-3xl">O que você precisa agora?</h2></div><button type="button" onClick={() => setStarted(false)} className="hidden text-sm font-bold text-cqc-teal md:inline-flex">Voltar à abertura</button></div>
              <div className="grid gap-3 md:grid-cols-4">
                {helpPaths.map(({ id, title, text, action, step: target, icon: Icon }) => (
                  <button type="button" key={id} onClick={() => { setHelpPath(id); goTo(target); }} className={`group rounded-3xl border p-5 text-left transition-all hover:-translate-y-1 hover:shadow-xl ${helpPath === id ? "border-cqc-teal bg-cqc-aqua/30" : "border-cqc-line bg-cqc-bg"}`} aria-pressed={helpPath === id}>
                    <Icon className="h-6 w-6 text-cqc-teal transition-transform group-hover:scale-110"/><h3 className="mt-4 text-base font-black text-cqc-ink">{title}</h3><p className="mt-2 text-xs leading-5 text-cqc-muted">{text}</p><span className="mt-4 inline-flex items-center gap-1 text-xs font-black text-cqc-deep">{action} <ArrowRight className="h-3 w-3"/></span>
                  </button>
                ))}
              </div>
              {selectedHelp && <div className="mt-4 rounded-2xl bg-cqc-deep p-4 text-sm font-bold text-cqc-paper">Próximo passo recomendado: {selectedHelp.action}. Você pode mudar de caminho a qualquer momento.</div>}
            </div>
          </section>

          <div className="sticky top-[72px] z-30 border-y border-cqc-line bg-cqc-paper/95 px-4 py-3 backdrop-blur-xl md:top-[80px] md:px-7">
            <div className="mx-auto max-w-5xl">
              <div className="mb-3 flex items-center justify-between text-xs font-black text-cqc-muted"><span>{step < 8 ? `Jornada ${step + 1} de 8` : "Meu kit de proteção"}</span><span>{Math.round(((step + 1) / 9) * 100)}%</span></div>
              <div className="flex items-center gap-1.5" aria-label="Progresso da jornada">
                {Array.from({ length: 9 }, (_, index) => <button key={index} type="button" onClick={() => goTo(index)} className={`cqc-step-dot ${step === index ? "cqc-step-dot-active" : ""}`} aria-label={index < 8 ? `Ir para jornada ${index + 1}` : "Ir para meu kit"}><span>{index < 8 ? index + 1 : <Shield className="h-3 w-3"/>}</span></button>)}
              </div>
            </div>
          </div>

          <main id="cqc-stage" className="scroll-mt-36 bg-cqc-bg px-5 py-10 md:px-12 md:py-14">
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={reduce ? false : { opacity: 0, x: 22 }} animate={{ opacity: 1, x: 0 }} exit={reduce ? undefined : { opacity: 0, x: -18 }} transition={{ duration: .3 }} className="mx-auto max-w-5xl">
                {step < 8 ? screens[step] : (
                  <section>
                    <div className="mx-auto mb-8 max-w-3xl text-center"><span className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-3xl bg-cqc-deep text-cqc-aqua shadow-xl"><Shield className="h-8 w-8"/></span><p className="text-xs font-black uppercase tracking-[0.18em] text-cqc-teal">Agora transforme reflexão em ação</p><h2 className="mt-2 font-display text-3xl font-black text-cqc-ink md:text-5xl">Monte seu kit de proteção</h2><p className="mt-3 leading-7 text-cqc-muted">Escolha o que você quer fortalecer. O resultado é um lembrete educativo salvo somente neste aparelho — não é prescrição nem diagnóstico.</p></div>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{kitItems.map(({ id, label, icon: Icon }) => <button type="button" key={id} onClick={() => toggleKit(id)} className={`cqc-choice ${kit.includes(id) ? "cqc-choice-active" : ""}`} aria-pressed={kit.includes(id)}><Icon className="h-5 w-5"/><strong>{label}</strong>{kit.includes(id) && <Check className="ml-auto h-5 w-5"/>}</button>)}</div>
                    {selectedKit.length > 0 && <Reveal className="mt-7 rounded-3xl bg-cqc-deep p-7 text-cqc-paper shadow-xl"><h3 className="text-xl font-black">Meu plano de proteção</h3><ul className="mt-5 space-y-3">{selectedKit.map(({ id, label, action }) => <li key={id} className="flex gap-3 text-sm leading-6"><Check className="mt-1 h-4 w-4 shrink-0 text-cqc-aqua"/><span><strong>{label}:</strong> {action}</span></li>)}</ul></Reveal>}
                    <blockquote className="cqc-quote">Seu kit não precisa estar completo hoje. O primeiro passo já é reconhecer que você também merece cuidado.</blockquote>
                    <Button variant="outline" onClick={reset} className="mx-auto flex rounded-2xl"><RefreshCcw/> Refazer minha jornada</Button>
                  </section>
                )}
                <div className="mt-10 flex items-center justify-between border-t border-cqc-line pt-5"><Button variant="ghost" onClick={previous} disabled={step === 0} className="rounded-xl"><ArrowLeft/> Voltar</Button>{step < 8 && <Button onClick={next} className="rounded-xl bg-cqc-deep text-cqc-paper hover:bg-cqc-teal">{step === 7 ? "Montar meu kit" : "Continuar"}<ArrowRight/></Button>}</div>
              </motion.div>
            </AnimatePresence>
          </main>

          <section className="bg-cqc-paper px-5 py-10 md:px-12">
            <div className="mx-auto max-w-5xl">
              <div className="rounded-3xl border border-cqc-line bg-cqc-mist p-6 md:p-8">
                <h2 className="flex items-center gap-2 font-display text-2xl font-black text-cqc-ink"><CircleHelp className="text-cqc-teal"/> Esta experiência orienta — não diagnostica.</h2>
                <p className="mt-3 max-w-3xl leading-7 text-cqc-muted">O Mini App foi desenhado para educação, reflexão e orientação inicial. Ele não determina se alguém possui depressão, ansiedade, burnout, transtorno de estresse ou qualquer outra condição. Diagnóstico, tratamento e afastamento do trabalho exigem avaliação profissional e contexto clínico.</p>
                <button type="button" onClick={() => setShowHelp((v) => !v)} className="mt-5 inline-flex items-center gap-2 text-sm font-black text-cqc-teal">Preciso encontrar apoio <ChevronDown className={`h-4 w-4 transition ${showHelp ? "rotate-180" : ""}`}/></button>
                {showHelp && <div className="mt-5 grid gap-3 sm:grid-cols-3"><a className="cqc-help" href="https://www.gov.br/saude/pt-br/composicao/saes/desmad/raps/caps" target="_blank" rel="noreferrer"><HeartHandshake/> CAPS / SUS<span>Rede pública de atenção psicossocial</span></a><a className="cqc-help" href="https://cvv.org.br/" target="_blank" rel="noreferrer"><LifeBuoy/> CVV 188<span>Apoio emocional gratuito e sigiloso</span></a><a className="cqc-help" href="tel:192"><Zap/> SAMU 192<span>Emergência e risco imediato</span></a></div>}
              </div>
              <details className="mt-7 border-t border-cqc-line pt-5"><summary className="cursor-pointer font-black text-cqc-ink">Referências e fontes técnicas</summary><p className="mt-3 text-xs leading-6 text-cqc-muted">As fontes abaixo orientam a construção educativa do Mini App. Estatísticas e resultados de estudos devem ser interpretados conforme população, período, método e contexto.</p><ol className="mt-4 space-y-2">{references.map(([label, url], i) => <li key={url} className="text-xs leading-relaxed"><a href={url} target="_blank" rel="noreferrer" className="flex items-start gap-2 text-cqc-teal hover:underline"><span>{i + 1}.</span><span>{label}</span><ExternalLink className="mt-0.5 h-3 w-3 shrink-0"/></a></li>)}</ol></details>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
