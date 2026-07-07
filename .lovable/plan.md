## O problema

Na aba **Mini apps** do admin, quando você marca os quadradinhos e clica em **"🗄️ Arquivar selecionados"**, o sistema hoje:

1. Apaga os vínculos da tabela de posicionamentos (`mini_app_placements`).
2. Marca o mini app como inativo.
3. Cria um novo vínculo no app "🗄️ Arquivo — 2º Projeto".

**Só que os cards continuam aparecendo em Acadêmico / Técnico / Enfermeiro.**

O motivo é uma marcação antiga (legado) em cada mini app: três colunas `track_academico`, `track_tecnico`, `track_enfermeiro` que valem `true/false`. A tela lista os cards em cada academia usando **duas fontes** ao mesmo tempo: os vínculos novos **e** essas marcações antigas. Como o botão de arquivar só limpa os vínculos novos e nunca desliga as marcações antigas, o card volta a aparecer nas academias.

## O que vou mudar

Alteração pontual, apenas no fluxo de arquivamento em massa (nenhum mini app é apagado, nada é movido automaticamente):

- No mesmo passo em que hoje desativo o mini app, também vou **desligar as três marcações antigas** (`track_academico`, `track_tecnico`, `track_enfermeiro` → `false`) para os mini apps selecionados.
- Resultado: ao clicar em "Arquivar selecionados", os cards **saem de verdade** de Acadêmico, Técnico e Enfermeiro e passam a aparecer apenas na seção "Sem app" (ou no app "🗄️ Arquivo — 2º Projeto" em *Apps & Organização*), prontos para você reconstruir um a um.

## O que **não** muda

- Nenhum mini app é apagado.
- Nenhum conteúdo (texto, escalas, badges) é alterado.
- O botão do lixinho continua igual.
- Para restaurar, você continua arrastando de volta em *Apps & Organização* — e agora eu também garanto que, ao arrastar de volta para Acadêmico/Técnico/Enfermeiro pelo AppsAdmin, o card apareça (o vínculo novo já é suficiente; a marcação antiga fica desligada permanentemente para os arquivados).

## Arquivo afetado

- `src/routes/admin.tsx` — função `handleBulkArchive`: adicionar `track_academico: false, track_tecnico: false, track_enfermeiro: false` ao `update` que já faz `is_active: false`.
