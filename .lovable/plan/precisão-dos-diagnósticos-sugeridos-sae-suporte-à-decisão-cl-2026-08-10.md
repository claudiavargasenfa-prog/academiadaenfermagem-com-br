# Precisão dos diagnósticos sugeridos (SAE / Suporte à Decisão Clínica)

## Problema

Hoje o motor pontua qualquer palavra parecida entre o texto do paciente e a planilha. Palavras comuns ("dor", "risco", "alteração") aparecem em centenas de linhas, então quase todas as hipóteses pontuam e o app devolve muita coisa sem relação com o paciente.

## O que vai mudar

1. **Critério essencial obrigatório (modo rigoroso)**
   A hipótese só é sugerida se pelo menos um critério essencial da planilha (col. 5) estiver presente no que foi descrito/ditado. Sem isso, a hipótese é descartada.

2. **Peso por especificidade**
   Termo raro na planilha (ex.: "estridor laríngeo") vale muito; termo comum (ex.: "dor") vale quase nada. Frases inteiras valem mais que palavras isoladas.

3. **Nota de corte e limite**
   Máximo de **10 hipóteses**, e apenas as que atingirem pelo menos 60% da pontuação da melhor. Se nada passar do corte, aparece um aviso pedindo mais detalhes em vez de listar hipóteses fracas.

4. **Filtro por contexto do paciente**
   Idade, sexo e setor/clínica já preenchidos descartam hipóteses incompatíveis (obstétricas em homem, neonatais em adulto, etc.).

5. **Negação**
   Trechos como "nega dispneia", "sem febre", "ausência de edema" deixam de contar a favor da hipótese.

6. **Transparência no card**
   Cada hipótese passa a mostrar:
   - selo de correspondência: **Alta / Média / Baixa**
   - a lista dos achados do paciente que geraram aquela sugestão
   Assim o profissional confere na hora e o resultado deixa de parecer genérico.

## Detalhes técnicos

- Arquivo central: `src/lib/sae-engine.ts`.
- `matchDiagnosticos` reescrita: índice passa a guardar, por diagnóstico, três conjuntos separados — essenciais (col. 5), evidências (col. 4) e palavras-chave (col. 13) — em vez de um único saco de tokens.
- Peso de cada termo calculado por frequência inversa na base (termo presente em muitos diagnósticos vale pouco). Pré-calculado uma vez na carga do módulo.
- Score = (essenciais × peso alto) + (evidências) + (palavras-chave × peso baixo), normalizado pelo tamanho do conjunto do diagnóstico para não favorecer linhas com texto longo.
- Gate rigoroso: `essenciaisHits >= 1`; diagnósticos sem col. 5 preenchida usam evidências de col. 4 como substituto do gate.
- Corte: `score >= 0.6 * melhorScore`, `maxResults = 10`.
- Negação: varredura por janelas de 4 palavras após `nega|sem|ausência de|não apresenta|nao ha` removendo esses termos do corpus antes do casamento.
- Contexto: nova função `filtrarPorContexto(matches, { idade, sexo, setor })` com marcadores derivados do texto do diagnóstico (gestante/puérpera/RN/neonato/lactente/criança/idoso).
- `renderDiagnosticoCard` ganha o selo de correspondência e a linha "Achados que geraram esta sugestão", em verde, sem mudar o design atual.
- `src/components/MiniAppContent.tsx`: passa os dados de identificação já preenchidos para o filtro de contexto.
- Sem alteração no banco, no conteúdo cadastrado ou no layout dos mini apps.
