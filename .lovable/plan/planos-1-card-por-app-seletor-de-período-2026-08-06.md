# Planos: 1 card por app + seletor de período

## O problema (confirmado)

Hoje o banco tem **16 planos ativos**: os 4 aplicativos reais (`academico`, `tecnico`, `tecnico-estudante`, `enfermeiro`) e mais 12 "planos-irmãos" criados só para guardar os links do Mercado Pago (`academico-anual`, `tecnico-trimestral-v2`, etc.).

A home lista todos os 16 → poluição visual.

E o 404: a página `/planos/$slug` só aceita os 4 slugs reais. Ao clicar em "Descobrir Conteúdo" de um card variação (ex.: `academico-anual`), a rota não existe e cai em 404.

## Como os grandes apps fazem

Netflix, Spotify, Duolingo, Canva: **um card por produto** e a escolha de período fica dentro da página, num **seletor (toggle) de período** — nunca um card por variação.

## O que vou fazer

**1. Home / Loja: só 4 portas**
Mostrar apenas os 4 aplicativos reais. As variações somem da vitrine (continuam no banco, só como donas dos links de pagamento). Isso já elimina o 404, porque só restam cards que apontam para páginas existentes.

**2. Página do plano: seletor de período elegante**
Em vez de 3–4 cards lado a lado, um bloco único:

```text
   [ Mensal ]  [ Trimestral ]  [ Semestral -10% ]  [ Anual  MAIS ESCOLHIDO ]
   ┌────────────────────────────────────────────────────┐
   │  R$ 24,99 /mês                                     │
   │  cobrado R$ 299,88 por ano · economize R$ XX       │
   │  ✓ Acesso completo   ✓ 2 certificados              │
   │  ✓ Grupo VIP         ✓ 2º app incluso              │
   │            [  ASSINAR ANUAL  ]                     │
   └────────────────────────────────────────────────────┘
```

- Ao trocar o período, muda só o preço, os benefícios e o botão (com uma transição suave).
- Sempre aparece o **preço equivalente por mês**, que é como o cliente compara.
- Selo "Mais escolhido" no anual e etiqueta de economia nos períodos longos.
- Padrão pré-selecionado: **Anual** (maior ticket), com o mensal a um toque de distância.

**3. Botão de pagamento correto por período**
Cada período usa o link de Mercado Pago da variação correspondente (o link que hoje está preso no plano-irmão). Nada de checkout errado.

**4. Coerência de texto**
"Descobrir Conteúdo" continua levando à página do app; lá dentro é que aparece o preço e o seletor.

## Detalhes técnicos

- `src/routes/index.tsx` e `loja.tsx`: filtrar `activePlans` pelos 4 slugs base (mesma lista `ALLOWED` de `planos.$slug.tsx`, extraída para `src/lib/plan-slugs.ts`).
- `src/components/planos/OfertasPeriodo.tsx`: reescrito de grid de cards para segmented control + painel único de preço/benefícios.
- Migração: preencher em `plan_offers` o link de pagamento de cada período, copiando dos planos-irmãos (`*-trimestral`, `*-semestral`, `*-anual`, incluindo os `-v2` do técnico), e marcar as variações como não listáveis na vitrine.
- Nenhuma alteração no conteúdo dos mini apps.
