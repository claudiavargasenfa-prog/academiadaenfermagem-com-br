// Wrapper do reconhecimento de voz NATIVO do dispositivo (Web Speech API).
// Custo zero: o áudio é processado pelo próprio Android/iOS, nunca sobe para
// nosso servidor e não consome créditos de IA. Nada é gravado.

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((e: any) => void) | null;
  onerror: ((e: any) => void) | null;
  onend: (() => void) | null;
};

function getCtor(): (new () => SpeechRecognitionLike) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as Record<string, unknown>;
  const C = (w["SpeechRecognition"] || w["webkitSpeechRecognition"]) as
    | (new () => SpeechRecognitionLike)
    | undefined;
  return C ?? null;
}

export function suporteVoz(): boolean {
  return getCtor() !== null;
}

export type DitadoHandlers = {
  onFinal: (texto: string) => void;
  onParcial: (texto: string) => void;
  onErro: (msg: string) => void;
};

export type DitadoSessao = {
  parar: () => void;
};

/** Inicia uma sessão contínua de ditado. Reinicia sozinha se o navegador cortar. */
export function iniciarDitado(h: DitadoHandlers): DitadoSessao | null {
  const C = getCtor();
  if (!C) return null;

  let ativo = true;
  let rec: SpeechRecognitionLike | null = null;
  let wakeLock: { release: () => Promise<void> } | null = null;

  const pedirWakeLock = async () => {
    try {
      const nav = navigator as unknown as {
        wakeLock?: { request: (t: "screen") => Promise<{ release: () => Promise<void> }> };
      };
      if (nav.wakeLock) wakeLock = await nav.wakeLock.request("screen");
    } catch {
      /* sem wake lock: apenas segue */
    }
  };
  void pedirWakeLock();

  // No Android o navegador pode reenviar o mesmo resultado final ou ampliar
  // um resultado anterior (ex.: "paciente com" → "paciente com dor").
  // Além dos índices, guardamos um histórico curto e emitimos somente a parte
  // realmente nova da fala.
  let processados = 0;
  let ultimoFinal = "";
  let finaisRecentes: Array<{ texto: string; em: number }> = [];

  const normalizar = (texto: string) =>
    texto.toLocaleLowerCase("pt-BR").replace(/[^a-záàâãéèêíïóôõöúç0-9\s]/gi, " ").replace(/\s+/g, " ").trim();

  const somenteTrechoNovo = (texto: string): string => {
    const agora = Date.now();
    const atual = normalizar(texto);
    if (!atual) return "";

    finaisRecentes = finaisRecentes.filter((item) => agora - item.em < 12_000);
    if (finaisRecentes.some((item) => item.texto === atual)) return "";

    const anterior = normalizar(ultimoFinal);
    if (anterior) {
      if (anterior === atual || anterior.startsWith(`${atual} `)) return "";
      if (atual.startsWith(`${anterior} `)) {
        const novo = texto.trim().split(/\s+/).slice(anterior.split(" ").length).join(" ");
        finaisRecentes.push({ texto: atual, em: agora });
        ultimoFinal = texto;
        return novo;
      }

      const palavrasAnteriores = anterior.split(" ");
      const palavrasAtuais = atual.split(" ");
      const limite = Math.min(palavrasAnteriores.length, palavrasAtuais.length);
      for (let tamanho = limite; tamanho >= 2; tamanho--) {
        if (palavrasAnteriores.slice(-tamanho).join(" ") === palavrasAtuais.slice(0, tamanho).join(" ")) {
          const novo = texto.trim().split(/\s+/).slice(tamanho).join(" ");
          finaisRecentes.push({ texto: atual, em: agora });
          ultimoFinal = texto;
          return novo;
        }
      }
    }

    finaisRecentes.push({ texto: atual, em: agora });
    ultimoFinal = texto;
    return texto.trim();
  };

  const criar = () => {
    const r = new C();
    r.lang = "pt-BR";
    r.continuous = true;
    r.interimResults = true;
    r.maxAlternatives = 1;
    processados = 0;
    r.onresult = (e: any) => {
      let parcial = "";
      const inicio = Math.max(e.resultIndex ?? 0, processados);
      for (let i = inicio; i < e.results.length; i++) {
        const res = e.results[i];
        const txt = String(res[0]?.transcript ?? "").trim();
        if (res.isFinal) {
          processados = i + 1;
          if (!txt) continue;
          const novo = somenteTrechoNovo(txt);
          if (novo) h.onFinal(novo);
        } else {
          parcial += txt;
        }
      }
      h.onParcial(parcial);
    };
    r.onerror = (e: any) => {
      const err = String(e?.error ?? "");
      if (err === "no-speech" || err === "aborted") return;
      if (err === "not-allowed" || err === "service-not-allowed") {
        ativo = false;
        h.onErro("Permissão de microfone negada. Libere o microfone nas configurações do navegador.");
      } else if (err === "network") {
        h.onErro("Sem conexão para o reconhecimento de voz. Verifique a internet.");
      }
    };
    r.onend = () => {
      if (!ativo) return;
      processados = 0;
      try {
        r.start();
      } catch {
        /* já iniciado */
      }
    };
    return r;
  };

  try {
    rec = criar();
    rec.start();
  } catch {
    h.onErro("Não foi possível iniciar o microfone neste navegador.");
    return null;
  }

  return {
    parar: () => {
      ativo = false;
      try {
        rec?.stop();
      } catch {
        /* ignore */
      }
      void wakeLock?.release().catch(() => {});
    },
  };
}
