import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Instagram, Lock, Sparkles, FileText, Calculator, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ContentProtection } from "@/components/ContentProtection";
import { Card, PageHeader } from "@/components/AppShell";

const URL = "https://academiadaenfermagem.com.br/manual-estagio";
const TITLE = "Manual de Sobrevivência do Estágio - Grátis";
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
    // Remove o banner antigo do HTML do Supabase, sem tocar no restante do manual.
    const texto = (node: Element) => (node.textContent || "").toLocaleLowerCase("pt-BR").replace(/\\s+/g, " ").trim();
    const assuntosAntigos = [
      "postura e conduta",
      "técnicas essenciais",
      "relacionamento com equipe",
      "segurança do paciente",
      "primeiro plantão",
    ];
    const candidatosAntigos = Array.from(el.querySelectorAll("div, section, article, header"))
      .filter((node) => {
        if (node === el || node.classList.contains("manual-conteudo")) return false;
        const t = texto(node);
        const quantidadeAssuntos = assuntosAntigos.filter((assunto) => t.includes(assunto)).length;
        return /manual de sobrevivência (no|do) estágio/.test(t) &&
          quantidadeAssuntos >= 3 &&
          t.length < 1800;
      })
      .sort((a, b) => texto(a).length - texto(b).length);
    const bannerAntigo = candidatosAntigos[0];
    if (bannerAntigo) bannerAntigo.remove();

    // Corrige apenas a caixa amarela da dica, sem substituir o restante do manual.
    const dicaAntiga = Array.from(el.querySelectorAll("p, div, aside, blockquote"))
      .filter((node) => /dica de enfermeiro veterano/i.test(texto(node)) && /chegue 30 minutos antes/i.test(texto(node)))
      .sort((a, b) => (a.textContent || "").length - (b.textContent || "").length)[0];
    if (dicaAntiga) {
      dicaAntiga.innerHTML = '<strong>💡 Dica de Enfermeiro Veterano:</strong> Chegue sempre 15 minutos antes para que tenha tempo de descansar e refletir. Isso também demonstra interesse e compromisso.';
      const bannerAnterior = el.querySelector("#atividades-estagio-sanfona");
      if (bannerAnterior) bannerAnterior.remove();

      const banner = document.createElement("section");
      banner.id = "atividades-estagio-sanfona";
      banner.setAttribute("aria-labelledby", "atividades-estagio-titulo");
      banner.style.cssText = "margin:24px 0;padding:clamp(16px,3vw,28px);border:1px solid #eadff4;border-radius:22px;background:linear-gradient(135deg,#fff8fb 0%,#f5faff 52%,#f8fff8 100%);box-shadow:0 10px 28px rgba(173,156,194,.12);";
      banner.innerHTML = `
        <div style="text-align:center;margin-bottom:20px">
          <span style="display:inline-block;padding:6px 12px;border-radius:999px;background:#fce7f3;color:#9d4775;font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase">Guia de prática</span>
          <h2 id="atividades-estagio-titulo" style="margin:10px 0 6px;color:#5b5277;font-size:clamp(21px,4vw,28px);font-weight:800;line-height:1.2">Atividades por campo de estágio</h2>
          <p style="margin:0 auto;max-width:620px;color:#716b7c;font-size:14px;line-height:1.65">Explore as áreas e veja exemplos de experiências que podem fazer parte da aprendizagem prática. Todas as atividades devem respeitar o nível de formação, os protocolos do serviço e a supervisão responsável.</p>
        </div>
        <div style="display:grid;gap:10px">
          <details style="border:1px solid #f1cfe1;border-radius:14px;background:#fffafd;overflow:hidden">
            <summary style="cursor:pointer;padding:15px 17px;background:#fdebf4;color:#8e4d72;font-weight:800">🌷 Saúde pública e atendimento ambulatorial</summary>
            <div style="padding:16px 18px;color:#554e5e;font-size:14px;line-height:1.75">
              <ol style="padding-left:20px;margin:0">
                <li>Conhecer os diferentes setores, observando a rotina e a organização do atendimento.</li>
                <li>Identificar os integrantes da equipe e compreender as responsabilidades de cada função.</li>
                <li>Participar do acolhimento e da orientação inicial dos usuários.</li>
                <li>Verificar e registrar sinais vitais.</li>
                <li>Auxiliar na realização de curativos conforme orientação e supervisão.</li>
                <li>Acompanhar o preparo e a administração de medicamentos e soluções prescritas.</li>
                <li>Conhecer a organização da sala de vacinação, os registros vacinais e o processo de administração de imunizantes.</li>
                <li>Observar ou auxiliar, conforme autorização, na punção venosa e na coleta de amostras para exames.</li>
                <li>Acompanhar a coleta de material para exame citopatológico do colo do útero.</li>
                <li>Orientar, junto à equipe, sobre amamentação e cuidados básicos com o bebê.</li>
                <li>Colaborar no planejamento e na execução de atividades educativas em saúde.</li>
                <li>Preparar materiais para nebulização ou inalação, conforme prescrição e protocolo.</li>
                <li>Realizar a verificação da glicemia capilar quando autorizado e supervisionado.</li>
                <li>Efetuar registros de enfermagem claros, completos e oportunos.</li>
              </ol>
            </div>
          </details>
          <details style="border:1px solid #cfe3f7;border-radius:14px;background:#fbfdff;overflow:hidden">
            <summary style="cursor:pointer;padding:15px 17px;background:#eaf4ff;color:#426d9a;font-weight:800">🩵 Clínica médica e cirúrgica</summary>
            <div style="padding:16px 18px;color:#4f5967;font-size:14px;line-height:1.75">
              <ol style="padding-left:20px;margin:0">
                <li>Observar os fluxos de trabalho e as atribuições dos profissionais da equipe.</li>
                <li>Acompanhar a admissão, a identificação e o acolhimento do paciente.</li>
                <li>Mensurar e registrar os sinais vitais.</li>
                <li>Preparar o leito para receber o paciente e conhecer a organização do leito no pós-operatório.</li>
                <li>Prestar cuidados de higiene e conforto, incluindo higiene oral, banho no chuveiro ou no leito e hidratação da pele.</li>
                <li>Acompanhar procedimentos de sondagem urinária de alívio ou de demora, respeitando as atribuições e a supervisão exigidas.</li>
                <li>Observar a preparação e a instalação de sondas nasogástricas ou nasoentéricas por profissional habilitado.</li>
                <li>Auxiliar na oferta segura da alimentação conforme a condição clínica e a orientação da equipe.</li>
                <li>Registrar entradas e saídas de líquidos para acompanhamento do balanço hídrico.</li>
                <li>Realizar ou auxiliar em curativos de acordo com a orientação recebida.</li>
                <li>Verificar glicemia capilar quando indicado.</li>
                <li>Participar do preparo e da administração segura de medicamentos prescritos.</li>
                <li>Conhecer os materiais utilizados para acesso venoso periférico e acompanhar sua utilização.</li>
                <li>Acompanhar o preparo de soluções intravenosas e a conferência da velocidade de infusão.</li>
                <li>Participar dos cuidados e da conferência pré-operatória.</li>
                <li>Acompanhar o transporte e o encaminhamento do paciente para exames.</li>
                <li>Observar a avaliação após a cirurgia e contribuir para os registros pertinentes.</li>
                <li>Manter os registros de enfermagem completos e objetivos.</li>
                <li>Acompanhar a passagem de plantão, com comunicação organizada das informações essenciais.</li>
              </ol>
            </div>
          </details>
          <details style="border:1px solid #d4ead8;border-radius:14px;background:#fbfffb;overflow:hidden">
            <summary style="cursor:pointer;padding:15px 17px;background:#eaf8ed;color:#477653;font-weight:800">🌿 Pediatria</summary>
            <div style="padding:16px 18px;color:#4f5f53;font-size:14px;line-height:1.75">
              <ol style="padding-left:20px;margin:0">
                <li>Conhecer a rotina pediátrica e as funções dos profissionais envolvidos no cuidado.</li>
                <li>Acompanhar a recepção e a admissão da criança, considerando as necessidades da família.</li>
                <li>Verificar e registrar peso e estatura conforme a faixa etária e o procedimento adotado.</li>
                <li>Aferir os sinais vitais com parâmetros adequados à idade.</li>
                <li>Acompanhar a administração de medicamentos prescritos, com conferência cuidadosa da dose.</li>
                <li>Observar o preparo e o controle da infusão de soluções intravenosas.</li>
                <li>Conhecer os materiais para acesso venoso periférico e acompanhar procedimentos realizados por profissional habilitado.</li>
                <li>Aprender os princípios de diluição e cálculo de doses pediátricas, sempre com dupla checagem e supervisão.</li>
                <li>Acompanhar terapias inalatórias e oferta de oxigênio quando indicadas.</li>
                <li>Participar dos cuidados de preparo da criança antes de uma cirurgia.</li>
                <li>Acompanhar o encaminhamento seguro ao setor cirúrgico.</li>
                <li>Observar os cuidados no período pós-operatório.</li>
                <li>Auxiliar nos cuidados de higiene, conforto e proteção da criança.</li>
                <li>Conhecer medidas de conforto e monitoramento em situações de febre, conforme orientação clínica.</li>
                <li>Realizar registros de enfermagem pertinentes ao cuidado prestado.</li>
                <li>Participar da passagem de plantão, comunicando informações relevantes de forma clara.</li>
              </ol>
            </div>
          </details>
          <details style="border:1px solid #d9d2f5;border-radius:14px;background:#fdfcff;overflow:hidden">
            <summary style="cursor:pointer;padding:15px 17px;background:#f0edff;color:#665a9b;font-weight:800">💜 Unidade de terapia intensiva</summary>
            <div style="padding:16px 18px;color:#57536c;font-size:14px;line-height:1.75">
              <ol style="padding-left:20px;margin:0">
                <li>Observar a dinâmica da unidade e a atuação dos profissionais na assistência ao paciente crítico.</li>
                <li>Acompanhar a admissão e a avaliação inicial do paciente.</li>
                <li>Verificar sinais vitais e reconhecer alterações que precisam ser comunicadas imediatamente.</li>
                <li>Conhecer os cuidados de higiene e conforto no leito.</li>
                <li>Observar a monitorização cardíaca e o reconhecimento de alarmes.</li>
                <li>Acompanhar a realização e a finalidade do eletrocardiograma.</li>
                <li>Monitorar a saturação periférica de oxigênio por oximetria, conforme orientação.</li>
                <li>Verificar glicemia capilar quando indicada.</li>
                <li>Conhecer os materiais para acesso venoso periférico e acompanhar os cuidados com o dispositivo.</li>
                <li>Aprender medidas de manutenção, observação e prevenção de complicações relacionadas ao acesso venoso.</li>
                <li>Acompanhar a coleta e o encaminhamento de amostras biológicas para análise laboratorial.</li>
                <li>Observar a preparação, a conferência e a administração de medicamentos sob supervisão.</li>
                <li>Reconhecer os materiais e medicamentos do carrinho de emergência e compreender sua organização.</li>
                <li>Observar os alarmes e os parâmetros do ventilador mecânico, comunicando alterações à equipe responsável.</li>
                <li>Controlar e registrar o balanço hídrico conforme orientação.</li>
                <li>Acompanhar a realização de curativos e a avaliação da pele.</li>
                <li>Prestar cuidados de higiene e conforto de acordo com a condição clínica.</li>
                <li>Acompanhar o transporte seguro para exames de imagem.</li>
                <li>Manter registros objetivos sobre observações e cuidados realizados.</li>
                <li>Participar da passagem de plantão com foco na continuidade e segurança da assistência.</li>
              </ol>
            </div>
          </details>
          <details style="border:1px solid #f2dfb9;border-radius:14px;background:#fffefa;overflow:hidden">
            <summary style="cursor:pointer;padding:15px 17px;background:#fff3d9;color:#8b6b32;font-weight:800">🌼 Sala de parto e maternidade</summary>
            <div style="padding:16px 18px;color:#665b49;font-size:14px;line-height:1.75">
              <ol style="padding-left:20px;margin:0">
                <li>Conhecer a rotina do setor e as responsabilidades dos profissionais que acompanham o parto e o puerpério.</li>
                <li>Acompanhar a admissão e o acolhimento da gestante no período que antecede o parto.</li>
                <li>Orientar, com apoio da equipe, sobre cuidados iniciais com o recém-nascido.</li>
                <li>Incentivar e esclarecer dúvidas sobre amamentação, conforme as necessidades da mãe e do bebê.</li>
                <li>Observar a instalação e o acompanhamento de soluções intravenosas prescritas.</li>
                <li>Oferecer acolhimento e apoio à mulher durante o trabalho de parto, respeitando suas escolhas e privacidade.</li>
                <li>Acompanhar a recepção e a avaliação inicial do recém-nascido pela equipe responsável.</li>
                <li>Conhecer os cuidados de higiene do bebê e a limpeza do coto umbilical.</li>
                <li>Aprender sobre a ordenha manual do leite materno e seu manejo seguro.</li>
                <li>Observar os lóquios e comunicar alterações à equipe responsável.</li>
                <li>Auxiliar nos cuidados de higiene e conforto da mulher no pós-parto.</li>
                <li>Reforçar orientações de alta, sinais de alerta e continuidade dos cuidados.</li>
                <li>Realizar os registros pertinentes à assistência prestada.</li>
                <li>Participar da passagem de plantão, preservando a continuidade do cuidado materno-infantil.</li>
              </ol>
            </div>
          </details>
          <details style="border:1px solid #f5d6c8;border-radius:14px;background:#fffaf8;overflow:hidden">
            <summary style="cursor:pointer;padding:15px 17px;background:#ffede5;color:#9a604a;font-weight:800">🍑 Central de material e esterilização</summary>
            <div style="padding:16px 18px;color:#6b554d;font-size:14px;line-height:1.75">
              <ol style="padding-left:20px;margin:0">
                <li>Conhecer as áreas de trabalho e o fluxo de materiais entre as etapas do processamento.</li>
                <li>Observar a limpeza, a inspeção e a secagem dos instrumentais, conforme protocolo.</li>
                <li>Acompanhar a montagem e a identificação de conjuntos de roupas e instrumentais.</li>
                <li>Conhecer o funcionamento da autoclave e os cuidados de segurança durante o processo.</li>
                <li>Observar os indicadores e testes utilizados para verificar a eficácia do processamento e da esterilização.</li>
              </ol>
            </div>
          </details>
          <details style="border:1px solid #d5e6f2;border-radius:14px;background:#fbfdff;overflow:hidden">
            <summary style="cursor:pointer;padding:15px 17px;background:#e8f4fa;color:#47758d;font-weight:800">🫧 Centro cirúrgico</summary>
            <div style="padding:16px 18px;color:#4e606a;font-size:14px;line-height:1.75">
              <ol style="padding-left:20px;margin:0">
                <li>Observar a organização do setor e as funções dos profissionais da equipe cirúrgica.</li>
                <li>Conhecer as etapas de paramentação e as medidas para manter a técnica asséptica.</li>
                <li>Acompanhar, como observador, a preparação para a anestesia e a indução anestésica.</li>
                <li>Auxiliar a equipe de circulação dentro das atribuições permitidas e sob orientação.</li>
                <li>Acompanhar o transporte e a transferência segura do paciente para a sala operatória.</li>
                <li>Conhecer os princípios de posicionamento cirúrgico e prevenção de lesões.</li>
                <li>Observar a assistência na recuperação pós-anestésica imediata.</li>
                <li>Registrar ou acompanhar os registros de enfermagem pertinentes às atividades realizadas.</li>
              </ol>
            </div>
          </details>
          <details style="border:1px solid #e6d9f1;border-radius:14px;background:#fefcff;overflow:hidden">
            <summary style="cursor:pointer;padding:15px 17px;background:#f4eafa;color:#805b97;font-weight:800">🪻 Cuidado à pessoa idosa</summary>
            <div style="padding:16px 18px;color:#61546a;font-size:14px;line-height:1.75">
              <ol style="padding-left:20px;margin:0">
                <li>Conhecer a organização do serviço e a rotina de cuidado à pessoa idosa.</li>
                <li>Acolher a pessoa idosa e acompanhar sua admissão, respeitando autonomia e preferências.</li>
                <li>Verificar sinais vitais e comunicar alterações observadas.</li>
                <li>Preparar o leito para conforto, segurança e prevenção de quedas.</li>
                <li>Auxiliar nos cuidados de higiene oral, banho, hidratação da pele e conforto.</li>
                <li>Acompanhar a alimentação e observar dificuldades para comer ou engolir.</li>
                <li>Participar dos cuidados com feridas e curativos, conforme orientação.</li>
                <li>Verificar glicemia capilar quando indicada.</li>
                <li>Acompanhar o preparo e a administração de medicamentos sob supervisão.</li>
                <li>Conhecer os cuidados com dispositivos de acesso venoso periférico.</li>
                <li>Observar as necessidades físicas, funcionais, emocionais e sociais da pessoa idosa.</li>
                <li>Participar do exame físico e comunicar achados relevantes ao supervisor.</li>
                <li>Colaborar em atividades de convivência, recreação e estímulo à socialização.</li>
                <li>Manter registros de enfermagem pertinentes ao cuidado prestado.</li>
              </ol>
            </div>
          </details>
          <details style="border:1px solid #cfe8e3;border-radius:14px;background:#fbfffe;overflow:hidden">
            <summary style="cursor:pointer;padding:15px 17px;background:#e5f7f2;color:#39796f;font-weight:800">🌱 Saúde mental e cuidado psicossocial</summary>
            <div style="padding:16px 18px;color:#4d625e;font-size:14px;line-height:1.75">
              <ol style="padding-left:20px;margin:0">
                <li>Conhecer a organização do serviço e a rotina de atendimento psicossocial.</li>
                <li>Identificar as funções dos profissionais e a contribuição de cada área para o cuidado integrado.</li>
                <li>Observar sinais de sofrimento psíquico e necessidades de acolhimento, sem julgamentos.</li>
                <li>Desenvolver comunicação respeitosa e vínculo terapêutico, respeitando limites profissionais.</li>
                <li>Interagir com a equipe de cuidado para compreender os objetivos do plano terapêutico.</li>
                <li>Quando previsto e autorizado, acompanhar visitas domiciliares com a equipe responsável.</li>
                <li>Colaborar em atividades de lazer e convivência adequadas às necessidades dos usuários.</li>
                <li>Participar de iniciativas que favoreçam a integração entre usuário, família e comunidade.</li>
                <li>Contribuir para ações de educação em saúde e promoção do bem-estar psicossocial.</li>
              </ol>
            </div>
          </details>
        </div>
        <p style="margin:18px 2px 0;color:#777184;font-size:12px;line-height:1.6">Importante: esta lista é orientativa. A realização de procedimentos depende da legislação profissional, do estágio de formação, da autorização do campo e da supervisão do enfermeiro responsável.</p>
      `;
      const caixaDica = dicaAntiga.closest('[style*="background"], [class*="yellow"], [class*="amber"]') || dicaAntiga;
      caixaDica.insertAdjacentElement("afterend", banner);
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
