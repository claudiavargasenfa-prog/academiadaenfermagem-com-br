import { useEffect, useState } from "react";
import type { SinaisVitais } from "@/data/simulacoes-reais";

function nowHHMM(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function MonitorMultiparametrico({ vitais }: { vitais: SinaisVitais }) {
  const [hora, setHora] = useState(nowHHMM);
  useEffect(() => {
    const t = setInterval(() => setHora(nowHHMM()), 30_000);
    return () => clearInterval(t);
  }, []);

  // Duração do ciclo de ECG: mais lento (multiplicado por 2.2 para visualização tranquila)
  const cycleSec = Math.max(1.2, (60 / Math.max(30, vitais.fc)) * 2.2);

  return (
    <div className="rounded-2xl border border-emerald-900/60 bg-black p-4 shadow-inner">
      <div className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-emerald-300/80">
        <span>Monitor Multiparamétrico</span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
          REC
        </span>
      </div>

      {/* ECG */}
      <div className="relative mb-3 h-20 overflow-hidden rounded bg-black">
        <svg
          viewBox="0 0 200 60"
          preserveAspectRatio="none"
          className="absolute inset-y-0 h-full"
          style={{
            width: "200%",
            animation: `ecg-scroll ${cycleSec}s linear infinite`,
          }}
        >
          {[0, 100].map((offset) => (
            <polyline
              key={offset}
              fill="none"
              stroke="#34d399"
              strokeWidth="1.2"
              points={`${offset},30 ${offset + 10},30 ${offset + 18},30 ${offset + 22},28 ${offset + 26},32 ${offset + 30},10 ${offset + 34},50 ${offset + 38},28 ${offset + 42},30 ${offset + 60},30 ${offset + 70},30 ${offset + 100},30`}
            />
          ))}
        </svg>
        <style>{`@keyframes ecg-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
      </div>

      {/* Grid de leituras */}
      <div className="grid grid-cols-3 gap-2 font-mono">
        <Leitura label="PA" valor={`${vitais.paSistolica}/${vitais.paDiastolica}`} unidade="mmHg" />
        <Leitura label="FC" valor={String(vitais.fc)} unidade="bpm" />
        <Leitura label="FR" valor={String(vitais.fr)} unidade="irpm" />
        <Leitura label="TEMP" valor={vitais.temp.toFixed(1)} unidade="°C" />
        <Leitura label="SpO₂" valor={`${vitais.spo2}`} unidade="%" />
        <Leitura label="HORA" valor={hora} unidade="" />
      </div>
    </div>
  );
}

function Leitura({ label, valor, unidade }: { label: string; valor: string; unidade: string }) {
  return (
    <div className="rounded border border-emerald-900/40 bg-black/60 px-2 py-2">
      <div className="text-[10px] uppercase tracking-wider text-emerald-300/60">{label}</div>
      <div className="flex items-baseline gap-1 text-emerald-300">
        <span className="text-3xl font-bold leading-none">{valor}</span>
        {unidade && <span className="text-[10px] opacity-70">{unidade}</span>}
      </div>
    </div>
  );
}
