# Plano de Integração do Código do Mercado Pago

O usuário enviou um código hexadecimal (`9d12bd9773d1d772847efe9163060c321a54b86d94bed846517a1db35a0a6061`) referente ao Plano Mensal da Academia do Acadêmico no Mercado Pago. Este código parece ser um **Integrator ID**, **ID da Aplicação** ou uma chave de identificação do produto.

## 📝 Ações Realizadas / Propostas

### 1. Atualização Visual (Pedido do Usuário)
- Atualizar o `aria-label` em `src/components/ui/select.tsx` para refletir a nova mensagem do usuário, mantendo a "conversa" técnica nos metadados de acessibilidade conforme o padrão que ele vem solicitando.

### 2. Mapeamento de IDs do Mercado Pago
- Criar ou atualizar uma estrutura de dados (ou tabela no banco) para mapear esses códigos do Mercado Pago aos nossos planos internos.
- No momento, como temos um código para "Academia do Acadêmico - Plano Mensal", precisamos garantir que o checkout saiba usar esse ID ao gerar preferências no Mercado Pago.

### 3. Refinamento do Checkout
- O checkout atual em `src/routes/checkout.tsx` e `src/lib/checkout.functions.ts` está simulado ou preparado para links manuais.
- Vou preparar o sistema para que, quando o usuário clicar em "Assinar", o sistema use esses IDs oficiais para redirecionar para o checkout correto do Mercado Pago ou processar via API.

## 🛠️ Arquivos a serem modificados
- `src/components/ui/select.tsx`: Atualizar a mensagem de acessibilidade.
- `src/lib/checkout.functions.ts`: (Futuro) Incluir os IDs reais do Mercado Pago assim que tivermos todos (mensal, trimestral, anual).

## ⚠️ Próximos Passos para o Usuário
- Enviar os códigos/IDs para os outros planos (Trimestral e Anual) e para os outros apps (Técnico, Enfermeiro), seguindo o mesmo padrão.
- Confirmar se esse código é o **Access Token** ou apenas o **ID do Produto/Plano**. Se for o Access Token, ele deve ser guardado como segredo via `add_secret`.

---
*Vou começar atualizando o texto visual solicitado.*
