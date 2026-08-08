import type { Procedimento } from "./index";
// Fotos enviadas pela professora (sequência real do procedimento)
import pvaGarroteando from "@/assets/procedimentos/pva-garroteando.png.asset.json";
import pvaTateando from "@/assets/procedimentos/pva-tateando.png.asset.json";
import pvaAssepsia from "@/assets/procedimentos/pva-assepsia.png.asset.json";
import pvaPuncionando1 from "@/assets/procedimentos/pva-puncionando-1.png.asset.json";
import pvaPuncionando2 from "@/assets/procedimentos/pva-puncionando-2.png.asset.json";
import pvaFixacao from "@/assets/procedimentos/pva-retirando-agulha.png.asset.json";
import pvaIdentificacao from "@/assets/procedimentos/pva-identificacao.png.asset.json";

// Imagens complementares das etapas de preparo e finalização
import pvaPreparo from "@/assets/procedimentos/pva-01-preparo.jpg";
import pvaMaos from "@/assets/procedimentos/pva-02-maos.jpg";
import pvaCalibre from "@/assets/procedimentos/pva-05-calibre.jpg";

export const PROC_PUNCAO_ADULTO: Procedimento = {
  slug: "puncao-venosa-adulto",
  titulo: "Punção Venosa Periférica e Prevenção de Flebite",
  subtitulo: "Passo a passo ilustrado (13 etapas) + escala de flebite",
  icon: "💉",
  cor: "text-red-600",
  publico: "Adulto",

  materiais: [
    "Bandeja higienizada com álcool 70%",
    "Cateter venoso periférico com dispositivo de segurança — 18 a 22 G conforme a veia e a terapia",
    "Garrote",
    "Clorexidina alcoólica 0,5% (preferencial) ou álcool 70%",
    "Gaze ou algodão",
    "Extensor/polifix e conector valvulado preenchidos com SF 0,9%",
    "Duas seringas de 10 mL com SF 0,9% (flush)",
    "Cobertura transparente estéril e fita para identificação",
    "Luvas de procedimento e coletor de perfurocortantes",
  ],
  indicacoes: [
    "Administração de medicamentos e fluidos endovenosos",
    "Hidratação e reposição volêmica",
    "Hemoterapia",
    "Coleta de sangue eventual e urgência/emergência",
  ],
  contraindicacoes: [
    "Membro com fístula arteriovenosa",
    "Membro homolateral a esvaziamento axilar/mastectomia",
    "Membro com paresia, plegia ou déficit neurológico",
    "Pele com lesão, hematoma, infecção ou área de flebite prévia",
    "Áreas de flexão como primeira escolha",
  ],
  complicacoes: [
    "Flebite mecânica, química, bacteriana ou pós-infusional",
    "Infiltração e extravasamento",
    "Hematoma e punção arterial acidental",
    "Obstrução do cateter",
    "Infecção de corrente sanguínea associada ao cateter",
  ],
  cenas: [
    {
      ordem: 1,
      imagem: pvaPreparo,
      titulo: "Preparo do material",
      descricao:
        "Confira a prescrição, higienize a bandeja com álcool 70% e reúna todo o material: cateter, garrote, antisséptico, gaze, extensor preenchido com SF 0,9%, cobertura transparente e coletor de perfurocortantes.",
      atencao: "Cheque validade e integridade das embalagens antes de levar ao leito.",
    },
    {
      ordem: 2,
      imagem: pvaMaos,
      titulo: "Higiene das mãos",
      descricao:
        "Higienize as mãos conforme os 5 momentos da OMS (fricção com álcool gel por 20–30 s ou água e sabão por 40–60 s) e calce as luvas de procedimento.",
      atencao: "A higiene das mãos é a medida isolada mais eficaz na prevenção de infecção relacionada ao cateter.",
    },
    {
      ordem: 3,
      imagem: pvaPosicao,
      titulo: "Identificação e posicionamento",
      descricao:
        "Identifique o paciente com dois identificadores (Meta 1), explique o procedimento, obtenha consentimento e posicione o membro apoiado, com o braço levemente abaixo do nível do coração.",
      atencao: "Pergunte sobre alergias (látex, clorexidina) e experiências anteriores de punção.",
    },
    {
      ordem: 4,
      imagem: pvaCalibre,
      titulo: "Escolha do calibre e do sítio",
      descricao:
        "Selecione o menor calibre que atenda à terapia (20–22 G na maioria dos adultos) e prefira o antebraço, sempre da região distal para a proximal. Evite dorso da mão em idosos e áreas de flexão.",
      atencao: "Calibre maior que o vaso é a principal causa de flebite mecânica.",
    },
    {
      ordem: 5,
      imagem: pvaGarroteando.url,
      titulo: "Garroteando",
      descricao:
        "Aplique o garrote 10–15 cm acima do sítio escolhido para favorecer o ingurgitamento venoso. Peça ao paciente para abrir e fechar a mão, se necessário.",
      atencao: "O garrote não deve permanecer por mais de 2 minutos, para evitar hemoconcentração.",
    },
    {
      ordem: 6,
      imagem: pvaTateando.url,
      titulo: "Tateando o vaso",
      descricao:
        "Palpe a veia avaliando trajeto, profundidade, calibre e elasticidade. Escolha um segmento retilíneo, sem válvulas nem bifurcações.",
      atencao: "Veia boa é palpável e elástica — não escolha apenas pela visualização.",
    },
    {
      ordem: 7,
      imagem: pvaAssepsia.url,
      titulo: "Antissepsia da pele",
      descricao:
        "Faça a antissepsia com clorexidina alcoólica 0,5% em movimento único ou circular, do centro para a periferia, cobrindo uma área maior que a do curativo.",
      atencao: "Aguarde a secagem espontânea (~30 s). Não abane, não sopre e não repalpe o local após a antissepsia.",
    },
    {
      ordem: 8,
      imagem: pvaPuncionando1.url,
      titulo: "Punção — inserção",
      descricao:
        "Tracione a pele com a mão não dominante para estabilizar a veia e introduza o cateter com o bisel voltado para cima, em ângulo de 15° a 30°.",
      atencao: "Máximo de 2 tentativas por profissional; após isso, acione outro colega.",
    },
    {
      ordem: 9,
      imagem: pvaPuncionando2.url,
      titulo: "Refluxo e progressão",
      descricao:
        "Ao visualizar o refluxo de sangue na câmara, reduza o ângulo, avance mais 2–3 mm e progrida somente o cateter sobre a agulha até o canhão tocar a pele.",
      atencao: "Nunca reintroduza a agulha guia dentro do cateter — risco de embolia por fragmento.",
    },
    {
      ordem: 10,
      imagem: pvaRetirandoAgulha.url,
      titulo: "Retirada da agulha guia",
      descricao:
        "Solte o garrote, faça compressão digital do vaso acima da ponta do cateter para evitar refluxo, retire a agulha acionando o dispositivo de segurança e descarte-a imediatamente.",
      atencao: "Descarte em coletor de perfurocortantes, sem reencapar (NR-32).",
    },
    {
      ordem: 11,
      imagem: pvaConexao,
      titulo: "Conexão do sistema",
      descricao:
        "Conecte o extensor/polifix com conector valvulado já preenchido com SF 0,9%, mantendo técnica asséptica e sem tocar as conexões.",
      atencao: "Friccione o conector com álcool 70% por 15 segundos antes de cada acesso (“scrub the hub”).",
    },
    {
      ordem: 12,
      imagem: pvaSalinizacao,
      titulo: "Teste de permeabilidade e salinização",
      descricao:
        "Infunda 10 mL de SF 0,9% em seringa de 10 mL, com turbilhonamento, observando ausência de dor, resistência, edema ou palidez local.",
      atencao: "Dor, resistência ou edema durante o flush = cateter mal posicionado; retire e puncione outro sítio.",
    },
    {
      ordem: 13,
      imagem: pvaIdentificacao.url,
      titulo: "Fixação, identificação e registro",
      descricao:
        "Fixe com cobertura transparente estéril, sem tracionar o cateter, e identifique com data, hora, calibre e nome do profissional. Registre no prontuário o sítio, o número de tentativas e as intercorrências.",
      atencao: "A cobertura deve permitir a inspeção do sítio; troque se estiver úmida, suja ou solta.",
    },
  ],
  checklist: [
    "Conferi a prescrição e higienizei a bandeja",
    "Higienizei as mãos e calcei luvas",
    "Identifiquei o paciente com dois identificadores e expliquei o procedimento",
    "Escolhi o menor calibre adequado, no antebraço, distal para proximal",
    "Apliquei o garrote 10–15 cm acima do sítio, por menos de 2 minutos",
    "Palpei a veia antes da antissepsia",
    "Fiz antissepsia com clorexidina alcoólica e aguardei secar",
    "Puncionei com bisel para cima em 15–30° (máximo 2 tentativas)",
    "Observei refluxo, progredi só o cateter e acionei o dispositivo de segurança",
    "Soltei o garrote, conectei o extensor e testei a permeabilidade com 10 mL de SF 0,9%",
    "Fixei com cobertura transparente e identifiquei data, hora, calibre e profissional",
    "Registrei no prontuário e orientei o paciente sobre sinais de flebite",
  ],
  referencias: [
    "INS. Infusion Therapy Standards of Practice, 2024.",
    "ANVISA. Medidas de prevenção de infecção relacionada à assistência à saúde, caderno 4.",
    "ANVISA. RDC nº 36/2013 — Segurança do paciente em serviços de saúde.",
    "BRASIL. NR-32 — Segurança e saúde no trabalho em serviços de saúde.",
    "COFEN. Resolução nº 736/2024 — Processo de Enfermagem.",
  ],
};
