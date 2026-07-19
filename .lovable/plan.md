## Corrigir o nome do app

Trocar "ACADÊMICO DE BOLSO" / "Acadêmico de Bolsa" por **Academia da Enfermagem** em todos os lugares que aparecem para o usuário e para o celular quando instala o app.

### Arquivos a alterar

1. **`src/routes/__root.tsx`** — títulos e metatags (title, og:title, twitter:title). Trocar "ACADÊMICO DE BOLSO— Informações em suas mãos" por "Academia da Enfermagem — Informações em suas mãos".

2. **`public/manifest.webmanifest`** — `name` e `short_name` que aparecem quando o aluno instala no celular:
   - `name`: "Academia da Enfermagem"
   - `short_name`: "Academia"
   - `description`: atualizar para refletir a Academia da Enfermagem.

### Fora do escopo
- Não mexer em conteúdo, design, rotas, ou lógica.
- Não mudar o domínio nem republicar automaticamente — depois de aprovar, você clica em **Publicar** para o novo nome ir ao ar.

Observação: quem já instalou o app antigo no celular pode continuar vendo o nome antigo até desinstalar e reinstalar — iOS e Android guardam o `name` no momento da instalação.
