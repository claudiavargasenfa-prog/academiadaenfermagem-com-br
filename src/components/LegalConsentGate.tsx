import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ShieldCheck, AlertTriangle } from "lucide-react";

import {
  LEGAL_DISCLAIMER_SHORT,
  LEGAL_DOC_VERSION,
  hasAcceptedLegalLocally,
  recordLegalAcceptance,
} from "@/lib/legal";

/** Aviso curto para exibir em destaque em cada módulo clínico. */
export function LegalNotice({ className = "" }: { className?: string }) {
  return (
    <div
      className={`mb-4 flex items-start gap-2 rounded-2xl border border-emerald-900/20 bg-emerald-50/70 px-4 py-3 ${className}`}
    >
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-900" />
      <p className="text-[11px] leading-relaxed text-emerald-950">
        <strong>Aviso Legal:</strong> {LEGAL_DISCLAIMER_SHORT}{" "}
        <Link to="/legal" className="font-bold underline">
          Ver documentos legais
        </Link>
      </p>
    </div>
  );
}

/** Modal obrigatório de primeiro acesso, com registro eletrônico do aceite. */
export function LegalConsentGate() {
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!hasAcceptedLegalLocally()) setShow(true);
  }, []);

  if (!show) return null;

  async function accept() {
    setBusy(true);
    await recordLegalAcceptance("primeiro_acesso");
    setBusy(false);
    setShow(false);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-emerald-950/70 p-3 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-lg rounded-3xl border border-gold/40 bg-background p-5 shadow-2xl">
        <div className="mb-3 flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-900 text-gold">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-gold">
              Documentos legais · versão {LEGAL_DOC_VERSION}
            </p>
            <h2 className="font-display text-lg font-extrabold text-foreground">
              Antes de começar, leia e aceite
            </h2>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          A <strong>Academia da Enfermagem</strong> é uma ferramenta técnico-científica de{" "}
          <strong>apoio à decisão clínica</strong> para estudantes e profissionais de enfermagem.
          Ela <strong>não substitui</strong> o julgamento técnico do profissional, o exame clínico
          do paciente, as fontes oficiais (COFEN, COREN, Ministério da Saúde, ANVISA) nem os
          protocolos da sua instituição. A responsabilidade pela conduta clínica é exclusivamente do
          profissional assistente.
        </p>

        <p className="mt-3 rounded-2xl bg-muted/60 p-3 text-xs text-muted-foreground">
          Ao clicar em “Li e aceito”, o sistema registra eletronicamente a data, a hora exata
          (timestamp), a versão dos Termos de Uso e da Política de Privacidade aceitos e o
          identificador do seu usuário/dispositivo, como prova digital do consentimento.
        </p>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={accept}
            disabled={busy}
            className="flex-1 rounded-xl bg-emerald-900 py-3 text-sm font-extrabold text-white shadow hover:opacity-90 disabled:opacity-60"
          >
            {busy ? "Registrando aceite…" : "Li e aceito os Termos e a Política de Privacidade"}
          </button>
          <Link
            to="/legal"
            className="rounded-xl border border-emerald-900/30 px-4 py-3 text-center text-sm font-bold text-emerald-900 hover:bg-emerald-50"
          >
            Ler documentos
          </Link>
        </div>
      </div>
    </div>
  );
}
