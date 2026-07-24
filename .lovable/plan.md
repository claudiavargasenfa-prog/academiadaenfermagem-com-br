## O que vou construir

Uma nova página de vendas em `/vendas`, separada da loja atual (que continua igual). Ela é feita para tráfego pago do Instagram: quem clica no anúncio cai direto nela, vê a proposta, escolhe um dos 4 apps e vai pro checkout da Cakto correspondente.

Estética: **fundo claro pastel** (mesma família do app), com **verde escuro do logo** e **dourado** como cores fortes. Bem profissional, tipografia elegante, muito respiro, nada carnavalesco.

## Estrutura da página (na ordem em que a pessoa vê)

1. **Topo fixo discreto** — logo + selo "Compra segura" + botão "Assinar agora" (scroll pros planos).
2. **Hero** — título forte ("A Academia da Enfermagem que cabe no seu bolso"), subtítulo curto, mascote/imagem, 4 selos de confiança (15 dias grátis · sem cartão no cadastro · offline · atualizações mensais), CTA principal ("Ver os 4 planos").
3. **Faixa de credibilidade** — "Base COFEN/COREN · ANVISA · MS · OMS" + números (mini apps, escalas, procedimentos, quizzes).
4. **Para quem é** — 4 cards curtinhos: Acadêmico / Técnico / Estudante de Técnico / Enfermeiro, cada um dizendo em 1 frase a dor que resolve.
5. **O que você recebe** — grid visual com os principais mini apps (SAE, Escalas Clínicas, Procedimentos, Coleta de Turno, Quizzes, Diagnósticos AE/DE...) usando ícones + 1 linha cada.
6. **Antes x Depois** — tabela pastel comparando "Plantão sem a Academia" vs "Plantão com a Academia".
7. **Os 4 planos (bloco principal de venda)** — 4 cards lado a lado (empilha no celular), cada um com:
   - Emoji + nome do app
   - 1 frase de posicionamento
   - 4-6 bullets do que tem dentro
   - Preço (puxado do banco, mesma fonte que a loja usa hoje)
   - Botão **"Começar 15 dias grátis"** → `/cadastro/<slug>`
   - Botão secundário **"Já quero assinar"** → link Cakto do plano
8. **Garantia + Grupo VIP no WhatsApp** — selo de 15 dias grátis sem cartão + convite pro grupo depois da assinatura.
9. **Depoimentos** — 3-6 cards (com placeholders "seu depoimento aqui" se você ainda não me mandar depoimentos reais — eu deixo pronto pra você preencher no admin depois).
10. **FAQ** — 6 perguntas em accordion (como funciona o grátis, cancelar, offline, WhatsApp, nota fiscal, dispositivos).
11. **CTA final** — bloco grande verde escuro com dourado: "Escolha seu plano e comece hoje" + os 4 botões dos planos de novo.
12. **Rodapé enxuto** — logo, contato, links legais.

## Como as informações são puxadas

- **Preço, link Cakto e slug de cada plano** → mesma fonte que `/planos/$slug` já usa (`fetchSubscriptionPlans` de `src/lib/access.ts`). Nada de valor "chumbado" no código — se você trocar o preço no admin, muda aqui automaticamente.
- **Nome, cor e emoji de cada app** → `fetchAppBySlug` (mesma coisa que a loja atual).
- **Textos editáveis** (título do hero, subtítulos, bullets, FAQ, depoimentos) → armazenados como `app_texts` com prefixo `vendas.*`, editáveis no painel admin em **Textos**, do mesmo jeito que os textos de `/planos/$slug` já funcionam hoje. Você muda a copy sem me chamar.
- **Depoimentos** → também via `app_texts` (`vendas.depoimento1_nome`, `vendas.depoimento1_texto`...), pra você preencher quando tiver os reais.

## Design

- Fundo claro com os mesmos radial gradients suaves de fundo que o app já usa.
- Blocos em **glass cards** (mesmo estilo do resto: `bg-white/70 backdrop-blur border border-white/60 rounded-3xl shadow-sm`).
- Títulos na fonte **Manrope** (já é a `font-display` do projeto), corpo em **Inter**.
- Cor forte dos CTAs: **verde escuro** (`--primary` do projeto) com texto branco.
- Selos, preços e detalhes premium: **dourado** (`--gold` do projeto).
- Tudo responsivo (mobile-first, já que o tráfego é do Instagram).
- Micro animações discretas (fade-in no scroll, hover leve nos cards). Nada de neon, nada de piscando.

## O que NÃO vou fazer

- Não mexo em `/`, `/loja`, `/planos/$slug`, `/cadastro/$slug` — todas continuam iguais.
- Não crio banco novo, não crio migration, não gasto crédito de Cloud (a página só lê o que já existe).
- Não invento depoimentos falsos — deixo placeholders identificáveis pra você trocar.
- Não coloco countdown de escassez falso. Se um dia você quiser um countdown real (ex: fim de promoção de verdade), me pede depois e eu adiciono.

## Detalhes técnicos (pode pular)

- Arquivo novo: `src/routes/vendas.tsx` com `createFileRoute("/vendas")`, `head()` com SEO próprio (title, description, og:*, twitter:card) e `component: VendasPage`.
- Reaproveita `AppShell` com `publicRoute` e `hideReferences` (mesmo padrão de `/planos/$slug`).
- Usa `useQuery` com as mesmas queryKeys já existentes (`subscription_plans`, `mini_apps`, `app_texts`) — cache compartilhado, sem requests duplicados se a pessoa navegar pra loja depois.
- Se a pessoa já estiver logada e assinante de algum plano, o botão daquele plano vira "✓ Acessar meus mini apps" apontando pra `/trilha/$slug` (mesma lógica que a loja já usa hoje).
- Zero dependência nova. Zero mudança em `package.json`.

## Depois que estiver pronto

Você pega o link `https://academiadaenfermagem.com.br/vendas` e usa nos anúncios do Instagram/Meta Ads. Se quiser variantes A/B depois (ex: `/vendas-tecnico` só focado no Técnico), eu duplico rapidinho a partir dessa base.

Se aprovar, eu implemento na sequência.
