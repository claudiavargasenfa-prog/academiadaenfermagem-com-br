
# Academia de Enfermagem — 3 trilhas na mesma loja

A loja continua sendo UMA só (mesmo domínio, login e admin), chamada **Academia de Enfermagem**, dividida em três trilhas:

- **Academia do Acadêmico** — estudantes de graduação
- **Academia do Técnico** — técnicos de enfermagem
- **Academia do Enfermeiro** — enfermeiros formados

Cada mini app pode pertencer a uma, duas ou às três trilhas (ex.: SBV serve nas três). O aluno assina **mensalmente** a trilha que quiser e libera **tudo** dela. Pode assinar mais de uma. A venda avulsa por mini app que já existe continua funcionando em paralelo.

## O que muda na loja (home)

- Hero passa a mostrar o nome "Academia de Enfermagem" com 3 cartões grandes de trilha (Acadêmico / Técnico / Enfermeiro), cada um com preço mensal e botão "Assinar na Cakto"
- Abaixo, abas/filtro: **Todos | Acadêmico | Técnico | Enfermeiro**
- Cada card de mini app exibe selinho(s) da(s) trilha(s) a que pertence (🎓 / 🩺 / 👩‍⚕️)
- Grade filtra pela trilha selecionada

## O que muda no acesso

Hoje o acesso é por mini app (`user_app_access`). Adiciono acesso por **trilha**:

- Assinatura ativa de uma trilha → libera todos os mini apps marcados naquela trilha
- Assinatura vencida → bloqueia automaticamente
- Compra avulsa de mini app continua valendo em paralelo
- Admin enxerga tudo (já é assim)

## O que muda no Admin

No formulário de cada mini app, três checkboxes:
- [ ] Disponível na trilha Acadêmico
- [ ] Disponível na trilha Técnico
- [ ] Disponível na trilha Enfermeiro

Nova aba **"Assinaturas"** no admin:
- CRUD dos 3 planos (nome, descrição, preço mensal, link Cakto, ativo)
- Liberar/revogar assinatura manualmente para um aluno (igual já existe para mini app avulso), com data de expiração

## Defaults iniciais (você ajusta no admin antes de publicar)

- **Preços placeholder**: Acadêmico R$ 29/mês · Técnico R$ 39/mês · Enfermeiro R$ 49/mês
- **Classificação inicial dos mini apps** (1 clique para reclassificar):
  - **Acadêmico**: SBV, sinais vitais, SV gestante, SV pediátrico, cálculo, exame físico e escalas, quizzes, postura ética, manual de sobrevivência, relatório ABNT, segurança, saúde mental
  - **Técnico**: SBV, sinais vitais, SV gestante, SV pediátrico, cálculo, procedimentos de enfermagem, curativos, segurança, IRAS, postura ética, manual de sobrevivência
  - **Enfermeiro**: UTI, IRAS, farmacologia avançada, procedimentos de enfermagem, ACLS, simulações reais, curativos, SBV, exame físico e escalas, saúde mental

## Detalhes técnicos

1. **Migração no banco** (uma única migração, com GRANTs):
   - `mini_apps`: adicionar `track_academico bool default false`, `track_tecnico bool default false`, `track_enfermeiro bool default false`
   - Nova tabela `subscription_plans` (slug `academico`/`tecnico`/`enfermeiro`, nome, descrição, preço, link Cakto, ativo)
   - Nova tabela `user_subscriptions` (user_id, plan_slug, started_at, expires_at, status) — RLS por `auth.uid()` + admin via `has_role`
   - Atualizar `has_app_access(_user_id, _mini_app_id)`: retorna true se gratuito OR já tinha acesso avulso OR existe assinatura ativa cuja trilha corresponde a alguma trilha marcada no mini app
   - Seed dos 3 planos com os preços placeholder
2. **Frontend (loja)**:
   - 3 cards de trilha no topo do `index.tsx` com botão Cakto
   - Filtro de trilha na grade + selinhos nos cards
3. **Admin**:
   - 3 checkboxes de trilha no editor de mini app
   - Nova aba "Assinaturas" para CRUD de planos e liberação manual
4. **Paywall**: `AppAccessGate` não muda — a função SQL já cobre o novo caso.

## O que NÃO vou mexer

- Conteúdo markdown, layouts dos mini apps individuais, hero atual além dos cards de trilha
- Venda avulsa por mini app (segue em paralelo)
- Login, perfis, papéis admin/aluno

## Como testar depois

1. Admin → marca trilhas em cada mini app
2. Admin → Assinaturas → ajusta preços e cola os 3 links Cakto
3. Loja → alterna entre Todos/Acadêmico/Técnico/Enfermeiro
4. Aluno sem assinatura → mini apps pagos bloqueados
5. Admin libera assinatura "Técnico" manualmente → todos os mini apps da trilha Técnico abrem para o aluno
