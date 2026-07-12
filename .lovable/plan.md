Sim, dá pra fazer 100% grátis — igual já fazemos na página `/prescricao`: o próprio navegador gera o PDF via "Imprimir → Salvar como PDF", sem custo de servidor, sem envio de e-mail, sem armazenamento.

## O que vou fazer no mini app "Fundamentos dos Diagnósticos de Enfermagem"

1. Localizar a página desse mini app (rota atual com os dois botões no final).
2. Trocar/garantir dois botões independentes no rodapé:
   - **Salvar Prescrição (PDF)** → abre nova aba só com a tabela/texto da Prescrição, com título "Prescrição de Enfermagem" e data, e dispara `window.print()`.
   - **Salvar Evolução (PDF)** → abre nova aba só com o texto da Evolução, com título "Evolução de Enfermagem" e data, e dispara `window.print()`.
3. Usar o mesmo padrão visual já existente em `src/routes/prescricao.tsx` (folha A4, margens 2,5cm/2cm, fonte serifada, cabeçalho centralizado, data à direita). Nada de backend, nada de e-mail, nada de storage.
4. Botões desabilitados quando o conteúdo correspondente estiver vazio, com aviso curto ("Preencha a prescrição para salvar").

## Custo

Zero de infraestrutura. O PDF é gerado pelo navegador do usuário (funciona em celular e PC). Só consome créditos a edição do código em si.

## Antes de eu implementar, me confirma:

- O mini app que você chama de "Fundamentos dos Diagnósticos de Enfermagem" é o que hoje abre em **`/diagnosticos-aede`** (o wizard Anamnese → Exame → Sinais → Diagnósticos → Prescrição)? Se for outra rota, me diz qual, pra eu não mexer no lugar errado.
