# Item 3 — Mecanismos Científicos: tirar o texto padrão e receber tudo que foi marcado/escrito

## O que encontrei (verificado agora)

1. A frase **"Pesquisa automatizada nas linhas ADEC pela Coluna 4 e apresentação vinculada das Colunas 7, 8 e 10."** está escrita no código do app, logo abaixo do título "3. MECANISMOS CIENTÍFICOS – HIPÓTESE DIAGNÓSTICA AUTORAL".

2. O "pré-preenchido com texto padrão" vem do conteúdo salvo no banco desse Mini App (Suporte à Decisão Clínica e Mecanismos Fisiopatológicos). Dentro do item 3 existem **quatro blocos de exemplo fixos**, escritos manualmente, com frases prontas como:
   - "Achado: Instabilidade Postural, Pulso Filiforme e Labilidade Pressórica → Necessidade: Estabilização Hemodinâmica..."
   - "Achado: Padrão Alterado, Dispneia e Saturação Reduzida → ..."
   - mais dois blocos (renal e pele), cada um com um texto de fisiopatologia já escrito.
   Esses blocos aparecem sempre, independentemente do paciente. É esse conteúdo que dá a impressão de espaço pré-preenchido.

3. Já existe uma rotina que copia automaticamente para o item 3 tudo que é marcado e escrito nos itens anteriores; ela funciona, mas fica embaixo do texto fixo, o que confunde.

## O que vou fazer

1. **Retirar a frase** "Pesquisa automatizada nas linhas ADEC pela Coluna 4 e apresentação vinculada das Colunas 7, 8 e 10."

2. **Remover os quatro blocos de exemplo fixos** do item 3 no conteúdo salvo, junto com as regras de estilo/saídas fixas que os acompanham. O item 3 passa a começar vazio.

3. **Garantir que o item 3 receba só o que está fora da normalidade**: toda marcação (caixinhas) e todo texto escrito nos itens anteriores, inclusive dentro das sanfonas fechadas, entram na área de Evidências Clínicas assim que são feitos, e saem quando são desmarcados — **mas apenas os achados alterados**. Tudo que for marcado ou escrito como normal (ex.: "eupneico", "sem alterações", "normocorado", "ausente", "preservado", sinais vitais dentro da faixa de referência) **não vai** para a área de pesquisa de hipótese diagnóstica. O que o usuário digitar direto ali continua preservado.

4. **Testar no navegador** o caminho real: marcar achados normais e alterados, escrever textos, abrir/fechar sanfonas, conferir que o item 3 fica só com o que está fora do normal (sem nenhum texto de exemplo) e que a pesquisa de hipóteses continua funcionando.


## Detalhes técnicos

- `src/components/MiniAppContent.tsx`: remover a linha do parágrafo descritivo do painel `#adec-fundamentos-automatizado`; revisar `coletarAchados`/`sincronizarAchados` para varrer também campos dentro de `<details>` fechados, reagir a desmarcação imediata e aplicar um **filtro de normalidade** antes de enviar ao item 3 — descarta rótulos/valores com marcadores de normalidade (normal, sem alterações, sem queixas, eupneico, normocorado, hidratado, ausente, preservado, íntegra, negativo, nega...) e sinais vitais dentro das faixas de referência (FC 60–100, FR 12–20, Tax 35,5–37,5, SpO2 ≥ 94, PA sistólica 90–139 / diastólica 60–89, dor 0).
- Migração de conteúdo do Mini App `DE-FUNDAMENTOS`: retirar as quatro "MATRIZ AUTORAL" fixas e os blocos `#out1..#out5` / regras `input[id="preN"]:checked` associados, mantendo o restante do layout e o design inalterados.
- Nenhuma alteração em outros Mini Apps, pagamentos, acessos ou design.
