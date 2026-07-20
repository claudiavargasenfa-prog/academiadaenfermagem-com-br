import FingerprintJS from "@fingerprintjs/fingerprintjs";

let cached: Promise<string> | null = null;

export function getDeviceId(): Promise<string> {
  if (cached) return cached;
  cached = (async () => {
    try {
      // Reusa se já foi gerado nesse dispositivo
      const stored = typeof window !== "undefined" ? localStorage.getItem("ae_device_id") : null;
      if (stored) return stored;
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      const id = result.visitorId;
      try {
        localStorage.setItem("ae_device_id", id);
      } catch {}
      return id;
    } catch {
      return "";
    }
  })();
  return cached;
}
