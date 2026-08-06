import type { Procedimento } from "./index";
import pvaGarroteando from "@/assets/procedimentos/pva-garroteando.png.asset.json";
import pvaTateando from "@/assets/procedimentos/pva-tateando.png.asset.json";
import pvaAssepsia from "@/assets/procedimentos/pva-assepsia.png.asset.json";
import pvaPuncionando1 from "@/assets/procedimentos/pva-puncionando-1.png.asset.json";
import pvaPuncionando2 from "@/assets/procedimentos/pva-puncionando-2.png.asset.json";
import pvaRetirandoAgulha from "@/assets/procedimentos/pva-retirando-agulha.png.asset.json";
import pvaIdentificacao from "@/assets/procedimentos/pva-identificacao.png.asset.json";

export const PROC_PUNCAO_ADULTO: Procedimento = {
  slug: "puncao-venosa-adulto",
  titulo: "Punção Venosa Periférica e Prevenção de Flebite",
  subtitulo: "Acesso venoso periférico com escala de flebite Maddox",
  icon: "💉",
  cor: "text-red-600",
  publico: "Adulto",
  
  materiais: [
    "Cateter venoso periférico (Jelco/Abbocath) — calibre conforme indicação (geralmente 18–22 G)",
    "Garrote",
    "Antisséptico (clorexidina alcoólica 0,5% preferencial)",
    "Algodão ou gaze",
    "Polifix/extensor, conector valvulado, salinização com SF 0,9%",
    "Filme transparente estéril para fixação, esparadrapo",
    "Luvas de procedimento",
  ],
  indicacoes: [
    "Administração de medicamentos e fluidos endovenosos",
    "Hemoterapia",
    "Coleta de sangue (eventual)",
  ],
  contraindicacoes: [
    "Membro com fístula arteriovenosa, mastectomia ipsilateral, paresia/plegia, infecção local",
    "Áreas de flexão como primeira escolha",
  ],
  complicacoes: [
    "Flebite mecânica, química ou infecciosa",
    "Infiltração / extravasamento",
    "Hematoma",
    "Infecção de corrente sanguínea associada ao cateter",
  ],
  cenas: [
    {
      ordem: 1,
      imagem: pvaGarroteando.url,
      titulo: "Garroteando",
      descricao:
        "Aplique o garrote 10–15 cm acima do sítio escolhido para favorecer o ingurgitamento venoso. Peça ao paciente para abrir e fechar a mão se necessário.",
      atencao: "O garrote não deve permanecer por mais de 2 minutos para evitar hemoconcentração.",
    },
    {
      ordem: 2,
      imagem: pvaTateando.url,
      titulo: "Tateando o vaso",
      descricao:
        "Palpe a veia para avaliar o trajeto, profundidade, calibre e elasticidade. Escolha um segmento retilíneo e evite válvulas ou áreas de bifurcação.",
      atencao: "Sempre avalie a rede venosa antes de iniciar a antissepsia.",
    },
    {
      ordem: 3,
      imagem: pvaAssepsia.url,
      titulo: "Assepsia",
      descricao:
        "Realize a antissepsia da pele com clorexidina alcoólica 0,5% em movimento único ou circular, do centro para a periferia.",
      atencao: "Aguarde a secagem espontânea por cerca de 30 segundos antes de puncionar.",
    },
    {
      ordem: 4,
      imagem: pvaPuncionando1.url,
      titulo: "Puncionando (Início)",
      descricao:
        "Introduza o cateter com o bisel voltado para cima, em um ângulo de 15° a 30°, estabilizando a veia com a mão não dominante.",
      atencao: "Mantenha a pele tracionada para evitar o deslizamento da veia.",
    },
    {
      ordem: 5,
      imagem: pvaPuncionando2.url,
      titulo: "Puncionando (Refluxo)",
      descricao:
        "Ao visualizar o refluxo de sangue na câmara, reduza o ângulo de inserção e avance o cateter alguns milímetros para garantir que a ponta esteja no lúmen do vaso.",
      atencao: "Visualize o sangue preenchendo o canhão do cateter.",
    },
    {
      ordem: 6,
      imagem: pvaRetirandoAgulha.url,
      titulo: "Retirando a agulha",
      descricao:
        "Pressione levemente o vaso acima da ponta do cateter para evitar refluxo, retire o guia metálico e conecte o sistema de infusão ou conector valvulado.",
      atencao: "Descarte a agulha imediatamente em coletor de perfurocortantes.",
    },
    {
      ordem: 7,
      imagem: pvaIdentificacao.url,
      titulo: "Identificação",
      descricao:
        "Fixe o acesso com cobertura transparente estéril e identifique com data, hora, calibre do cateter e nome do profissional responsável.",
      atencao: "A identificação deve estar clara e sem obstruir a visualização do sítio de inserção.",
    },
  ],
  checklist: [
    "Higienizei as mãos e calcei luvas",
    "Selecionei veia adequada (preferir antebraço, distal para proximal)",
    "Apliquei garrote 10–15 cm acima do sítio",
    "Realizei antissepsia em movimento único, deixando secar",
    "Puncionei com bisel para cima em ângulo 15–30°",
    "Observei refluxo, recuei a agulha e progredi o cateter",
    "Soltei o garrote, conectei extensor e salinizei",
    "Fixei com filme transparente e datei",
    "Registrei calibre, sítio, número de tentativas e intercorrências",
  ],
  referencias: [
    "INS. Infusion Therapy Standards of Practice, 2021.",
    "ANVISA. Medidas de prevenção de infecção relacionada à assistência à saúde, 2017.",
    "COFEN. Resolução nº 258/2001 — Cateterismo venoso central por enfermeiro (referência correlata).",
  ],
};
