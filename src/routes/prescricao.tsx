import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, Card, PageHeader } from "@/components/AppShell";
import { Printer, FileText } from "lucide-react";

export const Route = createFileRoute("/prescricao")({
  head: () => ({
    meta: [
      { title: "Prescrição — Academia da Enfermagem" },
      {
        name: "description",
        content:
          "Monte e imprima/salve em PDF a prescrição de enfermagem direto do seu navegador.",
      },
    ],
  }),
  component: PrescricaoPage,
});

function prescricaoHtml(conteudo: string, titulo: string) {
  const safe = conteudo.replace(/</g, "&lt;").replace(/\n/g, "<br>");
  const dataExt = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<title>${titulo || "Prescrição"}</title>
<style>
  @page { size: A4; margin: 2.5cm 2cm; }
  body { font-family: "Times New Roman", Times, serif; font-size: 12pt; line-height: 1.5; color: #000; }
  h1 { font-size: 14pt; text-transform: uppercase; text-align: center; margin-bottom: 0.5cm; }
  .data { text-align: right; font-size: 11pt; margin-bottom: 1cm; }
  .conteudo { text-align: justify; white-space: pre-wrap; }
</style></head><body>
<h1>${titulo || "Prescrição"}</h1>
<div class="data">${dataExt}</div>
<div class="conteudo">${safe || "<em>Sem conteúdo.</em>"}</div>
<script>window.onload=()=>window.print();</script>
</body></html>`;
}

function PrescricaoPage() {
  const [titulo, setTitulo] = useState("Prescrição de Enfermagem");
  const [conteudo, setConteudo] = useState("");

  const handlePrint = () => {
    const html = prescricaoHtml(conteudo, titulo);
    const w = window.open("", "_blank");
    if (!w) {
      alert("Permita pop-ups para abrir a prescrição.");
      return;
    }
    w.document.write(html);
    w.document.close();
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Documento"
        title="Prescrição"
        description="Cole ou monte o conteúdo da prescrição abaixo e clique em Imprimir / Salvar PDF."
      />

      <Card className="mb-5">
        <div className="grid gap-3">
          <label className="text-sm font-semibold">
            Título
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
              placeholder="Ex.: Prescrição de Enfermagem"
            />
          </label>

          <label className="text-sm font-semibold">
            Conteúdo
            <textarea
              value={conteudo}
              onChange={(e) => setConteudo(e.target.value)}
              rows={18}
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 font-mono text-sm"
              placeholder="Cole aqui o material da prescrição…"
            />
          </label>

          <button
            onClick={handlePrint}
            disabled={!conteudo.trim()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground hover:opacity-90 disabled:opacity-40"
          >
            <Printer className="h-4 w-4" /> Imprimir / Salvar PDF
          </button>
        </div>
      </Card>

      <Card>
        <div className="flex items-start gap-3">
          <FileText className="mt-1 h-5 w-5 text-muted-foreground" />
          <div className="text-sm text-foreground/85">
            <p>
              O PDF é gerado pelo próprio navegador (sem custo de envio por email).
              Funciona em celular e PC: na janela de impressão, escolha{" "}
              <strong>Salvar como PDF</strong> para baixar.
            </p>
          </div>
        </div>
      </Card>
    </AppShell>
  );
}
