## O que muda

Você poderá escolher, em cada aplicativo, **como os mini apps aparecem para o aluno**:
- **Numérica** — você digita 1, 2, 3… e a tela obedece.
- **Alfabética** — o sistema ordena por nome (A→Z), você não precisa digitar nada.

O mesmo vale para a ordem dos 3 aplicativos na loja (Acadêmico, Técnico, Enfermeiro).

## 1) Loja (ordem dos 3 aplicativos)
Admin → **Planos / Cakto** → botão no topo:
- ⚙️ **Modo de ordenação**: `Numérica` | `Alfabética`
- Se **Numérica**: em cada plano aparece um campo "Ordem" (1, 2, 3…).
- Se **Alfabética**: a loja ignora os números e ordena pelo nome.

## 2) Dentro de cada aplicativo (ordem dos mini apps)
Admin → **Apps & Organização** → escolhe o app → botão no topo:
- ⚙️ **Modo de ordenação**: `Numérica` | `Alfabética`
- **Numérica**: cada mini app tem campo "Ordem" (ou você continua arrastando — já grava número).
- **Alfabética**: a tela do aluno ignora números e ordena por nome.

Botão extra: **"Renumerar de 10 em 10"** (1 clique) — reescreve 10, 20, 30… assim fica fácil inserir novos no meio (ex: 15).

## 3) Mini apps (aba geral)
Também poderá numerar cada mini app pelo lápis (campo "Ordem"), útil quando o mini app está em vários apps.

## Como o aluno vê
A tela do aluno (loja e páginas de cada aplicativo) lê o modo de ordenação salvo e obedece:
- Modo **numérica** → menor número primeiro (grátis e pagos misturados pela sua ordem).
- Modo **alfabética** → A→Z pelo nome.

Hoje os grátis são forçados no topo — isso vai sair, para respeitar a sua decisão.

## Técnico (para o dev)
- **Migração**: adicionar `sort_mode text default 'numeric'` (`'numeric' | 'alpha'`) em `apps` (mini apps por app) e uma linha em `app_texts` (`ordenacao.loja` = `numeric | alpha`) para a loja.
- **Admin**:
  - `SubscriptionsAdmin.tsx`: toggle de modo da loja + campo "Ordem" (sort_order) em cada plano.
  - `AppsAdmin.tsx`: toggle por app + campo "Ordem" por mini app + botão "Renumerar de 10 em 10".
  - `admin.tsx` (aba Mini apps): campo "Ordem" no formulário de edição.
- **Aluno**:
  - `routes/index.tsx` / `fetchSubscriptionPlans`: aplica modo da loja.
  - `routes/trilha.$slug.tsx`: remove o sort que força grátis pro topo; aplica `sort_mode` do app.