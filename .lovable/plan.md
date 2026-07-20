## Landing pages públicas por app + promoção de lançamento

Migração já preparada (aguardando execução) com:
- Coluna `whatsapp_group_url` na tabela `apps` (você cola o link do grupo pelo admin)
- Trial passa a **15 dias** entre 01/08/2026 e 01/10/2026 (fora da janela: 30 dias)
- Preços já batem com os informados (24,99 / 13,99 / 16,99 / 39,99) — nada a alterar

### Rota nova
`src/routes/planos.$slug.tsx` — uma landing pública, SSR, indexável, que serve os 4 slugs:
`academico`, `tecnico`, `tecnico-estudante`, `enfermeiro`.

Cada landing tem, no padrão glassmorphism/pastel:
1. **Hero** com cor do app, nome, slogan, preço grande, botões "Assinar" e "Experimentar 15 dias grátis"
2. **Banner dourado da promoção** (só aparece entre 01/08 e 01/10/2026), com botão "Entrar no Grupo VIP no WhatsApp" quando o link estiver preenchido
3. **3 diferenciais**: COFEN/COREN, PWA offline, atualizações mensais
4. **Lista dos mini apps** daquele plano (puxada de `mini_app_placements` + `mini_apps`)
5. **FAQ em acordeon** (`<details>`): como funciona o trial, WhatsApp, cancelamento, offline, atualizações
6. **CTA final** com preço e mesmos botões
7. **SEO por slug**: title, description, og:title, og:description únicos

### Home
Adiciono um link **"Saiba mais →"** em cada card de `src/routes/index.tsx` apontando para `/planos/{slug}`. Os botões "Ativar Assinatura" e "Experimentar Grátis" continuam funcionando como hoje.

### O que NÃO muda
- Nada dentro dos mini apps (SAE, Escalas, etc.)
- Nada no checkout Cakto
- Nada no visual dos apps de aluno assinante

Se aprovar, entro em modo build e faço tudo em uma tacada só.
