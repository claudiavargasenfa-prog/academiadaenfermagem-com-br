# Pagamento de verdade no "Finalizar Assinatura" (PIX + cartão)

## O que está acontecendo hoje (analisado no projeto)

1. A tela `/checkout` é uma **simulação**. O código gera um PIX falso (`pix_copy_paste` com "ADEC-PIX-KEY-FAKE" e um QR Code de teste) e o botão "Pagar com Cartão" não abre nenhum pagamento. Por isso dá erro / não conclui.
2. Essa tela procura o plano na tabela `subscription_plans` pelo slug da variação (ex.: `academico-anual`). Essas linhas de variação existem, mas estão com **preço 0**, então o valor cobrado ficaria errado.
3. Os links reais do Mercado Pago existem e estão certos em `plan_offers` (4 períodos × 4 trilhas = 16 links `mpago.la`), mas a tela de checkout **nunca usa** esses links.
4. O webhook de pagamento (`/api/public/payments`) já está pronto e correto: confere o pagamento direto na API do Mercado Pago e libera o acesso.

Observação: no cadastro `tecnico-estudante`, o link trimestral está igual ao mensal — precisa do link correto.

## O que eu proponho (mantém a sua tela, que você gostou)

Transformar a tela "Finalizar Assinatura" em um checkout **real**, com PIX e cartão funcionando de verdade, sem depender de colar link por link:

- Ao clicar em PIX ou Cartão, o app cria o pedido no banco e chama o Mercado Pago na hora, gerando um pagamento com o **valor correto do período escolhido**.
- **PIX**: o QR Code e o código "copia e cola" vêm do Mercado Pago de verdade; a tela continua atualizando sozinha até aparecer "Pagamento Confirmado" e liberar o acesso.
- **Cartão**: abre o checkout seguro do Mercado Pago (Checkout Pro) com parcelamento, e ao voltar o acesso já está liberado.
- O acesso é liberado automaticamente pelo webhook que já existe (só libera depois de confirmar o pagamento na API do Mercado Pago).

Com isso os 16 links avulsos deixam de ser obrigatórios: eles ficam apenas como reserva/atalho. Preço, período e trilha passam a sair de uma fonte só (`plan_offers`), acabando o risco de valor errado.

## Passos

1. Corrigir a origem do preço: o checkout passa a resolver trilha + período em `plan_offers` (ex.: `academico-anual` → trilha `academico`, período anual, R$ 299,88).
2. Criar a integração real com o Mercado Pago no servidor, usando o `MP_ACCESS_TOKEN` já cadastrado:
   - PIX: gera pagamento e devolve QR Code + copia e cola reais.
   - Cartão: cria a preferência do Checkout Pro e devolve o link para o pagamento.
   - Cada pedido leva o `external_reference` com o id do pedido, para o webhook casar o pagamento com o aluno.
3. Ajustar a tela `/checkout` para mostrar o QR real, o valor certo, o período escolhido e redirecionar para o cartão quando for o caso.
4. Guardar no pedido o período contratado, para o webhook criar a assinatura com a validade certa (30 / 90 / 180 / 365 dias).
5. Ajustar os botões das variações para irem todos para essa tela única de checkout (em vez de abrir links soltos), mantendo o link do Mercado Pago como alternativa.
6. Testar em pagamento real de valor baixo ou em ambiente de teste e confirmar liberação automática do acesso.

## Do seu lado (rápido)

- Confirmar se posso usar a mesma conta Mercado Pago do token já cadastrado.
- Me enviar o link/valor correto do **trimestral do Estudante de Técnico** (hoje está repetido com o mensal).
- Opcional, mas recomendado: cadastrar um `MP_WEBHOOK_SECRET` no Mercado Pago para a validação de assinatura ficar 100%.

## Detalhes técnicos

- Nova server function `createMercadoPagoPayment` em `src/lib/checkout.functions.ts`, chamando `POST /v1/payments` (PIX) e `POST /checkout/preferences` (cartão) com `MP_ACCESS_TOKEN` lido dentro do handler.
- Remoção do bloco simulado (`simulated: true`, PIX fake) e gravação de `external_id` com o id real do pagamento/preferência do MP.
- `orders.metadata` passa a guardar `billing_period` e `period_days`; `/api/public/payments` usa isso ao criar/renovar `user_subscriptions`.
- `notification_url` apontando para `https://academiadaenfermagem-com-br.lovable.app/api/public/payments`; `back_urls` retornando para `/checkout?plan=...&status=...`.
- Fonte única de preço em `plan_offers` via `src/lib/plan-slugs.ts`.
