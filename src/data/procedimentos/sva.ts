import type { Procedimento } from "./index";

export const PROC_SVA: Procedimento = {
  slug: "sva",
  titulo: "Sondagem Vesical de Alívio (SVA)",
  subtitulo: "Cateterismo intermitente — esvaziamento único",
  icon: "💧",
  cor: "text-cyan-600",
  publico: "Adulto",
  emProducao: true,
  materiais: [
    "Sonda uretral de alívio (Nelaton, sem balão)",
    "Xilocaína gel 2% estéril",
    "Campo fenestrado, gaze, PVPI ou clorexidina aquosa",
    "Luvas estéreis, máscara",
    "Cuba de drenagem ou frasco para volume",
  ],
  indicacoes: [
    "Retenção urinária aguda quando não há indicação de SVD",
    "Coleta de urina estéril",
    "Mensuração de resíduo pós-miccional",
    "Bexiga neurogênica em programa de cateterismo intermitente",
  ],
  contraindicacoes: [
    "Trauma uretral suspeito",
    "Estenose uretral conhecida",
  ],
  complicacoes: [
    "ITU (menor risco que SVD)",
    "Lesão uretral, hematúria",
  ],
  cenas: [],
  checklist: [
    "Higienizei mãos e organizei material em técnica estéril",
    "Higiene íntima e antissepsia ampla",
    "Calcei luvas estéreis e montei campo",
    "Lubrifiquei a sonda com xilocaína gel",
    "Introduzi a sonda até retorno de urina",
    "Aguardei drenagem completa antes de retirar",
    "Retirei a sonda suavemente",
    "Registrei volume drenado e aspecto",
  ],
  referencias: [
    "COFEN. Resolução nº 450/2013.",
    "POTTER & PERRY. Fundamentos de Enfermagem.",
  ],
};
