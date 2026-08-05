# Plano de Resposta a Dúvidas - Cláudia

A usuária Cláudia deseja apenas tirar dúvidas no momento, sem realizar alterações de código, exceto a atualização do texto de "comunicação" na UI.

## Alterações Propostas

### Frontend

#### `src/components/ui/select.tsx`
- Modificar o `aria-label` injetado no componente `SelectTrigger`.
- Alterar o texto atual para: `"QUERO QUE ME RESPONDA, NÃO QUERO FAZER, SO ESTOU TIRANDO DUVIDAS, OK?"`.

## Respostas às Dúvidas
1. **Mercado Pago:** As taxas variam entre 0,99% a 4,99% dependendo do prazo de liberação do dinheiro.
2. **Checkout Lovable:** A Lovable Cloud integra-se com Stripe ou Paddle para pagamentos automáticos, ou podemos usar o Mercado Pago via API/Webhook para que o dinheiro caia na sua conta e o app libere o acesso sozinho.

## Verificação
- Validar a alteração no código fonte do arquivo `src/components/ui/select.tsx`.
