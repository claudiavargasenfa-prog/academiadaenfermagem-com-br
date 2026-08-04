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

  const criar = () => {
    const r = new C();
    r.lang = "pt-BR";
    r.continuous = true;
    r.interimResults = true;
    r.maxAlternatives = 1;
    r.onresult = (e: any) => {
      let parcial = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        const txt = String(res[0]?.transcript ?? "");
        if (res.isFinal) h.onFinal(txt);
        else parcial += txt;
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
