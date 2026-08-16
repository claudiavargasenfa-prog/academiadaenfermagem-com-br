import { useQuery } from "@tanstack/react-query";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { Video, Headphones } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/AppShell";
import { useAuthReady } from "@/lib/access";
import BlocoDitado from "@/components/voz/BlocoDitado";
import GuiaColetaTurno from "@/components/GuiaColetaTurno";
import { CertificadoFAQ } from "@/components/CertificadoFAQ";
import { AccordionSearchLayout } from "@/components/miniapps/uti/AccordionSearchLayout";

import { renderContent } from "@/lib/markdown";
import { useLocal } from "@/lib/storage";
import {
  matchDiagnosticos,
  renderDiagnosticoCard,
  renderPrescricaoRow,
  buildEvolucao,
  APRAZAMENTO_MAP,
  extrairSinaisSintomas,
  separarSinaisSintomas,



  type SaeDiagnostico,
} from "@/lib/sae-engine";

// ===== Tipos e helpers do guia clínico COLETA DE DADOS + ADMISSÃO DE TURNO =====
// Multi-paciente com persistência local (localStorage) — sem custo de banco.
type FormSnap = Record<string, string | boolean>;
type HistItem = { id: string; hora: string; texto: string };
type Paciente = {
  id: string;
  nome: string;
  leito: string;
  form: FormSnap;
  historico: HistItem[];
};
type ColetaState = { pacientes: Paciente[]; ativoId: string };

function novoPacienteObj(idx: number): Paciente {
  const id = `p-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  return { id, nome: `Paciente ${idx}`, leito: "", form: {}, historico: [] };
}

function snapshotForm(root: HTMLElement): FormSnap {
  const out: FormSnap = {};
  root
    .querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
      "input, textarea, select",
    )
    .forEach((el) => {
      const type = (el as HTMLInputElement).type;
      if (type === "radio") {
        const r = el as HTMLInputElement;
        if (r.checked && r.name) out[`__r:${r.name}`] = r.value;
      } else if (type === "checkbox") {
        const c = el as HTMLInputElement;
        const k = c.id || (c.name ? `__c:${c.name}:${c.value}` : "");
        if (k) out[k] = c.checked;
      } else {
        const k = el.id || (el as HTMLInputElement).name;
        if (k) out[k] = (el as HTMLInputElement).value;
      }
    });
  return out;
}

function restoreFormSnap(root: HTMLElement, snap: FormSnap) {
  root
    .querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
      "input, textarea, select",
    )
    .forEach((el) => {
      const type = (el as HTMLInputElement).type;
      if (type === "radio") {
        const r = el as HTMLInputElement;
        const v = snap[`__r:${r.name}`];
        r.checked = v === r.value;
      } else if (type === "checkbox") {
        const c = el as HTMLInputElement;
        const k = c.id || (c.name ? `__c:${c.name}:${c.value}` : "");
        c.checked = !!(k && snap[k]);
      } else {
        const k = el.id || (el as HTMLInputElement).name;
        if (k) (el as HTMLInputElement).value = snap[k] != null ? String(snap[k]) : "";
      }
    });
}



/**
 * Renderiza o conteúdo editável do guia clínico (vindo do Admin):
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
      // Se for o mini app de drogas vasoativas, buscamos os sub-tópicos também
      if (slug === 'drogas-vasoativas') {
        const { data: appData, error: appErr } = await supabase
          .from("mini_apps")
          .select("id, content_md, video_url, audio_url")
          .eq("slug", slug)
          .maybeSingle();
        if (appErr) throw appErr;
        
        const { data: subtopics, error: subErr } = await supabase
          .from("mini_app_subtopics")
          .select("*")
          .eq("mini_app_id", appData?.id || "")
          .order("ordem");
        
        if (subErr) throw subErr;
        
        return { ...appData, subtopics };
      }

      const { data, error } = await supabase
        .from("mini_apps")
        .select("content_md, video_url, audio_url")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: isReady && !!slug,
    staleTime: 60_000,
  });

  if (!isReady || q.isLoading) {
    return (
      <Card className="mb-6 border-primary/30 bg-primary/5 text-sm text-muted-foreground">
        Carregando conteúdo do Mini App…
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
  const { content_md, video_url, audio_url } = q.data as any;
  const hasContent = content_md?.trim() || video_url?.trim() || audio_url?.trim() || (slug === 'drogas-vasoativas' && (q.data as any).subtopics?.length > 0);
  if (!hasContent) return null;

  if (slug === 'drogas-vasoativas') {
    const subtopics = (q.data as any).subtopics || [];
    const drugs = subtopics.map((s: any) => ({
      id: s.id,
      title: s.title,
      category: 'Vasoativos', // Categoria padrão
      content: s.content_md || 'Conteúdo em breve...',
      color: 'blue',
      icon: s.icon
    }));

    // Tentar extrair categoria real se estiver no título como [Categoria] ou similar
    drugs.forEach((d: any) => {
      const match = d.title.match(/\[(.*?)\]/);
      if (match) {
        d.category = match[1];
        d.title = d.title.replace(/\[.*?\]/, '').trim();
      }
    });

    const categories = ['Vasoativos', 'Sedativos', 'Analgésicos', 'Antibióticos', 'Eletrólitos', 'Anticoagulantes'];
    
    // Log para depuração em caso de problemas
    console.log("MiniAppContent: Renderizando layout de sanfona para drogas-vasoativas", {
      totalDrogas: drugs.length,
      drogas: drugs.map((d: any) => d.title)
    });

    return (
      <div className="mb-6 space-y-4">
        <AccordionSearchLayout 
          mainTitle="DROGAS MAIS UTILIZADA NA TERAPIA INTENSIVA"
          drugs={drugs}
          categories={categories}
        />
        <CertificadoFAQ />
      </div>
    );
  }

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

      <CertificadoFAQ />
    </div>
  );
}

/**
 * Renderiza HTML/markdown do guia clínico e ativa comportamentos interativos
 * embutidos que o React não executa sozinho (ex.: botões "Salvar Prescrição"
 * e "Salvar Evolução" do guia clínico FUNDAMENTOS DOS DIAGNÓSTICOS — download
 * .doc 100% no navegador, sem backend, sem custo).
 */
/**
 * Host de HTML bruto isolado do ciclo de render do React.
 * O HTML é injetado imperativamente UMA vez (e só de novo se o conteúdo mudar),
 * de modo que atualizações de estado do componente pai (autosave, abas de
 * paciente, histórico) nunca destroem o DOM vivo do guia clínico — campos digitados,
 * sanfonas abertas, diagnósticos gerados e tabela de prescrição são preservados.
 */
const RawHtmlHost = memo(function RawHtmlHost({ html }: { html: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    el.innerHTML = html;
    // <script> inserido via innerHTML não executa: recriamos cada um.
    el.querySelectorAll("script").forEach((old) => {
      const s = document.createElement("script");
      for (const a of Array.from(old.attributes)) s.setAttribute(a.name, a.value);
      s.textContent = old.textContent;
      old.replaceWith(s);
    });
  }, [html]);
  return <div ref={hostRef} className="mini-app-html" />;
});


export function MiniAppHtmlContent({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [sintomasCaptados, setSintomasCaptados] = useState<string[]>([]);
  const [textoNaoReconhecido, setTextoNaoReconhecido] = useState<string[]>([]);


  // Guia clínico SAE traz <script> embutido; renderizamos o HTML bruto (sem
  // sanitização) pois o conteúdo é escrito pelo admin e precisamos preservar
  // os <script> — DOMPurify remove todos por padrão.
  const isSae = /lavoble-sae-descomplicada/.test(html) || /<script[\s>]/i.test(html);

  // Detecta o guia clínico COLETA DE DADOS + ADMISSÃO DE TURNO pelos IDs
  // característicos do formulário (não depende de slug — resiste a duplicações).
  const isColeta =
    /id=["']anotacao_final_painel["']/.test(html) &&
    /name=["']item_procedencia["']/.test(html);

  const initialColeta = useMemo<ColetaState>(() => {
    const p = novoPacienteObj(1);
    return { pacientes: [p], ativoId: p.id };
  }, []);
  const [coleta, setColeta] = useLocal<ColetaState>("coleta-turno-v1", initialColeta);
  const setColetaRef = useRef(setColeta);
  setColetaRef.current = setColeta;

  const ativoPaciente =
    coleta.pacientes.find((p) => p.id === coleta.ativoId) ?? coleta.pacientes[0] ?? null;

  // Garante estado consistente (pelo menos 1 paciente, ativoId válido)
  useEffect(() => {
    if (!isColeta) return;
    if (!coleta.pacientes.length) {
      const p = novoPacienteObj(1);
      setColeta({ pacientes: [p], ativoId: p.id });
    } else if (!coleta.pacientes.find((p) => p.id === coleta.ativoId)) {
      setColeta((s) => ({ ...s, ativoId: s.pacientes[0].id }));
    }
  }, [isColeta, coleta.ativoId, coleta.pacientes, setColeta]);

  // ===== SAE DESCOMPLICADA — multi-paciente próprio (localStorage "sae-turno-v1")
  const initialSae = useMemo<ColetaState>(() => {
    const p = novoPacienteObj(1);
    return { pacientes: [p], ativoId: p.id };
  }, []);
  const [sae, setSae] = useLocal<ColetaState>("sae-turno-v1", initialSae);
  const setSaeRef = useRef(setSae);
  setSaeRef.current = setSae;
  const ativoSae =
    sae.pacientes.find((p) => p.id === sae.ativoId) ?? sae.pacientes[0] ?? null;

  useEffect(() => {
    if (!isSae) return;
    if (!sae.pacientes.length) {
      const p = novoPacienteObj(1);
      setSae({ pacientes: [p], ativoId: p.id });
    } else if (!sae.pacientes.find((p) => p.id === sae.ativoId)) {
      setSae((s) => ({ ...s, ativoId: s.pacientes[0].id }));
    }
  }, [isSae, sae.ativoId, sae.pacientes, setSae]);

  // Restaura os valores do paciente ativo no formulário quando trocar de aba
  // ou remontar o HTML.
  useEffect(() => {
    if (!isColeta) return;
    const root = ref.current;
    if (!root) return;
    const cur = coleta.pacientes.find((p) => p.id === coleta.ativoId);
    if (cur) restoreFormSnap(root, cur.form);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isColeta, coleta.ativoId, html]);

  // Autosave: qualquer input/change no formulário salva no paciente ativo.
  useEffect(() => {
    if (!isColeta) return;
    const root = ref.current;
    if (!root) return;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const save = () => {
      const snap = snapshotForm(root);
      setColetaRef.current((prev) => ({
        ...prev,
        pacientes: prev.pacientes.map((p) =>
          p.id === prev.ativoId
            ? {
                ...p,
                form: snap,
                nome: (typeof snap["paciente_nome"] === "string" && snap["paciente_nome"]) || p.nome,
                leito:
                  (typeof snap["paciente_leito"] === "string" && snap["paciente_leito"]) || p.leito,
              }
            : p,
        ),
      }));
    };
    const onIn = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(save, 400);
    };
    root.addEventListener("input", onIn);
    root.addEventListener("change", onIn);
    return () => {
      if (timer) clearTimeout(timer);
      root.removeEventListener("input", onIn);
      root.removeEventListener("change", onIn);
    };
  }, [isColeta, html]);

  // ===== SAE: restaura formulário do paciente ativo e limpa diagnósticos/prescrição dinâmicos
  useEffect(() => {
    if (!isSae) return;
    const root = ref.current;
    if (!root) return;
    const cur = sae.pacientes.find((p) => p.id === sae.ativoId);
    if (cur) restoreFormSnap(root, cur.form);
    const dyn = root.querySelector<HTMLElement>("#sae-diag-dinamicos");
    if (dyn) dyn.innerHTML = "";
    const tbody = root.querySelector<HTMLElement>("#corpo-tabela-prescricao");
    if (tbody) tbody.innerHTML = "";
    const wrap = root.querySelector<HTMLElement>("#wrapper-tabela-prescricao");
    if (wrap) wrap.style.display = "none";
    const vazioDiag = root.querySelector<HTMLElement>("#painel-vazio-diagnosticos");
    if (vazioDiag) vazioDiag.style.display = "block";
    const vazioPresc = root.querySelector<HTMLElement>("#painel-vazio-prescricao");
    if (vazioPresc) vazioPresc.style.display = "block";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSae, sae.ativoId, html]);

  // ===== SAE: autosave do formulário no paciente ativo
  useEffect(() => {
    if (!isSae) return;
    const root = ref.current;
    if (!root) return;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const save = () => {
      const snap = snapshotForm(root);
      setSaeRef.current((prev) => ({
        ...prev,
        pacientes: prev.pacientes.map((p) =>
          p.id === prev.ativoId
            ? {
                ...p,
                form: snap,
                nome:
                  (typeof snap["nomePaciente"] === "string" && snap["nomePaciente"]) || p.nome,
                leito:
                  (typeof snap["leitoPaciente"] === "string" && snap["leitoPaciente"]) || p.leito,
              }
            : p,
        ),
      }));
      
      // Converte o snapshot para uma string consolidada para a extração
      const textoSnapshot = Object.entries(snap)
        .filter(([k, v]) => v === true || (typeof v === 'string' && v.length > 0))
        .map(([k, v]) => (typeof v === 'string' ? v : k))
        .join(". ");

      const sinais = extrairSinaisSintomas(textoSnapshot);
      if (sinais.length > 0) {
        console.log("Sinais extraídos automaticamente:", sinais);
      }
    };
    const onIn = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(save, 400);
    };
    root.addEventListener("input", onIn);
    root.addEventListener("change", onIn);
    return () => {
      if (timer) clearTimeout(timer);
      root.removeEventListener("input", onIn);
      root.removeEventListener("change", onIn);
    };
  }, [isSae, html]);

  // Ações do painel multi-paciente
  const switchAtivo = (id: string) => {
    if (id === coleta.ativoId) return;
    const root = ref.current;
    const curSnap = root ? snapshotForm(root) : {};
    setColeta((s) => ({
      pacientes: s.pacientes.map((x) => (x.id === s.ativoId ? { ...x, form: curSnap } : x)),
      ativoId: id,
    }));
  };
  const addPaciente = () => {
    const root = ref.current;
    const curSnap = root ? snapshotForm(root) : {};
    setColeta((s) => {
      const p = novoPacienteObj(s.pacientes.length + 1);
      return {
        pacientes: [
          ...s.pacientes.map((x) => (x.id === s.ativoId ? { ...x, form: curSnap } : x)),
          p,
        ],
        ativoId: p.id,
      };
    });
  };
  const removerAtivo = () => {
    if (!ativoPaciente) return;
    if (
      !window.confirm(
        `Remover ${ativoPaciente.nome}${ativoPaciente.leito ? ` (leito ${ativoPaciente.leito})` : ""} e todas as suas anotações?`,
      )
    )
      return;
    setColeta((s) => {
      const filtered = s.pacientes.filter((p) => p.id !== s.ativoId);
      if (filtered.length === 0) {
        const p = novoPacienteObj(1);
        return { pacientes: [p], ativoId: p.id };
      }
      return { pacientes: filtered, ativoId: filtered[0].id };
    });
  };
  const encerrarPlantao = () => {
    if (
      !window.confirm(
        "Encerrar plantão? Todos os pacientes e anotações deste aparelho serão apagados.",
      )
    )
      return;
    const p = novoPacienteObj(1);
    setColeta({ pacientes: [p], ativoId: p.id });
  };
  const copiar = async (t: string) => {
    try {
      await navigator.clipboard.writeText(t);
    } catch {
      /* ignore */
    }
  };
  const copiarPlantaoTodo = () => {
    if (!ativoPaciente) return;
    const cabecalho = `PLANTÃO — ${ativoPaciente.nome}${ativoPaciente.leito ? ` (leito ${ativoPaciente.leito})` : ""}`;
    const corpo = ativoPaciente.historico.map((h) => `\n[${h.hora}] ${h.texto}`).join("\n");
    void copiar(`${cabecalho}\n${corpo}`);
  };
  const removerHist = (hid: string) => {
    setColeta((s) => ({
      ...s,
      pacientes: s.pacientes.map((p) =>
        p.id === s.ativoId ? { ...p, historico: p.historico.filter((h) => h.id !== hid) } : p,
      ),
    }));
  };
  const limparHistoricoAtivo = () => {
    if (!window.confirm("Apagar todas as anotações deste paciente neste plantão?")) return;
    setColeta((s) => ({
      ...s,
      pacientes: s.pacientes.map((p) => (p.id === s.ativoId ? { ...p, historico: [] } : p)),
    }));
  };

  // ===== Ações SAE (multi-paciente) =====
  const switchAtivoSae = (id: string) => {
    if (id === sae.ativoId) return;
    const root = ref.current;
    const curSnap = root ? snapshotForm(root) : {};
    setSae((s) => ({
      pacientes: s.pacientes.map((x) => (x.id === s.ativoId ? { ...x, form: curSnap } : x)),
      ativoId: id,
    }));
  };
  const addPacienteSae = () => {
    const root = ref.current;
    const curSnap = root ? snapshotForm(root) : {};
    setSae((s) => {
      const p = novoPacienteObj(s.pacientes.length + 1);
      return {
        pacientes: [
          ...s.pacientes.map((x) => (x.id === s.ativoId ? { ...x, form: curSnap } : x)),
          p,
        ],
        ativoId: p.id,
      };
    });
  };
  const removerAtivoSae = () => {
    if (!ativoSae) return;
    if (
      !window.confirm(
        `Remover ${ativoSae.nome}${ativoSae.leito ? ` (leito ${ativoSae.leito})` : ""} e todas as suas evoluções?`,
      )
    )
      return;
    setSae((s) => {
      const filtered = s.pacientes.filter((p) => p.id !== s.ativoId);
      if (filtered.length === 0) {
        const p = novoPacienteObj(1);
        return { pacientes: [p], ativoId: p.id };
      }
      return { pacientes: filtered, ativoId: filtered[0].id };
    });
  };
  const encerrarPlantaoSae = () => {
    if (
      !window.confirm(
        "Encerrar plantão do SAE? Todos os pacientes e evoluções deste aparelho serão apagados.",
      )
    )
      return;
    const p = novoPacienteObj(1);
    setSae({ pacientes: [p], ativoId: p.id });
  };
  const copiarPlantaoTodoSae = () => {
    if (!ativoSae) return;
    const cab = `SAE — ${ativoSae.nome}${ativoSae.leito ? ` (leito ${ativoSae.leito})` : ""}`;
    const corpo = ativoSae.historico.map((h) => `\n[${h.hora}] ${h.texto}`).join("\n");
    void copiar(`${cab}\n${corpo}`);
  };
  const removerHistSae = (hid: string) => {
    setSae((s) => ({
      ...s,
      pacientes: s.pacientes.map((p) =>
        p.id === s.ativoId ? { ...p, historico: p.historico.filter((h) => h.id !== hid) } : p,
      ),
    }));
  };
  const limparHistoricoAtivoSae = () => {
    if (!window.confirm("Apagar todas as evoluções deste paciente neste plantão?")) return;
    setSae((s) => ({
      ...s,
      pacientes: s.pacientes.map((p) => (p.id === s.ativoId ? { ...p, historico: [] } : p)),
    }));
  };

  // ===== CENTRAL DE CÁLCULOS ASSISTENCIAIS =====
  // Motor nativo: gotejamento (macro/micro/mL·h) + dosagem pediátrica por Kg.
  // O HTML do admin é puramente declarativo (handlers inline não executam).
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const bloco = root.querySelector<HTMLElement>(".central-calculos-enfermagem");
    if (!bloco) return;

    const val = (id: string) => {
      const el = bloco.querySelector<HTMLInputElement | HTMLSelectElement>(`#${id}`);
      const n = parseFloat(String(el?.value ?? "").replace(",", "."));
      return isFinite(n) ? n : NaN;
    };
    const out = (id: string, texto: string) => {
      const el = bloco.querySelector<HTMLElement>(`#${id}`);
      if (el) el.textContent = texto;
    };

    const recalcular = () => {
      // --- 1. Gotejamento
      const v = val("got-v");
      const th = val("got-th");
      const tm = val("got-tm");
      const usaMin = tm > 0; // minutos têm prioridade
      const campoHoras = bloco.querySelector<HTMLElement>("#got-th");
      if (campoHoras) campoHoras.style.opacity = usaMin ? "0.45" : "1";

      if (v > 0 && usaMin) {
        out("out-gotas", String(Math.round((v * 20) / tm)));
        out("out-microgotas", String(Math.round((v * 60) / tm)));
        out("out-mlhora", String(Math.round((v * 60) / tm)));
      } else if (v > 0 && th > 0) {
        out("out-gotas", String(Math.round(v / (th * 3))));
        out("out-microgotas", String(Math.round(v / th)));
        out("out-mlhora", String(Math.round(v / th)));
      } else {
        out("out-gotas", "--");
        out("out-microgotas", "--");
        out("out-mlhora", "--");
      }

      // --- 2. Dosagem pediátrica por peso
      const dose = val("ped-dose");
      const peso = val("ped-peso");
      const fracaRaw = val("ped-fraca");
      const fraca = fracaRaw > 0 ? fracaRaw : 1;
      const conc = val("ped-conc");
      const liq = val("ped-liq");

      if (dose > 0 && peso > 0) {
        const mgDia = dose * peso;
        const mgDose = mgDia / fraca;
        out("out-mg-dia", `${mgDia.toFixed(1)} mg/dia`);
        out("out-mg-dose", `${mgDose.toFixed(1)} mg/dose`);
        if (conc > 0 && liq > 0) {
          out("out-ml-ped-final", `${((mgDose * liq) / conc).toFixed(2)} mL / dose`);
        } else {
          out("out-ml-ped-final", "--");
        }
      } else {
        out("out-mg-dia", "--");
        out("out-mg-dose", "--");
        out("out-ml-ped-final", "--");
      }
    };

    // Impede submit acidental dos <form> do conteúdo
    const onSubmit = (e: Event) => e.preventDefault();

    bloco.addEventListener("input", recalcular);
    bloco.addEventListener("change", recalcular);
    bloco.addEventListener("submit", onSubmit);
    recalcular();

    return () => {
      bloco.removeEventListener("input", recalcular);
      bloco.removeEventListener("change", recalcular);
      bloco.removeEventListener("submit", onSubmit);
    };
  }, [html]);


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
            el.textContent = String(i + 1).padStart(2, "0");
          });
        }
      }
      // COL. 15 — excluir um horário da linha
      const horDel = target?.closest<HTMLButtonElement>(".sae-hor-del");
      if (horDel) {
        e.preventDefault();
        horDel.closest(".sae-hor-item")?.remove();
        return;
      }
      // COL. 15 -> COL. 16 — selecionar horário preenche o aprazamento
      const horChip = target?.closest<HTMLButtonElement>(".sae-hor-chip");
      if (horChip) {
        e.preventDefault();
        const row = horChip.closest<HTMLTableRowElement>("tr.sae-presc-row");
        const h = horChip.dataset.h || horChip.textContent?.trim() || "";
        row?.querySelectorAll<HTMLElement>(".sae-hor-item").forEach((it) => {
          const on = it.getAttribute("data-h") === h;
          it.style.background = on ? "#bbf7d0" : "#f0fdf4";
          it.style.borderColor = on ? "#16a34a" : "#86efac";
        });
        const ta = row?.querySelector<HTMLTextAreaElement>(".sae-presc-apraz");
        if (ta) {
          ta.value = APRAZAMENTO_MAP[h] ?? h;
          ta.dispatchEvent(new Event("input", { bubbles: true }));
        }
      }
    };


    root.addEventListener("click", onClick);

    // ===== SUPORTE À DECISÃO CLÍNICA / SAE AUTOMATIZADA =====
    // Motor autoral que consulta o BANCO DE DADOS MESTRE (planilha AE/DE)
    // e gera diagnósticos + prescrição + evolução consolidada.
    const isFundamentosApp = !!root.querySelector(".lavoble-guia-fisiopatologia");
    const isSaeApp =
      !!root.querySelector(".lavoble-sae-descomplicada") || isFundamentosApp;
    let cleanupSaeListeners: (() => void) | null = null;
    if (isSaeApp) {
      // O Mini App de Fundamentos tinha apenas quatro exemplos fixos. Monta nele
      // a área automatizada ligada à planilha ADEC (colunas 4, 7, 8 e 10).
      if (isFundamentosApp && !root.querySelector("#adec-fundamentos-automatizado")) {
        const guia = root.querySelector<HTMLElement>(".lavoble-guia-fisiopatologia");
        const painel = document.createElement("section");
        painel.id = "adec-fundamentos-automatizado";
        painel.style.cssText =
          "margin:0 0 20px;padding:18px;border:1px solid #bbf7d0;border-radius:10px;background:#f0fdf4;box-sizing:border-box;";
        painel.innerHTML = `
          <h3 style="margin:0 0 10px;color:#14532d;font-size:17px;font-weight:800;">3. MECANISMOS CIENTÍFICOS – HIPÓTESE DIAGNÓSTICA AUTORAL</h3>
          <label for="txt-sinais-sintomas-consolidados" style="display:block;margin-bottom:6px;color:#14532d;font-size:13px;font-weight:800;">Evidências Clínicas / Sinais e Sintomas</label>
          <textarea id="txt-sinais-sintomas-consolidados" rows="5" placeholder="Digite, cole ou envie aqui os sinais e sintomas identificados no paciente..." style="width:100%;padding:11px;border:1px solid #86efac;border-radius:7px;background:#ffffff;color:#14532d;font:inherit;resize:vertical;box-sizing:border-box;"></textarea>
          <button id="btn-gerar-diagnosticos" type="button" style="margin-top:10px;padding:10px 15px;border:0;border-radius:7px;background:#166534;color:#ffffff;font-size:13px;font-weight:800;cursor:pointer;">Pesquisar hipóteses diagnósticas ADEC</button>
          <div id="painel-vazio-diagnosticos" style="margin-top:12px;color:#166534;font-size:12px;">Informe as evidências clínicas e clique no botão para pesquisar.</div>
          <div id="grade-diagnosticos-prioridade" style="display:none;flex-direction:column;gap:12px;margin-top:14px;width:100%;"></div>`;
        guia?.prepend(painel);
      }

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

      // ---- Espelho automático: tudo que for marcado/escrito na anamnese e no
      // exame físico é enviado para a caixa de pesquisa de diagnósticos. ----
      const MARCA_INI = "[ACHADOS DA ANAMNESE E EXAME FÍSICO]";
      const MARCA_FIM = "[FIM DOS ACHADOS]";
      const IGNORAR_IDS = new Set([
        "txt-sinais-sintomas-consolidados",
        "txt-evolucao-clinica-mestre",
        "txt-evolucao-lavoble",
        "medicamentos",
        "nomePaciente",
        "leitoPaciente",
      ]);

      // Itens de prescrição/cuidados não são achados do paciente — nunca entram
      // na área de pesquisa de hipótese diagnóstica.
      const ehItemDePrescricao = (el: HTMLElement): boolean =>
        !!el.closest(".item-prescricao-lavoble") ||
        /^pre\d+$/.test(el.id) ||
        el.classList.contains("sae-presc-apraz");

      const rotuloDe = (el: HTMLElement): string => {
        const own = el.closest("label")?.textContent;
        if (own && own.replace(/\s+/g, " ").trim()) return own.replace(/\s+/g, " ").trim();
        const prev = el.previousElementSibling;
        if (prev?.tagName === "LABEL") return (prev.textContent || "").replace(/\s+/g, " ").trim();
        const cont = el.parentElement?.querySelector("label");
        return (cont?.textContent || "").replace(/\s+/g, " ").trim();
      };

      // ---- Filtro de normalidade: só achados ANORMAIS/ALTERADOS vão para a
      // área de pesquisa de hipótese diagnóstica. ----
      const semAcento = (s: string) =>
        s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

      const TERMOS_NORMAIS = [
        "sem alteracao",
        "sem alteracoes",
        "sem anormalidade",
        "sem queixa",
        "sem queixas",
        "sem particularidade",
        "sem sinais de",
        "sem alteracao aparente",
        "nada digno de nota",
        "ndn",
        "dentro da normalidade",
        "dentro dos parametros",
        "normal",
        "normais",
        "normocorad",
        "normocardic",
        "normotens",
        "normocefal",
        "normoglicemic",
        "normotermic",
        "eupneic",
        "eupneia",
        "hidratad",
        "anicteric",
        "aciantic",
        "afebril",
        "lucido",
        "lucida",
        "orientad",
        "consciente e orientad",
        "ativo e reativo",
        "integra",
        "integro",
        "preservad",
        "presente e simetric",
        "ausencia de",
        "ausente",
        "negativo",
        "nega ",
        "sem dor",
        "indolor",
        "fisiologic",
        "habitual",
        "espontane",
        "regular",
        "adequad",
        "estavel",
      ];

      // Palavras que indicam alteração mesmo quando aparecem junto de um termo "normal"
      const TERMOS_ALTERADOS = [
        "alterad",
        "anormal",
        "diminu",
        "reduzid",
        "aumentad",
        "elevad",
        "ausencia de peristalse",
        "dor",
        "lesao",
        "ferida",
        "edema",
        "dispneia",
        "taqui",
        "bradi",
        "hipo",
        "hiper",
        "cianose",
        "cianotic",
        "palidez",
        "ictericia",
        "confus",
        "agitad",
        "sonolent",
        "torporos",
        "prostrad",
        "febre",
        "febril",
        "secrecao",
        "sangramento",
        "vomito",
        "nausea",
        "diarreia",
        "constipa",
        "queda",
        "risco",
      ];

      // Sinais vitais: faixa de referência (fora dela = anormal)
      const FAIXAS_VITAIS: { chaves: string[]; min: number; max: number }[] = [
        { chaves: ["freq cardiaca", "frequencia cardiaca", "fc ", "fc:", "fc(", "f.c", "pulso", "p. (bpm", "bpm"], min: 60, max: 100 },
        { chaves: ["freq respiratoria", "frequencia respiratoria", "fr ", "fr:", "f.r", "irpm"], min: 12, max: 20 },
        { chaves: ["temperatura", "tax", "temp ", "t. (", "t.(", "(°c", "° c"], min: 35.5, max: 37.5 },
        { chaves: ["satura", "spo2", "sato2", "sat o2"], min: 94, max: 100 },
        { chaves: ["glicem", "hgt", "dextro"], min: 70, max: 140 },
        { chaves: ["dor"], min: 0, max: 0 },
      ];

      const primeiroNumero = (s: string): number | null => {
        const m = s.replace(",", ".").match(/-?\d+(\.\d+)?/);
        return m ? parseFloat(m[0]) : null;
      };

      // Pressão arterial (ex.: "120x80", "120/80")
      const paForaDaFaixa = (rotulo: string, valor: string): boolean | null => {
        if (!/press|mmhg|\bp\.?\s?a\.?\b|\bpas\b|\bpad\b/.test(rotulo)) return null;
        const m = valor.replace(",", ".").match(/(\d{2,3})\s*[x/]\s*(\d{2,3})/);
        if (!m) return null;
        const sis = parseInt(m[1], 10);
        const dia = parseInt(m[2], 10);
        return sis < 90 || sis > 139 || dia < 60 || dia > 89;
      };

      const ehAnormal = (rotulo: string, valor: string): boolean => {
        const r = semAcento(rotulo);
        const v = semAcento(valor);
        const texto = `${r} ${v}`.trim();
        if (!texto) return false;

        // Marcadores explícitos de alteração vencem qualquer termo de normalidade
        if (TERMOS_ALTERADOS.some((t) => v.includes(t))) return true;

        // Pressão arterial
        const pa = paForaDaFaixa(r, v);
        if (pa !== null) return pa;

        // Demais sinais vitais numéricos
        const faixa = FAIXAS_VITAIS.find((f) => f.chaves.some((c) => r.includes(c)));
        if (faixa) {
          const n = primeiroNumero(v);
          if (n !== null) return n < faixa.min || n > faixa.max;
        }

        // Texto declarando normalidade não vai para a pesquisa
        if (TERMOS_NORMAIS.some((t) => v.includes(t))) return false;

        return true;
      };

      const coletarAchados = (): string[] => {
        const linhas: string[] = [];

        // 1) Tudo que foi marcado — apenas os achados fora da normalidade.
        // O exame físico usa a convenção "<sistema>_n_..." (normal) e
        // "<sistema>_a_..." (alterado) no id/valor da caixinha.
        root
          .querySelectorAll<HTMLInputElement>('input[type="checkbox"]:checked')
          .forEach((chk) => {
            if (chk.classList.contains("sae-diag-select")) return;
            if (ehItemDePrescricao(chk)) return;
            const chave = `${chk.id} ${chk.value} ${chk.name}`;
            const txtBruto = rotuloDe(chk) || chk.value;
            if (!txtBruto) return;
            const legivel = /_[na]_/.test(chave)
              ? txtBruto.replace(/^[a-z]+_[na]_/, "").replace(/_/g, " ").trim()
              : txtBruto;
            if (/_n_/.test(chave)) return; // achado normal — não vai para a pesquisa
            if (/_a_/.test(chave)) {
              linhas.push(legivel);
              return;
            }
            if (!ehAnormal("", legivel)) return;
            linhas.push(legivel);
          });

        // 2) Tudo que foi escrito nos campos de anamnese / exame físico
        root
          .querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
            'input[type="text"], input[type="number"], textarea',
          )
          .forEach((campo) => {
            if (IGNORAR_IDS.has(campo.id)) return;
            if (campo.classList.contains("sae-diag-prio")) return;
            if (ehItemDePrescricao(campo)) return;
            const v = (campo.value || "").replace(/\s+/g, " ").trim();
            if (!v) return;
            const rot = rotuloDe(campo).replace(/:\s*$/, "");
            if (!ehAnormal(rot, v)) return;
            linhas.push(rot ? `${rot}: ${v}` : v);
          });

        return Array.from(new Set(linhas));
      };

      const sincronizarAchados = () => {
        const ta = root.querySelector<HTMLTextAreaElement>("#txt-sinais-sintomas-consolidados");
        if (!ta || document.activeElement === ta) return;
        const achados = coletarAchados();
        const atual = ta.value;
        const idx = atual.indexOf(MARCA_INI);
        const fim = atual.indexOf(MARCA_FIM);
        const livre =
          idx >= 0 && fim > idx ? atual.slice(fim + MARCA_FIM.length).replace(/^\s+/, "") : atual.trim();
        const bloco = achados.length
          ? `${MARCA_INI}\n${achados.map((l) => `• ${l}`).join("\n")}\n${MARCA_FIM}\n\n`
          : "";
        const novo = bloco + livre;
        if (novo !== atual) ta.value = novo;
      };

      let syncTimer: number | undefined;
      const agendarSync = () => {
        window.clearTimeout(syncTimer);
        syncTimer = window.setTimeout(sincronizarAchados, 350);
      };
      // Marcar/desmarcar caixinha reflete na hora; digitação usa o intervalo curto.
      const sincronizarNaHora = (e: Event) => {
        const alvo = e.target as HTMLInputElement | null;
        if (alvo && alvo.type === "checkbox") {
          window.clearTimeout(syncTimer);
          sincronizarAchados();
          return;
        }
        agendarSync();
      };
      root.addEventListener("input", agendarSync);
      root.addEventListener("change", sincronizarNaHora);
      agendarSync();

      const coletarCorpus = (): string => {
        sincronizarAchados();
        const livre =
          root.querySelector<HTMLTextAreaElement>("#txt-sinais-sintomas-consolidados")?.value ?? "";
        return [livre, coletarAchados().join(". ")].join(". ");
      };




      const gerarDiagnosticos = () => {
        if (!dyn) return;
        const corpus = coletarCorpus();
        const val = (id: string) =>
          (root.querySelector<HTMLInputElement | HTMLSelectElement>(`#${id}`)?.value ?? "").trim();
        const perfil = {
          idade: val("idadePaciente"),
          sexo: val("sexoPaciente") || val("sexo"),
          setor: val("setorPaciente") || val("setor") || val("clinica"),
        };
        const matches = matchDiagnosticos(corpus, 10, perfil);
        diagnosticosAtivos = matches.map((m) => m.diag);

        const painelVazio = root.querySelector<HTMLElement>("#painel-vazio-diagnosticos");
        if (painelVazio) painelVazio.style.display = matches.length ? "none" : "block";
        if (grade) grade.style.display = "flex";

        if (matches.length === 0) {
          dyn.innerHTML =
            '<div style="padding:14px;background:#fef2f2;border:1px solid #fecaca;border-radius:8px;color:#991b1b;font-size:13px;">Nenhuma hipótese com correspondência suficiente para este paciente. Descreva os sinais e sintomas com mais detalhes clínicos (ex.: "dispneia aos mínimos esforços", "edema em MMII 2+/4+", "febre 38,5°C com tosse produtiva").</div>';

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
        // Empilha a evolução gerada no histórico do paciente SAE ativo (localStorage)
        const evolTxt = (
          root.querySelector<HTMLTextAreaElement>("#txt-evolucao-clinica-mestre")?.value ?? ""
        ).trim();
        if (evolTxt) {
          const hora = new Date().toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          });
          const item: HistItem = {
            id: `h-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            hora,
            texto: evolTxt,
          };
          setSaeRef.current((prev) => ({
            ...prev,
            pacientes: prev.pacientes.map((p) =>
              p.id === prev.ativoId ? { ...p, historico: [...p.historico, item] } : p,
            ),
          }));
        }
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

      const criarPdfBase = async (titulo: string, orientation: "portrait" | "landscape" = "portrait") => {
        const { jsPDF } = await import("jspdf");
        const pdf = new jsPDF({ orientation, unit: "mm", format: "a4" });

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
          const ctx = await criarPdfBase("Plano de Prescrição de Enfermagem", "landscape");
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
          const colW = [
            contentW * 0.05,
            contentW * 0.4,
            contentW * 0.19,
            contentW * 0.23,
            contentW * 0.13,
          ];
          const headerH = 10;
          const drawHeader = () => {
            pdf.setFillColor(22, 101, 52);
            pdf.setTextColor(255, 255, 255);
            pdf.setFont("times", "bold");
            pdf.setFontSize(8.5);
            let x = margin.left;
            ["Nº", "DIAGNÓSTICO DE ENFERMAGEM", "HORÁRIO", "APRAZAMENTO", "PRIORIDADE CLÍNICA"].forEach((h, i) => {
              pdf.rect(x, ctx.y, colW[i], headerH, "FD");
              pdf.text(h, x + colW[i] / 2, ctx.y + 6.5, { align: "center" });
              x += colW[i];
            });
            ctx.y += headerH;
            pdf.setTextColor(0, 0, 0);
          };
          drawHeader();

          rows.forEach((row, idx) => {
            const cells = Array.from(row.cells);
            const numero = String(idx + 1).padStart(2, "0");
            const diagnostico = getTextoCelula(cells[1]);
            const itens = Array.from(
              cells[2]?.querySelectorAll<HTMLElement>(".sae-hor-item") ?? [],
            );
            const selecionado = itens.find((i) => i.style.borderColor === "rgb(22, 163, 74)");
            const horario = limparTextoPdf(
              (selecionado ?? itens[0])?.querySelector(".sae-hor-chip")?.textContent ?? "",
            );
            const aprazamento = limparTextoPdf(
              cells[3]?.querySelector<HTMLTextAreaElement>(".sae-presc-apraz")?.value ?? "",
            );
            const prioridade = limparTextoPdf(
              cells[4]?.querySelector<HTMLInputElement>(".sae-presc-prio")?.value ?? "",
            );
            pdf.setFont("times", "normal");
            pdf.setFontSize(9);
            const diagLines = pdf.splitTextToSize(diagnostico, colW[1] - 6);
            const horLines = pdf.splitTextToSize(horario, colW[2] - 6);
            const aprazLines = pdf.splitTextToSize(aprazamento, colW[3] - 6);
            const prioLines = pdf.splitTextToSize(prioridade, colW[4] - 6);
            const rowH = Math.max(
              14,
              diagLines.length * 5 + 8,
              horLines.length * 5 + 8,
              aprazLines.length * 5 + 8,
              prioLines.length * 5 + 8,
            );

            addPageIfNeeded(rowH + headerH);
            if (ctx.y + rowH > pdf.internal.pageSize.getHeight() - margin.bottom) {
              pdf.addPage();
              ctx.y = margin.top;
              drawHeader();
            }
            let x = margin.left;
            pdf.setDrawColor(22, 101, 52);
            pdf.rect(x, ctx.y, colW[0], rowH);
            pdf.setFont("times", "bold");
            pdf.text(numero, x + colW[0] / 2, ctx.y + 6, { align: "center" });
            x += colW[0];
            pdf.rect(x, ctx.y, colW[1], rowH);
            pdf.setFont("times", "normal");
            pdf.text(diagLines, x + 3, ctx.y + 6, { maxWidth: colW[1] - 6 });
            x += colW[1];
            pdf.rect(x, ctx.y, colW[2], rowH);
            pdf.setFont("times", "bold");
            pdf.text(horLines, x + colW[2] / 2, ctx.y + 6, { align: "center", maxWidth: colW[2] - 6 });
            x += colW[2];
            pdf.rect(x, ctx.y, colW[3], rowH);
            pdf.text(aprazLines, x + colW[3] / 2, ctx.y + 6, { align: "center", maxWidth: colW[3] - 6 });
            x += colW[3];
            pdf.rect(x, ctx.y, colW[4], rowH);
            pdf.text(prioLines, x + colW[4] / 2, ctx.y + 6, { align: "center", maxWidth: colW[4] - 6 });
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
        root.removeEventListener("input", agendarSync);
        root.removeEventListener("change", sincronizarNaHora);
        window.clearTimeout(syncTimer);
        if (hadFn) {
          w.atualizarEvolucaoAutomatica = prevFn;
        } else {
          delete w.atualizarEvolucaoAutomatica;
        }
      };
    }

    // ===== COLETA DE DADOS + ADMISSÃO DE TURNO (Técnico) =====
    // Ativa o botão "Gerar Anotação" gerando um rascunho de anotação técnica
    // a partir de todas as marcações e observações do formulário.
    let cleanupColeta: (() => void) | null = null;
    const painelColeta = root.querySelector<HTMLTextAreaElement>("#anotacao_final_painel");
    const temProcedencia = root.querySelector('input[name="item_procedencia"]');
    if (painelColeta && temProcedencia) {
      const val = (sel: string) =>
        (root.querySelector<HTMLInputElement | HTMLTextAreaElement>(sel)?.value ?? "").trim();
      const radio = (name: string, fallback: string) =>
        root.querySelector<HTMLInputElement>(`input[name="${name}"]:checked`)?.value ?? fallback;

      const gerarAnotacaoTecnica = () => {
        const nomePac = val("#paciente_nome") || "NOME NÃO INFORMADO";
        const leitoPac = val("#paciente_leito") || "S/L";

        const procedencia = radio("item_procedencia", "vinda do plantão anterior");
        const consciencia = radio("item_consciencia", "consciente e orientado");
        const comportamento = radio("item_comportamento", "calmo e cooperativo");
        const peleCor = radio("item_pele_cor", "corado e hidratado");
        const peleInteg = radio("item_pele_integ", "com pele íntegra e sem lesões");
        const dorGrau = radio("dor_grau", "com ausência de queixas álgicas (grau 0)");
        const queixasGerais = radio("item_queixas", "sem queixas clínicas registradas");
        const eliminacoes = radio("item_eliminacoes", "diurese e evacuações presentes e normais");

        const zones: Array<[string, string]> = [
          ["lpp_trocanter_d", "Trocanter D"],
          ["lpp_trocanter_e", "Trocanter E"],
          ["lpp_cocci", "Cóccix"],
          ["lpp_calcaneo_d", "Calcâneo D"],
          ["lpp_calcaneo_e", "Calcâneo E"],
        ];
        const lppsMarcadas = zones
          .filter(([id]) => root.querySelector<HTMLInputElement>(`#${id}`)?.checked)
          .map(([, label]) => label);
        const escoriacao = !!root.querySelector<HTMLInputElement>("#item_pele_escoriacao")?.checked;
        let textoLpp = "";
        if (lppsMarcadas.length > 0) {
          textoLpp =
            " apresentando lesão por pressão (LPP) ativa em regiões de: " +
            lppsMarcadas.join(", ");
        }
        if (escoriacao) {
          textoLpp +=
            (textoLpp ? " e " : " apresentando ") +
            "escoriações/hematomas cutâneos visíveis no corpo";
        }

        const pa = val("#vit_pa");
        const fc = val("#vit_fc");
        const fr = val("#vit_fr");
        const temp = val("#vit_temp");
        const spo2 = val("#vit_spo2");

        const dispositivos: string[] = [];
        if (root.querySelector<HTMLInputElement>("#disp_avp")?.checked) {
          let s = "acesso venoso periférico (AVP) pérvio";
          const d = val("#disp_avp_data");
          if (d) s += " puncionado em " + d;
          dispositivos.push(s);
        }
        if (root.querySelector<HTMLInputElement>("#disp_svd")?.checked)
          dispositivos.push(
            "sonda vesical de demora (SVD) locada em sistema fechado drenando diurese clara",
          );
        if (root.querySelector<HTMLInputElement>("#disp_bomba")?.checked)
          dispositivos.push("infusões parenterais contínuas mantidas em bomba de infusão");
        if (root.querySelector<HTMLInputElement>("#disp_nenhum")?.checked)
          dispositivos.push("livre de cateteres ou dispositivos invasivos aparentes");

        const obs = {
          procedencia: val("#obs_procedencia"),
          neurologico: val("#obs_neurologico"),
          pele: val("#obs_pele"),
          vitais: val("#obs_vitais"),
          dispositivos: val("#obs_dispositivos"),
          queixas: val("#obs_queixas"),
        };

        const data = new Date();
        const strData = data.toLocaleDateString("pt-BR");
        const strHora = data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

        let laudo =
          `${strData} às ${strHora}h - Assumido cuidados de assistência do paciente ${nomePac} no leito ${leitoPac}, por motivo de ${procedencia}.`;
        if (obs.procedencia) laudo += ` Nota de procedência: ${obs.procedencia}.`;

        laudo += ` Paciente encontra-se estado neurológico ${consciencia}, mantendo-se ${comportamento}.`;
        if (obs.neurologico) laudo += ` Nota neurológica: ${obs.neurologico}.`;

        laudo += ` Ao exame geral apresenta pele e mucosas com padrão ${peleCor}, estando ${textoLpp || peleInteg}.`;
        if (obs.pele) laudo += ` Nota de integridade cutânea: ${obs.pele}.`;

        laudo += " Sinais vitais aferidos no início do turno apresentando: ";
        laudo += pa ? `PA: ${pa} mmHg, ` : "PA: não informada, ";
        laudo += fc ? `FC: ${fc} bpm, ` : "FC: não informada, ";
        laudo += fr ? `FR: ${fr} ipm, ` : "FR: não informada, ";
        laudo += temp ? `T: ${temp} °C, ` : "T: não informada, ";
        laudo += spo2 ? `SpO₂: ${spo2}%. ` : "SpO₂: não informada. ";

        laudo += ` Avaliação do nível de dor indica paciente ${dorGrau}.`;
        if (obs.vitais) laudo += ` Nota de sinais vitais/dor: ${obs.vitais}.`;

        if (dispositivos.length > 0) {
          laudo += ` Identificado em uso de dispositivos assistenciais: ${dispositivos.join(", ")}.`;
        }
        if (obs.dispositivos) laudo += ` Nota de dispositivos: ${obs.dispositivos}.`;

        laudo += ` Paciente evolui ${queixasGerais} e aponta ${eliminacoes}.`;
        if (obs.queixas) laudo += ` Nota de queixas/eliminações: ${obs.queixas}.`;

        laudo += " Segue sob cuidados e monitorização contínua da equipe técnica de enfermagem.";

        painelColeta.value = laudo;
        painelColeta.dispatchEvent(new Event("input", { bubbles: true }));
        painelColeta.scrollIntoView({ behavior: "smooth", block: "center" });

        // Empilha no histórico do paciente ativo (persistido no aparelho)
        const horaHist = data.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        });
        const item: HistItem = {
          id: `h-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          hora: horaHist,
          texto: laudo,
        };
        setColetaRef.current((prev) => ({
          ...prev,
          pacientes: prev.pacientes.map((p) =>
            p.id === prev.ativoId ? { ...p, historico: [...p.historico, item] } : p,
          ),
        }));
      };


      const onColetaClick = (e: Event) => {
        const t = e.target as HTMLElement | null;
        if (!t) return;
        const btn = t.closest<HTMLButtonElement>("button");
        if (!btn) return;
        const txt = (btn.textContent || "").trim().toLowerCase();
        if (!/gerar\s+anota/.test(txt)) return;
        e.preventDefault();
        gerarAnotacaoTecnica();
      };
      root.addEventListener("click", onColetaClick);
      cleanupColeta = () => root.removeEventListener("click", onColetaClick);
    }


    return () => {
      root.removeEventListener("click", onClick);
      cleanupSaeListeners?.();
      cleanupColeta?.();
    };
  }, [html]);

  // ===== COLETA (Técnico): âncora do bloco de ditado, logo acima do botão
  // "Gerar Anotação". Inserida imperativamente no HTML bruto e preenchida via
  // portal, para não reinjetar o DOM do guia clínico.
  const [anchorColeta, setAnchorColeta] = useState<HTMLElement | null>(null);
  useEffect(() => {
    if (!isColeta) {
      setAnchorColeta(null);
      return;
    }
    const root = ref.current;
    if (!root) return;
    const div = document.createElement("div");
    div.id = "adec-ditado-anchor";
    const posicionar = () => {
      const r = ref.current;
      if (!r || div.isConnected) return;
      const btn = Array.from(r.querySelectorAll<HTMLButtonElement>("button")).find((b) =>
        /gerar\s+anota/i.test((b.textContent || "").trim()),
      );
      if (btn) {
        const alvo = btn.parentElement && btn.parentElement !== r ? btn.parentElement : btn;
        alvo.parentElement?.insertBefore(div, alvo);
      } else {
        r.insertBefore(div, r.firstChild);
      }
    };
    posicionar();
    // O React pode recriar o HTML bruto do guia clínico (autosave, troca de aba);
    // se a âncora sumir, reposicionamos automaticamente.
    const mo = new MutationObserver(() => posicionar());
    mo.observe(root, { childList: true, subtree: true });
    setAnchorColeta(div);
    return () => {
      mo.disconnect();
      div.remove();
      setAnchorColeta(null);
    };
  }, [isColeta, html]);

  const inserirDitadoColeta = (alvo: string, texto: string) => {
    const root = ref.current;
    if (!root || !texto.trim()) return;
    const sel = alvo === "anotacao" ? "#anotacao_final_painel" : "#obs_queixas";
    const campo = root.querySelector<HTMLTextAreaElement | HTMLInputElement>(sel);
    if (!campo) {
      alert(
        alvo === "anotacao"
          ? "Gere a anotação primeiro para poder acrescentar o texto ditado."
          : "Abra a seção de observações do turno antes de enviar o texto ditado.",
      );
      return;
    }
    const atual = campo.value.trim();
    campo.value = atual ? `${atual}\n${texto.trim()}` : texto.trim();
    campo.dispatchEvent(new Event("input", { bubbles: true }));
    campo.dispatchEvent(new Event("change", { bubbles: true }));
    campo.scrollIntoView({ behavior: "smooth", block: "center" });
  };


  return (
    <div>
      {isColeta && (
        <>
          <GuiaColetaTurno />
          <div className="mb-3 flex flex-wrap items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 p-2">
            {coleta.pacientes.map((p, i) => (
              <button
                key={p.id}
                type="button"
                onClick={() => switchAtivo(p.id)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  p.id === coleta.ativoId
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-white text-primary hover:bg-primary/10"
                }`}
              >
                {p.nome || `Paciente ${i + 1}`}
                {p.leito ? ` · ${p.leito}` : ""}
              </button>
            ))}
            <button
              type="button"
              onClick={addPaciente}
              className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
            >
              + Adicionar paciente
            </button>
            {coleta.pacientes.length > 1 && (
              <button
                type="button"
                onClick={removerAtivo}
                className="rounded-lg bg-red-100 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-200"
              >
                Remover atual
              </button>
            )}
            <button
              type="button"
              onClick={encerrarPlantao}
              className="ml-auto rounded-lg bg-amber-100 px-3 py-1.5 text-sm font-medium text-amber-800 hover:bg-amber-200"
            >
              Encerrar plantão
            </button>
          </div>
          <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 p-2 text-xs text-amber-900">
            ⚠️ As anotações ficam salvas <b>apenas neste aparelho e navegador</b>. Copie para o
            prontuário oficial ao final do plantão. Se limpar dados do navegador ou trocar de
            aparelho, elas serão perdidas.
          </div>
        </>
      )}

      {isSae && (
        <>
          <div className="mb-3 flex flex-wrap items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 p-2">
            {sae.pacientes.map((p, i) => (
              <button
                key={p.id}
                type="button"
                onClick={() => switchAtivoSae(p.id)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  p.id === sae.ativoId
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-white text-primary hover:bg-primary/10"
                }`}
              >
                {p.nome || `Paciente ${i + 1}`}
                {p.leito ? ` · ${p.leito}` : ""}
              </button>
            ))}
            <button
              type="button"
              onClick={addPacienteSae}
              className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
            >
              + Adicionar paciente
            </button>
            {sae.pacientes.length > 1 && (
              <button
                type="button"
                onClick={removerAtivoSae}
                className="rounded-lg bg-red-100 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-200"
              >
                Remover atual
              </button>
            )}
            <button
              type="button"
              onClick={encerrarPlantaoSae}
              className="ml-auto rounded-lg bg-amber-100 px-3 py-1.5 text-sm font-medium text-amber-800 hover:bg-amber-200"
            >
              Encerrar plantão
            </button>
          </div>
          <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 p-2 text-xs text-amber-900">
            ⚠️ As evoluções ficam salvas <b>apenas neste aparelho e navegador</b>. Ao trocar de
            paciente, os diagnósticos e a prescrição na tela são limpos — clique em <b>Gerar
            Diagnósticos</b> novamente para o paciente selecionado. Copie para o prontuário
            oficial ao final do plantão.
          </div>
        </>
      )}

      {isSae && (
        <>
          <BlocoDitado
            draftKey={sae.ativoId || "sae"}
            onInserir={(alvo, texto) => {
              const root = ref.current;
              const conteudo = texto.trim();
              if (!conteudo) return;

              if (alvo === "sintomas") {
                const { reconhecidos, restante } = separarSinaisSintomas(conteudo);
                setSintomasCaptados((prev) => {
                  const juntos = [...prev];
                  for (const a of reconhecidos) if (!juntos.includes(a)) juntos.push(a);
                  return juntos;
                });
                setTextoNaoReconhecido(restante);
                const alvoSint = root?.querySelector<HTMLTextAreaElement>(
                  "#txt-sinais-sintomas-consolidados, #txt-sinais-sintomas, textarea[id*='sintoma'], textarea[placeholder*='sintoma' i]",
                );
                if (alvoSint) {
                  const bloco = reconhecidos.length ? reconhecidos.join("; ") : conteudo;
                  alvoSint.value = alvoSint.value.trim()
                    ? `${alvoSint.value.trim()}\n${bloco}`
                    : bloco;
                  alvoSint.dispatchEvent(new Event("input", { bubbles: true }));
                  alvoSint.dispatchEvent(new Event("change", { bubbles: true }));
                }
                window.setTimeout(() => {
                  document
                    .getElementById("adec-sinais-sintomas-captados")
                    ?.scrollIntoView({ behavior: "smooth", block: "center" });
                }, 50);
                return;
              }


              const ta = root?.querySelector<HTMLTextAreaElement>(
                "#txt-evolucao-clinica-mestre, #txt-evolucao-lavoble, textarea[id*='evolucao'], textarea[placeholder*='evolu' i]",
              );
              if (!ta) {
                alert("Abra a seção de Evolução do Mini App antes de enviar o texto ditado.");
                return;
              }
              ta.value = ta.value.trim() ? `${ta.value.trim()}\n${conteudo}` : conteudo;
              ta.dispatchEvent(new Event("input", { bubbles: true }));
              ta.dispatchEvent(new Event("change", { bubbles: true }));
              ta.scrollIntoView({ behavior: "smooth", block: "center" });
              ta.focus();
            }}
          />

          <div
            id="adec-sinais-sintomas-captados"
            className="mb-4 rounded-2xl border border-emerald-200 bg-white/80 p-4 shadow-sm backdrop-blur"
          >
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <h4 className="text-sm font-bold text-emerald-900">
                🩺 Evidências Clínicas / Sinais e Sintomas
              </h4>
              <span className="rounded-full bg-emerald-600/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">
                captados automaticamente do ditado
              </span>
            </div>
            {sintomasCaptados.length === 0 ? (
              <p className="text-xs text-emerald-900/70">
                Dite ou escreva no bloco acima e clique em{" "}
                <b>Enviar para Evidências Clínicas / Sinais e Sintomas</b>. O sistema reconhece as
                evidências clínicas do banco oficial e lista aqui.
              </p>

            ) : (
              <>
                <ul className="mb-2 flex flex-wrap gap-2">
                  {sintomasCaptados.map((s) => (
                    <li
                      key={s}
                      className="flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-900"
                    >
                      {s}
                      <button
                        type="button"
                        aria-label={`Remover ${s}`}
                        onClick={() =>
                          setSintomasCaptados((prev) => prev.filter((x) => x !== s))
                        }
                        className="text-red-600"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => setSintomasCaptados([])}
                  className="rounded-lg bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700"
                >
                  Limpar lista
                </button>
              </>
            )}
            {textoNaoReconhecido.length > 0 && (
              <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3">
                <p className="mb-1 text-[11px] font-bold text-amber-900">
                  Não reconhecido como evidência clínica (guardado para você conferir):
                </p>
                <p className="text-xs text-amber-900/80">{textoNaoReconhecido.join(" · ")}</p>
              </div>
            )}
          </div>

        </>
      )}


      <div ref={ref} className="prose-sm max-w-none">
        {isSae ? <RawHtmlHost html={html} /> : renderContent(html)}
      </div>

      {isColeta &&
        anchorColeta &&
        createPortal(
          <BlocoDitado
            draftKey={`coleta-${coleta.ativoId || "1"}`}
            acoes={[
              {
                id: "obs",
                label: "➜ Enviar para Observações do turno",
                className: "bg-emerald-600",
              },
              {
                id: "anotacao",
                label: "➜ Enviar para a Anotação Final",
                className: "bg-teal-600",
              },
            ]}
            onInserir={inserirDitadoColeta}
          />,
          anchorColeta,
        )}




      {isColeta && ativoPaciente && (
        <div className="mt-6 rounded-xl border border-primary/20 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h4 className="text-sm font-semibold text-primary">
              📋 Histórico do plantão — {ativoPaciente.nome}
              {ativoPaciente.leito ? ` (leito ${ativoPaciente.leito})` : ""}
            </h4>
            <span className="text-xs text-muted-foreground">
              {ativoPaciente.historico.length}{" "}
              {ativoPaciente.historico.length === 1 ? "anotação" : "anotações"}
            </span>
          </div>
          {ativoPaciente.historico.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhuma anotação gerada ainda para este paciente. Preencha o formulário acima e
              clique em <b>Gerar Anotação</b>.
            </p>
          ) : (
            <ul className="space-y-2">
              {ativoPaciente.historico.map((h) => (
                <li key={h.id} className="rounded-lg bg-primary/5 p-2">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-sm font-semibold text-primary">🕒 {h.hora}</span>
                    <div className="ml-auto flex gap-1">
                      <button
                        type="button"
                        onClick={() => void copiar(h.texto)}
                        className="rounded bg-primary px-2 py-1 text-xs font-medium text-primary-foreground hover:opacity-90"
                      >
                        Copiar
                      </button>
                      <button
                        type="button"
                        onClick={() => removerHist(h.id)}
                        className="rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-200"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                  <p className="whitespace-pre-wrap text-sm text-foreground">{h.texto}</p>
                </li>
              ))}
            </ul>
          )}
          {ativoPaciente.historico.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={copiarPlantaoTodo}
                className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
              >
                Copiar plantão inteiro
              </button>
              <button
                type="button"
                onClick={limparHistoricoAtivo}
                className="rounded-lg bg-red-100 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-200"
              >
                Limpar plantão deste paciente
              </button>
            </div>
          )}
        </div>
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
            title="Vídeo do Mini App"
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
