import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import fotoFundadora from "@/assets/foto-fundadora.jpeg.asset.json";
import mascotesAsset from "@/assets/mascotes-iras.png.asset.json";
import { MessageCircle, ArrowLeft } from "lucide-react";
import { RichText, useText } from "@/lib/app-texts";

export const Route = createFileRoute("/minha-historia")({
  head: () => ({
    meta: [
      { title: "Minha História — Academia da Enfermagem" },
      {
        name: "description",
        content:
          "Conheça a história da fundadora da Academia da Enfermagem: 35 anos de dedicação à enfermagem, da beira do leito à tecnologia.",
      },
      { property: "og:title", content: "Minha História — Academia da Enfermagem" },
      {
        property: "og:description",
        content:
          "Da beira do leito para a tecnologia: a trajetória de quem dedicou 35 anos à arte de cuidar.",
      },
    ],
  }),
  component: MinhaHistoriaPage,
});

function MinhaHistoriaPage() {
  const t = {
    titulo: useText("historia.titulo", "Da Beira do Leito para a Tecnologia"),
    subtitulo: useText("historia.subtitulo", ""),
    frase: useText("historia.frase", ""),
    sec1Titulo: useText("historia.sec1.titulo", "Minha História"),
    sec1Texto: useText("historia.sec1.texto", ""),
    sec2Titulo: useText("historia.sec2.titulo", "Meu Propósito"),
    sec2Texto: useText("historia.sec2.texto", ""),
    sec3Titulo: useText("historia.sec3.titulo", "O que você encontrará aqui"),
    sec3Texto: useText("historia.sec3.texto", ""),
    sec4Titulo: useText("historia.sec4.titulo", "Minha Promessa"),
    sec4Texto: useText("historia.sec4.texto", ""),
    sec5Titulo: useText("historia.sec5.titulo", "Nosso Compromisso"),
    sec5Texto: useText("historia.sec5.texto", ""),
    sec6Titulo: useText("historia.sec6.titulo", "Encerramento"),
    sec6Texto: useText("historia.sec6.texto", ""),
    mascotes: useText("historia.mascotes.legenda", "Prevenção contra IRAS"),
    fotoAlt: useText("historia.foto.alt", "Foto da fundadora da Academia da Enfermagem"),
    zapLabel: useText("historia.whatsapp.label", "Entrar no grupo do WhatsApp"),
    zapUrl: useText("historia.whatsapp.url", "https://chat.whatsapp.com/HUv5XdngfQYGR3pxWuG3J3"),
    voltar: useText("historia.voltar.label", "Voltar"),
  };

  const secoes = [
    { titulo: t.sec1Titulo, texto: t.sec1Texto },
    { titulo: t.sec2Titulo, texto: t.sec2Texto },
    { titulo: t.sec3Titulo, texto: t.sec3Texto },
    { titulo: t.sec4Titulo, texto: t.sec4Texto },
    { titulo: t.sec5Titulo, texto: t.sec5Texto },
  ];


  return (
    <AppShell hideReferences publicRoute>
      {/* Voltar */}
      <div className="mb-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> {t.voltar}
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr] lg:items-start">
        {/* Coluna esquerda: foto + mascotes */}
        <aside className="flex flex-col items-center gap-5">
          {/* Foto circular com contorno */}
          <div className="relative">
            <div className="rounded-full border-4 border-primary/80 p-1 shadow-[var(--shadow-soft)]">
              <img
                src={fotoFundadora.url}
                alt={t.fotoAlt}
                className="h-56 w-56 rounded-full object-cover md:h-64 md:w-64"
              />
            </div>
          </div>

          {/* Mascotes acenando */}
          <div className="flex flex-col items-center">
            <img
              src={mascotesAsset.url}
              alt="Mascotes da Prevenção contra IRAS acenando"
              className="h-28 w-auto object-contain md:h-32 wave-animation"
            />
            <span className="mt-1 text-[10px] font-bold uppercase tracking-widest text-primary/70">
              {t.mascotes}
            </span>
          </div>
        </aside>

        {/* Coluna direita: texto */}
        <article className="min-w-0">
          <h1 className="font-display text-2xl font-extrabold leading-snug text-foreground md:text-3xl">
            <RichText>{t.titulo}</RichText>
          </h1>

          <div className="mt-6 space-y-6 text-foreground/90">
            {secoes.map((s, i) =>
              s.titulo || s.texto ? (
                <section key={i}>
                  {s.titulo && (
                    <h2 className="mb-2 font-display text-lg font-bold text-primary">
                      <RichText>{s.titulo}</RichText>
                    </h2>
                  )}
                  <p className="text-sm leading-relaxed md:text-base">
                    <RichText>{s.texto}</RichText>
                  </p>
                </section>
              ) : null,
            )}
          </div>

          {/* Botão WhatsApp */}
          {t.zapUrl && t.zapLabel && (
            <div className="mt-8 flex justify-start">
              <a
                href={t.zapUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-extrabold text-white shadow-md transition-colors hover:bg-emerald-700"
              >
                <MessageCircle className="h-5 w-5" />
                {t.zapLabel}
              </a>
            </div>
          )}
        </article>
      </div>
    </AppShell>
  );
}

