# Mini apps com sub-tópicos

Permite que um mini app (ex.: "Processo de Enfermagem") tenha várias sub-páginas internas (Histórico, Diagnóstico, Planejamento, Implementação, Avaliação, Prescrição SAE/NANDA/NOC/NIC) — cada uma com conteúdo próprio editável, mas todas agrupadas sob 1 só card na trilha.

## O que muda para o aluno

- Na trilha aparece **1 card único**: "Processo de Enfermagem".
- Ao abrir, vê um **menu lateral / cabeçalho** com a lista de sub-tópicos.
- Clica em cada sub-tópico → carrega o conteúdo daquela etapa (HTML/markdown/vídeo/áudio).
- Botões **"Anterior / Próximo"** no rodapé para navegar em sequência.
- URL fica `/app/processo-enfermagem/diagnostico`, `/app/processo-enfermagem/prescricao`, etc. (compartilhável).

## O que muda para você no Admin

- Ao editar "Processo de Enfermagem", aparece uma nova seção **"Sub-tópicos"** abaixo dos campos atuais.
- Botão **"+ Adicionar sub-tópico"** abre um editor com: Título, Slug (auto), Ordem, Ícone (opcional) e o mesmo editor rico de HTML/markdown + campos de vídeo/áudio que já existe.
- Lista dos sub-tópicos com arrastar para reordenar, botões editar / excluir.
- Pode marcar um sub-tópico como "rascunho" (não aparece para o aluno).

## Conteúdo extenso — limites

- `content_md` é `TEXT` no Postgres: aguenta **centenas de páginas** sem problema.
- Recomendação prática: **até ~30 mil palavras por sub-tópico** (acima disso, divida em 2 sub-tópicos). Não é limite técnico, é só ergonomia de leitura.

## Detalhes técnicos

### Banco
Nova tabela `mini_app_subtopics`:
- `id`, `mini_app_id` (FK → mini_apps), `slug`, `title`, `ordem` (int), `icon` (opcional)
- `content_md`, `video_url`, `audio_url` (mesmos campos do mini app)
- `is_draft` (bool, default false)
- `created_at`, `updated_at`
- Unique constraint em `(mini_app_id, slug)`
- GRANTs: `authenticated SELECT` (acesso checado pela rota via `has_app_access` do mini app pai), `service_role ALL`
- RLS: SELECT público para `is_draft=false`; INSERT/UPDATE/DELETE só admin

### Rotas
- Nova rota dinâmica `src/routes/app.$slug.$subtopic.tsx`
- A rota existente `src/routes/app.$slug.tsx` passa a:
  - Se o mini app tem sub-tópicos → mostra menu deles + redireciona para o primeiro
  - Se não tem → mantém o comportamento atual (renderiza `content_md` direto)

### Componentes
- `<SubtopicNav>` — menu lateral em desktop, accordion no mobile
- `<SubtopicPager>` — botões anterior/próximo no rodapé
- `<SubtopicsAdmin>` — CRUD no painel admin (usado dentro do editor do mini app)

### Migração de dados
- Mini apps existentes (sem sub-tópicos) continuam funcionando exatamente como hoje.
- Você só cria sub-tópicos onde quiser dividir conteúdo.

## Escopo desta entrega

1. Migration: tabela `mini_app_subtopics` + GRANTs + RLS.
2. Admin: seção de sub-tópicos no editor de mini app (criar/editar/reordenar/excluir).
3. Rota `/app/$slug` adaptada (detecta se tem sub-tópicos).
4. Rota `/app/$slug/$subtopic` nova (com menu, conteúdo, pager).
5. Proteção: paywall (`AppAccessGate`) continua no mini app pai; admin tem acesso pleno.

## Fora do escopo (posso fazer depois se quiser)

- Busca textual dentro dos sub-tópicos do mini app.
- Marcação de "concluído" por sub-tópico (progresso do aluno).
- Sub-sub-tópicos (estrutura em 3 níveis).
