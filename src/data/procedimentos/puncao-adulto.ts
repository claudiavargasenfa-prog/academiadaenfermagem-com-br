import type { Procedimento } from "./index";

export const PROC_PUNCAO_ADULTO: Procedimento = {
  slug: "puncao-venosa-adulto",
  titulo: "Punção Venosa Periférica — Adulto",
  subtitulo: "Acesso venoso periférico em membro superior",
  icon: "💉",
  cor: "text-red-600",
  publico: "Adulto",
  
  materiais: [
    "Cateter venoso periférico (Jelco/Abbocath) — calibre conforme indicação (geralmente 18–22 G)",
    "Garrote",
    "Antisséptico (clorexidina alcoólica 0,5% preferencial)",
    "Algodão ou gaze",
    "Polifix/extensor, conector valvulado, salinização com SF 0,9%",
    "Filme transparente estéril para fixação, esparadrapo",
    "Luvas de procedimento",
  ],
  indicacoes: [
    "Administração de medicamentos e fluidos endovenosos",
    "Hemoterapia",
    "Coleta de sangue (eventual)",
  ],
  contraindicacoes: [
    "Membro com fístula arteriovenosa, mastectomia ipsilateral, paresia/plegia, infecção local",
    "Áreas de flexão como primeira escolha",
  ],
  complicacoes: [
    "Flebite mecânica, química ou infecciosa",
    "Infiltração / extravasamento",
    "Hematoma",
    "Infecção de corrente sanguínea associada ao cateter",
  ],
  cenas: [],
  checklist: [
    "Higienizei as mãos e calcei luvas",
    "Selecionei veia adequada (preferir antebraço, distal para proximal)",
    "Apliquei garrote 10–15 cm acima do sítio",
    "Realizei antissepsia em movimento único, deixando secar",
    "Puncionei com bisel para cima em ângulo 15–30°",
    "Observei refluxo, recuei a agulha e progredi o cateter",
    "Soltei o garrote, conectei extensor e salinizei",
    "Fixei com filme transparente e datei",
    "Registrei calibre, sítio, número de tentativas e intercorrências",
  ],
  referencias: [
    "INS. Infusion Therapy Standards of Practice, 2021.",
    "ANVISA. Medidas de prevenção de infecção relacionada à assistência à saúde, 2017.",
    "COFEN. Resolução nº 258/2001 — Cateterismo venoso central por enfermeiro (referência correlata).",
  ],
};
