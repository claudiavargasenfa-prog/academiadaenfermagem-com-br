import { createFileRoute } from "@tanstack/react-router";
import { AppShell, Card, PageHeader } from "@/components/AppShell";
import { MiniAppContent } from "@/components/MiniAppContent";
import { CheckCircle2, BookOpen, MessageCircle, Backpack } from "lucide-react";

export const Route = createFileRoute("/manual-sobrevivencia")({
  head: () => ({
    meta: [
      { title: "Manual de Sobrevivência do Estágio — Academia de Enfermagem" },
      {
        name: "description",
        content:
          "Conteúdo gratuito: primeiros passos no estágio, checklist da mochila, postura no campo e comunicação com preceptor.",
      },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Grátis"
        title="Manual de Sobrevivência do Estágio"
        description="Tudo que você precisa saber no seu primeiro dia de campo — sem pagar nada."
      />
      <MiniAppContent slug="manual-sobrevivencia" />

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <div className="mb-3 flex items-center gap-2 text-gold">
            <Backpack className="h-5 w-5" />
            <h2 className="font-display text-lg font-bold text-foreground">Mochila do estagiário</h2>
          </div>
          <ul className="space-y-2 text-sm">
            {[
              "Jaleco branco passado + crachá institucional",
              "2 canetas pretas, 1 lápis e marca-texto",
              "Caderninho de bolso para anotações",
              "Estetoscópio (se solicitado pela instituição)",
              "Relógio com ponteiro de segundos",
              "Garrafinha de água e lanche leve",
              "Álcool 70% de bolso e máscara reserva",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <div className="mb-3 flex items-center gap-2 text-gold">
            <MessageCircle className="h-5 w-5" />
            <h2 className="font-display text-lg font-bold text-foreground">Como falar com o preceptor</h2>
          </div>
          <ul className="space-y-2 text-sm">
            <li><strong>Antes:</strong> apresente-se, diga período/disciplina e ofereça ajuda.</li>
            <li><strong>Durante:</strong> pergunte antes de fazer; observe antes de tocar.</li>
            <li><strong>Erro?</strong> Comunique imediatamente — segurança do paciente vem primeiro.</li>
            <li><strong>Dúvida técnica:</strong> anote e pergunte no momento certo, não no meio do procedimento.</li>
            <li><strong>Saída:</strong> sempre agradeça e confirme tarefas pendentes.</li>
          </ul>
        </Card>

        <Card className="md:col-span-2">
          <div className="mb-3 flex items-center gap-2 text-gold">
            <BookOpen className="h-5 w-5" />
            <h2 className="font-display text-lg font-bold text-foreground">Postura no campo (resumo)</h2>
          </div>
          <ol className="list-decimal space-y-2 pl-5 text-sm">
            <li>Cumprimente a equipe ao chegar e ao sair do setor.</li>
            <li>Higienize as mãos nos 5 momentos da OMS — sempre.</li>
            <li>Identifique o paciente antes de qualquer procedimento (2 identificadores).</li>
            <li>Mantenha sigilo: nada de fotos, áudios ou comentários em rede social.</li>
            <li>Use EPI adequado e descarte material perfurocortante na caixa rígida.</li>
            <li>Registre o que fez (e o que não fez) — checklist é cuidado.</li>
          </ol>
          <p className="mt-4 rounded-xl bg-primary/10 px-4 py-2 text-xs text-muted-foreground">
            Quer aprofundar? O mini app <strong>Postura e Ética Profissional</strong> traz casos clínicos,
            COFEN comentado e roteiro de comunicação terapêutica.
          </p>
        </Card>
      </div>
    </AppShell>
  );
}
