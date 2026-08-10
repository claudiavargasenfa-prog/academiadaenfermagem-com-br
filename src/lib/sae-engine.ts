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

// ---------- Remoção de negações ----------
// "nega dispneia", "sem febre", "ausência de edema" não podem contar a favor.
const NEG_RE =
  /\b(nega|negava|sem|ausencia de|ausente|nao apresenta|nao ha|nao refere|nao relata|descartad[oa])\b/g;

function removerNegados(corpus: string): string {
  let out = corpus;
  let m: RegExpExecArray | null;
  NEG_RE.lastIndex = 0;
  const cortes: [number, number][] = [];
  while ((m = NEG_RE.exec(corpus))) {
    const inicio = m.index;
    // janela de 4 palavras após a negação
    const resto = corpus.slice(m.index + m[0].length);
    const janela = resto.split(/\s+/).slice(0, 5).join(" ");
    cortes.push([inicio, m.index + m[0].length + janela.length]);
  }
  for (let i = cortes.length - 1; i >= 0; i--) {
    out = out.slice(0, cortes[i][0]) + " " + out.slice(cortes[i][1]);
  }
  return out;
}

// ---------- Índice por coluna ----------
type Entrada = {
  d: SaeDiagnostico;
  essenciais: string[]; // TAB. 5 — critérios essenciais (ou TAB. 4 quando vazia)
  temEssenciais: boolean;
  evidencias: string[]; // TAB. 4
  chaves: string[]; // TAB. 13
  frasesEssenciais: string[];
  frasesEvidencia: string[];
};

function frasesDe(texto: string, minLen = 8): string[] {
  return norm(texto)
    .split(/[;.,]/)
    .map((p) => p.trim())
    .filter((p) => p.length >= minLen);
}

const INDEX: Entrada[] = SAE_BANCO.map((d) => {
  const evidencias = Array.from(new Set(tokens(d.sinais)));
  const essTxt = (d.criteriosEssenciais || "").trim();
  const essenciais = Array.from(new Set(tokens(essTxt || d.sinais)));
  const chaves = Array.from(
    new Set(d.condutas.flatMap((c) => tokens(c.palavras || ""))),
  );
  return {
    d,
    essenciais,
    temEssenciais: !!essTxt,
    evidencias,
    chaves,
    frasesEssenciais: frasesDe(essTxt || d.sinais),
    frasesEvidencia: frasesDe(d.sinais),
  };
});

// Peso por especificidade: termo presente em muitos diagnósticos vale pouco.
const DF = new Map<string, number>();
for (const e of INDEX) {
  for (const t of new Set([...e.essenciais, ...e.evidencias, ...e.chaves])) {
    DF.set(t, (DF.get(t) || 0) + 1);
  }
}
const TOTAL_D = INDEX.length || 1;
function peso(t: string): number {
  const df = DF.get(t) || 1;
  return Math.log(1 + TOTAL_D / df);
}

const PESO_MAX = Math.log(1 + TOTAL_D);

function achouTermo(corpus: string, t: string): boolean {
  return new RegExp(`(^|[^a-z0-9])${t}([^a-z0-9]|$)`).test(corpus);
}

export type SaeMatch = {
  diag: SaeDiagnostico;
  score: number;
  hits: string[];
  confianca?: "Alta" | "Média" | "Baixa";
};

export type SaePerfil = { idade?: string; sexo?: string; setor?: string };

export function matchDiagnosticos(
  corpusRaw: string,
  maxResults = 10,
  perfil?: SaePerfil,
): SaeMatch[] {
  const corpus = removerNegados(norm(corpusRaw));
  if (!corpus.trim()) return [];

  const brutos: SaeMatch[] = [];
  for (const e of INDEX) {
    const hits: string[] = [];
    let essHits = 0;
    let score = 0;

    for (const p of e.frasesEssenciais) {
      if (corpus.includes(p)) {
        essHits++;
        score += 4 * PESO_MAX;
        hits.push(p);
      }
    }
    for (const t of e.essenciais) {
      if (achouTermo(corpus, t)) {
        essHits++;
        score += 3 * peso(t);
        hits.push(t);
      }
    }
    // Gate rigoroso: sem critério essencial presente, a hipótese não é sugerida.
    if (essHits === 0) continue;

    for (const p of e.frasesEvidencia) {
      if (corpus.includes(p) && !hits.includes(p)) {
        score += 2 * PESO_MAX;
        hits.push(p);
      }
    }
    for (const t of e.evidencias) {
      if (!hits.includes(t) && achouTermo(corpus, t)) {
        score += 1.5 * peso(t);
        hits.push(t);
      }
    }
    for (const t of e.chaves) {
      if (!hits.includes(t) && achouTermo(corpus, t)) {
        score += 0.5 * peso(t);
        hits.push(t);
      }
    }

    // Normaliza pelo tamanho do diagnóstico para não favorecer linhas longas.
    const tamanho = e.essenciais.length + e.evidencias.length + e.chaves.length;
    score = score / Math.log(2 + tamanho);

    brutos.push({ diag: e.d, score, hits: Array.from(new Set(hits)) });
  }

  if (!brutos.length) return [];

  const filtrados = filtrarPorContexto(brutos, perfil);
  if (!filtrados.length) return [];

  filtrados.sort((a, b) => b.score - a.score);
  const melhor = filtrados[0].score;
  const corte = melhor * 0.6;

  return filtrados
    .filter((m) => m.score >= corte)
    .slice(0, maxResults)
    .map((m) => ({
      ...m,
      confianca:
        m.score >= melhor * 0.85 ? "Alta" : m.score >= melhor * 0.7 ? "Média" : "Baixa",
    }));
}

// ---------- Filtro por contexto do paciente ----------
const MARCA_GESTANTE = /(gestant|gravid|obstetric|puerper|parto|pre-?natal|lactant)/;
const MARCA_NEONATAL = /(neonat|recem-?nascid|\brn\b|prematur)/;
const MARCA_PEDIATRICA = /(pediatric|criativa|crianc|lactente|escolar|infant|adolescent)/;
const MARCA_IDOSO = /(idos|geriatric|senil)/;

export function filtrarPorContexto(matches: SaeMatch[], perfil?: SaePerfil): SaeMatch[] {
  if (!perfil) return matches;
  const idadeNum = Number(String(perfil.idade || "").replace(/[^0-9]/g, ""));
  const idade = Number.isFinite(idadeNum) && idadeNum > 0 ? idadeNum : null;
  const sexo = norm(perfil.sexo || "");
  const masculino = /^m/.test(sexo) || sexo.includes("masculin");
  const setor = norm(perfil.setor || "");

  return matches.filter((m) => {
    const txt = norm(`${m.diag.diagnostico} ${m.diag.matriz || ""} ${m.diag.eixo || ""}`);
    if (MARCA_GESTANTE.test(txt)) {
      if (masculino) return false;
      if (idade !== null && (idade < 10 || idade > 60)) return false;
      if (setor && /(uti neonatal|geriatri|pediatri)/.test(setor)) return false;
    }
    if (MARCA_NEONATAL.test(txt) && idade !== null && idade > 1) return false;
    if (MARCA_PEDIATRICA.test(txt) && idade !== null && idade >= 18) return false;
    if (MARCA_IDOSO.test(txt) && idade !== null && idade < 60) return false;
    return true;
  });
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

// ---------- Captação automática de SINAIS E SINTOMAS ----------
// Varre o texto ditado/digitado e devolve os sinais e sintomas reconhecidos
// no BANCO DE DADOS MESTRE (TAB. 4 — Evidências Clínicas + TAB. 13 — Palavras-chave).

const SINAIS_FRASES: { chave: string; original: string }[] = (() => {
  const mapa = new Map<string, string>();
  for (const d of SAE_BANCO) {
    for (const raw of (d.sinais || "").split(/[;.,]/)) {
      const original = raw.trim();
      if (original.length < 6) continue;
      const chave = norm(original);
      if (!mapa.has(chave)) mapa.set(chave, original);
    }
    for (const c of d.condutas) {
      for (const raw of (c.palavras || "").split(/[;.,]/)) {
        const original = raw.trim();
        if (original.length < 5) continue;
        const chave = norm(original);
        if (!mapa.has(chave)) mapa.set(chave, original);
      }
    }
  }
  return Array.from(mapa, ([chave, original]) => ({ chave, original })).sort(
    (a, b) => b.chave.length - a.chave.length,
  );
})();

export function extrairSinaisSintomas(textoRaw: string, max = 40): string[] {
  const corpus = norm(textoRaw || "");
  if (!corpus.trim()) return [];
  const achados: string[] = [];
  const usados: string[] = [];
  for (const { chave, original } of SINAIS_FRASES) {
    if (!corpus.includes(chave)) continue;
    if (usados.some((u) => u.includes(chave))) continue; // já coberto por frase maior
    usados.push(chave);
    achados.push(original);
    if (achados.length >= max) break;
  }
  return achados;
}
