# Plano para exclusão total de conteúdos relacionados ao AVC

O objetivo é remover completamente qualquer "Mini App" ou conteúdo clínico exclusivo sobre AVC (Acidente Vascular Cerebral), conforme solicitado, garantindo que não restem referências no banco de dados nem nos arquivos do sistema.

## Ações realizadas

1.  **Remoção do Banco de Dados**:
    *   Excluir os registros da tabela `mini_apps` com os slugs `protocolo-avc-sala-vermelha` e `AVC`.

2.  **Limpeza de Arquivos de Dados**:
    *   Remover o caso clínico "Suspeita de AVC Isquêmico" do arquivo `src/data/simulacoes-reais.ts`.
    *   Remover o quiz "AVC — Acidente Vascular Cerebral" do arquivo `src/data/quizzes.ts`.
    *   Ajustar feedbacks em outros casos (como o de Crise Hipertensiva) que mencionavam o risco de AVC para usar termos como "complicações neurológicas graves".

3.  **Ajustes de UI/UX**:
    *   Remover a sigla "AVC" da lista de dispositivos invasivos em `src/routes/exame-fisico-escalas.tsx` (onde se referia a Acesso Venoso Central) para evitar qualquer confusão com o tema removido.

## Verificação

*   O Mini App não aparecerá mais na loja nem na área do acadêmico/enfermeiro.
*   As simulações e quizzes não conterão mais o tema AVC.
*   Nenhum arquivo físico exclusivo de AVC (como configurações de Code Stroke) será mantido.
