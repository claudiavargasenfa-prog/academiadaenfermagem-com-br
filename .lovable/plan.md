## Objetivo

1. Dar autonomia total para você trocar a logo do app pelo painel admin (sem depender de mim).
2. Corrigir a falha: quando o app "Estudante de Técnico" (slug `tecnico-estudante`) foi criado, não apareceu a caixa dele em **Textos do App**. Fazer isso funcionar agora e nunca mais faltar em apps futuros.

---

## Parte 1 — Logo editável pelo admin

- Criar chave de texto `branding.logo_url` na tabela `app_texts` (valor inicial = a URL da logo atual).
- No `src/components/AppShell.tsx`, ler essa chave via `useText("branding.logo_url", <fallback atual>)` em vez do import fixo `logoAsset`.
- Na aba **Admin → Textos do App**, essa chave aparece igual às outras — você cola a URL de uma imagem (ou faz upload no Storage e cola o link público) e salva. A logo troca em todo o app na hora.
- Bônus: adicionar um campinho de **upload de imagem** ao lado do texto `branding.logo_url` que envia para o bucket `public-assets` do Storage e preenche a URL sozinho (se preferir só campo de URL, me avise).

## Parte 2 — Texto do "Estudante de Técnico" + prevenção

- Inserir agora o registro faltante:
  - `aplicativo.tecnico-estudante.slogan` — para você editar o slogan que aparece no card da loja.
- Na tela **Admin → Apps** (`AppsAdmin.tsx`), ao criar um novo plano/app, gerar automaticamente a chave `aplicativo.<slug>.slogan` em `app_texts` com valor vazio, para que ela já apareça na aba **Textos do App** sem precisar cadastrar manualmente.
- Também rodar uma varredura única: para cada plano existente sem `aplicativo.<slug>.slogan`, criar a chave vazia (isso resolve o `tecnico-estudante` e qualquer outro que tenha ficado para trás).

---

## Detalhes técnicos

- Tabela afetada: `app_texts` (apenas INSERT/UPDATE de dados via `supabase--insert`, sem mudança de schema).
- Arquivos afetados: `src/components/AppShell.tsx`, `src/components/admin/AppsAdmin.tsx`, `src/components/admin/TextsAdmin.tsx` (só se eu adicionar o upload).
- Storage: se você aprovar o upload, crio um bucket público `branding` (uma vez).

Confirma que posso implementar assim?