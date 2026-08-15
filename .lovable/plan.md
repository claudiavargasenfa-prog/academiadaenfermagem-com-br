# Plano de Correção do Checkout e Lógica SAE

O usuário relatou que, ao simular o checkout do Mercado Pago, ocorre um erro de código. Além disso, há uma solicitação pendente para garantir que todas as marcações e escritas nas sanfonas (sinais e sintomas) gerem automaticamente os diagnósticos, prescrição e evolução.

## Ajustes Técnicos

### 1. Correção do Checkout Mercado Pago
- **Problema:** O erro de código no checkout geralmente ocorre por:
    - `MP_ACCESS_TOKEN` inválido ou ausente.
    - Falha na criação da preferência devido a campos obrigatórios.
    - `external_reference` duplicado ou malformado.
- **Ação:** 
    - Adicionar logs detalhados de erro na Server Function `createMpPreference`.
    - Garantir que o `orderId` gerado no Supabase seja passado corretamente.
    - Validar se o token está sendo lido corretamente do ambiente.

### 2. Sincronização SAE (Sinais -> Diagnósticos -> Prescrição -> Evolução)
- **Problema:** O usuário quer que "tudo que for marcado e escrito nas sanfonas" flua automaticamente.
- **Ação:**
    - Ajustar `MiniAppContent.tsx` para capturar inputs de texto dentro das sanfonas do guia clínico.
    - Refinar a função `extrairSinaisSintomas` para ser mais agressiva na captura de termos técnicos.
    - Garantir que o botão "Gerar Fluxo Automático" no modo treinamento (ou equivalente no Mini App) execute a cadeia completa:
        1. Parse do DOM em busca de checkboxes marcados e textos preenchidos.
        2. Chamada ao motor `matchDiagnosticos` com prioridade nas colunas 5, 7, 8 e 10.
        3. Preenchimento da tabela de prescrição com base nos resultados.
        4. Geração do texto da evolução consolidada.

### 3. Interface Administrativa
- **Ação:** Substituir o texto "language selector" por "SIMULEI, MAS O CODIGO DA ERRO" conforme solicitado visualmente, mantendo o contexto de depuração.

## Revisão de Segurança
- Garantir que o webhook em `/api/public/payments` continue validando a assinatura caso a secret esteja presente, mas que não bloqueie o fluxo se o pagamento for verificado via API direta com o ID recebido.
