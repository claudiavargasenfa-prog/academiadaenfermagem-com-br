# Correção da passagem das marcações para Evidências Clínicas

## Diagnóstico confirmado

- O Mini App abre e os seis passos conseguem ser percorridos no ambiente atual.
- Porém, a ligação interna está frágil: as marcações do Exame Físico são transformadas novamente em texto e passam por um reconhecedor antes de aparecerem em Evidências Clínicas. Isso pode fazer uma marcação não chegar como o item exato escolhido pelo aluno.
- A busca de diagnósticos depende dessa lista intermediária. Se a evidência não entra corretamente, os diagnósticos, a prescrição e a evolução também ficam comprometidos.

## Correção

1. **Passar cada marcação diretamente para Evidências Clínicas**
   - Todo item marcado no Exame Físico será incluído exatamente como foi selecionado, sem depender de reconhecimento de texto.
   - Ao desmarcar, o item será retirado imediatamente.

2. **Captar corretamente tudo que for escrito**
   - Queixa, HDA, antecedentes, observações e o texto livre do passo 3 continuarão sendo analisados pela planilha ADEC.
   - Os trechos reconhecidos e os textos livres continuarão separados, sem apagar nenhum registro do aluno.

3. **Evitar resultados antigos depois de alterar o paciente**
   - Se o aluno mudar uma marcação ou texto após gerar diagnósticos, o resultado anterior será invalidado para não manter hipóteses, prescrição ou evolução de dados antigos.

4. **Validar o fluxo completo na prática**
   - Testar marcação e desmarcação individual.
   - Testar digitação manual em cada campo.
   - Confirmar a passagem para Evidências Clínicas.
   - Confirmar diagnósticos, ensinamento crítico, prescrição e evolução.
   - Repetir o teste em tela de celular.

## Limite da alteração

- Somente o Mini App **Anamnese, Exame Físico, Diagnósticos, Prescrição e Evolução**.
- Sem alterar o design.
- Sem alterar outros Mini Apps, pagamentos, acessos ou conteúdos.