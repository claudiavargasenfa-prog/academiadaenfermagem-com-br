import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/Escala_2026")({
  beforeLoad: () => {
    throw redirect({
      to: "/app/$slug",
      params: { slug: "Escala_2026" },
    });
  },
  component: () => null,
});
