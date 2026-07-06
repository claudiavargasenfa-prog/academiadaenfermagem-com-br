import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/novo-app")({
  beforeLoad: () => {
    throw redirect({ to: "/escalas-clinicas", replace: true });
  },
});