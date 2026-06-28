
# Apps dinâmicos, seções arrastáveis e novo app "Estudante de Técnico"

Você passa a ter controle total no Admin: criar/renomear/excluir apps (atuais trilhas), criar seções dentro de cada app e arrastar mini apps para dentro delas. **Nenhum conteúdo existente é perdido** — os mini apps atuais e seus sub-tópicos continuam intactos.

## O que muda para o aluno

- A loja passa a listar os apps lidos do banco (4 apps após esta entrega: Acadêmico, Estudante de Técnico, Técnico, Enfermeiro). Cores e emojis vêm do banco.
- Dentro do app, os mini apps aparecem agrupados por **seção** com cabeçalho (ex.: "SAE — Sistematização da Assistência", "Saúde do Adulto"). Mini apps sem seção ficam no bloco "Geral" no topo.
- Cada seção mostra os mini apps na ordem que você definiu, com os grátis primeiro.

## O que muda no Admin

Nova aba **"Apps"** (antes "trilhas eram fixas no código"):
- Lista os apps. Botão "+ Novo app" abre formulário: nome, slug, emoji, cor de fundo, cor de texto, descrição, plano (preço/checkout Cakto), ordem, ativo/oculto.
- Botão "Editar" / "Excluir" (excluir só permitido se não houver mini apps dentro).

Dentro de cada app, seção **"Seções e mini apps"**:
- Botão "+ Nova seção": título, emoji opcional, ordem.
- Lista das seções com drag-and-drop para reordenar.
- Dentro de cada seção, lista dos mini apps daquele app — também arrastáveis para reordenar e para mover entre seções.
- Bloco lateral "Mini apps sem seção neste app" e "Outros mini apps" (de onde você arrasta para incluir aqui).
- Um mini app pode estar em **vários apps** (continua como hoje) e em **uma seção por app**.

A aba "Mini apps" atual continua existindo para editar o conteúdo de cada mini app (markdown, vídeo, sub-tópicos, badges).

## Novo app: Estudante de Técnico em Enfermagem

- Criado como 4º app, separado do "Técnico" atual (que continua para técnicos formados).
- Emoji/cor: azul mais claro para diferenciar do atual Técnico (você ajusta no Admin depois).
- Inicialmente sem mini apps — você decide o que arrastar para dentro pelo Admin.
- Trial de 30 dias passa a valer para qualquer app, lendo do banco (não mais só dos 3 fixos).

## Organização do app Acadêmico conforme o DOCX

Crio as **seções** abaixo no app Acadêmico e movo os mini apps existentes (sem renomear, sem perder conteúdo nem sub-tópicos) para dentro delas:

1. **Manual de Sobrevivência do Estágio**
2. **Postura e Ética Profissional**
3. **Segurança do Paciente**
4. **Promoção da Saúde e Síndromes**
5. **IRAS**
6. **Farmacologia Clínica e Calculadoras**
7. **Acadêmico em Clínica Médica**
8. **Saúde do Idoso** — contém "Sinais Vitais no Idoso"
9. **Saúde do Adulto** — contém "Sinais Vitais no Adulto"
10. **Saúde Mental**
11. **Obstetrícia** — contém "Sinais Vitais da Gestante"
12. **Neonatologia e Pediatria** — contém "Sinais Vitais em Neo/Pediatria"
13. **SAE — Sistematização** — contém: 4 pilares, Processo descomplicado, Exame Físico/Escalas, Diagnósticos focados em problemas, Diagnósticos de risco, 50 NANDA+NOC+NIC, Gerador de Prescrição, Relatório ABNT, Curativos e Lesões.
14. **Quizzes de Enfermagem**

Antes de mover, mostro a você a lista do que vai para cada seção; mini apps que eu não encontrar com certeza vão para "Geral" e você ajusta.

**Técnico** e **Enfermeiro**: não replico cego (você disse que têm conteúdo diferente). Crio seções iniciais óbvias pelo nome dos mini apps existentes (ex.: SAE, Clínicas, Saúde da Mulher/Homem/Idoso, UTI/Centro Cirúrgico, etc.) e você reorganiza arrastando — ou me manda os DOCX desses dois e eu replico o mesmo cuidado do Acadêmico.

## Detalhes técnicos

### Banco

- Nova tabela `apps` (id, slug, name, emoji, bg_color, fg_color, description, ordem, is_active, created_at, updated_at) com GRANTs (`anon SELECT`, `authenticated SELECT`, `service_role ALL`), RLS, e policies de leitura pública + escrita só admin.
- Nova tabela `app_sections` (id, app_id FK→apps, title, emoji, ordem, is_active) idem.
- Nova tabela `mini_app_placements` (mini_app_id FK→mini_apps, app_id FK→apps, section_id FK→app_sections null, ordem) com unique(mini_app_id, app_id). Substitui as 3 colunas booleanas.
- Migração: cria 4 linhas em `apps` (academico, tecnico-estudante, tecnico, enfermeiro), gera `mini_app_placements` a partir das colunas `track_*` atuais para os 3 apps já existentes (sem section_id), e **mantém** as colunas `track_*` por enquanto como fallback para não quebrar nada se a migração de código falhar. Removo as colunas em uma migração posterior, depois que o app dinâmico estiver estável.
- `subscription_plans`: já usa `slug`. Crio o plano `tecnico-estudante` com preço a definir (você ajusta).
- `has_app_access`: atualizo para ler `mini_app_placements` + `user_subscriptions.plan_slug = apps.slug`, mantendo o bypass de admin e os apps grátis.

### Código

- `src/lib/access.ts`: `TRACKS` deixa de ser constante hardcoded; vira hook/fetch de `apps` ativo.
- `src/routes/index.tsx`: cards dos apps lidos do banco.
- `src/routes/trilha.$slug.tsx`: renderiza seções (`app_sections`) com mini apps via `mini_app_placements`. URL `/trilha/...` continua válida (a rota de aplicativo).
- Novo `src/components/admin/AppsAdmin.tsx`: CRUD de apps, seções, e DnD usando `@dnd-kit/sortable` (já compatível com React 19) para reordenar/mover entre seções.
- `src/routes/admin.tsx`: nova aba "Apps".
- Cadastro do aluno: o select de categoria passa a listar apps ativos do banco.

### Segurança e dados

- Toda nova tabela em `public` recebe GRANTs explícitos no mesmo migration (anon SELECT só onde precisa, authenticated SELECT, service_role ALL) + RLS + policies.
- Nenhuma exclusão ou rename de mini app existente. Backup lógico: as colunas `track_*` ficam preservadas durante esta entrega.

## Fora do escopo desta entrega

- Re-arquitetura do `TrialCountdownBanner` (continua funcionando, lendo `user_subscriptions`).
- Remover as colunas `track_*` do `mini_apps` (faço em uma 2ª migração depois de tudo validado).
- Replicar conteúdo do Acadêmico no Técnico/Enfermeiro — você prefere reorganizar manualmente ou me mandar os DOCX.
