## Ajustes solicitados (2 mudanças pontuais, sem quebrar nada)

### 1. Tabela de Prescrição — nova estrutura de 4 colunas

Arquivo: `src/lib/sae-engine.ts` (função `renderPrescricaoRow`)

**Colunas novas:** `Nº | PRESCRIÇÃO | APRAZAMENTO | ANOTAÇÕES`

- Remover a coluna **HORÁRIO**.
- Coluna **PRESCRIÇÃO**: cada conduta vira uma linha com o horário embutido no final entre colchetes dourados. Ex.: `• Avaliar edema periférico em cruzes (+/4+). [12/12H]`
- Coluna **APRAZAMENTO**: mostrar apenas os horários no formato solicitado, separados por hífen. Ex.: `10 - 22` ou `12 - 18 - 24 - 06` (sem numeração "1., 2.").
- Coluna **ANOTAÇÕES**: totalmente vazia, com **fundo pautado** (linhas horizontais a cada 24px usando `background-image: repeating-linear-gradient(...)`), altura mínima ~140px para caber várias linhas de escrita manual/impressa.
- **Separador entre itens**: manter a borda inferior dourada (`border-bottom: 3px solid #ca8a04`) já existente + adicionar `<tr>` divisor extra se necessário para reforço visual.
- Atualizar o cabeçalho `<thead>` correspondente no HTML do mini app (banco de dados, registro `c020e2e7-...`) para refletir as 4 colunas.

### 2. Sinais Gerais — transformar régua de temperatura em opções marcáveis

Arquivo: HTML do mini app SAE AUTOMÁTICA no banco (`mini_apps.content` do registro `c020e2e7-90db-449f-a508-2c173f4cada2`).

Na seção **SINAIS GERAIS**, **antes** das inclusões atuais, adicionar 4 checkboxes (mesmo padrão dos demais achados do exame físico, para que sejam capturados pelo motor e enviados à evolução):

- ☐ Afebril: Temperatura normal 36°C e 37,2°C.
- ☐ Subfebril (ainda não considerada febre): 37,3°C a 37,7°C.
- ☐ Pirexia: 37,8°C a 38,9°C.
- ☐ Hiperpirexia: acima de 39°C.

Cada checkbox usa a mesma classe/estrutura dos outros itens marcáveis do exame físico, para que a função `atualizarEvolucaoAutomatica` já existente colete a label automaticamente.

### O que NÃO será alterado

- Motor de matching de diagnósticos (`matchDiagnosticos`).
- Estrutura de anamnese, demais sistemas do exame físico, geração de evolução.
- Estilo visual global (glassmorphism, cores pastel, dourado).
- Nenhum outro mini app.

### Como será validado

- Abrir SAE AUTOMÁTICA no preview, gerar diagnósticos com um sintoma teste, clicar "Gerar Prescrição" e conferir: 4 colunas, aprazamento no formato `HH - HH - HH`, coluna de anotações pautada e vazia, linha divisória entre itens.
- Marcar "Pirexia" em Sinais Gerais e confirmar que aparece na Evolução consolidada.
