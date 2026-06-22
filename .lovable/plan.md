## Objetivo

Trocar **"Academia de Enfermagem"** → **"Academia da Enfermagem"** em todos os lugares do app (títulos de página, cabeçalho, telas de login, rodapés, textos do banco e marca d'água).

## O que será alterado

**Cabeçalho / Login / Splash**
- `src/components/AppShell.tsx` (logo alt + nome no topo)
- `src/components/AuthGate.tsx` (tela de login)
- `src/routes/reset-password.tsx` (tela de redefinir senha)
- `src/components/ContentProtection.tsx` (marca d'água de proteção)

**Loja / Admin / Minha Conta**
- `src/routes/index.tsx` (título da Loja, meta description, texto `home.title`, alt da logo)
- `src/routes/admin.tsx` (título da página Admin)
- `src/routes/minha-conta.tsx`
- `src/routes/confianca.tsx` (todas as menções no corpo do texto e metadados)

**Títulos (meta) dos mini apps**
Todos os arquivos abaixo terão o sufixo do `<title>` corrigido:
- `iras.tsx`, `acls.tsx`, `sbv.tsx`, `uti.tsx`, `sv-pediatrico.tsx`, `sv-gestante.tsx`, `simulacoes-reais.tsx`, `seguranca.tsx`, `farmacologia-avancada.tsx`, `exame-fisico-escalas.tsx`, `curativos.tsx`, `quizzes.tsx`, `quizzes.$slug.tsx`, `relatorio-abnt.tsx`, `postura-etica.tsx`, `procedimentos-enfermagem.tsx`, `manual-sobrevivencia.tsx`, `saude-mental.tsx`, `trilha.$slug.tsx`

**Banco de dados (texto editável)**
- Nova migração que atualiza o valor da chave `home.title` em `app_texts` de "Academia de Enfermagem" para "Academia da Enfermagem" (sem perder o que estiver salvo se já estiver diferente — só substitui se ainda for o valor antigo).

## Observação
Após isso, qualquer texto que use `useText("home.title", ...)` vai mostrar "Academia da Enfermagem" automaticamente, e a aba **Textos** do Admin continua permitindo editar livremente.
