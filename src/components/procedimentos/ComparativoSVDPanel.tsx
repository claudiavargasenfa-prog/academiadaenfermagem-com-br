import imgComparativo from "@/assets/procedimentos/svd-comparativo.jpg";

const LINHAS: { item: string; fem: string; masc: string }[] = [
  { item: "Comprimento da uretra", fem: "3 a 5 cm, retilínea", masc: "18 a 22 cm, com 2 curvaturas" },
  { item: "Posicionamento", fem: "Ginecológica (joelhos fletidos e afastados)", masc: "Decúbito dorsal, pernas levemente afastadas" },
  { item: "Anestésico uretral", fem: "Lubrificação da sonda com gel 2%", masc: "Instilação de 10 a 20 mL de gel 2% + 2 a 5 min de espera" },
  { item: "Calibre usual", fem: "12 a 16 Fr", masc: "14 a 18 Fr (3 vias se irrigação)" },
  { item: "Antissepsia", fem: "Movimentos únicos de cima para baixo (frente → trás)", masc: "Prepúcio retraído, movimentos circulares do meato para a periferia" },
  { item: "Profundidade de introdução", fem: "5 a 7 cm até refluxo + 2 a 3 cm", masc: "18 a 22 cm até refluxo, avançar até a bifurcação em Y" },
  { item: "Ponto de resistência", fem: "Raro", masc: "Esfíncter externo e uretra prostática — abaixar o pênis para 45–60°" },
  { item: "Fixação", fem: "Face interna da coxa, sem tração", masc: "Abdome inferior ou face lateral da coxa, sem tração" },
  { item: "Erro mais comum", fem: "Sondar a vagina (trocar por sonda nova)", masc: "Forçar contra resistência → falso trajeto" },
  { item: "Complicação específica", fem: "Contaminação por proximidade anal", masc: "Parafimose se o prepúcio não for recolocado" },
];

export function ComparativoSVDPanel() {
  return (
    <div>
      <h3 className="mb-1 font-display text-base font-extrabold">
        Comparativo: cateterismo vesical no homem e na mulher
      </h3>
      <p className="mb-3 text-xs text-muted-foreground">
        As diferenças anatômicas determinam o calibre, a profundidade e o risco de cada técnica.
      </p>

      <img
        src={imgComparativo}
        alt="Ilustração comparativa em corte sagital do cateterismo vesical feminino e masculino"
        loading="lazy"
        width={1264}
        height={848}
        className="mb-3 w-full rounded-2xl border border-sky-100 bg-white object-contain"
      />

      <div className="overflow-x-auto rounded-2xl border border-sky-100">
        <table className="w-full min-w-[560px] text-left text-xs">
          <thead className="bg-sky-50/80">
            <tr>
              <th className="px-3 py-2 font-semibold uppercase tracking-wide text-sky-900">Aspecto</th>
              <th className="px-3 py-2 font-semibold uppercase tracking-wide text-pink-700">Feminino</th>
              <th className="px-3 py-2 font-semibold uppercase tracking-wide text-blue-700">Masculino</th>
            </tr>
          </thead>
          <tbody>
            {LINHAS.map((l, i) => (
              <tr key={l.item} className={i % 2 ? "bg-white" : "bg-sky-50/30"}>
                <td className="px-3 py-2 font-semibold text-foreground/80">{l.item}</td>
                <td className="px-3 py-2 leading-relaxed">{l.fem}</td>
                <td className="px-3 py-2 leading-relaxed">{l.masc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 grid gap-2 md:grid-cols-2">
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-3">
          <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-emerald-800">
            Bundle de manutenção
          </p>
          <ul className="space-y-1 text-xs leading-relaxed text-emerald-950/80">
            <li>• Sistema fechado sempre — nunca desconectar para medir diurese</li>
            <li>• Bolsa abaixo do nível da bexiga e fora do chão</li>
            <li>• Higiene íntima diária com água e sabão (sem antisséptico de rotina)</li>
            <li>• Circuito sem dobras, sem tração e com fixador adesivo</li>
            <li>• Reavaliar diariamente a indicação e retirar o mais precoce possível</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-red-100 bg-red-50/60 p-3">
          <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-red-800">
            Sinais de alerta (parar e comunicar)
          </p>
          <ul className="space-y-1 text-xs leading-relaxed text-red-950/80">
            <li>• Sangue no meato ou hematoma perineal antes de sondar</li>
            <li>• Resistência mantida, dor intensa ou sangramento na introdução</li>
            <li>• Ausência de refluxo de urina — não insuflar o balonete</li>
            <li>• Ausência de diurese, bexiga palpável ou bypass ao redor da sonda</li>
            <li>• Febre, urina turva/fétida ou dor suprapúbica após a inserção</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
