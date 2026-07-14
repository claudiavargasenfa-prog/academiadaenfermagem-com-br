Diagnóstico técnico fechado:

O problema principal não é o conteúdo visual do mini app. O SAE foi salvo como um bloco grande de HTML com JavaScript interno. Esse JavaScript depende de `DOMContentLoaded`, mas o app injeta o HTML depois que a página já carregou. Resultado: o botão `Gerar Diagnósticos` pode aparecer visualmente, mas o motor que deveria ligar o clique não fica confiável.

Também há uma segunda diferença importante: na tela do Admin, a pré-visualização usa um renderizador simples/sanitizado, que remove ou não executa o JavaScript do SAE. Por isso o comportamento no Admin e na tela real do mini app pode ficar diferente.

Plano de correção, sem alterar design nem conteúdo clínico:

1. Transformar o renderizador interativo do mini app em componente reutilizável
   - O mesmo motor usado na tela real do mini app será usado também na pré-visualização do Admin.
   - Isso elimina a diferença entre “funciona fora do Admin” e “não funciona no Admin”.

2. Corrigir o botão `Gerar Diagnósticos` por fora do script antigo
   - Manter o HTML, cores, textos e layout exatamente como estão.
   - Adicionar um listener React seguro no botão.
   - No clique, o sistema vai abrir a matriz de diagnósticos e esconder o painel inicial.

3. Fazer a análise de sinais/sintomas funcionar com texto digitado e checkboxes
   - Checkboxes do exame físico continuam valendo.
   - Texto livre como “dor no peito”, “dor de cabeça”, “enjoo”, “vômito”, “falta de ar”, “edema”, “ferida” etc. passa a acionar os cards compatíveis.
   - Cards previstos no SAE atual:
     - Neurológico
     - Respiratório/Cardiorrespiratório
     - Renal/Eliminação
     - Pele/Integridade cutânea

4. Garantir que a evolução seja preenchida
   - O texto digitado em sinais/sintomas será consolidado na evolução.
   - O motor tentará acionar a função legada de evolução quando ela existir.
   - Se o script legado falhar, a evolução manual/consolidada ainda continuará funcionando.

5. Preservar etapas seguintes
   - Não remover o botão de gerar prescrição.
   - Não mexer na tabela de prescrição.
   - Não alterar o layout de 5 colunas.
   - Não editar o conteúdo clínico salvo no mini app.

6. Validação final
   - Testar no preview real com o fluxo:
     1. abrir SAE;
     2. digitar “dor no peito, dor de cabeça e enjoo”;
     3. clicar em `Gerar Diagnósticos`;
     4. confirmar que a grade aparece;
     5. confirmar que os cards aparecem;
     6. confirmar que a evolução recebe os dados.
   - Testar também dentro do Admin em pré-visualização para confirmar que não fica mais “morto”.

Resumo direto: a correção será no motor de renderização/interação, não no design nem no conteúdo do SAE.