/**
 * Casos clínicos do mini app "Simulações Reais".
 * Para adicionar novos casos, basta acrescentar um objeto no array `CASOS`.
 */

export type StatusPaciente = "estavel" | "atencao" | "critico";

export type CategoriaCaso =
  | "clinica"
  | "pediatria"
  | "obstetricia"
  | "neonatal"
  | "trauma"
  | "saude-mental"
  | "gerenciamento";

export const CATEGORIAS: { id: CategoriaCaso; label: string; emoji: string }[] = [
  { id: "clinica", label: "Clínica Médica", emoji: "🩺" },
  { id: "pediatria", label: "Pediatria", emoji: "🧒" },
  { id: "obstetricia", label: "Gineco/Obstetrícia", emoji: "🤰" },
  { id: "neonatal", label: "Neonatologia", emoji: "👶" },
  { id: "trauma", label: "Trauma", emoji: "🚑" },
  { id: "saude-mental", label: "Saúde Mental", emoji: "🧠" },
  { id: "gerenciamento", label: "Gerenciamento", emoji: "📋" },
];

/** Mapeia o id do caso para a categoria. Casos não listados ficam em "clinica". */
const CATEGORIA_POR_ID: Record<string, CategoriaCaso> = {
  "08-crise-convulsiva-pediatrica": "pediatria",
  "11-parto-iminente-emergencia": "obstetricia",
  "12-crise-asmatica-pediatrica": "pediatria",
  "14-pre-eclampsia-grave": "obstetricia",
  "15-rn-desconforto-respiratorio": "neonatal",
  "16-desidratacao-grave-pediatrica": "pediatria",
  "17-agitacao-psicomotora": "saude-mental",
  "18-pneumotorax-hipertensivo": "trauma",
  "19-trauma-abdominal-baco": "trauma",
  "20-politrauma-hemorragia-exanguinante": "trauma",
};

export function categoriaDoCaso(id: string): CategoriaCaso {
  return CATEGORIA_POR_ID[id] ?? "clinica";
}

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
  {
    id: "02-cetoacidose-diabetica",
    titulo: "Manejo de Cetoacidose Diabética (CAD) na Emergência",
    setor: "Sala Vermelha — Emergência",
    paciente: {
      nome: "Sr. Joaquim",
      idade: 45,
      leito: "SV-03",
      avatar: "🧔",
      diagnostico: "Diabetes Mellitus Tipo 1 — CAD",
      queixa:
        "Mal-estar geral, dor abdominal difusa, náuseas e poliúria há 24h. Hálito cetônico (frutado), mucosas secas, turgor cutâneo diminuído.",
      status: "critico",
    },
    vitais: {
      paSistolica: 90,
      paDiastolica: 60,
      fc: 112,
      fr: 28,
      temp: 37.2,
      spo2: 94,
    },
    pergunta:
      "Considerando o quadro de hipotensão (PA 90/60), taquicardia (FC 112) e padrão respiratório de Kussmaul (FR 28 — rápida e profunda, compensando acidose metabólica), além da glicemia capilar de 450 mg/dL, qual deve ser a prioridade ABSOLUTA da assistência de enfermagem para estabilizar o Sr. Joaquim neste momento?",
    opcoes: [
      {
        texto:
          "Iniciar hidratação venosa vigorosa com Soro Fisiológico 0,9% conforme prescrição, monitorar débito urinário e manter vigilância rigorosa do padrão respiratório e nível de consciência.",
        correta: true,
        feedback:
          "PARABÉNS! VOCÊ ESTÁ NO CAMINHO CERTO. Na Cetoacidose Diabética, a prioridade inicial é a reposição volêmica para tratar a desidratação severa e o choque hipovolêmico. A insulina só deve ser iniciada APÓS o início da hidratação para evitar colapso vascular e edema cerebral.",
      },
      {
        texto:
          "Administrar imediatamente 10 UI de Insulina Regular em bólus por via endovenosa para baixar a glicemia de 450 mg/dL o mais rápido possível.",
        correta: false,
        feedback:
          "VOCÊ MATOU O PACIENTE! Administrar insulina em bólus antes de iniciar a hidratação em um paciente já hipotenso provoca um deslocamento osmótico brusco de fluidos, levando ao colapso cardiovascular irreversível e risco iminente de edema cerebral. A glicemia não mata tão rápido quanto o choque.",
      },
      {
        texto:
          "Administrar um sedativo leve para acalmar o paciente e reduzir a frequência respiratória de 28 irpm, que está gerando cansaço.",
        correta: false,
        feedback:
          "O QUADRO SE AGRAVOU! A respiração de Kussmaul é um mecanismo compensatório do corpo para expelir CO2 e tentar corrigir a acidose metabólica. Se você sedar o paciente e inibir esse reflexo, a acidose se tornará fatal em poucos minutos por falência respiratória.",
      },
      {
        texto:
          "Oferecer líquidos por via oral (suco de laranja com açúcar) para tratar a fraqueza e a sede intensa relatada pelo paciente.",
        correta: false,
        feedback:
          "VOCÊ COLOCOU O PACIENTE EM RISCO! Oferecer glicose por via oral em um quadro de hiperglicemia severa e cetose agrava drasticamente a osmolaridade sanguínea e a desidratação. Além disso, o paciente com náuseas tem alto risco de broncoaspiração.",
      },
    ],
    referencias: [
      "COFEN. Resolução nº 736/2024. Dispõe sobre a implementação do Processo de Enfermagem.",
      "SOCIEDADE BRASILEIRA DE DIABETES (SBD). Diretrizes da Sociedade Brasileira de Diabetes 2024. São Paulo: Clannad, 2024.",
      "HERDMAN, T. H.; KAMITSURU, S. (Org.). Diagnósticos de Enfermagem da NANDA-I: Definições e Classificação 2021-2023. Porto Alegre: Artmed, 2021.",
    ],
  },
  {
    id: "03-avc-isquemico-trombolise",
    titulo: "Suspeita de AVC Isquêmico na Janela de Trombólise",
    setor: "Unidade de Emergência — Sala de AVC",
    paciente: {
      nome: "Sr. Benedito",
      idade: 72,
      leito: "EM-07",
      avatar: "👴",
      diagnostico: "Suspeita de AVC Isquêmico — janela 90 min",
      queixa:
        "Perda súbita de força em hemicorpo direito e disartria severa há 90 minutos. Cincinnati positivo nos 3 componentes (desvio de rima, queda de MSD, fala arrastada). HAS em uso irregular de medicação.",
      status: "critico",
    },
    vitais: {
      paSistolica: 170,
      paDiastolica: 95,
      fc: 82,
      fr: 18,
      temp: 36.5,
      spo2: 97,
    },
    pergunta:
      "Considerando que o Sr. Benedito apresenta sinais clínicos claros de AVC (Cincinnati positivo) e está dentro da janela terapêutica de 4,5 horas para trombólise química, qual é a conduta IMEDIATA e PRIORITÁRIA do enfermeiro na recepção deste paciente para garantir o melhor desfecho neurológico?",
    opcoes: [
      {
        texto:
          "Acionar imediatamente o Protocolo de AVC, garantir dois acessos venosos calibrosos, manter o paciente em jejum (NPO), realizar a Escala de NIHSS e encaminhar para Tomografia de Crânio em caráter de urgência.",
        correta: true,
        feedback:
          "PARABÉNS! VOCÊ ESTÁ NO CAMINHO CERTO. No AVC, 'tempo é cérebro'. A ativação imediata do protocolo e a realização da Tomografia Computadorizada (TC) rápida são fundamentais para diferenciar o AVC isquêmico do hemorrágico. Sem a TC, é impossível iniciar a trombólise com segurança. Sua agilidade salvou a área de penumbra isquêmica do Sr. Benedito.",
      },
      {
        texto:
          "Administrar 200mg de Ácido Acetilsalicílico (AAS) via oral imediatamente para prevenir a progressão do coágulo enquanto aguarda a avaliação da equipe de neurologia.",
        correta: false,
        feedback:
          "VOCÊ MATOU O PACIENTE! Nunca administre antiagregantes ou anticoagulantes antes da realização da Tomografia de Crânio. Se o AVC do Sr. Benedito for do tipo hemorrágico, o AAS impedirá a coagulação, expandindo o sangramento intracraniano rapidamente, levando ao óbito por herniação cerebral em poucos minutos.",
      },
      {
        texto:
          "Administrar anti-hipertensivo endovenoso imediatamente para baixar a PA de 170/95 mmHg para níveis normais (120/80 mmHg) e reduzir o risco de sangramento.",
        correta: false,
        feedback:
          "O QUADRO SE AGRAVOU! No AVC isquêmico agudo, a pressão arterial elevada é um mecanismo de defesa do organismo para manter a perfusão na área de penumbra. Baixar a PA bruscamente para níveis normais sem que ela ultrapasse 185/110 mmHg causa isquemia extensa e morte neuronal irreversível por hipoperfusão cerebral.",
      },
      {
        texto:
          "Solicitar exames laboratoriais completos (hemograma, coagulograma e eletrólitos) e aguardar os resultados para confirmar o diagnóstico antes de acionar o protocolo de neurologia.",
        correta: false,
        feedback:
          "VOCÊ COLOCOU O PACIENTE EM RISCO! O diagnóstico de AVC é clínico e a conduta é tempo-dependente. Aguardar resultados laboratoriais para 'confirmar' o que a clínica e a escala de Cincinnati já mostram faz com que o paciente perca a janela de tratamento. Cada minuto de atraso resulta em sequelas permanentes ou morte. Apenas a glicemia capilar deve preceder a trombólise, pois hipoglicemia pode mimetizar AVC.",
      },
    ],
    referencias: [
      "AMERICAN HEART ASSOCIATION (AHA). Guidelines for the Early Management of Patients with Acute Ischemic Stroke, 2019 (atualizações 2023).",
      "REDE BRASIL AVC. Protocolo Clínico e Diretrizes Terapêuticas para o AVC Isquêmico, 2023.",
      "COFEN. Resolução nº 736/2024. Dispõe sobre a implementação do Processo de Enfermagem.",
    ],
  },
  {
    id: "04-edema-agudo-pulmao",
    titulo: "Insuficiência Cardíaca Descompensada — Edema Agudo de Pulmão",
    setor: "Clínica Médica — Emergência",
    paciente: {
      nome: "Sra. Benedita",
      idade: 75,
      leito: "CM-12",
      avatar: "👵",
      diagnostico: "ICC descompensada — Edema Agudo de Pulmão (EAP)",
      queixa:
        "Dispneia súbita em repouso, ortopneia, ansiedade extrema, tosse com secreção rósea e espumosa. Uso de musculatura acessória. Histórico de ICC e HAS.",
      status: "critico",
    },
    vitais: {
      paSistolica: 210,
      paDiastolica: 120,
      fc: 128,
      fr: 34,
      temp: 36.8,
      spo2: 82,
    },
    pergunta:
      "Diante da gravidade do quadro de Edema Agudo de Pulmão (EAP) — PA 210/120, SatO2 82%, estertores crepitantes até ápices e secreção rósea espumosa — qual deve ser sua PRIMEIRA intervenção imediata como enfermeiro(a)?",
    opcoes: [
      {
        texto:
          "Elevar a cabeceira do leito a 90º (Fowler alta), ofertar O2 sob máscara e preparar Furosemida conforme prescrição.",
        correta: true,
        feedback:
          "PARABÉNS! VOCÊ ESTÁ NO CAMINHO CERTO! O posicionamento reduz o retorno venoso e melhora a expansão pulmonar. O oxigênio combate a hipóxia crítica e o diurético de alça é fundamental para reduzir a sobrecarga hídrica pulmonar. Você salvou a Sra. Benedita de uma insuficiência respiratória iminente.",
      },
      {
        texto:
          "Manter a paciente em decúbito dorsal horizontal para facilitar a ausculta cardíaca e puncionar acesso venoso periférico.",
        correta: false,
        feedback:
          "VOCÊ MATOU O PACIENTE! Ao manter um paciente em EAP deitado, você aumenta o retorno venoso e 'afoga' os pulmões em fluido. A Sra. Benedita evoluiu para parada respiratória em menos de 2 minutos devido à incapacidade de troca gasosa.",
      },
      {
        texto:
          "Administrar Morfina imediatamente para reduzir a ansiedade e a dor torácica relatada.",
        correta: false,
        feedback:
          "O QUADRO SE AGRAVOU! Embora a morfina possa ser usada no EAP para reduzir a pré-carga e a ansiedade, administrá-la sem suporte ventilatório e posicionamento adequado em uma paciente com SatO2 de 82% causou depressão respiratória grave, exigindo intubação de emergência.",
      },
      {
        texto:
          "Aguardar a chegada do médico para realizar a ausculta pulmonar antes de qualquer manipulação.",
        correta: false,
        feedback:
          "VOCÊ COLOCOU O PACIENTE EM RISCO! O EAP é uma emergência tempo-dependente. A omissão de socorro e a demora em posicionar a paciente e ofertar O2 demonstram falta de autonomia e julgamento clínico, resultando em sofrimento evitável e piora hemodinâmica.",
      },
    ],
    referencias: [
      "SOCIEDADE BRASILEIRA DE CARDIOLOGIA. Diretrizes Brasileiras de Insuficiência Cardíaca Aguda. Arquivos Brasileiros de Cardiologia, 2021.",
      "COFEN. Resolução nº 564/2017. Código de Ética dos Profissionais de Enfermagem.",
      "COFEN. Resolução nº 736/2024. Dispõe sobre a implementação do Processo de Enfermagem.",
    ],
  },
  {
    id: "05-sepse-pneumonia",
    titulo: "Pneumonia Comunitária Grave e Choque Séptico",
    setor: "Emergência — Sala de Estabilização",
    paciente: {
      nome: "Sr. Arnaldo",
      idade: 60,
      leito: "EM-04",
      avatar: "🧓",
      diagnostico: "Sepse de foco pulmonar — Choque Séptico",
      queixa:
        "Febre alta há 3 dias, tosse produtiva e confusão mental súbita. Tabagista e diabético. Sonolento, extremidades frias, enchimento capilar de 5s.",
      status: "critico",
    },
    vitais: {
      paSistolica: 85,
      paDiastolica: 50,
      fc: 118,
      fr: 28,
      temp: 39.2,
      spo2: 92,
    },
    pergunta:
      "O Sr. Arnaldo apresenta sinais claros de Sepse com foco pulmonar (hipotensão, taquicardia, febre, hipoperfusão e alteração do nível de consciência). De acordo com o protocolo de sobrevivência à sepse (Surviving Sepsis Campaign), qual a PRIORIDADE nos primeiros 60 minutos?",
    opcoes: [
      {
        texto:
          "Coletar lactato arterial, hemoculturas, iniciar ressuscitação volêmica com cristaloides e administrar antibiótico de amplo espectro.",
        correta: true,
        feedback:
          "PARABÉNS! VOCÊ ESTÁ NO CAMINHO CERTO! Você aplicou o 'Bundle de 1 hora'. A identificação precoce da hipoperfusão (lactato) e o início imediato de volume e antibiótico são as únicas medidas que comprovadamente reduzem a mortalidade na sepse.",
      },
      {
        texto:
          "Administrar antitérmico para baixar a febre e aguardar o resultado do Raio-X de tórax para confirmar a pneumonia.",
        correta: false,
        feedback:
          "VOCÊ MATOU O PACIENTE! A febre é o menor dos problemas. O Sr. Arnaldo está em choque séptico. Ao priorizar o antitérmico e aguardar exames de imagem sem estabilização hemodinâmica, você permitiu que a hipoperfusão causasse falência múltipla de órgãos.",
      },
      {
        texto:
          "Iniciar imediatamente infusão de Noradrenalina em acesso venoso periférico para elevar a PA.",
        correta: false,
        feedback:
          "O QUADRO SE AGRAVOU! Vasopressores não devem ser a primeira escolha sem antes tentar a reposição volêmica (a menos que a hipotensão seja refratária). Além disso, a noradrenalina em acesso periférico fino traz risco de necrose por extravasamento. O paciente continuou infectado e sem volume circulante.",
      },
      {
        texto:
          "Realizar apenas a coleta de exames laboratoriais e aguardar o médico prescrever o antibiótico específico após o resultado do antibiograma.",
        correta: false,
        feedback:
          "VOCÊ COLOCOU O PACIENTE EM RISCO! Na sepse, cada hora de atraso no antibiótico aumenta a mortalidade em cerca de 8%. Aguardar o antibiograma (que leva dias) é um erro técnico grave. O tratamento deve ser empírico e imediato.",
      },
    ],
    referencias: [
      "INSTITUTO LATINO-AMERICANO DE SEPSE (ILAS). Protocolo de Tratamento: Sepse e Choque Séptico. São Paulo, 2023.",
      "SURVIVING SEPSIS CAMPAIGN. International Guidelines for Management of Sepsis and Septic Shock, 2021.",
      "COFEN. Resolução nº 736/2024. Dispõe sobre a implementação do Processo de Enfermagem.",
    ],
  },
  {
    id: "06-hemorragia-digestiva-alta",
    titulo: "Hemorragia Digestiva Alta — Ruptura de Varizes Esofágicas",
    setor: "Emergência — Sala Vermelha",
    paciente: {
      nome: "Sr. Marcos",
      idade: 55,
      leito: "SV-02",
      avatar: "🧔",
      diagnostico: "HDA — suspeita de ruptura de varizes esofágicas (cirrose)",
      queixa:
        "Hematêmese volumosa (sangue vivo) e melena. Pálido, sudoreico, refere tontura ao sentar. Etilista crônico, cirrose hepática.",
      status: "critico",
    },
    vitais: {
      paSistolica: 90,
      paDiastolica: 60,
      fc: 115,
      fr: 22,
      temp: 36.4,
      spo2: 95,
    },
    pergunta:
      "Suspeita-se de ruptura de varizes esofágicas no Sr. Marcos. Qual a conduta de enfermagem IMEDIATA para garantir a segurança hemodinâmica e preparar o paciente para o tratamento definitivo?",
    opcoes: [
      {
        texto:
          "Puncionar dois acessos venosos calibrosos (18G ou 16G), manter o paciente em jejum absoluto e preparar material para Endoscopia Digestiva Alta (EDA).",
        correta: true,
        feedback:
          "PARABÉNS! VOCÊ ESTÁ NO CAMINHO CERTO! A prioridade é a estabilização hemodinâmica com volume e a proteção da via aérea. O jejum é vital para o procedimento diagnóstico e terapêutico (EDA) que irá estancar o sangramento.",
      },
      {
        texto:
          "Passar uma Sonda Nasogástrica (SNG) e realizar lavagem gástrica com soro gelado para promover vasoconstrição.",
        correta: false,
        feedback:
          "VOCÊ MATOU O PACIENTE! Em caso de varizes esofágicas, a passagem às cegas de uma sonda pode romper ainda mais os vasos fragilizados, causando uma hemorragia maciça e fatal em poucos segundos. Lavagem gástrica não é mais recomendada como rotina.",
      },
      {
        texto:
          "Oferecer pequenos goles de água gelada para aliviar a sede e tentar estancar o sangramento por resfriamento local.",
        correta: false,
        feedback:
          "VOCÊ COLOCOU O PACIENTE EM RISCO! O paciente deve estar em jejum absoluto (NPO). Oferecer líquidos aumenta o risco de broncoaspiração de sangue e conteúdo gástrico, além de retardar a realização da endoscopia de urgência.",
      },
      {
        texto:
          "Administrar um antiemético intramuscular para evitar novos episódios de vômito e aguardar a estabilização espontânea.",
        correta: false,
        feedback:
          "O QUADRO SE AGRAVOU! O antiemético não trata a causa do sangramento. A HDA por varizes não estabiliza sozinha; ela exige intervenção médica imediata. A demora na reposição volêmica levou o Sr. Marcos ao choque hipovolêmico descompensado.",
      },
    ],
    referencias: [
      "SOCIEDADE BRASILEIRA DE HEPATOLOGIA. Manejo da Hemorragia Digestiva Alta Varicosa. 2022.",
      "COFEN. Resolução nº 564/2017. Código de Ética dos Profissionais de Enfermagem.",
      "ANVISA. RDC nº 36, de 25 de julho de 2013. Segurança do paciente em serviços de saúde.",
    ],
  },
  {
    id: "07-iam-com-supra",
    titulo: "Infarto Agudo do Miocárdio com Supra de ST (IAMCSST)",
    setor: "Emergência — Sala Vermelha",
    paciente: {
      nome: "Sr. Antônio",
      idade: 62,
      leito: "SV-04",
      avatar: "👨‍🦳",
      diagnostico: "IAMCSST de parede anterior — janela de reperfusão",
      queixa:
        "Dor precordial em aperto, irradiada para mandíbula e braço esquerdo, iniciada há 40 minutos. Sudorese fria, náusea e sensação de morte iminente. Tabagista, hipertenso.",
      status: "critico",
    },
    vitais: {
      paSistolica: 150,
      paDiastolica: 95,
      fc: 105,
      fr: 22,
      temp: 36.6,
      spo2: 95,
    },
    pergunta:
      "O Sr. Antônio chega com dor torácica típica e ECG de 12 derivações confirmando supra de ST em parede anterior. Qual a conduta de enfermagem IMEDIATA e prioritária?",
    opcoes: [
      {
        texto:
          "Monitorização contínua (ECG, PA, SpO2), puncionar dois acessos venosos calibrosos, manter repouso absoluto no leito e preparar o paciente para terapia de reperfusão (angioplastia primária ou trombólise) conforme protocolo MOV (Monitor, Oxigênio se SpO2<90%, Veia).",
        correta: true,
        feedback:
          "PARABÉNS! VOCÊ ESTÁ NO CAMINHO CERTO! Tempo é músculo. O atendimento ao IAMCSST exige reperfusão em até 90 minutos (porta-balão) ou 30 minutos (porta-agulha). Sua conduta otimizou a sobrevida e reduziu a área de necrose miocárdica.",
      },
      {
        texto:
          "Solicitar que o paciente caminhe até a sala de hemodinâmica para acelerar a chegada ao cateterismo.",
        correta: false,
        feedback:
          "VOCÊ MATOU O PACIENTE! Qualquer esforço físico no IAM aumenta o consumo de oxigênio pelo miocárdio isquêmico e pode desencadear fibrilação ventricular e parada cardiorrespiratória. O paciente deve permanecer em repouso absoluto, transportado em maca.",
      },
      {
        texto:
          "Oferecer oxigênio em máscara não-reinalante a 10 L/min de rotina, mesmo com SpO2 de 95%, para garantir oxigenação do miocárdio.",
        correta: false,
        feedback:
          "VOCÊ COLOCOU O PACIENTE EM RISCO! Diretrizes atuais (AHA 2020, SBC 2021) contraindicam oxigenoterapia de rotina no IAM sem hipoxemia (SpO2 ≥ 90%). A hiperóxia causa vasoconstrição coronariana e aumenta a área de infarto.",
      },
      {
        texto:
          "Administrar AAS 300 mg VO imediatamente por conta própria, antes da avaliação médica, para acelerar a antiagregação plaquetária.",
        correta: false,
        feedback:
          "INFRAÇÃO ÉTICA E TÉCNICA! O enfermeiro NÃO prescreve medicamentos. Embora o AAS seja parte do protocolo, sua administração depende de prescrição médica e checagem de contraindicações (alergia, sangramento ativo). Atuar fora do escopo viola a Lei 7.498/86 e o Código de Ética (COFEN 564/2017).",
      },
    ],
    referencias: [
      "SOCIEDADE BRASILEIRA DE CARDIOLOGIA. Diretriz de IAM com Supradesnivelamento do Segmento ST. Arquivos Brasileiros de Cardiologia, 2021.",
      "AMERICAN HEART ASSOCIATION (AHA). Guidelines for CPR and ECC, 2020.",
      "COFEN. Resolução nº 564/2017. Código de Ética dos Profissionais de Enfermagem.",
    ],
  },
  {
    id: "08-crise-convulsiva-pediatrica",
    titulo: "Crise Convulsiva Febril em Pediatria",
    setor: "Pronto-Socorro Infantil",
    paciente: {
      nome: "Pedro (criança)",
      idade: 3,
      leito: "PED-02",
      avatar: "🧒",
      diagnostico: "Crise convulsiva tônico-clônica generalizada associada a febre alta (39,8°C)",
      queixa:
        "Mãe relata que a criança apresentou tremores generalizados, perda de consciência e sialorreia há cerca de 2 minutos. Sem histórico prévio de epilepsia. Quadro de IVAS há 2 dias.",
      status: "critico",
    },
    vitais: {
      paSistolica: 100,
      paDiastolica: 60,
      fc: 150,
      fr: 32,
      temp: 39.8,
      spo2: 92,
    },
    pergunta:
      "Pedro está em crise convulsiva ativa na sua frente. Qual a conduta de enfermagem IMEDIATA e PRIORITÁRIA durante a crise?",
    opcoes: [
      {
        texto:
          "Posicionar a criança em decúbito lateral de segurança, proteger a cabeça com coxim, afrouxar roupas, manter vias aéreas pérvias (sem introduzir objetos na boca), administrar O2 sob máscara e cronometrar a duração da crise.",
        correta: true,
        feedback:
          "PARABÉNS! VOCÊ ESTÁ NO CAMINHO CERTO! A prioridade é proteger contra trauma e broncoaspiração, garantir oxigenação e cronometrar a crise (>5 min = estado de mal epiléptico, exige benzodiazepínico). Sua conduta é tecnicamente impecável e segue o protocolo SBP.",
      },
      {
        texto:
          "Introduzir uma espátula, colher ou os próprios dedos na boca da criança para evitar que ela 'engula a língua'.",
        correta: false,
        feedback:
          "VOCÊ COLOCOU A CRIANÇA EM RISCO GRAVE! Esse é um MITO perigoso. Introduzir objetos na boca durante a convulsão pode quebrar dentes, lesionar a mucosa, obstruir a via aérea e fraturar dedos do socorrista. A língua não é 'engolida' — ela apenas relaxa.",
      },
      {
        texto:
          "Conter fisicamente os movimentos da criança segurando braços e pernas firmemente para que ela pare de se debater.",
        correta: false,
        feedback:
          "VOCÊ MACHUCOU A CRIANÇA! A contenção física durante a crise pode causar luxações, fraturas e lesões musculares. Os movimentos tônico-clônicos são involuntários e cessam espontaneamente. Apenas proteja contra trauma — não contenha.",
      },
      {
        texto:
          "Mergulhar a criança imediatamente em uma bacia de água gelada para baixar a febre o mais rápido possível.",
        correta: false,
        feedback:
          "VOCÊ AGRAVOU O QUADRO! O resfriamento brusco causa vasoconstrição periférica, calafrios e aumento paradoxal da temperatura central, além de risco de broncoaspiração. A febre deve ser manejada com antitérmico prescrito e compressas mornas, NUNCA água gelada.",
      },
    ],
    referencias: [
      "SOCIEDADE BRASILEIRA DE PEDIATRIA (SBP). Crise Convulsiva Febril na Infância: Manejo. 2022.",
      "LIGA BRASILEIRA DE EPILEPSIA. Diretrizes para Estado de Mal Epiléptico, 2023.",
      "COFEN. Resolução nº 736/2024. Dispõe sobre a implementação do Processo de Enfermagem.",
    ],
  },
  {
    id: "09-pcr-rcp-adulto",
    titulo: "Parada Cardiorrespiratória em Adulto — Ritmo Chocável",
    setor: "Unidade de Terapia Intensiva (UTI)",
    paciente: {
      nome: "Sra. Helena",
      idade: 58,
      leito: "UTI-05",
      avatar: "👩‍🦰",
      diagnostico: "PCR em Fibrilação Ventricular (FV) — pós-operatório de revascularização miocárdica",
      queixa:
        "Paciente em pós-operatório imediato, monitorizada, subitamente apresenta perda de consciência, ausência de pulso central e traçado de FV no monitor cardíaco.",
      status: "critico",
    },
    vitais: {
      paSistolica: 0,
      paDiastolica: 0,
      fc: 0,
      fr: 0,
      temp: 36.0,
      spo2: 0,
    },
    pergunta:
      "A Sra. Helena está em PCR com ritmo de FV identificado no monitor. Qual a conduta de enfermagem IMEDIATA conforme protocolo ACLS 2020?",
    opcoes: [
      {
        texto:
          "Chamar ajuda (acionar Código Azul), iniciar compressões torácicas de alta qualidade (100-120/min, 5-6 cm de profundidade) e preparar o desfibrilador para choque imediato (200 J bifásico), minimizando interrupções.",
        correta: true,
        feedback:
          "PARABÉNS! VOCÊ SALVOU A PACIENTE! FV é ritmo chocável — desfibrilação precoce é o ÚNICO tratamento eficaz. Compressões de qualidade mantêm perfusão coronariana e cerebral até o choque. Sua conduta segue rigorosamente o algoritmo ACLS 2020.",
      },
      {
        texto:
          "Administrar imediatamente 1 mg de Adrenalina IV em bolus, ANTES da primeira desfibrilação, para 'fortalecer' o ritmo cardíaco.",
        correta: false,
        feedback:
          "VOCÊ MATOU A PACIENTE! Em ritmos chocáveis (FV/TV sem pulso), a PRIMEIRA conduta é o CHOQUE, não a adrenalina. A adrenalina entra apenas após o segundo choque, em intervalos de 3-5 min. Além disso, enfermeiro não prescreve medicação — administra sob prescrição médica.",
      },
      {
        texto:
          "Verificar pulso carotídeo por 60 segundos antes de iniciar qualquer manobra, para confirmar a ausência total de circulação.",
        correta: false,
        feedback:
          "VOCÊ PERDEU TEMPO PRECIOSO! O ACLS 2020 recomenda checar pulso por NO MÁXIMO 10 segundos. Cada segundo sem RCP reduz drasticamente a chance de retorno da circulação espontânea (RCE). 60 segundos sem compressão = lesão cerebral irreversível.",
      },
      {
        texto:
          "Iniciar ventilação com bolsa-válvula-máscara em ciclos de 30:2 (compressão:ventilação) ANTES de chamar ajuda e antes do choque.",
        correta: false,
        feedback:
          "VOCÊ ATRASOU A DESFIBRILAÇÃO! Em ambiente monitorizado (UTI) com FV identificada, a sequência é: chamar ajuda + iniciar compressões + CHOCAR o mais rápido possível. Ventilação 30:2 é técnica do BLS sem via aérea avançada — não substitui o choque imediato em ritmo chocável.",
      },
    ],
    referencias: [
      "AMERICAN HEART ASSOCIATION (AHA). Guidelines for CPR and ECC — ACLS, 2020.",
      "SOCIEDADE BRASILEIRA DE CARDIOLOGIA. Diretriz de Ressuscitação Cardiopulmonar e Cuidados Cardiovasculares de Emergência, 2019.",
      "COFEN. Resolução nº 736/2024. Dispõe sobre a implementação do Processo de Enfermagem.",
    ],
  },
  {
    id: "10-crise-anafilatica",
    titulo: "Choque Anafilático Pós-Administração de Antibiótico",
    setor: "Clínica Médica — Enfermaria",
    paciente: {
      nome: "Sra. Lúcia",
      idade: 34,
      leito: "ENF-12",
      avatar: "👩",
      diagnostico: "Choque anafilático após administração de Ceftriaxona EV",
      queixa:
        "Cerca de 3 minutos após início da infusão do antibiótico, paciente refere prurido intenso, sensação de 'bola na garganta' e dispneia súbita. Apresenta urticária generalizada, edema de face e sibilos audíveis.",
      status: "critico",
    },
    vitais: {
      paSistolica: 75,
      paDiastolica: 40,
      fc: 130,
      fr: 30,
      temp: 36.8,
      spo2: 88,
    },
    pergunta:
      "A Sra. Lúcia desenvolve quadro clássico de anafilaxia durante a infusão do antibiótico. Qual a conduta de enfermagem IMEDIATA e PRIORITÁRIA?",
    opcoes: [
      {
        texto:
          "INTERROMPER imediatamente a infusão do antibiótico, manter acesso venoso com SF 0,9%, posicionar a paciente em decúbito dorsal com MMII elevados, administrar O2 sob máscara, acionar o médico em CÓDIGO e preparar Adrenalina IM para administração imediata sob prescrição.",
        correta: true,
        feedback:
          "PARABÉNS! VOCÊ SALVOU A PACIENTE! A interrupção da causa é a PRIMEIRA conduta. A adrenalina IM (vasto lateral da coxa) é o ÚNICO tratamento que reverte a anafilaxia — corticoide e anti-histamínico são adjuvantes. Sua agilidade preveniu a evolução para PCR.",
      },
      {
        texto:
          "Manter a infusão do antibiótico em velocidade reduzida para 'dessensibilizar' a paciente e administrar apenas Difenidramina (anti-histamínico) EV.",
        correta: false,
        feedback:
          "VOCÊ MATOU A PACIENTE! Manter o alérgeno é fatal. A anti-histamínica isolada NÃO reverte anafilaxia — apenas alivia prurido. Sem adrenalina e sem interromper a causa, a paciente evoluiu para edema de glote, broncoespasmo refratário e PCR.",
      },
      {
        texto:
          "Sentar a paciente para 'facilitar a respiração', oferecer água gelada para aliviar o edema da garganta e aguardar a melhora espontânea.",
        correta: false,
        feedback:
          "VOCÊ COLOCOU A PACIENTE EM RISCO GRAVE! Sentar paciente hipotensa causa colapso cardiovascular ('síndrome do ventrículo vazio'). Oferecer líquidos com edema de glote causa broncoaspiração. A anafilaxia NUNCA melhora espontaneamente sem adrenalina.",
      },
      {
        texto:
          "Administrar Hidrocortisona 500 mg EV como primeira medida e aguardar 30 minutos para avaliar resposta antes de chamar o médico.",
        correta: false,
        feedback:
          "VOCÊ PERDEU TEMPO PRECIOSO! Corticoide tem início de ação em 4-6 horas — inútil na fase aguda. Na anafilaxia, cada minuto sem adrenalina aumenta a mortalidade. Além disso, enfermeiro não prescreve medicamentos; deve acionar o médico IMEDIATAMENTE.",
      },
    ],
    referencias: [
      "ASBAI — ASSOCIAÇÃO BRASILEIRA DE ALERGIA E IMUNOLOGIA. Guia Prático de Atualização em Anafilaxia, 2023.",
      "WORLD ALLERGY ORGANIZATION (WAO). Anaphylaxis Guidance, 2020.",
      "COFEN. Resolução nº 564/2017. Código de Ética dos Profissionais de Enfermagem.",
    ],
  },
  {
    id: "11-parto-iminente-emergencia",
    titulo: "Assistência ao Parto Iminente na Emergência",
    setor: "Pronto-Socorro Obstétrico",
    paciente: {
      nome: "Sra. Aline",
      idade: 28,
      leito: "OBS-01",
      avatar: "🤰",
      diagnostico: "Gestação a termo (39 sem), G3P2A0, período expulsivo iminente",
      queixa:
        "Contrações rítmicas intensas e sensação de puxo. Ao exame: abaulamento perineal e visualização do polo cefálico.",
      status: "critico",
    },
    vitais: {
      paSistolica: 130,
      paDiastolica: 80,
      fc: 102,
      fr: 22,
      temp: 36.8,
      spo2: 98,
    },
    pergunta:
      "Diante de um parto iminente no pronto-socorro, qual a conduta prioritária do enfermeiro para garantir a segurança materno-fetal?",
    opcoes: [
      {
        texto:
          "Preparar o kit de parto, realizar a manobra de proteção do períneo (Ritgen modificada) para evitar lacerações, recepcionar o recém-nascido em campo aquecido e avaliar o índice de Apgar no 1º e 5º minuto.",
        correta: true,
        feedback:
          "PARABÉNS! VOCÊ ESTÁ NO CAMINHO CERTO. A condução técnica do parto iminente exige calma e proteção do períneo para evitar danos maternos, além do aquecimento imediato do RN para prevenir hipotermia.",
      },
      {
        texto:
          "Solicitar que a paciente feche as pernas e segure o bebê enquanto é transportada às pressas para o Centro Obstétrico em outro andar.",
        correta: false,
        feedback:
          "VOCÊ MATOU O PACIENTE! Tentar impedir a saída do bebê em fase de expulsivo causa sofrimento fetal agudo, hipóxia e risco de rotura uterina. O parto deve ser realizado onde a paciente está se for iminente.",
      },
      {
        texto:
          "Realizar a manobra de Kristeller (pressão no fundo do útero) para acelerar a saída do bebê e liberar o leito da emergência.",
        correta: false,
        feedback:
          "O QUADRO SE AGRAVOU! A manobra de Kristeller é proscrita pela OMS e pelo Ministério da Saúde, pois causa trauma abdominal, rotura uterina e descolamento prematuro de placenta.",
      },
      {
        texto:
          "Administrar Ocitocina endovenosa em bólus imediatamente para aumentar a força das contrações e finalizar o parto rápido.",
        correta: false,
        feedback:
          "VOCÊ COLOCOU O PACIENTE EM RISCO! A ocitocina em bólus causa hipotensão severa e hiperestimulação uterina, podendo levar à asfixia fetal. O uso deve ser criterioso e diluído.",
      },
    ],
    referencias: [
      "ORGANIZAÇÃO MUNDIAL DA SAÚDE. Recomendações da OMS para o Cuidado no Parto: Para uma experiência de parto positiva. Genebra: OMS, 2018.",
      "MINISTÉRIO DA SAÚDE. Protocolos da Unidade de Emergência. Brasília, 2022.",
      "COFEN. Resolução nº 736/2024. Implementação do Processo de Enfermagem.",
    ],
  },
  {
    id: "12-crise-asmatica-pediatrica",
    titulo: "Crise Asmática Grave em Pediatria",
    setor: "Pronto-Socorro Infantil",
    paciente: {
      nome: "Pedrinho",
      idade: 5,
      leito: "PED-04",
      avatar: "🧒",
      diagnostico: "Crise asmática grave com sinais de exaustão respiratória",
      queixa:
        "Cansaço extremo, fala entrecortada, uso de musculatura acessória. Ausculta: sibilos expiratórios e inspiratórios, tórax silencioso em bases.",
      status: "critico",
    },
    vitais: {
      paSistolica: 100,
      paDiastolica: 60,
      fc: 140,
      fr: 45,
      temp: 37.2,
      spo2: 88,
    },
    pergunta:
      "Qual a intervenção imediata para reverter o broncoespasmo grave de Pedrinho?",
    opcoes: [
      {
        texto:
          "Iniciar oxigenoterapia para manter SatO2 > 92%, administrar broncodilatador (Salbutamol) via nebulização ou spray com espaçador e corticosteroide sistêmico conforme prescrição.",
        correta: true,
        feedback:
          "PARABÉNS! VOCÊ ESTÁ NO CAMINHO CERTO. A combinação de O2, broncodilatador e corticoide é o padrão-ouro para reverter a inflamação e a obstrução das vias aéreas na crise asmática.",
      },
      {
        texto:
          "Realizar fisioterapia respiratória com manobras de tapotagem para ajudar a criança a expectorar a secreção que está obstruindo os pulmões.",
        correta: false,
        feedback:
          "O QUADRO SE AGRAVOU! Na crise asmática, o problema é o broncoespasmo (fechamento dos brônquios), não secreção. A tapotagem aumenta o estresse, o consumo de O2 e pode piorar o fechamento das vias aéreas.",
      },
      {
        texto:
          "Administrar um sedativo para que a criança pare de chorar e consiga respirar com mais calma, reduzindo a frequência cardíaca de 140 bpm.",
        correta: false,
        feedback:
          "VOCÊ MATOU O PACIENTE! A agitação na crise asmática é sinal de hipóxia (falta de oxigênio no cérebro). Sedar a criança inibe o drive respiratório e leva à parada respiratória imediata.",
      },
      {
        texto:
          "Aguardar o resultado do Raio-X de tórax para confirmar se não há pneumonia antes de iniciar qualquer medicação inalatória.",
        correta: false,
        feedback:
          "VOCÊ COLOCOU O PACIENTE EM RISCO! O diagnóstico de crise asmática é clínico. O atraso no tratamento para esperar exames de imagem pode levar à exaustão respiratória e necessidade de intubação.",
      },
    ],
    referencias: [
      "SOCIEDADE BRASILEIRA DE PEDIATRIA. Diretrizes de Manejo da Asma na Criança e no Adolescente. São Paulo: SBP, 2021.",
      "AMERICAN HEART ASSOCIATION. Diretrizes de PALS 2020. Dallas: AHA, 2020.",
      "COFEN. Resolução nº 564/2017. Código de Ética dos Profissionais de Enfermagem.",
    ],
  },
  {
    id: "13-extubacao-acidental-uti",
    titulo: "Extubação Acidental em Paciente Crítico (UTI)",
    setor: "Unidade de Terapia Intensiva (UTI)",
    paciente: {
      nome: "Sr. Antônio",
      idade: 60,
      leito: "UTI-03",
      avatar: "👨",
      diagnostico: "Ventilação mecânica invasiva — extubação acidental durante higiene no leito",
      queixa:
        "Tosse súbita durante o banho com saída do tubo orotraqueal. Esforço respiratório evidente e agitação psicomotora.",
      status: "critico",
    },
    vitais: {
      paSistolica: 150,
      paDiastolica: 95,
      fc: 130,
      fr: 36,
      temp: 37.0,
      spo2: 80,
    },
    pergunta:
      "Qual a conduta imediata do enfermeiro diante da extubação acidental do Sr. Antônio?",
    opcoes: [
      {
        texto:
          "Manter a calma, ofertar oxigênio sob máscara com reservatório (100%), monitorar sinais vitais, preparar material para nova intubação e comunicar a equipe médica imediatamente.",
        correta: true,
        feedback:
          "PARABÉNS! VOCÊ ESTÁ NO CAMINHO CERTO. A prioridade é garantir a oxigenação imediata e estar pronto para a reintubação, caso o paciente não sustente a respiração espontânea.",
      },
      {
        texto:
          "Tentar reintroduzir o tubo orotraqueal rapidamente pela boca sem laringoscopia para não perder o acesso à via aérea.",
        correta: false,
        feedback:
          "VOCÊ MATOU O PACIENTE! Tentar reintroduzir o tubo às cegas causa trauma de orofaringe, laringoespasmo e pode enviar o tubo para o esôfago, agravando a hipóxia fatalmente. Reintubação é ato médico.",
      },
      {
        texto:
          "Insuflar o cuff do tubo que saiu e tentar empurrá-lo de volta para a traqueia enquanto o paciente inspira.",
        correta: false,
        feedback:
          "O QUADRO SE AGRAVOU! Uma vez que o tubo saiu, ele está contaminado e a posição é incerta. Empurrá-lo pode causar lesões graves na traqueia e cordas vocais.",
      },
      {
        texto:
          "Administrar uma dose extra de sedativo para que o paciente não sinta o desconforto da falta de ar enquanto o médico é chamado.",
        correta: false,
        feedback:
          "VOCÊ MATOU O PACIENTE! Sem uma via aérea artificial segura, a sedação causará apneia central e o paciente não terá força para respirar sozinho, levando ao óbito por hipóxia.",
      },
    ],
    referencias: [
      "AMERICAN HEART ASSOCIATION. Diretrizes de ACLS 2020. Dallas: AHA, 2020.",
      "MINISTÉRIO DA SAÚDE. Protocolos da Unidade de Emergência. Brasília, 2022.",
      "COFEN. Resolução nº 564/2017. Código de Ética dos Profissionais de Enfermagem.",
      "COFEN. Resolução nº 736/2024. Processo de Enfermagem.",
    ],
  },
  {
    id: "14-pre-eclampsia-grave",
    titulo: "Pré-eclâmpsia Grave — Risco de Eclâmpsia",
    setor: "Centro Obstétrico",
    paciente: {
      nome: "Sra. Glória",
      idade: 28,
      leito: "OBS-04",
      avatar: "🤰",
      diagnostico: "Gestação 32 semanas, pré-eclâmpsia grave com sinais de iminência de eclâmpsia",
      queixa:
        "Cefaleia persistente, visão turva (escotomas) e dor em epigástrio. Edema MMII ++/4+ e proteinúria em fita reagente.",
      status: "critico",
    },
    vitais: {
      paSistolica: 170,
      paDiastolica: 110,
      fc: 88,
      fr: 18,
      temp: 36.6,
      spo2: 97,
    },
    pergunta:
      "Diante do risco iminente de eclâmpsia, qual a conduta prioritária para prevenir a crise convulsiva e garantir a neuroproteção materna?",
    opcoes: [
      {
        texto:
          "Administrar Sulfato de Magnésio conforme protocolo institucional (dose de ataque e manutenção), monitorar rigorosamente o reflexo patelar, a frequência respiratória e o débito urinário.",
        correta: true,
        feedback:
          "PARABÉNS! VOCÊ ESTÁ NO CAMINHO CERTO. O Sulfato de Magnésio é o padrão-ouro para prevenção e controle de crises convulsivas na pré-eclâmpsia grave. A vigilância dos sinais de toxicidade (hiporreflexia e bradipneia) é intervenção crítica de enfermagem (NIC: Controle da Eclâmpsia).",
      },
      {
        texto:
          "Administrar Diazepam para acalmar a paciente e reduzir a pressão arterial sistêmica.",
        correta: false,
        feedback:
          "VOCÊ MATOU O PACIENTE! O Diazepam não previne eclâmpsia e pode causar depressão respiratória grave materna e fetal, além de mascarar o nível de consciência e dificultar a avaliação neurológica.",
      },
      {
        texto:
          "Realizar apenas restrição hídrica rigorosa e aguardar o início do parto espontâneo.",
        correta: false,
        feedback:
          "O QUADRO SE AGRAVOU! Pré-eclâmpsia grave é emergência obstétrica. A omissão do tratamento medicamentoso evolui para eclâmpsia, DPP e Síndrome HELLP.",
      },
      {
        texto:
          "Manter a paciente em ambiente com iluminação intensa para avaliar a reatividade pupilar de forma constante.",
        correta: false,
        feedback:
          "VOCÊ COLOCOU O PACIENTE EM RISCO! Estímulos luminosos e sonoros são gatilhos de convulsão em pacientes com irritabilidade cortical. O ambiente deve ser calmo e com luz reduzida.",
      },
    ],
    referencias: [
      "FEBRASGO. Protocolo de Pré-eclâmpsia e Eclâmpsia, 2023.",
      "MINISTÉRIO DA SAÚDE. Gestação de Alto Risco — Manual Técnico, 2022.",
      "COFEN. Resolução nº 736/2024. Processo de Enfermagem.",
    ],
  },
  {
    id: "15-rn-desconforto-respiratorio",
    titulo: "RN Prematuro com Desconforto Respiratório (DMH)",
    setor: "UTI Neonatal",
    paciente: {
      nome: "RN de Glória",
      idade: 0,
      leito: "UTIN-02",
      avatar: "👶",
      diagnostico: "Prematuro 32 semanas, 1.500 g, Doença da Membrana Hialina",
      queixa:
        "Gemência expiratória audível, batimento de asa de nariz e retração esternal importante.",
      status: "critico",
    },
    vitais: {
      paSistolica: 60,
      paDiastolica: 35,
      fc: 165,
      fr: 72,
      temp: 36.4,
      spo2: 84,
    },
    pergunta:
      "Qual a intervenção imediata para melhorar a expansão alveolar e reduzir o esforço respiratório deste neonato?",
    opcoes: [
      {
        texto:
          "Instalar CPAP nasal precocemente para manter a pressão positiva, garantir ambiente térmico neutro e preparar materiais para administração de Surfactante se indicado.",
        correta: true,
        feedback:
          "PARABÉNS! VOCÊ ESTÁ NO CAMINHO CERTO. O CPAP evita o colapso alveolar ao final da expiração, fundamental na deficiência de surfactante. A manutenção da temperatura evita o aumento do consumo de oxigênio pelo estresse térmico.",
      },
      {
        texto:
          "Realizar aspiração orofaríngea e traqueal profunda a cada 15 minutos para garantir a patência das vias aéreas.",
        correta: false,
        feedback:
          "O QUADRO SE AGRAVOU! A aspiração profunda e frequente em prematuros causa dor, hipóxia, bradicardia reflexa e aumenta o risco de hemorragia peri-intraventricular pela instabilidade hemodinâmica.",
      },
      {
        texto:
          "Ofertar oxigênio em fluxo livre (inalação) a 10 L/min posicionado próximo à face do recém-nascido.",
        correta: false,
        feedback:
          "VOCÊ COLOCOU O PACIENTE EM RISCO! O O2 livre não fornece pressão para abrir alvéolos colapsados. Hiperóxia sem controle de FiO2 é tóxica e aumenta risco de retinopatia da prematuridade e displasia broncopulmonar.",
      },
      {
        texto:
          "Estimular o choro vigoroso do RN para que a expansão pulmonar ocorra de forma fisiológica e natural.",
        correta: false,
        feedback:
          "VOCÊ MATOU O PACIENTE! O prematuro não possui surfactante suficiente para vencer a tensão superficial. O esforço para chorar leva à exaustão muscular, acidose respiratória e PCR.",
      },
    ],
    referencias: [
      "SOCIEDADE BRASILEIRA DE PEDIATRIA. Reanimação do Recém-Nascido ≥34 semanas e <34 semanas, 2022.",
      "MINISTÉRIO DA SAÚDE. Atenção Humanizada ao Recém-Nascido — Método Canguru, 2017.",
      "COFEN. Resolução nº 564/2017. Código de Ética dos Profissionais de Enfermagem.",
    ],
  },
  {
    id: "16-desidratacao-grave-pediatrica",
    titulo: "Desidratação Grave por Gastroenterite em Pediatria",
    setor: "Pronto-Socorro Infantil",
    paciente: {
      nome: "Júlia",
      idade: 8,
      leito: "PED-07",
      avatar: "👧",
      diagnostico: "Gastroenterite aguda com desidratação grave e choque hipovolêmico",
      queixa:
        "Múltiplos episódios de vômitos e diarreia há 48 h. Letárgica, olhos encovados, ausência de lágrimas, prega cutânea > 2 s, pulso radial fino e rápido.",
      status: "critico",
    },
    vitais: {
      paSistolica: 80,
      paDiastolica: 45,
      fc: 160,
      fr: 38,
      temp: 37.8,
      spo2: 94,
    },
    pergunta:
      "Qual a conduta de enfermagem prioritária para a reversão do choque hipovolêmico nesta criança?",
    opcoes: [
      {
        texto:
          "Iniciar expansão volêmica imediata com Cristaloides (Soro Fisiológico 0,9%) na dose de 20 ml/kg em bólus, monitorando continuamente sinais vitais e nível de consciência.",
        correta: true,
        feedback:
          "PARABÉNS! VOCÊ ESTÁ NO CAMINHO CERTO. Na desidratação grave com sinais de choque, a via parenteral é mandatória. A expansão rápida restaura o volume intravascular e a perfusão de órgãos vitais (NIC: Redução do Choque: Volume).",
      },
      {
        texto:
          "Tentar a administração forçada de Soro de Reidratação Oral (SRO) em pequenas colheres, apesar da letargia da criança.",
        correta: false,
        feedback:
          "VOCÊ MATOU O PACIENTE! Crianças letárgicas possuem rebaixamento do nível de consciência e perda dos reflexos protetores. A hidratação oral forçada resulta em broncoaspiração e pneumonia aspirativa.",
      },
      {
        texto:
          "Administrar antiemético intramuscular e aguardar 60 minutos para observar se a criança aceita dieta leve.",
        correta: false,
        feedback:
          "O QUADRO SE AGRAVOU! O tempo é crítico no choque hipovolêmico. Aguardar sem repor volume leva à falência renal aguda e choque irreversível.",
      },
      {
        texto:
          "Realizar banho de imersão prolongado para hidratar a pele por osmose e reduzir a temperatura corporal.",
        correta: false,
        feedback:
          "VOCÊ COLOCOU O PACIENTE EM RISCO! A hidratação cutânea não corrige o déficit volêmico interno. O banho causa hipotermia e estresse metabólico em criança hemodinamicamente instável.",
      },
    ],
    referencias: [
      "SOCIEDADE BRASILEIRA DE PEDIATRIA. Tratamento da Diarreia Aguda na Criança, 2022.",
      "OMS/UNICEF. Manejo Integrado das Doenças Prevalentes na Infância (AIDPI), 2014.",
      "COFEN. Resolução nº 736/2024. Processo de Enfermagem.",
    ],
  },
  {
    id: "17-agitacao-psicomotora",
    titulo: "Manejo de Agitação Psicomotora em Surto Psicótico",
    setor: "Emergência Psiquiátrica",
    paciente: {
      nome: "Sr. Cláudio",
      idade: 35,
      leito: "PSI-01",
      avatar: "🧑",
      diagnostico: "Surto psicótico agudo com agitação psicomotora e risco de auto/heteroagressão",
      queixa:
        "Extremamente agitado, proferindo ameaças à equipe e tentando golpear a própria cabeça contra a parede.",
      status: "critico",
    },
    vitais: {
      paSistolica: 150,
      paDiastolica: 95,
      fc: 128,
      fr: 26,
      temp: 36.9,
      spo2: 97,
    },
    pergunta:
      "Qual a prioridade da equipe de enfermagem para garantir a integridade física do paciente e a segurança do ambiente?",
    opcoes: [
      {
        texto:
          "Implementar contenção mecânica terapêutica conforme protocolo ético e técnico, manter vigilância 1:1, retirar objetos de risco do entorno e administrar medicação de urgência conforme prescrição.",
        correta: true,
        feedback:
          "PARABÉNS! VOCÊ ESTÁ NO CAMINHO CERTO. Em situações de risco iminente de auto ou heteroagressão, a contenção mecânica é medida de proteção, não punição. Deve ser realizada por equipe treinada, com monitorização constante de perfusão e nível de consciência (NIC: Controle do Comportamento: Autolesão).",
      },
      {
        texto:
          "Utilizar força física punitiva e confrontação verbal para demonstrar autoridade e conter o comportamento do paciente.",
        correta: false,
        feedback:
          "O QUADRO SE AGRAVOU! A confrontação em surto psicótico aumenta paranoia e agressividade. O uso de força desmedida viola direitos humanos e o Código de Ética, resultando em lesões para paciente e equipe.",
      },
      {
        texto:
          "Isolar o paciente em um quarto trancado e sem janelas para que ele se acalme sem interferência externa.",
        correta: false,
        feedback:
          "VOCÊ MATOU O PACIENTE! O isolamento sem vigilância em pacientes agitados é extremamente perigoso. O paciente pode sofrer evento cardiovascular pelo estresse extremo ou conseguir se autoagredir fatalmente sem que a equipe perceba a tempo.",
      },
      {
        texto:
          "Tentar convencer o paciente, através de argumentos lógicos e racionais, de que suas alucinações não são reais.",
        correta: false,
        feedback:
          "VOCÊ COLOCOU O PACIENTE EM RISCO! Durante o surto agudo, a crítica está suspensa. Tentar 'desmentir' o delírio gera frustração e aumenta a agitação. A abordagem deve ser empática, focada na segurança e na redução de estímulos.",
      },
    ],
    referencias: [
      "COFEN. Resolução nº 427/2012. Normatiza os procedimentos de contenção mecânica de pacientes.",
      "COFEN. Resolução nº 564/2017. Código de Ética dos Profissionais de Enfermagem.",
      "MINISTÉRIO DA SAÚDE. Política Nacional de Saúde Mental — Lei nº 10.216/2001.",
    ],
  },
  {
    id: "18-pneumotorax-hipertensivo",
    titulo: "Trauma Multissistêmico — Pneumotórax Hipertensivo",
    setor: "Sala de Trauma",
    paciente: {
      nome: "Sr. Roberto",
      idade: 35,
      leito: "TR-01",
      avatar: "🧑",
      diagnostico: "Pneumotórax hipertensivo e choque obstrutivo pós-colisão frontal de alta energia",
      queixa:
        "Murmúrio vesicular abolido à direita, expansibilidade reduzida, desvio de traqueia para a esquerda e turgência jugular.",
      status: "critico",
    },
    vitais: {
      paSistolica: 80,
      paDiastolica: 40,
      fc: 130,
      fr: 32,
      temp: 36.2,
      spo2: 84,
    },
    pergunta:
      "Diante da suspeita de Pneumotórax Hipertensivo e Choque Obstrutivo, qual a conduta imediata do enfermeiro na equipe de trauma?",
    opcoes: [
      {
        texto:
          "Auxiliar imediatamente na descompressão torácica por agulha (toracocentese) no 5º espaço intercostal, linha axilar média, seguida de drenagem torácica em selo d'água, mantendo ressuscitação volêmica controlada.",
        correta: true,
        feedback:
          "PARABÉNS! VOCÊ ESTÁ NO CAMINHO CERTO. O pneumotórax hipertensivo é uma ameaça imediata à vida (Letra B do ABCDE). A descompressão rápida reverte o choque obstrutivo e permite a reexpansão pulmonar, salvando o paciente do óbito iminente.",
      },
      {
        texto:
          "Encaminhar o paciente imediatamente para Raio-X de tórax e Tomografia de corpo inteiro para confirmar a lesão antes de qualquer procedimento invasivo.",
        correta: false,
        feedback:
          "VOCÊ MATOU O PACIENTE! O diagnóstico de pneumotórax hipertensivo é CLÍNICO. Aguardar exames de imagem em um paciente com PA 80/40 e desvio de traqueia é falha fatal. O paciente entrará em PCR antes de chegar ao raio-x.",
      },
      {
        texto:
          "Administrar 2000ml de Soro Fisiológico 0,9% em fluxo livre para elevar a PA antes de avaliar a respiração.",
        correta: false,
        feedback:
          "O QUADRO SE AGRAVOU! No choque obstrutivo por pneumotórax, o problema não é falta de volume, mas a incapacidade do coração de bombear pelo aumento da pressão intratorácica. O excesso de volume causa edema agudo e não resolve a causa base.",
      },
      {
        texto:
          "Retirar o colar cervical e a prancha rígida para facilitar a ausculta pulmonar e a palpação abdominal.",
        correta: false,
        feedback:
          "VOCÊ COLOCOU O PACIENTE EM RISCO! A manipulação sem proteção da coluna em vítimas de colisão de alta energia pode causar lesão medular irreversível. O exame deve ser feito mantendo a imobilização conforme o protocolo PHTLS.",
      },
    ],
    referencias: [
      "NAEMT. PHTLS: Prehospital Trauma Life Support. 10th ed. Jones & Bartlett, 2023.",
      "AMERICAN COLLEGE OF SURGEONS. ATLS: Advanced Trauma Life Support. 10th ed. Chicago, 2018.",
      "COFEN. Resolução nº 564/2017. Código de Ética dos Profissionais de Enfermagem.",
    ],
  },
  {
    id: "19-trauma-abdominal-baco",
    titulo: "Trauma Abdominal Fechado — Lesão de Baço",
    setor: "Sala de Trauma",
    paciente: {
      nome: "Paciente Jovem",
      idade: 22,
      leito: "TR-02",
      avatar: "🧑",
      diagnostico: "Choque hipovolêmico grau IV por provável hemoperitônio (lesão esplênica)",
      queixa:
        "Dor intensa em hipocôndrio esquerdo, sinal de Kehr positivo, abdome distendido e rígido, palidez extrema pós-queda de moto.",
      status: "critico",
    },
    vitais: {
      paSistolica: 70,
      paDiastolica: 40,
      fc: 145,
      fr: 30,
      temp: 35.4,
      spo2: 90,
    },
    pergunta:
      "Qual a prioridade de enfermagem no manejo do Choque Hipovolêmico Grau IV por provável hemoperitônio?",
    opcoes: [
      {
        texto:
          "Garantir dois acessos venosos calibrosos (14G ou 16G), iniciar protocolo de transfusão maciça (sangue total ou componentes), aquecer o paciente para prevenir a tríade da morte e preparar para laparotomia de urgência.",
        correta: true,
        feedback:
          "PARABÉNS! VOCÊ ESTÁ NO CAMINHO CERTO. No choque hemorrágico grave por lesão de baço, a reposição com cristaloides deve ser mínima, priorizando hemoderivados. O controle da temperatura é vital para evitar a coagulopatia.",
      },
      {
        texto:
          "Realizar lavagem gástrica com soro gelado para verificar se há sangue no estômago e acalmar a dor abdominal com compressas frias.",
        correta: false,
        feedback:
          "O QUADRO SE AGRAVOU! A lavagem gástrica não tem indicação no trauma abdominal fechado e as compressas frias aceleram a hipotermia, que faz parte da tríade da morte no trauma, piorando a hemorragia.",
      },
      {
        texto:
          "Aguardar a estabilização da PA (mínimo 120/80 mmHg) apenas com Soro Glicosado 5% antes de levar ao Centro Cirúrgico.",
        correta: false,
        feedback:
          "VOCÊ MATOU O PACIENTE! O soro glicosado não repõe volume intravascular efetivamente. Tentar normalizar a PA em sangramentos ativos não controlados (ressuscitação agressiva) 'expulsa' os coágulos formados e aumenta a hemorragia.",
      },
      {
        texto:
          "Administrar morfina endovenosa em bólus para aliviar a dor abdominal intensa e facilitar o exame físico.",
        correta: false,
        feedback:
          "VOCÊ MATOU O PACIENTE! Administrar opioides em bólus em paciente com PA 70/40 causa colapso cardiovascular e depressão respiratória imediata. A dor é sinal clínico importante que não deve ser mascarado antes da decisão cirúrgica.",
      },
    ],
    referencias: [
      "AMERICAN COLLEGE OF SURGEONS. ATLS: Advanced Trauma Life Support. 10th ed. Chicago, 2018.",
      "NAEMT. PHTLS: Prehospital Trauma Life Support. 10th ed. Jones & Bartlett, 2023.",
      "MINISTÉRIO DA SAÚDE. Protocolos de Suporte Básico e Avançado de Vida. Brasília, 2022.",
    ],
  },
  {
    id: "20-politrauma-hemorragia-exanguinante",
    titulo: "Politrauma — Hemorragia Exanguinante (XABCDE)",
    setor: "Sala de Trauma",
    paciente: {
      nome: "Sr. Carlos",
      idade: 50,
      leito: "TR-03",
      avatar: "🧑",
      diagnostico: "Politrauma com fraturas expostas bilaterais e sangramento arterial ativo em jato",
      queixa:
        "Atropelamento por caminhão. Sangramento arterial em jato volumoso em ambos os membros inferiores.",
      status: "critico",
    },
    vitais: {
      paSistolica: 85,
      paDiastolica: 50,
      fc: 140,
      fr: 28,
      temp: 35.8,
      spo2: 92,
    },
    pergunta:
      "Qual a primeira ação do enfermeiro ao receber o paciente na sala de trauma, seguindo a atualização do protocolo XABCDE?",
    opcoes: [
      {
        texto:
          "Aplicar torniquete comercial ou curativo compressivo efetivo imediatamente nos sítios de hemorragia exanguinante nos membros inferiores, antes mesmo de avaliar a via aérea.",
        correta: true,
        feedback:
          "PARABÉNS! VOCÊ ESTÁ NO CAMINHO CERTO. O 'X' (Hemorragia Exanguinante) precede o 'A'. Um sangramento arterial de fêmur pode levar ao óbito por choque hipovolêmico em menos de 3 minutos, antes que a hipóxia por via aérea o faça.",
      },
      {
        texto:
          "Iniciar imediatamente a intubação orotraqueal, pois a proteção da via aérea é sempre a prioridade número 1 em qualquer protocolo de trauma.",
        correta: false,
        feedback:
          "VOCÊ MATOU O PACIENTE! Se você focar na via aérea enquanto o paciente perde litros de sangue por uma fratura exposta, ele entrará em PCR por hipovolemia exanguinante antes de você terminar a intubação.",
      },
      {
        texto:
          "Lavar as feridas expostas com SF 0,9% abundante e tentar alinhar os ossos fraturados para reduzir a dor e o sangramento.",
        correta: false,
        feedback:
          "O QUADRO SE AGRAVOU! A limpeza e o alinhamento são etapas secundárias. No trauma agudo, o foco é a HEMOSTASIA. Manipular fraturas sem controle do sangramento e sem estabilização pode aumentar a lesão vascular e nervosa.",
      },
      {
        texto:
          "Solicitar que o paciente assine o termo de consentimento para cirurgia antes de realizar qualquer manobra invasiva.",
        correta: false,
        feedback:
          "VOCÊ COLOCOU O PACIENTE EM RISCO! Em emergências com risco de morte, o dever de socorro precede formalidades burocráticas. O tempo perdido com papelada é tempo retirado da sobrevivência do paciente.",
      },
    ],
    referencias: [
      "NAEMT. PHTLS: Prehospital Trauma Life Support. 10th ed. Jones & Bartlett, 2023.",
      "AMERICAN COLLEGE OF SURGEONS. ATLS: Advanced Trauma Life Support. 10th ed. Chicago, 2018.",
      "COFEN. Resolução nº 736/2024. Processo de Enfermagem.",
    ],
  },
];
