export type LandingField = { key: string; label: string; group: string; defaultValue: string; kind: string };

export function safeLandingUrl(value: string, fallback: string): string {
  if (value.startsWith('#') || (value.startsWith('/') && !value.startsWith('//') && !value.includes('\\'))) return value;
  try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password ? value : fallback; } catch { return fallback; }
}

export const ADEC_FIELDS: LandingField[] = [
  { key: "annual_price_tecnico-estudante", label: "Preço exibido — Estudante de Técnico", group: "Planos anuais", defaultValue: "R$ 37,99", kind: "text" },
  { key: "annual_price_tecnico", label: "Preço exibido — Técnico", group: "Planos anuais", defaultValue: "R$ 57,99", kind: "text" },
  { key: "annual_price_academico", label: "Preço exibido — Acadêmico", group: "Planos anuais", defaultValue: "R$ 77,99", kind: "text" },
  { key: "annual_price_enfermeiro", label: "Preço exibido — Enfermeiro", group: "Planos anuais", defaultValue: "R$ 97,99", kind: "text" },
  {
    "key": "pagina_3",
    "label": "QUERO TESTAR GRÁTIS POR 15 DIAS →",
    "group": "Apresentação e cartões",
    "defaultValue": "ADQUIRIR ACESSO ANUAL →",
    "kind": "text"
  },
  {
    "key": "pagina_4",
    "label": "SIM, QUERO TRANSFORMAR MEU PLANTÃO",
    "group": "Apresentação e cartões",
    "defaultValue": "SIM, QUERO TRANSFORMAR MEU PLANTÃO",
    "kind": "text"
  },
  {
    "key": "pagina_5",
    "label": "COMEÇAR MEU TESTE GRÁTIS →",
    "group": "Apresentação e cartões",
    "defaultValue": "ESCOLHER MINHA ACADEMIA →",
    "kind": "text"
  },
  {
    "key": "pagina_7",
    "label": "Academia do Acadêmico",
    "group": "Academias e benefícios",
    "defaultValue": "Academia do Acadêmico",
    "kind": "text"
  },
  {
    "key": "pagina_8",
    "label": "Para o graduando de Enfermagem",
    "group": "Academias e benefícios",
    "defaultValue": "Para o graduando de Enfermagem",
    "kind": "text"
  },
  {
    "key": "pagina_9",
    "label": "Do primeiro ao último estágio, sem sofrer.",
    "group": "Academias e benefícios",
    "defaultValue": "Do primeiro ao último estágio, sem sofrer.",
    "kind": "text"
  },
  {
    "key": "pagina_10",
    "label": "Chegue no estágio sabendo exatamente o que fazer",
    "group": "Academias e benefícios",
    "defaultValue": "Chegue no estágio sabendo exatamente o que fazer",
    "kind": "text"
  },
  {
    "key": "pagina_11",
    "label": "Escalas clínicas na mão — sem caçar PDF na hora",
    "group": "Academias e benefícios",
    "defaultValue": "Escalas clínicas na mão — sem caçar PDF na hora",
    "kind": "text"
  },
  {
    "key": "pagina_12",
    "label": "Procedimentos passo a passo antes de encostar no paciente",
    "group": "Academias e benefícios",
    "defaultValue": "Procedimentos passo a passo antes de encostar no paciente",
    "kind": "text"
  },
  {
    "key": "pagina_13",
    "label": "Obstetrícia, saúde mental e IRAS explicados de verdade",
    "group": "Academias e benefícios",
    "defaultValue": "Obstetrícia, saúde mental e IRAS explicados de verdade",
    "kind": "text"
  },
  {
    "key": "pagina_14",
    "label": "Passe nas provas sem abrir mão do seu descanso",
    "group": "Academias e benefícios",
    "defaultValue": "Passe nas provas sem abrir mão do seu descanso",
    "kind": "text"
  },
  {
    "key": "pagina_15",
    "label": "Estudante de Técnico",
    "group": "Academias e benefícios",
    "defaultValue": "Estudante de Técnico",
    "kind": "text"
  },
  {
    "key": "pagina_16",
    "label": "Para quem ainda está no curso técnico",
    "group": "Academias e benefícios",
    "defaultValue": "Para quem ainda está no curso técnico",
    "kind": "text"
  },
  {
    "key": "pagina_17",
    "label": "Passa na prova, encara o campo com confiança.",
    "group": "Academias e benefícios",
    "defaultValue": "Passa na prova, encara o campo com confiança.",
    "kind": "text"
  },
  {
    "key": "pagina_18",
    "label": "Reconheça sinais de alerta sem travar na hora",
    "group": "Academias e benefícios",
    "defaultValue": "Reconheça sinais de alerta sem travar na hora",
    "kind": "text"
  },
  {
    "key": "pagina_19",
    "label": "Nunca mais tenha medo de errar uma medicação",
    "group": "Academias e benefícios",
    "defaultValue": "Nunca mais tenha medo de errar uma medicação",
    "kind": "text"
  },
  {
    "key": "pagina_20",
    "label": "Simulações reais de plantão para perder o nervosismo",
    "group": "Academias e benefícios",
    "defaultValue": "Simulações reais de plantão para perder o nervosismo",
    "kind": "text"
  },
  {
    "key": "pagina_21",
    "label": "Checklists que evitam o famoso branco no campo",
    "group": "Academias e benefícios",
    "defaultValue": "Checklists que evitam o famoso branco no campo",
    "kind": "text"
  },
  {
    "key": "pagina_22",
    "label": "Passe nas provas sem abrir mão do seu descanso",
    "group": "Academias e benefícios",
    "defaultValue": "Passe nas provas sem abrir mão do seu descanso",
    "kind": "text"
  },
  {
    "key": "pagina_23",
    "label": "Academia do Técnico",
    "group": "Academias e benefícios",
    "defaultValue": "Academia do Técnico",
    "kind": "text"
  },
  {
    "key": "pagina_24",
    "label": "Para o Técnico em Enfermagem atuando",
    "group": "Academias e benefícios",
    "defaultValue": "Para o Técnico em Enfermagem atuando",
    "kind": "text"
  },
  {
    "key": "pagina_25",
    "label": "Prática segura, plantão tranquilo.",
    "group": "Academias e benefícios",
    "defaultValue": "Prática segura, plantão tranquilo.",
    "kind": "text"
  },
  {
    "key": "pagina_26",
    "label": "Ganhe horas de sono no pós-plantão com anotação automática",
    "group": "Academias e benefícios",
    "defaultValue": "Ganhe horas de sono no pós-plantão com anotação automática",
    "kind": "text"
  },
  {
    "key": "pagina_27",
    "label": "Vários pacientes organizados por abas, sem se perder",
    "group": "Academias e benefícios",
    "defaultValue": "Vários pacientes organizados por abas, sem se perder",
    "kind": "text"
  },
  {
    "key": "pagina_28",
    "label": "Nunca mais tenha medo de errar uma medicação",
    "group": "Academias e benefícios",
    "defaultValue": "Nunca mais tenha medo de errar uma medicação",
    "kind": "text"
  },
  {
    "key": "pagina_29",
    "label": "Saia do plantão no horário, com tudo registrado",
    "group": "Academias e benefícios",
    "defaultValue": "Saia do plantão no horário, com tudo registrado",
    "kind": "text"
  },
  {
    "key": "pagina_30",
    "label": "Passe nas provas sem abrir mão do seu descanso",
    "group": "Academias e benefícios",
    "defaultValue": "Passe nas provas sem abrir mão do seu descanso",
    "kind": "text"
  },
  {
    "key": "pagina_31",
    "label": "Academia do Enfermeiro",
    "group": "Academias e benefícios",
    "defaultValue": "Academia do Enfermeiro",
    "kind": "text"
  },
  {
    "key": "pagina_32",
    "label": "Para o Enfermeiro assistencial e liderança",
    "group": "Academias e benefícios",
    "defaultValue": "Para o Enfermeiro assistencial e liderança",
    "kind": "text"
  },
  {
    "key": "pagina_33",
    "label": "Menos burocracia, mais assistência com tranquilidade.",
    "group": "Academias e benefícios",
    "defaultValue": "Menos burocracia, mais assistência com tranquilidade.",
    "kind": "text"
  },
  {
    "key": "pagina_34",
    "label": "Evolução e prescrição prontas em 2 cliques",
    "group": "Academias e benefícios",
    "defaultValue": "Evolução e prescrição prontas em 2 cliques",
    "kind": "text"
  },
  {
    "key": "pagina_35",
    "label": "Ganhe horas de sono no pós-plantão",
    "group": "Academias e benefícios",
    "defaultValue": "Ganhe horas de sono no pós-plantão",
    "kind": "text"
  },
  {
    "key": "pagina_36",
    "label": "Durma tranquila: tudo amparado por COFEN/COREN",
    "group": "Academias e benefícios",
    "defaultValue": "Durma tranquila: tudo amparado por COFEN/COREN",
    "kind": "text"
  },
  {
    "key": "pagina_37",
    "label": "Acompanhe o plantão inteiro sem perder nenhum registro",
    "group": "Academias e benefícios",
    "defaultValue": "Acompanhe o plantão inteiro sem perder nenhum registro",
    "kind": "text"
  },
  {
    "key": "pagina_38",
    "label": "Passe nas provas e concursos sem abrir mão do descanso",
    "group": "Academias e benefícios",
    "defaultValue": "Passe nas provas e concursos sem abrir mão do descanso",
    "kind": "text"
  },
  {
    "key": "pagina_39",
    "label": "Ganhe horas de sono no pós-plantão",
    "group": "Benefícios dos módulos",
    "defaultValue": "Ganhe horas de sono no pós-plantão",
    "kind": "text"
  },
  {
    "key": "pagina_40",
    "label": "A anotação técnica sai pronta enquanto você cuida. Você sai no horário e chega inteira em casa.",
    "group": "Benefícios dos módulos",
    "defaultValue": "A anotação técnica sai pronta enquanto você cuida. Você sai no horário e chega inteira em casa.",
    "kind": "text"
  },
  {
    "key": "pagina_41",
    "label": "Nunca mais tenha medo de errar uma medicação",
    "group": "Benefícios dos módulos",
    "defaultValue": "Nunca mais tenha medo de errar uma medicação",
    "kind": "text"
  },
  {
    "key": "pagina_42",
    "label": "Farmacologia, diluição e aprazamento conferidos para você agir com segurança na correria.",
    "group": "Benefícios dos módulos",
    "defaultValue": "Farmacologia, diluição e aprazamento conferidos para você agir com segurança na correria.",
    "kind": "text"
  },
  {
    "key": "pagina_43",
    "label": "Passe nas provas sem abrir mão do seu descanso",
    "group": "Benefícios dos módulos",
    "defaultValue": "Passe nas provas sem abrir mão do seu descanso",
    "kind": "text"
  },
  {
    "key": "pagina_44",
    "label": "Quizzes por tema com feedback imediato: estude pouco, fixe muito, durma bem.",
    "group": "Benefícios dos módulos",
    "defaultValue": "Quizzes por tema com feedback imediato: estude pouco, fixe muito, durma bem.",
    "kind": "text"
  },
  {
    "key": "pagina_45",
    "label": "Pare de travar na frente do papel",
    "group": "Benefícios dos módulos",
    "defaultValue": "Pare de travar na frente do papel",
    "kind": "text"
  },
  {
    "key": "pagina_46",
    "label": "A SAE monta diagnóstico e prescrição a partir dos sinais e sintomas que você marcou.",
    "group": "Benefícios dos módulos",
    "defaultValue": "A SAE monta diagnóstico e prescrição a partir dos sinais e sintomas que você marcou.",
    "kind": "text"
  },
  {
    "key": "pagina_47",
    "label": "Segurança na beira do leito",
    "group": "Benefícios dos módulos",
    "defaultValue": "Segurança na beira do leito",
    "kind": "text"
  },
  {
    "key": "pagina_48",
    "label": "22+ escalas clínicas prontas e offline — decisão rápida, sem insegurança.",
    "group": "Benefícios dos módulos",
    "defaultValue": "22+ escalas clínicas prontas e offline — decisão rápida, sem insegurança.",
    "kind": "text"
  },
  {
    "key": "pagina_49",
    "label": "Confiança antes do procedimento",
    "group": "Benefícios dos módulos",
    "defaultValue": "Confiança antes do procedimento",
    "kind": "text"
  },
  {
    "key": "pagina_50",
    "label": "Punção, SVD, SNG e curativos passo a passo, para você nunca mais ficar na dúvida.",
    "group": "Benefícios dos módulos",
    "defaultValue": "Punção, SVD, SNG e curativos passo a passo, para você nunca mais ficar na dúvida.",
    "kind": "text"
  },
  {
    "key": "pagina_51",
    "label": "Uma hora a mais no posto terminando anotação",
    "group": "Comparativo sem e com ADEC",
    "defaultValue": "Uma hora a mais no posto terminando anotação",
    "kind": "text"
  },
  {
    "key": "pagina_52",
    "label": "Caçar PDF de escala no meio do plantão",
    "group": "Comparativo sem e com ADEC",
    "defaultValue": "Caçar PDF de escala no meio do plantão",
    "kind": "text"
  },
  {
    "key": "pagina_53",
    "label": "Medo de errar diluição ou aprazamento",
    "group": "Comparativo sem e com ADEC",
    "defaultValue": "Medo de errar diluição ou aprazamento",
    "kind": "text"
  },
  {
    "key": "pagina_54",
    "label": "Relatório de estágio feito de madrugada",
    "group": "Comparativo sem e com ADEC",
    "defaultValue": "Relatório de estágio feito de madrugada",
    "kind": "text"
  },
  {
    "key": "pagina_55",
    "label": "Insegurança sobre o que a COFEN exige",
    "group": "Comparativo sem e com ADEC",
    "defaultValue": "Insegurança sobre o que a COFEN exige",
    "kind": "text"
  },
  {
    "key": "pagina_56",
    "label": "Anotação e evolução prontas em 2 cliques",
    "group": "Comparativo sem e com ADEC",
    "defaultValue": "Anotação e evolução prontas em 2 cliques",
    "kind": "text"
  },
  {
    "key": "pagina_57",
    "label": "22+ escalas clínicas offline, na palma da mão",
    "group": "Comparativo sem e com ADEC",
    "defaultValue": "22+ escalas clínicas offline, na palma da mão",
    "kind": "text"
  },
  {
    "key": "pagina_58",
    "label": "Cálculo e aprazamento conferidos passo a passo",
    "group": "Comparativo sem e com ADEC",
    "defaultValue": "Cálculo e aprazamento conferidos passo a passo",
    "kind": "text"
  },
  {
    "key": "pagina_59",
    "label": "Diário de bordo vira relatório em ABNT",
    "group": "Comparativo sem e com ADEC",
    "defaultValue": "Diário de bordo vira relatório em ABNT",
    "kind": "text"
  },
  {
    "key": "pagina_60",
    "label": "Conteúdo ancorado em COFEN, ANVISA, MS e OMS",
    "group": "Comparativo sem e com ADEC",
    "defaultValue": "Conteúdo ancorado em COFEN, ANVISA, MS e OMS",
    "kind": "text"
  },
  {
    "key": "pagina_61",
    "label": "COFEN",
    "group": "Base legal e científica",
    "defaultValue": "COFEN",
    "kind": "text"
  },
  {
    "key": "pagina_62",
    "label": "CORENs",
    "group": "Base legal e científica",
    "defaultValue": "CORENs",
    "kind": "text"
  },
  {
    "key": "pagina_63",
    "label": "ANVISA",
    "group": "Base legal e científica",
    "defaultValue": "ANVISA",
    "kind": "text"
  },
  {
    "key": "pagina_64",
    "label": "Ministério da Saúde",
    "group": "Base legal e científica",
    "defaultValue": "Ministério da Saúde",
    "kind": "text"
  },
  {
    "key": "pagina_65",
    "label": "OMS",
    "group": "Base legal e científica",
    "defaultValue": "OMS",
    "kind": "text"
  },
  {
    "key": "pagina_66",
    "label": "PCDT atualizados",
    "group": "Base legal e científica",
    "defaultValue": "PCDT atualizados",
    "kind": "text"
  },
  {
    "key": "pagina_67",
    "label": "Anamnese",
    "group": "Conteúdos dos Mini Apps",
    "defaultValue": "Anamnese",
    "kind": "text"
  },
  {
    "key": "pagina_68",
    "label": "Roteiro de entrevista para colher a história do paciente sem esquecer nada.",
    "group": "Conteúdos dos Mini Apps",
    "defaultValue": "Roteiro de entrevista para colher a história do paciente sem esquecer nada.",
    "kind": "text"
  },
  {
    "key": "pagina_69",
    "label": "Exame Físico",
    "group": "Conteúdos dos Mini Apps",
    "defaultValue": "Exame Físico",
    "kind": "text"
  },
  {
    "key": "pagina_70",
    "label": "Avaliação cefalocaudal passo a passo, com o que registrar em cada segmento.",
    "group": "Conteúdos dos Mini Apps",
    "defaultValue": "Avaliação cefalocaudal passo a passo, com o que registrar em cada segmento.",
    "kind": "text"
  },
  {
    "key": "pagina_71",
    "label": "Diagnósticos de Enfermagem",
    "group": "Conteúdos dos Mini Apps",
    "defaultValue": "Diagnósticos de Enfermagem",
    "kind": "text"
  },
  {
    "key": "pagina_72",
    "label": "Dos sinais e sintomas marcados ao diagnóstico correto, com base científica.",
    "group": "Conteúdos dos Mini Apps",
    "defaultValue": "Dos sinais e sintomas marcados ao diagnóstico correto, com base científica.",
    "kind": "text"
  },
  {
    "key": "pagina_73",
    "label": "Evolução de Enfermagem",
    "group": "Conteúdos dos Mini Apps",
    "defaultValue": "Evolução de Enfermagem",
    "kind": "text"
  },
  {
    "key": "pagina_74",
    "label": "Modelo pronto para descrever o turno de forma técnica e segura.",
    "group": "Conteúdos dos Mini Apps",
    "defaultValue": "Modelo pronto para descrever o turno de forma técnica e segura.",
    "kind": "text"
  },
  {
    "key": "pagina_75",
    "label": "Cálculos de Medicamentos",
    "group": "Conteúdos dos Mini Apps",
    "defaultValue": "Cálculos de Medicamentos",
    "kind": "text"
  },
  {
    "key": "pagina_76",
    "label": "Dose, diluição, gotejamento e bomba de infusão conferidos na hora.",
    "group": "Conteúdos dos Mini Apps",
    "defaultValue": "Dose, diluição, gotejamento e bomba de infusão conferidos na hora.",
    "kind": "text"
  },
  {
    "key": "pagina_77",
    "label": "Farmacologia Clínica",
    "group": "Conteúdos dos Mini Apps",
    "defaultValue": "Farmacologia Clínica",
    "kind": "text"
  },
  {
    "key": "pagina_78",
    "label": "Catálogo A-Z com indicação, cuidados de enfermagem e sinais de alerta.",
    "group": "Conteúdos dos Mini Apps",
    "defaultValue": "Catálogo A-Z com indicação, cuidados de enfermagem e sinais de alerta.",
    "kind": "text"
  },
  {
    "key": "pagina_79",
    "label": "Sinais Vitais",
    "group": "Conteúdos dos Mini Apps",
    "defaultValue": "Sinais Vitais",
    "kind": "text"
  },
  {
    "key": "pagina_80",
    "label": "Valores normais de adulto, idoso, criança e gestante — e quando é alerta.",
    "group": "Conteúdos dos Mini Apps",
    "defaultValue": "Valores normais de adulto, idoso, criança e gestante — e quando é alerta.",
    "kind": "text"
  },
  {
    "key": "pagina_81",
    "label": "Escalas Clínicas",
    "group": "Conteúdos dos Mini Apps",
    "defaultValue": "Escalas Clínicas",
    "kind": "text"
  },
  {
    "key": "pagina_82",
    "label": "22+ escalas (Braden, Glasgow, Morse, dor) prontas para pontuar offline.",
    "group": "Conteúdos dos Mini Apps",
    "defaultValue": "22+ escalas (Braden, Glasgow, Morse, dor) prontas para pontuar offline.",
    "kind": "text"
  },
  {
    "key": "pagina_83",
    "label": "Punção Venosa e Flebite",
    "group": "Conteúdos dos Mini Apps",
    "defaultValue": "Punção Venosa e Flebite",
    "kind": "text"
  },
  {
    "key": "pagina_84",
    "label": "Punção ilustrada passo a passo e os graus de flebite com fotos reais.",
    "group": "Conteúdos dos Mini Apps",
    "defaultValue": "Punção ilustrada passo a passo e os graus de flebite com fotos reais.",
    "kind": "text"
  },
  {
    "key": "pagina_85",
    "label": "Cateterismo Vesical",
    "group": "Conteúdos dos Mini Apps",
    "defaultValue": "Cateterismo Vesical",
    "kind": "text"
  },
  {
    "key": "pagina_86",
    "label": "SVD/SVA feminino e masculino com técnica estéril imagem por imagem.",
    "group": "Conteúdos dos Mini Apps",
    "defaultValue": "SVD/SVA feminino e masculino com técnica estéril imagem por imagem.",
    "kind": "text"
  },
  {
    "key": "pagina_87",
    "label": "SNG e Dispositivos",
    "group": "Conteúdos dos Mini Apps",
    "defaultValue": "SNG e Dispositivos",
    "kind": "text"
  },
  {
    "key": "pagina_88",
    "label": "Sonda enteral, TQT, CVC, PICC e dreno: fixação, higiene e complicações.",
    "group": "Conteúdos dos Mini Apps",
    "defaultValue": "Sonda enteral, TQT, CVC, PICC e dreno: fixação, higiene e complicações.",
    "kind": "text"
  },
  {
    "key": "pagina_89",
    "label": "Curativos e Feridas",
    "group": "Conteúdos dos Mini Apps",
    "defaultValue": "Curativos e Feridas",
    "kind": "text"
  },
  {
    "key": "pagina_90",
    "label": "Escolha da cobertura certa e a técnica correta para cada tipo de lesão.",
    "group": "Conteúdos dos Mini Apps",
    "defaultValue": "Escolha da cobertura certa e a técnica correta para cada tipo de lesão.",
    "kind": "text"
  },
  {
    "key": "pagina_91",
    "label": "IRAS e Precauções",
    "group": "Conteúdos dos Mini Apps",
    "defaultValue": "IRAS e Precauções",
    "kind": "text"
  },
  {
    "key": "pagina_92",
    "label": "Isolamentos, paramentação e bundles para não levar infecção ao paciente.",
    "group": "Conteúdos dos Mini Apps",
    "defaultValue": "Isolamentos, paramentação e bundles para não levar infecção ao paciente.",
    "kind": "text"
  },
  {
    "key": "pagina_93",
    "label": "Segurança do Paciente",
    "group": "Conteúdos dos Mini Apps",
    "defaultValue": "Segurança do Paciente",
    "kind": "text"
  },
  {
    "key": "pagina_94",
    "label": "As metas internacionais aplicadas à rotina, sem teoria solta.",
    "group": "Conteúdos dos Mini Apps",
    "defaultValue": "As metas internacionais aplicadas à rotina, sem teoria solta.",
    "kind": "text"
  },
  {
    "key": "pagina_95",
    "label": "Sepse e Deterioração",
    "group": "Conteúdos dos Mini Apps",
    "defaultValue": "Sepse e Deterioração",
    "kind": "text"
  },
  {
    "key": "pagina_96",
    "label": "Triagem NEWS2, pacote da 1ª hora e o que o enfermeiro faz em cada passo.",
    "group": "Conteúdos dos Mini Apps",
    "defaultValue": "Triagem NEWS2, pacote da 1ª hora e o que o enfermeiro faz em cada passo.",
    "kind": "text"
  },
  {
    "key": "pagina_97",
    "label": "Sala de PCR e Carro de Emergência",
    "group": "Conteúdos dos Mini Apps",
    "defaultValue": "Sala de PCR e Carro de Emergência",
    "kind": "text"
  },
  {
    "key": "pagina_98",
    "label": "Conferência da sala, checklist do carro e sua função na parada.",
    "group": "Conteúdos dos Mini Apps",
    "defaultValue": "Conferência da sala, checklist do carro e sua função na parada.",
    "kind": "text"
  },
  {
    "key": "pagina_99",
    "label": "Simulações Clínicas",
    "group": "Conteúdos dos Mini Apps",
    "defaultValue": "Simulações Clínicas",
    "kind": "text"
  },
  {
    "key": "pagina_100",
    "label": "Casos reais para treinar raciocínio clínico antes de encarar o leito.",
    "group": "Conteúdos dos Mini Apps",
    "defaultValue": "Casos reais para treinar raciocínio clínico antes de encarar o leito.",
    "kind": "text"
  },
  {
    "key": "pagina_101",
    "label": "Quizzes e Simulados",
    "group": "Conteúdos dos Mini Apps",
    "defaultValue": "Quizzes e Simulados",
    "kind": "text"
  },
  {
    "key": "pagina_102",
    "label": "Questões por tema com correção na hora e ranking nacional.",
    "group": "Conteúdos dos Mini Apps",
    "defaultValue": "Questões por tema com correção na hora e ranking nacional.",
    "kind": "text"
  },
  {
    "key": "pagina_103",
    "label": "Obstetrícia, Saúde Mental e Idoso",
    "group": "Conteúdos dos Mini Apps",
    "defaultValue": "Obstetrícia, Saúde Mental e Idoso",
    "kind": "text"
  },
  {
    "key": "pagina_104",
    "label": "Cuidados específicos de cada público explicados de forma prática.",
    "group": "Conteúdos dos Mini Apps",
    "defaultValue": "Cuidados específicos de cada público explicados de forma prática.",
    "kind": "text"
  },
  {
    "key": "pagina_105",
    "label": "Manual de Sobrevivência no Estágio",
    "group": "Conteúdos dos Mini Apps",
    "defaultValue": "Manual de Sobrevivência no Estágio",
    "kind": "text"
  },
  {
    "key": "pagina_106",
    "label": "Mochila, postura e comunicação com o preceptor desde o 1º dia.",
    "group": "Conteúdos dos Mini Apps",
    "defaultValue": "Mochila, postura e comunicação com o preceptor desde o 1º dia.",
    "kind": "text"
  },
  {
    "key": "pagina_107",
    "label": "Certificados",
    "group": "Conteúdos dos Mini Apps",
    "defaultValue": "Certificação em cada módulo",
    "kind": "text"
  },
  {
    "key": "pagina_108",
    "label": "Emissão de certificado ao concluir as trilhas dos módulos.",
    "group": "Conteúdos dos Mini Apps",
    "defaultValue": "Cada Módulo de Decisão Clínica conta com certificado de conclusão e horas complementares, com validação digital.",
    "kind": "text"
  },
  {
    "key": "pagina_109",
    "label": "SAE Descomplicada e Automatizada",
    "group": "Apps automáticos",
    "defaultValue": "SAE Descomplicada e Automatizada",
    "kind": "text"
  },
  {
    "key": "pagina_110",
    "label": "Acadêmico e Enfermeiro",
    "group": "Apps automáticos",
    "defaultValue": "Acadêmico e Enfermeiro",
    "kind": "text"
  },
  {
    "key": "pagina_111",
    "label": "Você marca os sinais e sintomas e o motor clínico cruza tudo com o banco autoral da ADEC.",
    "group": "Motores automatizados",
    "defaultValue": "Você marca os sinais e sintomas do paciente (ou dita por voz) e o motor clínico cruza tudo com o banco autoral da ADEC, devolvendo o Processo de Enfermagem completo.",
    "kind": "text"
  },
  {
    "key": "pagina_112",
    "label": "Marque ou dite as evidências clínicas do paciente",
    "group": "Apps automáticos",
    "defaultValue": "Marque ou dite as evidências clínicas do paciente",
    "kind": "text"
  },
  {
    "key": "pagina_113",
    "label": "O motor clínico sugere diagnósticos e apresenta o mecanismo científico por trás",
    "group": "Motores automatizados",
    "defaultValue": "O motor clínico sugere diagnósticos e apresenta o mecanismo científico por trás",
    "kind": "text"
  },
  {
    "key": "pagina_114",
    "label": "Prescrição, aprazamento e prioridade clínica saem prontos em PDF/DOC",
    "group": "Apps automáticos",
    "defaultValue": "Prescrição, aprazamento e prioridade clínica saem prontos em PDF/DOC",
    "kind": "text"
  },
  {
    "key": "pagina_115",
    "label": "Anotação de Enfermagem Automatizada",
    "group": "Apps automáticos",
    "defaultValue": "Anotação de Enfermagem Automatizada",
    "kind": "text"
  },
  {
    "key": "pagina_116",
    "label": "Técnico e Estudante de Técnico",
    "group": "Apps automáticos",
    "defaultValue": "Técnico e Estudante de Técnico",
    "kind": "text"
  },
  {
    "key": "pagina_117",
    "label": "Durante o plantão você vai marcando o que fez em cada paciente, em abas separadas. No fim, a…",
    "group": "Apps automáticos",
    "defaultValue": "Durante o plantão você vai marcando o que fez em cada paciente, em abas separadas. No fim, a anotação técnica já está escrita.",
    "kind": "text"
  },
  {
    "key": "pagina_118",
    "label": "Um paciente por aba, sem misturar informação",
    "group": "Apps automáticos",
    "defaultValue": "Um paciente por aba, sem misturar informação",
    "kind": "text"
  },
  {
    "key": "pagina_119",
    "label": "Tudo que você marca vira rascunho salvo no aparelho",
    "group": "Apps automáticos",
    "defaultValue": "Tudo que você marca vira rascunho salvo no aparelho",
    "kind": "text"
  },
  {
    "key": "pagina_120",
    "label": "Clique em gerar e a anotação sai pronta para copiar ou baixar",
    "group": "Apps automáticos",
    "defaultValue": "Clique em gerar e a anotação sai pronta para copiar ou baixar",
    "kind": "text"
  },
  {
    "key": "pagina_121",
    "label": "Diário de Bordo — Prévia do seu Relatório em ABNT",
    "group": "Motores automatizados",
    "defaultValue": "Diário de Bordo — Prévia do seu Relatório em ABNT",
    "kind": "text"
  },
  {
    "key": "pagina_122",
    "label": "Acadêmico em estágio",
    "group": "Apps automáticos",
    "defaultValue": "Acadêmico em estágio",
    "kind": "text"
  },
  {
    "key": "pagina_123",
    "label": "Você registra o dia de estágio e o módulo transforma os registros no relatório em ABNT.",
    "group": "Motores automatizados",
    "defaultValue": "Você registra o dia de estágio em poucas linhas e o módulo transforma esses registros no relatório formatado nas normas ABNT.",
    "kind": "text"
  },
  {
    "key": "pagina_124",
    "label": "Anote o que viu e fez a cada dia de estágio",
    "group": "Apps automáticos",
    "defaultValue": "Anote o que viu e fez a cada dia de estágio",
    "kind": "text"
  },
  {
    "key": "pagina_125",
    "label": "O módulo organiza por data, campo e competência",
    "group": "Motores automatizados",
    "defaultValue": "O módulo organiza por data, campo e competência",
    "kind": "text"
  },
  {
    "key": "pagina_126",
    "label": "Gere o relatório final em ABNT sem virar a madrugada",
    "group": "Apps automáticos",
    "defaultValue": "Gere o relatório final em ABNT sem virar a madrugada",
    "kind": "text"
  },
  {
    "key": "pagina_127",
    "label": "Sem cartão no cadastro",
    "group": "Apresentação e cartões",
    "defaultValue": "Pagamento único anual",
    "kind": "text"
  },
  {
    "key": "pagina_128",
    "label": "Funciona offline",
    "group": "Apresentação e cartões",
    "defaultValue": "Funciona offline",
    "kind": "text"
  },
  {
    "key": "pagina_129",
    "label": "Atualizações contínuas",
    "group": "Apresentação e cartões",
    "defaultValue": "Atualizações contínuas",
    "kind": "text"
  },
  {
    "key": "pagina_133",
    "label": "ADEC",
    "group": "Banner coral",
    "defaultValue": "ADEC",
    "kind": "text"
  },
  {
    "key": "pagina_134",
    "label": "Loja completa",
    "group": "Banner coral",
    "defaultValue": "Loja completa",
    "kind": "text"
  },
  {
    "key": "pagina_135",
    "label": "ADEC — Avaliação Diagnóstica em Enfermagem Clínica",
    "group": "Apresentação",
    "defaultValue": "ADEC — Avaliação Diagnóstica em Enfermagem Clínica",
    "kind": "text"
  },
  {
    "key": "pagina_136",
    "label": "Avaliação Diagnóstica em Enfermagem Clínica",
    "group": "Apresentação",
    "defaultValue": "Avaliação Diagnóstica em Enfermagem Clínica",
    "kind": "text"
  },
  {
    "key": "hero_selo",
    "label": "Inauguração oficial — estamos abrindo as portas",
    "group": "Apresentação",
    "defaultValue": "Inauguração oficial — estamos abrindo as portas",
    "kind": "text"
  },
  {
    "key": "hero_title",
    "label": "A ADEC está sendo inaugurada: automatize suas anotações com 2 cliques e foque no paciente.",
    "group": "Apresentação",
    "defaultValue": "A ADEC está sendo inaugurada: automatize suas anotações com 2 cliques e foque no paciente.",
    "kind": "text"
  },
  {
    "key": "hero_sub",
    "label": "Você já saiu do plantão com a sensação de que passou mais tempo preenchendo papel do que cui…",
    "group": "Apresentação",
    "defaultValue": "Você já saiu do plantão com a sensação de que passou mais tempo preenchendo papel do que cuidando? Ou teve aquele medo de errar um cálculo de medicação na correria? Se sim, você não está sozinha. Milhares de enfermeiras vivem isso todos os dias.",
    "kind": "text"
  },
  {
    "key": "pagina_137",
    "label": ": os primeiros assinantes entram com acesso completo e canal direto com a autora",
    "group": "Apresentação",
    "defaultValue": "365 dias de acesso à academia escolhida, com pagamento único",
    "kind": "text"
  },
  {
    "key": "pagina_138",
    "label": "Compra segura · PIX ou cartão só depois do teste",
    "group": "Apresentação",
    "defaultValue": "Pagamento pelo Mercado Pago · acesso após confirmação",
    "kind": "text"
  },
  {
    "key": "pagina_139",
    "label": "Base legal e científica",
    "group": "SELOS EM MARQUEE",
    "defaultValue": "Base legal e científica",
    "kind": "text"
  },
  {
    "key": "pagina_140",
    "label": "Conteúdo construído por quem vive o plantão e o consultório",
    "group": "CREDIBILIDADE — números animados",
    "defaultValue": "Conteúdo construído por quem vive o plantão e o consultório",
    "kind": "text"
  },
  {
    "key": "pagina_141",
    "label": "+ anos",
    "group": "CREDIBILIDADE — números animados",
    "defaultValue": "+ anos",
    "kind": "text"
  },
  {
    "key": "pagina_142",
    "label": "De vivência em enfermagem",
    "group": "CREDIBILIDADE — números animados",
    "defaultValue": "De vivência em enfermagem",
    "kind": "text"
  },
  {
    "key": "pagina_143",
    "label": "+",
    "group": "CREDIBILIDADE — números animados",
    "defaultValue": "+",
    "kind": "text"
  },
  {
    "key": "pagina_144",
    "label": "MSDC — Módulos de Suporte à Decisão Clínica",
    "group": "CREDIBILIDADE — números animados",
    "defaultValue": "MSDC — Módulos de Suporte à Decisão Clínica",
    "kind": "text"
  },
  {
    "key": "pagina_145",
    "label": "+",
    "group": "CREDIBILIDADE — números animados",
    "defaultValue": "+",
    "kind": "text"
  },
  {
    "key": "pagina_146",
    "label": "Escalas clínicas",
    "group": "CREDIBILIDADE — números animados",
    "defaultValue": "Escalas clínicas",
    "kind": "text"
  },
  {
    "key": "pagina_147",
    "label": "%",
    "group": "CREDIBILIDADE — números animados",
    "defaultValue": "%",
    "kind": "text"
  },
  {
    "key": "pagina_148",
    "label": "Base COFEN / COREN",
    "group": "CREDIBILIDADE — números animados",
    "defaultValue": "Base COFEN / COREN",
    "kind": "text"
  },
  {
    "key": "pagina_149",
    "label": "Para quem é",
    "group": "PARA QUEM É",
    "defaultValue": "Para quem é",
    "kind": "text"
  },
  {
    "key": "pagina_150",
    "label": "Escolha a academia da sua fase profissional",
    "group": "PARA QUEM É",
    "defaultValue": "Escolha a academia da sua fase profissional",
    "kind": "text"
  },
  {
    "key": "pagina_151",
    "label": "O que muda na sua vida",
    "group": "BENEFÍCIOS",
    "defaultValue": "O que muda na sua vida",
    "kind": "text"
  },
  {
    "key": "pagina_concurso_titulo",
    "label": "Preparação para provas e concursos",
    "group": "PARA QUEM É",
    "defaultValue": "Preparação para provas e concursos",
    "kind": "text"
  },
  {
    "key": "pagina_concurso_texto",
    "label": "Conteúdo direto ao ponto, questões comentadas e raciocínio clínico para transformar estudo em resultado.",
    "group": "PARA QUEM É",
    "defaultValue": "Conteúdo direto ao ponto, questões comentadas e raciocínio clínico para transformar estudo em resultado.",
    "kind": "text"
  },
  {
    "key": "pagina_152",
    "label": "Não é apenas conteúdo. É o seu plantão de volta.",
    "group": "BENEFÍCIOS",
    "defaultValue": "Não é apenas conteúdo. É o seu plantão de volta.",
    "kind": "text"
  },
  {
    "key": "pagina_153",
    "label": "Cada módulo resolve uma dor concreta do plantão, do consultório ou da prova — com base em ev…",
    "group": "BENEFÍCIOS",
    "defaultValue": "Cada módulo resolve uma dor concreta do plantão, do consultório ou da prova — com base em evidência científica.",
    "kind": "text"
  },
  {
    "key": "pagina_154",
    "label": "Base de dados",
    "group": "BENEFÍCIOS",
    "defaultValue": "Base de dados",
    "kind": "text"
  },
  {
    "key": "pagina_155",
    "label": "Resoluções, normas, diretrizes e protocolos atualizados",
    "group": "BENEFÍCIOS",
    "defaultValue": "Resoluções, normas, diretrizes e protocolos atualizados",
    "kind": "text"
  },
  {
    "key": "pagina_156",
    "label": "COFEN, CORENs, ANVISA, Ministério da Saúde, OMS — sempre em dia.",
    "group": "BENEFÍCIOS",
    "defaultValue": "COFEN, CORENs, ANVISA, Ministério da Saúde, OMS — sempre em dia.",
    "kind": "text"
  },
  {
    "key": "pagina_157",
    "label": "Extra",
    "group": "BENEFÍCIOS",
    "defaultValue": "Certificação avulsa opcional",
    "kind": "text"
  },
  {
    "key": "pagina_158",
    "label": "Com certificação opcional",
    "group": "BENEFÍCIOS",
    "defaultValue": "Cada módulo tem certificado de conclusão com validação digital.",
    "kind": "text"
  },
  {
    "key": "pagina_159",
    "label": "Trilhas com emissão de certificado ao concluir os módulos.",
    "group": "BENEFÍCIOS",
    "defaultValue": "Certificação opcional, contratada separadamente do acesso anual.",
    "kind": "text"
  },
  {
    "key": "pagina_160",
    "label": "Conteúdos",
    "group": "CONTEÚDOS DOS MINI APPS",
    "defaultValue": "Conteúdos",
    "kind": "text"
  },
  {
    "key": "pagina_161",
    "label": "O que você encontra nos Módulos de Decisão Clínica",
    "group": "CONTEÚDOS DOS MÓDULOS",
    "defaultValue": "O que você encontra nos Módulos de Decisão Clínica",
    "kind": "text"
  },
  {
    "key": "pagina_162",
    "label": "Cada módulo resolve um tema de forma direta, para usar no plantão, no estágio, nas provas e nos concursos.",
    "group": "CONTEÚDOS DOS MÓDULOS",
    "defaultValue": "Cada módulo resolve um tema de forma direta, para usar no plantão, no estágio, nas provas e nos concursos.",
    "kind": "text"
  },
  {
    "key": "pagina_163",
    "label": "Exclusivo ADEC",
    "group": "3 APPS AUTOMÁTICOS",
    "defaultValue": "Exclusivo ADEC",
    "kind": "text"
  },
  {
    "key": "pagina_164",
    "label": "3 motores clínicos que transformam dados em documentos prontos",
    "group": "3 MOTORES AUTOMATIZADOS",
    "defaultValue": "3 motores clínicos que transformam dados em documentos prontos",
    "kind": "text"
  },
  {
    "key": "pagina_165",
    "label": "São três ferramentas que transformam o que você marcou em documento pronto — sem digitar tud…",
    "group": "3 APPS AUTOMÁTICOS",
    "defaultValue": "São três ferramentas que transformam o que você marcou em documento pronto — sem digitar tudo de novo.",
    "kind": "text"
  },
  {
    "key": "pagina_166",
    "label": "Automático",
    "group": "3 APPS AUTOMÁTICOS",
    "defaultValue": "Automático",
    "kind": "text"
  },
  {
    "key": "pagina_167",
    "label": "A diferença",
    "group": "COMPARATIVO SEM x COM",
    "defaultValue": "A diferença",
    "kind": "text"
  },
  {
    "key": "pagina_168",
    "label": "Seu plantão sem a ADEC e com a ADEC",
    "group": "COMPARATIVO SEM x COM",
    "defaultValue": "Seu plantão sem a ADEC e com a ADEC",
    "kind": "text"
  },
  {
    "key": "pagina_169",
    "label": "Mesma carga de trabalho. Duas experiências completamente diferentes.",
    "group": "COMPARATIVO SEM x COM",
    "defaultValue": "Mesma carga de trabalho. Duas experiências completamente diferentes.",
    "kind": "text"
  },
  {
    "key": "pagina_170",
    "label": "Sem a ADEC",
    "group": "COMPARATIVO SEM x COM",
    "defaultValue": "Sem a ADEC",
    "kind": "text"
  },
  {
    "key": "pagina_171",
    "label": "Com a ADEC",
    "group": "COMPARATIVO SEM x COM",
    "defaultValue": "Com a ADEC",
    "kind": "text"
  },
  {
    "key": "pagina_172",
    "label": "Na prática",
    "group": "PLANTÃO COM A ACADEMIA",
    "defaultValue": "Na prática",
    "kind": "text"
  },
  {
    "key": "pagina_173",
    "label": "Plantão com a Academia",
    "group": "PLANTÃO COM A ACADEMIA",
    "defaultValue": "Plantão com a Academia",
    "kind": "text"
  },
  {
    "key": "pagina_174",
    "label": "Você sai no horário: anotação e evolução saem prontas do que você já avaliou",
    "group": "PLANTÃO COM A ACADEMIA",
    "defaultValue": "Você sai no horário: anotação e evolução saem prontas do que você já avaliou",
    "kind": "text"
  },
  {
    "key": "pagina_175",
    "label": "Dorme tranquila: medicação e aprazamento conferidos pelas metas de segurança",
    "group": "PLANTÃO COM A ACADEMIA",
    "defaultValue": "Dorme tranquila: medicação e aprazamento conferidos pelas metas de segurança",
    "kind": "text"
  },
  {
    "key": "pagina_176",
    "label": "Nunca mais trava na frente do papel: SAE e prescrição por paciente",
    "group": "PLANTÃO COM A ACADEMIA",
    "defaultValue": "Nunca mais trava na frente do papel: SAE e prescrição por paciente",
    "kind": "text"
  },
  {
    "key": "pagina_177",
    "label": "Decide rápido na beira do leito: 22+ escalas clínicas, offline",
    "group": "PLANTÃO COM A ACADEMIA",
    "defaultValue": "Decide rápido na beira do leito: 22+ escalas clínicas, offline",
    "kind": "text"
  },
  {
    "key": "pagina_178",
    "label": "Encara qualquer procedimento com confiança: passo a passo antes de começar",
    "group": "PLANTÃO COM A ACADEMIA",
    "defaultValue": "Encara qualquer procedimento com confiança: passo a passo antes de começar",
    "kind": "text"
  },
  {
    "key": "pagina_179",
    "label": "Escolha sua academia",
    "group": "PLANOS",
    "defaultValue": "Escolha sua academia",
    "kind": "text"
  },
  {
    "key": "planos_title",
    "label": "4 academias, um só padrão de excelência",
    "group": "PLANOS",
    "defaultValue": "4 academias, um só padrão de excelência",
    "kind": "text"
  },
  {
    "key": "pagina_180",
    "label": "+ escolhido",
    "group": "PLANOS",
    "defaultValue": "+ escolhido",
    "kind": "text"
  },
  {
    "key": "pagina_181",
    "label": "R$ 0,00",
    "group": "PLANOS",
    "defaultValue": "R$ 0,00",
    "kind": "text"
  },
  {
    "key": "pagina_182",
    "label": "/mês",
    "group": "PLANOS",
    "defaultValue": "/ano",
    "kind": "text"
  },
  {
    "key": "pagina_184",
    "label": "Liberação após aprovação do pagamento pelo Mercado Pago.",
    "group": "PLANOS",
    "defaultValue": "Liberação após aprovação do pagamento pelo Mercado Pago.",
    "kind": "text"
  },
  {
    "key": "pagina_185",
    "label": "Acessar minha academia →",
    "group": "PLANOS",
    "defaultValue": "Acessar minha academia →",
    "kind": "text"
  },
  {
    "key": "pagina_186",
    "label": "Certificados reconhecidos",
    "group": "Banner Certificados Reconhecidos",
    "defaultValue": "Certificado em cada módulo",
    "kind": "text"
  },
  {
    "key": "pagina_187",
    "label": "Nossos certificados possuem validade em todo território nacional para comprovação de horas c…",
    "group": "Banner Certificados Reconhecidos",
    "defaultValue": "Conteúdo exclusivo de qualidade, criado por quem entende a prática real da enfermagem. Cada módulo tem certificado de conclusão com validação digital.",
    "kind": "text"
  },
  {
    "key": "pagina_188",
    "label": "Frente (Modelo)",
    "group": "Banner Certificados Reconhecidos",
    "defaultValue": "Frente (Modelo)",
    "kind": "text"
  },
  {
    "key": "pagina_189",
    "label": "/__l5e/assets-v1/e91cb3c7-3513-48d0-9965-4aa88777f5a4/certificado-frente-adec.png",
    "group": "Banner Certificados Reconhecidos",
    "defaultValue": "/__l5e/assets-v1/e91cb3c7-3513-48d0-9965-4aa88777f5a4/certificado-frente-adec.png",
    "kind": "image"
  },
  {
    "key": "pagina_190",
    "label": "Modelo Frente do Certificado ADEC",
    "group": "Banner Certificados Reconhecidos",
    "defaultValue": "Modelo Frente do Certificado ADEC",
    "kind": "text"
  },
  {
    "key": "pagina_192",
    "label": "Modelo Frente do Certificado ADEC",
    "group": "Banner Certificados Reconhecidos",
    "defaultValue": "Modelo Frente do Certificado ADEC",
    "kind": "text"
  },
  {
    "key": "pagina_193",
    "label": "Verso (Modelo)",
    "group": "Banner Certificados Reconhecidos",
    "defaultValue": "Verso (Modelo)",
    "kind": "text"
  },
  {
    "key": "pagina_194",
    "label": "/__l5e/assets-v1/a282d08f-c7c5-4142-9881-0d56deaaac9b/certificado-verso-adec.png",
    "group": "Banner Certificados Reconhecidos",
    "defaultValue": "/__l5e/assets-v1/a282d08f-c7c5-4142-9881-0d56deaaac9b/certificado-verso-adec.png",
    "kind": "image"
  },
  {
    "key": "pagina_195",
    "label": "Modelo Verso do Certificado ADEC",
    "group": "Banner Certificados Reconhecidos",
    "defaultValue": "Modelo Verso do Certificado ADEC",
    "kind": "text"
  },
  {
    "key": "pagina_197",
    "label": "Modelo Verso do Certificado ADEC",
    "group": "Banner Certificados Reconhecidos",
    "defaultValue": "Modelo Verso do Certificado ADEC",
    "kind": "text"
  },
  {
    "key": "pagina_200",
    "label": "Você entra, testa tudo, e só assina se quiser continuar. Sem cartão no cadastro, sem cobranç…",
    "group": "GARANTIA + WHATSAPP",
    "defaultValue": "Entre ou crie sua conta, pague pelo Mercado Pago e acesse sua academia após a confirmação.",
    "kind": "text"
  },
  {
    "key": "pagina_201",
    "label": "Grupo VIP no WhatsApp",
    "group": "GARANTIA + WHATSAPP",
    "defaultValue": "Sua academia por 365 dias",
    "kind": "text"
  },
  {
    "key": "pagina_202",
    "label": "Tira-dúvidas direto com a fundadora, atualizações em primeira mão e trocas entre colegas de …",
    "group": "GARANTIA + WHATSAPP",
    "defaultValue": "A compra libera os conteúdos da academia escolhida durante um ano.",
    "kind": "text"
  },
  {
    "key": "pagina_203",
    "label": "Acesso anual à academia escolhida",
    "group": "GARANTIA + WHATSAPP",
    "defaultValue": "Acesso anual à academia escolhida",
    "kind": "text"
  },
  {
    "key": "pagina_204",
    "label": "Inauguração",
    "group": "Inauguração",
    "defaultValue": "Acesso anual",
    "kind": "text"
  },
  {
    "key": "inauguracao_titulo",
    "label": "Por que entrar agora, na turma de inauguração",
    "group": "Inauguração",
    "defaultValue": "Sua academia durante um ano",
    "kind": "text"
  },
  {
    "key": "inauguracao_sub",
    "label": "A ADEC está sendo inaugurada. Quem entra agora ajuda a moldar o app e recebe tudo o que for …",
    "group": "Inauguração",
    "defaultValue": "Escolha a academia da sua formação e tenha acesso aos seus conteúdos por 365 dias.",
    "kind": "text"
  },
  {
    "key": "pagina_205",
    "label": "Acesso de fundadora",
    "group": "Inauguração",
    "defaultValue": "Pagamento único",
    "kind": "text"
  },
  {
    "key": "pagina_206",
    "label": "Seu preço de entrada é mantido enquanto a assinatura estiver ativa, mesmo com novos módulos …",
    "group": "Inauguração",
    "defaultValue": "Um pagamento garante 365 dias de acesso à academia escolhida.",
    "kind": "text"
  },
  {
    "key": "pagina_207",
    "label": "Canal direto com a autora",
    "group": "Inauguração",
    "defaultValue": "Conteúdo da sua academia",
    "kind": "text"
  },
  {
    "key": "pagina_208",
    "label": "Pediu, foi analisado: nesta fase suas sugestões entram na fila de desenvolvimento com priori…",
    "group": "Inauguração",
    "defaultValue": "Ferramentas de estudo e apoio à prática conforme os módulos da academia escolhida.",
    "kind": "text"
  },
  {
    "key": "pagina_209",
    "label": "Teste sem risco",
    "group": "Inauguração",
    "defaultValue": "Liberação após pagamento",
    "kind": "text"
  },
  {
    "key": "pagina_210",
    "label": "Sobre a autora",
    "group": "SOBRE A AUTORA",
    "defaultValue": "Sobre a autora",
    "kind": "text"
  },
  {
    "key": "pagina_211",
    "label": "Conheça um pouco da minha História",
    "group": "SOBRE A AUTORA",
    "defaultValue": "Conheça um pouco da minha História",
    "kind": "text"
  },
  {
    "key": "pagina_212",
    "label": "Fundadora — Academia da Enfermagem",
    "group": "SOBRE A AUTORA",
    "defaultValue": "Fundadora — Academia da Enfermagem",
    "kind": "text"
  },
  {
    "key": "pagina_213",
    "label": "A História",
    "group": "SOBRE A AUTORA",
    "defaultValue": "A História",
    "kind": "text"
  },
  {
    "key": "pagina_214",
    "label": "A Academia da Enfermagem não nasceu em um escritório de tecnologia de computadores. Ela nasc…",
    "group": "SOBRE A AUTORA",
    "defaultValue": "A Academia da Enfermagem não nasceu em um escritório de tecnologia de computadores. Ela nasceu nos corredores de hospitais, nas noites em claro de plantão e na vivência real de quem dedicou 35 anos da vida à arte de cuidar. Sou auxiliar de enfermagem e Enfermeira e, assim como você, passei décadas sentindo a dor de usar horas preciosas do plantão preenchendo as burocracias necessárias em papéis e tentando decifrar manuais complexos, em vez de focar no que realmente importa: A assistência aos pacientes.",
    "kind": "text"
  },
  {
    "key": "pagina_215",
    "label": "O Propósito",
    "group": "SOBRE A AUTORA",
    "defaultValue": "O Propósito",
    "kind": "text"
  },
  {
    "key": "pagina_216",
    "label": "Após me aposentar, a apenas 4 anos, decidi que a minha missão ainda não estava cumprida. Eu …",
    "group": "SOBRE A AUTORA",
    "defaultValue": "Após me aposentar, a apenas 4 anos, decidi que a minha missão ainda não estava cumprida. Eu precisava usar toda a minha bagagem administrativa e prática para criar a ferramenta que eu sempre sonhei em ter na beira do leito. Um ecossistema simples, ágil e seguro, feito de enfermeira para a enfermagem, de enfermeira para estudante, a final, também passei por esse caminho.",
    "kind": "text"
  },
  {
    "key": "pagina_217",
    "label": "Minha Promessa",
    "group": "SOBRE A AUTORA",
    "defaultValue": "Minha Promessa",
    "kind": "text"
  },
  {
    "key": "pagina_218",
    "label": "A Academia da Enfermagem é o resultado de uma vida inteira de dedicação. Ela foi feita para …",
    "group": "SOBRE A AUTORA",
    "defaultValue": "A Academia da Enfermagem é o resultado de uma vida inteira de dedicação. Ela foi feita para mitigar o seu tempo, descomplicar o seu estágio, garantir a precisão dos seus cálculos e te levar uma certa segurança jurídica, desde que bem empregada, tudo baseado rigorosamente nas leis do nosso COFEN. Seja muito bem-vindo à evolução da nossa categoria. Aqui, nós cuidamos de quem cuida!",
    "kind": "text"
  },
  {
    "key": "pagina_219",
    "label": "Ler minha história completa",
    "group": "SOBRE A AUTORA",
    "defaultValue": "Ler minha história completa",
    "kind": "text"
  },
  {
    "key": "pagina_220",
    "label": "Dúvidas frequentes",
    "group": "Dúvidas frequentes",
    "defaultValue": "Dúvidas frequentes",
    "kind": "text"
  },
  {
    "key": "pagina_221",
    "label": "Antes de decidir",
    "group": "Dúvidas frequentes",
    "defaultValue": "Antes de decidir",
    "kind": "text"
  },
  {
    "key": "pagina_222",
    "label": "Como funciona o período grátis?",
    "group": "Dúvidas frequentes",
    "defaultValue": "Como o acesso é liberado?",
    "kind": "text"
  },
  {
    "key": "pagina_223",
    "label": "Como funciona o acesso anual?",
    "group": "Dúvidas frequentes",
    "defaultValue": "Como funciona o acesso anual?",
    "kind": "text"
  },
  {
    "key": "pagina_224",
    "label": "A aprovação do pagamento libera 365 dias de acesso à academia escolhida.",
    "group": "Dúvidas frequentes",
    "defaultValue": "A aprovação do pagamento libera 365 dias de acesso à academia escolhida.",
    "kind": "text"
  },
  {
    "key": "pagina_225",
    "label": "Funciona offline?",
    "group": "Dúvidas frequentes",
    "defaultValue": "Funciona offline?",
    "kind": "text"
  },
  {
    "key": "pagina_226",
    "label": "Sim. Instale a plataforma no celular e a maior parte do conteúdo funciona sem internet, ideal para plantão.",
    "group": "Dúvidas frequentes",
    "defaultValue": "Sim. Instale a plataforma no celular e a maior parte do conteúdo funciona sem internet, ideal para plantão.",
    "kind": "text"
  },
  {
    "key": "pagina_227",
    "label": "Como entro no Grupo VIP do WhatsApp?",
    "group": "Dúvidas frequentes",
    "defaultValue": "Os módulos têm certificado?",
    "kind": "text"
  },
  {
    "key": "pagina_228",
    "label": "Assim que ativar seu acesso, o convite do grupo aparece dentro do app. As vagas de cada turm…",
    "group": "Dúvidas frequentes",
    "defaultValue": "Não. O valor anual corresponde ao acesso à academia escolhida. Certificação em cada módulo são vendidos separadamente.",
    "kind": "text"
  },
  {
    "key": "pagina_229",
    "label": "Posso usar no celular e no computador?",
    "group": "Dúvidas frequentes",
    "defaultValue": "Posso usar no celular e no computador?",
    "kind": "text"
  },
  {
    "key": "pagina_230",
    "label": "Sim. Basta entrar com seu login em qualquer aparelho — seu progresso e assinatura acompanham…",
    "group": "Dúvidas frequentes",
    "defaultValue": "Sim. Basta entrar com seu login em qualquer aparelho — seu progresso e assinatura acompanham você.",
    "kind": "text"
  },
  {
    "key": "pagina_231",
    "label": "Quem cria e revisa o conteúdo?",
    "group": "Dúvidas frequentes",
    "defaultValue": "Quem cria e revisa o conteúdo?",
    "kind": "text"
  },
  {
    "key": "pagina_232",
    "label": "Enfermeira docente com base em COFEN, CORENs, ANVISA, Ministério da Saúde e OMS. Atualizaçõe…",
    "group": "Dúvidas frequentes",
    "defaultValue": "Enfermeira docente com base em COFEN, CORENs, ANVISA, Ministério da Saúde e OMS. Atualizações contínuas e automáticas.",
    "kind": "text"
  },
  {
    "key": "pagina_233",
    "label": "Turma de inauguração aberta agora",
    "group": "CTA FINAL",
    "defaultValue": "Turma de inauguração aberta agora",
    "kind": "text"
  },
  {
    "key": "pagina_234",
    "label": "Saia do próximo plantão no horário",
    "group": "CTA FINAL",
    "defaultValue": "Saia do próximo plantão no horário",
    "kind": "text"
  },
  {
    "key": "pagina_235",
    "label": "Sem cartão de crédito. Sem fidelidade. Cancele quando quiser. Entre na turma de inauguração …",
    "group": "CTA FINAL",
    "defaultValue": "Sem cartão de crédito. Sem fidelidade. Cancele quando quiser. Entre na turma de inauguração da ADEC.",
    "kind": "text"
  },
  {
    "key": "pagina_236",
    "label": "Compra 100% segura",
    "group": "CTA FINAL",
    "defaultValue": "Compra 100% segura",
    "kind": "text"
  },
  {
    "key": "pagina_237",
    "label": "Aviso Legal: ferramenta de apoio à decisão clínica. Não substitui o julgamento técnico do pr…",
    "group": "Rodapé",
    "defaultValue": "Aviso Legal: ferramenta de apoio à decisão clínica. Não substitui o julgamento técnico do profissional, o exame do paciente nem as fontes oficiais (COFEN, COREN, MS, ANVISA).",
    "kind": "text"
  },
  {
    "key": "pagina_238",
    "label": "Termos de Uso, Aviso Legal e Política de Privacidade",
    "group": "Rodapé",
    "defaultValue": "Termos de Uso, Aviso Legal e Política de Privacidade",
    "kind": "text"
  },
  {
    "key": "pagina_239",
    "label": "ADEC · Academia da Enfermagem · academiadaenfermagem.com.br",
    "group": "Rodapé",
    "defaultValue": "ADEC · Academia da Enfermagem · academiadaenfermagem.com.br",
    "kind": "text"
  },
  {
    "key": "logo_image",
    "label": "Logotipo",
    "defaultValue": "/__l5e/assets-v1/20892c4a-2b50-483d-a19d-a5067c9d5188/logo-adec.png",
    "group": "Imagens",
    "kind": "image"
  },
  {
    "key": "author_image",
    "label": "Foto da autora",
    "defaultValue": "/__l5e/assets-v1/1f1033de-3186-4e0c-a8ac-f1bb100a0745/foto-fundadora.jpeg",
    "group": "SOBRE A AUTORA",
    "kind": "image"
  },
  {
    "key": "chip_trial",
    "label": "15 dias grátis",
    "defaultValue": "365 dias de acesso",
    "group": "Apresentação e cartões",
    "kind": "text"
  },
  {
    "key": "plans_subtitle",
    "label": "15 dias grátis, sem cartão. Cancele quando quiser.",
    "defaultValue": "Escolha sua academia. Pagamento único anual pelo Mercado Pago.",
    "group": "PLANOS",
    "kind": "text"
  },
  {
    "key": "launch_trial",
    "label": "15 dias grátis, sem cartão no cadastro. Você usa no plantão de verdade antes de decidir.",
    "defaultValue": "O Mercado Pago confirma a aprovação e o acesso é liberado na conta usada na compra.",
    "group": "Inauguração",
    "kind": "text"
  },
  {
    "key": "faq_trial",
    "label": "Você se cadastra e ganha 15 dias de acesso completo, sem precisar informar cartão. No fim do período, é só assinar para continuar.",
    "defaultValue": "Escolha sua academia, entre ou crie sua conta e pague pelo Mercado Pago. O acesso é liberado após confirmação do pagamento.",
    "group": "Dúvidas frequentes",
    "kind": "text"
  },
  {
    "key": "sticky_hint",
    "label": "Turma de inauguração · 15 dias grátis, sem cartão",
    "defaultValue": "Acesso anual · escolha sua academia",
    "group": "Barra fixa",
    "kind": "text"
  },
  {
    "key": "banner_text",
    "label": "Inauguração da ADEC — turma fundadora aberta: comece hoje com 15 dias grátis",
    "defaultValue": "ADEC — acesso anual a partir de R$ 37,99",
    "group": "Banner coral",
    "kind": "text"
  },
  {
    "key": "guarantee_title",
    "label": "Garantia real de 15 dias",
    "defaultValue": "Compra identificada e segura",
    "group": "GARANTIA + WHATSAPP",
    "kind": "text"
  },
  {
    "key": "plans_badge",
    "label": "15 dias grátis · sem cartão",
    "defaultValue": "Acesso anual · pagamento único",
    "group": "PLANOS",
    "kind": "text"
  },
  {
    "key": "access_short",
    "label": "Acessar",
    "defaultValue": "Acessar",
    "group": "CTA FINAL",
    "kind": "text"
  },
  {
    "key": "cta_target",
    "label": "Destino dos botões principais",
    "defaultValue": "#planos",
    "group": "Botões e links",
    "kind": "link"
  },
  {
    "key": "signup_academico",
    "label": "Botão — academico",
    "defaultValue": "/checkout?plan=academico",
    "group": "Botões e links",
    "kind": "link"
  },
  {
    "key": "signup_tecnico-estudante",
    "label": "Botão — tecnico-estudante",
    "defaultValue": "/checkout?plan=tecnico-estudante",
    "group": "Botões e links",
    "kind": "link"
  },
  {
    "key": "signup_tecnico",
    "label": "Botão — tecnico",
    "defaultValue": "/checkout?plan=tecnico",
    "group": "Botões e links",
    "kind": "link"
  },
  {
    "key": "signup_enfermeiro",
    "label": "Botão — enfermeiro",
    "defaultValue": "/checkout?plan=enfermeiro",
    "group": "Botões e links",
    "kind": "link"
  },
  {
    "key": "stat_35",
    "label": "35 anos",
    "defaultValue": "35 anos",
    "group": "CREDIBILIDADE — números animados",
    "kind": "text"
  },
  {
    "key": "stat_60",
    "label": "60+",
    "defaultValue": "60+",
    "group": "CREDIBILIDADE — números animados",
    "kind": "text"
  },
  {
    "key": "stat_22",
    "label": "22+",
    "defaultValue": "22+",
    "group": "CREDIBILIDADE — números animados",
    "kind": "text"
  },
  {
    "key": "stat_100",
    "label": "100%",
    "defaultValue": "100%",
    "group": "CREDIBILIDADE — números animados",
    "kind": "text"
  },
  {
    "key": "phone_1",
    "label": "Risco de queda",
    "group": "Imagem do celular",
    "defaultValue": "Risco de queda",
    "kind": "text"
  },
  {
    "key": "phone_2",
    "label": "6/6h",
    "group": "Imagem do celular",
    "defaultValue": "6/6h",
    "kind": "text"
  },
  {
    "key": "phone_3",
    "label": "Alta",
    "group": "Imagem do celular",
    "defaultValue": "Alta",
    "kind": "text"
  },
  {
    "key": "phone_4",
    "label": "Integridade da pele prejudicada",
    "group": "Imagem do celular",
    "defaultValue": "Integridade da pele prejudicada",
    "kind": "text"
  },
  {
    "key": "phone_5",
    "label": "4/4h",
    "group": "Imagem do celular",
    "defaultValue": "4/4h",
    "kind": "text"
  },
  {
    "key": "phone_6",
    "label": "Média",
    "group": "Imagem do celular",
    "defaultValue": "Média",
    "kind": "text"
  },
  {
    "key": "phone_7",
    "label": "Débito cardíaco diminuído",
    "group": "Imagem do celular",
    "defaultValue": "Débito cardíaco diminuído",
    "kind": "text"
  },
  {
    "key": "phone_8",
    "label": "2/2h",
    "group": "Imagem do celular",
    "defaultValue": "2/2h",
    "kind": "text"
  },
  {
    "key": "phone_9",
    "label": "Ansiedade",
    "group": "Imagem do celular",
    "defaultValue": "Ansiedade",
    "kind": "text"
  },
  {
    "key": "phone_10",
    "label": "12/12h",
    "group": "Imagem do celular",
    "defaultValue": "12/12h",
    "kind": "text"
  },
  {
    "key": "phone_11",
    "label": "Baixa",
    "group": "Imagem do celular",
    "defaultValue": "Baixa",
    "kind": "text"
  },
  {
    "key": "phone_12",
    "label": "SAE automatizada",
    "group": "Imagem do celular",
    "defaultValue": "SAE automatizada",
    "kind": "text"
  },
  {
    "key": "phone_13",
    "label": "Prescrição de enfermagem",
    "group": "Imagem do celular",
    "defaultValue": "Prescrição de enfermagem",
    "kind": "text"
  },
  {
    "key": "phone_14",
    "label": "Baixar em PDF / DOC",
    "group": "Imagem do celular",
    "defaultValue": "Baixar em PDF / DOC",
    "kind": "text"
  }
];
