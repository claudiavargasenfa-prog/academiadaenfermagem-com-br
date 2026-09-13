import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
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
  Moon,
  RefreshCcw,
  Scale,
  Shield,
  Sparkles,
  Users,
  Wind,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import espelhoImage from "@/assets/cuidando-espelho.jpg";

const STORAGE_KEY = "adec-cuidando-quem-cuida-v1";

const moods = [
  { id: "leve", label: "Ainda tenho energia", note: "Reconhecer o que sustenta você também é cuidado.", icon: Sparkles },
  { id: "cansado", label: "Cansado, mas seguindo", note: "Seu cansaço merece ser percebido, não minimizado.", icon: Moon },
  { id: "automatico", label: "No modo automático", note: "O automático pode ajudar a atravessar o dia — e também esconder necessidades.", icon: RefreshCcw },
  { id: "limite", label: "Perto do meu limite", note: "Perceber o limite é um sinal de proteção. Você não precisa atravessá-lo sozinho.", icon: LifeBuoy },
];

const observationQuestions = [
  "Estou apenas cansado ou estou chegando ao meu limite?",
  "Estou irritado ou estou sobrecarregado?",
  "Estou evitando alguma situação?",
  "Estou funcionando no automático?",
  "Estou dormindo, mas continuo exausto?",
  "Estou conseguindo separar trabalho e vida pessoal?",
  "Estou cuidando de todos e deixando minhas necessidades sempre por último?",
  "Eu consigo pedir ajuda?",
  "O que mudou em mim nos últimos meses?",
  "Tenho percebido sinais que antes ignorava?",
];

const kitItems = [
  { id: "autopercepcao", label: "Autopercepção", icon: Eye, action: "Reservar dois minutos por dia para perceber corpo, emoções e necessidades." },
  { id: "limites", label: "Limites", icon: Shield, action: "Identificar um limite que precisa ser comunicado com clareza." },
  { id: "recuperacao", label: "Recuperação", icon: Moon, action: "Proteger pequenas pausas e o descanso possível entre jornadas." },
  { id: "rede", label: "Rede de apoio", icon: Users, action: "Escolher alguém seguro com quem eu possa conversar sem precisar parecer forte." },
  { id: "comunicacao", label: "Comunicação", icon: HeartHandshake, action: "Nomear uma necessidade de forma direta e respeitosa." },
  { id: "ajuda", label: "Pedir ajuda", icon: LifeBuoy, action: "Reconhecer quando o apoio profissional ou institucional é necessário." },
  { id: "sinais", label: "Reconhecer sinais", icon: Zap, action: "Observar mudanças persistentes no sono, humor, corpo e comportamento." },
  { id: "seguranca", label: "Segurança psicológica", icon: Heart, action: "Buscar espaços onde seja possível falar sem humilhação ou retaliação." },
  { id: "trabalho", label: "Proteção no trabalho", icon: Scale, action: "Registrar e comunicar riscos psicossociais pelos canais adequados." },
];

const risks = [
  "Equipe reduzida",
  "Alta demanda",
  "Pressão por produtividade",
  "Conflitos frequentes",
  "Baixa autonomia",
  "Assédio ou humilhação",
  "Jornada inadequada",
  "Falta de apoio da liderança",
];

const references = [
  ["COFEN — Enfermagem em Números", "https://www.cofen.gov.br/enfermagem-em-numeros/"],
  ["COFEN — Perfil da Enfermagem no Brasil (Fiocruz/Cofen)", "https://www.cofen.gov.br/perfilenfermagem/pdfs/relatoriofinal.pdf"],
  ["Coren-SP — Sondagem sobre sofrimento mental na pandemia", "https://portal.coren-sp.gov.br/wp-content/uploads/2021/09/Sondagem-Coren-SP-saude-mental-pandemia-2021-1.pdf"],
  ["OMS — Guidelines on Mental Health at Work", "https://www.who.int/publications/i/item/9789240053052"],
  ["OMS — Mental Health at Work", "https://www.who.int/news-room/fact-sheets/detail/mental-health-at-work"],
  ["OMS/OIT — Mental Health at Work: Policy Brief", "https://www.ilo.org/resource/news/who-and-ilo-call-new-measures-tackle-mental-health-issues-work-0"],
  ["OIT — Ambiente psicossocial de trabalho: tendências e orientações", "https://www.ilo.org/sites/default/files/2026-04/Sum%C3%A1rio%20Executivo%20O%20ambiente%20psicossocial%20de%20trabalho%20Tend%C3%AAncia%20globais%20e%20orienta%C3%A7%C3%B5es%20para%20a%20a%C3%A7%C3%A3o.pdf"],
  ["IHI — Framework for Improving Joy in Work", "https://www.ihi.org/library/white-papers/ihi-framework-improving-joy-work"],
  ["IHI — Guiding Principles for Workforce Well-Being", "https://www.ihi.org/library/publications/guiding-principles-improving-health-care-workforce-well-being"],
  ["Fundacentro — NR-1 e riscos psicossociais", "https://www.gov.br/fundacentro/pt-br/comunicacao/noticias/noticias/2026/maio/fundacentro-lanca-diretrizes-para-aplicar-nr-1-com-inclusao-dos-riscos-psicossociais"],
  ["MTE — Norma Regulamentadora nº 1", "https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados/comissao-tripartite-partitaria-permanente/normas-regulamentadora/normas-regulamentadoras-vigentes/nr-1"],
  ["Ministério da Saúde — Saúde do Trabalhador", "https://www.gov.br/saude/pt-br/composicao/svsa/saude-do-trabalhador"],
];

type SavedState = { mood?: string; observations: number[]; kit: string[] };

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return <motion.div className={className} initial={reduce ? false : { opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.18 }} transition={{ duration: 0.55, delay }}>{children}</motion.div>;
}

function SourceNote({ children }: { children: React.ReactNode }) {
  return <p className="mt-4 flex items-start gap-2 rounded-md border border-cqc-line bg-cqc-mist p-3 text-xs leading-relaxed text-cqc-muted"><CircleHelp className="mt-0.5 h-4 w-4 shrink-0 text-cqc-teal" /><span><strong>Saiba de onde vem:</strong> {children}</span></p>;
}

function JourneyHeader({ number, title, kicker }: { number: number; title: string; kicker: string }) {
  return <div className="mb-7"><div className="mb-3 flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-cqc-deep text-sm font-bold text-cqc-paper">{number}</span><span className="text-xs font-bold uppercase text-cqc-teal">Jornada {number} de 8</span></div><p className="mb-2 text-sm font-semibold text-cqc-teal">{kicker}</p><h2 className="font-display text-2xl font-bold text-cqc-ink md:text-4xl">{title}</h2></div>;
}

export function CuidandoQuemCuida() {
  const reduce = useReducedMotion();
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [mood, setMood] = useState<string>();
  const [observations, setObservations] = useState<number[]>([]);
  const [selectedRisks, setSelectedRisks] = useState<string[]>([]);
  const [kit, setKit] = useState<string[]>([]);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as SavedState;
      setMood(saved.mood);
      setObservations(saved.observations ?? []);
      setKit(saved.kit ?? []);
    } catch { /* dados locais inválidos são ignorados */ }
  }, []);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ mood, observations, kit })); } catch { /* armazenamento indisponível */ }
  }, [mood, observations, kit]);

  const toggleObservation = (i: number) => setObservations((v) => v.includes(i) ? v.filter((x) => x !== i) : [...v, i]);
  const toggleKit = (id: string) => setKit((v) => v.includes(id) ? v.filter((x) => x !== id) : [...v, id]);
  const next = () => { setStep((s) => Math.min(8, s + 1)); window.setTimeout(() => document.getElementById("cqc-stage")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }), 40); };
  const previous = () => { setStep((s) => Math.max(0, s - 1)); window.setTimeout(() => document.getElementById("cqc-stage")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }), 40); };
  const reset = () => { setMood(undefined); setObservations([]); setSelectedRisks([]); setKit([]); setStep(0); setStarted(false); try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ } };
  const selectedKit = useMemo(() => kitItems.filter((item) => kit.includes(item.id)), [kit]);

  const screens = [
    <section key="j1"><JourneyHeader number={1} kicker="Você" title="Quando foi a última vez que você realmente olhou para você?" /><div className="mb-6 grid gap-3 sm:grid-cols-[.8fr_1.2fr]"><div className="cqc-stat"><strong>Quase 3 milhões</strong><span>de registros profissionais na enfermagem brasileira, segundo o Cofen em 2026</span></div><div className="cqc-info"><h3>Uma força enorme — formada por pessoas</h3><p>Enfermeiros, técnicos, auxiliares e obstetrizes sustentam o cuidado em todo o país. Registros profissionais não equivalem necessariamente a pessoas únicas: um profissional pode manter mais de uma inscrição.</p></div></div><p className="cqc-lead">A enfermagem convive com vida e morte, turnos diurnos e noturnos, equipes reduzidas e, muitas vezes, mais de um vínculo. Fora do plantão, continuam existindo filhos, relações, casa, estudos e responsabilidades. Em tanta correria, olhar para si pode ser sempre adiado.</p><p className="cqc-lead">Não existe hoje um levantamento nacional recente e representativo que permita dizer quantos profissionais “foram, estão ou serão” acometidos por transtornos mentais. Estudos regionais mostram sofrimento importante, mas cada resultado precisa ser lido dentro da sua amostra, época e local.</p><p className="cqc-lead">Autoconhecimento não exige uma resposta perfeita. Começa quando você percebe o corpo, as emoções, os pensamentos, os hábitos e aquilo que já acontece no automático.</p><SourceNote>O Cofen informou em maio de 2026 que a categoria reúne quase 3 milhões de profissionais. A página “Enfermagem em Números” reúne registros dos Conselhos Regionais; isso é diferente de uma pesquisa populacional sobre saúde mental.</SourceNote><h3 className="cqc-question">Como você tem chegado ao fim dos seus dias?</h3><div className="grid gap-3 sm:grid-cols-2">{moods.map(({ id, label, note, icon: Icon }) => <button type="button" key={id} onClick={() => setMood(id)} className={`cqc-choice ${mood === id ? "cqc-choice-active" : ""}`} aria-pressed={mood === id}><Icon className="h-5 w-5" /><span><strong>{label}</strong>{mood === id && <small>{note}</small>}</span></button>)}</div><blockquote className="cqc-quote">Perceber não é diagnosticar. É começar a prestar atenção.</blockquote></section>,
    <section key="j2"><JourneyHeader number={2} kicker="O cérebro que se adapta" title="Você também aprende com o que acontece" /><p className="cqc-lead">Seu cérebro, seu corpo e o ambiente trabalham juntos. Diante de demandas repetidas, o organismo aprende maneiras de responder — algumas protegem no momento, mas podem cobrar recuperação depois.</p><div className="grid gap-3 md:grid-cols-2">{[["Ameaça e segurança","Quando o ambiente parece imprevisível, a atenção procura perigo e o corpo se prepara para responder.",Zap],["Atenção e memória","Cansaço, interrupções e tensão podem estreitar a atenção e dificultar lembrar, decidir e desacelerar.",Brain],["Hábitos e automatismos","Repetição poupa energia. Por isso, atravessar o plantão no automático pode virar um padrão sem que você perceba.",RefreshCcw],["Sono e recuperação","Dormir não é luxo. O sono participa da regulação emocional, da memória, da atenção e da recuperação física.",Moon]].map(([t,d,I]) => { const Icon=I as typeof Brain; return <article key={String(t)} className="cqc-info"><Icon className="h-6 w-6 text-cqc-teal"/><h3>{String(t)}</h3><p>{String(d)}</p></article>})}</div><div className="mt-6 rounded-md bg-cqc-deep p-5 text-cqc-paper"><Wind className="mb-3 h-6 w-6 text-cqc-aqua"/><p className="font-semibold">Pausa de 20 segundos</p><p className="mt-1 text-sm text-cqc-paper/80">Solte os ombros. Perceba o apoio dos pés. Faça uma expiração mais lenta que a inspiração. Não é tratamento: é um pequeno retorno ao presente.</p></div><SourceNote>OMS e OIT descrevem a saúde mental no trabalho como resultado da interação entre condições individuais, sociais e organizacionais — não como simples falta de força pessoal.</SourceNote></section>,
    <section key="j3"><JourneyHeader number={3} kicker="O que está acontecendo comigo?" title="Observe sem transformar sinais em rótulos" /><p className="cqc-lead">Marque as perguntas que merecem sua atenção hoje. Elas não formam um teste, não calculam risco e não produzem diagnóstico.</p><div className="space-y-2">{observationQuestions.map((q,i) => <button type="button" key={q} onClick={() => toggleObservation(i)} className={`cqc-check ${observations.includes(i) ? "cqc-check-active" : ""}`}><span className="cqc-checkbox">{observations.includes(i) && <Check className="h-4 w-4"/>}</span><span>{q}</span></button>)}</div>{observations.length > 0 && <div className="mt-5 rounded-md border-l-4 border-cqc-teal bg-cqc-mist p-4"><p className="font-bold text-cqc-ink">Você separou {observations.length} {observations.length === 1 ? "ponto" : "pontos"} para observar.</p><p className="mt-1 text-sm text-cqc-muted">Não precisa resolver tudo agora. Observe frequência, intensidade, duração e impacto na sua vida; se houver sofrimento significativo, procure ajuda qualificada.</p></div>}<div className="cqc-flow"><span>Reconhecer</span><ArrowRight/><span>Refletir</span><ArrowRight/><span>Observar</span><ArrowRight/><span>Procurar ajuda</span></div></section>,
    <section key="j4"><JourneyHeader number={4} kicker="Seus EPIs invisíveis" title="O que protege você por dentro?" /><p className="cqc-lead">“EPI psicológico” é uma metáfora educativa para recursos de proteção e apoio. Não é um equipamento regulamentado pela NR-6.</p><div className="grid grid-cols-2 gap-3 md:grid-cols-3">{kitItems.slice(0,8).map(({id,label,icon:Icon}) => <div key={id} className="cqc-shield"><Icon className="h-6 w-6"/><span>{label}</span></div>)}</div><blockquote className="cqc-quote">Você não é o único responsável pela sua proteção.</blockquote><div className="grid gap-3 md:grid-cols-2"><div className="cqc-info"><h3>Proteção pessoal</h3><p>Perceber sinais, comunicar limites, descansar quando possível, cultivar vínculos e buscar ajuda.</p></div><div className="cqc-info"><h3>Proteção coletiva</h3><p>Dimensionamento adequado, liderança responsável, prevenção de violência, pausas possíveis e canais seguros.</p></div></div><SourceNote>O IHI trabalha o bem-estar da força de trabalho em saúde por meio de ações individuais e, principalmente, mudanças no sistema e no ambiente de trabalho.</SourceNote></section>,
    <section key="j5"><JourneyHeader number={5} kicker="Quando o problema não está dentro de você" title="Autocuidado não conserta sozinho um trabalho adoecedor" /><p className="cqc-lead">A forma como o trabalho é planejado, organizado e gerenciado pode proteger ou desgastar. Reconhecer isso evita transformar um problema coletivo em culpa individual.</p><div className="grid gap-3 sm:grid-cols-2">{risks.map((r,i) => <div key={r} className="flex items-center gap-3 rounded-md border border-cqc-line bg-cqc-paper p-4"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-cqc-rose text-sm font-bold text-cqc-deep">{i+1}</span><span className="font-semibold text-cqc-ink">{r}</span></div>)}</div><div className="mt-6 overflow-hidden rounded-md border border-cqc-line"><div className="grid grid-cols-3 bg-cqc-deep p-3 text-center text-xs font-bold text-cqc-paper"><span>Pessoa</span><span>Equipe e liderança</span><span>Organização</span></div><div className="grid grid-cols-3 gap-px bg-cqc-line text-center text-xs text-cqc-muted"><p className="bg-cqc-paper p-3">Reconhecer e comunicar</p><p className="bg-cqc-paper p-3">Acolher e agir</p><p className="bg-cqc-paper p-3">Prevenir e corrigir</p></div></div><SourceNote>A OIT inclui carga e ritmo, jornada, autonomia, apoio, relações, violência, assédio e interface trabalho–vida entre os fatores psicossociais.</SourceNote></section>,
    <section key="j6"><JourneyHeader number={6} kicker="A nova NR-1" title="Riscos que não aparecem em um exame físico também precisam ser gerenciados" /><div className="grid gap-3 sm:grid-cols-3"><div className="cqc-stat"><strong>GRO</strong><span>Gerenciamento de Riscos Ocupacionais</span></div><div className="cqc-stat"><strong>PGR</strong><span>Programa de Gerenciamento de Riscos</span></div><div className="cqc-stat"><strong>26·05·26</strong><span>Entrada em vigor do capítulo 1.5</span></div></div><h3 className="cqc-question">Você identifica riscos psicossociais neste plantão?</h3><div className="relative overflow-hidden rounded-md bg-cqc-deep p-5 text-cqc-paper"><p className="text-sm leading-relaxed text-cqc-paper/80">Uma equipe reduzida recebe demanda acima do previsto. Há cobrança contínua por rapidez, pouca autonomia, conflitos e comentários humilhantes. Parte da equipe já ultrapassou a jornada planejada.</p><div className="mt-4 flex flex-wrap gap-2">{risks.slice(0,7).map((risk) => <button type="button" key={risk} onClick={() => setSelectedRisks((v) => v.includes(risk) ? v.filter(x=>x!==risk) : [...v,risk])} className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${selectedRisks.includes(risk) ? "border-cqc-aqua bg-cqc-aqua text-cqc-deep" : "border-cqc-paper/25 bg-cqc-paper/10"}`}>{selectedRisks.includes(risk) && <Check className="mr-1 inline h-3 w-3"/>}{risk}</button>)}</div></div>{selectedRisks.length >= 4 && <p className="mt-4 rounded-md bg-cqc-aqua/30 p-4 text-sm font-semibold text-cqc-deep">Você acabou de fazer uma leitura educativa de riscos psicossociais. A avaliação ocupacional formal exige método, participação dos trabalhadores e profissionais responsáveis.</p>}<SourceNote>A nova redação do capítulo 1.5 da NR-1 entrou em vigor em 26 de maio de 2026. A etapa inicial teve caráter orientativo, com 90 dias antes da aplicação de multas.</SourceNote></section>,
    <section key="j7"><JourneyHeader number={7} kicker="O que diz a enfermagem?" title="Esta conversa já faz parte da proteção profissional" /><p className="cqc-lead">Cofen e Corens vêm discutindo saúde mental, condições de trabalho e fatores psicossociais na enfermagem. A discussão não é abstrata: ela toca a dignidade, a segurança e a qualidade do cuidado.</p><div className="grid gap-4 md:grid-cols-2"><article className="cqc-info"><HeartHandshake className="h-7 w-7 text-cqc-teal"/><h3>Cansaço não é fraqueza</h3><p>Jornadas, exposição à dor e à morte, conflitos, violência e dupla presença entre trabalho e família podem se somar.</p></article><article className="cqc-info"><Brain className="h-7 w-7 text-cqc-teal"/><h3>Burnout não é todo cansaço</h3><p>Na CID-11, burnout é um fenômeno ocupacional ligado ao estresse crônico no trabalho que não foi administrado com sucesso. Não deve ser usado como autodiagnóstico.</p></article></div><div className="mt-5 rounded-md border border-cqc-line bg-cqc-mist p-5"><p className="text-sm font-bold uppercase text-cqc-teal">Um dado precisa de contexto</p><p className="mt-2 text-sm leading-relaxed text-cqc-muted">Pesquisas regionais e amostras voluntárias brasileiras encontraram sofrimento mental relevante entre profissionais de enfermagem, especialmente durante a pandemia. Esses resultados são sinais importantes, mas não permitem afirmar que a mesma porcentagem representa toda a enfermagem brasileira em 2026.</p></div></section>,
    <section key="j8"><JourneyHeader number={8} kicker="O Brasil e o mundo" title="Um mapa de proteção, responsabilidade e apoio" /><div className="grid gap-5 md:grid-cols-2"><article><h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-cqc-ink">🇧🇷 Brasil</h3><ul className="cqc-list"><li>Constituição Federal — saúde e proteção no trabalho</li><li>Lei nº 8.080/1990 — saúde do trabalhador no SUS</li><li>PNSTT — promoção, proteção e vigilância</li><li>NR-1 — GRO, PGR e riscos psicossociais</li><li>NR-17 — ergonomia e organização do trabalho</li><li>Lei nº 7.498/1986 e Código de Ética da Enfermagem</li></ul></article><article><h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-cqc-ink">🌎 Mundo</h3><ul className="cqc-list"><li>OMS — Diretrizes de Saúde Mental no Trabalho</li><li>OMS/OIT — prevenir, proteger, promover e apoiar</li><li>OIT Convenção nº 155 — saúde e segurança</li><li>OIT Convenção nº 190 — violência e assédio</li><li>IHI — bem-estar da força de trabalho em saúde</li></ul></article></div><div className="mt-6 grid grid-cols-3 gap-2 text-center"><div className="cqc-pillar">Prevenir</div><div className="cqc-pillar">Proteger</div><div className="cqc-pillar">Apoiar</div></div><p className="mt-5 text-center text-sm leading-relaxed text-cqc-muted">Governos, empregadores, lideranças, equipes e trabalhadores têm responsabilidades diferentes e complementares. Saúde mental no trabalho nunca deve ser um dever solitário.</p></section>,
  ];

  return <div className="cqc-root -mx-4 -mt-3 overflow-hidden md:mx-0 md:rounded-lg" id="cuidando-quem-cuida">
    {!started ? <section className="relative min-h-[650px] overflow-hidden bg-cqc-deep md:min-h-[720px]">
      <img src={espelhoImage} alt="Profissional de enfermagem observa seu reflexo após o plantão" width={1600} height={1000} fetchPriority="high" className="absolute inset-0 h-full w-full object-cover object-[62%_center]" />
      <div className="absolute inset-0 bg-cqc-hero" />
      <motion.div initial={reduce ? false : { opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .9 }} className="relative z-10 flex min-h-[650px] max-w-2xl flex-col justify-end px-6 pb-12 pt-24 md:min-h-[720px] md:px-12 md:pb-16">
        <p className="mb-4 text-xs font-bold uppercase text-cqc-aqua">Cuidando de quem cuida · Uma viagem por dentro</p>
        <h2 className="font-display text-3xl font-bold leading-tight text-cqc-paper md:text-5xl">Antes de cuidar do outro, você consegue perceber o que está acontecendo dentro de você?</h2>
        <div className="mt-6 space-y-1 text-sm leading-relaxed text-cqc-paper/80 md:text-base"><p>Você aprendeu a reconhecer sinais no paciente.</p><p>Aprendeu a observar alterações.</p><p>Aprendeu a agir diante de situações críticas.</p><p className="pt-2 font-bold text-cqc-paper">Mas quanto você aprendeu a observar em você?</p></div>
        <Button size="lg" onClick={() => { setStarted(true); setStep(0); }} className="mt-7 h-auto w-fit bg-cqc-aqua px-6 py-4 font-bold text-cqc-deep hover:bg-cqc-paper">Começar minha viagem <ArrowRight /></Button>
      </motion.div>
    </section> : <>
      <div className="sticky top-[72px] z-30 border-b border-cqc-line bg-cqc-paper/95 px-4 py-3 backdrop-blur md:top-[80px] md:px-7"><div className="mb-2 flex items-center justify-between text-xs font-semibold text-cqc-muted"><span>{step < 8 ? `Jornada ${step+1} de 8` : "Seu kit de proteção"}</span><span>{Math.round(((step+1)/9)*100)}%</span></div><div className="h-1.5 overflow-hidden rounded-full bg-cqc-line"><motion.div className="h-full bg-cqc-teal" animate={{ width: `${((step+1)/9)*100}%` }} /></div></div>
      <main id="cqc-stage" className="scroll-mt-36 bg-cqc-bg px-5 py-9 md:px-12 md:py-14">
        <AnimatePresence mode="wait"><motion.div key={step} initial={reduce ? false : { opacity: 0, x: 26 }} animate={{ opacity: 1, x: 0 }} exit={reduce ? undefined : { opacity: 0, x: -20 }} transition={{ duration: .35 }} className="mx-auto max-w-3xl">
          {step < 8 ? (screens[step] ?? null) : <section><div className="mb-7 text-center"><span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-cqc-deep text-cqc-aqua"><Shield className="h-7 w-7"/></span><p className="text-xs font-bold uppercase text-cqc-teal">Agora olhe novamente para você</p><h2 className="mt-2 font-display text-3xl font-bold text-cqc-ink">Monte seu kit de proteção</h2><p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-cqc-muted">Escolha o que você quer fortalecer. Não é uma prescrição: é um lembrete construído por você e salvo somente neste aparelho.</p></div><div className="grid gap-3 sm:grid-cols-2">{kitItems.map(({id,label,icon:Icon}) => <button type="button" key={id} onClick={() => toggleKit(id)} className={`cqc-choice ${kit.includes(id) ? "cqc-choice-active" : ""}`} aria-pressed={kit.includes(id)}><Icon className="h-5 w-5"/><strong>{label}</strong>{kit.includes(id) && <Check className="ml-auto h-5 w-5"/>}</button>)}</div>{selectedKit.length > 0 && <Reveal className="mt-7 rounded-md bg-cqc-deep p-6 text-cqc-paper"><h3 className="text-lg font-bold">Meu lembrete de proteção</h3><ul className="mt-4 space-y-3">{selectedKit.map(({id,label,action}) => <li key={id} className="flex gap-3 text-sm leading-relaxed"><Check className="mt-0.5 h-4 w-4 shrink-0 text-cqc-aqua"/><span><strong>{label}:</strong> {action}</span></li>)}</ul></Reveal>}<blockquote className="cqc-quote">Seu kit não precisa estar completo hoje. Cuidar de quem cuida também é reconhecer que ninguém deveria precisar enfrentar tudo sozinho.</blockquote><Button variant="outline" onClick={reset} className="mx-auto flex"><RefreshCcw/> Refazer minha jornada</Button></section>}
          <div className="mt-10 flex items-center justify-between border-t border-cqc-line pt-5"><Button variant="ghost" onClick={previous} disabled={step===0}><ArrowLeft/> Voltar</Button>{step < 8 && <Button onClick={next} className="bg-cqc-deep text-cqc-paper hover:bg-cqc-teal">{step===7 ? "Montar meu kit" : "Continuar"}<ArrowRight/></Button>}</div>
        </motion.div></AnimatePresence>
      </main>
      <section className="bg-cqc-paper px-5 py-10 md:px-12"><div className="mx-auto max-w-3xl"><div className="rounded-md border border-cqc-line bg-cqc-mist p-5"><h2 className="flex items-center gap-2 font-display text-xl font-bold text-cqc-ink"><CircleHelp className="text-cqc-teal"/> Importante</h2><p className="mt-3 text-sm leading-relaxed text-cqc-muted">Esta experiência tem finalidade educativa e promove reflexão sobre saúde mental e trabalho. Ela não realiza diagnóstico psicológico ou psiquiátrico, não substitui avaliação profissional e não determina se alguém possui um transtorno mental.</p><button type="button" onClick={() => setShowHelp(v=>!v)} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-cqc-teal">Preciso encontrar apoio <ChevronDown className={`h-4 w-4 transition ${showHelp ? "rotate-180" : ""}`}/></button>{showHelp && <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3"><a className="cqc-help" href="https://www.gov.br/saude/pt-br/composicao/saes/desmad/raps/caps" target="_blank" rel="noreferrer"><HeartHandshake/> CAPS ou UBS<span>Busque acolhimento na rede pública</span></a><a className="cqc-help" href="tel:188"><LifeBuoy/> CVV 188<span>Apoio emocional gratuito, 24 horas</span></a><a className="cqc-help" href="tel:192"><Zap/> Risco imediato<span>SAMU 192 ou emergência mais próxima</span></a></div>}</div><details className="mt-7 border-t border-cqc-line pt-5"><summary className="cursor-pointer font-bold text-cqc-ink">Referências e fontes</summary><p className="mt-3 text-xs leading-relaxed text-cqc-muted">As estatísticas regionais não representam automaticamente toda a enfermagem brasileira. Dados da pandemia são apresentados com seu período e contexto.</p><ol className="mt-4 space-y-2">{references.map(([label,url],i) => <li key={url} className="text-xs leading-relaxed"><a href={url} target="_blank" rel="noreferrer" className="flex items-start gap-2 text-cqc-teal hover:underline"><span>{i+1}.</span><span>{label}</span><ExternalLink className="mt-0.5 h-3 w-3 shrink-0"/></a></li>)}</ol></details></div></section>
    </>}
  </div>;
}
