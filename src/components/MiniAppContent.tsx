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
      // Neutraliza referências inline legadas (oninput/onchange="atualizarEvolucaoAutomatica()")
      // que sobraram no HTML do banco e disparavam ReferenceError a cada clique/digitação.
      const w = window as unknown as Record<string, unknown>;
      const hadFn = "atualizarEvolucaoAutomatica" in w;
      const prevFn = w.atualizarEvolucaoAutomatica;
      w.atualizarEvolucaoAutomatica = () => {};

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

      // ===== EXPORTAÇÃO ABNT — PDF real, sem popup e sem depender do imprimir do navegador =====
      const limparTextoPdf = (valor: string) =>
        (valor || "")
          .replace(/[📄🖨️📋🧭⚕️📝🔍✅⚠️🧠🫁❤️🟡🔵⚪]/g, "")
          .replace(/✕\s*Excluir/g, "")
          .replace(/\s+/g, " ")
          .trim();

      const getTextoCelula = (cell: Element | undefined) => {
        if (!cell) return "";
        const clone = cell.cloneNode(true) as HTMLElement;
        clone.querySelectorAll("button, .sae-presc-num").forEach((el) => el.remove());
        return limparTextoPdf(clone.textContent ?? "");
      };

      const criarPdfBase = async (titulo: string) => {
        const { jsPDF } = await import("jspdf");
        const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
        const pageW = pdf.internal.pageSize.getWidth();
        const margin = { left: 30, top: 30, right: 20, bottom: 20 };
        const contentW = pageW - margin.left - margin.right;
        let y = margin.top;
        const addPageIfNeeded = (needed = 10) => {
          const pageH = pdf.internal.pageSize.getHeight();
          if (y + needed > pageH - margin.bottom) {
            pdf.addPage();
            y = margin.top;
          }
        };
        pdf.setFont("times", "bold");
        pdf.setFontSize(14);
        pdf.text(titulo.toUpperCase(), pageW / 2, y, { align: "center" });
        y += 14;
        pdf.setFont("times", "normal");
        pdf.setFontSize(11);
        pdf.text(`Data: ${new Date().toLocaleDateString("pt-BR")}`, margin.left, y);
        y += 10;
        return { pdf, margin, contentW, get y() { return y; }, set y(next: number) { y = next; }, addPageIfNeeded };
      };

      const finalizarPdfComAssinatura = (ctx: Awaited<ReturnType<typeof criarPdfBase>>) => {
        const { pdf, margin, contentW, addPageIfNeeded } = ctx;
        addPageIfNeeded(58);
        ctx.y += 18;
        const center = margin.left + contentW / 2;
        pdf.setDrawColor(0, 0, 0);
        pdf.line(center - 55, ctx.y, center + 55, ctx.y);
        ctx.y += 5;
        pdf.setFont("times", "normal");
        pdf.setFontSize(10);
        pdf.text("Assinatura do(a) Enfermeiro(a)", center, ctx.y, { align: "center" });
        ctx.y += 5;
        pdf.text("COREN: ______________________", center, ctx.y, { align: "center" });
        ctx.y += 10;
        pdf.setLineDashPattern([2, 2], 0);
        pdf.rect(center - 45, ctx.y, 90, 28);
        pdf.setLineDashPattern([], 0);
        pdf.text("Espaço reservado para carimbo", center, ctx.y + 15, { align: "center" });
      };

      const exportarEvolucaoAbnt = async () => {
        let evol = (
          root.querySelector<HTMLTextAreaElement>("#txt-evolucao-clinica-mestre")?.value ?? ""
        ).trim();
        // Auto-gera se ainda estiver vazio
        if (!evol) {
          gerarEvolucao();
          evol = (
            root.querySelector<HTMLTextAreaElement>("#txt-evolucao-clinica-mestre")?.value ?? ""
          ).trim();
        }
        if (!evol) {
          alert("Preencha ao menos a anamnese ou os sinais/sintomas antes de baixar a evolução.");
          return;
        }
        try {
          const ctx = await criarPdfBase("Evolução de Enfermagem");
          const { pdf, margin, contentW, addPageIfNeeded } = ctx;
          pdf.setFont("times", "normal");
          pdf.setFontSize(12);
          const blocos = evol.split(/\n+/).map((linha) => linha.trim()).filter(Boolean);
          for (const bloco of blocos) {
            const linhas = pdf.splitTextToSize(limparTextoPdf(bloco), contentW);
            addPageIfNeeded(linhas.length * 7 + 4);
            pdf.text(linhas, margin.left, ctx.y, { align: "justify", maxWidth: contentW });
            ctx.y += linhas.length * 7 + 3;
          }
          finalizarPdfComAssinatura(ctx);
          pdf.save("Evolucao_Enfermagem_ABNT.pdf");
        } catch {
          alert("Não foi possível baixar a evolução em PDF. Tente novamente.");
        }
      };

      const exportarPrescricaoAbnt = async () => {
        let wrapper = root.querySelector<HTMLElement>("#wrapper-tabela-prescricao");
        let tbody = root.querySelector<HTMLElement>("#corpo-tabela-prescricao");
        // Auto-gera se ainda não houver linhas mas existirem diagnósticos selecionados
        if ((!tbody || !tbody.children.length) && diagnosticosAtivos.length) {
          const algumSelecionado = diagnosticosAtivos.some(
            (d) =>
              !!root.querySelector<HTMLInputElement>(
                `.sae-diag-select[data-diag-id="${d.id}"]:checked`,
              ),
          );
          if (algumSelecionado) {
            gerarPrescricao();
            wrapper = root.querySelector<HTMLElement>("#wrapper-tabela-prescricao");
            tbody = root.querySelector<HTMLElement>("#corpo-tabela-prescricao");
          }
        }
        if (!wrapper || !tbody || !tbody.children.length) {
          alert(
            'Selecione ao menos um diagnóstico (com prioridade) e clique em "Gerar Prescrição" antes de baixar.',
          );
          return;
        }
        const paciente = (root.querySelector<HTMLInputElement>("#nomePaciente")?.value ?? "").trim();
        const idade = (root.querySelector<HTMLInputElement>("#idadePaciente")?.value ?? "").trim();
        const leito = (root.querySelector<HTMLInputElement>("#leitoPaciente")?.value ?? "").trim();
        try {
          const ctx = await criarPdfBase("Plano de Prescrição de Enfermagem");
          const { pdf, margin, contentW, addPageIfNeeded } = ctx;
          pdf.setFont("times", "normal");
          pdf.setFontSize(10);
          const meta = [
            paciente ? `Paciente: ${paciente}` : "Paciente: ______________________________",
            idade ? `Idade: ${idade}` : "Idade: ______",
            leito ? `Leito: ${leito}` : "Leito: ______",
          ];
          pdf.text(meta.join("    "), margin.left, ctx.y);
          ctx.y += 9;

          const rows = Array.from(tbody.querySelectorAll<HTMLTableRowElement>("tr.sae-presc-row"));
          const colW = [contentW * 0.48, contentW * 0.20, contentW * 0.32];
          const headerH = 10;
          const drawHeader = () => {
            pdf.setFillColor(22, 101, 52);
            pdf.setTextColor(255, 255, 255);
            pdf.setFont("times", "bold");
            pdf.setFontSize(8.5);
            let x = margin.left;
            ["PRESCRIÇÃO DE ENFERMAGEM", "APRAZAMENTO", "ANOTAÇÕES DE ENFERMAGEM"].forEach((h, i) => {
              pdf.rect(x, ctx.y, colW[i], headerH, "FD");
              pdf.text(h, x + colW[i] / 2, ctx.y + 6.5, { align: "center" });
              x += colW[i];
            });
            ctx.y += headerH;
            pdf.setTextColor(0, 0, 0);
          };
          drawHeader();

          rows.forEach((row) => {
            const cells = Array.from(row.cells);
            const prescricao = getTextoCelula(cells[0]);
            const aprazamento = getTextoCelula(cells[1]);
            pdf.setFont("times", "normal");
            pdf.setFontSize(9);
            const prescLines = pdf.splitTextToSize(prescricao, colW[0] - 6);
            const aprazLines = pdf.splitTextToSize(aprazamento, colW[1] - 6);
            const rowH = Math.max(44, prescLines.length * 5 + 10, aprazLines.length * 5 + 10);
            addPageIfNeeded(rowH + headerH);
            if (ctx.y + rowH > pdf.internal.pageSize.getHeight() - margin.bottom) {
              pdf.addPage();
              ctx.y = margin.top;
              drawHeader();
            }
            let x = margin.left;
            pdf.setDrawColor(22, 101, 52);
            pdf.rect(x, ctx.y, colW[0], rowH);
            pdf.text(prescLines, x + 3, ctx.y + 6, { maxWidth: colW[0] - 6 });
            x += colW[0];
            pdf.rect(x, ctx.y, colW[1], rowH);
            pdf.setFont("times", "bold");
            pdf.text(aprazLines, x + colW[1] / 2, ctx.y + 8, { align: "center", maxWidth: colW[1] - 6 });
            x += colW[1];
            pdf.rect(x, ctx.y, colW[2], rowH);
            pdf.setDrawColor(134, 239, 172);
            for (let lineY = ctx.y + 9; lineY < ctx.y + rowH - 4; lineY += 7) {
              pdf.line(x + 3, lineY, x + colW[2] - 3, lineY);
            }
            ctx.y += rowH;
          });
          finalizarPdfComAssinatura(ctx);
          pdf.save("Prescricao_Enfermagem_ABNT.pdf");
        } catch {
          alert("Não foi possível baixar a prescrição em PDF. Tente novamente.");
        }
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
            b.textContent = "📄 Baixar Evolução (ABNT)";
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
            b.textContent = "📄 Baixar Prescrição (ABNT)";
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
          void exportarEvolucaoAbnt();
        } else if (t.closest("#btn-export-prescricao-abnt")) {
          e.preventDefault();
          void exportarPrescricaoAbnt();
        }
      };
      root.addEventListener("click", onExportClick);

      cleanupSaeListeners = () => {
        btnDiag?.removeEventListener("click", onDiag);
        btnPresc?.removeEventListener("click", onPresc);
        btnEvol?.removeEventListener("click", onEvol);
        root.removeEventListener("click", onChip);
        root.removeEventListener("click", onExportClick);
        if (hadFn) {
          w.atualizarEvolucaoAutomatica = prevFn;
        } else {
          delete w.atualizarEvolucaoAutomatica;
        }
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
