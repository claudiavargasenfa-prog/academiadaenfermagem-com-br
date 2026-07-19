## O que muda

Troca do **banco de dados mestre** do mini app "SAE DESCOMPLICADA E AUTOMATIZADA" pela planilha nova enviada no chat, mantendo intacto todo o fluxo, o visual e a tabela de prescrição verde (3 colunas) que já funciona hoje.

## Passos

### 1. Converter a planilha em JSON
- Ler `PLANILIA_OFICIAL_DE_DIAGNOSTICOS_E_PRESCRIÇÃO_DE_ENFERMAGEM.xlsx` (1.496 linhas úteis, 1.344 códigos únicos ADEC-XXXX).
- Agrupar por `Código` (TAB. 1) — quando o mesmo código repete em várias linhas (várias intervenções), consolidar as intervenções em uma lista.
- Gerar `src/data/sae-banco.json` **substituindo** o arquivo atual, com este shape por diagnóstico:

```
{
  "id": "ADEC-0001",
  "matriz": "TAB. 2 — Matriz Clínica",
  "eixo":   "TAB. 3 — Eixo Assistencial",
  "sinais": "TAB. 4 — Evidências Clínicas",      // usado só para BUSCA
  "criteriosEssenciais": "TAB. 5",
  "criteriosAssociados": "TAB. 6",
  "diagnostico": "TAB. 7 — Hipótese Diagnóstica",
  "condutas": [
    {
      "conduta":    "TAB. 8 — Intervenções",
      "horario":    "TAB. 9 — Frequência",       // mesmo slot de hoje
      "aprazamento":"TAB. 10 — Aprazamento",     // mesmo slot de hoje
      "objetivo":   "TAB. 11",
      "prioridade": "TAB. 12",
      "palavras":   "TAB. 13",
      "obs":        "TAB. 14"
    }
  ]
}
```

### 2. Ajustar o motor de matching
Arquivo: `src/lib/sae-engine.ts`

- **Busca (chips + textarea "Sinais e Sintomas")**: passa a casar **somente contra TAB. 4 (Evidências Clínicas)** + TAB. 13 (Palavras-chave) como reforço. Nada mais alimenta o buscador — é o que você pediu ("TAB. 4 vai ser a Sinais e Sintomas, que são as busca por diagnósticos").
- **Card do diagnóstico exibido** ao usuário: TAB. 2, TAB. 3, TAB. 5, TAB. 6, TAB. 7 (nessa ordem, com TAB. 7 como título principal em negrito).
- **Bloco expandível "Ver condutas"** dentro do card: TAB. 8, TAB. 11 (Objetivo/Meta), TAB. 12 (Prioridade), TAB. 14 (Observações).
- **Índice de busca** recalculado a partir de TAB. 4 + TAB. 13 (frases e keywords), mantendo lista de stopwords atual.

### 3. Tabela de prescrição — permanece igual
- Mesmas 3 colunas verdes: `PRESCRIÇÃO DE ENFERMAGEM | APRAZAMENTO | ANOTAÇÕES DE ENFERMAGEM`.
- Cada conduta renderiza no texto corrido com **TAB. 9 (Frequência) em negrito verde inline** — mesmo lugar onde hoje entra "12/12h".
- Coluna APRAZAMENTO exibe **TAB. 10** — mesmo lugar onde hoje entra "10 - 22".
- Cabeçalho do paciente, botão ✕ Excluir por linha, coluna pautada e exportação PDF ABNT: **sem alteração**.

### 4. Evolução consolidada
Sem mudança de estrutura. Cada diagnóstico selecionado aparece como:
`N. TAB.7 (ADEC-XXXX) — Meta: TAB.11`

### 5. Volume (1.344 itens)
Confirmado por você. O JSON fica em ~600–900 KB, carregado 1 vez por sessão. Adiciono `useMemo` no índice de busca para que a filtragem continue instantânea depois do primeiro carregamento.

## O que **NÃO** vai mudar

- HTML do mini app no banco (nenhuma migração SQL nesta rodada).
- Cabeçalho do paciente, chips de sinais/sintomas, checkboxes do exame físico, geração de evolução, botões de exportar PDF ABNT.
- Cores, tipografia, glassmorphism, layout dos cards.
- Nenhum outro mini app.

## Validação

1. Abrir SAE, digitar "queda" no textarea → deve casar ADEC-0002 (Prevenção de Quedas) via TAB. 4.
2. Selecionar 2 diagnósticos, clicar **Gerar Prescrição** → tabela verde com TAB. 8 no texto, TAB. 9 em negrito verde, TAB. 10 na coluna do meio.
3. Clicar **Gerar Evolução** → linhas com TAB. 7 + código ADEC + Meta (TAB. 11).
4. Exportar PDF ABNT → conteúdo preservado.
