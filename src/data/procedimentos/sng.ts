import type { Procedimento } from "./index";
import img01 from "@/assets/procedimentos/sng-01-materiais.jpg";
import img02 from "@/assets/procedimentos/sng-02-epi.jpg";
import img03 from "@/assets/procedimentos/sng-03-posicao.jpg";
import img04 from "@/assets/procedimentos/sng-04-medicao.jpg";
import img05 from "@/assets/procedimentos/sng-05-lubrificacao.jpg";
import img06 from "@/assets/procedimentos/sng-06-introducao.jpg";
import img07 from "@/assets/procedimentos/sng-07-confirmacao.jpg";
import img08 from "@/assets/procedimentos/sng-08-fixacao.jpg";

export const PROC_SNG: Procedimento = {
  slug: "sng",
  titulo: "Sondagem Nasogástrica (SNG/SNE)",
  subtitulo: "Passagem de sonda Levine — adulto",
  icon: "🩺",
  cor: "text-sky-600",
  publico: "Adulto",
  materiais: [
    "Sonda nasogástrica Levine (calibre 14–18 Fr para adulto)",
    "Xilocaína gel 2% (lubrificante)",
    "Seringa de 20 mL com bico cônico",
    "Estetoscópio",
    "Luvas de procedimento e máscara cirúrgica",
    "Gaze, esparadrapo ou fixador adesivo próprio",
    "Copo com água e canudo (se paciente consciente)",
    "Saco coletor / frasco de drenagem se necessário",
  ],
  indicacoes: [
    "Descompressão gástrica (íleo paralítico, obstrução)",
    "Lavagem gástrica (intoxicações)",
    "Administração de dieta enteral de curta duração",
    "Coleta de conteúdo gástrico para análise",
  ],
  contraindicacoes: [
    "Trauma cranioencefálico grave ou fratura de base de crânio (risco de passagem intracraniana — preferir via oral)",
    "Cirurgia recente de esôfago ou estômago",
    "Varizes esofágicas conhecidas (relativa)",
    "Obstrução de vias aéreas superiores",
  ],
  complicacoes: [
    "Posicionamento inadvertido na traqueia → broncoaspiração",
    "Epistaxe, lesão de mucosa nasal",
    "Náuseas, vômitos, reflexo vagal",
    "Lesão por pressão na narina por fixação inadequada",
  ],
  cenas: [
    {
      ordem: 1,
      titulo: "1. Reunir os materiais",
      descricao:
        "Organize toda a bandeja antes de iniciar. Confira validade da sonda e a integridade da embalagem.",
      atencao: "Cheque o calibre adequado: adulto 14–18 Fr; idoso ou narina estreita 12–14 Fr.",
      imagem: img01,
    },
    {
      ordem: 2,
      titulo: "2. Higienização e EPI",
      descricao:
        "Higienize as mãos por 40–60 s, coloque máscara cirúrgica e calce luvas de procedimento.",
      atencao: "Explique o procedimento ao paciente e obtenha consentimento — reduz ansiedade e reflexo de vômito.",
      imagem: img02,
    },
    {
      ordem: 3,
      titulo: "3. Posicionar o paciente",
      descricao:
        "Posição de Fowler (cabeceira a 45°), pescoço alinhado. Em pacientes inconscientes, decúbito lateral.",
      atencao: "Cabeceira elevada reduz risco de broncoaspiração.",
      imagem: img03,
      overlays: [{ tipo: "pulse", x: 0.62, y: 0.35, cor: "gold" }],
    },
    {
      ordem: 4,
      titulo: "4. Medir a sonda",
      descricao:
        "Meça externamente: da ponta do nariz → lóbulo da orelha → apêndice xifoide. Marque o ponto com fita.",
      atencao: "Essa medida estima a distância até o estômago (geralmente 50–60 cm no adulto).",
      imagem: img04,
      overlays: [
        { tipo: "pulse", x: 0.22, y: 0.5, cor: "gold" },
        { tipo: "pulse", x: 0.55, y: 0.5, cor: "gold" },
        { tipo: "pulse", x: 0.45, y: 0.85, cor: "gold" },
      ],
    },
    {
      ordem: 5,
      titulo: "5. Lubrificar a ponta",
      descricao: "Aplique xilocaína gel nos primeiros 10 cm da sonda para reduzir atrito e desconforto.",
      atencao: "Não use lubrificantes oleosos (vaselina) — risco de pneumonia lipídica se houver desvio para via aérea.",
      imagem: img05,
    },
    {
      ordem: 6,
      titulo: "6. Introduzir pela narina",
      descricao:
        "Introduza pela narina mais pérvia em movimento contínuo e firme. Quando atingir a orofaringe, peça para o paciente fletir o pescoço e deglutir pequenos goles de água.",
      atencao: "Pare imediatamente se houver tosse, cianose, dispneia ou resistência intensa — possível passagem para a traqueia.",
      imagem: img06,
      overlays: [{ tipo: "pulse", x: 0.32, y: 0.45, cor: "danger" }],
      duracaoMs: 6500,
    },
    {
      ordem: 7,
      titulo: "7. Confirmar o posicionamento",
      descricao:
        "Aspire conteúdo gástrico com seringa (pH ≤ 5,5 sugere gástrico) e/ou injete 20 mL de ar auscultando o epigástrio. O padrão-ouro de confirmação é a radiografia.",
      atencao: "Nunca administre dieta ou medicação sem confirmar posicionamento.",
      imagem: img07,
      overlays: [{ tipo: "pulse", x: 0.5, y: 0.55, cor: "success" }],
    },
    {
      ordem: 8,
      titulo: "8. Fixar a sonda",
      descricao:
        "Fixe com esparadrapo em formato de calção (Y) no dorso do nariz. Registre tipo, calibre, narina, marca externa e intercorrências.",
      atencao: "Reavalie a fixação a cada plantão para prevenir lesão por pressão.",
      imagem: img08,
    },
  ],
  checklist: [
    "Identifiquei o paciente e expliquei o procedimento",
    "Higienizei as mãos e paramentei-me corretamente",
    "Posicionei o paciente em Fowler 45°",
    "Medi a sonda nariz → orelha → xifoide",
    "Lubrifiquei com xilocaína gel (não oleoso)",
    "Introduzi pela narina mais pérvia, com flexão cervical na deglutição",
    "Confirmei posicionamento (aspiração + ausculta) e solicitei RX se indicado",
    "Fixei adequadamente sem tração na narina",
    "Registrei calibre, marca externa, narina e intercorrências",
  ],
  referencias: [
    "POTTER, P.; PERRY, A. G. Fundamentos de Enfermagem, 9ª ed. Elsevier, 2018.",
    "COFEN. Resolução nº 453/2014 — Sondagem nasogástrica/enteral por enfermeiro.",
    "BRASIL. Ministério da Saúde. Protocolo de Segurança na Prescrição, Uso e Administração de Medicamentos.",
    "ANVISA. RDC nº 36/2013 — Segurança do paciente em serviços de saúde.",
  ],
};
