Vou ajustar o admin e a loja para aceitar e exibir promoções com preço final zero.

Plano:
1. No admin, trocar os campos de preço de “centavos” para campos em reais digitáveis, com suporte a vírgula/ponto:
   - Preço DE: exemplo `5,99`
   - Preço POR: exemplo `0,00`
2. Ao salvar, converter automaticamente os valores digitados para centavos no banco:
   - `5,99` vira `599`
   - `0,00` vira `0`
3. Corrigir a lógica da loja para mostrar “de R$ 5,99 por R$ 0,00” mesmo quando o mini app estiver marcado como grátis.
4. Manter o checkbox “Grátis” separado da exibição do preço: ele continua liberando o acesso, mas não esconde mais o DE/POR quando houver preço DE configurado.
5. Ajustar a tela de bloqueio do conteúdo para também respeitar o preço promocional quando aplicável.

Resultado esperado:
- Você poderá cadastrar um app grátis com:
  - Grátis marcado
  - DE `5,99`
  - POR `0,00`
- A loja exibirá exatamente: `de R$ 5,99` e `por R$ 0,00`.