# Prescrição: nova coluna PRIORIDADE CLÍNICA (COL. 11)

Sim, dá para incluir. Os dados da COL. 11 já estão importados no banco (1.341 dos 1.344 diagnósticos têm prioridade preenchida), e cada prioridade já vem amarrada ao mesmo registro do diagnóstico da COL. 7 — então a linha 19 da COL. 7 traz obrigatoriamente a prioridade da linha 19 da COL. 11.

## O que muda

A tabela da prescrição (A4 horizontal) passa a ter 5 colunas, nesta ordem:

```text
Nº | DIAGNÓSTICO DE ENFERMAGEM (COL.7) | HORÁRIO (COL.15) | APRAZAMENTO (COL.16) | PRIORIDADE CLÍNICA (COL.11)
```

- A coluna Prioridade é preenchida automaticamente ao gerar a prescrição, com o valor exato da planilha (ex.: Alta, Média, Baixa).
- Fica destacada por cor conforme o nível (alta = vermelho/laranja, média = âmbar, baixa = verde), mantendo o padrão visual atual.
- Continua editável pelo enfermeiro, caso ele queira ajustar no caso concreto.
- Quando não houver prioridade na planilha, o campo fica em branco para preenchimento manual.

Nada mais muda: geração de diagnósticos, chips de horário com ✕, preenchimento automático do aprazamento, exclusão de linha e renumeração seguem iguais.

## Detalhes técnicos

- `src/lib/sae-engine.ts`: em `renderPrescricaoRow`, adicionar a 5ª célula lendo `d.condutas.find(c => c.prioridade)?.prioridade`; novas larguras — Nº 5%, Diagnóstico 40%, Horário 19%, Aprazamento 23%, Prioridade 13%.
- `src/components/MiniAppContent.tsx`: incluir o novo campo no autosave por paciente e no export PDF/impressão em paisagem (mesmas proporções de largura).
- Atualizar o cabeçalho da tabela no conteúdo do mini app (`content_md` do app SAE Descomplicada) para incluir a coluna PRIORIDADE CLÍNICA.
