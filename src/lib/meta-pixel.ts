const PIXEL_ID = "2479743902438109";

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & { queue?: unknown[]; loaded?: boolean };
    _fbq?: unknown;
  }
}

/** Carrega o Meta Pixel uma única vez (não duplica se já existir na página). */
export function ensurePixel(): void {
  if (typeof window === "undefined") return;
  if (window.fbq) return;

  /* eslint-disable */
  (function (f: any, b: Document, e: string, v: string) {
    let n: any, t: any, s: any;
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];
    t = b.createElement(e);
    t.async = true;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
  /* eslint-enable */

  const fbq = (window as any).fbq as ((...a: unknown[]) => void) | undefined;
  fbq?.("init", PIXEL_ID);
  fbq?.("track", "PageView");
}

/** Dispara um evento apenas uma vez por chave (persistido no navegador). */
export function trackOnce(event: string, key: string): void {
  if (typeof window === "undefined") return;
  try {
    if (localStorage.getItem(key)) return;
    ensurePixel();
    (window as any).fbq?.("track", event);
    localStorage.setItem(key, new Date().toISOString());
  } catch {
    /* storage indisponível: não dispara para evitar duplicidade */
  }
}
