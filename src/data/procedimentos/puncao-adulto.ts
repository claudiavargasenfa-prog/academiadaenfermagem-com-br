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
  subtitulo: "Passo a passo ilustrado (9 etapas reais) + escala de flebite",
  icon: "💉",
  cor: "text-red-600",
  publico: "Adulto",

  materiais: [
    "Bandeja higienizada com álcool 70%",
    "Cateter venoso periférico com dispositivo de segurança — 18 a 22 G",
    "Garrote",
    "Clorexidina alcoólica 0,5% (preferencial) ou álcool 70%",
    "Gaze ou algodão",
    "Extensor/polifix e conector valvulado preenchidos com SF 0,9%",
    "Seringa de 10 mL com SF 0,9% (flush)",
    "Cobertura transparente estéril e etiqueta de identificação",
    "Luvas de procedimento e coletor de perfurocortantes",
  ],
  indicacoes: [
    "Administração de medicamentos e fluidos endovenosos",
    "Hidratação e reposição volêmica",
    "Hemoterapia",
    "Urgência e emergência",
  ],
  contraindicacoes: [
    "Membro com fístula arteriovenosa",
    "Membro homolateral a esvaziamento axilar",
    "Pele com lesão, hematoma ou infecção",
    "Áreas de flexão como primeira escolha",
  ],
  complicacoes: [
    "Flebite (mecânica, química, bacteriana)",
    "Infiltração e extravasamento",
    "Hematoma",
    "Obstrução do cateter",
  ],
  cenas: [
    {
      ordem: 1,
      imagem: pvaPreparo,
      titulo: "Preparo do material",
      descricao:
        "Confira a prescrição, higienize a bandeja com álcool 70% e reúna todo o material necessário.",
      atencao: "Cheque validade e integridade das embalagens antes de levar ao leito.",
    },
    {
      ordem: 2,
      imagem: pvaMaos,
      titulo: "Higiene das mãos",
      descricao:
        "Higienize as mãos conforme os 5 momentos da OMS e calce as luvas de procedimento.",
      atencao: "A higiene das mãos é a medida isolada mais eficaz na prevenção de infecções.",
    },
    {
      ordem: 3,
      imagem: pvaCalibre,
      titulo: "Escolha do calibre e do sítio",
      descricao:
        "Selecione o menor calibre que atenda à terapia e prefira o antebraço, sempre da região distal para a proximal.",
      atencao: "Calibre maior que o vaso é a principal causa de flebite mecânica.",
    },
    {
      ordem: 4,
      imagem: pvaGarroteando.url,
      titulo: "Garroteando o membro",
      descricao:
        "Aplique o garrote 10-15 cm acima do sítio escolhido para favorecer o ingurgitamento venoso.",
      atencao: "O garrote não deve permanecer por mais de 2 minutos para evitar hemoconcentração.",
    },
    {
      ordem: 5,
      imagem: pvaAssepsia.url,
      titulo: "Antissepsia da pele",
      descricao:
        "Faça a antissepsia com clorexidina alcoólica 0,5% em movimento único ou circular.",
      atencao: "Aguarde a secagem espontânea (~30 s). Não abane e não sopre.",
    },
    {
      ordem: 6,
      imagem: pvaTateando.url,
      titulo: "Palpação da veia",
      descricao:
        "Palpe a veia avaliando trajeto, profundidade e elasticidade. Escolha um segmento retilíneo.",
      atencao: "Veia boa é palpável e elástica — não escolha apenas pela visualização.",
    },
    {
      ordem: 7,
      imagem: pvaPuncionando1.url,
      titulo: "Inserção do cateter",
      descricao:
        "Introduza o cateter com o bisel voltado para cima, em ângulo de 15° a 30°.",
      atencao: "Máximo de 2 tentativas por profissional.",
    },
    {
      ordem: 8,
      imagem: pvaFixacao.url,
      titulo: "Estabilização e curativo",
      descricao:
        "Após o refluxo, progrida o cateter, remova o garrote e estabilize com o curativo transparente.",
      atencao: "A cobertura deve permitir a inspeção contínua do sítio de inserção.",
    },
    {
      ordem: 9,
      imagem: pvaIdentificacao.url,
      titulo: "Identificação completa",
      descricao:
        "Identifique a punção com nome do paciente, calibre do cateter, data e responsável.",
      atencao: "A etiqueta de identificação não deve obstruir a visualização do óstio da punção.",
    },
  ],
  checklist: [
    "Conferi a prescrição e higienizei a bandeja",
    "Higienizei as mãos e calcei luvas",
    "Escolhi o menor calibre adequado",
    "Apliquei o garrote e palpei a veia",
    "Fiz antissepsia e aguardei secar",
    "Puncionei com bisel para cima em 15-30°",
    "Observei refluxo e progredi o cateter",
    "Fixei com cobertura transparente",
    "Identifiquei e registrei no prontuário",
  ],
  referencias: [
    "INS. Infusion Therapy Standards of Practice, 2024.",
    "ANVISA. Medidas de prevenção de infecção relacionada à assistência à saúde.",
    "COFEN. Resolução nº 736/2024 — Processo de Enfermagem.",
  ],
};