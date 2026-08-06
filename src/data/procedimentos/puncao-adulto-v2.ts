import type { Procedimento } from "./index";
import { PROC_PUNCAO_ADULTO } from "./puncao-adulto";

export const PROC_PUNCAO_ADULTO_V2: Procedimento = {
  ...PROC_PUNCAO_ADULTO,
  slug: "puncao-venosa-adulto-v2",
  titulo: "Punção Venosa (Cópia de Segurança)",
  subtitulo: "Versão duplicada para garantir o funcionamento das imagens",
};
