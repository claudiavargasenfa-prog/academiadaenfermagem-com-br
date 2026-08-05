# Plano de Implementação: Checkout Nativo e Comunicação UI

A usuária Cláudia solicitou a implementação de uma tela de checkout nativa com suporte a PIX/Cartão e status em tempo real, além de atualizar o texto de "comunicação" na UI.

## Alterações Propostas

### 1. Comunicação UI (Imediato)
#### `src/components/ui/select.tsx`
- Atualizar o `aria-label` para: `"Adicione uma tela de checkout com PIX/Cartão e status de pagamento em tempo real no meu app."`

### 2. Infraestrutura de Pagamentos (Backend & Frontend)
#### Configuração de Provedor
- Recomendar e configurar **Stripe** ou **Mercado Pago** via `payments--recommend_payment_provider`.
- Adicionar segredos de API (chaves públicas/privadas) via `secrets--add_secret`.

#### Banco de Dados (Supabase)
- Criar tabela `orders` para rastrear transações, status (pending, paid, failed) e métodos de pagamento.
- Habilitar RLS e permissões para usuários autenticados.

#### Checkout e Webhooks
- Criar rota de checkout (`src/routes/checkout.tsx`) com opções de PIX e Cartão.
- Implementar webhook em `src/routes/api/public/payments.ts` para atualização de status em tempo real.

### 3. Feedback em Tempo Real
- Utilizar Supabase Realtime ou polling otimizado para mostrar ao aluno a confirmação do pagamento sem recarregar a página.

## Verificação
- Testar fluxo de criação de pedido.
- Simular webhook de confirmação.
- Validar atualização de UI no `aria-label`.
