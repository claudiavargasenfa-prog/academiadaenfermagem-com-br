import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { Video, Headphones } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/AppShell";
import { useAuthReady } from "@/lib/access";
import { renderContent } from "@/lib/markdown";


/**
 * Renderiza o conteúdo editável do mini app (vindo do Admin):
 * - content_md (texto/markdown)
 * - video_url (YouTube / Vimeo / mp4)
 * - audio_url
 *
 * Não exibe nada se todos os campos estiverem vazios.
 * Sempre aparece ACIMA do conteúdo fixo (hardcoded) da página.
 */
export function MiniAppContent({ slug }: { slug: string }) {
  const { isReady } = useAuthReady();
  const q = useQuery({
    queryKey: ["mini_app_content", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mini_apps")
        .select("content_md, video_url, audio_url")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: isReady,
    staleTime: 60_000,
  });

  if (!isReady || q.isLoading) {
    return (
      <Card className="mb-6 border-primary/30 bg-primary/5 text-sm text-muted-foreground">
        Carregando conteúdo do mini app…
      </Card>
    );
  }

  if (q.isError) {
    return (
      <Card className="mb-6 border-destructive/30 bg-destructive/5 text-sm text-destructive">
        Erro ao carregar conteúdo editável: {q.error.message}
      </Card>
    );
  }

  if (!q.data) return null;
  const { content_md, video_url, audio_url } = q.data;
  if (!content_md?.trim() && !video_url?.trim() && !audio_url?.trim()) return null;

  return (
    <div className="mb-6 space-y-4">
      {video_url?.trim() && <VideoEmbed url={video_url.trim()} />}

      {audio_url?.trim() && (
        <Card>
          <div className="mb-2 flex items-center gap-2 text-primary">
            <Headphones className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wide">Áudio</span>
          </div>
          <audio controls src={audio_url.trim()} className="w-full">
            Seu navegador não suporta o player de áudio.
          </audio>
        </Card>
      )}

      {content_md?.trim() && (
        <Card>
          <HtmlContent html={content_md} />
        </Card>
      )}
    </div>
  );
}

/**
 * Renderiza HTML/markdown do mini app e ativa comportamentos interativos
 * embutidos que o React não executa sozinho (ex.: botões "Salvar Prescrição"
 * e "Salvar Evolução" do mini app FUNDAMENTOS DOS DIAGNÓSTICOS — download
 * .doc 100% no navegador, sem backend, sem custo).
 */
function HtmlContent({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);
  // Mini app SAE traz <script> embutido; renderizamos o HTML bruto (sem
  // sanitização) pois o conteúdo é escrito pelo admin e precisamos preservar
  // os <script> — DOMPurify remove todos por padrão.
  const isSae = /lavoble-sae-descomplicada/.test(html);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const download = (conteudo: string, nome: string) => {
      try {
        const blob = new Blob([conteudo], { type: "application/msword;charset=utf-8" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = nome;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(link.href), 1000);
      } catch {
        alert("Não foi possível gerar o arquivo.");
      }
    };

    const checkedLabelTexts = () =>
      Array.from(root.querySelectorAll<HTMLInputElement>('input[type="checkbox"]:checked'))
        .map((input) => input.closest("label")?.innerText?.replace(/\s+/g, " ").trim() ?? "")
        .filter(Boolean);

    const onPrescricao = (e: Event) => {
      e.preventDefault();
      const itens = root.querySelectorAll<HTMLElement>(".output-item");
      let texto =
        "PLANO DE CUIDADOS E PRESCRIÇÃO DE ENFERMAGEM\n" +
        "Diretriz de Raciocínio Clínico — Resolução COFEN 736/2024\n" +
        "--------------------------------------------------------\n\n";
      let tem = false;
      itens.forEach((it) => {
        if (window.getComputedStyle(it).display !== "none") {
          texto += (it.innerText || "") + "\n";
          tem = true;
        }
      });
      if (!tem) {
        const marcados = checkedLabelTexts();
        marcados.forEach((item) => {
          texto += `• ${item}\n`;
          tem = true;
        });
      }
      if (!tem) {
        alert("Selecione ao menos um diagnóstico, cuidado ou prescrição antes de exportar.");
        return;
      }
      download(texto, "Prescricao_de_Enfermagem.doc");
    };

    const onEvolucao = (e: Event) => {
      e.preventDefault();
      const campo = root.querySelector<HTMLTextAreaElement | HTMLInputElement>(
        "#txt-evolucao-lavoble",
      );
      const val = (campo?.value ?? "").trim();
      if (!val) {
        alert("Digite a evolução clínica do paciente antes de exportar.");
        return;
      }
      const texto =
        "EVOLUÇÃO DIÁRIA DE ENFERMAGEM\n" +
        "Data: " +
        new Date().toLocaleDateString("pt-BR") +
        "\n--------------------------------------------------------\n\n" +
        val +
        "\n";
      download(texto, "Evolucao_de_Enfermagem.doc");
    };

    const onClick = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (target?.closest("#btn-salvar-prescricao")) onPrescricao(e);
      if (target?.closest("#btn-salvar-evolucao")) onEvolucao(e);
    };

    root.addEventListener("click", onClick);

    // ===== SAE DESCOMPLICADA E AUTOMATIZADA =====
    // O HTML deste mini app traz um <script> embutido (o "cérebro" que amarra
    // Anamnese + Exame Físico + Diagnósticos à Evolução). O React não executa
    // scripts injetados via innerHTML, então recriamos cada <script> como um
    // elemento real para o navegador executá-lo. Etapa 1: também escutamos o
    // texto livre para que edições manuais do usuário entrem na Evolução.
    const isSaeApp = !!root.querySelector(".lavoble-sae-descomplicada");
    let livreListener: (() => void) | null = null;
    if (isSaeApp) {
      if (!root.querySelector("#medicamentos")) {
        const medicamentosFallback = document.createElement("input");
        medicamentosFallback.type = "hidden";
        medicamentosFallback.id = "medicamentos";
        medicamentosFallback.value = "Nenhum de uso contínuo.";
        root.appendChild(medicamentosFallback);
      }

      const normalizeClinicalText = (value: string) =>
        value
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");

      const syncFreeTextDiagnosisCards = () => {
        const livre = root.querySelector<HTMLTextAreaElement>(
          "#txt-sinais-sintomas-consolidados",
        );
        const grid = root.querySelector<HTMLElement>("#grade-diagnosticos-prioridade");
        if (!livre || !grid || window.getComputedStyle(grid).display === "none") return;

        const text = normalizeClinicalText(livre.value);
        const hasNeu = /\b(cabeca|cefaleia|tontura|confus|desorient|agit|letarg|sonol|convuls|rebaix)/.test(text);
        const hasResp = /\b(peito|torac|dispne|falta de ar|cansaco|satur|spo2|tosse|secrecao|respir|taquip|bradip|oxigen)/.test(text);
        const hasRenal = /\b(urina|diure|oligur|poliur|nictur|disur|ardor|edema|inchac|hidrat|desidrat)/.test(text);
        const hasPele = /\b(pele|ferida|lesao|curativo|pressao|lpp|imobil|acesso|flogist|vermelh|secrecao)/.test(text);

        const show = (id: string, visible: boolean) => {
          const card = root.querySelector<HTMLElement>(`#${id}`);
          if (card) card.style.display = visible ? "flex" : "none";
        };

        show("card_diag_neu", hasNeu || window.getComputedStyle(root.querySelector<HTMLElement>("#card_diag_neu") ?? document.body).display === "flex");
        show("card_diag_resp", hasResp || window.getComputedStyle(root.querySelector<HTMLElement>("#card_diag_resp") ?? document.body).display === "flex");
        show("card_diag_renal", hasRenal || window.getComputedStyle(root.querySelector<HTMLElement>("#card_diag_renal") ?? document.body).display === "flex");
        show("card_diag_pele", hasPele || window.getComputedStyle(root.querySelector<HTMLElement>("#card_diag_pele") ?? document.body).display === "flex");

        const visibleCount = Array.from(
          root.querySelectorAll<HTMLElement>("#grade-diagnosticos-prioridade > div"),
        ).filter((card) => window.getComputedStyle(card).display === "flex").length;
        const counter = root.querySelector<HTMLElement>("#diagnosisCounter");
        if (counter) {
          counter.textContent = `${visibleCount} ${visibleCount === 1 ? "diagnóstico" : "diagnósticos"}`;
        }

        const step3Div = root.querySelector<HTMLElement>("#step3 div:first-child");
        if (step3Div && visibleCount > 0) {
          step3Div.style.background = "#166534";
          step3Div.style.color = "#ffffff";
        }
      };

      root.querySelectorAll("script").forEach((oldScript) => {
        const s = document.createElement("script");
        for (const attr of Array.from(oldScript.attributes)) {
          s.setAttribute(attr.name, attr.value);
        }
        s.textContent = oldScript.textContent;
        oldScript.parentNode?.replaceChild(s, oldScript);
      });
      // O JS do mini app registra seus listeners dentro de
      // document.addEventListener("DOMContentLoaded", ...). Esse evento já
      // disparou antes do React injetar o HTML, então disparamos um sintético
      // para que o callback rode e anexe os listeners (botão Gerar
      // Diagnósticos, checkboxes do exame físico, prioridades, etc.).
      document.dispatchEvent(new Event("DOMContentLoaded"));

      const livre = root.querySelector<HTMLTextAreaElement>(
        "#txt-sinais-sintomas-consolidados",
      );
      const evol = root.querySelector<HTMLTextAreaElement>(
        "#txt-evolucao-clinica-mestre",
      );
      if (livre && evol) {
        const MARK = "📝 SINAIS/SINTOMAS INFORMADOS MANUALMENTE:";
        const onLivreInput = () => {
          const manual = livre.value.trim();
          const base = evol.value ?? "";
          const cut = base.indexOf(MARK);
          const head = (cut >= 0 ? base.slice(0, cut) : base).trimEnd();
          evol.value = manual ? `${head}\n\n${MARK}\n${manual}\n` : head;
          syncFreeTextDiagnosisCards();
        };
        const gerarBtn = root.querySelector<HTMLButtonElement>("#btn-gerar-diagnosticos");
        gerarBtn?.addEventListener("click", syncFreeTextDiagnosisCards);
        livre.addEventListener("input", onLivreInput);
        livreListener = () => {
          livre.removeEventListener("input", onLivreInput);
          gerarBtn?.removeEventListener("click", syncFreeTextDiagnosisCards);
        };
      }
    }

    return () => {
      root.removeEventListener("click", onClick);
      livreListener?.();
    };
  }, [html]);

  return (
    <div ref={ref} className="prose-sm max-w-none">
      {isSae ? (
        <div
          className="mini-app-html"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        renderContent(html)
      )}
    </div>
  );
}


function VideoEmbed({ url }: { url: string }) {
  const embed = toEmbedUrl(url);
  return (
    <Card>
      <div className="mb-2 flex items-center gap-2 text-primary">
        <Video className="h-4 w-4" />
        <span className="text-xs font-semibold uppercase tracking-wide">Vídeo</span>
      </div>
      {embed ? (
        <div className="aspect-video w-full overflow-hidden rounded-xl">
          <iframe
            src={embed}
            title="Vídeo do mini app"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
      ) : (
        <video controls src={url} className="w-full rounded-xl">
          Seu navegador não suporta o player de vídeo.
        </video>
      )}
    </Card>
  );
}

function toEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    // YouTube
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
      // /embed/, /shorts/
      const parts = u.pathname.split("/").filter(Boolean);
      if (parts[0] === "embed" && parts[1]) return `https://www.youtube.com/embed/${parts[1]}`;
      if (parts[0] === "shorts" && parts[1]) return `https://www.youtube.com/embed/${parts[1]}`;
    }
    if (u.hostname === "youtu.be") {
      const id = u.pathname.replace("/", "");
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    // Vimeo
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean).pop();
      if (id && /^\d+$/.test(id)) return `https://player.vimeo.com/video/${id}`;
    }
    return null;
  } catch {
    return null;
  }
}
