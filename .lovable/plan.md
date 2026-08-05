# Plano de Integração do Mercado Pago (Webhook e Segurança)

O usuário enviou a **Assinatura Secreta (Webhook Secret)** do Mercado Pago: `9d12bd9773d1d772847efe9163060c321a54b86d94bed846517a1db35a0a6061`. Esta chave é fundamental para validar que as notificações de pagamento recebidas pelo nosso sistema são legítimas e vieram realmente do Mercado Pago.

## 📝 Ações Realizadas / Propostas

### 1. Atualização Visual (Pedido do Usuário)
- Atualizado o `aria-label` em `src/components/ui/select.tsx` com a nova mensagem e o código fornecido.

### 2. Segurança e Webhooks
- Solicitar ao usuário que salve esta **Assinatura Secreta** como `MP_WEBHOOK_SECRET` no painel de Segredos (Secrets).
- Implementar a validação de assinatura no webhook `src/routes/api/public/payments.ts` para evitar fraudes.

### 3. Configuração do Plano Mensal
- Como o código foi gerado no contexto do "Plano Mensal", vamos mapear as notificações que usam essa assinatura para o fluxo de liberação automática da Academia do Acadêmico.

## 🛠️ Arquivos a serem modificados
- `src/components/ui/select.tsx`: Atualizar a mensagem de acessibilidade (Feito).
- `src/routes/api/public/payments.ts`: Adicionar lógica de validação de `x-signature` do Mercado Pago.

## ⚠️ Próximos Passos para o Usuário
- Por favor, adicione o código que você me enviou no campo de **Secrets** do projeto com o nome `MP_WEBHOOK_SECRET`.
- Se você tiver outros segredos para os planos Trimestral/Anual, eles devem ser adicionados também.
