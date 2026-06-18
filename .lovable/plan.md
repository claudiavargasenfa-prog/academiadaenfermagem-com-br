# Acesso total de admin aos mini apps

## Problema
Hoje o `AppAccessGate` só libera quando o app é `gratuito` ou quando o usuário tem registro vigente em `user_app_access`. Como admin, você cai no cadeado de "Comprar agora" e precisa marcar o app como gratuito só para visualizar — o que mistura conteúdo de teste com a Loja real.

## Solução
Tratar o papel **admin** como bypass universal de paywall, em todo lugar onde o acesso é checado.

### 1. `src/lib/access.ts` — `useAppAccess(slug)`
- Antes de checar `user_app_access`, consultar `has_role(auth.uid(), 'admin')` (já existe no banco) via `user_roles`.
- Se for admin: retornar `{ app, granted: true, expiresAt: null, viaAdmin: true }`.
- Cache do resultado de admin numa segunda `useQuery(["is_admin"])` para não repetir consulta em cada gate.

### 2. `src/components/ContentProtection.tsx` — `AppAccessGate`
- Quando `data.viaAdmin === true`, renderizar uma faixa discreta no topo:
  > "Modo admin — visualização completa. Este conteúdo é pago para alunos."
- Continuar envolvendo em `ContentProtection` normalmente (marca d'água permanece, mostrando que é admin).

### 3. Loja (`/`) e Minha Conta (`/minha-conta`)
- Usar o mesmo hook `useIsAdmin()` para:
  - Trocar o botão "Comprar" por "Abrir (admin)" nos cards de apps pagos.
  - Listar todos os mini apps ativos em "Minha Conta" quando for admin, com tag "admin".
- Nada muda para alunos comuns.

### 4. Sem mudanças de banco
- Aproveita `user_roles` + função `has_role` que já existem.
- Não cria registros falsos em `user_app_access` (mantém relatórios de vendas limpos).

## Como você vai usar
1. Logado com sua conta admin, abrir qualquer rota de mini app (ex.: `/simulacoes-reais`, `/iras`, `/acls`).
2. O cadeado some, o conteúdo aparece com a faixa "Modo admin".
3. Pode reverter o `gratuito=true` que você marcou em "Simulações Reais" — ele volta a ser pago para alunos e continua aberto para você.

## Fora de escopo
- Não altera regras de cobrança nem webhook do Cakto.
- Não adiciona novo papel; usa o `admin` já existente.
