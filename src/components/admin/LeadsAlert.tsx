import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Lead = { id: string; nome: string; whatsapp: string; perfil: string | null; created_at: string };

function plim() {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    [880, 1320].forEach((f, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.frequency.value = f;
      const t = ctx.currentTime + i * 0.18;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.4, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
      o.connect(g).connect(ctx.destination);
      o.start(t);
      o.stop(t + 0.55);
    });
  } catch {
    /* sem áudio */
  }
}

export function LeadsAlert() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [som, setSom] = useState(false);
  const lastSeen = useRef<string | null>(null);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      const { data } = await supabase
        .from("manual_leads")
        .select("id,nome,whatsapp,perfil,created_at")
        .order("created_at", { ascending: false })
        .limit(5);
      if (!alive || !data) return;
      const top = data[0]?.created_at ?? null;
      if (lastSeen.current && top && top > lastSeen.current && som) plim();
      if (top) lastSeen.current = top;
      setLeads(data as Lead[]);
    };
    load();
    const id = setInterval(load, 15000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [som]);

  const wa = (l: Lead) =>
    `https://wa.me/55${l.whatsapp.replace(/\D/g, "").replace(/^55/, "")}?text=${encodeURIComponent(
      `Olá ${l.nome.split(" ")[0]}! Aqui é da ADEC. Vi que você pegou o Manual de Sobrevivência no Estágio. Posso te ajudar?`,
    )}`;

  return (
    <div className="mb-4 rounded-xl border border-border bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-bold">🔔 Novos contatos do Manual</h2>
        <button
          type="button"
          onClick={() => {
            setSom((s) => !s);
            if (!som) plim();
          }}
          className="rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground"
        >
          {som ? "Aviso sonoro ligado ✓" : "Ligar aviso sonoro"}
        </button>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        Com o aviso ligado e esta página aberta, toca um "plim" quando alguém se cadastrar.
      </p>
      <ul className="mt-3 space-y-2 text-sm">
        {leads.length === 0 && <li className="text-muted-foreground">Nenhum contato ainda.</li>}
        {leads.map((l) => (
          <li key={l.id} className="flex flex-wrap items-center justify-between gap-2">
            <span>
              <strong>{l.nome}</strong> · {l.perfil ?? ""} ·{" "}
              {new Date(l.created_at).toLocaleString("pt-BR")}
            </span>
            <a href={wa(l)} target="_blank" rel="noreferrer" className="rounded-lg bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
              Chamar no WhatsApp
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
