import type { Procedimento } from "./index";
import imgAnatomia from "@/assets/procedimentos/svd-f-anatomia.jpg";
import imgMateriais from "@/assets/procedimentos/svd-materiais.jpg";
import imgPosicao from "@/assets/procedimentos/svd-f-posicao.jpg";
import imgBalonete from "@/assets/procedimentos/svd-balonete.jpg";
import imgAntissepsia from "@/assets/procedimentos/svd-f-antissepsia.jpg";
import imgInsercao from "@/assets/procedimentos/svd-f-insercao.jpg";
import imgInsuflacao from "@/assets/procedimentos/svd-insuflacao.jpg";
import imgFixacao from "@/assets/procedimentos/svd-f-fixacao.jpg";

export const PROC_SVD_FEM: Procedimento = {
  slug: "svd-feminino",
  titulo: "Cateterismo Vesical de Demora (SVD) — Feminino",
  subtitulo: "Técnica estéril passo a passo com anatomia ilustrada",
  icon: "💧",
  cor: "text-pink-600",
  publico: "Adulto feminino",
  materiais: [
    "Bandeja/kit de cateterismo vesical estéril",
    "Sonda de Foley 2 vias — 12 a 16 Fr (adulto feminino)",
    "Sistema fechado de drenagem (bolsa coletora)",
    "Seringa de 10 mL com ÁGUA DESTILADA estéril (nunca SF 0,9%)",
    "Lidocaína gel 2% estéril (lubrificação)",
    "Clorexidina aquosa 0,2% ou PVPI tópico + gazes estéreis",
    "Campo fenestrado, luvas estéreis, luvas de procedimento, máscara",
    "Dispositivo de estabilização (fixador adesivo) e cuba",
  ],
  indicacoes: [
    "Retenção urinária aguda com falha de medidas conservadoras",
    "Controle rigoroso de diurese no paciente crítico/instável",
    "Perioperatório de cirurgias longas, urológicas ou pélvicas",
    "Lesão por pressão sacral/perineal em contato com urina",
    "Necessidade de irrigação vesical ou imobilização prolongada com indicação clínica",
  ],
  contraindicacoes: [
    "Suspeita de trauma uretral (sangramento pelo meato, hematoma perineal)",
    "Infecção genital ativa em atividade (relativa — avaliar risco/benefício)",
    "Conforto do cuidador, incontinência isolada ou coleta de rotina de urina NÃO são indicação",
  ],
  complicacoes: [
    "ITU associada ao cateter (ITU-AC) — risco cumulativo de 3 a 7% por dia de permanência",
    "Trauma/lesão uretral e hematúria",
    "Sondagem inadvertida da vagina (descartar a sonda e reiniciar com material novo)",
    "Espasmo vesical, obstrução e bypass de urina ao redor do cateter",
    "Lesão por tração se fixação inadequada",
  ],
  cenas: [
    {
      ordem: 1,
      imagem: imgAnatomia,
      titulo: "Anatomia feminina — por que é diferente",
      descricao:
        "A uretra feminina mede em média 3 a 5 cm e é retilínea, sem próstata e sem curvaturas. O meato uretral fica entre o clitóris e o introito vaginal. Por isso a introdução é curta (5 a 7 cm) e o principal erro é sondar a vagina por identificação incorreta do meato.",
      atencao:
        "Uretra curta = menor trauma, porém maior risco de contaminação por proximidade anal. Antissepsia rigorosa é essencial.",
      overlays: [{ tipo: "pulse", x: 0.33, y: 0.68, cor: "gold" }],
    },
    {
      ordem: 2,
      imagem: imgMateriais,
      titulo: "Indicação, checagem e materiais",
      descricao:
        "Confirme a indicação clínica real e a prescrição, identifique a paciente com dois identificadores e explique o procedimento. Separe todo o material, cheque validade e integridade das embalagens e verifique alergias (látex, clorexidina, lidocaína).",
      atencao:
        "Cateter sem indicação é a principal causa evitável de ITU-AC. Se não há indicação, o cuidado correto é NÃO sondar.",
    },
    {
      ordem: 3,
      imagem: imgPosicao,
      titulo: "Privacidade, higiene íntima e posicionamento",
      descricao:
        "Garanta privacidade e iluminação adequada. Realize higiene íntima prévia com água e sabão (frente para trás). Posicione em decúbito dorsal com joelhos fletidos e afastados (posição ginecológica), com forro sob a região glútea.",
      atencao:
        "Higienize as mãos antes e depois. A higiene íntima prévia é etapa distinta da antissepsia estéril — não substitui.",
    },
    {
      ordem: 4,
      imagem: imgBalonete,
      titulo: "Campo estéril, teste do balonete e lubrificação",
      descricao:
        "Abra o kit com técnica asséptica, calce luvas estéreis e monte o campo fenestrado. Teste o balonete insuflando e desinsuflando com água destilada, e lubrifique generosamente a ponta da sonda com lidocaína gel 2%.",
      atencao:
        "Insufle o balonete SEMPRE com água destilada estéril. Soro fisiológico cristaliza e pode impedir a retirada do cateter.",
    },
    {
      ordem: 5,
      imagem: imgAntissepsia,
      titulo: "Antissepsia — sempre da frente para trás",
      descricao:
        "Com a mão não dominante afaste os grandes e pequenos lábios e mantenha-a fixa (torna-se contaminada). Com a mão dominante e pinça, faça a antissepsia em movimentos únicos, de cima para baixo: grande lábio direito, esquerdo, pequenos lábios e, por último, o meato uretral. Uma gaze por movimento.",
      atencao:
        "Nunca retorne com a mesma gaze nem faça movimento de vaivém — isso leva flora perianal ao meato.",
      overlays: [{ tipo: "pulse", x: 0.5, y: 0.3, cor: "danger" }],
    },
    {
      ordem: 6,
      imagem: imgInsercao,
      titulo: "Identificação do meato e introdução da sonda",
      descricao:
        "Mantendo os lábios afastados, visualize o meato uretral (acima do introito vaginal). Introduza a sonda lubrificada suavemente, 5 a 7 cm, até o retorno de urina; então avance mais 2 a 3 cm para garantir que o balonete esteja dentro da bexiga.",
      atencao:
        "Se a sonda entrar na vagina: deixe-a como referência anatômica, pegue uma sonda NOVA estéril e reinicie. Nunca reutilize a sonda contaminada.",
      overlays: [{ tipo: "pulse", x: 0.45, y: 0.45, cor: "gold" }],
    },
    {
      ordem: 7,
      imagem: imgInsuflacao,
      titulo: "Insuflação do balonete e ancoragem",
      descricao:
        "Após refluxo de urina, insufle o balonete com o volume indicado no corpo da sonda (em geral 5 a 10 mL de água destilada). Tracione delicadamente até sentir a resistência do colo vesical, confirmando o posicionamento.",
      atencao:
        "Dor intensa ou resistência durante a insuflação = balonete possivelmente na uretra. PARE, desinsufle e reavalie.",
    },
    {
      ordem: 8,
      imagem: imgFixacao,
      titulo: "Sistema fechado, fixação e registro",
      descricao:
        "Conecte a sonda ao sistema fechado de drenagem (se ainda não pré-conectado), fixe com dispositivo adesivo na face interna da coxa sem tração, mantenha a bolsa sempre abaixo do nível da bexiga e sem tocar o chão. Registre data, calibre, volume do balonete, volume e aspecto da diurese, intercorrências e a indicação clínica.",
      atencao:
        "Nunca desconecte o sistema fechado para 'medir' diurese: use a válvula de drenagem. Cada abertura aumenta o risco de ITU-AC.",
    },
  ],
  checklist: [
    "Confirmei indicação clínica real e prescrição",
    "Expliquei o procedimento e garanti privacidade",
    "Realizei higiene íntima prévia (frente para trás)",
    "Posicionei em posição ginecológica com boa iluminação",
    "Higienizei as mãos e calcei luvas estéreis; montei campo fenestrado",
    "Testei o balonete e lubrifiquei a sonda",
    "Fiz antissepsia em movimentos únicos, de cima para baixo",
    "Identifiquei o meato e introduzi 5–7 cm até refluxo + 2–3 cm",
    "Insuflei o balonete com ÁGUA DESTILADA no volume indicado",
    "Mantive sistema fechado, fixei sem tração e bolsa abaixo da bexiga",
    "Registrei calibre, volume, aspecto da diurese e indicação",
    "Reavalio diariamente a necessidade de manutenção do cateter",
  ],
  referencias: [
    "COFEN. Resolução nº 450/2013 — Cateterismo urinário pelo enfermeiro.",
    "COFEN. Resolução nº 736/2024 — Processo de Enfermagem.",
    "ANVISA. Medidas de Prevenção de Infecção Relacionada à Assistência à Saúde — Caderno 4 (ITU-AC).",
    "ANVISA. RDC nº 36/2013 — Segurança do paciente.",
    "CDC/HICPAC. Guideline for Prevention of Catheter-Associated Urinary Tract Infections (atualizações vigentes).",
  ],
};
