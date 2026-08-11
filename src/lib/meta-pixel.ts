const PIXEL_ID = "2479743902438109";

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & { queue?: unknown[]; loaded?: boolean };
    _fbq?: unknown;
  }
}

/** Carrega o Meta Pixel uma única vez (não duplica se já existir na página). */
export function ensurePixel(options?: { pageView?: boolean }): void {
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
  if (options?.pageView !== false) fbq?.("track", "PageView");
}

/** Dispara um evento apenas uma vez por chave (cache local no navegador). */
export function trackOnce(event: string, key: string, opts?: { eventID?: string }): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (localStorage.getItem(key)) return false;
  } catch {
    /* storage indisponível: segue e tenta disparar */
  }
  ensurePixel({ pageView: false });
  (window as any).fbq?.("track", event, {}, opts?.eventID ? { eventID: opts.eventID } : undefined);
  try {
    localStorage.setItem(key, new Date().toISOString());
  } catch {
    /* ignora */
  }
  return true;
}

