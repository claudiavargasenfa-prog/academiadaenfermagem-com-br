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
      const delBtn = target?.closest<HTMLButtonElement>(".sae-presc-del");
      if (delBtn) {
        const row = delBtn.closest<HTMLTableRowElement>("tr.sae-presc-row");
        if (row) {
          const tbody = row.parentElement;
          row.remove();
          // Renumera as linhas restantes
          tbody?.querySelectorAll<HTMLElement>("tr.sae-presc-row .sae-presc-num").forEach((el, i) => {
            el.textContent = String(i + 1);
          });
        }
      }
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
        // Somente o texto livre digitado pelo usuário na caixa de sinais/sintomas.
        return (
          root.querySelector<HTMLTextAreaElement>("#txt-sinais-sintomas-consolidados")?.value ?? ""
        );
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

      // Chips de sinais/sintomas: adicionam ao textarea
      const onChip = (e: Event) => {
        const t = e.target as HTMLElement;
        const btn = t.closest<HTMLElement>(".sae-sinal-chip");
        if (!btn) return;
        e.preventDefault();
        const s = btn.dataset.sinal || btn.textContent?.trim() || "";
        if (!s) return;
        const ta = root.querySelector<HTMLTextAreaElement>(
          "#txt-sinais-sintomas-consolidados",
        );
        if (!ta) return;
        const cur = ta.value.trim();
        if (cur.toLowerCase().includes(s.toLowerCase())) return;
        ta.value = cur ? cur.replace(/[.;]\s*$/, "") + "; " + s + "." : s + ".";
        ta.dispatchEvent(new Event("input", { bubbles: true }));
        btn.style.background = "#bbf7d0";
      };
      root.addEventListener("click", onChip);

      // ===== EXPORTAÇÃO ABNT (PDF via impressão do navegador) =====
      const abrirParaImprimir = (titulo: string, corpoHtml: string) => {
        const w = window.open("", "_blank", "width=900,height=1000");
        if (!w) {
          alert("Habilite popups para exportar em PDF.");
          return;
        }
        const dataHoje = new Date().toLocaleDateString("pt-BR");
        w.document.write(`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>${titulo}</title>
<style>
  @page { size: A4; margin: 3cm 2cm 2cm 3cm; }
  html, body { background:#fff; color:#000; }
  body { font-family: "Times New Roman", Times, serif; font-size: 12pt; line-height: 1.5; margin:0; }
  h1 { font-size: 14pt; text-align:center; text-transform:uppercase; margin: 0 0 24pt; font-weight:bold; letter-spacing:.5px; }
  h2 { font-size: 12pt; text-transform:uppercase; margin: 18pt 0 6pt; font-weight:bold; }
  .abnt-meta { font-size: 11pt; margin-bottom: 18pt; }
  .abnt-body { text-align: justify; text-indent: 1.25cm; white-space: pre-wrap; }
  .assinatura { margin-top: 60pt; text-align:center; page-break-inside: avoid; }
  .assinatura .linha { border-top: 1px solid #000; width: 70%; margin: 40pt auto 4pt; }
  .assinatura small { font-size: 10pt; display:block; }
  .carimbo { margin: 30pt auto 0; border: 1px dashed #666; height: 90pt; width: 60%; display:flex; align-items:center; justify-content:center; font-size:10pt; color:#666; }
  table { width:100%; border-collapse: collapse; font-size: 11pt; }
  th, td { border: 1px solid #000; padding: 6pt; vertical-align: top; }
  th { background:#f3f3f3; text-transform:uppercase; font-size:10pt; }
  @media print { .no-print { display:none !important; } }
  .no-print { position: fixed; top:10px; right:10px; background:#166534; color:#fff; padding:8px 14px; border-radius:6px; cursor:pointer; border:0; font-family: system-ui; }
</style></head><body>
<button class="no-print" onclick="window.print()">Imprimir / Salvar PDF</button>
<h1>${titulo}</h1>
<div class="abnt-meta"><strong>Data:</strong> ${dataHoje}</div>
${corpoHtml}
<div class="assinatura">
  <div class="linha"></div>
  <small>Assinatura do(a) Enfermeiro(a)</small>
  <small>COREN: ______________________</small>
  <div class="carimbo">Espaço reservado para carimbo</div>
</div>
<script>window.addEventListener('load',()=>setTimeout(()=>window.print(),400));</script>
</body></html>`);
        w.document.close();
      };

      const exportarEvolucaoAbnt = () => {
        const evol = (
          root.querySelector<HTMLTextAreaElement>("#txt-evolucao-clinica-mestre")?.value ?? ""
        ).trim();
        if (!evol) {
          alert('Gere a evolução consolidada antes de exportar (botão "Gerar Evolução").');
          return;
        }
        const esc = evol.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        abrirParaImprimir("Evolução de Enfermagem", `<div class="abnt-body">${esc}</div>`);
      };

      const exportarPrescricaoAbnt = () => {
        const wrapper = root.querySelector<HTMLElement>("#wrapper-tabela-prescricao");
        const tbody = root.querySelector<HTMLElement>("#corpo-tabela-prescricao");
        if (!wrapper || !tbody || !tbody.children.length) {
          alert('Gere a prescrição antes de exportar (botão "Gerar Prescrição").');
          return;
        }
        const paciente = (root.querySelector<HTMLInputElement>("#nomePaciente")?.value ?? "").trim();
        const leito = (root.querySelector<HTMLInputElement>("#leitoPaciente")?.value ?? "").trim();
        const tabela = wrapper.querySelector("table")?.outerHTML ?? "";
        const cab = `<div class="abnt-meta">${paciente ? `<div><strong>Paciente:</strong> ${paciente}</div>` : ""}${leito ? `<div><strong>Leito:</strong> ${leito}</div>` : ""}</div><h2>Plano de Prescrição de Enfermagem</h2>`;
        abrirParaImprimir("Plano de Prescrição de Enfermagem", cab + tabela);
      };

      const injetarBotoes = () => {
        if (!root.querySelector("#btn-export-evolucao-abnt")) {
          const alvo =
            root.querySelector<HTMLElement>("#btn-disparar-evolucao-final")?.parentElement ||
            root.querySelector<HTMLElement>("#txt-evolucao-clinica-mestre")?.parentElement;
          if (alvo) {
            const b = document.createElement("button");
            b.id = "btn-export-evolucao-abnt";
            b.type = "button";
            b.textContent = "📄 Exportar Evolução (PDF ABNT)";
            b.style.cssText =
              "margin:10px 6px;padding:10px 16px;background:#166534;color:#fff;border:0;border-radius:8px;font-weight:600;cursor:pointer;";
            alvo.appendChild(b);
          }
        }
        if (!root.querySelector("#btn-export-prescricao-abnt")) {
          const wrap = root.querySelector<HTMLElement>("#wrapper-tabela-prescricao");
          const alvo =
            root.querySelector<HTMLElement>("#btn-disparar-prescricao")?.parentElement ||
            wrap?.parentElement;
          if (alvo) {
            const b = document.createElement("button");
            b.id = "btn-export-prescricao-abnt";
            b.type = "button";
            b.textContent = "📄 Exportar Prescrição (PDF ABNT)";
            b.style.cssText =
              "margin:10px 6px;padding:10px 16px;background:#b8860b;color:#fff;border:0;border-radius:8px;font-weight:600;cursor:pointer;";
            alvo.appendChild(b);
          }
        }
      };
      injetarBotoes();

      const onExportClick = (e: Event) => {
        const t = e.target as HTMLElement;
        if (t.closest("#btn-export-evolucao-abnt")) {
          e.preventDefault();
          exportarEvolucaoAbnt();
        } else if (t.closest("#btn-export-prescricao-abnt")) {
          e.preventDefault();
          exportarPrescricaoAbnt();
        }
      };
      root.addEventListener("click", onExportClick);

      cleanupSaeListeners = () => {
        btnDiag?.removeEventListener("click", onDiag);
        btnPresc?.removeEventListener("click", onPresc);
        btnEvol?.removeEventListener("click", onEvol);
        root.removeEventListener("click", onChip);
        root.removeEventListener("click", onExportClick);
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
