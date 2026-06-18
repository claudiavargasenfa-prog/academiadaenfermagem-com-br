import type { Procedimento } from "./index";

export const PROC_SVD_MASC: Procedimento = {
  slug: "svd-masculino",
  titulo: "Sondagem Vesical de Demora (SVD) — Masculino",
  subtitulo: "Cateterismo de Foley em paciente masculino",
  icon: "💧",
  cor: "text-blue-600",
  publico: "Adulto masculino",
  emProducao: true,
  materiais: [
    "Sonda de Foley (geralmente 14–18 Fr)",
    "Bolsa coletora de sistema fechado",
    "Seringa de 10 mL com água destilada estéril",
    "Xilocaína gel 2% (seringa pré-preenchida estéril)",
    "Campo fenestrado estéril, gaze, PVPI ou clorexidina aquosa",
    "Luvas estéreis, máscara",
  ],
  indicacoes: [
    "Retenção urinária aguda",
    "Monitorização rigorosa de diurese",
    "Pré e pós-operatório selecionados",
    "Lesão sacral em contato com urina",
  ],
  contraindicacoes: [
    "Trauma uretral suspeito (sangue no meato — não passar)",
    "Estenose uretral conhecida",
    "Prostatite aguda",
  ],
  complicacoes: [
    "Infecção do trato urinário associada (ITU-AC)",
    "Lesão uretral, falso trajeto",
    "Hematúria, espasmo vesical",
    "Parafimose se prepúcio não recolocado",
  ],
  cenas: [],
  checklist: [
    "Identifiquei o paciente e expliquei o procedimento",
    "Realizei higiene íntima prévia com PVPI ou clorexidina",
    "Calcei luvas estéreis e montei campo fenestrado",
    "Posicionei o pênis em 90° e tracionei suavemente",
    "Instilei xilocaína gel uretral e aguardei 2–3 min",
    "Introduzi a sonda até a bifurcação em Y",
    "Insuflei o balão com água destilada estéril (volume conforme sonda)",
    "Conectei sistema coletor fechado abaixo do nível da bexiga",
    "Recoloquei o prepúcio para prevenir parafimose",
    "Registrei calibre, volume do balão, aspecto da diurese",
  ],
  referencias: [
    "COFEN. Resolução nº 450/2013 — Cateterismo vesical pelo enfermeiro.",
    "ANVISA. Medidas de prevenção de ITU-AC, 2017.",
    "POTTER & PERRY. Fundamentos de Enfermagem, 9ª ed.",
  ],
};
