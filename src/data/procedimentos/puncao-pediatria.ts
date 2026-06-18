import type { Procedimento } from "./index";

export const PROC_PUNCAO_PEDIATRIA: Procedimento = {
  slug: "puncao-venosa-pediatria",
  titulo: "Punção Venosa Periférica — RN, Lactente e Pediatria",
  subtitulo: "Particularidades do acesso venoso na faixa pediátrica",
  icon: "👶",
  cor: "text-pink-500",
  publico: "RN / Lactente / Pré-escolar / Escolar",
  emProducao: true,
  materiais: [
    "Cateter 24 G (RN/lactente), 22–24 G (pré-escolar), 20–22 G (escolar)",
    "Garrote infantil ou compressão manual em RN",
    "Clorexidina alcoólica 0,5% (acima de 2 meses); clorexidina aquosa em RN < 2 meses",
    "Estabilização da extremidade (tala/luva acolchoada)",
    "Sacarose 24% oral em RN (medida não-farmacológica de analgesia)",
    "Transiluminador / ultrassom point-of-care quando disponível",
  ],
  indicacoes: [
    "Hidratação venosa, antibioticoterapia, transfusão",
    "Coleta de amostras pontuais",
  ],
  contraindicacoes: [
    "Membros com infecção local ou comprometimento circulatório",
    "Áreas de flexão como primeira escolha (preferir dorso da mão, antebraço, couro cabeludo em lactentes < 6 meses, dorso do pé)",
  ],
  complicacoes: [
    "Maior risco de infiltração e extravasamento — vigiar a cada 1h",
    "Lesão tecidual grave por extravasamento de droga vesicante",
    "Hipotermia em RN durante o procedimento",
  ],
  cenas: [],
  checklist: [
    "Identifiquei a criança com 2 identificadores e expliquei conforme idade",
    "Promovi conforto: presença dos pais, sacarose 24% oral em RN, contato pele a pele se possível",
    "Escolhi sítio adequado à faixa etária (dorso da mão, antebraço, couro cabeludo em lactente, dorso do pé)",
    "Usei garrote leve ou compressão manual — evitei isquemia prolongada",
    "Antissepsia adequada à idade (aquosa < 2 meses, alcoólica > 2 meses)",
    "Puncionei com ângulo mais raso (10–20°) por veias mais superficiais",
    "Imobilizei a extremidade após fixação",
    "Vigio sítio a cada 1h por sinais de infiltração",
  ],
  referencias: [
    "SBP. Tratado de Pediatria, 5ª ed.",
    "INS. Infusion Therapy Standards of Practice, 2021.",
    "Ministério da Saúde. Atenção à Saúde do Recém-Nascido.",
  ],
};
