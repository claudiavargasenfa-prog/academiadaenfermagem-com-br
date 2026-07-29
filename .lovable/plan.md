# Prescrição da SAE Descomplicada — modelo A4 horizontal com Horário e Aprazamento

## Entendi o pedido

A prescrição volta ao modelo antigo: folha **A4 paisagem (horizontal)**, com exatamente 4 colunas, nesta ordem:

1. **Nº** — coluna estreita, só numeração de referência (01, 02, 03...)
2. **DIAGNÓSTICO DE ENFERMAGEM** — COL. 7 da planilha
3. **HORÁRIO** — COL. 15 da planilha
4. **APRAZAMENTO** — COL. 16 da planilha

O fluxo continua igual: gera os diagnósticos, aperta o botão e a prescrição é montada com uma linha por diagnóstico.

Mudanças em relação ao que está no ar: sai a antiga coluna 10 e entram as colunas 15 (Horário) e 16 (Aprazamento).

## Como Horário e Aprazamento vão funcionar

Na planilha nova, as colunas 15 e 16 são uma **lista fixa igual para todos os diagnósticos** (não variam por linha da planilha). Então, em cada linha da prescrição:

- A coluna **Horário** mostra a lista de opções vinda da COL. 15: `1/1h, 2/2h, 4/4h, 6/6h, 8/8h, 12/12h, 24/24h, Atenção, Rotina, Contínuo, Medir volume anotar, SN, AD, Obs.`
- Cada item dessa lista tem um **✕ para excluir** (o enfermeiro apaga o que não usa naquele diagnóstico).
- Ao **selecionar (clicar) um item** do Horário, a coluna **Aprazamento** da mesma linha é preenchida automaticamente com os horários correspondentes da COL. 16 (ex.: `2/2h` → `2. 4. 6. 8. 10. 12. ...`).
- O aprazamento continua **editável** (o enfermeiro pode ajustar a hora de início).

## Ponto a confirmar

A COL. 16 da planilha tem menos linhas preenchidas que a COL. 15 e os horários gravados não batem 1-a-1 com o exemplo que você deu. Vou usar esta correspondência padrão (ajuste se quiser outra):

```text
1/1h    -> 1. 2. 3. 4. 5. 6. 7. 8. 9. 10. 11. 12. ...
2/2h    -> 2. 4. 6. 8. 10. 12. 14. 16. 18. 20. 22. 24.
4/4h    -> 8. 12. 16. 20. 24. 04.
6/6h    -> 12. 18. 24. 06.
8/8h    -> 14. 22. 06.
12/12h  -> 10. 22.
24/24h  -> 12.
Atenção / Rotina / Contínuo / Medir volume anotar / SN / AD / Obs. -> sem horário fixo (campo livre)
```

## Detalhes técnicos

- Reimportar a planilha nova para `src/data/sae-banco.json`, guardando a lista de horários (COL. 15) e o mapa de aprazamento (COL. 16) como tabela única compartilhada.
- Reescrever `renderPrescricaoRow` em `src/lib/sae-engine.ts` para a estrutura de 4 colunas (Nº / Diagnóstico / Horário / Aprazamento), com os chips de horário deletáveis e selecionáveis.
- Em `src/components/MiniAppContent.tsx`: tratar clique em chip de horário (preenche aprazamento), clique em ✕ (remove o chip), manter o autosave por paciente e a exclusão da linha inteira.
- Ajustar o cabeçalho da tabela e o export PDF/impressão para **A4 landscape**, com larguras: Nº ~6%, Diagnóstico ~52%, Horário ~18%, Aprazamento ~24%.
- Nenhuma alteração de design/conteúdo fora da tabela de prescrição.
