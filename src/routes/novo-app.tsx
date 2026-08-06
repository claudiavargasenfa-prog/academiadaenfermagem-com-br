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
      { property: "og:title", content: "Escalas Clínicas na Prática — Academia da Enfermagem" },
      { property: "og:description", content: "8 escalas essenciais da enfermagem explicadas de forma didática: Braden, Morse, Glasgow, RASS, EVA/Faces, NEWS, PEWS e Fugulin." },
      { property: "og:url", content: "https://academiadaenfermagem.com.br/novo-app" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Escalas Clínicas na Prática — Academia da Enfermagem" },
      { name: "twitter:description", content: "8 escalas essenciais da enfermagem explicadas de forma didática: Braden, Morse, Glasgow, RASS, EVA/Faces, NEWS, PEWS e Fugulin." },
    ],
    links: [{ rel: "canonical", href: "https://academiadaenfermagem.com.br/novo-app" }],
  }),
  component: EscalasPage,
});