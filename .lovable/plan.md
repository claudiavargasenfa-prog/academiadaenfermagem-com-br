# Por que o ChatGPT não acha a "página da loja"

## O que descobri

A loja **existe**, mas não está onde o ChatGPT procurou.

- O arquivo `src/routes/loja.tsx` tem apenas 7 linhas: ele só **redireciona** quem acessa `/loja` para a página inicial `/`.
- A loja de verdade (títulos, aplicativos, planos, depoimentos, feedback) está em **`src/routes/index.tsx`** — a página inicial. Inclusive o título dela já é "Loja — Academia da Enfermagem".

Ou seja: o ChatGPT abriu o arquivo com nome "loja", viu 7 linhas de redirecionamento e concluiu que faltava o código da loja. Nada está perdido nem faltando no GitHub.

Outro detalhe importante: boa parte do que aparece na loja (nomes dos aplicativos, preços, textos do topo, slogans) **não está no código** — vem do banco de dados (tabelas de aplicativos, planos e textos). Por isso uma auditoria só do código parece "incompleta".

## O que proponho fazer

1. Renomear nada e não mexer em funcionamento. Em vez disso, deixar um guia curto no projeto (`README` da pasta de páginas) explicando:
   - a loja é `src/routes/index.tsx`;
   - `loja.tsx` é só um atalho que redireciona;
   - quais textos vêm do banco e não do código.
2. Escrever para você, aqui no chat, a instrução exata para colar no ChatGPT, apontando o arquivo certo e os componentes que a loja usa.

## Detalhes técnicos

- Rota `/loja`: `createFileRoute("/loja")` com `beforeLoad` → `redirect({ to: "/" })`.
- Loja real: `src/routes/index.tsx`, que usa `AppShell`, `useApps`, `fetchSubscriptionPlans`, `fetchMyActiveSubscriptions`, `plan-slugs`, `app-texts` (`RichText`/`useText`), `TestimonialsSection`, `FeedbackCollector`.
- Conteúdo dinâmico: tabelas `apps`, `subscription_plans`, `app_texts`.
- Alteração proposta: apenas documentação em `src/routes/README.md`. Nenhuma mudança visual ou de comportamento.
