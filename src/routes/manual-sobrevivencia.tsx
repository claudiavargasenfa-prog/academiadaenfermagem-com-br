import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/manual-sobrevivencia")({
  beforeLoad: () => {
    throw redirect({ to: "/manual-estagio", statusCode: 301 });
  },
});
