# Plano de Implementação: Mercado Pago Checkout Pro para Certificados

Implementação da integração dinâmica com o Checkout Pro do Mercado Pago para cobrança e liberação automatizada de certificados, substituindo links estáticos por preferências geradas em tempo real.

## Alterações Propostas

### Backend (Banco de Dados e Configuração)
- Utilização da tabela `orders` existente para rastrear pedidos pendentes.
- Configuração de Webhook seguro na rota `/api/public/payments` (já existente e funcional).
- Documentação das variáveis de ambiente necessárias: `MP_ACCESS_TOKEN` e `MP_WEBHOOK_SECRET`.

### Integração Mercado Pago
- **Criação de `src/lib/mercadopago.functions.ts`**: Nova Server Function para gerar preferências de pagamento no Mercado Pago.
- **Configuração da Preferência**:
  - Título dinâmico (ex: "Certificado ADEC - SAE (20h)").
  - Valor baseado na carga horária (R$ 10, 20, 30 ou 40).
  - `external_reference` vinculado ao ID do pedido no nosso banco.
  - `notification_url` apontando para o nosso webhook.
  - `back_urls` configuradas para retornar o aluno à página "Minha Conta" com feedback de status.

### Frontend
- **Ajuste em `BeneficiosPlano.tsx`**:
  - Substituição da lógica de redirecionamento para links estáticos pela chamada à Server Function.
  - O fluxo agora é: Criar Pedido (DB) -> Gerar Preferência (MP) -> Redirecionar para o Checkout Pro.

## Detalhes Técnicos

### Variáveis Secretas Necessárias
Para que o sistema funcione, você precisará adicionar estas chaves em **Settings > Secrets**:
1. `MP_ACCESS_TOKEN`: Token de acesso do seu painel de desenvolvedor do Mercado Pago.
2. `MP_WEBHOOK_SECRET`: Chave secreta configurada nas notificações do Mercado Pago para validar que os avisos são legítimos.

### Fluxo de Liberação
O webhook já está preparado para:
1. Receber o ID do pagamento do Mercado Pago.
2. Consultar o status na API oficial (`approved`).
3. Atualizar o pedido para `paid`.
4. Chamar a função `internal_issue_certificate` que gera o certificado no banco de dados do aluno.

---
**Nota:** O redirecionamento após o pagamento levará o aluno de volta para a aba de certificados, onde o novo certificado aparecerá automaticamente assim que o pagamento for processado (geralmente instantâneo no PIX).
