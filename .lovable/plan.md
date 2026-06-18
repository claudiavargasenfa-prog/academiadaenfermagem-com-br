## Escopo reduzido — Fase 1 enxuta

**Mudança vs plano anterior:** em vez de criar telas vazias para os 13 apps faltantes, criar telas vazias só para **5 mini apps adicionais** (você escolhe quais). Os outros 8 ficam só no catálogo da Loja com cadeado + badge "Em breve" (sem rota, botão desabilitado).

### O que entra nesta rodada

1. **Banco de dados** (1 migration)
   - Ajustar `mini_apps`: adicionar `cakto_checkout_url`, `route_path`, `horas_certificado`, `gratuito` (boolean), `em_breve` (boolean).
   - `user_app_access` já existe — usar `data_compra + 150 dias` como `expires_at`.
   - Atualizar `has_app_access`: app `gratuito=true` → sempre liberado; pago → exige `expires_at > now()`.
   - Seed dos 21 apps (nome, preço, horas, slug, `gratuito` só no #1, `em_breve=true` nos 8 sem tela).

2. **Loja `/` (home)** — refatorar `src/routes/index.tsx`
   - 21 cards com preço, badge "Grátis" no #1, badge "Em breve" nos 8 sem rota.
   - Estados: Acessar / Comprar / Renovar / Em breve (desabilitado).

3. **5 novas telas placeholder** em `src/routes/<slug>.tsx`
   - Layout padrão (header, título, descrição, breadcrumb) + gate `has_app_access`.
   - Você indica quais 5 dos 13 sem conteúdo entram agora.

4. **Apps já existentes** (Postura/Ética, Exame Físico, IRAS, Cálculos, SV Pediátrico, SV Gestante, Relatório ABNT, Segurança)
   - Trocar gate antigo pelo novo (`has_app_access` com 150 dias).

5. **Cakto** — atualizar `src/routes/api/public/cakto-webhook.ts`
   - Webhook grava `user_app_access` com `expires_at = now() + 150 dias`. HMAC mantido.

6. **Anti-cópia + marca d'água** — novo `src/components/ContentProtection.tsx`
   - Bloqueia Ctrl+P, Ctrl+S, F12, botão direito, seleção, drag de imagem.
   - Marca d'água diagonal com e-mail + CPF + timestamp (~12% opacidade).
   - Exceção em `/relatorio-abnt`: Ctrl+P liberado quando relatório está completo.
   - PrintScreen do SO **não pode** ser bloqueado pelo navegador — marca d'água serve de rastreamento.

7. **Helper** novo `src/lib/access.ts` com `useAppAccess(slug)`.

### Fora desta rodada (Fase 2)
Certificados PDF, geração/envio por e-mail, admin completo novo, exportação CSV, rate limiting avançado, telas dos 8 apps restantes.

### Pós-aprovação
Você precisa colar as URLs de checkout Cakto dos 20 apps pagos em `/admin` — sem isso, "Comprar" não tem destino.

### Pergunta antes de começar
**Quais 5 dos 13 apps sem conteúdo terão tela placeholder agora?** Lista dos 13: Curativos, ACLS, UTI, Obstetrícia, Pediatria, Saúde Mental, Farmacologia, Anatomia, Fisiologia, Microbiologia, Bioquímica, Ética e Bioética, Gestão em Enfermagem. (Confirme a lista correta — usei os nomes que apareceram antes; me diga se algum nome está errado.)
