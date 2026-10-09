import { useEffect, useState, type ReactNode } from "react";
import { isMercadoPagoUrl } from "@/lib/mp-links";
import { Link } from "@tanstack/react-router";
import { Lock, ExternalLink, Sparkles, Clock3, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAppAccess, formatPriceBRL, daysUntil, CAMPAIGN_FREE_UNTIL_LABEL } from "@/lib/access";

export function ContentProtection({ children, allowPrint = false }: { children: ReactNode; allowPrint?: boolean }) {
  const [stamp, setStamp] = useState("");
  useEffect(() => {
    let mounted = true;
    try {
      void supabase.auth.getUser().then(({ data }) => {
        if (!mounted) return;
        const email = data.user?.email ?? "convidado";
        const id = (data.user?.id ?? "anon").slice(0, 8);
        setStamp(`${email} · ${id} · ${new Date().toLocaleString("pt-BR")}`);
      }).catch((error) => {
        console.warn("[ContentProtection] Não foi possível obter usuário para marca d'água:", error);
        if (mounted) setStamp("Academia da Enfermagem");
      });
    } catch (error) {
      console.warn("[ContentProtection] Autenticação indisponível:", error);
      setStamp("Academia da Enfermagem");
    }
    return () => { mounted = false; };
  }, []);
  useEffect(() => {
    const block = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if ((e.ctrlKey || e.metaKey) && (k === "p" || k === "s")) {
        if (!(allowPrint && k === "p")) { e.preventDefault(); e.stopPropagation(); }
      }
      if (k === "f12" || ((e.ctrlKey || e.metaKey) && e.shiftKey && ["i", "j", "c"].includes(k)) || ((e.ctrlKey || e.metaKey) && k === "u")) {
        e.preventDefault(); e.stopPropagation();
      }
    };
    const noMenu = (e: MouseEvent) => e.preventDefault();
    const noDrag = (e: DragEvent) => e.preventDefault();
    const beforePrint = (e: Event) => { if (!allowPrint) e.preventDefault(); };
    window.addEventListener("keydown", block, true);
    window.addEventListener("contextmenu", noMenu);
    window.addEventListener("dragstart", noDrag);
    window.addEventListener("beforeprint", beforePrint);
    return () => {
      window.removeEventListener("keydown", block, true);
      window.removeEventListener("contextmenu", noMenu);
      window.removeEventListener("dragstart", noDrag);
      window.removeEventListener("beforeprint", beforePrint);
    };
  }, [allowPrint]);
  return (
    <div className="content-protected relative" style={{ userSelect: "none", WebkitUserSelect: "none" }}>
      {children}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[5] overflow-hidden" style={{ mixBlendMode: "multiply" }}>
        <div className="absolute inset-0 flex flex-wrap content-center items-center justify-center gap-12 opacity-[0.10] text-foreground" style={{ transform: "rotate(-25deg) scale(1.4)" }}>
          {Array.from({ length: 40 }).map((_, i) => <span key={i} className="whitespace-nowrap font-display text-xs font-bold tracking-wider">{stamp || "Academia da Enfermagem"}</span>)}
        </div>
      </div>
    </div>
  );
}

function RenewalNotice({ days, expiresAt }: { days: number; expiresAt: string }) {
  const finalDay = days === 1;
  const urgent = days === 3;
  return (
    <div className={`mb-4 rounded-2xl border px-4 py-4 shadow-sm ${finalDay ? "border-red-300 bg-red-50 text-red-950" : urgent ? "border-orange-300 bg-orange-50 text-orange-950" : "border-amber-300 bg-amber-50 text-amber-950"}`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/70">
          {finalDay ? <Clock3 className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-extrabold">
            {days === 5 ? "Faltam 5 dias para o fim da sua assinatura." : finalDay ? "Seu acesso por assinatura termina amanhã." : "Faltam 3 dias para o fim da sua assinatura."}
          </p>
          <p className="mt-1 text-xs leading-5 opacity-90">
            {finalDay
              ? `O assinatura termina em ${CAMPAIGN_FREE_UNTIL_LABEL}. Para continuar com todos os conteúdos e benefícios, faça sua assinatura antes do encerramento.`
              : `Seu acesso por assinatura termina em ${CAMPAIGN_FREE_UNTIL_LABEL}. Você ainda tem acesso completo durante a campanha. Escolha seu plano com antecedência para não interromper seu acesso.`}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Link to="/" className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:opacity-90"><Sparkles className="h-3.5 w-3.5" /> Ver planos e assinar</Link>
            <span className="text-[11px] font-semibold opacity-70">Válido até {new Date(expiresAt).toLocaleDateString("pt-BR")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AppAccessGate({ slug, children, allowPrint = false }: { slug: string; children: ReactNode; allowPrint?: boolean }) {
  const { data, isLoading } = useAppAccess(slug);
  if (isLoading) return <div className="glass mx-auto mt-6 max-w-md rounded-2xl p-6 text-center text-sm text-muted-foreground">Verificando acesso…</div>;
  if (!data?.app) return <div className="glass mx-auto mt-6 max-w-md rounded-2xl p-6 text-center"><p className="text-sm text-muted-foreground">Conteúdo indisponível.</p><Link to="/" className="mt-3 inline-block text-sm font-semibold text-primary hover:underline">Voltar à Loja</Link></div>;
  if (!data.granted) {
    const app = data.app;
    const fromCents = app.price_original_cents ?? null;
    const hasDiscount = fromCents != null && fromCents > app.price_cents;
    return (
      <div className="glass mx-auto mt-6 max-w-lg rounded-2xl border border-gold/40 p-6 text-center">
        <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-foreground/10"><Lock className="h-6 w-6 text-foreground/70" /></div>
        <h2 className="font-display text-xl font-bold">{app.name}</h2>
        <p className="mt-2 text-sm text-muted-foreground">Seu acesso por assinatura terminou. Para continuar tendo acesso aos conteúdos e benefícios, escolha uma assinatura vigente.</p>
        <div className="mt-3 space-y-1">{hasDiscount && <p className="text-sm font-semibold text-muted-foreground line-through">De {formatPriceBRL(fromCents)}</p>}<p className="text-3xl font-extrabold text-foreground">{hasDiscount ? "Por " : ""}{formatPriceBRL(app.price_cents)}</p></div>
        <div className="mt-4 flex flex-col gap-2">
          {isMercadoPagoUrl(app.cakto_checkout_url) ? <a href={app.cakto_checkout_url!} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-1 rounded-xl gold-gradient py-2.5 text-sm font-bold text-foreground"><Sparkles className="h-4 w-4" /> Assinar agora <ExternalLink className="h-3.5 w-3.5" /></a> : <Link to="/" className="inline-flex items-center justify-center rounded-xl gold-gradient py-2.5 text-sm font-bold text-foreground">Ver opções de assinatura</Link>}
          <Link to="/" className="text-sm font-semibold text-primary hover:underline">Voltar à Loja</Link>
        </div>
      </div>
    );
  }
  const left = daysUntil(data.expiresAt);
  const viaAdmin = (data as { viaAdmin?: boolean }).viaAdmin;
  const accessType = (data as { accessType?: string }).accessType;
  const campaignCountdown = !viaAdmin && accessType === "campaign" && left !== null && [5, 3, 1].includes(left);
  return (
    <>
      {viaAdmin && <div className="mb-4 rounded-xl border border-primary/40 bg-primary/10 px-4 py-2 text-sm text-primary">Modo admin — visualização completa. Este conteúdo é pago para alunos.</div>}
      {campaignCountdown && left !== null && <RenewalNotice days={left} expiresAt={data.expiresAt!} />}
      {!viaAdmin && accessType !== "campaign" && left !== null && left <= 30 && <div className="mb-4 rounded-xl border border-amber-400/50 bg-amber-50 px-4 py-2 text-sm text-amber-800">Seu acesso expira em <strong>{left} {left === 1 ? "dia" : "dias"}</strong>. Renove para não perder.</div>}
      <ContentProtection allowPrint={allowPrint}>{children}</ContentProtection>
    </>
  );
}

