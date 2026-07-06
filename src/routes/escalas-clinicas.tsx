import { createFileRoute } from "@tanstack/react-router";
import { AppShell, Card, PageHeader } from "@/components/AppShell";
import { MiniAppContent } from "@/components/MiniAppContent";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Ruler,
  Activity,
  Brain,
  HeartPulse,
  Baby,
  Users,
  Smile,
  ShieldAlert,
  Lightbulb,
  Target,
  ClipboardCheck,
} from "lucide-react";
import mascoteMenino from "@/assets/mascote-menino-iras.png.asset.json";
import mascoteMenina from "@/assets/mascote-menina.png.asset.json";

export const Route = createFileRoute("/escalas-clinicas")({
  head: () => ({
    meta: [
      { title: "Escalas Clínicas na Prática — Academia da Enfermagem" },
      {
        name: "description",
        content:
          "8 escalas essenciais da enfermagem explicadas de forma didática: Braden, Morse, Glasgow, RASS, EVA/Faces, NEWS, PEWS e Fugulin.",
      },
    ],
  }),
  component: EscalasPage,
});

// ————————————————————————————————————————————————
// Helpers de UI (reaproveitam tokens semânticos)
// ————————————————————————————————————————————————

type Nivel = "success" | "warning" | "destructive" | "primary";

const nivelBg: Record<Nivel, string> = {
  success: "bg-success/15 border-success/30 text-success-foreground",
  warning: "bg-warning/20 border-warning/40 text-warning-foreground",
  destructive: "bg-destructive/15 border-destructive/30 text-destructive",
  primary: "bg-primary/10 border-primary/30 text-primary",
};

function Finalidade({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3 rounded-2xl border border-primary/25 bg-primary/5 p-4">
      <div className="mb-1 flex items-center gap-2 text-primary">
        <Target className="h-4 w-4" />
        <span className="text-xs font-semibold uppercase tracking-widest">Finalidade</span>
      </div>
      <p className="text-sm text-foreground">{children}</p>
    </div>
  );
}

function ComoAplicar({ passos }: { passos: string[] }) {
  return (
    <div className="mb-3 rounded-2xl border border-gold/30 bg-gold/10 p-4">
      <div className="mb-2 flex items-center gap-2 text-primary">
        <ClipboardCheck className="h-4 w-4" />
        <span className="text-xs font-semibold uppercase tracking-widest">Como aplicar</span>
      </div>
      <ol className="ml-4 list-decimal space-y-1 text-sm text-foreground">
        {passos.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ol>
    </div>
  );
}

function Interpretacao({
  faixas,
}: {
  faixas: { nivel: Nivel; titulo: string; desc: string }[];
}) {
  return (
    <div className="mb-3">
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Interpretação
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {faixas.map((f, i) => (
          <div key={i} className={`rounded-xl border p-3 ${nivelBg[f.nivel]}`}>
            <p className="text-sm font-bold">{f.titulo}</p>
            <p className="mt-0.5 text-xs opacity-90">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function DicaEnfa({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-accent/40 bg-accent/15 p-4">
      <div className="mb-1 flex items-center gap-2 text-primary">
        <Lightbulb className="h-4 w-4" />
        <span className="text-xs font-semibold uppercase tracking-widest">Dica da Enfa</span>
      </div>
      <p className="text-sm text-foreground">{children}</p>
    </div>
  );
}

function TabelaEscala({
  colunas,
  linhas,
}: {
  colunas: string[];
  linhas: (string | number)[][];
}) {
  return (
    <div className="mb-3 overflow-hidden rounded-2xl border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-primary/10">
            {colunas.map((c, i) => (
              <TableHead key={i} className="font-semibold text-primary">
                {c}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {linhas.map((l, i) => (
            <TableRow key={i}>
              {l.map((cell, j) => (
                <TableCell key={j} className="text-sm">
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function EscalaItem({
  value,
  icon: Icon,
  nome,
  subtitulo,
  children,
}: {
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  nome: string;
  subtitulo: string;
  children: React.ReactNode;
}) {
  return (
    <AccordionItem
      value={value}
      className="mb-3 overflow-hidden rounded-2xl border border-gold/30 bg-card shadow-[var(--shadow-soft)]"
    >
      <AccordionTrigger className="px-4 py-3 hover:no-underline">
        <div className="flex items-center gap-3 text-left">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl gold-gradient">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="font-display text-base font-bold text-foreground">{nome}</p>
            <p className="text-xs text-muted-foreground">{subtitulo}</p>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4">{children}</AccordionContent>
    </AccordionItem>
  );
}

function GrupoTitulo({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-6 mb-2 font-display text-sm font-bold uppercase tracking-widest text-primary">
      {children}
    </h2>
  );
}

// ————————————————————————————————————————————————
// Página
// ————————————————————————————————————————————————

function EscalasPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Avaliação Clínica"
        title="Escalas Clínicas na Prática"
        description="8 escalas essenciais que todo estudante de enfermagem precisa dominar. Clique em cada título para abrir."
      />
      <MiniAppContent slug="escalas-clinicas" />

      {/* Banner com mascotes (padrão IRAS) */}
      <section className="mb-6 overflow-hidden rounded-3xl border border-gold/40 bg-primary text-primary-foreground shadow-[var(--shadow-glass)]">
        <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2 px-4 pt-4 sm:px-6">
          <img
            src={mascoteMenino.url}
            alt="Mascote menino"
            className="h-40 w-auto justify-self-end object-contain drop-shadow-[0_8px_18px_rgba(0,0,0,0.35)] sm:h-56"
          />
          <div className="pb-2 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-gold">
              Avaliar é cuidar
            </p>
            <p className="font-display text-lg font-extrabold leading-tight text-gold sm:text-2xl">
              ESCALAS QUE<br />SALVAM VIDAS
            </p>
          </div>
          <img
            src={mascoteMenina.url}
            alt="Mascote menina"
            className="h-40 w-auto justify-self-start object-contain drop-shadow-[0_8px_18px_rgba(0,0,0,0.35)] sm:h-56"
          />
        </div>
        <div className="border-t border-gold/30 bg-primary-glow/20 px-5 py-4 text-center">
          <p className="font-display text-base font-bold leading-snug text-primary-foreground sm:text-xl">
            "Uma boa <span className="text-gold">avaliação</span> transforma dados em{" "}
            <span className="text-gold">decisões</span> clínicas seguras."
          </p>
        </div>
      </section>

      {/* Introdução */}
      <Card className="mb-6 p-5">
        <div className="mb-2 flex items-center gap-2 text-gold">
          <Ruler className="h-5 w-5" />
          <p className="text-xs font-semibold uppercase tracking-widest">Antes de começar</p>
        </div>
        <h3 className="font-display text-base font-bold">O que é uma escala clínica?</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          É um instrumento padronizado que transforma a observação do enfermeiro em uma{" "}
          <strong>pontuação objetiva</strong>. Ela ajuda a identificar riscos, comparar a
          evolução do paciente ao longo do tempo e comunicar achados clínicos com clareza
          para toda a equipe.
        </p>
      </Card>

      <Accordion type="multiple" className="w-full">
        <GrupoTitulo>Risco Assistencial</GrupoTitulo>

        {/* 1. BRADEN */}
        <EscalaItem
          value="braden"
          icon={ShieldAlert}
          nome="Escala de Braden"
          subtitulo="Risco de Lesão por Pressão (LPP)"
        >
          <Finalidade>
            Estimar o risco de o paciente desenvolver Lesão por Pressão (LPP) a partir de 6
            fatores de risco.
          </Finalidade>
          <ComoAplicar
            passos={[
              "Avalie cada um dos 6 subitens de 1 a 4 pontos (fricção/cisalhamento vai de 1 a 3).",
              "Some as pontuações — o total varia de 6 a 23.",
              "Quanto MENOR o número, MAIOR o risco.",
              "Reavalie de acordo com o protocolo institucional (geralmente a cada 24–48h).",
            ]}
          />
          <TabelaEscala
            colunas={["Subitem", "1 pt", "2 pts", "3 pts", "4 pts"]}
            linhas={[
              ["Percepção sensorial", "Totalmente limitada", "Muito limitada", "Levemente limitada", "Nenhuma limitação"],
              ["Umidade", "Constantemente úmida", "Muito úmida", "Ocasionalmente úmida", "Raramente úmida"],
              ["Atividade", "Acamado", "Confinado à cadeira", "Anda ocasionalmente", "Anda frequentemente"],
              ["Mobilidade", "Totalmente imóvel", "Muito limitada", "Levemente limitada", "Sem limitação"],
              ["Nutrição", "Muito pobre", "Provavelmente inadequada", "Adequada", "Excelente"],
              ["Fricção/cisalhamento", "Problema", "Problema em potencial", "Nenhum problema", "—"],
            ]}
          />
          <Interpretacao
            faixas={[
              { nivel: "destructive", titulo: "≤ 9 — Risco muito alto", desc: "Intervenções máximas imediatas." },
              { nivel: "destructive", titulo: "10–12 — Risco alto", desc: "Mudança de decúbito rigorosa e superfície especial." },
              { nivel: "warning", titulo: "13–14 — Risco moderado", desc: "Reposicionamento programado e hidratação da pele." },
              { nivel: "success", titulo: "15–18 — Risco baixo | ≥19 sem risco", desc: "Cuidados preventivos de rotina." },
            ]}
          />
          <DicaEnfa>
            Registre a pontuação e o plano de cuidados no prontuário. LPP prevenida é
            qualidade assistencial mensurável.
          </DicaEnfa>
        </EscalaItem>

        {/* 2. MORSE */}
        <EscalaItem
          value="morse"
          icon={Activity}
          nome="Escala de Morse"
          subtitulo="Risco de quedas na internação"
        >
          <Finalidade>
            Identificar a probabilidade do paciente sofrer queda durante a internação,
            orientando medidas preventivas.
          </Finalidade>
          <ComoAplicar
            passos={[
              "Avalie os 6 itens (marque a pontuação correspondente).",
              "Some os pontos — total varia de 0 a 125.",
              "Classifique o risco e aplique as medidas preventivas do protocolo.",
              "Reavalie a cada mudança de turno ou após queda/alteração clínica.",
            ]}
          />
          <TabelaEscala
            colunas={["Item", "Opções", "Pontos"]}
            linhas={[
              ["Histórico de quedas (últimos 3 meses)", "Não / Sim", "0 / 25"],
              ["Diagnóstico secundário", "Não / Sim", "0 / 15"],
              ["Auxílio para deambulação", "Nenhum, repouso ou ajuda da enfermagem", "0"],
              ["", "Muletas, bengala ou andador", "15"],
              ["", "Apoia-se em móveis", "30"],
              ["Terapia endovenosa / heparina", "Não / Sim", "0 / 20"],
              ["Marcha", "Normal, repouso ou cadeira de rodas", "0"],
              ["", "Fraca", "10"],
              ["", "Cambaleante", "20"],
              ["Estado mental", "Orientado sobre a própria capacidade / Superestima ou esquece", "0 / 15"],
            ]}
          />
          <Interpretacao
            faixas={[
              { nivel: "success", titulo: "0–24 — Baixo risco", desc: "Cuidados básicos de segurança." },
              { nivel: "warning", titulo: "25–44 — Risco moderado", desc: "Protocolo padrão de prevenção de quedas." },
              { nivel: "destructive", titulo: "≥ 45 — Alto risco", desc: "Sinalização, grades elevadas e supervisão contínua." },
            ]}
          />
          <DicaEnfa>
            Coloque a pulseira de identificação de risco de queda e oriente paciente e
            família — prevenção é responsabilidade compartilhada.
          </DicaEnfa>
        </EscalaItem>

        <GrupoTitulo>Neurológicas</GrupoTitulo>

        {/* 3. GLASGOW */}
        <EscalaItem
          value="glasgow"
          icon={Brain}
          nome="Escala de Coma de Glasgow (ECG)"
          subtitulo="Avaliação do nível de consciência"
        >
          <Finalidade>
            Avaliar objetivamente o nível de consciência do paciente a partir de três
            parâmetros: abertura ocular, resposta verbal e resposta motora.
          </Finalidade>
          <ComoAplicar
            passos={[
              "Observe a MELHOR resposta em cada um dos três parâmetros.",
              "Some as pontuações — total varia de 3 (coma profundo) a 15 (totalmente alerta).",
              "Registre no formato O__V__M__ = total (ex.: O3V4M5 = 12).",
              "Na versão atualizada (ECG-P), avalie também a reatividade pupilar e subtraia 0, 1 ou 2 pontos.",
            ]}
          />
          <TabelaEscala
            colunas={["Pontos", "Abertura ocular (O)", "Resposta verbal (V)", "Resposta motora (M)"]}
            linhas={[
              [6, "—", "—", "Obedece a comandos"],
              [5, "—", "Orientada", "Localiza dor"],
              [4, "Espontânea", "Confusa", "Flexão normal (retirada)"],
              [3, "Ao som (estímulo verbal)", "Palavras inapropriadas", "Flexão anormal (decorticação)"],
              [2, "À pressão (dor)", "Sons incompreensíveis", "Extensão (descerebração)"],
              [1, "Ausente", "Ausente", "Ausente"],
            ]}
          />
          <Interpretacao
            faixas={[
              { nivel: "success", titulo: "13–15 — Leve", desc: "Paciente responsivo, acompanhamento clínico." },
              { nivel: "warning", titulo: "9–12 — Moderado", desc: "Rebaixamento significativo, atenção redobrada." },
              { nivel: "destructive", titulo: "3–8 — Grave", desc: "Coma; considerar via aérea avançada." },
            ]}
          />
          <DicaEnfa>
            NUNCA registre "Glasgow 3" sem o detalhamento O V M — a decomposição
            mostra qual componente está mais comprometido e guia a conduta.
          </DicaEnfa>
        </EscalaItem>

        {/* 4. RASS */}
        <EscalaItem
          value="rass"
          icon={Brain}
          nome="Escala RASS"
          subtitulo="Sedação e agitação em UTI"
        >
          <Finalidade>
            Avaliar o nível de sedação ou agitação do paciente crítico, especialmente sob
            ventilação mecânica, guiando o ajuste de sedativos.
          </Finalidade>
          <ComoAplicar
            passos={[
              "Observe o paciente por 10 segundos (sem tocar).",
              "Se não estiver alerta, chame pelo nome e peça para abrir os olhos.",
              "Se não responder, aplique estímulo físico (ombro/esternal).",
              "Classifique de +4 (combativo) a −5 (sem resposta).",
            ]}
          />
          <TabelaEscala
            colunas={["Pontos", "Termo", "Descrição"]}
            linhas={[
              ["+4", "Combativo", "Violento, perigo imediato à equipe."],
              ["+3", "Muito agitado", "Puxa tubos/cateteres, agressivo."],
              ["+2", "Agitado", "Movimentos frequentes sem propósito, briga com ventilador."],
              ["+1", "Inquieto", "Ansioso, mas movimentos não agressivos."],
              [0, "Alerta e calmo", "—"],
              ["−1", "Sonolento", "Desperta ao chamado (>10s de contato visual)."],
              ["−2", "Sedação leve", "Desperta brevemente ao chamado (<10s)."],
              ["−3", "Sedação moderada", "Movimento ao chamado, sem contato visual."],
              ["−4", "Sedação profunda", "Sem resposta ao chamado, responde ao estímulo físico."],
              ["−5", "Não desperta", "Sem resposta a qualquer estímulo."],
            ]}
          />
          <Interpretacao
            faixas={[
              { nivel: "primary", titulo: "Alvo geral: 0 a −2", desc: "Sedação leve, paciente calmo e cooperativo." },
              { nivel: "warning", titulo: "Positivo (+1 a +4)", desc: "Reavaliar dor, delirium e necessidade de sedação." },
              { nivel: "destructive", titulo: "−4 e −5", desc: "Sedação profunda — risco aumentado de delirium e ventilação prolongada." },
            ]}
          />
          <DicaEnfa>
            Reavalie o RASS a cada 4 horas (ou conforme rotina da UTI). Um alvo bem
            definido pela equipe reduz tempo de ventilação mecânica.
          </DicaEnfa>
        </EscalaItem>

        <GrupoTitulo>Dor</GrupoTitulo>

        {/* 5. EVA + FACES */}
        <EscalaItem
          value="dor"
          icon={Smile}
          nome="Escala Visual Analógica (EVA) e Escala de Faces"
          subtitulo="Mensuração da intensidade da dor"
        >
          <Finalidade>
            Quantificar a dor referida pelo paciente para orientar intervenções
            analgésicas precoces e avaliar a eficácia do tratamento.
          </Finalidade>
          <ComoAplicar
            passos={[
              "EVA (adulto orientado): peça para o paciente indicar de 0 (sem dor) a 10 (pior dor imaginável).",
              "Escala de Faces (crianças a partir de 3 anos, idosos ou pacientes com dificuldade verbal): mostre as faces e peça para escolher a que representa como se sente.",
              "Registre o valor numérico, a localização e as características da dor.",
              "Reavalie após a intervenção (ex.: 30 min após analgésico EV, 60 min após VO).",
            ]}
          />
          <TabelaEscala
            colunas={["Pontuação", "EVA", "Face correspondente", "Ação sugerida"]}
            linhas={[
              ["0", "Sem dor", "😀 Sorridente", "Nenhuma intervenção."],
              ["1–3", "Dor leve", "🙂 Levemente incomodado", "Medidas não farmacológicas + analgesia simples."],
              ["4–6", "Dor moderada", "😐 / 😟", "Analgesia programada, avaliar opioide fraco."],
              ["7–9", "Dor intensa", "😣", "Analgesia potente, comunicar médico."],
              ["10", "Dor insuportável", "😭 Chorando", "Reavaliação imediata — dor é emergência."],
            ]}
          />
          <Interpretacao
            faixas={[
              { nivel: "success", titulo: "0–3", desc: "Dor controlada — manter conduta." },
              { nivel: "warning", titulo: "4–6", desc: "Dor moderada — intensificar analgesia." },
              { nivel: "destructive", titulo: "7–10", desc: "Dor intensa — intervenção imediata." },
            ]}
          />
          <DicaEnfa>
            Dor é o 5º sinal vital. Registre sempre e não subestime o relato do paciente
            — dor é o que ele diz que é.
          </DicaEnfa>
        </EscalaItem>

        <GrupoTitulo>Deterioração Clínica</GrupoTitulo>

        {/* 6. NEWS */}
        <EscalaItem
          value="news"
          icon={HeartPulse}
          nome="Escala NEWS"
          subtitulo="Alerta precoce de deterioração no adulto"
        >
          <Finalidade>
            Identificar precocemente pacientes adultos com risco de deterioração clínica,
            padronizando a resposta da equipe.
          </Finalidade>
          <ComoAplicar
            passos={[
              "Verifique os 7 parâmetros fisiológicos.",
              "Atribua pontuação a cada parâmetro (0 a 3 pontos).",
              "Some — total varia de 0 a 20.",
              "Aplique a frequência de reavaliação e as ações conforme a faixa.",
            ]}
          />
          <TabelaEscala
            colunas={["Parâmetro", "3", "2", "1", "0", "1", "2", "3"]}
            linhas={[
              ["FR (irpm)", "≤8", "—", "9–11", "12–20", "—", "21–24", "≥25"],
              ["SpO₂ (%)", "≤91", "92–93", "94–95", "≥96", "—", "—", "—"],
              ["Uso de O₂ suplementar", "—", "Sim", "—", "Não", "—", "—", "—"],
              ["Temperatura (°C)", "≤35", "—", "35,1–36", "36,1–38", "38,1–39", "≥39,1", "—"],
              ["PAS (mmHg)", "≤90", "91–100", "101–110", "111–219", "—", "—", "≥220"],
              ["FC (bpm)", "≤40", "—", "41–50", "51–90", "91–110", "111–130", "≥131"],
              ["Nível de consciência", "—", "—", "—", "Alerta", "—", "—", "Novo rebaixamento"],
            ]}
          />
          <Interpretacao
            faixas={[
              { nivel: "success", titulo: "0 — Baixo", desc: "Reavaliar em 12h." },
              { nivel: "warning", titulo: "1–4 — Baixo/médio", desc: "Reavaliar em 4–6h; comunicar enfermeiro." },
              { nivel: "warning", titulo: "3 em qualquer item isolado", desc: "Reavaliar em 1h; comunicar médico." },
              { nivel: "destructive", titulo: "5–6 — Médio", desc: "Reavaliação horária; equipe médica de emergência." },
              { nivel: "destructive", titulo: "≥ 7 — Alto", desc: "Monitorização contínua; considerar UTI." },
            ]}
          />
          <DicaEnfa>
            NEWS não substitui o julgamento clínico — se algo parece errado, comunique
            mesmo com escore baixo.
          </DicaEnfa>
        </EscalaItem>

        {/* 7. PEWS */}
        <EscalaItem
          value="pews"
          icon={Baby}
          nome="Escala PEWS"
          subtitulo="Alerta precoce em pediatria"
        >
          <Finalidade>
            Detectar precocemente sinais de deterioração clínica na criança internada,
            adaptando parâmetros à faixa etária pediátrica.
          </Finalidade>
          <ComoAplicar
            passos={[
              "Avalie 3 domínios: comportamento, cardiovascular e respiratório.",
              "Pontue cada domínio de 0 a 3.",
              "Some — total varia de 0 a 9.",
              "Some 2 pontos adicionais se houver nebulização contínua ou vômitos persistentes pós-operatórios.",
            ]}
          />
          <TabelaEscala
            colunas={["Domínio", "0", "1", "2", "3"]}
            linhas={[
              [
                "Comportamento",
                "Brincando / adequado",
                "Sonolento",
                "Irritado",
                "Letárgico / resposta reduzida à dor",
              ],
              [
                "Cardiovascular",
                "Rosado / EC 1–2s",
                "Pálido / EC 3s",
                "Cianótico / EC 4s / FC ↑20 do normal",
                "Cinzento / EC ≥5s / FC ↑30 ou bradicardia",
              ],
              [
                "Respiratório",
                "Dentro do parâmetro / sem retração",
                "FR ↑10 / uso de musculatura acessória / FiO₂ ≥30%",
                "FR ↑20 / retrações / FiO₂ ≥40%",
                "FR ↓5 do normal / gemência / FiO₂ ≥50%",
              ],
            ]}
          />
          <Interpretacao
            faixas={[
              { nivel: "success", titulo: "0–2", desc: "Rotina de cuidados." },
              { nivel: "warning", titulo: "3", desc: "Reavaliar em 1h; comunicar enfermeiro responsável." },
              { nivel: "destructive", titulo: "4", desc: "Comunicar médico; reavaliar em 30 min." },
              { nivel: "destructive", titulo: "≥ 5", desc: "Ativar time de resposta rápida pediátrico." },
            ]}
          />
          <DicaEnfa>
            Em pediatria, mudanças no comportamento (irritado, muito sonolento) muitas
            vezes aparecem antes dos sinais vitais. Confie no que a mãe/pai relata.
          </DicaEnfa>
        </EscalaItem>

        <GrupoTitulo>Gerencial</GrupoTitulo>

        {/* 8. FUGULIN */}
        <EscalaItem
          value="fugulin"
          icon={Users}
          nome="Escala de Fugulin"
          subtitulo="Classificação de dependência e dimensionamento"
        >
          <Finalidade>
            Ferramenta usada pelo enfermeiro gestor para classificar o grau de
            dependência do paciente e dimensionar a equipe de enfermagem necessária.
          </Finalidade>
          <ComoAplicar
            passos={[
              "Avalie os 9 indicadores de cuidado (1 a 4 pontos cada).",
              "Some as pontuações — total varia de 9 a 36.",
              "Classifique o paciente na categoria de cuidado correspondente.",
              "Use o somatório da unidade para calcular o dimensionamento da equipe.",
            ]}
          />
          <TabelaEscala
            colunas={["Indicador", "1 pt", "2 pts", "3 pts", "4 pts"]}
            linhas={[
              ["Estado mental", "Orientado", "Períodos de desorientação", "Desorientação constante", "Inconsciente"],
              ["Oxigenação", "Não requer O₂", "Uso intermitente", "Uso contínuo", "VM"],
              ["Sinais vitais", "Controle 4x/dia", "Controle 6x/dia", "Controle 2/2h", "Controle ≤1/1h"],
              ["Motilidade", "Movimenta todos os segmentos", "Limitação de movimento", "Dificuldade grave", "Incapaz"],
              ["Deambulação", "Ambulante", "Auxílio para deambular", "Restrito ao leito, senta", "Restrito ao leito, decúbito"],
              ["Alimentação", "Via oral", "Via oral com auxílio", "SNE / SNG / SNP", "NPT"],
              ["Cuidado corporal", "Autocuidado", "Auxílio no banho no leito", "Banho no leito dependente", "Banho no leito + curativos complexos"],
              ["Eliminações", "Autocuidado", "Uso de comadre/papagaio com ajuda", "Fralda / dispositivo", "Evacuação/diurese assistida com procedimento"],
              ["Terapêutica", "VO / IM", "EV intermitente", "EV contínua", "Drogas vasoativas / múltiplas infusões"],
            ]}
          />
          <Interpretacao
            faixas={[
              { nivel: "success", titulo: "9–14 — Cuidados mínimos", desc: "Paciente estável, autossuficiente." },
              { nivel: "primary", titulo: "15–20 — Cuidados intermediários", desc: "Estável, parcialmente dependente." },
              { nivel: "warning", titulo: "21–26 — Cuidados de alta dependência", desc: "Estável, totalmente dependente." },
              { nivel: "warning", titulo: "27–31 — Cuidados semi-intensivos", desc: "Sujeito à instabilidade, sem risco iminente." },
              { nivel: "destructive", titulo: "≥ 32 — Cuidados intensivos", desc: "Grave, risco iminente de morte." },
            ]}
          />
          <DicaEnfa>
            A Fugulin é uma ferramenta gerencial: aplique diariamente e use os dados
            para justificar a escala e a alocação da equipe junto à gestão.
          </DicaEnfa>
        </EscalaItem>
      </Accordion>
    </AppShell>
  );
}
