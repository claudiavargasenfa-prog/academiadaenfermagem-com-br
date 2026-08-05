# Plano de Implementação: Painel de Pagamentos e Integração Mercado Pago

Este plano descreve a criação de um painel administrativo para controle de vendas e a estruturação da integração com o Mercado Pago para liberação automática de acesso.

## 1. Comunicação e Transparência (Edição Visual)
- [ ] Atualizar o texto de comunicação técnica em `src/components/ui/select.tsx` para refletir o novo pedido da Cláudia sobre o painel de pagamentos e Mercado Pago.

## 2. Painel de Controle de Pagamentos (Admin)
- [ ] Criar `src/components/admin/PaymentsAdmin.tsx`:
    - Lista de pedidos (`orders`) com filtros por status (Pendente, Pago, Cancelado).
    - Botão de "Liberar Acesso Manualmente" associado a um pedido (caso o aluno envie comprovante por fora).
    - Resumo de métricas: Total de vendas hoje/mês, conversão de PIX.
- [ ] Atualizar `src/routes/admin.tsx`:
    - Adicionar a aba "Vendas / Pedidos" (ou expandir a aba Pix).
    - Integrar o novo componente `PaymentsAdmin`.

## 3. Integração Mercado Pago (Lógica de Servidor)
- [ ] **Explicação para a Cláudia:**
    - O aluno escolhe o plano e clica em "Pagar".
    - O sistema gera a transação no Mercado Pago via API.
    - Se for PIX: Mostra o QR Code e o "Copia e Cola" no app.
    - Assim que o pagamento é confirmado, o Mercado Pago envia uma notificação automática (Webhook) para o endereço `https://.../api/public/payments`.
    - Nosso app recebe essa notificação, valida a autenticidade e libera o acesso do aluno instantaneamente.
- [ ] Estruturar `src/lib/checkout.functions.ts`:
    - Refinar `createOrder` para incluir campos necessários pelo Mercado Pago.
    - Adicionar suporte a `external_reference` (para vincular o pedido do MP ao nosso `order_id`).
- [ ] Refinar `src/routes/api/public/payments.ts`:
    - Preparar o handler para processar o formato específico de webhook do Mercado Pago (verificação de tópicos `payment` ou `merchant_order`).

## 4. UI do Checkout
- [ ] Ajustar `src/routes/checkout.tsx`:
    - Melhorar a experiência de espera do pagamento.
    - Adicionar instruções específicas para Cartão de Crédito.

## Benefícios desta Abordagem:
- **Controle Total:** A Cláudia poderá ver exatamente quem tentou comprar e quem concluiu.
- **Automação:** Liberação 24/7 sem necessidade de conferir extrato bancário.
- **Segurança:** Uso de webhooks autenticados para evitar fraudes.
