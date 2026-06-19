## Diagnóstico

**Bug 1 — Admin desconectado do app:** o formulário salva `content_md`, `video_url`, `audio_url` na tabela `mini_apps`, mas nenhuma rota de mini app lê esses campos. Resultado: você edita e nada aparece, e não consegue reler o que salvou.

**Bug 2 — Mini apps vazios:** ~8 mini apps são apenas casca (título + 1 parágrafo). Sem conteúdo, o cliente que comprar não recebe valor — modelo de monetização inviável.

**Bug 3 — Sem controle de acesso real no conteúdo:** mesmo onde há `has_app_access` no banco, o conteúdo do mini app está hardcoded e visível para qualquer um que abra a URL.

---

## O que vai ser feito (uma execução, sem idas e voltas)

### 1. Ligar o Admin ao app (corrige Bug 1)
Crio um componente único `<MiniAppContent slug="..." />` que:
- Busca do banco: `content_md`, `video_url`, `audio_url` do mini app.
- Renderiza markdown (títulos, listas, negrito, links, alertas).
- Mostra player do YouTube/Vimeo se houver vídeo.
- Mostra player de áudio se houver áudio.
- Bloqueia o conteúdo se for pago e o usuário não tiver `has_app_access` (mostra botão "Comprar na Cakto" com o link do checkout que você cadastra no Admin).

Insiro esse componente em **todas as 20+ rotas de mini app**. Onde já existe conteúdo fixo (SBV, postura-ética, diário), ele aparece **acima** do conteúdo fixo (não destrói nada do que já está bom).

### 2. Pré-visualização no Admin (você consegue reler o que salvou)
No formulário "Editar mini app", adiciono uma aba/painel **"Pré-visualizar"** que renderiza o markdown ao vivo enquanto você digita. Assim você lê o que já cadastrou e vê como vai aparecer para o aluno.

### 3. Gate de acesso real (corrige Bug 3 — protege a venda)
Para mini apps com `gratuito = false`:
- Sem login → tela "Faça login para acessar".
- Logado mas sem compra → tela "Conteúdo bloqueado" + botão direto para o checkout da Cakto (usando `checkout_url` que você cadastra no Admin).
- Com compra ativa (registro em `user_app_access` válido) → libera conteúdo.

Sem isso, qualquer um copia a URL e acessa de graça — o que você descreveu.

### 4. Suporte editorial mínimo no conteúdo
Para o markdown ficar utilizável de verdade, suporto:
- Títulos `#`, `##`, `###`
- Listas `-` e numeradas `1.`
- **Negrito**, *itálico*, `código`
- Links `[texto](url)`
- Blocos de destaque com sintaxe `> ⚠️ Atenção:` virando card amarelo, `> ✅ Dica:` virando card verde, `> 📌 Importante:` virando card azul (ajuda você a montar conteúdo bonito sem precisar de HTML).

### 5. O que NÃO vou fazer
- **Não vou escrever o conteúdo dos mini apps por você.** Isso é decisão sua (didática, fonte, COFEN, sua experiência). O sistema fica pronto para receber; o conteúdo você cola no Admin.
- **Não vou refatorar as páginas que já têm conteúdo bom** (SBV, postura-ética, diário, curativos). Elas continuam funcionando como estão, e o conteúdo do Admin entra acima.
- **Não vou mexer no carrossel, hero, loja, checkout** — escopo é só destravar conteúdo + acesso.

---

## Resultado depois desta execução

- Você abre Admin → escolhe um mini app vazio (ex: `uti`) → cola texto em markdown → salva → abre `/uti` e o conteúdo aparece.
- Mini app pago: visitante sem compra vê paywall com botão para Cakto. Comprador autenticado vê conteúdo.
- Você consegue reler/editar tudo que cadastrar.
- Pronto para você cadastrar na Cakto e começar a vender.

**Confirma que sigo por aqui?** Se sim, faço numa execução só.