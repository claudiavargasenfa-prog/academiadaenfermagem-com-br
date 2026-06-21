## O que vou fazer

Na aba **Mini apps** do admin, duas melhorias pequenas:

### 1. Agrupar os mini apps por aplicativo
Os mini apps vão aparecer dentro de seções com título:

- **🎓 Acadêmicos** (N) — mini apps marcados pra esse aplicativo
- **🩺 Técnicos** (N)
- **👩‍⚕️ Enfermeiros** (N)
- **⚠️ Sem aplicativo** (só aparece se houver) — pra você ver rapidamente quais ainda não foram atribuídos a nenhum aplicativo

Como um mini app pode pertencer a mais de um aplicativo (ex: "Sinais Vitais do Adulto" pode estar em Acadêmico + Técnico), ele vai aparecer em cada seção em que está marcado. Os contadores no título mostram quantos itens tem cada aplicativo.

### 2. Rolar pro topo ao clicar no lápis
Quando você clica no ✏️ pra editar um mini app, a página vai rolar suavemente pro topo automaticamente, onde o editor abre. Sem precisar mais arrastar pra cima.

## Arquivo alterado

- `src/routes/admin.tsx` — apenas a seção da lista de mini apps. Sem mudança no banco, sem mudança no editor, sem mudança em nenhuma outra aba.