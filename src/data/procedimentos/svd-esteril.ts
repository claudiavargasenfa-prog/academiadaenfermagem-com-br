import type { Procedimento } from "./index";
import imgMateriais from "@/assets/procedimentos/svd-materiais.jpg";
import imgBalonete from "@/assets/procedimentos/svd-balonete.jpg";
import imgComparativo from "@/assets/procedimentos/svd-comparativo.jpg";
import imgInsuflacao from "@/assets/procedimentos/svd-insuflacao.jpg";
import imgFixacao from "@/assets/procedimentos/svd-f-fixacao.jpg";

export const PROC_SVD_ESTERIL: Procedimento = {
  slug: "svd-esteril",
  titulo: "Cateterismo Vesical — Técnica Estéril e Prevenção de ITU-AC",
  subtitulo: "Bundle de inserção e manutenção (ANVISA / CDC)",
  icon: "🧪",
  cor: "text-amber-600",
  publico: "Adulto",
  materiais: [
    "Bandeja de cateterismo vesical estéril",
    "Cateter de Foley 2 vias (3 vias apenas se irrigação)",
    "Sistema fechado de drenagem pré-conectado sempre que disponível",
    "Água destilada estéril 5 a 10 mL para o balonete",
    "Clorexidina degermante (higiene prévia) e aquosa 0,2% (antissepsia)",
    "Lidocaína gel 2% estéril",
    "Luvas estéreis, campo fenestrado, gazes estéreis, máscara",
    "Dispositivo de estabilização do cateter",
  ],
  indicacoes: [
    "Retenção urinária aguda ou obstrução do trato urinário",
    "Monitorização rigorosa de diurese em paciente crítico",
    "Perioperatório selecionado (cirurgias longas, urológicas, pélvicas)",
    "Lesão por pressão sacral em paciente incontinente",
    "Cuidados de fim de vida quando promove conforto",
  ],
  contraindicacoes: [
    "Suspeita de trauma uretral (sangue no meato, hematoma perineal)",
    "Prostatite aguda ou estenose uretral sem avaliação urológica",
    "NÃO indicar por: incontinência isolada, conveniência da equipe, coleta de urina de rotina ou imobilidade sem outro critério",
  ],
  complicacoes: [
    "ITU associada ao cateter (ITU-AC) — risco cumulativo por dia de permanência",
    "Trauma uretral e falso trajeto",
    "Hematúria e espasmo vesical",
    "Obstrução do cateter, bypass de urina e retenção",
    "Bacteremia secundária e sepse de foco urinário",
  ],
  cenas: [
    {
      ordem: 1,
      imagem: imgMateriais,
      titulo: "1. Indicar corretamente é o primeiro cuidado",
      descricao:
        "A medida mais eficaz de prevenção de ITU-AC é não inserir o cateter sem indicação e retirá-lo o mais precocemente possível. Antes de abrir o material, questione: existe alternativa (coletor externo, fralda, cateterismo intermitente, ultrassom de bexiga)?",
      atencao: "Reavalie a indicação TODOS os dias e registre a decisão no prontuário.",
    },
    {
      ordem: 2,
      imagem: imgBalonete,
      titulo: "2. Barreira máxima e técnica asséptica",
      descricao:
        "Higiene das mãos, higiene íntima prévia com água e sabão, abertura do kit sem contaminar, luvas estéreis, campo fenestrado, antissepsia com clorexidina aquosa e lubrificação com gel estéril de uso único. Teste do balonete com água destilada.",
      atencao: "Cada quebra de técnica asséptica na inserção multiplica o risco de bacteriúria.",
    },
    {
      ordem: 3,
      imagem: imgComparativo,
      titulo: "3. Diferenças anatômicas homem × mulher",
      descricao:
        "Mulher: uretra de 3 a 5 cm, introdução de 5 a 7 cm, risco de sondar a vagina. Homem: uretra de 18 a 22 cm com curvaturas e próstata, introdução de 18 a 22 cm, anestésico uretral obrigatório e risco de falso trajeto e parafimose.",
      atencao: "Nunca force a progressão. Resistência mantida = parar e acionar avaliação médica/urológica.",
    },
    {
      ordem: 4,
      imagem: imgInsuflacao,
      titulo: "4. Refluxo antes de insuflar — sempre",
      descricao:
        "Só insufle o balonete após refluxo franco de urina, com o volume marcado no corpo da sonda e com água destilada estéril. Tracione delicadamente até a resistência do colo vesical.",
      atencao: "Insuflar sem refluxo, ou com SF 0,9%, é causa clássica de lesão uretral e de balonete travado.",
    },
    {
      ordem: 5,
      imagem: imgFixacao,
      titulo: "5. Bundle de manutenção do sistema fechado",
      descricao:
        "Mantenha o sistema fechado e íntegro, bolsa sempre abaixo do nível da bexiga e nunca no chão, circuito sem dobras, fixação sem tração, higiene íntima diária com água e sabão, esvaziamento com luvas e frasco individual por paciente.",
      atencao:
        "Não troque cateter ou bolsa em intervalos fixos e não faça irrigação ou antimicrobiano profilático de rotina: troque por obstrução, quebra de técnica ou indicação clínica.",
    },
  ],
  checklist: [
    "Avaliei a real necessidade do cateter e alternativas menos invasivas",
    "Higienizei as mãos e realizei higiene íntima prévia",
    "Abri o campo estéril e calcei luvas estéreis",
    "Fiz antissepsia conforme o sexo do paciente",
    "Lubrifiquei/anestesiei a uretra com gel estéril de uso único",
    "Inseri o cateter sem forçar, até refluxo de urina",
    "Insuflei o balonete com ÁGUA DESTILADA no volume indicado",
    "Mantive o sistema fechado de drenagem",
    "Fixei sem tração e deixei a bolsa abaixo do nível da bexiga",
    "Registrei indicação, calibre, volume, aspecto e intercorrências",
    "Reavalio diariamente a permanência e programo a retirada precoce",
  ],
  referencias: [
    "ANVISA. RDC nº 36/2013 — Segurança do paciente em serviços de saúde.",
    "ANVISA. Medidas de Prevenção de IRAS — Caderno 4: Prevenção de ITU-AC.",
    "COFEN. Resolução nº 450/2013 e Resolução nº 736/2024.",
    "CDC/HICPAC. Guideline for Prevention of Catheter-Associated Urinary Tract Infections.",
    "POTTER & PERRY. Fundamentos de Enfermagem, edição vigente.",
  ],
};
