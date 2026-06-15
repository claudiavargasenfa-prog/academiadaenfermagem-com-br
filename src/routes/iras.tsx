import { createFileRoute } from "@tanstack/react-router";
import { AppShell, Card, PageHeader } from "@/components/AppShell";
import { HandHeart, ShieldAlert, Sparkles, Activity } from "lucide-react";
import mascoteMenino from "@/assets/mascote-menino-iras.png.asset.json";
import mascoteMenina from "@/assets/mascote-menina.png.asset.json";


export const Route = createFileRoute("/iras")({
  head: () => ({
    meta: [
      { title: "Time Contra as IRAS — Acadêmico de Bolsa" },
      {
        name: "description",
        content:
          "Prevenção das Infecções Relacionadas à Assistência à Saúde (IRAS) e os 5 Momentos da Higienização das Mãos (OMS).",
      },
    ],
  }),
  component: IRASPage,
});

const momentos = [
  {
    n: 1,
    titulo: "Antes do contato com o paciente",
    desc: "Higienize ao se aproximar do paciente — protege contra microrganismos das suas mãos.",
  },
  {
    n: 2,
    titulo: "Antes da realização de procedimento asséptico",
    desc: "Antes de qualquer manipulação invasiva ou estéril (curativo, punção, sondagem).",
  },
  {
    n: 3,
    titulo: "Após exposição a fluidos corporais",
    desc: "Sangue, secreções, mucosas ou pele não íntegra — proteja a si mesmo e ao próximo paciente.",
  },
  {
    n: 4,
    titulo: "Após contato com o paciente",
    desc: "Ao se afastar — evite carregar microrganismos para fora da zona do paciente.",
  },
  {
    n: 5,
    titulo: "Após contato com áreas próximas ao paciente",
    desc: "Mesmo sem tocar o paciente: grades, mesa, bomba de infusão, monitor.",
  },
];

function IRASPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Prevenção & Controle"
        title="Time Contra as IRAS"
        description="Prevenção é a nossa missão. Conheça as Infecções Relacionadas à Assistência à Saúde e os 5 Momentos da OMS."
      />

      {/* Mascot banner */}
      <section className="mb-6 overflow-hidden rounded-3xl border border-gold/40 bg-primary text-primary-foreground shadow-[var(--shadow-glass)]">
        <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2 px-4 pt-4 sm:px-6">
          <img
            src={mascoteMenino.url}
            alt="Mascote menino do Time Contra as IRAS"
            className="h-40 w-auto justify-self-end object-contain drop-shadow-[0_8px_18px_rgba(0,0,0,0.35)] sm:h-56"
          />
          <div className="pb-2 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-gold">
              Defensores
            </p>
            <p className="font-display text-lg font-extrabold leading-tight text-gold sm:text-2xl">
              TIME CONTRA<br />AS IRAS
            </p>
          </div>
          <img
            src={mascoteMenina.url}
            alt="Mascote menina do Time Contra as IRAS"
            className="h-40 w-auto justify-self-start object-contain drop-shadow-[0_8px_18px_rgba(0,0,0,0.35)] sm:h-56"
          />
        </div>
        <div className="border-t border-gold/30 bg-primary-glow/20 px-5 py-4 text-center">
          <p className="font-display text-base font-bold leading-snug text-primary-foreground sm:text-xl">
            "A higienização das mãos é o método mais{" "}
            <span className="text-gold">barato</span> e mais{" "}
            <span className="text-gold">eficaz</span> para a prevenção das IRAS."
          </p>
        </div>
      </section>

      {/* Tech block */}
      <section className="mb-6 grid gap-3 md:grid-cols-3">
        <Card>
          <div className="mb-2 flex items-center gap-2 text-gold">
            <ShieldAlert className="h-5 w-5" />
            <p className="text-xs font-semibold uppercase tracking-widest">O que são</p>
          </div>
          <h3 className="font-display text-base font-bold">IRAS</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Infecções hospitalares com altos índices de mortalidade adquiridas durante a assistência à saúde.
          </p>
        </Card>
        <Card>
          <div className="mb-2 flex items-center gap-2 text-gold">
            <Activity className="h-5 w-5" />
            <p className="text-xs font-semibold uppercase tracking-widest">Como se disseminam</p>
          </div>
          <h3 className="font-display text-base font-bold">Vias de transmissão</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Mãos sem higienização, contato com superfícies ou dispositivos invasivos contaminados.
          </p>
        </Card>
        <Card>
          <div className="mb-2 flex items-center gap-2 text-gold">
            <Sparkles className="h-5 w-5" />
            <p className="text-xs font-semibold uppercase tracking-widest">Como evitar</p>
          </div>
          <h3 className="font-display text-base font-bold">Barreira & assepsia</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Barreira física, técnica asséptica e adesão rigorosa aos protocolos de segurança.
          </p>
        </Card>
      </section>

      {/* 5 Momentos */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <HandHeart className="h-5 w-5 text-gold" />
          <h2 className="font-display text-xl font-bold">Os 5 Momentos das Mãos · OMS</h2>
        </div>
        <ol className="grid gap-3 sm:grid-cols-2">
          {momentos.map((m) => (
            <li
              key={m.n}
              className="glass flex gap-4 rounded-2xl p-4 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow)]"
            >
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl gold-gradient font-display text-xl font-extrabold">
                {m.n}
              </div>
              <div className="min-w-0">
                <p className="font-display text-sm font-bold text-foreground">{m.titulo}</p>
                <p className="mt-1 text-xs text-muted-foreground">{m.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </AppShell>
  );
}
