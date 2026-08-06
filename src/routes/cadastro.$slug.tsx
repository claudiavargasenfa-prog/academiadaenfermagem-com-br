import { createFileRoute, notFound } from "@tanstack/react-router";

import { WelcomeAuthScreen } from "@/components/AuthGate";


const ALLOWED = new Set(["academico", "tecnico", "tecnico-estudante", "enfermeiro"]);

const LABELS: Record<string, string> = {
  academico: "Acadêmico",
  tecnico: "Técnico em Enfermagem",
  "tecnico-estudante": "Estudante de Técnico em Enfermagem",
  enfermeiro: "Enfermeiro",
};

export const Route = createFileRoute("/cadastro/$slug")({
  beforeLoad: ({ params }) => {
    if (!ALLOWED.has(params.slug)) throw notFound();
  },
  head: ({ params }) => {
    const label = LABELS[params.slug] ?? "Academia da Enfermagem";
    const desc = `Crie seu cadastro para iniciar 15 dias grátis no app ${label}, sem cartão.`;
    return {
      meta: [
        { title: `Cadastro ${label} — Academia da Enfermagem` },
        { name: "description", content: desc },
        { property: "og:title", content: `Cadastro ${label} — Academia da Enfermagem` },
        { property: "og:description", content: desc },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
        { property: "og:url", content: `https://academiadaenfermagem.com.br/cadastro/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `https://academiadaenfermagem.com.br/cadastro/${params.slug}` }],
    };
  },
  component: CadastroPage,
});

function CadastroPage() {
  const { slug } = Route.useParams();
  return <WelcomeAuthScreen slug={slug} />;
}