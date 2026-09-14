import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  BookHeart,
  Check,
  CircleHelp,
  Heart,
  Home,
  LifeBuoy,
  Lock,
  MessageCircleHeart,
  Moon,
  Phone,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Users,
  Wind,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import heroImage from "@/assets/cuidando-espelho.jpg";

type Section = "momento" | "limites" | "colo" | "apoio" | "diario" | "direitos";
type Mood = "Exausto" | "Culpado" | "Sem forças" | "Em paz";
type SignGroup = "Corpo" | "Mente" | "Emoções";
type Reaction = "torcendo" | "entendo" | "abraco";

type Post = {
  id: number;
  text: string;
  time: string;
  reactions: Record<Reaction, number>;
};

const moods: Array<{ id: Mood; emoji: string; title: string; message: string; tone: string }> = [
  {
    id: "Exausto",
    emoji: "🥱",
    title: "Exausto(a)",
    message: "Você não precisa transformar exaustão em culpa. Seu corpo está pedindo pausa depois de sustentar muita coisa.",
    tone: "bg-[#e8ded0] border-[#d6c4ae]",
  },
  {
    id: "Culpado",
    emoji: "🥺",
    title: "Com culpa",
    message: "Nem tudo que acontece em um plantão está sob seu controle. Condições de trabalho também importam — e você merece ser ouvido(a).",
    tone: "bg-[#e7edf0] border-[#cad9de]",
  },
  {
    id: "Sem forças",
    emoji: "🫥",
    title: "Sem forças",
    message: "Você não precisa dar conta de tudo hoje. Reduzir o ritmo também é uma forma de proteção.",
    tone: "bg-[#e6eadf] border-[#cbd5bf]",
  },
  {
    id: "Em paz",
    emoji: "🌿",
    title: "Em paz",
    message: "Guarde esse momento. Paz não é prêmio por produzir mais; é algo que também merece espaço na sua vida.",
    tone: "bg-[#e1ebe4] border-[#bfd2c5]",
  },
];

const signs: Record<SignGroup, string[]> = {
  Corpo: ["Sono que não descansa", "Palpitações ou coração acelerado", "Dor de cabeça frequente", "Tensão muscular persistente", "Cansaço que não melhora com repouso"],
  Mente: ["Esquecimentos fora do habitual", "Dificuldade de concentração", "Irritabilidade desproporcional", "Sensação de estar sempre em alerta", "Dificuldade para desligar do trabalho"],
  Emoções: ["Sensação de vazio", "Apatia ou perda de interesse", "Choro fácil ou vontade de se isolar", "Sensação de fracasso ou inadequação", "Cinismo ou indiferença como defesa"],
};

const reflections = [
  "Você cuida de pessoas. Hoje, permita que o cuidado também alcance você.",
  "Resiliência não significa aguentar tudo. Às vezes significa reconhecer que algo precisa mudar.",
  "Que você encontre discernimento para distinguir o que é sua responsabilidade do que pertence ao sistema.",
  "Nenhuma profissão deveria exigir que você desaparecesse de si para continuar cuidando dos outros.",
];

const rights = [
  {
    icon: ShieldCheck,
    title: "Sobrecarga",
    text: "Quando a demanda ultrapassa a capacidade segura da equipe, registre os fatos de forma objetiva: data, horário, setor, composição da equipe, demanda assistencial e medidas adotadas.",
  },
  {
    icon: BookHeart,
    title: "Documentação ética",
    text: "Registre condições concretas e relevantes para a assistência, sem expor pacientes além do necessário. A finalidade é comunicação profissional e proteção, não confronto.",
  },
  {
    icon: LifeBuoy,
    title: "Limites e segurança",
    text: "Conheça suas atribuições, protocolos institucionais e canais formais de comunicação. Em situação de risco, priorize a segurança do paciente e a sua própria segurança profissional.",
  },
];

const initialPosts: Post[] = [
  { id: 1, text: "Hoje o plantão estava com pouca gente e eu saí sentindo que fiz o possível, mas ainda assim me senti insuficiente.", time: "há pouco", reactions: { torcendo: 8, entendendo: 12, abraco: 7 } },
  { id: 2, text: "Cheguei em casa e meus filhos queriam atenção. Eu amo estar com eles, mas às vezes parece que o plantão continua dentro de mim.", time: "há 1h", reactions: { torcendo: 11, entendendo: 16, abraco: 13 } },
  { id: 3, text: "Só queria dizer para quem está lendo: você não é fraco por estar cansado. Eu também estou aprendendo a respeitar meus limites.", time: "há 2h", reactions: { torcendo: 19, entendendo: 23, abraco: 21 } },
];

const reactionLabels: Record<Reaction, string> = {
  torcendo: "Estou torcendo por você",
  entendendo: "Te entendo perfeitamente",
  abraco: "Te envio um abraço",
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 5) return "Ainda acordada(o)? Então fique aqui um pouco.";
  if (hour < 12) return "Bom dia. Antes de cuidar de todos, perceba como você está.";
  if (hour < 18) return "Boa tarde. Você não precisa atravessar o plantão no automático.";
  return "Boa noite. Se o plantão terminou, agora é hora de cuidar de quem cuidou.";
}

export function CuidandoQuemCuida() {
  const reducedMotion = useReducedMotion();
  const [section, setSection] = useState<Section>("momento");
  const [mood, setMood] = useState<Mood | null>(null);
  const [checked, setChecked] = useState<string[]>([]);
  const [breathing, setBreathing] = useState(false);
  const [diary, setDiary] = useState("");
  const [burning, setBurning] = useState(false);
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [newPost, setNewPost] = useState("");
  const [reflectionIndex, setReflectionIndex] = useState(0);
  const [showHelp, setShowHelp] = useState(false);

  const urgency = Math.min(100, checked.length * 7);
  const urgencyLabel = urgency >= 70 ? "Seu autocuidado merece prioridade agora" : urgency >= 35 ? "Vale diminuir o ritmo e observar com carinho" : "Continue percebendo seus sinais sem se cobrar";

  const selectedMood = useMemo(() => moods.find((item) => item.id === mood), [mood]);

  const toggleSign = (sign: string) => {
    setChecked((current) => current.includes(sign) ? current.filter((item) => item !== sign) : [...current, sign]);
  };

  const addPost = () => {
    const text = newPost.trim();
    if (!text) return;
    setPosts((current) => [{ id: Date.now(), text, time: "agora", reactions: { torcendo: 0, entendendo: 0, abraco: 0 } }, ...current]);
    setNewPost("");
  };

  const react = (postId: number, reaction: Reaction) => {
    setPosts((current) => current.map((post) => post.id === postId ? { ...post, reactions: { ...post.reactions, [reaction]: post.reactions[reaction] + 1 } } : post));
  };

  const releaseDiary = () => {
    if (!diary.trim()) return;
    setBurning(true);
    window.setTimeout(() => {
      setDiary("");
      setBurning(false);
    }, reducedMotion ? 50 : 1100);
  };

  const navItems: Array<{ id: Section; label: string; icon: typeof Heart }> = [
    { id: "momento", label: "Meu momento", icon: Home },
    { id: "limites", label: "Olhar para mim", icon: Activity },
    { id: "colo", label: "Rede de colo", icon: Users },
    { id: "apoio", label: "Apoio", icon: Wind },
    { id: "diario", label: "Diário", icon: Lock },
    { id: "direitos", label: "Direitos & SOS", icon: LifeBuoy },
  ];

  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-[#f7f7f1] text-[#24443d] shadow-[0_24px_80px_rgba(36,68,61,0.12)] ring-1 ring-[#dfe5dc]">
      <div className="pointer-events-none absolute -left-28 top-40 h-72 w-72 rounded-full bg-[#dfe9df]/70 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-[42rem] h-80 w-80 rounded-full bg-[#dce7eb]/60 blur-3xl" />

      <header className="relative overflow-hidden bg-[#183b33] text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-[#183b33] via-[#23483f] to-[#46665c]/80" />
        <div className="relative grid min-h-[300px] items-end gap-8 p-6 sm:p-8 lg:grid-cols-[1.25fr_.75fr] lg:p-10">
          <div className="max-w-2xl pb-2">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-white/85 backdrop-blur-md">
              <Heart className="h-3.5 w-3.5" /> Cuidando de Quem Cuida
            </div>
            <p className="mb-2 text-sm font-medium text-[#c9dbd2]">{getGreeting()}</p>
            <h1 className="font-serif text-4xl leading-[1.05] tracking-tight sm:text-5xl">Você também merece cuidado.</h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#d9e5df] sm:text-lg">Um espaço para respirar, perceber seus limites e lembrar que ser profissional de enfermagem não significa deixar de ser pessoa.</p>
          </div>
          <div className="hidden self-stretch overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/10 lg:block">
            <img src={heroImage} alt="Pessoa diante do espelho representando autocuidado" className="h-full min-h-[250px] w-full object-cover opacity-90 mix-blend-luminosity" />
          </div>
        </div>
      </header>

      <nav className="sticky top-0 z-30 border-b border-[#dce4dd] bg-[#f7f7f1]/92 px-3 py-3 backdrop-blur-xl sm:px-5">
        <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = section === item.id;
            return (
              <button key={item.id} onClick={() => setSection(item.id)} className={`group flex min-w-max items-center gap-2 rounded-full px-3.5 py-2.5 text-xs font-semibold transition-all duration-300 sm:text-sm ${active ? "bg-[#dfe9df] text-[#183b33] shadow-sm" : "text-[#60756e] hover:bg-white hover:text-[#183b33]"}`}>
                <Icon className={`h-4 w-4 transition-transform group-hover:scale-110 ${active ? "text-[#547a69]" : ""}`} />
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>

      <main className="relative mx-auto max-w-6xl px-4 pb-24 pt-6 sm:px-6 sm:pt-8 lg:px-8">
        {section === "momento" && (
          <motion.div initial={{ opacity: 0, y: reducedMotion ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <section>
              <div className="mb-4 flex items-end justify-between gap-4">
                <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#739086]">Meu momento</p><h2 className="mt-1 font-serif text-3xl text-[#183b33]">Como você está, de verdade?</h2></div>
                <span className="hidden text-xs text-[#7b8d87] sm:block">Sem julgamento. Sem nota.</span>
              </div>
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {moods.map((item) => {
                  const active = mood === item.id;
                  return <motion.button whileHover={reducedMotion ? undefined : { y: -3 }} whileTap={reducedMotion ? undefined : { scale: .98 }} key={item.id} onClick={() => setMood(item.id)} className={`rounded-2xl border p-4 text-left transition-all duration-300 ${item.tone} ${active ? "ring-2 ring-[#547a69] ring-offset-2 ring-offset-[#f7f7f1]" : "hover:-translate-y-0.5 hover:shadow-md"}`}><div className="text-3xl">{item.emoji}</div><p className="mt-3 text-sm font-bold text-[#29483f]">{item.title}</p><p className="mt-1 text-xs leading-5 text-[#60736c]">Toque para se reconhecer</p></motion.button>;
                })}
              </div>
              {selectedMood && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4 overflow-hidden"><div className="flex items-start gap-3 rounded-2xl border border-[#cbd9ce] bg-white/75 p-4 shadow-sm backdrop-blur"><MessageCircleHeart className="mt-0.5 h-5 w-5 shrink-0 text-[#668a7b]" /><div><p className="font-semibold text-[#27473e]">Eu ouvi você.</p><p className="mt-1 text-sm leading-6 text-[#5e716b]">{selectedMood.message}</p></div></div></motion.div>}
            </section>

            <section className="grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
              <Card className="overflow-hidden rounded-3xl border-[#d8e3db] bg-[#e8efe9] p-0 shadow-none">
                <div className="p-6 sm:p-7"><div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/60 px-3 py-1.5 text-xs font-bold text-[#527365]"><Sparkles className="h-3.5 w-3.5" /> Destaque do dia</div><h3 className="font-serif text-2xl text-[#23473d]">Dois minutos só para você</h3><p className="mt-2 max-w-xl text-sm leading-6 text-[#5f736b]">Antes de abrir a porta de casa, pare por dois minutos. Solte os ombros. Inspire pelo nariz. Expire mais devagar do que inspirou. O plantão acabou — você não precisa levá-lo inteiro para dentro de casa.</p><div className="mt-5 flex flex-wrap gap-3"><Button onClick={() => { setSection("apoio"); setBreathing(true); }} className="rounded-full bg-[#315b4e] px-5 hover:bg-[#264c41]"><Wind className="mr-2 h-4 w-4" /> Fazer agora</Button><Button variant="ghost" onClick={() => setSection("diario")} className="rounded-full text-[#315b4e] hover:bg-white/60">Deixar o plantão aqui <ArrowRight className="ml-2 h-4 w-4" /></Button></div></div>
              </Card>
              <Card className="rounded-3xl border-[#e3ddd2] bg-[#f0e9df]/80 p-6 shadow-none"><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8a7862]">Uma lembrança importante</p><p className="mt-4 font-serif text-2xl leading-snug text-[#574d42]">“Condições difíceis de trabalho não são prova de que você é um profissional ruim.”</p><p className="mt-4 text-sm leading-6 text-[#786e63]">Você pode ser responsável pela sua atuação e, ao mesmo tempo, reconhecer limites, recursos insuficientes e problemas estruturais.</p></Card>
            </section>
          </motion.div>
        )}

        {section === "limites" && (
          <motion.div initial={{ opacity: 0, y: reducedMotion ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#739086]">Conhece-te por dentro</p><h2 className="mt-1 font-serif text-3xl text-[#183b33]">Seu corpo conversa com você.</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-[#60736c]">Marque o que tem acontecido. Isto não diagnostica burnout — é um convite para perceber sinais antes que você precise chegar ao limite.</p></div>
            <Card className="rounded-3xl border-[#d9e3dc] bg-white/70 p-5 shadow-sm"><div className="flex flex-col gap-4 sm:flex-row sm:items-center"><div className="flex-1"><div className="flex items-center justify-between gap-4"><div><p className="text-sm font-bold text-[#29483f]">Urgência de autocuidado</p><p className="mt-1 text-xs text-[#71827d]">{checked.length} sinal(is) percebido(s)</p></div><span className="rounded-full bg-[#e7eee8] px-3 py-1 text-xs font-bold text-[#547568]">{urgency}%</span></div><Progress value={urgency} className="mt-3 h-2.5 bg-[#e8eee9]" /></div><div className="max-w-sm rounded-2xl bg-[#f0f3ed] px-4 py-3 text-xs leading-5 text-[#61736c]"><CircleHelp className="mr-1 inline h-3.5 w-3.5" /> {urgencyLabel}.</div></div></Card>
            <div className="grid gap-4 md:grid-cols-3">
              {(Object.keys(signs) as SignGroup[]).map((group) => <Card key={group} className="rounded-3xl border-[#dfe5df] bg-white/65 p-5 shadow-none"><div className="mb-4 flex items-center gap-2"><span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#e7eee8] text-[#55796b]"><Activity className="h-4 w-4" /></span><h3 className="font-bold text-[#29483f]">{group}</h3></div><div className="space-y-2.5">{signs[group].map((sign) => { const active = checked.includes(sign); return <button key={sign} onClick={() => toggleSign(sign)} className={`flex w-full items-start gap-3 rounded-2xl border p-3 text-left text-sm transition-all ${active ? "border-[#a9c1b1] bg-[#eaf1eb] text-[#315b4e]" : "border-[#e8ece8] bg-white/50 text-[#65766f] hover:bg-white"}`}><span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${active ? "border-[#6e907f] bg-[#6e907f] text-white" : "border-[#cbd5cf]"}`}>{active && <Check className="h-3 w-3" />}</span><span>{sign}</span></button> })}</div></Card>)}
            </div>
            {urgency >= 70 && <Card className="rounded-3xl border-[#e4d5c5] bg-[#f4ece3] p-5 shadow-none"><p className="font-bold text-[#665443]">Um convite, não uma sentença</p><p className="mt-1 text-sm leading-6 text-[#75695c]">Se esses sinais são intensos, persistentes ou estão interferindo no sono, trabalho, relações ou segurança, considere conversar com um profissional de saúde. Pedir ajuda cedo é cuidado — não fracasso.</p></Card>}
          </motion.div>
        )}

        {section === "colo" && (
          <motion.div initial={{ opacity: 0, y: reducedMotion ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#739086]">Rede de colo</p><h2 className="mt-1 font-serif text-3xl text-[#183b33]">Aqui, ninguém precisa parecer forte.</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-[#60736c]">Um mural de relatos para lembrar que outras pessoas também conhecem o peso de um plantão difícil e da jornada que continua em casa.</p></div>
            <Card className="rounded-3xl border-[#dce4dd] bg-white/70 p-5 shadow-sm"><div className="mb-3 flex items-center gap-2"><div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#e7eee8]"><MessageCircleHeart className="h-4 w-4 text-[#55796b]" /></div><div><p className="text-sm font-bold text-[#29483f]">Deixe algumas palavras</p><p className="text-xs text-[#7a8984]">Seu relato será mostrado sem nome.</p></div></div><Textarea value={newPost} onChange={(e) => setNewPost(e.target.value)} placeholder="O que você gostaria que outro profissional entendesse hoje?" className="min-h-[110px] resize-none rounded-2xl border-[#dce5de] bg-[#fbfcf9] focus-visible:ring-[#91ad9e]" /><div className="mt-3 flex justify-end"><Button onClick={addPost} disabled={!newPost.trim()} className="rounded-full bg-[#315b4e] hover:bg-[#264c41]">Compartilhar anonimamente <ArrowRight className="ml-2 h-4 w-4" /></Button></div></Card>
            <div className="space-y-4">{posts.map((post) => <Card key={post.id} className="rounded-3xl border-[#e0e6e1] bg-white/65 p-5 shadow-none"><div className="flex items-center justify-between"><span className="inline-flex items-center gap-2 rounded-full bg-[#eef2ed] px-3 py-1 text-[11px] font-semibold text-[#718079]"><span className="h-1.5 w-1.5 rounded-full bg-[#82a18f]" /> anônimo</span><span className="text-xs text-[#8a9892]">{post.time}</span></div><p className="mt-4 text-[15px] leading-7 text-[#4f635c]">{post.text}</p><div className="mt-4 flex flex-wrap gap-2">{(Object.keys(reactionLabels) as Reaction[]).map((reaction) => <button key={reaction} onClick={() => react(post.id, reaction)} className="rounded-full border border-[#dce5de] bg-[#f8faf7] px-3 py-2 text-xs font-medium text-[#61736c] transition hover:border-[#b9ccbf] hover:bg-[#edf4ee]">{reaction === "torcendo" ? "🤍" : reaction === "entendo" ? "🫶" : "🫂"} {reactionLabels[reaction]} · {post.reactions[reaction]}</button>)}</div></Card>)}</div>
          </motion.div>
        )}

        {section === "apoio" && (
          <motion.div initial={{ opacity: 0, y: reducedMotion ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#739086]">Apoio & fortalecimento</p><h2 className="mt-1 font-serif text-3xl text-[#183b33]">Desacelere antes de chegar em casa.</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-[#60736c]">Ferramentas simples para tirar o corpo do modo plantão e devolver espaço para você.</p></div>
            <div className="grid gap-5 lg:grid-cols-2">
              <Card className="rounded-3xl border-[#d9e4dd] bg-[#e9f0eb] p-6 shadow-none"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/70 text-[#527568]"><Wind className="h-5 w-5" /></span><div><h3 className="font-bold text-[#29483f]">Respiração guiada</h3><p className="text-xs text-[#71827b]">Inspirar · segurar · expirar</p></div></div><div className="flex min-h-[260px] flex-col items-center justify-center"><motion.div animate={breathing && !reducedMotion ? { scale: [1, 1.28, 1.28, 1], opacity: [0.65, 1, 1, 0.65] } : { scale: 1 }} transition={{ duration: 8, repeat: breathing ? Infinity : 0, ease: "easeInOut" }} className="flex h-36 w-36 items-center justify-center rounded-full border border-white/70 bg-white/60 shadow-[0_0_0_18px_rgba(255,255,255,.18)]"><div className="text-center"><Wind className="mx-auto h-6 w-6 text-[#668b7c]" /><p className="mt-2 text-xs font-bold text-[#4f7164]">{breathing ? "Respire" : "Pronta(o)?"}</p></div></motion.div><Button onClick={() => setBreathing((value) => !value)} className="mt-8 rounded-full bg-[#315b4e] hover:bg-[#264c41]">{breathing ? "Encerrar prática" : "Começar 2 minutos"}</Button></div></Card>
              <div className="space-y-5"><Card className="rounded-3xl border-[#e1e4dd] bg-[#f0efe7]/85 p-6 shadow-none"><div className="flex items-center gap-2 text-[#7b7761]"><Moon className="h-5 w-5" /><h3 className="font-bold">Descompressão no caminho de casa</h3></div><ol className="mt-5 space-y-3 text-sm leading-6 text-[#69736b]"><li><span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-bold">1</span> Desaperte mandíbula e ombros.</li><li><span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-bold">2</span> Escolha uma frase: “O plantão terminou. Eu estou voltando para mim.”</li><li><span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-bold">3</span> Antes de entrar em casa, faça três expirações longas.</li></ol></Card><Card className="rounded-3xl border-[#ded8cd] bg-[#f1e9df]/80 p-6 shadow-none"><div className="flex items-center justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-[#8b7964]">Espiritualidade sem rótulo</p><h3 className="mt-1 font-serif text-2xl text-[#5b5044]">Uma palavra para hoje</h3></div><BookHeart className="h-6 w-6 text-[#8c7d69]" /></div><p className="mt-5 font-serif text-lg leading-7 text-[#64594d]">{reflections[reflectionIndex]}</p><Button variant="ghost" onClick={() => setReflectionIndex((value) => (value + 1) % reflections.length)} className="mt-3 rounded-full text-[#735f4a] hover:bg-white/50"><RotateCcw className="mr-2 h-4 w-4" /> Outra reflexão</Button></Card></div>
            </div>
          </motion.div>
        )}

        {section === "diario" && (
          <motion.div initial={{ opacity: 0, y: reducedMotion ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl space-y-6">
            <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#739086]">Diário secreto</p><h2 className="mt-1 font-serif text-3xl text-[#183b33]">Deixe aqui o seu plantão.</h2><p className="mt-2 text-sm leading-6 text-[#60736c]">Este espaço é para colocar em palavras o que ficou preso na cabeça. Não precisa escrever bonito. Pode escrever tudo.</p></div>
            <Card className={`relative overflow-hidden rounded-[2rem] border-[#dce5de] bg-[#fffef9] p-5 shadow-[0_20px_60px_rgba(73,82,65,.08)] sm:p-7 ${burning ? "pointer-events-none" : ""}`}>
              <div className="mb-5 flex items-center justify-between"><span className="inline-flex items-center gap-2 rounded-full bg-[#eef2ed] px-3 py-1.5 text-xs font-semibold text-[#718079]"><Lock className="h-3.5 w-3.5" /> privado neste dispositivo</span><span className="text-xs text-[#a0aaa5]">sem julgamento</span></div>
              <div className="relative"><Textarea value={diary} onChange={(e) => setDiary(e.target.value)} placeholder="Escreva o que você não conseguiu dizer..." className="min-h-[330px] resize-none rounded-3xl border-[#e6e8df] bg-[#fbfbf6] p-5 text-[15px] leading-7 text-[#52645c] shadow-inner focus-visible:ring-[#91ad9e]" />{burning && <motion.div initial={{ opacity: 0, scale: .8, rotate: -3 }} animate={{ opacity: [0,1,1,0], scale: [0.8,1.03,1.15,1.3], y: [0, -10, -35, -75], filter: ["blur(0px)","blur(0px)","blur(2px)","blur(8px)"] }} transition={{ duration: 1.05 }} className="pointer-events-none absolute inset-0 flex items-center justify-center"><div className="rounded-full bg-[#d7b98d]/30 px-8 py-5 text-sm font-semibold text-[#826e53] backdrop-blur-sm">Liberando o peso…</div></motion.div>}</div>
              <div className="mt-5 flex flex-col gap-3 rounded-2xl bg-[#f0f3ed] p-4 sm:flex-row sm:items-center sm:justify-between"><p className="max-w-lg text-xs leading-5 text-[#687972]">Quando estiver pronta(o), libere. O texto some desta tela como um gesto simbólico de encerramento do plantão.</p><Button onClick={releaseDiary} disabled={!diary.trim() || burning} className="shrink-0 rounded-full bg-[#5e766b] hover:bg-[#4e665c]"><Sparkles className="mr-2 h-4 w-4" /> Queimar / liberar</Button></div>
            </Card>
          </motion.div>
        )}

        {section === "direitos" && (
          <motion.div initial={{ opacity: 0, y: reducedMotion ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#739086]">Guia de direitos & SOS</p><h2 className="mt-1 font-serif text-3xl text-[#183b33]">Cuidar de você também é proteção.</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-[#60736c]">Informação prática para atravessar situações de sobrecarga com mais segurança, ética e clareza.</p></div>
            <Accordion type="single" collapsible className="space-y-3">{rights.map((item, index) => { const Icon = item.icon; return <AccordionItem key={item.title} value={`right-${index}`} className="rounded-3xl border border-[#dfe6df] bg-white/65 px-5 shadow-none"><AccordionTrigger className="py-5 hover:no-underline"><span className="flex items-center gap-3 text-left"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#e8efe9] text-[#58796d]"><Icon className="h-5 w-5" /></span><span><span className="block font-bold text-[#29483f]">{item.title}</span><span className="mt-0.5 block text-xs font-normal text-[#81908a]">Toque para entender</span></span></span></AccordionTrigger><AccordionContent className="pb-5 pl-[52px] pr-2 text-sm leading-6 text-[#62736c]">{item.text}</AccordionContent></AccordionItem> })}</Accordion>
            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="rounded-3xl border-[#dce5de] bg-[#e9f0eb] p-5 shadow-none"><div className="flex items-start gap-3"><Phone className="mt-1 h-5 w-5 text-[#55796b]" /><div><h3 className="font-bold text-[#29483f]">CVV — apoio emocional</h3><p className="mt-1 text-sm leading-6 text-[#65776f]">Se você estiver em sofrimento emocional e precisar conversar, o Centro de Valorização da Vida atende gratuitamente pelo <strong>188</strong>.</p><Button variant="ghost" onClick={() => setShowHelp(true)} className="mt-2 rounded-full px-0 text-[#527568] hover:bg-transparent">Ver orientação <ArrowRight className="ml-1 h-4 w-4" /></Button></div></div></Card>
              <Card className="rounded-3xl border-[#e3ddd2] bg-[#f2ebe2]/80 p-5 shadow-none"><div className="flex items-start gap-3"><LifeBuoy className="mt-1 h-5 w-5 text-[#89775f]" /><div><h3 className="font-bold text-[#5c5144]">Se houver risco imediato</h3><p className="mt-1 text-sm leading-6 text-[#756b61]">Procure um serviço de emergência ou acione o serviço local de urgência. Este mini app não substitui atendimento profissional.</p></div></div></Card>
            </div>
            <div className="rounded-3xl border border-[#dce5de] bg-white/55 p-5 text-xs leading-5 text-[#74827d]"><ShieldCheck className="mr-1 inline h-4 w-4 text-[#628274]" /> Conteúdo educativo e de autocuidado. Não é instrumento diagnóstico nem substitui avaliação de saúde, orientação jurídica, ética ou institucional.</div>
          </motion.div>
        )}
      </main>

      {showHelp && <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#183b33]/35 p-4 backdrop-blur-sm sm:items-center"><motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md rounded-3xl border border-white/60 bg-[#fbfcf8] p-6 shadow-2xl"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-[#739086]">Apoio</p><h3 className="mt-1 font-serif text-2xl text-[#183b33]">Você não precisa atravessar isso sozinho(a).</h3></div><button onClick={() => setShowHelp(false)} className="rounded-full p-2 text-[#74827d] hover:bg-[#edf2ed]"><X className="h-5 w-5" /></button></div><p className="mt-4 text-sm leading-6 text-[#62736c]">O CVV oferece apoio emocional gratuito pelo telefone 188, 24 horas por dia. Em situação de emergência ou risco imediato, procure atendimento de urgência.</p><Button onClick={() => setShowHelp(false)} className="mt-5 w-full rounded-full bg-[#315b4e] hover:bg-[#264c41]">Fechar</Button></motion.div></div>}
    </div>
  );
}
