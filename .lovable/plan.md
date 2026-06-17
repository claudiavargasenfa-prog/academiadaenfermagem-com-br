# Loja como tela inicial do app

## Objetivo

Quando o cliente abrir o app, ele cai direto na **Loja**. Todos os mini apps aparecem como cards de produto, o 1º é o gratis, o demos com preço e botão de compra/assinatura. Quem já tem acesso vê "Acessar". O antigo "dashboard com atalhos" deixa de ser a home.

## Mudanças  
BANNER NO TOPO DA LOJA, TIPO CARROCEL COM 5 SLIDES FAZENDO PROMOÇÃO INCLUINDO O CONTEUDO GRATIS.  
  
alteranome do app para: ACADEMIA DE ENFERMAGEM

### 1. Nova home `/` = Loja

- Reescrever `src/routes/index.tsx` para ser a vitrine.
- Cabeçalho: logo + frase "Conhecimento que cabe no bolso do jaleco" + cartão de "Identificação do estágio" (campo, preceptor, período) preservado em destaque menor.
- Banner do **App Básico (Assinatura mensal)** no topo:
  - Mostra preço, o que está incluso (Postura e Ética, Diário de Bordo, Sinais Vitais).
  - Botão **Assinar** (abre checkout Cakto) ou **Renovar** quando expirando, ou selo "Assinatura ativa até dd/mm" quando ativa.
- Grade de **Mini apps extras** (IRAS, Segurança do Paciente, Exame Físico e Escalas, Cálculos, SSVV Pediátrico, SSVV Gestante, Relatório ABNT):
  - Cada card mostra: ícone, nome, descrição curta, preço (R$ CORTADO E OUTRO R$ COM DESCONTO), status.
  - **Bloqueado** → botão "Comprar" (abre Cakto). Cadeado visível.
  - **Liberado** → botão "Acessar" (abre o mini app) + validade "Acesso até dd/mm".
  - Se o App Básico TERÁ O NOME  (Manual de Sobrevivência: Postura, Ética e Segurança), não estiver ativo, mostrar nota: "Requer Assinatura Básica ativa".
- Rodapé curto: link para "Minha conta" e "Admin" (quando admin).

### 2. Página `/loja` antiga

- Remover ou transformar em redirect para `/`, já que a home agora é a própria loja. Decisão: **redirect 301-ish via router** (`/loja` → `/`) para não quebrar links existentes.

### 3. Cabeçalho/menu (`AppShell`)

- Substituir o link "Início" por "Loja" no menu, apontando para `/`.
- Remover o link separado para "Loja" para não duplicar.

### 4. Diário/identificação

- Manter o cartão "Identificação do estágio" como bloco compacto no topo da Loja (somente leitura + link "Editar no Diário"), preservando o que já existia.

### 5. Sem mudanças em banco

- Tabelas `mini_apps`, `subscriptions`, `user_app_access` já existem e suportam o modelo. O webhook Cakto e o painel `/admin` continuam iguais.
- Lembrete pós-implementação: cadastrar as **URLs de checkout Cakto** de cada mini app em `/admin` para os botões "Comprar/Assinar" funcionarem.

## Arquivos afetados

- `src/routes/index.tsx` — reescrita completa (vira a Loja).
- `src/routes/loja.tsx` — vira redirect para `/`.
- `src/components/AppShell.tsx` — ajuste do menu (Início → Loja, remove duplicata).

## Fora de escopo

- Mudanças no conteúdo interno dos mini apps.
- Mudanças no fluxo do webhook Cakto e no `/admin`.
- Mudanças visuais de marca (cores, fontes) — segue o tema atual (dourado + primário).