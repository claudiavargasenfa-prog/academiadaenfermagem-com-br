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
];
