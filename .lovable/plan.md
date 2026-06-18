
## Sobre custo (importante ler antes)

Você pediu "animações 2D curtas geradas por IA". Existem dois caminhos com custos muito diferentes — preciso te avisar antes de gastar créditos:

- **Caminho A — Vídeos MP4 reais gerados por IA** (uma cena de 5s por etapa, com a ferramenta de geração de vídeo). Fica lindo, mas **cada clipe de 5s custa créditos significativos**. Estimei ~8 etapas × 6 procedimentos = ~48 clipes. Isso queima muito crédito e os modelos atuais de vídeo IA têm dificuldade em representar procedimentos clínicos com precisão anatômica (mãos, agulhas, anatomia — costuma sair errado).
- **Caminho B (recomendado) — Animação 2D "frame-a-frame" sem vídeo**: para cada etapa eu gero **uma ilustração estática** (estilo desenho médico didático, mascote da Academia) e o app **anima a transição entre as ilustrações** com efeitos suaves (zoom no local da punção, fade, deslizar, destaque pulsante na veia/uretra/narina, seta animada de avanço da sonda). Cada procedimento vira uma "animação" navegável com 6–10 cenas. **Custa apenas a geração das ilustrações** (muito mais barato que vídeo) e fica anatomicamente correto porque eu reviso cada imagem. **Vou seguir por aqui** — me avise se preferir o A.

## O que será construído

Nova aba **"Procedimentos animados"** dentro do mini-app **Simulações Reais** (não cria card novo na home). 6 procedimentos:

1. **SNG/SNE** (sonda nasogástrica e enteral) — adulto
2. **SVD** (sondagem vesical de demora) — adulto masculino e feminino
3. **SVA** (sondagem vesical de alívio)
4. **Punção venosa periférica — adulto**
5. **Punção venosa periférica — pediatria/lactente/RN** (com particularidades de cada faixa)
6. **Punção de jugular externa — adulto**

Cada procedimento abre uma tela com:
- **Player de animação**: cena atual ocupando ~60% da tela, com a ilustração animada (entrada por fade+scale, destaque pulsante no ponto de ação, seta indicando movimento). Controles ▶ play/pause, ⏮ ⏭ etapa anterior/próxima, barra de progresso por etapa.
- **Legenda da etapa**: nome curto + descrição clínica (1–2 frases) + ponto de atenção (em destaque).
- **Materiais necessários**: lista no topo, exibida na cena 1.
- **Indicações / Contraindicações / Complicações**: tabs abaixo do player.
- **Checklist de execução** ao final, marcável (estado salvo localmente).
- **Referências**: COFEN, Ministério da Saúde, Potter & Perry — usando o componente `References` já existente.

## Estrutura técnica

```text
src/data/procedimentos/
  index.ts                    # tipos + array PROCEDIMENTOS
  sng.ts                      # cenas, materiais, indicações, etc
  svd-masc.ts
  svd-fem.ts
  sva.ts
  puncao-adulto.ts
  puncao-pediatria.ts         # subseções: RN, lactente, pré-escolar
  puncao-jugular-externa.ts

src/components/procedimentos/
  ProcedimentoPlayer.tsx      # player com controles e animações CSS/Framer
  ProcedimentoCena.tsx        # uma cena (imagem + overlays animados)
  ProcedimentoChecklist.tsx

src/routes/
  simulacoes-reais.tsx        # ganha tabs: "Casos clínicos" | "Procedimentos"
  # ou rota filha: simulacoes-reais.procedimentos.tsx
  #                simulacoes-reais.procedimentos.$slug.tsx
```

Cada cena tem este shape:

```ts
type Cena = {
  ordem: number;
  titulo: string;               // "Higienização das mãos"
  descricao: string;            // texto curto exibido sob a imagem
  atencao?: string;             // ponto crítico em destaque
  imagem: string;               // URL da ilustração gerada
  overlays?: Array<{            // animações sobre a imagem
    tipo: 'pulse' | 'arrow' | 'highlight';
    x: number; y: number;       // posição relativa 0–1
    direcao?: 'up'|'down'|'left'|'right';
    cor?: string;
  }>;
  duracaoMs?: number;           // tempo padrão de autoplay (default 4500)
};
```

As animações são feitas com **CSS keyframes + Tailwind animate utilities** já existentes no projeto (`animate-fade-in`, `animate-scale-in`) mais um keyframe novo `pulse-ring` para o destaque circular pulsante no ponto de ação. **Sem nenhuma dependência nova**.

## Geração das ilustrações

Para cada cena, eu gero uma ilustração com `imagegen--generate_image` (qualidade `fast`, 1024×1024 ou 1024×768), estilo: **ilustração médica didática chapada, traços limpos, paleta consistente com o app, fundo claro neutro, foco na região anatômica**. Cada procedimento tem ~7–9 cenas, então:

- Total de imagens estimadas: **~55 ilustrações**.
- Eu gero, valido visualmente, regero a que sair errada. Imagens são salvas em `src/assets/procedimentos/` e migradas para CDN com `lovable-assets` para não inchar o repo.

Vou **começar gerando apenas 1 procedimento completo (SNG)** como prova, mostrar pra você, e só seguir com os outros 5 depois que você aprovar o visual e o ritmo da animação. Assim você não gasta créditos com 55 imagens de uma vez se não gostar do estilo.

## Acesso

Como está dentro de Simulações Reais, **herda o mesmo controle de acesso** (gratuito/pago/assinante) que já existe — não mexo em paywall.

## Fora de escopo

- Vídeo real com pessoas (não é IA generativa nem ético/legal sem cessão de imagem).
- Vídeos MP4 de IA (caminho A) — só faço se você pedir explicitamente.
- Áudio/narração — posso adicionar TTS depois se você quiser, em uma segunda iteração.

## Entregáveis desta primeira rodada

1. Estrutura de dados + tipos.
2. Tabs em Simulações Reais e rotas filhas.
3. Componentes do player + cena + checklist.
4. **SNG completo** (7–9 cenas com ilustrações geradas).
5. Esqueleto dos outros 5 procedimentos com placeholder "Em produção" para você liberar a geração das próximas ilustrações.
