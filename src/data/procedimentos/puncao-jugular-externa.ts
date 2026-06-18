import type { Procedimento } from "./index";

export const PROC_PUNCAO_JUGULAR: Procedimento = {
  slug: "puncao-jugular-externa",
  titulo: "Punção de Jugular Externa — Adulto",
  subtitulo: "Acesso periférico em veia jugular externa",
  icon: "🫀",
  cor: "text-rose-600",
  publico: "Adulto",
  emProducao: true,
  materiais: [
    "Cateter periférico 18–20 G",
    "Antisséptico (clorexidina alcoólica 0,5%)",
    "Luvas de procedimento, gaze",
    "Polifix/extensor, conector valvulado, SF 0,9%",
    "Filme transparente estéril",
  ],
  indicacoes: [
    "Falha de acesso periférico em membros superiores",
    "Necessidade urgente de via venosa em pacientes com acesso periférico difícil",
  ],
  contraindicacoes: [
    "Trauma cervical, lesão local",
    "Hipertensão intracraniana (relativa — manobra pode aumentar PIC)",
    "Coagulopatia importante (relativa)",
  ],
  complicacoes: [
    "Hematoma cervical",
    "Punção arterial inadvertida (carótida)",
    "Embolia gasosa (raro)",
    "Deslocamento do cateter com movimentos cervicais",
  ],
  cenas: [],
  checklist: [
    "Posicionei o paciente em Trendelemburg leve, cabeça rodada para o lado oposto",
    "Pedi para o paciente realizar Valsalva ou comprimi a jugular acima da clavícula para ingurgitar a veia",
    "Antissepsia ampla da região cervical lateral",
    "Estabilizei a veia entre os dedos e puncionei com ângulo raso (15°), no sentido do mamilo ipsilateral",
    "Observei refluxo venoso (sangue escuro, sem pulsação)",
    "Progredi o cateter e conectei extensor com SF",
    "Fixei com filme transparente respeitando mobilidade cervical",
    "Registrei sítio, calibre, intercorrências e orientei o paciente",
  ],
  referencias: [
    "INS. Infusion Therapy Standards of Practice, 2021.",
    "ANVISA. Prevenção de infecções relacionadas a cateteres, 2017.",
  ],
};
