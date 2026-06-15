# Plano: Loja Premium de Mini Apps + Integração Cakto

## O que vamos construir

Uma **loja premium** dentro do seu app (Acadêmico de Bolso), onde o aluno vê todos os mini apps. Os que ele não comprou ficam com cadeado 🔒. Assim que paga na Cakto, desbloqueia automaticamente.

## Como vai funcionar pro aluno

1. Aluno cria conta (email+senha ou Google)
2. Vê a **Loja** com todos os mini apps
3. Assina o **App Básico — R$19,90/mês** (recorrente) → checkout Cakto → desbloqueia
4. Quer um extra? Paga **uma vez** (R$7,90 a R$14,99) → libera por **3 meses corridos** → depois bloqueia
5. Pra continuar usando o extra, compra de novo (renova mais 3 meses)
6. Se cancelar o básico → tudo bloqueia (extras também, mesmo dentro dos 3 meses — você confirma essa regra)

## Regras de cobrança que você definiu

- **App básico:** R$19,90/mês recorrente (Cakto cobra todo mês no cartão)
- **Mini apps extras:** pagamento **único** entre R$7,90 e R$14,99, libera **3 meses** de acesso. Depois bloqueia até comprar de novo.
- **Plano Lovable:** Free (R$0 fixo)

## O que será criado no app

### 1. Login e cadastro
- Email+senha e Google
- Tela "Minha conta" mostrando assinatura ativa e prazo de cada extra (ex: "Calculadora Avançada — expira em 47 dias")

### 2. Loja Premium
- Grid visual com todos os mini apps (estilo Igor Storm)
- Cada card: ícone, nome, preço, botão "Assinar"/"Comprar"/"Acessar"
- Apps bloqueados com cadeado → botão leva pro checkout Cakto
- Apps com prazo expirando mostram aviso ("faltam 5 dias")

### 3. Painel admin (só você)
- Cadastra cada mini app: nome, descrição, preço, link checkout Cakto, conteúdo (texto/vídeo/áudio)
- Adiciona apps novos sozinha, sem me chamar

### 4. Sistema de desbloqueio automático (webhook Cakto)
- Recebe avisos da Cakto (pagamento aprovado, cancelado, recusado)
- **Básico:** libera enquanto assinatura ativa, bloqueia se cancelar
- **Extra:** marca data de expiração = data do pagamento + 90 dias
- Validação de segurança (só aceita aviso real da Cakto)

### 5. Conteúdo dos mini apps
- Suporta texto, vídeo (YouTube/Vimeo) e áudio
- Você edita pelo painel admin

## O que VOCÊ faz na Cakto (eu te oriento passo a passo)

1. Cria conta Cakto (grátis)
2. Cria 1 produto recorrente: "App Básico — R$19,90/mês"
3. Cria 1 produto pagamento único pra cada mini app extra (vamos cadastrando aos poucos)
4. Configura o webhook apontando pro endereço que vou te passar
5. Copia o "segredo do webhook" e me manda

## Custos pra você

- **Lovable:** R$0/mês (Free)
- **Cakto:** R$0 fixo, só taxa por venda (~3,99% + R$0,40 cartão; Pix mais barato)
- **Lovable Cloud:** R$0 dentro do uso grátis
- **Total fixo agora:** R$0. Só paga quando vender.

## Limitação do plano Free

- Endereço fica `seuapp.lovable.app` (sem domínio próprio)
- Rodapé "Edit with Lovable" no canto
- Quando vender bem, migra pro Pro (R$130/mês) e tira as duas coisas

## Ordem de construção

**Etapa 1 — Base do app (eu faço primeiro):**
- Login/cadastro, estrutura do banco, loja vazia, painel admin

**Etapa 2 — Você cria conta Cakto + 1º produto (eu oriento)**

**Etapa 3 — Conexão Cakto (webhook + teste de compra)**

**Etapa 4 — Cadastrar app básico real + 1 extra**

**Etapa 5 — Publicar e começar a vender**

## Detalhes técnicos (pode pular)

- Stack atual: TanStack Start + React + Tailwind + Lovable Cloud (Supabase)
- Tabelas novas: `profiles`, `mini_apps`, `subscriptions` (básico, status), `user_app_access` (extras com `expires_at`), `user_roles`
- Webhook: rota pública `/api/public/cakto-webhook` com verificação HMAC
- Admin protegido por role na tabela `user_roles`

---

**Posso começar pela Etapa 1?**