import { useEffect, useState } from "react";
import { Download, Smartphone } from "lucide-react";

type BIPEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function InstallAppButton() {
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [showIOSHelp, setShowIOSHelp] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // @ts-expect-error iOS Safari
      window.navigator.standalone === true;
    if (isStandalone) setInstalled(true);

    const onBIP = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BIPEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferred(null);
    };
    window.addEventListener("beforeinstallprompt", onBIP);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBIP);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (installed) return null;

  const isIOS =
    typeof navigator !== "undefined" &&
    /iphone|ipad|ipod/i.test(navigator.userAgent);

  const handleClick = async () => {
    if (deferred) {
      await deferred.prompt();
      await deferred.userChoice;
      setDeferred(null);
    } else if (isIOS) {
      setShowIOSHelp(true);
    } else {
      setShowIOSHelp(true);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-full bg-emerald-700 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:bg-emerald-800"
        aria-label="Instalar aplicativo"
      >
        <Download className="h-4 w-4" />
        Instalar App
      </button>

      {showIOSHelp && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center"
          onClick={() => setShowIOSHelp(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-emerald-700" />
              <h2 className="text-base font-bold">Como instalar</h2>
            </div>
            {isIOS ? (
              <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-700">
                <li>Toque no botão <b>Compartilhar</b> (□↑) na barra do Safari.</li>
                <li>Role e escolha <b>“Adicionar à Tela de Início”</b>.</li>
                <li>Toque em <b>Adicionar</b>. Pronto, o ícone aparecerá no seu iPhone.</li>
              </ol>
            ) : (
              <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-700">
                <li>Abra o menu do Chrome (⋮ no canto superior direito).</li>
                <li>Escolha <b>“Instalar aplicativo”</b> ou <b>“Adicionar à tela inicial”</b>.</li>
                <li>Confirme. O ícone aparecerá na tela inicial do seu celular.</li>
              </ol>
            )}
            <button
              onClick={() => setShowIOSHelp(false)}
              className="mt-4 w-full rounded-lg bg-emerald-700 py-2 text-sm font-semibold text-white"
            >
              Entendi
            </button>
          </div>
        </div>
      )}
    </>
  );
}
