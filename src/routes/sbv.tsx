import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, Card, PageHeader } from "@/components/AppShell";
import { AppAccessGate } from "@/components/ContentProtection";
import { MiniAppContent } from "@/components/MiniAppContent";
import { HeartPulse, Zap, Baby, ShieldAlert, CheckCircle2, XCircle } from "lucide-react";

export const Route = createFileRoute("/sbv")({
  head: () => ({
    meta: [
      { title: "Suporte Básico de Vida (SBV) — Academia de Enfermagem" },
      {
        name: "description",
        content:
          "Suporte Básico de Vida: cadeia de sobrevivência, RCP de alta qualidade, uso do DEA e OVACE — adulto, pediátrico e lactente, conforme AHA 2020/2025.",
      },
    ],
  }),
  component: () => (
    <AppAccessGate slug="sbv">
        <MiniAppContent slug="sbv" />
      <SBVPage />
    </AppAccessGate>
  ),
});

type Aba = "cadeia" | "adulto" | "pediatrico" | "lactente" | "dea" | "ovace" | "erros";

const ABAS: { id: Aba; label: string; emoji: string }[] = [
  { id: "cadeia", label: "Cadeia", emoji: "🔗" },
  { id: "adulto", label: "RCP Adulto", emoji: "🧑" },
  { id: "pediatrico", label: "RCP Pediátrico", emoji: "🧒" },
  { id: "lactente", label: "RCP Lactente", emoji: "👶" },
  { id: "dea", label: "DEA", emoji: "⚡" },
  { id: "ovace", label: "OVACE", emoji: "🫁" },
  { id: "erros", label: "Erros Fatais", emoji: "⚠️" },
];

function SBVPage() {
  const [aba, setAba] = useState<Aba>("cadeia");

  return (
    <AppShell>
      <PageHeader
        eyebrow="Mini app exclusivo"
        title="Suporte Básico de Vida (SBV)"
        description="Reconhecimento da PCR, RCP de alta qualidade, uso do DEA e desobstrução de vias aéreas — adulto, pediátrico e lactente, conforme diretrizes AHA."
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {ABAS.map((a) => (
          <button
            key={a.id}
            onClick={() => setAba(a.id)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              aba === a.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-foreground/80 hover:bg-accent"
            }`}
          >
            <span className="mr-1">{a.emoji}</span>
            {a.label}
          </button>
        ))}
      </div>

      {aba === "cadeia" && <CadeiaSobrevivencia />}
      {aba === "adulto" && <RCPAdulto />}
      {aba === "pediatrico" && <RCPPediatrico />}
      {aba === "lactente" && <RCPLactente />}
      {aba === "dea" && <UsoDEA />}
      {aba === "ovace" && <OVACE />}
      {aba === "erros" && <ErrosFatais />}

      <Referencias />

      <p className="mt-4 text-center text-[11px] text-muted-foreground">
        Conteúdo educacional baseado nas diretrizes AHA 2020 (atualização 2023/2025).
        Sempre siga os protocolos da sua instituição.
      </p>
    </AppShell>
  );
}

function SectionTitle({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <div className="rounded-md bg-primary/10 p-2 text-primary">{icon}</div>
      <h2 className="text-lg font-semibold">{children}</h2>
    </div>
  );
}

function CadeiaSobrevivencia() {
  const elos = [
    { n: 1, t: "Reconhecimento e acionamento", d: "Identificar PCR (irresponsivo + sem respiração ou gasping) e acionar SAMU 192 / Código Azul imediatamente." },
    { n: 2, t: "RCP precoce de alta qualidade", d: "Compressões fortes, rápidas (100–120/min), profundas (5–6 cm no adulto) e com retorno total do tórax." },
    { n: 3, t: "Desfibrilação rápida", d: "Aplicar DEA assim que disponível. Cada minuto de atraso reduz ~10% a chance de sobrevida." },
    { n: 4, t: "Suporte Avançado (SAVC)", d: "Equipe SAVC com vias aéreas avançadas, drogas e identificação dos 5H e 5T." },
    { n: 5, t: "Cuidados pós-PCR", d: "Manejo hemodinâmico, controle de temperatura, oxigenação alvo e cuidado neurológico em UTI." },
    { n: 6, t: "Recuperação", d: "Reabilitação física, cognitiva e suporte psicológico ao paciente e família." },
  ];
  return (
    <Card>
      <SectionTitle icon={<HeartPulse className="h-4 w-4" />}>Cadeia de Sobrevivência (Intra-hospitalar)</SectionTitle>
      <ol className="space-y-3">
        {elos.map((e) => (
          <li key={e.n} className="flex gap-3 rounded-lg border border-border bg-card/50 p-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              {e.n}
            </div>
            <div>
              <p className="font-semibold">{e.t}</p>
              <p className="text-sm text-foreground/70">{e.d}</p>
            </div>
          </li>
        ))}
      </ol>
    </Card>
  );
}

function PassoLista({ passos }: { passos: { t: string; d: string }[] }) {
  return (
    <ol className="space-y-2">
      {passos.map((p, i) => (
        <li key={i} className="flex gap-3 rounded-md border border-border bg-card/50 p-3">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
            {i + 1}
          </div>
          <div>
            <p className="text-sm font-semibold">{p.t}</p>
            <p className="text-xs text-foreground/70">{p.d}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function ParametrosGrid({ items }: { items: { k: string; v: string }[] }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {items.map((i) => (
        <div key={i.k} className="rounded-md border border-border bg-card/50 p-2">
          <p className="text-[10px] uppercase tracking-wide text-foreground/60">{i.k}</p>
          <p className="text-sm font-semibold">{i.v}</p>
        </div>
      ))}
    </div>
  );
}

function RCPAdulto() {
  return (
    <Card>
      <SectionTitle icon={<HeartPulse className="h-4 w-4" />}>RCP de Alta Qualidade — Adulto</SectionTitle>
      <p className="mb-3 text-sm text-foreground/70">
        Vítima ≥ puberdade. Sequência <b>C-A-B</b> (Compressões → Vias Aéreas → Ventilação).
      </p>
      <ParametrosGrid
        items={[
          { k: "Frequência", v: "100–120/min" },
          { k: "Profundidade", v: "5–6 cm" },
          { k: "Local", v: "Metade inferior do esterno" },
          { k: "Relação C:V", v: "30:2 (sem VA avançada)" },
          { k: "Com VA avançada", v: "1 vent. a cada 6s" },
          { k: "Troca de socorrista", v: "A cada 2 min" },
        ]}
      />
      <div className="my-4 h-px bg-border" />
      <PassoLista
        passos={[
          { t: "Segurança da cena", d: "Avalie riscos para o socorrista antes de aproximar-se." },
          { t: "Checar responsividade", d: "Tocar nos ombros e chamar em voz alta: 'Você está bem?'" },
          { t: "Acionar ajuda e pedir DEA", d: "Chamar SAMU 192 / Código Azul e solicitar o DEA imediatamente." },
          { t: "Checar respiração e pulso (≤10 s)", d: "Observar tórax + palpar carótida simultaneamente. Gasping = PCR." },
          { t: "Iniciar compressões", d: "30 compressões fortes e rápidas, permitindo retorno total do tórax." },
          { t: "Abrir via aérea + 2 ventilações", d: "Inclinação da cabeça e elevação do queixo. Cada ventilação ~1 segundo, com elevação visível do tórax." },
          { t: "Manter ciclos 30:2", d: "Até o DEA chegar, a vítima se mover ou a equipe SAVC assumir." },
          { t: "Aplicar o DEA assim que disponível", d: "Ligar, posicionar pás, afastar todos e seguir os comandos." },
        ]}
      />
    </Card>
  );
}

function RCPPediatrico() {
  return (
    <Card>
      <SectionTitle icon={<Baby className="h-4 w-4" />}>RCP — Pediátrico (1 ano até puberdade)</SectionTitle>
      <ParametrosGrid
        items={[
          { k: "Frequência", v: "100–120/min" },
          { k: "Profundidade", v: "≈ 5 cm (1/3 do tórax)" },
          { k: "Técnica", v: "1 ou 2 mãos" },
          { k: "C:V 1 socorrista", v: "30:2" },
          { k: "C:V 2 socorristas", v: "15:2" },
          { k: "Pulso", v: "Carótida ou femoral" },
        ]}
      />
      <div className="my-4 h-px bg-border" />
      <p className="text-sm text-foreground/70">
        A causa mais comum de PCR pediátrica é <b>hipóxia/respiratória</b>, por isso a ventilação adequada é
        prioridade. Se PCR não presenciada e está sozinho, realize <b>2 minutos de RCP antes</b> de acionar
        ajuda e buscar o DEA.
      </p>
    </Card>
  );
}

function RCPLactente() {
  return (
    <Card>
      <SectionTitle icon={<Baby className="h-4 w-4" />}>RCP — Lactente (&lt; 1 ano)</SectionTitle>
      <ParametrosGrid
        items={[
          { k: "Frequência", v: "100–120/min" },
          { k: "Profundidade", v: "≈ 4 cm (1/3 do tórax)" },
          { k: "Técnica 1 socor.", v: "2 dedos no esterno" },
          { k: "Técnica 2 socor.", v: "2 polegares + mãos circundando" },
          { k: "C:V 1 socorrista", v: "30:2" },
          { k: "C:V 2 socorristas", v: "15:2" },
          { k: "Pulso", v: "Braquial (10 s)" },
        ]}
      />
      <div className="my-4 h-px bg-border" />
      <p className="text-sm text-foreground/70">
        Bradicardia &lt; 60 bpm <b>com sinais de má perfusão</b> mesmo após ventilação adequada → iniciar
        compressões. DEA pediátrico (com atenuador) é preferido; na falta, use o adulto.
      </p>
    </Card>
  );
}

function UsoDEA() {
  return (
    <Card>
      <SectionTitle icon={<Zap className="h-4 w-4" />}>Uso do DEA (Desfibrilador Externo Automático)</SectionTitle>
      <PassoLista
        passos={[
          { t: "LIGAR o aparelho", d: "Pressione o botão de liga e siga os comandos de voz." },
          { t: "Expor o tórax e SECAR", d: "Retire roupas, seque a pele, remova adesivos e barbeie se necessário." },
          { t: "Posicionar as pás", d: "Adulto: infraclavicular direita + linha axilar média esquerda. Lactente: anteroposterior." },
          { t: "AFASTAR todos para análise", d: "Não toque na vítima. O DEA analisa o ritmo em 5–15 s." },
          { t: "Se choque indicado: AFASTAR e CHOCAR", d: "Verifique visualmente, anuncie 'afastem-se' e pressione o botão." },
          { t: "Retomar RCP imediatamente", d: "2 minutos de RCP antes da próxima análise do DEA." },
        ]}
      />
      <div className="mt-3 rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-900 dark:text-amber-200">
        <p className="font-semibold">Atenção:</p>
        <ul className="ml-4 list-disc space-y-1">
          <li>Marca-passo / DCI: posicionar a pá &gt; 2,5 cm do gerador.</li>
          <li>Adesivos medicamentosos: remover antes de colar as pás.</li>
          <li>Ambiente molhado: secar a vítima; remover de poças d'água.</li>
          <li>Gestantes: aplicar normalmente, prioridade é salvar a mãe.</li>
        </ul>
      </div>
    </Card>
  );
}

function OVACE() {
  return (
    <Card>
      <SectionTitle icon={<ShieldAlert className="h-4 w-4" />}>OVACE — Obstrução de Via Aérea por Corpo Estranho</SectionTitle>
      <div className="space-y-3">
        <div className="rounded-md border border-border bg-card/50 p-3">
          <p className="text-sm font-semibold">Obstrução LEVE (vítima tosse, fala, respira)</p>
          <p className="text-xs text-foreground/70">Estimular a tosse. NÃO interferir. Manter vigilância e acionar ajuda se piorar.</p>
        </div>
        <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3">
          <p className="text-sm font-semibold text-destructive">Obstrução GRAVE — Adulto/Criança consciente</p>
          <ul className="ml-4 list-disc text-xs text-foreground/80">
            <li>Sinal universal de asfixia (mãos no pescoço).</li>
            <li>Aplicar <b>Manobra de Heimlich</b> (compressões abdominais) até desobstruir ou perder consciência.</li>
            <li>Gestantes / obesos: compressões <b>torácicas</b> no esterno.</li>
          </ul>
        </div>
        <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3">
          <p className="text-sm font-semibold text-destructive">Lactente consciente</p>
          <p className="text-xs text-foreground/80">
            5 golpes nas costas (entre as escápulas) + 5 compressões torácicas. Repetir até desobstruir.
            <b> Nunca</b> aplicar Heimlich em lactentes.
          </p>
        </div>
        <div className="rounded-md border border-border bg-card/50 p-3">
          <p className="text-sm font-semibold">Vítima INCONSCIENTE</p>
          <p className="text-xs text-foreground/70">
            Iniciar RCP. Antes de cada ventilação, inspecionar a boca e remover o corpo estranho <b>somente se visível</b>.
            Nunca varredura digital às cegas.
          </p>
        </div>
      </div>
    </Card>
  );
}

function ErrosFatais() {
  const erros = [
    { e: "Demorar para reconhecer a PCR — confundir gasping com respiração.", c: "Gasping é sinal de PCR. Iniciar RCP imediatamente." },
    { e: "Compressões superficiais ou lentas.", c: "Fortes (5–6 cm), rápidas (100–120/min), retorno total do tórax." },
    { e: "Interrupções prolongadas entre ciclos.", c: "Minimize pausas. Tempo de mão no tórax deve ser > 60–80%." },
    { e: "Hiperventilar a vítima.", c: "Cada ventilação ~1 s, apenas até elevar o tórax. Excesso reduz retorno venoso." },
    { e: "Aguardar via aérea avançada para iniciar compressões.", c: "Compressões primeiro (C-A-B). VA avançada é do SAVC." },
    { e: "Não usar o DEA por medo.", c: "O DEA é seguro: só choca ritmos chocáveis (FV/TVsp). Sem ele a sobrevida cai a cada minuto." },
    { e: "Varredura digital às cegas em OVACE.", c: "Pode empurrar o corpo estranho. Remover só se visível." },
    { e: "Aplicar Heimlich em lactente.", c: "Lactente: 5 golpes nas costas + 5 compressões torácicas." },
  ];
  return (
    <Card>
      <SectionTitle icon={<ShieldAlert className="h-4 w-4" />}>Erros Fatais no SBV</SectionTitle>
      <ul className="space-y-2">
        {erros.map((x, i) => (
          <li key={i} className="rounded-md border border-border bg-card/50 p-3">
            <div className="flex items-start gap-2">
              <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
              <p className="text-sm font-medium">{x.e}</p>
            </div>
            <div className="mt-1 flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              <p className="text-xs text-foreground/70">{x.c}</p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function Referencias() {
  return (
    <Card className="mt-4">
      <h3 className="mb-2 text-sm font-semibold">Referências</h3>
      <ul className="ml-4 list-disc space-y-1 text-xs text-foreground/70">
        <li>AMERICAN HEART ASSOCIATION. Destaques das Diretrizes de RCP e ACE da AHA, 2020 (com focused updates 2023/2024).</li>
        <li>AMERICAN HEART ASSOCIATION. BLS Provider Manual, 2020.</li>
        <li>COFEN. Resolução nº 564/2017. Código de Ética dos Profissionais de Enfermagem.</li>
        <li>COFEN. Resolução nº 736/2024. Processo de Enfermagem.</li>
        <li>MINISTÉRIO DA SAÚDE. Protocolos de Suporte Básico de Vida. Brasília, 2022.</li>
      </ul>
    </Card>
  );
}
