import { createFileRoute } from "@tanstack/react-router";
import { AppShell, Card, PageHeader } from "@/components/AppShell";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { GraduationCap, Shirt, ScrollText, Users, AlertOctagon } from "lucide-react";

export const Route = createFileRoute("/postura-etica")({
  head: () => ({
    meta: [
      { title: "Postura e Ética Profissional — Academia de Enfermagem" },
      {
        name: "description",
        content:
          "Manual de conduta no estágio: postura, biossegurança, ética COFEN e red flags clínicas.",
      },
    ],
  }),
  component: PosturaEticaPage,
});

const blocos = [
  {
    id: "postura",
    icon: Users,
    titulo: "Postura e Trabalho em Equipe",
    descricao:
      "O campo de estágio é sua vitrine profissional. A forma como você se comporta define as oportunidades que terá.",
    itens: [
      {
        n: "Assiduidade e Pontualidade",
        t: "Chegar com 15 minutos de antecedência não é apenas educação; é o tempo necessário para você trocar de roupa, organizar seus materiais e ouvir a passagem de plantão com calma.",
      },
      {
        n: "Comportamento e Respeito",
        t: "O hospital é um ambiente de cura e silêncio. Fale baixo, evite risadas excessivas em corredores e respeite a hierarquia e todos os profissionais (da limpeza à diretoria).",
      },
      {
        n: "Proatividade",
        t: "Seja sempre solícito. Se terminou sua tarefa, pergunte: \"Como posso ajudar?\". Mostre interesse real em aprender, mas nunca faça nada sem supervisão se for sua primeira vez.",
      },
    ],
  },
  {
    id: "biosseg",
    icon: Shirt,
    titulo: "Vestimenta e Biossegurança (NR-32)",
    descricao: "Regras inegociáveis para sua segurança e a do paciente.",
    itens: [
      {
        n: "Zero Adorno",
        t: "É proibido o uso de anéis, pulseiras, relógios, colares e brincos grandes. Eles são reservatórios de microrganismos.",
      },
      {
        n: "Vestimenta",
        t: "Jaleco sempre limpo e fechado. Sapato fechado e impermeável. Cabelos presos e unhas curtas.",
      },
    ],
  },
  {
    id: "etica",
    icon: ScrollText,
    titulo: "Ética Profissional (Resolução COFEN 564/17)",
    descricao: "Seus direitos, deveres e como se reportar.",
    itens: [
      {
        n: "O que PODE",
        t: "Ter acesso a informações do paciente para o cuidado, ser respeitado pela equipe e recusar-se a executar atividades que não sejam de sua competência técnica/legal.",
      },
      {
        n: "O que NÃO PODE",
        t: "Divulgar fotos de pacientes ou prontuários em redes sociais (infração grave), administrar medicamentos sem conferência e abandonar o paciente sem passar o plantão.",
      },
      {
        n: "Como se reportar",
        t: "Ao paciente, apresente-se sempre: \"Olá, sou o acadêmico [Nome], vou cuidar de você hoje\". À equipe, seja técnico e direto, usando a terminologia correta.",
      },
    ],
  },
];

const redFlags = [
  {
    titulo: "Alteração do Nível de Consciência",
    desc: "Paciente ficou confuso, sonolento demais ou não responde.",
  },
  {
    titulo: "Dificuldade Respiratória",
    desc: "Uso de musculatura acessória, SatO₂ < 92% em ar ambiente ou frequência respiratória muito alta.",
  },
  {
    titulo: "Dor Torácica Súbita",
    desc: "Especialmente se irradiar para braço ou mandíbula.",
  },
  {
    titulo: "Hipotensão Severa",
    desc: "PA sistólica abaixo de 90 mmHg com sinais de má perfusão (pele fria, pálida).",
  },
  {
    titulo: "Arritmias",
    desc: "Pulso muito irregular ou FC > 150 bpm em repouso.",
  },
];

function PosturaEticaPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Manual de Conduta"
        title="Postura, Ética e Comportamento Profissional"
        description="O manual de conduta para o sucesso no seu estágio."
      />

      <Card className="mb-6 border border-gold/40">
        <div className="flex items-start gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl gold-gradient">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold">Antes de qualquer técnica, vem a postura</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Domine este conteúdo e você se destaca em qualquer campo de estágio.
            </p>
          </div>
        </div>
      </Card>

      <Accordion type="single" collapsible defaultValue="postura" className="grid gap-3">
        {blocos.map((b) => {
          const Icon = b.icon;
          return (
            <AccordionItem
              key={b.id}
              value={b.id}
              className="glass overflow-hidden rounded-2xl border-0 px-4"
            >
              <AccordionTrigger className="hover:no-underline">
                <div className="flex min-w-0 items-center gap-3 text-left">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary text-gold">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-display text-sm font-bold text-foreground">{b.titulo}</p>
                    <p className="truncate text-xs text-muted-foreground">{b.descricao}</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="ml-1 grid gap-3 pb-2 text-sm text-foreground">
                  {b.itens.map((p) => (
                    <li key={p.n} className="rounded-xl border border-border/60 bg-card/60 p-3">
                      <p className="font-display text-sm font-bold text-primary">{p.n}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{p.t}</p>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      <section className="mt-6">
        <div className="rounded-3xl border-2 border-destructive/40 bg-destructive/10 p-5">
          <div className="flex items-start gap-3">
            <AlertOctagon className="mt-0.5 h-6 w-6 shrink-0 text-destructive" />
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-destructive">
                Red Flags
              </p>
              <h3 className="font-display text-lg font-extrabold leading-snug text-destructive">
                Quando chamar o Preceptor IMEDIATAMENTE?
              </h3>
              <p className="mt-1 text-sm text-foreground/85">
                Se você encontrar qualquer um destes sinais, <strong>pare o que está fazendo</strong> e
                chame ajuda.
              </p>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {redFlags.map((r) => (
                  <li
                    key={r.titulo}
                    className="rounded-xl border border-destructive/30 bg-background/70 p-3"
                  >
                    <p className="font-display text-sm font-bold text-destructive">{r.titulo}</p>
                    <p className="mt-1 text-xs text-foreground/85">{r.desc}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
