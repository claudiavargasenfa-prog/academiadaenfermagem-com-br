import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Instagram, Lock, Sparkles, FileText, Calculator, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ContentProtection } from "@/components/ContentProtection";
import { Card, PageHeader } from "@/components/AppShell";

const URL = "https://academiadaenfermagem.com.br/manual-estagio";
const TITLE = "Manual de Estágio — O Mundo da Enfermagem";
const DESC =
  "Manual gratuito de sobrevivência no estágio de enfermagem: preparação, comunicação, segurança do paciente e erros que você precisa evitar.";
const INSTAGRAM = "https://www.instagram.com/enfnapraticaoficial/";
const KEY = "adec_manual_estagio_ok";

export const Route = createFileRoute("/manual-estagio")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: URL },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: Page,
});

const schema = z.object({
  nome: z.string().trim().min(2, "Digite seu nome").max(100),
  whatsapp: z.string().regex(/^\d{10,11}$/, "WhatsApp com DDD (10 ou 11 números)"),
  perfil: z.enum(["estudante_tecnico", "academico", "profissional"]),
});

function Shell({ children }: { children: React.ReactNode }) {
  return <main className="mx-auto min-h-screen max-w-4xl px-4 py-6">{children}</main>;
}

function Page() {
  const [ok, setOk] = useState<boolean | null>(null);
  useEffect(() => {
    // Sempre começa pela tela de cadastro: a liberação vale só para a aba aberta.
    if (new URLSearchParams(window.location.search).has("novo")) localStorage.removeItem(KEY);
    setOk(localStorage.getItem(KEY) === "1");
  }, []);
  if (ok === null) return <Shell><div className="py-20" /></Shell>;
  return <Shell>{ok ? <Conteudo /> : <Portaria onDone={() => setOk(true)} />}</Shell>;
}

function Portaria({ onDone }: { onDone: () => void }) {
  const [nome, setNome] = useState("");
  const [whats, setWhats] = useState("");
  const [perfil, setPerfil] = useState("estudante_tecnico");
  const [seguiu, setSeguiu] = useState(false);
  const [falta, setFalta] = useState(0);
  useEffect(() => {
    if (falta <= 0) return;
    const t = setTimeout(() => setFalta((f) => f - 1), 1000);
    return () => clearTimeout(t);
  }, [falta]);
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    const r = schema.safeParse({ nome, whatsapp: whats.replace(/\D/g, ""), perfil });
    if (!r.success) return setErro(r.error.issues[0].message);
    if (!seguiu) return setErro("Siga @enfnapraticaoficial no Instagram para liberar.");
    setEnviando(true);
    const { error } = await supabase.from("manual_leads").insert(r.data);
    setEnviando(false);
    if (error) return setErro("Não conseguimos liberar agora. Tente de novo.");
    localStorage.setItem(KEY, "1");
    onDone();
  }

  return (
    <div className="mx-auto max-w-2xl py-4">
      <div className="relative mb-8 overflow-hidden rounded-[1.75rem] border-2 border-[#D9B64C] bg-[#003F25] text-white shadow-[0_22px_55px_rgba(0,48,28,0.3)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_90%_0%,rgba(217,182,76,0.24),transparent_34%),radial-gradient(ellipse_at_0%_100%,rgba(45,145,87,0.42),transparent_45%)]" />
        <div className="pointer-events-none absolute right-[-3rem] top-[-4rem] h-48 w-48 rounded-full border border-[#F2D778]/20 sm:right-[-2rem] sm:top-[-5rem] sm:h-64 sm:w-64" />
        <div className="pointer-events-none absolute right-[-1.5rem] top-[-2.5rem] h-36 w-36 rounded-full border border-[#F2D778]/15 sm:right-0 sm:top-[-3.5rem] sm:h-48 sm:w-48" />
        <div className="relative mx-auto max-w-4xl px-5 py-8 sm:px-10 sm:py-11">
          <div className="flex flex-col items-center text-center">
            <span className="inline-flex items-center rounded-full bg-[#D9B64C] px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#073923] shadow-md sm:text-xs">
              🎁 Presente 100% grátis
            </span>
            <p className="mt-5 text-[10px] font-extrabold uppercase tracking-[0.3em] text-[#F2D778] sm:text-xs">O Mundo da Enfermagem</p>
            <h1 className="mt-3 max-w-3xl font-display text-3xl font-black uppercase leading-[0.98] tracking-tight sm:text-5xl md:text-6xl">
              Não pise no estágio <span className="text-[#F2C94C]">sem isto.</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/85 sm:mt-5 sm:text-lg">
              O manual de sobrevivência que você precisa antes do primeiro dia de campo.
            </p>
            <div className="mt-7 w-full max-w-3xl">
              <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#F2D778] sm:text-xs">O que você vai encontrar</p>
              <ul className="grid gap-2 sm:grid-cols-2">
                {[
                  { t: "Postura que o preceptor quer ver", href: "#topico-postura" },
                  { t: "Relacionamento com paciente e família", href: "#topico-relacionamento" },
                  { t: "Técnicas essenciais e cálculos", href: "#topico-tecnicas" },
                  { t: "Segurança do paciente sem errar", href: "#topico-seguranca" },
                  { t: "Passagem de plantão ISBAR na prática", href: "#topico-isbar" },
                  { t: "Os erros que reprovam no campo", href: "#topico-erros" },
                ].map((i, index) => (
                  <li key={i.href}>
                    <a href={i.href} className="group flex min-h-[48px] items-center gap-3 rounded-xl border border-white/15 bg-[#075333]/75 px-3 py-3 text-left text-xs font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#F2D778] hover:bg-[#0A6040] sm:text-sm">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[#F2D778]/50 bg-[#D9B64C]/10 text-xs font-black text-[#F2D778]">{String(index + 1).padStart(2, "0")}</span>
                      <span className="flex-1">{i.t}</span>
                      <span className="text-base text-[#F2D778] transition-transform group-hover:translate-x-1">↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <p className="mt-7 inline-flex items-center gap-2 rounded-full border border-[#F2D778]/35 bg-black/10 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#F2D778] sm:text-xs">
              <span>↓</span> Libere seu manual gratuito em cerca de 30 segundos
            </p>
          </div>
        </div>
      </div>
      <Card className="border-4 border-gold shadow-2xl">
        <form onSubmit={enviar} className="space-y-4">
          <label className="block text-sm font-medium">Seu nome
            <input value={nome} onChange={(e) => setNome(e.target.value)} maxLength={100}
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2" />
          </label>
          <label className="block text-sm font-medium">WhatsApp com DDD
            <input value={whats} onChange={(e) => setWhats(e.target.value)} inputMode="tel" maxLength={16}
              placeholder="(11) 91234-5678" className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2" />
          </label>
          <label className="block text-sm font-medium">Você é
            <select value={perfil} onChange={(e) => setPerfil(e.target.value)}
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2">
              <option value="estudante_tecnico">Estudante de Técnico em Enfermagem</option>
              <option value="academico">Acadêmico(a) de Enfermagem</option>
              <option value="profissional">Profissional formado(a)</option>
            </select>
          </label>
          <a
            href={INSTAGRAM}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              // Deixa o navegador abrir a nova aba normalmente (nunca dentro da página).
              if (!seguiu) { setSeguiu(true); setFalta(18); }
            }}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-gold px-4 py-3 font-bold">
            <Instagram className="h-5 w-5" /> {seguiu ? "@enfnapraticaoficial" : "Seguir @enfnapraticaoficial no Instagram"}
          </a>
          {seguiu && falta > 0 && (
            <div className="rounded-xl border border-gold/50 bg-gold/10 p-3 text-sm">
              <p className="font-semibold">⏳ Conferindo novo seguidor em @enfnapraticaoficial... {falta}s</p>
              <p className="mt-1 text-muted-foreground">Ainda não detectamos o seu perfil. Abra o Instagram, clique em SEGUIR e aguarde a validação.</p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full bg-gold transition-all duration-1000" style={{ width: `${((18 - falta) / 18) * 100}%` }} />
              </div>
            </div>
          )}
          {erro && <p className="text-sm text-destructive">{erro}</p>}
          <button disabled={enviando || !seguiu || falta > 0}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-4 text-lg font-black uppercase text-primary-foreground shadow-lg transition-transform enabled:hover:scale-[1.02] disabled:opacity-60">
            <Lock className="h-5 w-5" /> {enviando ? "Liberando..." : seguiu && falta === 0 ? "✓ Perfil validado! Quero meu presente" : "Quero meu Manual grátis"}
          </button>
        </form>
      </Card>
    </div>
  );
}

function Conteudo() {
  const [html, setHtml] = useState<string | null>(null);
  useEffect(() => {
    supabase.rpc("get_manual_estagio_content").then(({ data }) => setHtml((data as string) ?? ""));
  }, []);
  useEffect(() => {
    if (!html) return;
    const el = document.querySelector(".manual-conteudo");
    if (!el) return;
    const mapa: Array<[string, string]> = [
      ["isbar", "topico-isbar"],
      ["passagem de plantão", "topico-isbar"],
      ["primeiro", "topico-primeiro-dia"],
      ["postura", "topico-postura"],
      ["relacionamento", "topico-relacionamento"],
      ["técnicas", "topico-tecnicas"],
      ["segurança", "topico-seguranca"],
      ["erro", "topico-erros"],
    ];
    el.querySelectorAll("h1, h2, h3").forEach((h) => {
      const t = (h.textContent || "").toLowerCase();
      for (const [kw, id] of mapa) {
        if (t.includes(kw) && !document.getElementById(id)) {
          h.id = id;
          break;
        }
      }
    });
    const hash = window.location.hash;
    if (hash.startsWith("#topico-")) {
      const alvo = document.getElementById(hash.slice(1));
      if (alvo) alvo.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    const chips: Array<[RegExp, string]> = [
      [/Postura e Conduta/, "topico-postura"],
      [/Técnicas Essenciais/, "topico-tecnicas"],
      [/Relacionamento com Equipe/, "topico-relacionamento"],
      [/Segurança do Paciente/, "topico-seguranca"],
      [/Primeiro Plantão/, "topico-primeiro-dia"],
    ];
    el.querySelectorAll("span").forEach((s) => {
      const t = s.textContent || "";
      for (const [re, id] of chips) {
        if (re.test(t) && document.getElementById(id) && !s.closest("a")) {
          const a = document.createElement("a");
          a.href = `#${id}`;
          a.style.cursor = "pointer";
          s.parentNode?.insertBefore(a, s);
          a.appendChild(s);
          break;
        }
      }
    });
  }, [html]);
  const pontes = [
    { icon: FileText, t: "Diário de Bordo em ABNT", d: "Seu relatório de estágio organizado enquanto você vive o plantão." },
    { icon: Calculator, t: "Motores de Cálculo Clínico", d: "Gotejamento, diluição e dose por peso em segundos." },
    { icon: Award, t: "Certificado em cada módulo", d: "Horas complementares com validação digital." },
  ];
  return (
    <ContentProtection allowPrint>
      <PageHeader eyebrow="O Mundo da Enfermagem" title="Manual de Sobrevivência no Estágio"
        description="Seu acesso está liberado. Bom estágio!" />
      <button type="button" onClick={() => { localStorage.removeItem(KEY); window.location.reload(); }}
        className="mb-4 text-xs text-muted-foreground underline">Ver a tela de cadastro novamente</button>
      {html === null ? <p className="py-10 text-center text-muted-foreground">Carregando...</p> : <div className="manual-conteudo overflow-x-auto" dangerouslySetInnerHTML={{ __html: html }} />}
      <Card className="mt-6">
        <div className="mb-3 flex items-center gap-2 text-gold"><Sparkles className="h-5 w-5" />
          <h2 className="font-display text-lg font-bold text-foreground">Isso é só a porta de entrada</h2></div>
        <p className="mb-4 text-sm text-muted-foreground">
          Dentro da Academia da Enfermagem você encontra conteúdos atualizados todo mês e ferramentas que salvam o seu plantão:
        </p>
        <div className="grid gap-3 md:grid-cols-3">
          {pontes.map((p) => (
            <div key={p.t} className="rounded-xl border border-border p-4">
              <p.icon className="mb-2 h-5 w-5 text-gold" />
              <p className="font-bold">{p.t}</p><p className="text-sm text-muted-foreground">{p.d}</p>
            </div>
          ))}
        </div>
        <Link to="/" className="mt-5 block rounded-xl bg-primary px-4 py-3 text-center font-bold text-primary-foreground">
          Conhecer os Módulos de Decisão Clínica
        </Link>
      </Card>
    </ContentProtection>
  );
}
