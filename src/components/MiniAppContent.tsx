import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { Video, Headphones } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/AppShell";
import { useAuthReady } from "@/lib/access";
import { renderContent } from "@/lib/markdown";
import {
  matchDiagnosticos,
  renderDiagnosticoCard,
  renderPrescricaoRow,
  buildEvolucao,
  type SaeDiagnostico,
} from "@/lib/sae-engine";


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
          <MiniAppHtmlContent html={content_md} />
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
export function MiniAppHtmlContent({ html }: { html: string }) {
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
    // Motor autoral que consulta o BANCO DE DADOS MESTRE (planilha AE/DE)
    // e gera diagnósticos + prescrição + evolução consolidada.
    const isSaeApp = !!root.querySelector(".lavoble-sae-descomplicada");
    let cleanupSaeListeners: (() => void) | null = null;
    if (isSaeApp) {
      // Evita crash do script legado que procura #medicamentos
      if (!root.querySelector("#medicamentos")) {
        const m = document.createElement("input");
        m.type = "hidden";
        m.id = "medicamentos";
        m.value = "Nenhum de uso contínuo.";
        root.appendChild(m);
      }

      // Esconde os 4 cards fixos legados — vamos preencher a grade dinamicamente
      ["card_diag_neu", "card_diag_resp", "card_diag_renal", "card_diag_pele"].forEach((id) => {
        const el = root.querySelector<HTMLElement>(`#${id}`);
        if (el) el.style.display = "none";
      });

      // Container dinâmico dentro da grade
      const grade = root.querySelector<HTMLElement>("#grade-diagnosticos-prioridade");
      let dyn = root.querySelector<HTMLElement>("#sae-diag-dinamicos");
      if (grade && !dyn) {
        dyn = document.createElement("div");
        dyn.id = "sae-diag-dinamicos";
        dyn.style.cssText = "display:flex;flex-direction:column;gap:12px;width:100%;";
        grade.appendChild(dyn);
      }

      let diagnosticosAtivos: SaeDiagnostico[] = [];

      const coletarCorpus = (): string => {
        const livre =
          root.querySelector<HTMLTextAreaElement>("#txt-sinais-sintomas-consolidados")?.value ?? "";
        const queixa =
          root.querySelector<HTMLTextAreaElement>("#queixaPrincipal")?.value ?? "";
        const hda = root.querySelector<HTMLTextAreaElement>("#hda")?.value ?? "";
        const diagMed = root.querySelector<HTMLInputElement>("#diagMedico")?.value ?? "";
        const marcados = Array.from(
          root.querySelectorAll<HTMLInputElement>('input[type="checkbox"]:checked'),
        )
          .map((i) =>
            (i.value || "") +
            " " +
            (i.closest("label")?.textContent?.replace(/\s+/g, " ").trim() ?? ""),
          )
          .join(" ");
        return [livre, queixa, hda, diagMed, marcados].join(" \n ");
      };

      const gerarDiagnosticos = () => {
        if (!dyn) return;
        const corpus = coletarCorpus();
        const matches = matchDiagnosticos(corpus, 12);
        diagnosticosAtivos = matches.map((m) => m.diag);

        const painelVazio = root.querySelector<HTMLElement>("#painel-vazio-diagnosticos");
        if (painelVazio) painelVazio.style.display = matches.length ? "none" : "block";
        if (grade) grade.style.display = "flex";

        if (matches.length === 0) {
          dyn.innerHTML =
            '<div style="padding:14px;background:#fef2f2;border:1px solid #fecaca;border-radius:8px;color:#991b1b;font-size:13px;">Nenhum diagnóstico compatível encontrado. Descreva sinais/sintomas com mais detalhes (ex.: "dor no peito", "edema em MMII", "febre e tosse").</div>';
        } else {
          dyn.innerHTML = matches.map((m, i) => renderDiagnosticoCard(m, i)).join("");
        }

        const counter = root.querySelector<HTMLElement>("#diagnosisCounter");
        if (counter)
          counter.textContent = `${matches.length} ${matches.length === 1 ? "diagnóstico" : "diagnósticos"}`;

        const step3Div = root.querySelector<HTMLElement>("#step3 div:first-child");
        if (step3Div && matches.length > 0) {
          step3Div.style.background = "#166534";
          step3Div.style.color = "#ffffff";
        }
      };

      const gerarPrescricao = () => {
        const tbody = root.querySelector<HTMLElement>("#corpo-tabela-prescricao");
        const wrapper = root.querySelector<HTMLElement>("#wrapper-tabela-prescricao");
        const vazio = root.querySelector<HTMLElement>("#painel-vazio-prescricao");
        if (!tbody) return;

        // Junta os diagnósticos selecionados (checkbox) com sua prioridade
        const selecionados: { d: SaeDiagnostico; prio: number }[] = [];
        diagnosticosAtivos.forEach((d, idx) => {
          const chk = root.querySelector<HTMLInputElement>(
            `.sae-diag-select[data-diag-id="${d.id}"]`,
          );
          if (chk?.checked) {
            const p = root.querySelector<HTMLInputElement>(
              `.sae-diag-prio[data-diag-id="${d.id}"]`,
            );
            const prio = parseInt(p?.value || "", 10);
            selecionados.push({ d, prio: Number.isFinite(prio) ? prio : idx + 100 });
          }
        });

        if (selecionados.length === 0) {
          alert(
            "Selecione ao menos um diagnóstico (marque a caixinha 'Selecionar') e informe a prioridade antes de gerar a prescrição.",
          );
          return;
        }

        selecionados.sort((a, b) => a.prio - b.prio);
        // Remove linhas legadas fixas
        tbody.innerHTML = selecionados
          .map((s, i) => renderPrescricaoRow(s.d, i + 1))
          .join("");

        if (wrapper) wrapper.style.display = "block";
        if (vazio) vazio.style.display = "none";

        const step4Div = root.querySelector<HTMLElement>("#step4 div:first-child");
        if (step4Div) {
          step4Div.style.background = "#166534";
          step4Div.style.color = "#ffffff";
        }
      };

      const gerarEvolucao = () => {
        const evol = root.querySelector<HTMLTextAreaElement>("#txt-evolucao-clinica-mestre");
        if (!evol) return;
        const get = (id: string) =>
          (root.querySelector<HTMLInputElement | HTMLTextAreaElement>(`#${id}`)?.value ?? "").trim();

        const identificacao = {
          Nome: get("nomePaciente"),
          Idade: get("idadePaciente"),
          Leito: get("leitoPaciente"),
          "Diagnóstico Médico": get("diagMedico"),
          Alergias: get("alergias"),
          "Queixa Principal": get("queixaPrincipal"),
          HDA: get("hda"),
        };

        const antecedentes = Array.from(
          root.querySelectorAll<HTMLInputElement>(".antecedente-chk:checked"),
        ).map((i) => i.value || i.closest("label")?.textContent?.trim() || "");

        const exameCheck = Array.from(
          root.querySelectorAll<HTMLInputElement>('input[type="checkbox"]:checked'),
        )
          .filter((i) => !i.classList.contains("antecedente-chk") && !i.classList.contains("sae-diag-select"))
          .map((i) => i.closest("label")?.textContent?.replace(/\s+/g, " ").trim() || i.value)
          .filter(Boolean);

        const selecionados: SaeDiagnostico[] = diagnosticosAtivos.filter(
          (d) =>
            !!root.querySelector<HTMLInputElement>(
              `.sae-diag-select[data-diag-id="${d.id}"]:checked`,
            ),
        );

        evol.value = buildEvolucao({
          identificacao,
          anamneseCheckLabels: antecedentes,
          exameFisicoCheckLabels: exameCheck,
          sintomasLivres: get("txt-sinais-sintomas-consolidados"),
          diagnosticosSelecionados: selecionados,
        });

        const sucesso = root.querySelector<HTMLElement>("#painel-sucesso-evolucao");
        if (sucesso) sucesso.style.display = "block";
      };

      // Botões
      const btnDiag = root.querySelector<HTMLButtonElement>("#btn-gerar-diagnosticos");
      const btnPresc = root.querySelector<HTMLButtonElement>("#btn-disparar-prescricao");
      const btnEvol = root.querySelector<HTMLButtonElement>("#btn-disparar-evolucao-final");

      const onDiag = (e: Event) => {
        e.preventDefault();
        gerarDiagnosticos();
      };
      const onPresc = (e: Event) => {
        e.preventDefault();
        gerarPrescricao();
      };
      const onEvol = (e: Event) => {
        e.preventDefault();
        gerarEvolucao();
      };

      btnDiag?.addEventListener("click", onDiag);
      btnPresc?.addEventListener("click", onPresc);
      btnEvol?.addEventListener("click", onEvol);

      cleanupSaeListeners = () => {
        btnDiag?.removeEventListener("click", onDiag);
        btnPresc?.removeEventListener("click", onPresc);
        btnEvol?.removeEventListener("click", onEvol);
      };
    }

    return () => {
      root.removeEventListener("click", onClick);
      cleanupSaeListeners?.();
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
