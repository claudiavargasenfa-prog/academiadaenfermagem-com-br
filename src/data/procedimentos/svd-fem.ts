import type { Procedimento } from "./index";

export const PROC_SVD_FEM: Procedimento = {
  slug: "svd-feminino",
  titulo: "Sondagem Vesical de Demora (SVD) — Feminino",
  subtitulo: "Cateterismo de Foley em paciente feminino",
  icon: "💧",
  cor: "text-pink-600",
  publico: "Adulto feminino",
  emProducao: true,
  materiais: [
    "Sonda de Foley (12–16 Fr)",
    "Bolsa coletora de sistema fechado",
    "Seringa de 10 mL com água destilada estéril",
    "Xilocaína gel 2% estéril",
    "Campo fenestrado, gaze, PVPI ou clorexidina aquosa",
    "Luvas estéreis, máscara",
  ],
  indicacoes: [
    "Retenção urinária",
    "Controle rigoroso de diurese (UTI, choque)",
    "Pós-operatório selecionado",
    "Lesão sacral em contato com urina",
  ],
  contraindicacoes: [
    "Trauma uretral suspeito",
    "Infecção genital ativa (relativa)",
  ],
  complicacoes: [
    "ITU-AC",
    "Lesão uretral",
    "Sondagem inadvertida da vagina (recomeçar com nova sonda)",
  ],
  cenas: [],
  checklist: [
    "Posicionei a paciente em decúbito dorsal com pernas fletidas (litotomia)",
    "Realizei higiene íntima da frente para trás",
    "Calcei luvas estéreis e montei campo",
    "Identifiquei o meato uretral com afastamento dos pequenos lábios",
    "Antissepsia em movimento único de cima para baixo",
    "Introduzi sonda lubrificada até retorno de urina + 2–3 cm",
    "Insuflei o balão e conectei sistema coletor",
    "Registrei calibre, volume e aspecto da diurese",
  ],
  referencias: [
    "COFEN. Resolução nº 450/2013.",
    "ANVISA. Prevenção de ITU-AC, 2017.",
  ],
};
