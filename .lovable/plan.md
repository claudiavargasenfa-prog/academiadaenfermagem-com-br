# Lançamento de hoje: cadastro → acesso total → pagamento no Mercado Pago

## Análise técnica (o que eu verifiquei de verdade)

**1. Os 16 links do Mercado Pago estão certos.** Na tabela de ofertas por período (`plan_offers`), os 4 apps × 4 períodos estão todos ativos e com link preenchido, inclusive o mensal do Estudante de Técnico (`mpago.la/2r77Fze`) que você mandou corrigir. Preços coerentes (ex.: Acadêmico 24,99 mensal → 299,88 anual).

**2. A página `/checkout` não tem mais PIX falso.** Hoje ela é uma página-ponte: registra o pedido como pendente e manda para o link do Mercado Pago do período escolhido. Isso está correto.

**3. `/loja` já redireciona para a home.** Porém ela ainda aparece no sitemap (`/loja` listado para o Google) e vários textos/botões ainda dizem "Voltar para a loja".

**4. PROBLEMA GRAVE — ainda existem links da Cakto vivos.** A tabela de planos (`subscription_plans`) guarda `cakto_checkout_url` com links reais `pay.cakto.com.br` para Acadêmico, Técnico, Estudante de Técnico e Enfermeiro. E o código usa esse campo como alternativa:
- `src/routes/trilha.$slug.tsx` (botão "Assinar R$ X/mês" no topo de cada app) → cai na **Cakto**, porque o campo que ele tenta primeiro nem existe mais no banco.
- `src/routes/planos.$slug.tsx` (linha 108) → mesma coisa.
- `src/routes/minha-conta.tsx` e o banner de fim de trial → tentam o link do Mercado Pago primeiro, mas ainda têm a Cakto como alternativa.

Ou seja: hoje, se o aluno clicar em "Assinar" dentro do app, ele vai para a Cakto. Com anúncio pago rodando, isso é dinheiro indo para o lugar errado.

**5. PROBLEMA — link errado no plano mensal do Estudante de Técnico.** Em `subscription_plans`, o `mp_link` do `tecnico-estudante` está com o link do **trimestral** (`1WYrvma`) em vez do mensal (`2r77Fze`). Na tabela de ofertas está certo; nessa tabela antiga, errado.

**6. Cadastro e liberação de acesso estão funcionando.** A landing `/adec` leva para `/cadastro/{app}`, o cadastro pede a categoria (Acadêmico, Estudante de Técnico, Técnico, Enfermeiro), e o banco cria automaticamente o teste de 15 dias, liberando **todos os mini apps daquele app escolhido**, sem cartão. O prazo dessa liberação automática vai até 10/09/2026.

Observação: o login com Google entra direto no Acadêmico, sem deixar escolher a categoria.

## O que vou fazer

1. **Matar a Cakto de vez.** Apagar os links `pay.cakto.com.br` do banco e tirar do código toda alternativa que aponte para lá. Todo botão de assinatura passa a usar somente o link do Mercado Pago do período escolhido.
2. **Unificar os botões de assinar.** Criar uma única função que resolve "app + período → link do Mercado Pago" a partir da tabela de ofertas, e usar ela em: página do app (`/trilha/...`), página de plano, minha conta, banner de fim de teste e comparativo de upgrade. Fim dos caminhos divergentes.
3. **Corrigir o link mensal do Estudante de Técnico** na tabela antiga de planos e conferir os 16 links um a um clicando na versão publicada.
4. **Limpar os restos da "loja"**: tirar `/loja` do sitemap e trocar os textos "Voltar para a loja" por "Voltar para os aplicativos".
5. **Botão de assinar dentro do app** passa a levar para a página do plano com o seletor de período (mensal/trimestral/semestral/anual), não mais para um preço mensal fixo — assim o aluno escolhe e vai direto ao link certo.
6. **Conferir a liberação automática pós-pagamento**: revisar o recebimento do aviso do Mercado Pago e confirmar que o endereço configurado lá é `https://academiadaenfermagem-com-br.lovable.app/api/public/payments`.
7. **Teste de ponta a ponta antes do anúncio**: abrir a landing publicada, clicar no botão, criar uma conta de teste, confirmar que todos os mini apps abrem sem cadeado, e conferir que cada um dos 4 botões de período abre a tela certa do Mercado Pago.

## O que preciso confirmar com você

- No teste de 15 dias, o aluno deve ter acesso **só ao app que escolheu** (é como está hoje) ou aos **4 aplicativos**?
- Quer que o login com Google também pergunte a categoria, em vez de jogar todo mundo no Acadêmico?

## Detalhes técnicos

- Novo `src/lib/mp-links.ts`: resolve `(plan_slug, billing_period) → plan_offers.cakto_checkout_url` (campo legado no nome, conteúdo é link MP), com fallback só para erro visível, nunca para Cakto.
- Editar: `trilha.$slug.tsx`, `planos.$slug.tsx`, `minha-conta.tsx`, `TrialCountdownBanner.tsx`, `ComparativoUpgrade.tsx`, `OfertasPeriodo.tsx` para consumir a função única.
- Migração: `UPDATE subscription_plans SET cakto_checkout_url = NULL, cakto_link_migracao = NULL`; corrigir `mp_link` de `tecnico-estudante` para `https://mpago.la/2r77Fze`.
- `sitemap[.]xml.ts`: remover a entrada `/loja`.
- Nenhuma alteração de conteúdo de mini app.
