/**
 * Casos clínicos do mini app "Simulações Reais".
 * Para adicionar novos casos, basta acrescentar um objeto no array `CASOS`.
 */

export type StatusPaciente = "estavel" | "atencao" | "critico";

export type SinaisVitais = {
  paSistolica: number;
  paDiastolica: number;
  fc: number;
  fr: number;
  temp: number; // °C
  spo2: number; // %
};

export type OpcaoResposta = {
  texto: string;
  correta: boolean;
  feedback: string;
};

export type CasoClinico = {
  id: string;
  titulo: string;
  setor: string;
  paciente: {
    nome: string;
    idade: number;
    leito: string;
    avatar: string; // emoji
    diagnostico: string;
    queixa: string;
    status: StatusPaciente;
  };
  vitais: SinaisVitais;
  pergunta: string;
  opcoes: OpcaoResposta[]; // 4 opções, exatamente 1 correta
  referencias: string[];
};

export const CASOS: CasoClinico[] = [
  {
    id: "01-crise-hipertensiva",
    titulo: "Crise Hipertensiva na Unidade de Internação",
    setor: "Unidade de Internação",
    paciente: {
      nome: "Sra. Maria Oliveira",
      idade: 68,
      leito: "12A",
      avatar: "👵",
      diagnostico: "Hipertensão descompensada",
      queixa: "Cefaleia intensa e tontura há 2h.",
      status: "atencao",
    },
    vitais: {
      paSistolica: 180,
      paDiastolica: 110,
      fc: 96,
      fr: 20,
      temp: 36.7,
      spo2: 96,
    },
    pergunta:
      'Considerando o monitoramento que indica uma PA de 180/110 mmHg e o relato da paciente sobre cefaleia "em peso" na região da nuca acompanhada de tontura, qual deve ser a conduta prioritária e imediata do enfermeiro bacharel para garantir a segurança do paciente e evitar lesão de órgão-alvo?',
    opcoes: [
      {
        texto:
          "Realizar avaliação neurológica rápida, elevar a cabeceira a 45°, comunicar o médico assistente e preparar medicação conforme prescrição SOS.",
        correta: true,
        feedback:
          "PARABÉNS! VOCÊ ESTÁ NO CAMINHO CERTO. A elevação da cabeceira auxilia na redução da pressão intracraniana e a avaliação neurológica é vital para descartar sinais de AVC em crises hipertensivas. A comunicação rápida garante a intervenção medicamentosa segura.",
      },
      {
        texto:
          'Administrar o anti-hipertensivo prescrito imediatamente e solicitar que a paciente caminhe pelo corredor para "esfriar o corpo".',
        correta: false,
        feedback:
          "O QUADRO SE AGRAVOU! Ao estimular a deambulação em um quadro de crise hipertensiva e tontura, você expõe a paciente ao risco iminente de queda e aumenta o esforço cardíaco, podendo evoluir para um edema agudo de pulmão ou AVC hemorrágico.",
      },
      {
        texto:
          "Aguardar 30 minutos em repouso absoluto para reavaliar os sinais vitais antes de qualquer comunicação médica.",
        correta: false,
        feedback:
          "VOCÊ COLOCOU O PACIENTE EM RISCO! Em uma emergência hipertensiva com sintomas (cefaleia e tontura), o tempo é músculo cardíaco e tecido cerebral. A omissão de socorro e o atraso na comunicação médica podem resultar em danos irreversíveis ao paciente.",
      },
      {
        texto:
          "Aplicar compressas frias na nuca e administrar um analgésico simples para a cefaleia, aguardando a melhora da dor para medir a PA novamente.",
        correta: false,
        feedback:
          "VOCÊ MATOU O PACIENTE! Tratar apenas o sintoma (dor) e ignorar a causa (hipertensão severa) mascara o quadro clínico. A pressão continuará subindo, levando a uma falência de órgão-alvo. O enfermeiro deve tratar a causa sistêmica e não apenas o sintoma isolado.",
      },
    ],
    referencias: [
      "BRASIL. Ministério da Saúde. ANVISA. RDC nº 36, de 25 de julho de 2013. Brasília, 2013.",
      "COFEN. Resolução nº 736/2024. Dispõe sobre a implementação do Processo de Enfermagem.",
      "Sociedade Brasileira de Cardiologia. Diretrizes Brasileiras de Hipertensão Arterial — 2020. Arq. Bras. Cardiol., v. 116, n. 3, p. 516-658, 2021.",
    ],
  },
];
