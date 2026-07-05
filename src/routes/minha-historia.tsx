import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import fotoFundadora from "@/assets/foto-fundadora.jpeg.asset.json";
import mascotesAsset from "@/assets/mascotes-iras.png.asset.json";
import { MessageCircle, ArrowLeft } from "lucide-react";

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
  return (
    <AppShell hideReferences publicRoute>
      {/* Voltar */}
      <div className="mb-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar
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
                alt="Foto da fundadora da Academia da Enfermagem"
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
              Prevenção contra IRAS
            </span>
          </div>
        </aside>

        {/* Coluna direita: texto */}
        <article className="min-w-0">
          <h1 className="font-display text-2xl font-extrabold leading-snug text-foreground md:text-3xl">
            Da Beira do Leito para a Tecnologia: Conheça um pouco da minha
            História.
          </h1>

          <div className="mt-6 space-y-6 text-foreground/90">
            <section>
              <h2 className="mb-2 font-display text-lg font-bold text-primary">
                A História
              </h2>
              <p className="text-sm leading-relaxed md:text-base">
                A Academia da Enfermagem não nasceu em um escritório de
                tecnologia de computadores. Ela nasceu nos corredores de
                hospitais, nas noites em claro de plantão e na vivência real de
                quem dedicou 35 anos da vida à arte de cuidar. Sou auxiliar de
                enfermagem e enfermeira e, assim como você, passei décadas
                sentindo a dor de usar horas preciosas do plantão preenchendo as
                burocracias necessárias em papéis e tentando decifrar manuais
                complexos, em vez de focar no que realmente importa: o nosso
                paciente.
              </p>
            </section>

            <section>
              <h2 className="mb-2 font-display text-lg font-bold text-primary">
                O Propósito
              </h2>
              <p className="text-sm leading-relaxed md:text-base">
                Após me aposentar, a apenas 4 anos, decidi que a minha missão
                ainda não estava cumprida. Eu precisava usar toda a minha
                bagagem prática para criar a ferramenta que eu sempre sonhei em
                ter na beira do leito. Um ecossistema simples, ágil e seguro,
                feito de enfermeira para a enfermagem, de enfermeira para
                estudante, a final, também passei por esse caminho.
              </p>
            </section>

            <section>
              <h2 className="mb-2 font-display text-lg font-bold text-primary">
                Minha Promessa
              </h2>
              <p className="text-sm leading-relaxed md:text-base">
                A Academia da Enfermagem é o resultado de uma vida inteira de
                dedicação. Ela foi feita para mitigar o seu tempo, descomplicar
                o seu estágio, garantir a precisão dos seus cálculos e te levar
                uma certa segurança jurídica, desde que bem empregada, tudo
                baseado rigorosamente nas leis do nosso COFEN. Seja muito
                bem-vindo à evolução da nossa categoria. Aqui, nós cuidamos de
                quem cuida!
              </p>
            </section>
          </div>

          {/* Botão WhatsApp */}
          <div className="mt-8 flex justify-start">
            <a
              href="https://chat.whatsapp.com/HUv5XdngfQYGR3pxWuG3J3"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-extrabold text-white shadow-md transition-colors hover:bg-emerald-700"
            >
              <MessageCircle className="h-5 w-5" />
              Entrar no grupo do WhatsApp
            </a>
          </div>
        </article>
      </div>

      <style>{`
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          20% { transform: rotate(-6deg); }
          40% { transform: rotate(6deg); }
          60% { transform: rotate(-4deg); }
          80% { transform: rotate(4deg); }
        }
      `}</style>
    </AppShell>
  );
}
