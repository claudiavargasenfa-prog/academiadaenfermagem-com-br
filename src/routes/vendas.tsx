import { createFileRoute, redirect } from "@tanstack/react-router";

/** URL antiga /vendas — agora a landing page vive em /adec */
export const Route = createFileRoute("/vendas")({
  beforeLoad: () => {
    throw redirect({ to: "/adec" });
  },
});
