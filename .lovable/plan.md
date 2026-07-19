## Objetivo

Inserir os achados clínicos que você mandou como **checkboxes marcáveis** dentro do bloco **Exame Físico** do mini app **SAE DESCOMPLICADA E AUTOMATIZADA**. Toda marcação vai automaticamente para a Evolução (comportamento que já funciona hoje via classe `.symptom`).

## Escopo — só os 7 sistemas que já existem no SAE

Os demais sistemas da sua lista (Cabeça, Olhos, Ouvidos, Nariz, Boca, Pescoço, Mamas, Musculoesquelético, Vascular Periférico, Linfático, Endócrino, Psíquico, Reprodutor) **não serão criados** — você pediu para apenas atualizar os existentes.

| Seção no SAE hoje | Recebe da sua lista |
|---|---|
| Sinais Gerais | Estado Geral |
| Tegumentar / Pele | Pele |
| Respiratório | Sistema Respiratório |
| Cardiovascular | Sistema Cardiovascular |
| Digestório | Abdome + Sistema Gastrointestinal (fundidos) |
| Renal | Sistema Geniturinário |
| Neurológico | Sistema Neurológico |

## Como cada seção vai ficar

Em cada uma das 7 seções, adicionar dois blocos novos logo abaixo do que já existe, sem remover nada:

- **✅ Achados de normalidade** — cada item da sua lista vira um checkbox verde independente (ex.: ☐ BEG, ☐ Consciente, ☐ Orientado no tempo/espaço/pessoa, ☐ Hidratado, ☐ Corado, ☐ Acianótico, ☐ Anictérico, ☐ Afebril).
- **⚠️ Achados de anormalidade** — cada item vira um checkbox âmbar independente (ex.: ☐ Torporoso, ☐ Sonolento, ☐ Confuso, ☐ Desidratado, ☐ Hipocorado, ☐ Cianótico, ☐ Ictérico, ☐ Febril).

Regras aplicadas a todos os checkboxes novos:
- Classe `.symptom` → alimenta a Evolução automaticamente igual aos demais.
- Label curta e clínica (a frase-mãe da sua lista fica como legenda do bloco).
- Layout em grid responsivo (2–3 colunas no desktop, 1 no mobile), coerente com o padrão verde/dourado do SAE.
- Não mexo nos campos livres de observação, nem no texto padrão de normalidade que já preenche a evolução, nem nos AVP/CVP/temperatura que já estão lá.

## Onde a mudança acontece

Um único UPDATE no `content_md` do registro `mini_apps` slug **SAE AUTOMÁTICA** (id `c020e2e7-90db-449f-a508-2c173f4cada2`), inserindo os dois blocos dentro de cada uma das 7 seções existentes. Nada muda em `sae-engine.ts`, `MiniAppContent.tsx` nem no banco de diagnósticos — só HTML da tela.

## Fora de escopo

- Criar seções novas (Cabeça, Olhos, etc.).
- Reescrever seções existentes.
- Mudar cores, tipografia, motor de diagnósticos ou lógica de prescrição.
