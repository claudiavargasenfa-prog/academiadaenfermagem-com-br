import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell, Card, PageHeader } from "@/components/AppShell";
import { MiniAppContent } from "@/components/MiniAppContent";
import { supabase } from "@/integrations/supabase/client";
import { useLocal } from "@/lib/storage";
import { FileText, Lock, AlertTriangle, Printer, ShoppingCart, Loader2 } from "lucide-react";

export const Route = createFileRoute("/relatorio-abnt")({
  head: () => ({
    meta: [
      { title: "Relatório de Estágio (ABNT) — Academia da Enfermagem" },
      {
        name: "description",
        content:
          "Gere automaticamente o seu relatório de estágio em norma ABNT a partir do seu Diário de Bordo.",
      },
    ],
  }),
  component: RelatorioPage,
});

type Entry = { id: string; data: string; texto: string };
type EstagioInfo = { campo: string; preceptor: string; periodo: string };

type RelatorioApp = {
  id: string;
  name: string;
  description: string | null;
  price_cents: number;
  cakto_checkout_url: string | null;
};

type RelatorioUse = {
  id: string;
  opens_left: number;
  total_opens: number;
  generated_at: string | null;
};

function abntHtml(info: EstagioInfo, entries: Entry[], aluno: string) {
  const dataExt = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
  const sortedEntries = [...entries].sort((a, b) => a.data.localeCompare(b.data));
  const desenvolvimento = sortedEntries
    .map(
      (e) => `<h3>${new Date(e.data).toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}</h3>
<p>${e.texto.replace(/</g, "&lt;").replace(/\n/g, "<br>")}</p>`,
    )
    .join("");

  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<title>Relatório de Estágio — ABNT</title>
<style>
  @page { size: A4; margin: 3cm 2cm 2cm 3cm; }
  body { font-family: "Times New Roman", Times, serif; font-size: 12pt; line-height: 1.5; color: #000; text-align: justify; }
  .capa { text-align: center; min-height: 27cm; display: flex; flex-direction: column; justify-content: space-between; page-break-after: always; }
  .capa h1 { font-size: 14pt; text-transform: uppercase; font-weight: bold; }
  .capa .meio { margin-top: 6cm; }
  .capa .meio h2 { font-size: 14pt; text-transform: uppercase; font-weight: bold; }
  .capa .meio p { font-size: 12pt; margin-top: 1cm; }
  .capa .rodape { font-size: 12pt; }
  h2.secao { font-size: 12pt; text-transform: uppercase; font-weight: bold; margin-top: 1.5cm; text-align: left; }
  h3 { font-size: 12pt; font-weight: bold; margin-top: 0.8cm; text-align: left; text-transform: none; }
  p { text-indent: 1.25cm; margin: 0.2cm 0; }
  .ref p { text-indent: 0; padding-left: 0; margin-bottom: 0.5cm; }
</style></head><body>

<section class="capa">
  <div>
    <h1>UNIVERSIDADE / INSTITUIÇÃO DE ENSINO</h1>
    <p>CURSO DE ENFERMAGEM</p>
  </div>
  <div class="meio">
    <p style="text-transform:uppercase;">${aluno || "[NOME DO ACADÊMICO]"}</p>
    <h2>Relatório de Estágio Supervisionado em Enfermagem</h2>
    <p>${info.campo || "[CAMPO DE ESTÁGIO]"}</p>
  </div>
  <div class="rodape">
    <p>${dataExt.toUpperCase()}</p>
  </div>
</section>

<h2 class="secao">1 Introdução</h2>
<p>O presente relatório descreve as atividades desenvolvidas durante o Estágio Supervisionado em
Enfermagem, realizado no campo <strong>${info.campo || "[CAMPO]"}</strong>, sob a orientação
do(a) preceptor(a) <strong>${info.preceptor || "[PRECEPTOR(A)]"}</strong>, durante o período
de <strong>${info.periodo || "[PERÍODO]"}</strong>. O estágio configura-se como momento essencial
da formação acadêmica, permitindo a articulação entre teoria e prática, o desenvolvimento de
competências técnicas, científicas e humanísticas inerentes ao cuidado de enfermagem.</p>

<h2 class="secao">2 Objetivos</h2>
<p><strong>Geral:</strong> Vivenciar a prática profissional do enfermeiro no campo de atuação, consolidando
os conhecimentos teóricos adquiridos ao longo da graduação.</p>
<p><strong>Específicos:</strong> Aplicar o Processo de Enfermagem; participar ativamente da equipe
multiprofissional; aprimorar habilidades técnicas e de comunicação; e refletir criticamente sobre a
prática assistencial.</p>

<h2 class="secao">3 Desenvolvimento — Atividades Realizadas</h2>
${desenvolvimento || "<p>Nenhum registro encontrado no Diário de Bordo.</p>"}

<h2 class="secao">4 Considerações Finais</h2>
<p>A vivência no estágio supervisionado proporcionou crescimento pessoal e profissional, reforçando a
importância do raciocínio clínico, da segurança do paciente e do trabalho em equipe. As experiências
relatadas evidenciam o desenvolvimento progressivo das competências essenciais ao exercício da
enfermagem, em consonância com os princípios éticos e legais da profissão (COFEN).</p>

<h2 class="secao">Referências</h2>
<div class="ref">
  <p>CONSELHO FEDERAL DE ENFERMAGEM. <strong>Resolução COFEN nº 564/2017</strong>: aprova o novo
  Código de Ética dos Profissionais de Enfermagem. Brasília: COFEN, 2017.</p>
  <p>MINISTÉRIO DA SAÚDE. <strong>Protocolo de Segurança do Paciente</strong>. Brasília: ANVISA, 2013.</p>
  <p>ORGANIZAÇÃO MUNDIAL DA SAÚDE. <strong>Guia para a Higiene das Mãos em Serviços de Saúde</strong>.
  Genebra: OMS, 2009.</p>
</div>

<script>window.onload=()=>window.print();</script>
</body></html>`;
}

function RelatorioPage() {
  const [entries] = useLocal<Entry[]>("diario-entries", []);
  const [info] = useLocal<EstagioInfo>("estagio-info", { campo: "", preceptor: "", periodo: "" });
  const [app, setApp] = useState<RelatorioApp | null>(null);
  const [use, setUse] = useState<RelatorioUse | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [profileName, setProfileName] = useState<string>("");

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (u.user) {
        const { data: p } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", u.user.id)
          .maybeSingle();
        setProfileName(p?.full_name ?? "");
      }

      const { data: apps } = await supabase
        .from("mini_apps")
        .select("id, name, description, price_cents, cakto_checkout_url")
        .eq("kind", "relatorio")
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .limit(1);
      const a = apps?.[0] ?? null;
      setApp(a);

      if (a) {
        const { data: r } = await supabase
          .from("relatorio_uses")
          .select("id, opens_left, total_opens, generated_at")
          .eq("mini_app_id", a.id)
          .maybeSingle();
        setUse(r as RelatorioUse | null);
      }
      setLoading(false);
    })();
  }, []);

  const handleGenerate = async () => {
    if (!app || !use || use.opens_left <= 0) return;
    setGenerating(true);
    const { data, error } = await supabase.rpc("consume_relatorio_open", {
      _mini_app_id: app.id,
    });
    setGenerating(false);
    if (error || typeof data !== "number" || data < 0) {
      alert("Não foi possível abrir o relatório. Verifique seu acesso.");
      return;
    }
    setUse({ ...use, opens_left: data, generated_at: use.generated_at ?? new Date().toISOString() });

    const html = abntHtml(info, entries, profileName);
    const w = window.open("", "_blank");
    if (!w) {
      alert("Permita pop-ups para abrir o relatório.");
      return;
    }
    w.document.write(html);
    w.document.close();
  };

  if (loading) {
    return (
      <AppShell>
        <PageHeader title="Relatório de Estágio (ABNT)" />
        <Card><p className="text-sm text-muted-foreground">Carregando…</p></Card>
      </AppShell>
    );
  }

  if (!app) {
    return (
      <AppShell>
        <PageHeader
          eyebrow="Mini app pago"
          title="Relatório de Estágio (ABNT)"
          description="Este recurso ainda não foi cadastrado pela administração."
        />
        <Card>
          <p className="text-sm text-muted-foreground">
            Em breve. Volte aqui assim que o produto for publicado na loja.
          </p>
        </Card>
      </AppShell>
    );
  }

  const hasAccess = use !== null;
  const opensLeft = use?.opens_left ?? 0;
  const totalOpens = use?.total_opens ?? 5;

  return (
    <AppShell>
      <PageHeader
        eyebrow="Mini app pago · ABNT"
        title="Relatório de Estágio em ABNT"
        description="Gera automaticamente o relatório com os dados do seu Diário de Bordo, na estrutura ABNT, pronto para imprimir."
      />
      <MiniAppContent slug="relatorio-abnt" />

      {/* Termos */}
      <Card className="mb-5 border-2 border-gold/40">
        <div className="flex items-start gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl gold-gradient">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold">Como funciona o acesso</h2>
            <ul className="mt-2 grid gap-1.5 text-sm text-foreground/85">
              <li>• <strong>Uso único:</strong> cada compra dá direito a gerar <strong>1 relatório</strong>.</li>
              <li>• Após gerar, você poderá <strong>abrir, corrigir e imprimir mais 4 vezes</strong> (total: 5 aberturas).</li>
              <li>• O acesso é <strong>vinculado ao seu cadastro</strong> — não é transferível para outro aluno.</li>
              <li>• O conteúdo é puxado <strong>automaticamente do seu Diário de Bordo</strong> (identificação + registros).</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Bloqueado — checkout */}
      {!hasAccess && (
        <Card className="mb-5">
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <Lock className="mt-1 h-6 w-6 text-muted-foreground" />
              <div>
                <h3 className="font-display text-lg font-bold">{app.name}</h3>
                <p className="text-sm text-muted-foreground">{app.description}</p>
                <p className="mt-2 font-display text-2xl font-extrabold text-primary">
                  {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(app.price_cents / 100)}
                </p>
              </div>
            </div>
            {app.cakto_checkout_url ? (
              <a
                href={app.cakto_checkout_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground hover:opacity-90"
              >
                <ShoppingCart className="h-4 w-4" /> Comprar agora
              </a>
            ) : (
              <span className="text-xs text-muted-foreground">Link de checkout em breve.</span>
            )}
          </div>
        </Card>
      )}

      {/* Liberado */}
      {hasAccess && (
        <Card className="mb-5 border-2 border-[hsl(160_84%_30%)]">
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <FileText className="mt-1 h-6 w-6 text-[hsl(160_84%_25%)]" />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-[hsl(160_84%_25%)]">
                  Acesso liberado
                </p>
                <h3 className="font-display text-lg font-bold">{app.name}</h3>
                <p className="mt-1 text-sm text-foreground/85">
                  <strong>{opensLeft}</strong> de {totalOpens} aberturas restantes.
                </p>
                {entries.length === 0 && (
                  <p className="mt-1 text-xs text-destructive">
                    Atenção: você ainda não tem registros no Diário de Bordo. <Link to="/diario" className="underline">Adicione antes de gerar.</Link>
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={handleGenerate}
              disabled={generating || opensLeft <= 0}
              className="inline-flex items-center gap-2 rounded-xl bg-[hsl(160_84%_25%)] px-4 py-3 text-sm font-bold text-white hover:opacity-90 disabled:opacity-40"
            >
              {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Printer className="h-4 w-4" />}
              {opensLeft <= 0 ? "Sem aberturas" : use?.generated_at ? "Abrir / Corrigir" : "Gerar relatório"}
            </button>
          </div>
        </Card>
      )}

      <Card>
        <h3 className="font-display text-base font-bold">Dados que serão usados</h3>
        <div className="mt-3 grid gap-2 text-sm">
          <p><strong>Aluno:</strong> {profileName || <span className="text-muted-foreground">— (atualize em Minha Conta)</span>}</p>
          <p><strong>Campo:</strong> {info.campo || <span className="text-muted-foreground">— (defina no Diário)</span>}</p>
          <p><strong>Preceptor(a):</strong> {info.preceptor || <span className="text-muted-foreground">—</span>}</p>
          <p><strong>Período:</strong> {info.periodo || <span className="text-muted-foreground">—</span>}</p>
          <p><strong>Registros no diário:</strong> {entries.length}</p>
        </div>
        <Link to="/diario" className="mt-3 inline-block text-sm font-semibold text-primary hover:underline">
          Editar Diário de Bordo →
        </Link>
      </Card>
    </AppShell>
  );
}
