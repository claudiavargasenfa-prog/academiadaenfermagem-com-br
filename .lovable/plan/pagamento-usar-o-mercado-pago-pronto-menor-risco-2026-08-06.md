# Pagamento: usar o Mercado Pago pronto (menor risco)

## Minha recomendação, direto

**Não vale a pena manter um checkout próprio.** O caminho com mais chance de dar certo e menos risco de erro é usar os links de pagamento do próprio Mercado Pago, que você já tem cadastrados e funcionando.

Motivo: no checkout do MP, PIX, cartão, parcelamento, antifraude, boleto, recibo e reembolso já vêm prontos e testados. Um checkout próprio exige gerar PIX por API, tratar expiração, erros de cartão, tentativas recusadas e conciliação — cada um desses é um ponto novo de falha, e é exatamente aí que hoje aparece o erro que você viu.

## O que está errado hoje (verificado no projeto)

1. A tela `/checkout` é **simulada**: o PIX gerado é falso ("ADEC-PIX-KEY-FAKE") e o botão de cartão não abre pagamento nenhum. Por isso dá erro.
2. Ela busca o preço em `subscription_plans` pelos slugs de variação (ex.: `academico-anual`), que estão com **preço 0**.
3. Os links reais do Mercado Pago existem e estão certos em `plan_offers`: 4 trilhas × 4 períodos = 16 links.
4. O webhook `/api/public/payments` já está pronto e correto: confere o pagamento na API do MP e libera o acesso automaticamente.

Correção de link que você mandou (Estudante de Técnico): mensal = https://mpago.la/2r77Fze, trimestral = https://mpago.la/1WYrvma. Hoje o mensal está gravado com o link do trimestral — vou corrigir.

## O que vou fazer

1. **Aposentar o checkout falso.** Todo botão "Assinar" passa a levar direto ao link do Mercado Pago do período escolhido. Fim do erro de PIX e do botão de cartão que não faz nada.
2. **`/checkout` vira uma página-ponte bonita** (mantendo o visual que você gostou): mostra plano, período, valor e um botão grande "Pagar no Mercado Pago (PIX ou cartão)", mais o aviso de que o acesso é liberado sozinho após a confirmação. Nada de QR falso.
3. **Corrigir o link mensal do Estudante de Técnico** para https://mpago.la/2r77Fze.
4. **Garantir que todos os 16 links estejam preenchidos** e que cada botão pegue o link do período certo, sem cair em rota 404.
5. **Conferir a liberação automática**: confirmar que o webhook do Mercado Pago está apontado para o endereço certo do app, para o acesso do aluno abrir sozinho depois do pagamento.
6. **Página de retorno**: depois de pagar, o aluno volta para uma tela "Pagamento recebido, seu acesso está sendo liberado" com atalho para a trilha dele.

## Se um dia você quiser o checkout dentro do app

Fica registrado como passo futuro (não agora): gerar PIX pela API do MP dentro da própria tela. Só compensa quando o volume de vendas estiver alto e valer a pena reduzir o abandono de quem sai do app. Hoje o risco é maior que o ganho.

## Do seu lado

- Confirmar se o webhook do Mercado Pago está configurado apontando para o app (posso te passar o endereço exato).
- Opcional: cadastrar um `MP_WEBHOOK_SECRET` para a validação de assinatura ficar 100%.

## Detalhes técnicos

- `src/routes/checkout.tsx`: remover a criação de pedido simulado e o bloco de PIX/QR falso; resolver trilha + período em `plan_offers` e redirecionar para `cakto_checkout_url` (link MP) do período.
- `src/lib/checkout.functions.ts`: `createOrder` passa a registrar apenas o pedido `pending` com `plan_slug`, `billing_period` e valor vindos de `plan_offers` (rastreio no painel de pagamentos), sem PIX fake.
- Atualizar `plan_offers` (mensal `tecnico-estudante`) para o link novo.
- Botões em `OfertasPeriodo.tsx`, `ComparativoUpgrade.tsx` e `planos.$slug.tsx` unificados na mesma função de resolução de link.
- `notification_url` do MP: `https://academiadaenfermagem-com-br.lovable.app/api/public/payments`.
