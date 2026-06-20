
# Reorganização das Trilhas + Trial + Avisos + Gestão de Usuários

Plano final (1B, 2A, 3A + email no cadastro + **admin gerencia usuários**).

## 1. Reposicionar trilhas + cores novas

Nova ordem da home:
```
[Header] → [Banner verde escuro] → [3 cards das trilhas] → [Conteúdo grátis] → [Demais mini apps]
```

Cores (tokens em `src/styles.css`):
- **Acadêmico:** amarelo ouro claro (fundo `#FDE68A`, texto `#92400E`)
- **Enfermeiro:** verde claro (fundo `#BBF7D0`, texto `#14532D`)
- **Técnico:** azul bebê (fundo `#BFDBFE`, texto `#1E3A8A`)

Badges dos mini apps usam os mesmos tokens.

## 2. Conserto do DE/POR

Inverter exibição: riscado é o maior (DE), em destaque o menor (POR). Novos campos `price_original` e `price_promo` em `subscription_plans`.

## 3. Preços reais (admin)

| Trilha | Novo | Migrando |
|---|---|---|
| Acadêmico | R$ 24,99/mês | DE R$ 39,99 POR R$ 33,99 |
| Enfermeiro | R$ 39,99/mês | — |
| Técnico | R$ 16,99/mês | R$ 19,99 (técnico→Acadêmico) |

Novos campos: `price_novo`, `price_original_migracao`, `price_promo_migracao`, `cakto_link_novo`, `cakto_link_migracao`.

**Migração automática (2A):** se o usuário logado já tem assinatura ativa em outra trilha, o card da nova trilha mostra preço promocional + link Cakto de migração.

## 4. Cadastro com mais campos

Tela `/auth` (sign-up):
- Nome completo *
- Email * (para certificado)
- Celular com máscara BR *
- Categoria: Acadêmico / Técnico / Enfermeiro *
- Senha

Validação Zod (cliente + servidor). Salva em `profiles` (novos `phone TEXT`, `categoria TEXT`).

## 5. Trial de 30 dias só na trilha da categoria (1B)

Trigger `handle_new_user` insere 1 linha em `user_subscriptions` com `plan_slug = categoria`, `status = 'trial'`, `expires_at = now() + 30 days`. Função `has_app_access` aceita `status IN ('active','trial')`. Sem cartão.

## 6. Avisos pulsantes (3A)

`<TrialCountdownBanner />` no topo de `_authenticated/`:
- **D-5/D-4:** banner azul — "⏳ Sua gratuidade está terminando"
- **D-3/D-2:** banner laranja — "⚠️ ÚLTIMOS DIAS — Vagas limitadas"
- **D-1:** banner vermelho o dia todo — "🚨 HOJE é o último dia!"
- **Expirou:** acesso bloqueado, redireciona pra card de assinatura

Textos exatos passados, interpola `[NOME]`. Botão fechar some até refresh, volta depois. Botão abre `cakto_link_novo` da trilha da categoria.

## 7. **NOVO** — Admin gerencia usuários

Nova aba no admin: **"Usuários"**.

**Listagem:**
- Tabela com nome, email, celular, categoria, status do trial/assinatura, data de cadastro, expira em
- Busca por nome/email
- Filtros: por categoria, por status (trial / ativo / expirado)

**Ações do admin:**
- **Criar usuário** (formulário com mesmos campos do cadastro público, senha temporária definida pelo admin; usuário recebe email/credenciais; já entra com trial ativo)
- **Editar perfil** (nome, email, celular, categoria)
- **Conceder/revogar assinatura** manualmente (escolhe trilha + dias de validade) — já tem na aba Assinaturas, fica linkado aqui também
- **Estender trial** (botão "+30 dias", "+60 dias", custom)
- **Resetar senha** (envia link)
- **Excluir usuário** (modal de confirmação digitando o email; remove de `auth.users` em cascata → some profile, subscriptions, etc.)

**Como funciona tecnicamente:**
- Server functions `createServerFn` + `requireSupabaseAuth` + verifica `has_role(uid, 'admin')`
- Usa `supabaseAdmin.auth.admin.createUser()`, `.updateUserById()`, `.deleteUser()`, `.generateLink()`
- Tudo carregado dentro do handler (nunca top-level) por segurança

**Proteções:**
- Admin não consegue excluir a si mesmo
- Confirmação dupla na exclusão (digita email pra confirmar)
- Auditoria mínima: log em `admin_actions` (quem fez o quê, quando)

## 8. Banco de dados (1 migração)

```sql
-- profiles
ALTER TABLE profiles 
  ADD COLUMN phone TEXT,
  ADD COLUMN categoria TEXT CHECK (categoria IN ('academico','tecnico','enfermeiro'));

-- subscription_plans
ALTER TABLE subscription_plans 
  ADD COLUMN price_novo NUMERIC,
  ADD COLUMN price_original_migracao NUMERIC,
  ADD COLUMN price_promo_migracao NUMERIC,
  ADD COLUMN cakto_link_novo TEXT,
  ADD COLUMN cakto_link_migracao TEXT;

-- user_subscriptions: aceitar status 'trial'
-- has_app_access: ampliar pra trial
-- handle_new_user: criar trial de 30 dias na trilha da categoria

-- nova tabela admin_actions (auditoria)
CREATE TABLE admin_actions (
  id UUID PK,
  admin_id UUID REF auth.users,
  action TEXT, -- 'create_user'|'delete_user'|'edit_profile'|'grant_subscription'|...
  target_user_id UUID,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);
-- RLS: só admin lê/escreve

-- seed dos preços reais
```

## 9. Classificação dos mini apps por trilha

| Mini app | Acad | Téc | Enf |
|---|:-:|:-:|:-:|
| SBV / Sinais vitais / SV gestante / SV pediátrico / Cálculo / Exame físico / Quizzes / Postura ética / Segurança / Saúde mental | ✅ | ✅ | ✅ |
| Manual sobrevivência | ✅ | ✅ | — |
| Relatório ABNT | ✅ | — | — |
| UTI / Farmacologia avançada / ACLS | — | — | ✅ |
| IRAS / Procedimentos / Simulações reais / Curativos | — | ✅ | ✅ |

Mini apps GRÁTIS ficam fora das trilhas até serem desmarcados.

## O que NÃO muda

Markdown dos mini apps, banner verde escuro, login social, paywall individual, conteúdo dos mini apps.

## Avisos

- **Links Cakto:** começam vazios; cole no admin → Assinaturas
- **"100 vagas":** texto fixo no aviso D-3 (sem contador real)
- **Pós-expiração:** vê a loja com paywall; conta e dados preservados
- **Excluir usuário:** apaga em cascata (subscriptions, perfil, histórico)

Pode aprovar que eu implemento tudo numa entrega só.
