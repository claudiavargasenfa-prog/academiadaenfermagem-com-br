import { createFileRoute } from "@tanstack/react-router";
import { EscalasPage } from "./escalas-clinicas";

export const Route = createFileRoute("/novo-app")({
  head: () => ({
    meta: [
      { title: "Escalas Clínicas na Prática — Academia da Enfermagem" },
      {
        name: "description",
        content:
          "8 escalas essenciais da enfermagem explicadas de forma didática: Braden, Morse, Glasgow, RASS, EVA/Faces, NEWS, PEWS e Fugulin.",
      },
    ],
  }),
  component: EscalasPage,
});