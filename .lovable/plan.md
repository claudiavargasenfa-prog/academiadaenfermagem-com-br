## Auditoria — por que o botão "volta pra loja"

Reproduzi o cenário e o replay confirma: você está **logada** no app. Quando clica em "Começar meus 15 dias grátis" na landing `/planos/tecnico`, o botão faz um `<a href="/?cadastro=tecnico">` — uma navegação de página inteira (por isso demora 7–9s: recarrega bundle + service worker).

Quando a página `/` termina de carregar, o `AuthGate` vê que já existe sessão e **não abre o formulário de cadastro** — mostra direto a loja. O parâmetro `?cadastro=tecnico` só é lido dentro do formulário de login, então para usuário logado ele é ignorado. Resultado percebido: "voltou pra loja".

Não é bug do fingerprint nem do backend — é fluxo: usuário logado não deveria ver "15 dias grátis" de outro app; deveria ver "Assinar agora" (checkout) ou "Você já tem acesso".

## O que vou fazer

### 1. `src/routes/planos.$slug.tsx` — CTA sensível ao estado de login
- Ler a sessão atual (`supabase.auth.getSession`) via hook simples.
- **Não logado** → botão principal continua "Começar meus {15} dias grátis" e vai para `/?cadastro=<slug>` (comportamento atual, correto para visitante).
- **Logado, sem essa assinatura** → botão principal vira **"Assinar agora"** apontando para o `checkoutUrl` do plano (Cakto), e mostra abaixo um aviso pequeno: *"Você já está logada como <email>. O período grátis é só para novos cadastros — para liberar este app, faça a assinatura."* Com um link secundário "Sair da conta" (usa `signOut()` do `AuthGate`) caso queira criar outro cadastro.
- **Logado, com assinatura ativa deste plano** → já funciona hoje ("Acessar meus mini apps").
- Aplicar a mesma lógica no CTA final (rodapé).

### 2. Cor dos botões "Assinar agora" / "Começar meus 15 dias grátis"
- Trocar `bg-foreground text-background` (preto/branco atual) por `bg-primary text-primary-foreground` (verde escuro do tema com letra branca) — tanto no banner do hero quanto no CTA final, nos 4 planos (academico, tecnico, tecnico-estudante, enfermeiro). Como a landing é uma única rota parametrizada, uma alteração cobre todos.
- Manter hover suave (`hover:opacity-90`) e sombra atual.

### 3. Pequeno ganho de velocidade
- Manter `<a href>` apenas na transição visitante→cadastro (precisa recarregar para o AuthGate rodar). Para usuário logado, usar `<a href={checkoutUrl} target="_blank">` (checkout externo, comportamento certo) — sem full-reload interno inútil.

## Fora do escopo
- Não vou mexer no fluxo antifraude, no fingerprint, no schema do banco, nem no visual do resto da landing (banner, promo, FAQ, mini apps).
- Não vou mudar a categoria de cadastro nem regras de trial.

## Como validar
Depois de aplicar:
1. Aba anônima → abrir `/planos/tecnico` → botão verde "Começar meus 15 dias grátis" → abre cadastro com "Técnico" pré-selecionado.
2. Logada como você → abrir `/planos/tecnico` → botão verde "Assinar agora" abre o checkout Cakto; aparece aviso + link "Sair da conta".
3. Logada com plano ativo → botão "Acessar meus mini apps" (inalterado).
