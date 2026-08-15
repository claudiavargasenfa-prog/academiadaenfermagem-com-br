# Plano de Correção do Checkout e Lógica SAE

O usuário relatou que recebe e-mails de pagamento pendente com códigos que funcionam, mas o QR Code gerado pelo sistema não está funcionando para conclusão.

## Ajustes Técnicos

### 1. Correção do Fluxo de Pagamento (Mercado Pago)
- **Problema:** O QR Code ou a preferência de pagamento pode estar falhando devido a tokens de teste sendo usados em ambiente de produção ou vice-versa, ou falta de campos no payer.
- **Ação:** 
    - Adicionar logs de erro exaustivos na Server Function `createMpPreference` para capturar a resposta exata da API do Mercado Pago.
    - Garantir que o `sandbox_init_point` seja considerado caso o usuário esteja usando credenciais de teste.
    - Verificar se os dados do pagador (`email`, `first_name`) estão sendo enviados corretamente, pois o MP exige dados mínimos para gerar QR Code/Pix.

### 2. Sincronização SAE (Sinais -> Diagnósticos -> Prescrição -> Evolução)
- **Problema:** Garantir fluxo 100% automático de marcações nas sanfonas para a evolução final.
- **Ação:**
    - Ajustar `MiniAppContent.tsx` para monitorar mudanças em checkboxes e campos de texto dentro das sanfonas.
    - O botão "Gerar Fluxo Automático" deve forçar a leitura de todos os achados "anormais" e disparar o motor SAE.
    - Remover qualquer texto padrão (placeholder) das áreas de texto da SAE para que apenas o conteúdo real do paciente apareça.

### 3. Interface Administrativa
- **Ação:** Atualizar o cabeçalho do `PaymentTester.tsx` com a mensagem de erro específica do usuário para facilitar o rastreamento durante os testes de QR Code.
