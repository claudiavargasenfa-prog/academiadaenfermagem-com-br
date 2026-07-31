import type { Procedimento } from "./index";
import img01 from "@/assets/procedimentos/pva-01-preparo.jpg";
import img02 from "@/assets/procedimentos/pva-02-maos.jpg";
import img03 from "@/assets/procedimentos/pva-03-posicao.jpg";
import img04 from "@/assets/procedimentos/pva-04-garrote.jpg";
import img05 from "@/assets/procedimentos/pva-05-calibre.jpg";
import img06 from "@/assets/procedimentos/pva-06-antissepsia.jpg";
import img07 from "@/assets/procedimentos/pva-07-puncao.jpg";
import img08 from "@/assets/procedimentos/pva-08-refluxo.jpg";
import img09 from "@/assets/procedimentos/pva-09-conexao.jpg";
import img10 from "@/assets/procedimentos/pva-10-salinizacao.jpg";
import img11 from "@/assets/procedimentos/pva-11-fixacao.jpg";
import img12 from "@/assets/procedimentos/pva-12-registro.jpg";

export const PROC_PUNCAO_ADULTO: Procedimento = {
  slug: "puncao-venosa-adulto",
  titulo: "Punção Venosa Periférica — Adulto",
  subtitulo: "Acesso venoso periférico em membro superior",
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
      imagem: img01,
      titulo: "Checagem e preparo",
      descricao:
        "Confira a prescrição, identifique o paciente com dois identificadores, explique o procedimento e obtenha o consentimento. Separe todo o material em bandeja limpa e verifique validade e integridade das embalagens.",
      atencao: "Nunca inicie sem checar alergias (látex, clorexidina, adesivos).",
    },
    {
      ordem: 2,
      imagem: img02,
      titulo: "Higienização das mãos",
      descricao:
        "Higienize as mãos com água e sabão ou álcool gel 70%, seguindo os 5 momentos da OMS. Calce luvas de procedimento após a antissepsia das mãos.",
      atencao: "A higiene das mãos é a medida isolada mais eficaz contra infecção de corrente sanguínea.",
    },
    {
      ordem: 3,
      imagem: img03,
      titulo: "Posicionamento e escolha do membro",
      descricao:
        "Posicione o braço apoiado, abaixo do nível do coração. Prefira o membro não dominante e evite membro com fístula, mastectomia, plegia, edema ou lesão de pele.",
      atencao: "Evite áreas de flexão (fossa cubital e punho) como primeira escolha.",
    },
    {
      ordem: 4,
      imagem: img04,
      titulo: "Garroteamento e seleção da veia",
      descricao:
        "Aplique o garrote 10–15 cm acima do sítio escolhido. Selecione veia calibrosa, retilínea e palpável — preferencialmente antebraço, progredindo distal para proximal.",
      atencao: "O garrote não deve permanecer mais de 1 a 2 minutos; solte e reaplique se necessário.",
      overlays: [{ tipo: "pulse", x: 0.5, y: 0.45, cor: "gold" }],
    },
    {
      ordem: 5,
      imagem: img05,
      titulo: "Escolha do calibre",
      descricao:
        "Selecione o menor calibre capaz de atender à terapia: 22–24 G para infusões de rotina e idosos, 20 G para maioria dos adultos, 18 G ou maior para hemoterapia e reposição volêmica rápida.",
      atencao: "Cateter muito calibroso para a veia aumenta o risco de flebite mecânica.",
    },
    {
      ordem: 6,
      imagem: img06,
      titulo: "Antissepsia da pele",
      descricao:
        "Realize antissepsia com clorexidina alcoólica 0,5% em movimento único ou circular do centro para a periferia, e aguarde a secagem espontânea (cerca de 30 segundos).",
      atencao: "Não abane, não sopre e não repalpe a veia após a antissepsia sem luva estéril.",
    },
    {
      ordem: 7,
      imagem: img07,
      titulo: "Punção",
      descricao:
        "Tracione a pele abaixo do sítio para estabilizar a veia e introduza o cateter com o bisel para cima, em ângulo de 15° a 30°, com movimento firme e contínuo.",
      atencao: "Máximo de duas tentativas por profissional; após isso, acione outro colega.",
      overlays: [{ tipo: "pulse", x: 0.45, y: 0.5, cor: "danger" }],
    },
    {
      ordem: 8,
      imagem: img08,
      titulo: "Refluxo e progressão do cateter",
      descricao:
        "Ao visualizar o refluxo sanguíneo na câmara, reduza o ângulo, avance mais 2–3 mm, recue a agulha-guia e progrida somente o cateter até o canhão.",
      atencao: "Jamais reintroduza a agulha dentro do cateter — risco de embolia por fragmento.",
    },
    {
      ordem: 9,
      imagem: img09,
      titulo: "Soltar o garrote e conectar",
      descricao:
        "Solte o garrote, faça compressão digital acima da ponta do cateter, retire a agulha em dispositivo de segurança e conecte o extensor/conector valvulado previamente preenchido com SF 0,9%.",
      atencao: "Descarte a agulha imediatamente em recipiente rígido (NR-32).",
    },
    {
      ordem: 10,
      imagem: img10,
      titulo: "Salinização e teste de permeabilidade",
      descricao:
        "Realize flushing com 10 mL de SF 0,9% em seringa de 10 ou 20 mL, com fluxo turbilhonar, observando ausência de dor, resistência, edema ou palidez local.",
      atencao: "Dor, resistência ou abaulamento indicam mau posicionamento — retire o dispositivo.",
    },
    {
      ordem: 11,
      imagem: img11,
      titulo: "Fixação e identificação",
      descricao:
        "Fixe com filme transparente estéril, mantendo o sítio visível. Identifique com data, hora, calibre do cateter e nome do profissional.",
      atencao: "Curativo úmido, sujo ou solto deve ser trocado imediatamente.",
    },
    {
      ordem: 12,
      imagem: img12,
      titulo: "Registro e monitoramento",
      descricao:
        "Descarte os resíduos, higienize as mãos e registre no prontuário: sítio, calibre, número de tentativas, intercorrências e aceitação do paciente. Avalie o sítio a cada plantão.",
      atencao: "Rodízio do acesso em até 96 h ou conforme avaliação clínica e protocolo institucional.",
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
