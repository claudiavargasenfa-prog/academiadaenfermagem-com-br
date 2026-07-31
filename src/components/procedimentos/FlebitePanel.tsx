import { AlertTriangle } from "lucide-react";

const GRAUS = [
  { g: "0", sinais: "Sítio íntegro, sem sinais clínicos", diag: "Não há sinal de flebite", acao: "Observar evolução", cor: "bg-emerald-50 border-emerald-200 text-emerald-900" },
  { g: "1", sinais: "Dor OU rubor (1 critério já conta)", diag: "Possível início de flebite", acao: "Manter cuidados conforme protocolo", cor: "bg-lime-50 border-lime-200 text-lime-900" },
  { g: "2", sinais: "Dor, rubor e edema (2 critérios presentes)", diag: "Início da flebite", acao: "Monitorar com frequência, considerar troca e notificar evento adverso", cor: "bg-amber-50 border-amber-200 text-amber-900" },
  { g: "3", sinais: "Dor, rubor e edema (todos presentes)", diag: "Flebite em evolução", acao: "Remover, registrar, nova punção e notificar evento adverso", cor: "bg-orange-50 border-orange-200 text-orange-900" },
  { g: "4", sinais: "Dor intensa, rubor, edema e cordão venoso palpável", diag: "Início de tromboflebite", acao: "Remover, registrar, nova punção, iniciar tratamento local e notificar", cor: "bg-rose-50 border-rose-200 text-rose-900" },
  { g: "5", sinais: "Dor, rubor, edema, cordão venoso e drenagem purulenta", diag: "Tromboflebite em evolução", acao: "Remover, registrar, nova punção, tratar local, comunicar o médico e notificar", cor: "bg-red-50 border-red-300 text-red-900" },
];

const TIPOS = [
  { t: "Mecânica", d: "Inserção traumática do vaso ou calibre do dispositivo inadequado para a veia escolhida.", cor: "from-sky-50 to-sky-100 border-sky-200" },
  { t: "Química", d: "Agressividade dos componentes da medicação (pH, osmolaridade) sobre o endotélio.", cor: "from-violet-50 to-violet-100 border-violet-200" },
  { t: "Bacteriana", d: "Tempo de permanência do dispositivo, quebra de técnica asséptica, curativo úmido ou sujo.", cor: "from-amber-50 to-amber-100 border-amber-200" },
  { t: "Pós-infusional", d: "Inflamação da veia sem cateter in situ, entre 48 e 96 h após a retirada do dispositivo.", cor: "from-teal-50 to-teal-100 border-teal-200" },
];

const PREVENCAO = [
  "Higienizar as mãos antes e após o preparo de medicações e a cada manipulação do dispositivo",
  "Técnica asséptica na inserção e em toda manipulação do cateter",
  "“Scrub the hub”: friccionar conector/dânula com antisséptico alcoólico por 15 segundos antes de cada infusão",
  "Flushing com 10 mL de SF 0,9% antes e após cada medicação, usando seringas de 10 ou 20 mL",
  "Turbilhonamento ao final da infusão, mantendo ~1 mm residual para evitar obstrução",
  "Manter pressão positiva: clampear o polifix antes do fim da infusão e desacoplar a seringa em seguida",
  "Fixação correta, limpa e seca, permitindo inspeção contínua do sítio",
  "Selecionar o dispositivo conforme a terapia prescrita e o calibre do vaso",
  "Conhecer diluente, volume e tempo de infusão de cada medicamento",
];

const AVALIACAO = [
  "Higienizar as mãos e separar todo o material da avaliação",
  "Higienizar as mãos novamente antes de adentrar o leito",
  "Inspecionar óstio e trajeto venoso em busca de sinais flogísticos e cordão fibroso (película transparente permite ver sem retirar)",
  "Com fita adesiva/esparadrapo: remover com gaze úmida, sem traumatizar a pele nem tracionar o cateter; refazer o curativo após a avaliação",
  "Descartar materiais e higienizar as mãos",
  "Registrar no prontuário a avaliação de flebite e a conduta adotada",
];

function Bloco({
  titulo,
  cor,
  children,
  aberto,
}: {
  titulo: string;
  cor: string;
  children: React.ReactNode;
  aberto?: boolean;
}) {
  return (
    <details open={aberto} className={`group overflow-hidden rounded-2xl border ${cor}`}>
      <summary className="cursor-pointer list-none px-4 py-3 text-sm font-bold tracking-tight marker:hidden">
        <span className="mr-2 inline-block transition group-open:rotate-90">▸</span>
        {titulo}
      </summary>
      <div className="border-t border-black/5 bg-white/60 px-4 py-3 text-sm leading-relaxed">{children}</div>
    </details>
  );
}

export function FlebitePanel() {
  return (
    <div className="space-y-2">
      <div className="mb-1">
        <h3 className="font-display text-base font-extrabold">Identificação e Manejo da Flebite</h3>
        <p className="text-xs text-muted-foreground">
          Complemento da punção venosa periférica — baseado no POP-ENF-0002 (SUBHUE/SMS-Rio), INS Brasil e
          Parecer COREN-SP nº 007/2023.
        </p>
      </div>

      <Bloco titulo="O que é flebite" cor="border-sky-200 bg-sky-50" aberto>
        <p>
          Inflamação aguda da veia, com edema, dor, eritema ao redor da punção e “cordão” palpável ao longo
          do trajeto venoso. É um dos principais eventos adversos da terapia intravenosa — a INS Brasil
          considera aceitável um índice institucional de <strong>5% ou menos</strong>.
        </p>
      </Bloco>

      <Bloco titulo="Classificação quanto ao tipo" cor="border-violet-200 bg-violet-50">
        <div className="grid gap-2 sm:grid-cols-2">
          {TIPOS.map((t) => (
            <div key={t.t} className={`rounded-xl border bg-gradient-to-br p-3 ${t.cor}`}>
              <p className="text-xs font-bold uppercase tracking-wide">{t.t}</p>
              <p className="mt-1 text-xs leading-relaxed text-foreground/80">{t.d}</p>
            </div>
          ))}
        </div>
      </Bloco>

      <Bloco titulo="Escala de Maddox — graus, diagnóstico e conduta" cor="border-rose-200 bg-rose-50">
        <div className="space-y-2">
          {GRAUS.map((g) => (
            <div key={g.g} className={`flex gap-3 rounded-xl border p-3 ${g.cor}`}>
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/80 text-sm font-extrabold">
                {g.g}
              </div>
              <div className="min-w-0 text-xs leading-relaxed">
                <p className="font-semibold">{g.sinais}</p>
                <p className="opacity-80">Diagnóstico: {g.diag}</p>
                <p className="mt-1 font-bold">Ação: {g.acao}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[11px] text-muted-foreground">
          Graus clínicos correlatos: 1 rubor isolado · 2 dois sinais · 3 acrescenta cordão fibroso palpável ·
          4 endurecimento e cordão ≥ 1 cm com drenagem purulenta.
        </p>
      </Bloco>

      <Bloco titulo="Ações preventivas (boas práticas da terapia infusional)" cor="border-emerald-200 bg-emerald-50">
        <ul className="space-y-1">
          {PREVENCAO.map((p, i) => (
            <li key={i} className="flex items-start gap-2 text-xs">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </Bloco>

      <Bloco titulo="Processo de avaliação diária do sítio" cor="border-teal-200 bg-teal-50">
        <ol className="space-y-1 pl-4 text-xs">
          {AVALIACAO.map((a, i) => (
            <li key={i} className="list-decimal">
              {a}
            </li>
          ))}
        </ol>
        <div className="mt-3 rounded-xl border border-amber-300/60 bg-amber-50 px-3 py-2 text-[12px] text-amber-900">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>
              Filme transparente: trocar em caso de sujidade, umidade ou perda de aderência. Fita adesiva:
              usar tira nova a cada avaliação. Rodízio de punção em até <strong>96 horas</strong> (em
              crianças, avaliar diariamente e individualizar).
            </span>
          </div>
        </div>
      </Bloco>

      <Bloco titulo="Definições essenciais" cor="border-indigo-200 bg-indigo-50">
        <dl className="space-y-2 text-xs">
          <div>
            <dt className="font-bold">Scrub the hub</dt>
            <dd>Friccionar canhões, dânulas e conectores com antisséptico alcoólico por 15 segundos antes de infundir.</dd>
          </div>
          <div>
            <dt className="font-bold">Dânula (“torneirinha”)</dt>
            <dd>Dispositivo de 3 vias que permite controlar o fluxo e administrar soluções de forma simultânea ou alternada.</dd>
          </div>
          <div>
            <dt className="font-bold">Fluxo turbilhonar</dt>
            <dd>SF 0,9% em bolus com movimento adequado do êmbolo, deixando ~1 mm residual; usar apenas seringas de 10 ou 20 mL.</dd>
          </div>
        </dl>
      </Bloco>

      <Bloco titulo="Responsabilidades (COREN-SP nº 007/2023)" cor="border-slate-200 bg-slate-50">
        <p className="text-xs">
          <strong>Enfermeiro:</strong> gestão do cuidado na terapia intravenosa — avaliação clínica, escolha do
          dispositivo e do sítio, tecnologia de assertividade da punção, forma de administração
          (reconstituição/diluição) e monitoramento dos efeitos do fármaco.
        </p>
        <p className="mt-2 text-xs">
          <strong>Técnico e auxiliar:</strong> manutenção dos dispositivos (punção, fixação, permeabilização e
          observação) e infusão do fármaco, sempre com base na prescrição de enfermagem e no protocolo
          institucional.
        </p>
        <p className="mt-2 text-xs">
          Notificação de evento adverso é obrigatória a partir do grau 2 da escala, com registro em prontuário.
        </p>
      </Bloco>

      <Bloco titulo="Referências" cor="border-stone-200 bg-stone-50">
        <ol className="space-y-1 pl-4 text-[11px] text-foreground/70">
          <li className="list-decimal">SMS-Rio/SUBHUE. POP-ENF-0002 — Identificação e manejo da flebite, rev. 2025.</li>
          <li className="list-decimal">INS Brasil. Diretrizes práticas para a terapia infusional, 3ª ed., 2018.</li>
          <li className="list-decimal">Infusion Therapy Standards of Practice, 9th ed., 2024.</li>
          <li className="list-decimal">Urbanetto JS et al. Incidência de flebite e flebite pós-infusional em adultos hospitalizados. Rev Gaúcha Enferm, 2017.</li>
          <li className="list-decimal">Danski MTR et al. Complicações relacionadas ao uso do cateter venoso periférico. Acta Paul Enferm, 2016.</li>
          <li className="list-decimal">Parecer COREN-SP nº 007/2023 — Atuação da equipe de enfermagem na terapia intravenosa.</li>
        </ol>
      </Bloco>

      <p className="text-center text-[11px] text-muted-foreground">
        Material de apoio: sempre siga o POP vigente da sua instituição.
      </p>
    </div>
  );
}
