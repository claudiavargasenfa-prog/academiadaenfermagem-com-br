import { createFileRoute } from "@tanstack/react-router";
import { AppShell, Card, PageHeader } from "@/components/AppShell";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ShieldCheck, AlertTriangle, Heart } from "lucide-react";

export const Route = createFileRoute("/seguranca")({
  head: () => ({
    meta: [
      { title: "Segurança do Paciente — Acadêmico de Bolsa" },
      {
        name: "description",
        content:
          "As 6 Metas Internacionais de Segurança do Paciente (OMS/ANVISA) e cultura não punitiva.",
      },
    ],
  }),
  component: SegurancaPage,
});

const metas = [
  {
    id: "m1",
    n: "01",
    titulo: "Identificação Correta",
    resumo: "Garanta os três identificadores essenciais em todo cuidado.",
    pontos: [
      "Nome completo do paciente",
      "Data de nascimento",
      "Nome completo da mãe",
      "Conferir pulseira de identificação a cada procedimento",
    ],
  },
  {
    id: "m2",
    n: "02",
    titulo: "Comunicação Efetiva",
    resumo: "Transmissão segura de informações entre equipes e setores.",
    pontos: [
      "Passagem de plantão estruturada (SBAR/ISBAR)",
      "Confirmar ordens verbais com leitura de volta (read-back)",
      "Registros claros, legíveis e em tempo real",
    ],
  },
  {
    id: "m3",
    n: "03",
    titulo: "Segurança de Medicamentos",
    resumo: "Práticas seguras na prescrição, dispensação e administração.",
    pontos: [
      "9 Certos da administração de medicamentos",
      "Dupla checagem de medicamentos de alta vigilância",
      "Atenção a interações, alergias e diluições",
    ],
  },
  {
    id: "m4",
    n: "04",
    titulo: "Cirurgia Segura",
    resumo: "Checagem multiprofissional em todas as etapas.",
    pontos: [
      "Sign in · Time-out · Sign out (lista de verificação da OMS)",
      "Confirmação de paciente, procedimento e sítio cirúrgico correto",
      "Demarcação do lado da intervenção",
    ],
  },
  {
    id: "m5",
    n: "05",
    titulo: "Higiene das Mãos",
    resumo: "Reduz o risco de infecções associadas ao cuidado.",
    pontos: [
      "Adesão aos 5 Momentos da OMS",
      "Técnica correta com água/sabonete ou álcool 70%",
      "Tempo mínimo: 40–60s (água) · 20–30s (álcool gel)",
    ],
  },
  {
    id: "m6",
    n: "06",
    titulo: "Quedas e Lesões por Pressão (LPP)",
    resumo: "Avaliação e prevenção contínua desses riscos comuns no leito.",
    pontos: [
      "Aplicar escalas de Morse (quedas) e Braden (LPP) na admissão",
      "Mudança de decúbito a cada 2h · hidratação da pele",
      "Grades elevadas, campainha acessível, calçados antiderrapantes",
    ],
  },
];

function SegurancaPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="NSP · Núcleo de Segurança"
        title="Segurança do Paciente"
        description="O NSP atua diretamente na prevenção e controle de eventos adversos, incluindo as infecções relacionadas à assistência à saúde."
      />

      <section className="mb-6">
        <Card className="border border-gold/40">
          <div className="flex items-start gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl gold-gradient">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold">As 6 Metas Internacionais</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Toque em cada meta para ver as recomendações essenciais para a prática segura.
              </p>
            </div>
          </div>
        </Card>
      </section>

      <Accordion type="single" collapsible defaultValue="m1" className="grid gap-3">
        {metas.map((m) => (
          <AccordionItem
            key={m.id}
            value={m.id}
            className="glass overflow-hidden rounded-2xl border-0 px-4"
          >
            <AccordionTrigger className="hover:no-underline">
              <div className="flex min-w-0 items-center gap-3 text-left">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary font-display text-base font-extrabold text-gold">
                  {m.n}
                </div>
                <div className="min-w-0">
                  <p className="font-display text-sm font-bold text-foreground">
                    META {m.n} · {m.titulo}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">{m.resumo}</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="ml-1 grid gap-2 pb-2 text-sm text-foreground">
                {m.pontos.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <section className="mt-6">
        <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
            <div>
              <p className="font-display text-sm font-bold text-destructive">Eventos Adversos</p>
              <p className="mt-1 text-sm text-foreground/85">
                São complicações indesejadas que afetam o paciente durante a sua passagem pela unidade de saúde.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-4">
        <div className="rounded-3xl border border-gold/40 bg-primary p-5 text-primary-foreground shadow-[var(--shadow-glass)]">
          <div className="flex items-start gap-3">
            <Heart className="mt-0.5 h-6 w-6 shrink-0 text-gold" />
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-gold">
                Mensagem central
              </p>
              <p className="mt-1 font-display text-lg font-extrabold leading-snug">
                Cultura Não Punitiva
              </p>
              <p className="mt-2 text-sm text-primary-foreground/85">
                Foco em identificar falhas sistêmicas (o <em>"como"</em> aconteceu) para melhorar
                os processos, em vez de punir o profissional. A{" "}
                <span className="text-gold font-semibold">Segurança do Paciente</span> é responsabilidade de todos!
              </p>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
