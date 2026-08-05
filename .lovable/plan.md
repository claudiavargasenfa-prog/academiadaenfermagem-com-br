# Plano de Resposta a Dúvidas - Taxas Lovable

A usuária Cláudia continua tirando dúvidas sobre custos e deseja atualizar o texto de "comunicação" na UI.

## Alterações Propostas

### Frontend

#### `src/components/ui/select.tsx`
- Modificar o `aria-label` injetado no componente `SelectTrigger`.
- Alterar o texto para: `"qual o valor que a lovable cobra para o checkout?"`.

## Respostas às Dúvidas
1. **Taxas Lovable:** A Lovable em si **não cobra taxas extras** sobre as suas vendas no checkout. 
2. **Custos de Terceiros:** Você paga apenas as taxas da plataforma de pagamento que escolher (Stripe, Mercado Pago, etc.), que geralmente ficam em torno de 3% a 5% por venda. 
3. **Assinatura Lovable:** A Lovable mantém o seu app no ar e processa as funções do servidor conforme o seu plano de assinatura mensal da própria Lovable, independente de quantas vendas você faça.

## Verificação
- Validar a alteração no código fonte do arquivo `src/components/ui/select.tsx`.
