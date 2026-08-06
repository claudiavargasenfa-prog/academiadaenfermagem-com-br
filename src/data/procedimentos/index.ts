/**
 * Mini-app de Procedimentos Animados (dentro de Simulações Reais).
 * Cada procedimento é uma sequência de cenas ilustradas que rodam como uma animação 2D.
 */

export type OverlayPulse = {
  tipo: "pulse";
  /** posição relativa 0–1 (x: 0=esquerda, y: 0=topo) */
  x: number;
  y: number;
  cor?: "gold" | "danger" | "success";
};

export type Overlay = OverlayPulse;

export type Cena = {
  ordem: number;
  titulo: string;
  descricao: string;
  atencao?: string;
  /** URL ou import da imagem */
  imagem?: string;
  overlays?: Overlay[];
  /** Tempo de exibição em ms no autoplay (default 5000) */
  duracaoMs?: number;
};

export type Procedimento = {
  slug: string;
  titulo: string;
  subtitulo: string;
  icon: string; // emoji
  cor: string; // tailwind text color class
  publico: string; // ex.: "Adulto", "Pediatria/RN"
  materiais: string[];
  indicacoes: string[];
  contraindicacoes: string[];
  complicacoes: string[];
  cenas: Cena[];
  checklist: string[];
  referencias: string[];
  /** quando true, ainda não tem ilustrações geradas — mostra aviso */
  emProducao?: boolean;
};

import { PROC_SNG } from "./sng";
import { PROC_SVD_MASC } from "./svd-masc";
import { PROC_SVD_FEM } from "./svd-fem";
import { PROC_SVA } from "./sva";
import { PROC_PUNCAO_ADULTO } from "./puncao-adulto";
import { PROC_PUNCAO_ADULTO_V2 } from "./puncao-adulto-v2";
import { PROC_PUNCAO_PEDIATRIA } from "./puncao-pediatria";
import { PROC_PUNCAO_JUGULAR } from "./puncao-jugular-externa";
import { PROC_PUNCAO_SEGURANCA } from "./puncao-seguranca";
import { PROC_SVD_ESTERIL } from "./svd-esteril";
import { PROC_CURATIVO_DEISCENCIA } from "./curativo-deiscencia";

export const PROCEDIMENTOS: Procedimento[] = [
  PROC_SNG,
  PROC_SVD_MASC,
  PROC_SVD_FEM,
  PROC_SVD_ESTERIL,
  PROC_SVA,
  PROC_PUNCAO_ADULTO,
  PROC_PUNCAO_ADULTO_V2,
  PROC_PUNCAO_SEGURANCA,
  PROC_PUNCAO_PEDIATRIA,
  PROC_PUNCAO_JUGULAR,
  PROC_CURATIVO_DEISCENCIA,
];

export function getProcedimento(slug: string): Procedimento | undefined {
  return PROCEDIMENTOS.find((p) => p.slug === slug);
}
