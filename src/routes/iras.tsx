import { createFileRoute } from "@tanstack/react-router";
import { ContentProtection } from "@/components/ContentProtection";
import { AppShell, Card, PageHeader } from "@/components/AppShell";
import { MiniAppContent } from "@/components/MiniAppContent";
import {
  HandHeart,
  ShieldAlert,
  Sparkles,
  Activity,
  Droplets,
  Wind,
  Syringe,
  Stethoscope,
  Bug,
  ClipboardCheck,
  BarChart3,
  BookOpen,
  Shirt,
  SprayCan,
} from "lucide-react";
import mascoteMenino from "@/assets/mascote-menino-iras.png.asset.json";
import mascoteMenina from "@/assets/mascote-menina.png.asset.json";

export const Route = createFileRoute("/iras")({
  head: () => ({
    meta: [
      { title: "Time Contra as IRAS — Prevenção e Controle | Academia da Enfermagem" },
      {
        name: "description",
        content:
          "Guia completo de IRAS: 5 momentos das mãos, precauções, bundles de ITU-AC, PAV, IPCS e ISC, EPIs, multirresistentes, limpeza e indicadores.",
      },
      { property: "og:title", content: "Time Contra as IRAS — Prevenção e Controle" },
      {
        property: "og:description",
        content:
          "Bundles, precauções, paramentação, microrganismos multirresistentes e indicadores de IRAS na prática da enfermagem.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: IRASPage,
});

const momentos = [
  {
    n: 1,
    titulo: "Antes do contato com o paciente",
    desc: "Higienize ao se aproximar do paciente — protege contra microrganismos das suas mãos.",
  },
  {
    n: 2,
    titulo: "Antes da realização de procedimento asséptico",
    desc: "Antes de qualquer manipulação invasiva ou estéril (curativo, punção, sondagem).",
  },
  {
    n: 3,
    titulo: "Após exposição a fluidos corporais",
    desc: "Sangue, secreções, mucosas ou pele não íntegra — proteja a si mesmo e ao próximo paciente.",
  },
  {
    n: 4,
    titulo: "Após contato com o paciente",
    desc: "Ao se afastar — evite carregar microrganismos para fora da zona do paciente.",
  },
  {
    n: 5,
    titulo: "Após contato com áreas próximas ao paciente",
    desc: "Mesmo sem tocar o paciente: grades, mesa, bomba de infusão, monitor.",
  },
];

type Secao = {
  id: string;
  icone: React.ReactNode;
  eyebrow: string;
  titulo: string;
  intro?: string;
  blocos: { titulo: string; itens: string[] }[];
};

const secoes: Secao[] = [
  {
    id: "conceitos",
    icone: <ShieldAlert className="h-5 w-5" />,
    eyebrow: "Base conceitual",
    titulo: "Conceitos e cadeia de transmissão",
    intro:
      "IRAS são infecções adquiridas durante a assistência, que não estavam presentes nem em incubação na admissão. Em geral consideram-se as que se manifestam após 48h de internação (ou até 30 dias de pós-operatório, e até 90 dias quando há implante de prótese).",
    blocos: [
      {
        titulo: "Cadeia epidemiológica (6 elos)",
        itens: [
          "Agente infeccioso: bactérias, vírus, fungos.",
          "Reservatório: pacientes, profissionais, água, superfícies, equipamentos.",
          "Porta de saída: secreções, sangue, trato respiratório, feridas.",
          "Meio de transmissão: contato (mãos!), gotículas, aerossóis, veículo comum.",
          "Porta de entrada: dispositivos invasivos, feridas, mucosas.",
          "Hospedeiro suscetível: idoso, imunossuprimido, desnutrido, crítico.",
        ],
      },
      {
        titulo: "Onde a enfermagem quebra a cadeia",
        itens: [
          "Higiene das mãos — o elo mais barato e mais eficaz de romper.",
          "Uso correto de EPI e precauções específicas.",
          "Retirada precoce de dispositivos invasivos (o cateter que não é necessário é o mais seguro).",
          "Técnica asséptica em todo procedimento invasivo.",
          "Limpeza e desinfecção de superfícies e equipamentos entre pacientes.",
        ],
      },
      {
        titulo: "Fatores de risco mais comuns",
        itens: [
          "Tempo prolongado de internação e de UTI.",
          "Dispositivos invasivos: CVC, sonda vesical, ventilação mecânica.",
          "Uso abusivo/prolongado de antimicrobianos.",
          "Extremos de idade, desnutrição, diabetes descompensado, imunossupressão.",
          "Superlotação e dimensionamento insuficiente de pessoal.",
        ],
      },
    ],
  },
  {
    id: "maos",
    icone: <Droplets className="h-5 w-5" />,
    eyebrow: "Higiene das mãos",
    titulo: "Técnica, tempo e produtos",
    intro:
      "A higienização é o pilar da prevenção. A escolha entre álcool 70% e água e sabão depende da sujidade visível e do agente envolvido.",
    blocos: [
      {
        titulo: "Álcool em gel/solução 70% — 20 a 30 segundos",
        itens: [
          "Uso preferencial quando as mãos NÃO estão visivelmente sujas.",
          "Friccionar até secagem completa — não usar papel toalha para secar.",
          "Cobrir palmas, dorso, entre os dedos, polegares, pontas dos dedos e punhos.",
        ],
      },
      {
        titulo: "Água e sabonete líquido — 40 a 60 segundos",
        itens: [
          "Obrigatório quando há sujidade visível, sangue ou fluidos corporais.",
          "Obrigatório após contato com Clostridioides difficile e em surtos de norovírus (álcool não é eficaz nos esporos).",
          "Obrigatório após uso do banheiro e antes das refeições.",
          "Fechar a torneira com papel toalha, nunca com a mão limpa.",
        ],
      },
      {
        titulo: "Antissepsia cirúrgica das mãos",
        itens: [
          "Clorexidina degermante 2–4% ou PVPI degermante 10%, ou álcool com emoliente de ação prolongada.",
          "Duração de 3 a 5 minutos na primeira cirurgia do dia; escovar apenas as unhas.",
          "Manter as mãos acima dos cotovelos; secar com compressa estéril.",
        ],
      },
      {
        titulo: "Erros que anulam a técnica",
        itens: [
          "Unhas compridas, postiças ou esmalte descascado.",
          "Anéis, pulseiras, relógio e jaleco de manga longa junto ao paciente.",
          "Luva usada como substituta da higiene das mãos — luva NÃO substitui.",
          "Higienizar só na entrada do quarto e esquecer entre sítios do mesmo paciente.",
        ],
      },
    ],
  },
  {
    id: "precaucoes",
    icone: <Wind className="h-5 w-5" />,
    eyebrow: "Precauções",
    titulo: "Padrão, contato, gotículas e aerossóis",
    intro:
      "A precaução padrão vale para TODOS os pacientes, sempre. As precauções específicas são somadas a ela conforme a via de transmissão.",
    blocos: [
      {
        titulo: "Precaução padrão (todos os pacientes)",
        itens: [
          "Higiene das mãos nos 5 momentos.",
          "Luvas ao contato com sangue, fluidos, mucosas e pele não íntegra.",
          "Avental, óculos e máscara quando houver risco de respingos.",
          "Descarte de perfurocortantes em recipiente rígido, sem reencapar agulha.",
          "Etiqueta respiratória e manejo seguro de roupas e resíduos.",
        ],
      },
      {
        titulo: "Precaução de CONTATO",
        itens: [
          "Quando: multirresistentes (KPC, MRSA, VRE, Acinetobacter), diarreia infecciosa, escabiose, feridas com secreção não contida.",
          "Quarto privativo ou coorte; avental e luvas na entrada do quarto.",
          "Equipamentos exclusivos: estetoscópio, termômetro, esfigmomanômetro.",
          "Retirar EPI e higienizar as mãos ANTES de sair do quarto.",
        ],
      },
      {
        titulo: "Precaução por GOTÍCULAS (partículas > 5 µm, alcance ~1 m)",
        itens: [
          "Quando: influenza, coqueluche, meningite meningocócica, caxumba, rubéola, difteria.",
          "Máscara cirúrgica ao entrar no quarto; quarto privativo ou distância mínima de 1 metro.",
          "Paciente usa máscara cirúrgica no transporte.",
        ],
      },
      {
        titulo: "Precaução por AEROSSÓIS (partículas < 5 µm)",
        itens: [
          "Quando: tuberculose pulmonar/laríngea, sarampo, varicela, herpes-zóster disseminado.",
          "Quarto com pressão negativa e porta fechada (6 a 12 trocas de ar/hora).",
          "Máscara N95/PFF2 com teste de vedação a cada uso.",
          "Restringir transporte; paciente com máscara cirúrgica quando necessário sair.",
        ],
      },
    ],
  },
  {
    id: "epi",
    icone: <Shirt className="h-5 w-5" />,
    eyebrow: "Paramentação",
    titulo: "Ordem de colocar e retirar EPI",
    intro:
      "A maior parte da autocontaminação acontece na RETIRADA. Treine a sequência até virar automático.",
    blocos: [
      {
        titulo: "Colocar (paramentação)",
        itens: [
          "1. Higienizar as mãos.",
          "2. Avental/capote — amarrar no pescoço e na cintura.",
          "3. Máscara (cirúrgica ou N95) — ajustar clipe nasal e testar vedação.",
          "4. Óculos ou protetor facial.",
          "5. Gorro, quando indicado.",
          "6. Luvas — por cima do punho do avental.",
        ],
      },
      {
        titulo: "Retirar (desparamentação)",
        itens: [
          "1. Luvas — técnica luva contra luva / pele contra pele.",
          "2. Higienizar as mãos.",
          "3. Óculos/protetor facial pelas hastes laterais.",
          "4. Avental — soltar amarras, enrolar com a face contaminada para dentro.",
          "5. Higienizar as mãos.",
          "6. Máscara por último, pelos elásticos, JÁ FORA do quarto (exceto aerossóis, onde se retira na antessala).",
          "7. Higienizar as mãos novamente.",
        ],
      },
      {
        titulo: "Pontos críticos",
        itens: [
          "Nunca tocar a parte frontal da máscara ou do avental.",
          "Não circular pelo corredor ou refeitório com EPI de quarto de isolamento.",
          "N95 não pode ser usada sobre barba densa — perde a vedação.",
          "Luva estéril só para procedimento asséptico; luva de procedimento para o restante.",
        ],
      },
    ],
  },
  {
    id: "itu",
    icone: <Droplets className="h-5 w-5" />,
    eyebrow: "Bundle 1",
    titulo: "ITU-AC — Infecção urinária associada a cateter",
    intro:
      "É uma das IRAS mais frequentes e a mais evitável: a maioria decorre de indicação inadequada e permanência desnecessária do cateter.",
    blocos: [
      {
        titulo: "Inserção segura",
        itens: [
          "Avaliar a real indicação: retenção urinária, controle rigoroso de diurese em paciente crítico, cirurgias selecionadas, lesão por pressão sacral em incontinente.",
          "Não indicar por incontinência, comodidade da equipe ou coleta de urina de rotina.",
          "Técnica estéril, campo estéril, antissepsia do meato e lubrificante estéril.",
          "Calibre o menor possível; insuflar o balão só com água destilada e no volume indicado.",
        ],
      },
      {
        titulo: "Manutenção diária",
        itens: [
          "Sistema de drenagem FECHADO — nunca desconectar para coleta.",
          "Bolsa sempre abaixo do nível da bexiga e sem tocar o chão.",
          "Fixar o cateter na coxa/abdome para evitar tração.",
          "Higiene íntima com água e sabão; não usar antisséptico no meato de rotina.",
          "Evitar dobras e refluxo; esvaziar a bolsa com recipiente individual.",
        ],
      },
      {
        titulo: "Retirada e vigilância",
        itens: [
          "Reavaliar a necessidade TODOS os dias e registrar no prontuário.",
          "Retirar assim que a indicação cessar — cada dia a mais aumenta o risco em ~3 a 7%.",
          "Sinais de alerta: febre, dor suprapúbica ou lombar, urina turva/fétida, confusão em idoso.",
          "Não tratar bacteriúria assintomática (exceto gestante e pré-operatório urológico).",
        ],
      },
    ],
  },
  {
    id: "pav",
    icone: <Stethoscope className="h-5 w-5" />,
    eyebrow: "Bundle 2",
    titulo: "PAV — Pneumonia associada à ventilação mecânica",
    intro:
      "Pneumonia que surge após 48h de intubação. Alta letalidade — a prevenção é conjunto de cuidados simples, feitos sempre.",
    blocos: [
      {
        titulo: "Bundle de prevenção",
        itens: [
          "Cabeceira elevada de 30 a 45°, salvo contraindicação.",
          "Higiene oral com clorexidina 0,12% conforme protocolo, 2 a 3x/dia.",
          "Avaliação diária de sedação (despertar diário) e do desmame ventilatório.",
          "Manter pressão do cuff entre 20 e 30 cmH₂O, verificada por turno.",
          "Aspiração de secreção subglótica quando o tubo permitir.",
          "Circuito do ventilador trocado só quando sujo ou com mau funcionamento.",
          "Profilaxia de úlcera de estresse e de trombose venosa profunda.",
        ],
      },
      {
        titulo: "Cuidados de enfermagem na aspiração",
        itens: [
          "Técnica asséptica; sistema fechado preferencial em precaução respiratória.",
          "Aspirar apenas quando indicado (roncos, dessaturação, secreção visível) — não de rotina.",
          "Pressão de vácuo adequada e tempo máximo de 10 a 15 segundos por passagem.",
          "Hiperoxigenar antes e após; monitorar SpO₂ e frequência cardíaca.",
          "Evitar instilação rotineira de soro fisiológico no tubo.",
        ],
      },
      {
        titulo: "Sinais de alerta",
        itens: [
          "Febre, leucocitose, secreção purulenta nova ou aumentada.",
          "Piora dos parâmetros ventilatórios e queda da relação PaO₂/FiO₂.",
          "Novo infiltrado no raio-X de tórax.",
        ],
      },
    ],
  },
  {
    id: "ipcs",
    icone: <Syringe className="h-5 w-5" />,
    eyebrow: "Bundle 3",
    titulo: "IPCS — Infecção de corrente sanguínea associada a cateter",
    intro:
      "Relacionada principalmente ao CVC, mas o acesso periférico também infecta. Tem alta mortalidade e alto custo.",
    blocos: [
      {
        titulo: "Inserção do cateter central",
        itens: [
          "Checklist de inserção com pausa de segurança e poder de interromper o procedimento.",
          "Barreira máxima: gorro, máscara, avental e luvas estéreis + campo estéril amplo.",
          "Antissepsia da pele com clorexidina alcoólica 0,5–2%, respeitando o tempo de secagem.",
          "Preferir veia subclávia em adultos; evitar femoral pelo maior risco.",
          "Guiar por ultrassom quando disponível.",
        ],
      },
      {
        titulo: "Manutenção",
        itens: [
          "Desinfecção do hub/conector com álcool 70% por 5 a 15 segundos antes de cada acesso (scrub the hub).",
          "Curativo transparente trocado a cada 7 dias; gaze a cada 48h ou se sujo/solto/úmido.",
          "Avaliar diariamente o sítio: dor, calor, rubor, secreção.",
          "Trocar equipos de infusão contínua a cada 96h; lipídios e sangue em até 24h.",
          "Registrar dia de permanência e reavaliar a necessidade diariamente.",
        ],
      },
      {
        titulo: "Acesso periférico e flebite",
        itens: [
          "Antissepsia com álcool 70% ou clorexidina antes da punção.",
          "Avaliar o sítio a cada turno usando escala de flebite (0 a 4).",
          "Trocar imediatamente qualquer acesso puncionado em emergência sem técnica asséptica.",
          "Retirar ao primeiro sinal de dor, cordão fibroso, rubor ou infiltração.",
        ],
      },
    ],
  },
  {
    id: "isc",
    icone: <ClipboardCheck className="h-5 w-5" />,
    eyebrow: "Bundle 4",
    titulo: "ISC — Infecção de sítio cirúrgico",
    intro:
      "Classificada em incisional superficial, incisional profunda e de órgão/cavidade. Prevenção começa antes do centro cirúrgico.",
    blocos: [
      {
        titulo: "Pré-operatório",
        itens: [
          "Banho com água e sabonete (ou clorexidina degermante conforme protocolo) na noite anterior e na manhã.",
          "Tricotomia SOMENTE se necessária, com tricotomizador elétrico e o mais próximo possível do horário cirúrgico — nunca lâmina.",
          "Antibiótico profilático 30 a 60 minutos antes da incisão, com redose conforme tempo cirúrgico e sangramento.",
          "Controle glicêmico e suspensão do tabagismo quando possível.",
        ],
      },
      {
        titulo: "Intra e pós-operatório",
        itens: [
          "Normotermia (≥ 36 °C) e antissepsia ampla da pele com clorexidina alcoólica.",
          "Restrição de circulação e de abertura de portas na sala.",
          "Curativo estéril mantido fechado nas primeiras 24 a 48h.",
          "Troca de curativo com técnica asséptica e higiene das mãos antes e depois.",
        ],
      },
      {
        titulo: "Sinais de infecção da ferida",
        itens: [
          "Dor que aumenta em vez de diminuir, rubor, calor e edema perilesional.",
          "Secreção purulenta ou deiscência espontânea.",
          "Febre a partir do 3º ao 5º dia de pós-operatório.",
          "Notificar e documentar; coletar cultura conforme protocolo.",
        ],
      },
    ],
  },
  {
    id: "multirresistentes",
    icone: <Bug className="h-5 w-5" />,
    eyebrow: "Resistência",
    titulo: "Microrganismos multirresistentes e uso racional de antibióticos",
    blocos: [
      {
        titulo: "Os mais vigiados no Brasil",
        itens: [
          "KPC / enterobactérias produtoras de carbapenemase (Klebsiella, E. coli).",
          "MRSA — Staphylococcus aureus resistente à meticilina.",
          "VRE — Enterococcus resistente à vancomicina.",
          "Acinetobacter baumannii e Pseudomonas aeruginosa multirresistentes.",
          "Clostridioides difficile — exige água e sabão e desinfecção com cloro.",
          "Candida auris — vigilância crescente, alta persistência em superfícies.",
        ],
      },
      {
        titulo: "Conduta da equipe",
        itens: [
          "Precaução de contato imediata diante de resultado ou suspeita.",
          "Coorte de pacientes e, se possível, de equipe.",
          "Equipamentos exclusivos e desinfecção reforçada do ambiente.",
          "Sinalização discreta no leito, preservando a privacidade do paciente.",
          "Comunicar a CCIH e registrar em todas as transferências.",
        ],
      },
      {
        titulo: "Stewardship — uso racional",
        itens: [
          "Coletar culturas ANTES da primeira dose sempre que possível.",
          "Respeitar horários e tempo de infusão — atraso de dose gera resistência.",
          "Descalonamento guiado por cultura e revisão em 48–72h.",
          "Questionar prescrições prolongadas sem indicação clara.",
        ],
      },
    ],
  },
  {
    id: "ambiente",
    icone: <SprayCan className="h-5 w-5" />,
    eyebrow: "Ambiente",
    titulo: "Limpeza, desinfecção, resíduos e processamento",
    blocos: [
      {
        titulo: "Superfícies",
        itens: [
          "Limpeza concorrente diária e terminal na alta, óbito ou transferência.",
          "Foco nas superfícies de alto toque: grades, painel de bomba, maçaneta, interruptor, mesa de cabeceira.",
          "Sentido do mais limpo para o mais sujo, de cima para baixo, sem retorno.",
          "Hipoclorito de sódio 0,5–1% para sangue e fluidos; álcool 70% em superfícies pequenas.",
          "Panos e baldes distintos por área; nunca reutilizar água suja.",
        ],
      },
      {
        titulo: "Classificação de artigos (Spaulding)",
        itens: [
          "Críticos — penetram tecido estéril ou vasos: exigem ESTERILIZAÇÃO (instrumental cirúrgico, agulhas).",
          "Semicríticos — contato com mucosa íntegra: desinfecção de alto nível (laringoscópio, circuito respiratório).",
          "Não críticos — contato com pele íntegra: limpeza e desinfecção de baixo/médio nível (estetoscópio, esfigmomanômetro).",
        ],
      },
      {
        titulo: "Resíduos (RDC 222/2018)",
        itens: [
          "Grupo A — infectantes: saco branco leitoso.",
          "Grupo B — químicos: identificação específica conforme risco.",
          "Grupo C — rejeitos radioativos.",
          "Grupo D — comuns: saco preto/reciclável.",
          "Grupo E — perfurocortantes: caixa rígida amarela, preencher até 2/3.",
        ],
      },
    ],
  },
  {
    id: "indicadores",
    icone: <BarChart3 className="h-5 w-5" />,
    eyebrow: "Vigilância",
    titulo: "CCIH, notificação e indicadores",
    intro:
      "Toda instituição deve ter CCIH e SCIH, e a notificação de IRAS ao sistema da ANVISA é obrigatória.",
    blocos: [
      {
        titulo: "Papéis",
        itens: [
          "CCIH: elabora, implanta e avalia o programa de controle de infecção.",
          "SCIH: executa a vigilância, treina a equipe e investiga surtos.",
          "Núcleo de Segurança do Paciente: integra IRAS às metas internacionais de segurança.",
          "Enfermeiro assistencial: primeira linha de vigilância — notifica e registra.",
        ],
      },
      {
        titulo: "Indicadores (densidade de incidência)",
        itens: [
          "Taxa de IPCS = nº de infecções ÷ nº de cateter-dia × 1.000.",
          "Taxa de PAV = nº de pneumonias ÷ nº de ventilador-dia × 1.000.",
          "Taxa de ITU-AC = nº de infecções ÷ nº de cateter-dia × 1.000.",
          "Taxa de utilização de dispositivo = dispositivo-dia ÷ paciente-dia.",
          "Adesão à higiene das mãos = oportunidades cumpridas ÷ oportunidades observadas × 100.",
        ],
      },
      {
        titulo: "Investigação de surto",
        itens: [
          "Confirmar o diagnóstico e definir caso.",
          "Descrever por tempo, lugar e pessoa; construir curva epidêmica.",
          "Levantar hipóteses, reforçar barreiras e coletar culturas de vigilância.",
          "Avaliar as medidas e comunicar a equipe e a vigilância sanitária.",
        ],
      },
    ],
  },
];

const perguntas = [
  {
    q: "Luva substitui a higiene das mãos?",
    a: "Não. A luva pode ter microfuros e as mãos se contaminam ao retirá-la. Higienize antes de calçar e imediatamente após retirar.",
  },
  {
    q: "Posso usar álcool em gel em paciente com Clostridioides difficile?",
    a: "Não. Nesse caso a higiene deve ser com água e sabonete, porque o álcool não elimina os esporos. A desinfecção do ambiente deve ser com cloro.",
  },
  {
    q: "Precisa trocar o acesso periférico a cada 72 ou 96 horas?",
    a: "A recomendação atual é trocar por indicação clínica (dor, flebite, infiltração, obstrução) e não apenas por tempo, desde que haja avaliação do sítio a cada turno.",
  },
  {
    q: "Quando o cateter vesical deve ser retirado?",
    a: "Assim que a indicação cessar. A reavaliação deve ser diária e registrada — é a medida isolada que mais reduz ITU-AC.",
  },
  {
    q: "Máscara cirúrgica protege contra tuberculose?",
    a: "Não protege o profissional. Nesse caso é obrigatória a N95/PFF2 com teste de vedação, e o paciente usa a cirúrgica ao circular.",
  },
];

const referencias = [
  "ANVISA. Medidas de Prevenção de Infecção Relacionada à Assistência à Saúde — Caderno 4.",
  "ANVISA. Critérios Diagnósticos das IRAS — Caderno 2.",
  "OMS/WHO. Diretrizes sobre Higienização das Mãos na Assistência à Saúde — 5 Momentos.",
  "ANVISA. RDC nº 222/2018 — Gerenciamento de resíduos de serviços de saúde.",
  "Ministério da Saúde. Programa Nacional de Segurança do Paciente (PNSP).",
  "COFEN. Resoluções sobre segurança do paciente e atribuições do enfermeiro em CCIH.",
];

function IRASPage() {
  return (
    <AppShell>
      <ContentProtection allowPrint>
        <PageHeader
          eyebrow="Prevenção & Controle"
          title="Time Contra as IRAS"
          description="Guia completo: conceitos, higiene das mãos, precauções, EPIs, bundles de ITU-AC, PAV, IPCS e ISC, multirresistentes, ambiente e indicadores."
        />
        <MiniAppContent slug="iras" />

        {/* Mascot banner */}
        <section className="mb-6 overflow-hidden rounded-3xl border border-gold/40 bg-primary text-primary-foreground shadow-[var(--shadow-glass)]">
          <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2 px-4 pt-4 sm:px-6">
            <img
              src={mascoteMenino.url}
              alt="Mascote menino do Time Contra as IRAS"
              className="h-40 w-auto justify-self-end object-contain drop-shadow-[0_8px_18px_rgba(0,0,0,0.35)] sm:h-56"
            />
            <div className="pb-2 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-gold">
                Defensores
              </p>
              <p className="font-display text-lg font-extrabold leading-tight text-gold sm:text-2xl">
                TIME CONTRA<br />AS IRAS
              </p>
            </div>
            <img
              src={mascoteMenina.url}
              alt="Mascote menina do Time Contra as IRAS"
              className="h-40 w-auto justify-self-start object-contain drop-shadow-[0_8px_18px_rgba(0,0,0,0.35)] sm:h-56"
            />
          </div>
          <div className="border-t border-gold/30 bg-primary-glow/20 px-5 py-4 text-center">
            <p className="font-display text-base font-bold leading-snug text-primary-foreground sm:text-xl">
              "A higienização das mãos é o método mais{" "}
              <span className="text-gold">barato</span> e mais{" "}
              <span className="text-gold">eficaz</span> para a prevenção das IRAS."
            </p>
          </div>
        </section>

        {/* Índice */}
        <Card className="mb-6">
          <div className="mb-3 flex items-center gap-2 text-gold">
            <BookOpen className="h-5 w-5" />
            <h2 className="font-display text-lg font-bold text-foreground">Conteúdo do módulo</h2>
          </div>
          <ul className="grid gap-2 sm:grid-cols-2">
            {secoes.map((s, i) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="flex items-center gap-2 rounded-xl bg-foreground/5 px-3 py-2 text-sm font-semibold transition-colors hover:bg-primary/10 hover:text-primary"
                >
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-lg gold-gradient text-xs font-extrabold">
                    {i + 1}
                  </span>
                  {s.titulo}
                </a>
              </li>
            ))}
          </ul>
        </Card>

        {/* Tech block */}
        <section className="mb-6 grid gap-3 md:grid-cols-3">
          <Card>
            <div className="mb-2 flex items-center gap-2 text-gold">
              <ShieldAlert className="h-5 w-5" />
              <p className="text-xs font-semibold uppercase tracking-widest">O que são</p>
            </div>
            <h3 className="font-display text-base font-bold">IRAS</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Infecções adquiridas durante a assistência à saúde, com alto impacto em mortalidade,
              tempo de internação e custo.
            </p>
          </Card>
          <Card>
            <div className="mb-2 flex items-center gap-2 text-gold">
              <Activity className="h-5 w-5" />
              <p className="text-xs font-semibold uppercase tracking-widest">Como se disseminam</p>
            </div>
            <h3 className="font-display text-base font-bold">Vias de transmissão</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Contato (principalmente as mãos), gotículas, aerossóis, superfícies e dispositivos
              invasivos contaminados.
            </p>
          </Card>
          <Card>
            <div className="mb-2 flex items-center gap-2 text-gold">
              <Sparkles className="h-5 w-5" />
              <p className="text-xs font-semibold uppercase tracking-widest">Como evitar</p>
            </div>
            <h3 className="font-display text-base font-bold">Barreira & assepsia</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Higiene das mãos, precauções corretas, bundles de dispositivos e retirada precoce do
              que é invasivo.
            </p>
          </Card>
        </section>

        {/* 5 Momentos */}
        <section className="mb-8">
          <div className="mb-3 flex items-center gap-2">
            <HandHeart className="h-5 w-5 text-gold" />
            <h2 className="font-display text-xl font-bold">Os 5 Momentos das Mãos · OMS</h2>
          </div>
          <ol className="grid gap-3 sm:grid-cols-2">
            {momentos.map((m) => (
              <li
                key={m.n}
                className="glass flex gap-4 rounded-2xl p-4 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow)]"
              >
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl gold-gradient font-display text-xl font-extrabold">
                  {m.n}
                </div>
                <div className="min-w-0">
                  <p className="font-display text-sm font-bold text-foreground">{m.titulo}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{m.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Seções completas */}
        <div className="space-y-6">
          {secoes.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-20">
              <Card>
                <div className="mb-1 flex items-center gap-2 text-gold">
                  {s.icone}
                  <p className="text-xs font-semibold uppercase tracking-widest">{s.eyebrow}</p>
                </div>
                <h2 className="font-display text-lg font-bold text-foreground sm:text-xl">
                  {s.titulo}
                </h2>
                {s.intro && (
                  <p className="mt-2 text-sm text-muted-foreground">{s.intro}</p>
                )}
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {s.blocos.map((b) => (
                    <div
                      key={b.titulo}
                      className="rounded-2xl border border-foreground/10 bg-foreground/[0.03] p-4"
                    >
                      <p className="font-display text-sm font-bold text-foreground">{b.titulo}</p>
                      <ul className="mt-2 space-y-1.5">
                        {b.itens.map((it) => (
                          <li
                            key={it}
                            className="flex gap-2 text-xs leading-relaxed text-muted-foreground"
                          >
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                            <span>{it}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </Card>
            </section>
          ))}
        </div>

        {/* Perguntas frequentes */}
        <section className="mt-8">
          <div className="mb-3 flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5 text-gold" />
            <h2 className="font-display text-xl font-bold">Dúvidas de plantão</h2>
          </div>
          <div className="space-y-2">
            {perguntas.map((p) => (
              <details
                key={p.q}
                className="glass group rounded-2xl p-4 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="cursor-pointer list-none font-display text-sm font-bold text-foreground">
                  {p.q}
                </summary>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{p.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Referências */}
        <section className="mt-8">
          <Card>
            <div className="mb-2 flex items-center gap-2 text-gold">
              <BookOpen className="h-5 w-5" />
              <p className="text-xs font-semibold uppercase tracking-widest">Referências</p>
            </div>
            <ul className="space-y-1.5">
              {referencias.map((r) => (
                <li key={r} className="text-xs leading-relaxed text-muted-foreground">
                  • {r}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[11px] text-muted-foreground">
              Conteúdo educativo. Sempre siga os protocolos institucionais da sua unidade e as
              orientações da CCIH local.
            </p>
          </Card>
        </section>
      </ContentProtection>
    </AppShell>
  );
}
