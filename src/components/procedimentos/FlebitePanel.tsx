import { AlertTriangle, ExternalLink, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import imgG1 from "@/assets/procedimentos/flebite-g1.png.asset.json";
import imgG2 from "@/assets/procedimentos/flebite-g2.png.asset.json";
import imgG3 from "@/assets/procedimentos/flebite-g3.png.asset.json";
import imgG4 from "@/assets/procedimentos/flebite-g4.png.asset.json";

const GRAUS = [
  { g: "0", sinais: "Sítio íntegro, sem sinais clínicos", diag: "Não há sinal de flebite", acao: "Observar evolução", cor: "bg-emerald-50 border-emerald-200 text-emerald-900" },
  { g: "1", sinais: "Eritema no local da inserção com ou sem dor", diag: "Início de flebite", acao: "Observar e avaliar com maior frequência", cor: "bg-lime-50 border-lime-200 text-lime-900" },
  { g: "2", sinais: "Dor no local da inserção com eritema e/ou edema", diag: "Flebite instalada", acao: "Retirar o dispositivo e notificar", cor: "bg-amber-50 border-amber-200 text-amber-900" },
  { g: "3", sinais: "Dor no local da inserção com eritema, edema e cordão venoso palpável", diag: "Flebite moderada", acao: "Retirar, notificar e aplicar compressas", cor: "bg-orange-50 border-orange-200 text-orange-900" },
  { g: "4", sinais: "Dor no local da inserção com eritema, edema, cordão venoso > 1 cm e drenagem purulenta", diag: "Flebite grave", acao: "Retirar, notificar, tratar local e comunicar médico", cor: "bg-rose-50 border-rose-200 text-rose-900" },
];

const TIPOS = [
  { t: "Mecânica", d: "Relacionada ao tamanho do cateter, local de inserção e fixação inadequada.", cor: "bg-sky-50 border-sky-200 text-sky-900" },
  { t: "Química", d: "Relacionada ao pH e osmolaridade da solução ou medicação infundida.", cor: "bg-violet-50 border-violet-200 text-violet-900" },
  { t: "Bacteriana", d: "Relacionada à quebra de técnica asséptica e contaminação do dispositivo.", cor: "bg-amber-50 border-amber-200 text-amber-900" },
];

function Sanfona({
  titulo,
  cor,
  children,
  defaultAberto = false,
}: {
  titulo: string;
  cor: string;
  children: React.ReactNode;
  defaultAberto?: boolean;
}) {
  const [aberto, setAberto] = useState(defaultAberto);

  return (
    <div className={`overflow-hidden rounded-2xl border ${cor} transition-all`}>
      <button
        onClick={() => setAberto(!aberto)}
        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-bold tracking-tight"
      >
        <span className="flex items-center gap-2">
          {aberto ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          {titulo}
        </span>
      </button>
      {aberto && (
        <div className="border-t border-black/5 bg-white/60 px-4 py-4 text-sm leading-relaxed animate-in fade-in slide-in-from-top-1 duration-200">
          {children}
        </div>
      )}
    </div>
  );
}

export function FlebitePanel() {
  return (
    <div className="space-y-3">
      <div className="mb-2 flex items-center justify-between border-b border-foreground/5 pb-2">
        <div>
          <h3 className="font-display text-base font-extrabold text-primary">Graus de Flebite e Condutas</h3>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
            Escala Maddox & Protocolo ANVISA 2025
          </p>
        </div>
        <div className="h-8 w-8 items-center justify-center rounded-full bg-red-50 text-red-600 flex">
          <AlertTriangle className="h-4 w-4" />
        </div>
      </div>

      <Sanfona titulo="Graus de Flebite (Ilustrado)" cor="border-sky-200 bg-sky-50" defaultAberto>
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="rounded-xl bg-white/40 p-3 border border-sky-100 overflow-hidden">
              <h4 className="font-bold text-sky-900 mb-2 text-xs">GRAU 1: Eritema e Dor inicial</h4>
              <img src={imgG1.url} alt="Flebite Grau 1" className="w-full rounded-lg mb-2 shadow-sm border border-sky-200" />
              <p className="text-[11px] leading-snug">
                Presença de eritema (vermelhidão) no local da inserção do cateter, com ou sem dor ao toque.
              </p>
            </div>

            <div className="rounded-xl bg-white/40 p-3 border border-sky-100 overflow-hidden">
              <h4 className="font-bold text-sky-900 mb-2 text-xs">GRAU 2: Dor com Eritema e Edema</h4>
              <img src={imgG2.url} alt="Flebite Grau 2" className="w-full rounded-lg mb-2 shadow-sm border border-sky-200" />
              <p className="text-[11px] leading-snug">
                Aumento da dor, acompanhada de eritema visível e edema (inchaço) na região da punção.
              </p>
            </div>

            <div className="rounded-xl bg-white/40 p-3 border border-sky-100 overflow-hidden">
              <h4 className="font-bold text-sky-900 mb-2 text-xs">GRAU 3: Cordão Venoso Palpável</h4>
              <img src={imgG3.url} alt="Flebite Grau 3" className="w-full rounded-lg mb-2 shadow-sm border border-sky-200" />
              <p className="text-[11px] leading-snug">
                Além da dor, eritema e edema, nota-se a formação de um cordão venoso palpável no trajeto da veia.
              </p>
            </div>

            <div className="rounded-xl bg-white/40 p-3 border border-sky-100 overflow-hidden">
              <h4 className="font-bold text-sky-900 mb-2 text-xs">GRAU 4: Cordão > 1 cm e Secreção</h4>
              <img src={imgG4.url} alt="Flebite Grau 4" className="w-full rounded-lg mb-2 shadow-sm border border-sky-200" />
              <p className="text-[11px] leading-snug">
                Estágio grave com cordão venoso extenso (> 1 cm), dor intensa e presença de secreção purulenta (pus).
              </p>
            </div>
          </div>
        </div>
      </Sanfona>

      <Sanfona titulo="Escala de Maddox e Condutas" cor="border-rose-200 bg-rose-50">
        <div className="space-y-2">
          {GRAUS.map((g) => (
            <div key={g.g} className={`flex gap-3 rounded-xl border p-3 ${g.cor}`}>
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/80 text-sm font-extrabold">
                {g.g}
              </div>
              <div className="min-w-0 text-[11px] leading-tight">
                <p className="font-bold">{g.sinais}</p>
                <p className="opacity-80 italic">{g.diag}</p>
                <p className="mt-1 font-bold text-black/70">Ação: {g.acao}</p>
              </div>
            </div>
          ))}
        </div>
      </Sanfona>

      <Sanfona titulo="Tipos de Flebite" cor="border-violet-200 bg-violet-50">
        <div className="grid gap-2">
          {TIPOS.map((t) => (
            <div key={t.t} className={`rounded-xl border p-3 ${t.cor}`}>
              <p className="text-xs font-bold uppercase">{t.t}</p>
              <p className="mt-1 text-[11px] leading-relaxed">{t.d}</p>
            </div>
          ))}
        </div>
      </Sanfona>

      <div className="rounded-xl bg-amber-50 p-3 border border-amber-200">
        <p className="text-[10px] text-amber-900 leading-tight">
          <strong>Lembre-se:</strong> A notificação de eventos adversos deve ser feita a partir do Grau 2. 
          Siga sempre o protocolo da sua instituição.
        </p>
      </div>
    </div>
  );
}