# Plano de Melhoria Técnica do Painel Administrativo

Este plano visa corrigir as estatísticas do painel administrativo, garantindo que o número total de alunos e a distribuição por categoria (Acadêmico, Técnico, Enfermeiro e Estudante) reflitam a realidade dos dados, além de diagnosticar por que outros indicadores aparecem zerados.

## Ações Propostas

### 1. Diagnóstico e Correção das Estatísticas (`DashboardAdmin.tsx`)
*   **Problema:** O painel atual conta assinaturas "ativas". Se o usuário estiver no período de Trial (15 dias grátis), ele pode não estar sendo contabilizado na contagem por categoria, embora apareça no "Total de Alunos" (que lê diretamente da tabela `profiles`).
*   **Solução:** Ajustar a consulta para incluir tanto status `active` quanto `trial`.
*   **Segmentação:** Implementar a contagem baseada na coluna `categoria` da tabela `profiles`, que é o dado mestre da identidade do aluno, em vez de depender apenas do `plan_slug` da assinatura (que pode variar ou estar ausente em novos cadastros).

### 2. Sincronização de Indicadores
*   **Vendas e Pedidos:** Verificar a integração com a tabela de pagamentos para garantir que conversões reais sejam exibidas.
*   **Mini Apps Relevantes:** Ativar a contagem baseada em acessos reais (se disponível nos logs) ou total de interações registradas.

## Detalhes Técnicos
*   Alterar a `queryFn` do `DashboardAdmin.tsx` para realizar um agrupamento (`count`) por `categoria` na tabela `profiles`.
*   Garantir que o `totalUsers` ignore contas administrativas (`admin`) para uma estatística comercial limpa.
*   Mapear corretamente os slugs:
    *   `academico`
    *   `tecnico`
    *   `enfermeiro`
    *   `tecnico-estudante`

O sistema passará a mostrar exatamente quantos alunos existem em cada uma das 4 categorias solicitadas.