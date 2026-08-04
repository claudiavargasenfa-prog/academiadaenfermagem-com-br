# Novo logotipo ADEC + planos semestral e anual

## 1. Sobre estar nos buscadores

Não há conexão do Google Search Console vinculada a este projeto, então não consigo confirmar se o site já está indexado. O que existe hoje no app: `public/robots.txt`, sitemap e metadados/JSON-LD nas rotas principais. Para saber de fato (e acelerar), o caminho é conectar o Search Console ao domínio `academiadaenfermagem.com.br` e enviar o sitemap. Posso te guiar nisso depois — não é código.

## 2. Trocar o logotipo (aparecendo completo)

Hoje o logo do topo é exibido em um quadrado de 44x44px com fundo e borda dourada. A imagem nova é quadrada e cheia de detalhes; em 44px ela "vira uma faixa" quando o container corta.

O que será feito:

- Registrar a imagem enviada como asset do projeto e substituir `src/assets/logo.png.asset.json` (usado pelo cabeçalho em `AppShell`, pela página de boas-vindas e pelas telas de login/cadastro).
- Ajustar a apresentação para o logo aparecer **inteiro**: `object-contain` com padding zero/mínimo, sem recorte, aumentando um pouco a altura no cabeçalho (de 44 para ~52px no desktop, mantendo proporção no celular) e removendo o fundo branco translúcido que "suja" a arte.
- Atualizar também o ícone do app instalável (`public/icon-192.png`, `public/icon-512.png`) e o favicon a partir da mesma arte, para o ícone da tela inicial ficar igual ao da marca.
- Conferir os outros pontos onde o logo aparece (landing `/adec`, `/legal`, relatório ABNT, painel de boas-vindas) para que nenhum corte a arte.

## 3. Planos semestral e anual sem dar desconto

Hoje cada app tem só um plano mensal (`subscription_plans`: Enfermeiro R$ 39,99 · Acadêmico R$ 24,99 · Técnico R$ 16,99 · Estudante R$ 13,99), com um produto Cakto por app e liberação de acesso via webhook.

Estrutura proposta: mesma tabela ganha planos por **período** (mensal, semestral, anual) para cada app — preço = mensal × 6 e × 12, sem desconto, mas com **entregas exclusivas** que justificam o compromisso:

**Semestral (6 meses)**
- Acesso liberado sem risco de bloqueio por atraso de renovação (paga uma vez, usa 6 meses).
- Certificado digital de participação/atualização contínua com carga horária, emitido pelo app.
- Biblioteca de PDFs para download (escalas, protocolos, tabelas de aprazamento) — exclusiva de quem é semestral/anual.
- Prioridade no grupo VIP do WhatsApp para dúvidas clínicas.

**Anual (12 meses)**
- Tudo do semestral, mais:
- Acesso a **um segundo app** da Academia à escolha (o maior valor percebido, sem mexer no preço).
- Cota ampliada de geração de relatórios/PDF (hoje há limite por uso na tabela `relatorio_uses`).
- Selo "Turma Fundadora" no perfil e garantia de preço travado na renovação.
- Participação nas aulas/lives mensais e acesso ao acervo gravado.

Nenhum desconto é aplicado — o ganho é escopo e benefício, não preço.

## Detalhes técnicos

- `subscription_plans`: adicionar colunas `billing_period` ('mensal' | 'semestral' | 'anual') e `period_days` (30/180/365), além de `perks` (jsonb) para os benefícios listados na página do plano. Cada período vira uma linha com seu próprio `cakto_product_id` e link de checkout (você cria os 8 produtos novos na Cakto e cola os IDs no admin).
- `src/routes/api/public/cakto-webhook.ts`: usar `period_days` do plano para calcular o vencimento em vez de assumir 30 dias.
- `src/routes/planos.$slug.tsx`: seletor Mensal / Semestral / Anual com os benefícios de cada faixa e o CTA apontando para o checkout correto.
- `minha-conta` e o banner de renovação passam a exibir a data de vencimento conforme o período contratado.
- Admin ganha os campos de período/benefícios na tela de Assinaturas.

## Ordem de execução

1. Logo + ícones (rápido, visual).
2. Migração de banco dos períodos + webhook.
3. UI de escolha de plano e benefícios.
4. Depois: entregar os benefícios (certificado, biblioteca PDF, segundo app) — cada um é um passo à parte.
