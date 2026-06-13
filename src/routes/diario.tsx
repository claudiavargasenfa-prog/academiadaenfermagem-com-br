import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, Card, PageHeader } from "@/components/AppShell";
import { useLocal } from "@/lib/storage";
import { Download, Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/diario")({
  head: () => ({
    meta: [
      { title: "Diário de Bordo — Enfermagem em Foco" },
      { name: "description", content: "Anotações diárias do estágio com exportação em PDF formatado em ABNT." },
    ],
  }),
  component: Diario,
});

type Entry = { id: string; data: string; texto: string };

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function exportPdf(entries: Entry[], info: { campo: string; preceptor: string; periodo: string }) {
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Diário de Bordo</title>
<style>
  @page { size: A4; margin: 3cm 2cm 2cm 3cm; }
  body { font-family: "Times New Roman", Times, serif; font-size: 12pt; line-height: 1.5; color: #111; }
  h1 { text-align: center; font-size: 14pt; text-transform: uppercase; margin-bottom: 1.5cm; }
  h2 { font-size: 12pt; text-transform: uppercase; margin-top: 1cm; }
  .meta { margin-bottom: 1cm; }
  .meta p { margin: 0.2cm 0; }
  .entry { margin-bottom: 0.8cm; text-align: justify; text-indent: 1.25cm; }
  .data { font-weight: bold; text-indent: 0; }
</style></head><body>
<h1>Diário de Bordo — Estágio de Enfermagem</h1>
<div class="meta">
  <p><strong>Campo:</strong> ${info.campo || "—"}</p>
  <p><strong>Preceptor(a):</strong> ${info.preceptor || "—"}</p>
  <p><strong>Período:</strong> ${info.periodo || "—"}</p>
</div>
<h2>Registros</h2>
${entries
  .map(
    (e) => `<div class="entry"><p class="data">${new Date(e.data).toLocaleDateString("pt-BR")}</p>
<p>${e.texto.replace(/\n/g, "<br>")}</p></div>`
  )
  .join("")}
<script>window.onload=()=>window.print();</script>
</body></html>`;
  const w = window.open("", "_blank");
  if (!w) return;
  w.document.write(html);
  w.document.close();
}

function Diario() {
  const [entries, setEntries] = useLocal<Entry[]>("diario-entries", []);
  const [info] = useLocal("estagio-info", { campo: "", preceptor: "", periodo: "" });
  const [data, setData] = useState(todayISO());
  const [texto, setTexto] = useState("");

  const add = () => {
    if (!texto.trim()) return;
    setEntries([{ id: crypto.randomUUID(), data, texto: texto.trim() }, ...entries]);
    setTexto("");
    setData(todayISO());
  };

  const remove = (id: string) => setEntries(entries.filter((e) => e.id !== id));

  return (
    <AppShell>
      <PageHeader
        eyebrow="Registros diários"
        title="Diário de bordo"
        description="Documente cada plantão. Tudo permanece no seu aparelho e pode ser exportado em PDF ABNT."
      />

      <Card className="mb-5">
        <h3 className="font-display text-lg font-bold">Nova anotação</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-[200px_1fr]">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Data
            </span>
            <input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="w-full rounded-xl border border-border/70 bg-card/70 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Relato
            </span>
            <textarea
              rows={5}
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Descreva o caso, intervenções, reflexões e aprendizados do dia."
              className="w-full resize-y rounded-xl border border-border/70 bg-card/70 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={add}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Salvar registro
          </button>
          <button
            onClick={() => exportPdf(entries, info)}
            disabled={entries.length === 0}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/80 px-4 py-2 text-sm font-semibold text-foreground hover:bg-secondary disabled:opacity-40"
          >
            <Download className="h-4 w-4" />
            Exportar PDF (ABNT)
          </button>
        </div>
      </Card>

      <div className="space-y-3">
        {entries.length === 0 && (
          <Card>
            <p className="text-sm text-muted-foreground">
              Nenhum registro ainda. Comece descrevendo o seu próximo plantão.
            </p>
          </Card>
        )}
        {entries.map((e) => (
          <Card key={e.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                  {new Date(e.data).toLocaleDateString("pt-BR", {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                  {e.texto}
                </p>
              </div>
              <button
                onClick={() => remove(e.id)}
                aria-label="Excluir registro"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
