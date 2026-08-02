import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const BASE_URL = "https://academiadaenfermagem.com.br";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

const PLAN_SLUGS = ["academico", "tecnico", "tecnico-estudante", "enfermeiro"];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/adec", changefreq: "weekly", priority: "0.9" },
          { path: "/loja", changefreq: "weekly", priority: "0.8" },
          { path: "/confianca", changefreq: "monthly", priority: "0.6" },
          { path: "/legal", changefreq: "monthly", priority: "0.5" },
          { path: "/minha-historia", changefreq: "monthly", priority: "0.6" },
          { path: "/manual-sobrevivencia", changefreq: "monthly", priority: "0.7" },
          ...PLAN_SLUGS.map((slug) => ({
            path: `/planos/${slug}`,
            changefreq: "weekly" as const,
            priority: "0.8",
          })),
          ...PLAN_SLUGS.map((slug) => ({
            path: `/cadastro/${slug}`,
            changefreq: "monthly" as const,
            priority: "0.5",
          })),
        ];

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
