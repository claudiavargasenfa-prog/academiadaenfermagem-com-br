// Motor do SAE AUTOMÁTICA — usa o BANCO DE DADOS MESTRE (planilha oficial).
// Casa o texto de "Sinais e Sintomas" com os diagnósticos ADEC via
// TAB. 4 (Evidências Clínicas) + TAB. 13 (Palavras-chave).

import banco from "@/data/sae-banco.json";

export type SaeConduta = {
  conduta: string;
  horario: string;
  aprazamento: string;
  objetivo?: string;
  prioridade?: string;
  palavras?: string;
  obs?: string;
};
export type SaeDiagnostico = {
  id: string;
  matriz?: string;
  eixo?: string;
  sinais: string;                 // TAB. 4 — Evidências Clínicas
  criteriosEssenciais?: string;   // TAB. 5
  criteriosAssociados?: string;   // TAB. 6
  diagnostico: string;            // TAB. 7 — Hipótese Diagnóstica
  condutas: SaeConduta[];
  meta: string;
  raciocinio: string;
};

export const SAE_BANCO: SaeDiagnostico[] = banco as SaeDiagnostico[];

const STOP = new Set([
  "com","sem","por","para","dos","das","que","uma","umas","uns","não","nao",
  "como","aos","seu","sua","seus","suas","essa","esse","este","esta","risco",
  "aguda","paciente","nivel","grau","tipo","fisica","fisico","corporal",
  "corporais","associada","associado","possivel","alteracao","alteracoes",
  "ineficaz","prejudicada","prejudicado","presenca","perda","grande","pequeno",
  "padrao","instabilidade","alterada","alteradas","sinais","sintomas",
  "dificuldade","excesso","deficit","alto","baixa","baixo","fatores","funcional",
  "cronico","cronica","atrasada","severo","severa","intensa","intenso",
  "completa","clinica","clinico","assistencial","assistenciais","evidencias",
  "durante","quando","onde","ainda","muito","pouco","tambem",
]);

function norm(s: string): string {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function tokens(s: string, minLen = 5): string[] {
  return norm(s)
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length >= minLen && !STOP.has(t));
}

// Índice pré-calculado: keywords vindas SOMENTE de TAB. 4 (sinais) + TAB. 13 (palavras).
const INDEX = SAE_BANCO.map((d) => {
  const kw = new Set<string>();
  tokens(d.sinais).forEach((t) => kw.add(t));
  d.condutas.forEach((c) => tokens(c.palavras || "").forEach((t) => kw.add(t)));
  const phrases = norm(d.sinais)
    .split(/[;.,]/)
    .map((p) => p.trim())
    .filter((p) => p.length >= 6);
  return { d, keywords: Array.from(kw), phrases };
});

export type SaeMatch = { diag: SaeDiagnostico; score: number; hits: string[] };

export function matchDiagnosticos(corpusRaw: string, maxResults = 15): SaeMatch[] {
  const corpus = norm(corpusRaw);
  if (!corpus.trim()) return [];
  const results: SaeMatch[] = [];
  for (const { d, keywords, phrases } of INDEX) {
    const hits: string[] = [];
    let score = 0;
    for (const p of phrases) {
      if (p.length >= 8 && corpus.includes(p)) {
        score += 3;
        hits.push(p);
      }
    }
    for (const k of keywords) {
      const re = new RegExp(`(^|[^a-z0-9])${k}([^a-z0-9]|$)`);
      if (re.test(corpus)) {
        score += 1;
        hits.push(k);
      }
    }
    if (score > 0) results.push({ diag: d, score, hits });
  }
  results.sort((a, b) => b.score - a.score);
  return results.slice(0, maxResults);
}

// ---------- HTML helpers ----------

function esc(s: string): string {
  return (s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function renderDiagnosticoCard(m: SaeMatch, idx: number): string {
  const d = m.diag;
  const condutasHtml = d.condutas
    .map((c) => {
      const hor = c.horario ? ` <span style="color:#854d0e;font-weight:600;">[${esc(c.horario)}]</span>` : "";
      const apr = c.aprazamento ? ` <span style="color:#166534;font-weight:600;">(${esc(c.aprazamento)})</span>` : "";
      return `<li style="margin-bottom:4px;">${esc(c.conduta)}${hor}${apr}</li>`;
    })
    .join("");
  const objetivos = d.condutas.map((c) => c.objetivo).filter(Boolean);
  const prioridade = d.condutas.find((c) => c.prioridade)?.prioridade || "";
  const observ = d.condutas.map((c) => c.obs).filter(Boolean);
  const matrizChip = d.matriz
    ? `<span style="font-size:10.5px;background:#dcfce7;color:#14532d;padding:2px 8px;border-radius:4px;font-weight:600;">${esc(d.matriz)}${d.eixo ? " · " + esc(d.eixo) : ""}</span>`
    : "";
  return `
<div class="sae-diag-card" data-diag-id="${esc(d.id)}" style="background:#f0fdf4;border-radius:10px;padding:14px;border:1px solid #bbf7d0;border-left:5px solid #ca8a04;display:flex;align-items:flex-start;justify-content:space-between;gap:15px;">
  <div style="flex:1;">
    <div style="display:flex;gap:8px;align-items:center;margin-bottom:6px;flex-wrap:wrap;">
      <label style="display:flex;align-items:center;gap:6px;font-size:12px;font-weight:700;color:#14532d;cursor:pointer;">
        <input type="checkbox" class="sae-diag-select" data-diag-id="${esc(d.id)}" style="accent-color:#166534;width:16px;height:16px;"> Selecionar
      </label>
      <span style="font-size:11px;background:#fef08a;color:#854d0e;padding:2px 8px;border-radius:4px;font-weight:bold;">${esc(d.id)}</span>
      ${matrizChip}
    </div>
    <h4 style="margin:0 0 6px 0;font-size:14px;color:#14532d;font-weight:bold;line-height:1.4;">${esc(d.diagnostico)}</h4>
    <p style="margin:0 0 4px 0;font-size:12px;color:#4b5563;"><strong style="color:#166534;">Evidências Clínicas:</strong> ${esc(d.sinais)}</p>
    ${d.criteriosEssenciais ? `<p style="margin:0 0 4px 0;font-size:12px;color:#4b5563;"><strong style="color:#166534;">Critérios essenciais:</strong> ${esc(d.criteriosEssenciais)}</p>` : ""}
    ${d.criteriosAssociados ? `<p style="margin:0 0 6px 0;font-size:12px;color:#4b5563;"><strong style="color:#166534;">Critérios associados:</strong> ${esc(d.criteriosAssociados)}</p>` : ""}
    <details style="margin:4px 0;">
      <summary style="cursor:pointer;font-size:12px;color:#166534;font-weight:600;">Ver intervenções, objetivos e observações</summary>
      <div style="margin-top:6px;font-size:12px;color:#4b5563;">
        <p style="margin:0 0 4px 0;"><strong style="color:#166534;">Intervenções assistenciais:</strong></p>
        <ul style="margin:0 0 8px 18px;padding:0;">${condutasHtml}</ul>
        ${objetivos.length ? `<p style="margin:0 0 4px 0;"><strong style="color:#166534;">Objetivos:</strong> ${esc(objetivos.join(" • "))}</p>` : ""}
        ${prioridade ? `<p style="margin:0 0 4px 0;"><strong style="color:#166534;">Prioridade clínica:</strong> ${esc(prioridade)}</p>` : ""}
        ${observ.length ? `<p style="margin:0;"><strong style="color:#166534;">Observações:</strong> ${esc(observ.join(" • "))}</p>` : ""}
      </div>
    </details>
  </div>
  <div style="text-align:center;flex-shrink:0;">
    <label style="display:block;font-size:10.5px;font-weight:bold;color:#166534;margin-bottom:4px;">Prioridade:</label>
    <input type="number" class="sae-diag-prio" data-diag-id="${esc(d.id)}" min="1" max="20" placeholder="${idx + 1}" style="width:56px;padding:6px;border:2px solid #fef08a;border-radius:6px;text-align:center;font-size:14px;font-weight:bold;color:#14532d;background:#ffffff;outline:none;box-sizing:border-box;">
  </div>
</div>`;
}

// COL. 15 — lista oficial de HORÁRIOS (igual para todos os diagnósticos)
export const HORARIOS_OPCOES: string[] = [
  "1/1h",
  "2/2h",
  "4/4h",
  "6/6h",
  "8/8h",
  "12/12h",
  "24/24h",
  "Atenção",
  "Rotina",
  "Contínuo",
  "Medir volume anotar",
  "SN",
  "AD",
  "Obs.",
];

// COL. 16 — aprazamento correspondente a cada horário
export const APRAZAMENTO_MAP: Record<string, string> = {
  "1/1h": "1. 2. 3. 4. 5. 6. 7. 8. 9. 10. 11. 12. 13. 14. 15. 16. 17. 18. 19. 20. 21. 22. 23. 24.",
  "2/2h": "2. 4. 6. 8. 10. 12. 14. 16. 18. 20. 22. 24.",
  "4/4h": "8. 12. 16. 20. 24. 04.",
  "6/6h": "12. 18. 24. 06.",
  "8/8h": "14. 22. 06.",
  "12/12h": "10. 22.",
  "24/24h": "12.",
};

export function renderPrescricaoRow(
  d: SaeDiagnostico,
  numero: number,
): string {
  const num = String(numero).padStart(2, "0");
  const chips = HORARIOS_OPCOES.map(
    (h) => `<span class="sae-hor-item" data-h="${esc(h)}" style="display:inline-flex;align-items:center;gap:4px;margin:0 4px 4px 0;border:1px solid #86efac;border-radius:999px;background:#f0fdf4;padding:2px 4px 2px 8px;">
      <button type="button" class="sae-hor-chip" data-h="${esc(h)}" style="background:transparent;border:0;color:#14532d;font-size:11.5px;font-weight:700;cursor:pointer;padding:2px 0;">${esc(h)}</button>
      <button type="button" class="sae-hor-del" title="Excluir este horário" aria-label="Excluir horário" style="background:#fef2f2;border:1px solid #fecaca;color:#b91c1c;border-radius:999px;font-size:9.5px;line-height:1;padding:2px 5px;cursor:pointer;">✕</button>
    </span>`,
  ).join("");
  const prioridade = d.condutas.find((c) => c.prioridade)?.prioridade || "";
  const pNorm = norm(prioridade);
  const pCor = pNorm.includes("alta") || pNorm.includes("critic")
    ? { bg: "#fef2f2", br: "#fecaca", tx: "#b91c1c" }
    : pNorm.includes("medi") || pNorm.includes("moder")
      ? { bg: "#fffbeb", br: "#fde68a", tx: "#92400e" }
      : prioridade
        ? { bg: "#f0fdf4", br: "#bbf7d0", tx: "#166534" }
        : { bg: "#ffffff", br: "#e5e7eb", tx: "#374151" };
  return `
<tr class="sae-presc-row" data-diag-id="${esc(d.id)}" style="border-bottom:1px solid #86efac;background:#ffffff;">
  <td style="width:5%;padding:10px 6px;vertical-align:top;border-right:1px solid #86efac;text-align:center;font-weight:800;color:#14532d;font-size:13px;"><span class="sae-presc-num">${num}</span></td>
  <td style="width:40%;padding:10px 12px;vertical-align:top;border-right:1px solid #86efac;color:#14532d;font-size:13px;line-height:1.5;text-align:justify;">
    <strong>${esc(d.diagnostico)}</strong> <span style="font-size:10px;color:#166534;">(${esc(d.id)})</span>
    <button type="button" class="sae-presc-del" data-diag-id="${esc(d.id)}" title="Excluir este diagnóstico" aria-label="Excluir diagnóstico" style="float:right;background:#fef2f2;border:1px solid #fecaca;color:#b91c1c;font-weight:700;font-size:11px;padding:2px 8px;border-radius:6px;cursor:pointer;">✕ Excluir</button>
  </td>
  <td class="sae-presc-horarios" style="width:19%;padding:10px 8px;vertical-align:top;border-right:1px solid #86efac;">${chips}</td>
  <td style="width:23%;padding:10px 8px;vertical-align:top;border-right:1px solid #86efac;">
    <textarea class="sae-presc-apraz" rows="3" placeholder="Selecione um horário ao lado" style="width:100%;border:1px solid #bbf7d0;border-radius:8px;padding:6px 8px;font-size:12.5px;color:#166534;font-weight:700;background:#ffffff;box-sizing:border-box;resize:vertical;"></textarea>
  </td>
  <td style="width:13%;padding:10px 8px;vertical-align:top;text-align:center;">
    <input type="text" class="sae-presc-prio" value="${esc(prioridade)}" placeholder="—" style="width:100%;border:1px solid ${pCor.br};background:${pCor.bg};color:${pCor.tx};border-radius:8px;padding:6px 4px;font-size:12px;font-weight:800;text-align:center;box-sizing:border-box;">
  </td>
</tr>`;
}



export function buildEvolucao(params: {
  identificacao: Record<string, string>;
  anamneseCheckLabels: string[];
  exameFisicoCheckLabels: string[];
  sintomasLivres: string;
  diagnosticosSelecionados: SaeDiagnostico[];
}): string {
  const { identificacao, anamneseCheckLabels, exameFisicoCheckLabels, sintomasLivres, diagnosticosSelecionados } = params;
  const dt = new Date().toLocaleString("pt-BR");
  const ident = Object.entries(identificacao)
    .filter(([, v]) => v && v.trim())
    .map(([k, v]) => `${k}: ${v.trim()}`)
    .join(" | ");
  const dxLines = diagnosticosSelecionados
    .map((d, i) => `${i + 1}. ${d.diagnostico} (${d.id})${d.meta ? " — Meta: " + d.meta : ""}`)
    .join("\n");
  return [
    `EVOLUÇÃO CLÍNICA DE ENFERMAGEM — ${dt}`,
    "---------------------------------------------------------------",
    ident ? `IDENTIFICAÇÃO: ${ident}` : "",
    "",
    "ANAMNESE / ANTECEDENTES:",
    anamneseCheckLabels.length ? anamneseCheckLabels.map((l) => `• ${l}`).join("\n") : "• Sem antecedentes marcados.",
    "",
    "EXAME FÍSICO (achados marcados):",
    exameFisicoCheckLabels.length ? exameFisicoCheckLabels.map((l) => `• ${l}`).join("\n") : "• Sem achados marcados.",
    "",
    "SINAIS E SINTOMAS INFORMADOS:",
    sintomasLivres.trim() || "• Nenhum sintoma livre informado.",
    "",
    "DIAGNÓSTICOS DE ENFERMAGEM (ADEC):",
    dxLines || "• Nenhum diagnóstico selecionado.",
    "",
    "CONDUTA: Prescrição de enfermagem gerada conforme banco oficial ADEC.",
  ]
    .filter((l) => l !== null && l !== undefined)
    .join("\n");
}
