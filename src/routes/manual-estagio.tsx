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
      <div className="relative mb-8 overflow-hidden rounded-[1.5rem] border-[3px] border-[#D7AF42] bg-[#004225] text-white shadow-[0_20px_45px_rgba(0,45,27,0.24)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(215,175,66,0.15),transparent_42%),radial-gradient(ellipse_at_bottom_left,rgba(215,175,66,0.08),transparent_38%)]" />
        <div className="relative mx-auto max-w-2xl px-5 py-7 text-center sm:px-10 sm:py-8">
          <span className="inline-flex -rotate-2 items-center rounded-full bg-[#D7AF42] px-5 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-[#073923] sm:text-xs">
            🎁 Presente 100% grátis
          </span>
          <p className="mt-4 text-[10px] font-extrabold uppercase tracking-[0.28em] text-[#F3D77B] sm:text-xs">O Mundo da Enfermagem</p>
          <h1 className="mx-auto mt-2 max-w-2xl font-display text-4xl font-black uppercase leading-[0.98] tracking-[-0.04em] sm:text-5xl">
            Não pise no<br className="hidden sm:block" /> estágio <span className="text-[#F2C94C]">sem isto.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-sm font-semibold leading-relaxed text-white/85 sm:text-base">
            O Manual de Sobrevivência no Estágio: tudo o que ninguém te conta antes do primeiro dia de campo.
          </p>
          <p className="mt-5 text-[10px] font-black uppercase tracking-[0.14em] text-[#F2C94C]">Dentro do manual</p>
          <ul className="mx-auto mt-2 grid max-w-md gap-1.5 text-left">
            {[
              "Postura que o preceptor quer ver",
              "Relacionamento com paciente e família",
              "Técnicas essenciais e cálculos",
              "Segurança do paciente sem errar",
              "Passagem de plantão ISBAR na prática",
              "Os erros que reprovam no campo",
            ].map((t) => (
              <li key={t} className="flex min-h-8 items-center gap-2 rounded-full bg-white/[0.09] px-3 py-1.5 text-[11px] font-bold sm:text-xs">
                <span className="font-black text-[#F2C94C]">✓</span><span>{t}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-[10px] font-black uppercase tracking-[0.12em] text-[#F2C94C] sm:text-xs">↓ Libere o seu agora, em 30 segundos ↓</p>
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
    // Substitui somente o banner antigo dentro do HTML vindo do Supabase.
    const tituloHero = Array.from(el.querySelectorAll("h1, h2, h3")).find((h) =>
      /manual de sobrevivência no estágio/i.test(h.textContent || "")
    );
    if (tituloHero) {
      let candidato: HTMLElement = tituloHero as HTMLElement;
      const temasHero = ["Postura e Conduta", "Técnicas Essenciais", "Relacionamento com Equipe", "Segurança do Paciente", "Primeiro Plantão"];
      const contaTemas = (node: HTMLElement) => temasHero.filter((tema) => (node.textContent || "").includes(tema)).length;
      while (candidato.parentElement && candidato.parentElement !== el && contaTemas(candidato) < 3) {
        candidato = candidato.parentElement;
      }
      if (contaTemas(candidato) >= 3) candidato.style.display = "none";
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
      <section className="relative mb-6 overflow-hidden rounded-[1.5rem] border-[3px] border-[#D7AF42] bg-[#004225] text-white shadow-[0_20px_45px_rgba(0,45,27,0.22)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(215,175,66,0.15),transparent_42%),radial-gradient(ellipse_at_bottom_left,rgba(215,175,66,0.08),transparent_38%)]" />
        <div className="relative mx-auto max-w-2xl px-5 py-7 text-center sm:px-10 sm:py-8">
          <span className="inline-flex -rotate-2 items-center rounded-full bg-[#D7AF42] px-5 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-[#073923] sm:text-xs">🎁 Presente 100% grátis</span>
          <p className="mt-4 text-[10px] font-extrabold uppercase tracking-[0.28em] text-[#F3D77B] sm:text-xs">O Mundo da Enfermagem</p>
          <h2 className="mx-auto mt-2 max-w-2xl font-display text-4xl font-black uppercase leading-[0.98] tracking-[-0.04em] sm:text-5xl">Não pise no<br className="hidden sm:block" /> estágio <span className="text-[#F2C94C]">sem isto.</span></h2>
          <p className="mx-auto mt-4 max-w-lg text-sm font-semibold leading-relaxed text-white/85 sm:text-base">O Manual de Sobrevivência no Estágio: tudo o que ninguém te conta antes do primeiro dia de campo.</p>
          <p className="mt-5 text-[10px] font-black uppercase tracking-[0.14em] text-[#F2C94C]">Dentro do manual</p>
          <ul className="mx-auto mt-2 grid max-w-md gap-1.5 text-left">
            {[
              { t: "Postura que o preceptor quer ver", href: "#topico-postura" },
              { t: "Relacionamento com paciente e família", href: "#topico-relacionamento" },
              { t: "Técnicas essenciais e cálculos", href: "#topico-tecnicas" },
              { t: "Segurança do paciente sem errar", href: "#topico-seguranca" },
              { t: "Passagem de plantão ISBAR na prática", href: "#topico-isbar" },
              { t: "Os erros que reprovam no campo", href: "#topico-erros" },
            ].map((item) => (
              <li key={item.href}><a href={item.href} className="flex min-h-8 items-center gap-2 rounded-full bg-white/[0.09] px-3 py-1.5 text-left text-[11px] font-bold text-white transition-colors hover:bg-white/[0.15] sm:text-xs"><span className="font-black text-[#F2C94C]">✓</span><span>{item.t}</span></a></li>
            ))}
          </ul>
          <p className="mt-5 text-[10px] font-black uppercase tracking-[0.12em] text-[#F2C94C] sm:text-xs">↓ Conteúdo gratuito — escolha um assunto acima ↓</p>
        </div>
      </section>
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
