## Plano: Remover Fontes & Referências da Página Admin e Loja

### O que será feito
Na página `Admin`, o `AppShell` é usado sem a prop `hideReferences`, então o bloco de "Fontes & referências" aparece no rodapé. Ajustar para escondê-lo.

A página `Loja` já apenas redireciona para `/`, então não há conteúdo para ajustar.

### Mudanças
- `src/routes/admin.tsx`: Passar `hideReferences` no `<AppShell>` para que o componente `ReferencesFooter` não seja renderizado.

### Não será alterado
- Componente `References.tsx` (será reutilizado em outras páginas).
- Página `loja.tsx` (já é um redirect, sem conteúdo).