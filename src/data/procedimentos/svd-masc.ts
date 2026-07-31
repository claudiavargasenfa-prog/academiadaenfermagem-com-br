import type { Procedimento } from "./index";
import imgAnatomia from "@/assets/procedimentos/svd-m-anatomia.jpg";
import imgMateriais from "@/assets/procedimentos/svd-materiais.jpg";
import imgBalonete from "@/assets/procedimentos/svd-balonete.jpg";
import imgTecnica from "@/assets/procedimentos/svd-m-tecnica.jpg";
import imgGel from "@/assets/procedimentos/svd-m-gel.jpg";
import imgInsercao from "@/assets/procedimentos/svd-m-insercao.jpg";
import imgInsuflacao from "@/assets/procedimentos/svd-insuflacao.jpg";
import imgFixacao from "@/assets/procedimentos/svd-m-fixacao.jpg";

export const PROC_SVD_MASC: Procedimento = {
  slug: "svd-masculino",
  titulo: "Cateterismo Vesical de Demora (SVD) — Masculino",
  subtitulo: "Técnica estéril passo a passo com anatomia ilustrada",
  icon: "💧",
  cor: "text-blue-600",
  publico: "Adulto masculino",
  materiais: [
    "Bandeja/kit de cateterismo vesical estéril",
    "Sonda de Foley 2 vias — 14 a 18 Fr (3 vias se irrigação/hematúria)",
    "Sistema fechado de drenagem (bolsa coletora)",
    "Seringa de 10 mL com ÁGUA DESTILADA estéril (nunca SF 0,9%)",
    "Lidocaína gel 2% estéril — seringa uretral de 10 a 20 mL",
    "Clorexidina aquosa 0,2% ou PVPI tópico + gazes estéreis",
    "Campo fenestrado, luvas estéreis, luvas de procedimento, máscara",
    "Dispositivo de estabilização (fixador adesivo) e cuba",
  ],
  indicacoes: [
    "Retenção urinária aguda (globo vesical)",
    "Controle rigoroso de diurese no paciente crítico",
    "Perioperatório de cirurgias longas, urológicas ou pélvicas",
    "Hematúria com necessidade de irrigação vesical contínua (sonda de 3 vias)",
    "Lesão por pressão sacral em paciente com incontinência",
  ],
  contraindicacoes: [
    "Suspeita de trauma uretral: sangue no meato, hematoma perineal/escrotal, próstata não palpável — NÃO sondar, acionar urologia",
    "Estenose uretral conhecida sem avaliação urológica",
    "Prostatite aguda",
    "Conforto do cuidador ou incontinência isolada NÃO são indicação",
  ],
  complicacoes: [
    "ITU associada ao cateter (ITU-AC)",
    "Falso trajeto e lesão uretral (mais frequente que no sexo feminino)",
    "Hematúria e espasmo vesical",
    "Parafimose quando o prepúcio não é recolocado",
    "Obstrução do cateter e retenção com bexiga cheia",
  ],
  cenas: [
    {
      ordem: 1,
      imagem: imgAnatomia,
      titulo: "Anatomia masculina — por que é mais difícil",
      descricao:
        "A uretra masculina mede 18 a 22 cm e tem duas curvaturas e três pontos de maior resistência: o esfíncter externo, a uretra membranosa e a uretra prostática. A próstata pode aumentar a resistência à progressão da sonda.",
      atencao:
        "O comprimento e as curvaturas explicam a necessidade de anestésico uretral e de introdução até a bifurcação em Y.",
      overlays: [{ tipo: "pulse", x: 0.52, y: 0.45, cor: "gold" }],
    },
    {
      ordem: 2,
      imagem: imgMateriais,
      titulo: "Indicação, checagem e materiais",
      descricao:
        "Confirme a indicação clínica e a prescrição, identifique o paciente com dois identificadores, explique o procedimento e cheque alergias. Separe o material e verifique validade e integridade das embalagens. Escolha o menor calibre eficaz (14 a 16 Fr na maioria dos adultos).",
      atencao:
        "Calibres maiores não drenam melhor: aumentam trauma uretral, dor e risco de estenose.",
    },
    {
      ordem: 3,
      imagem: imgBalonete,
      titulo: "Campo estéril, teste do balonete e lubrificação",
      descricao:
        "Higienize as mãos, abra o kit com técnica asséptica, calce luvas estéreis e monte o campo fenestrado. Teste o balonete com água destilada, desinsufle e lubrifique a sonda.",
      atencao:
        "Insufle SEMPRE com água destilada estéril; SF 0,9% cristaliza e pode travar o balonete na retirada.",
    },
    {
      ordem: 4,
      imagem: imgTecnica,
      titulo: "Retração do prepúcio e antissepsia da glande",
      descricao:
        "Com a mão não dominante, segure o pênis e retraia o prepúcio expondo completamente a glande — essa mão permanece fixa. Faça antissepsia em movimentos circulares do meato para a periferia, trocando a gaze a cada movimento, e depois o corpo do pênis.",
      atencao:
        "Nunca retorne ao meato com a mesma gaze. A mão que segura o pênis não toca mais o material estéril.",
      overlays: [{ tipo: "pulse", x: 0.18, y: 0.55, cor: "danger" }],
    },
    {
      ordem: 5,
      imagem: imgGel,
      titulo: "Instilação de lidocaína gel uretral",
      descricao:
        "Instile 10 a 20 mL de lidocaína gel 2% estéril diretamente na uretra, comprima suavemente o meato e aguarde 2 a 5 minutos para anestesia e lubrificação de toda a extensão uretral.",
      atencao:
        "Essa etapa reduz dor, trauma e falso trajeto — não a suprima por pressa. Cheque alergia a anestésico local.",
    },
    {
      ordem: 6,
      imagem: imgInsercao,
      titulo: "Tração a 90° e introdução de 18 a 22 cm",
      descricao:
        "Posicione o pênis a 90° em relação ao abdome, com leve tração para retificar a uretra. Introduza a sonda lentamente 18 a 22 cm, até o retorno de urina. Ao sentir a resistência do esfíncter externo, peça respiração profunda e abaixe o pênis para 45–60°, mantendo pressão suave e contínua.",
      atencao:
        "NUNCA force. Resistência mantida, dor intensa ou sangramento = suspender e acionar o urologista (risco de falso trajeto).",
      overlays: [{ tipo: "pulse", x: 0.3, y: 0.6, cor: "gold" }],
    },
    {
      ordem: 7,
      imagem: imgInsuflacao,
      titulo: "Avanço até a bifurcação e insuflação do balonete",
      descricao:
        "Após o refluxo de urina, avance a sonda até quase a bifurcação em Y — isso garante que o balonete ultrapassou a uretra prostática. Só então insufle com o volume indicado na sonda (5 a 10 mL de água destilada) e tracione delicadamente até sentir a resistência do colo vesical.",
      atencao:
        "Insuflar o balonete ainda na uretra causa ruptura uretral. Refluxo de urina é obrigatório antes de insuflar.",
    },
    {
      ordem: 8,
      imagem: imgFixacao,
      titulo: "Recolocação do prepúcio, fixação e registro",
      descricao:
        "Recoloque OBRIGATORIAMENTE o prepúcio sobre a glande. Conecte/mantenha o sistema fechado, fixe a sonda no abdome inferior ou face lateral da coxa sem tração e deixe a bolsa abaixo do nível da bexiga. Registre calibre, volume do balonete, volume e aspecto da diurese, tolerância e indicação.",
      atencao:
        "Prepúcio esquecido retraído = parafimose, urgência urológica. Em retenção crônica, drene de forma gradual e monitore hematúria ex-vacuo.",
    },
  ],
  checklist: [
    "Confirmei indicação clínica e ausência de sinais de trauma uretral",
    "Identifiquei o paciente, expliquei e garanti privacidade",
    "Realizei higiene íntima prévia e higienizei as mãos",
    "Calcei luvas estéreis e montei campo fenestrado",
    "Testei o balonete e lubrifiquei a sonda",
    "Retraí o prepúcio e fiz antissepsia circular do meato para a periferia",
    "Instilei lidocaína gel 2% e aguardei 2–5 minutos",
    "Posicionei o pênis a 90° e introduzi 18–22 cm até refluxo",
    "Avancei até a bifurcação em Y antes de insuflar",
    "Insuflei com ÁGUA DESTILADA no volume indicado",
    "RECOLOQUEI o prepúcio (prevenção de parafimose)",
    "Fixei sem tração, bolsa abaixo da bexiga e registrei tudo",
  ],
  referencias: [
    "COFEN. Resolução nº 450/2013 — Cateterismo urinário pelo enfermeiro.",
    "COFEN. Resolução nº 736/2024 — Processo de Enfermagem.",
    "ANVISA. Medidas de Prevenção de IRAS — Caderno 4 (ITU-AC).",
    "ANVISA. RDC nº 36/2013 — Segurança do paciente.",
    "CDC/HICPAC. Guideline for Prevention of CAUTI (atualizações vigentes).",
  ],
};
