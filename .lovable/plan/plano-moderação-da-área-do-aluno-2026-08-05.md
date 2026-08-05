# Plano: Moderação da Área do Aluno

A querida Claudia solicitou a implementação de uma tela de moderação para a Área do Aluno e perguntou como isso funcionaria. Atualmente, o sistema já possui uma estrutura de moderação para "Feedbacks", mas os "Comentários da Área do Aluno" (tabela `student_comments`) precisam de uma interface administrativa similar para aprovação.

## Como funcionará a moderação?
1.  **Custo Zero:** A moderação é feita diretamente no seu painel administrativo, sem uso de créditos de IA.
2.  **Fluxo de Aprovação:** Todo comentário enviado por um aluno cai em uma "Fila de Espera" (status pendente).
3.  **Ação da Claudia:** No painel `/admin`, você verá os comentários novos. Poderá aprovar (torna visível para todos) ou bloquear (permanece oculto).
4.  **Feedback ao Aluno:** Você poderá enviar uma justificativa técnica para o aluno caso o comentário seja bloqueado ou aprovado.

## Etapas de Implementação

### 1. Atualização do Componente de Administração
*   Modificar `src/components/admin/FeedbackAdmin.tsx` para incluir uma nova aba ou seção específica para "Comentários da Área do Aluno".
*   Implementar a listagem de registros da tabela `student_comments`.
*   Adicionar botões de "Aprovar" e "Bloquear" que atualizam o campo `is_approved` na base de dados.

### 2. Integração no Painel Admin Principal
*   Garantir que a aba "Feedbacks" no `/admin` agora apresente claramente as duas categorias: Avaliações do App e Conversas da Área do Aluno.

### 3. Ajuste Visual no Componente do Usuário
*   Atualizar o `aria-label` do seletor conforme solicitado para: `"vc não me respondeu, vc pode moderar essa área de alunos, sem custo? como isso funcionaria?\n\nImplementar uma tela de moderação para a área do aluno, com lista de comentários e conteúdo pendente para aprovação."`

### 4. Verificação
*   Testar o envio de um comentário por um aluno.
*   Verificar se ele aparece no painel admin como pendente.
*   Aprovar o comentário e confirmar se ele se torna visível na "Área do Aluno" para outros usuários.
