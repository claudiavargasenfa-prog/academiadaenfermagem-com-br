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
- Acesso liberado por 6 meses de uma vez, sem risco de bloqueio por atraso de renovação.
- **2 certificados digitais de 10h** cada, de atualização contínua. O aluno escolhe quais mini apps quer certificar; o certificado sai com nome, mini app, carga horária, data e código de validação.
- **Biblioteca de PDFs para download** (escalas, protocolos, tabelas de aprazamento) — exclusiva de semestral/anual.
- **Plantão de dúvidas no Grupo VIP exclusivo do WhatsApp, 1x por semana**, em horário marcado com o enfermeiro de suporte.

**Anual (12 meses)**
- Tudo do semestral, mais:
- **Acesso a um 2º aplicativo completo da Academia, à escolha** (ex.: quem assina o Acadêmico leva também o Enfermeiro ou o Técnico). É o maior valor percebido e não mexe no preço.
- **Cota ampliada do Relatório de Estágio ABNT** (hoje são 5 gerações por compra; o anual passa a ter cota maior).
- **4 certificados de 10h** no ano (em vez de 2).
- Plantão de dúvidas semanal no Grupo VIP durante os 12 meses.

Removidos conforme sua decisão: selo "Turma Fundadora"/preço travado e lives mensais.

Nenhum desconto é aplicado — o ganho é escopo e benefício, não preço.

## Respostas às suas perguntas

- **A biblioteca de PDFs: você terá que fazer?** Não. Eu gero os PDFs a partir do conteúdo que já existe nos mini apps (escalas Braden/Morse/Glasgow/NEWS2, tabela de aprazamento, bundles de dispositivos, checklists de procedimentos). Você só revisa e aprova.
- **Qual é o "2º app"?** Não é um mini app isolado — é um dos 4 aplicativos completos (Enfermeiro, Acadêmico, Técnico, Estudante) à escolha do aluno. A SAE Automatizada continua dentro dos apps onde já está; ela é o argumento de venda, não um brinde solto. Assim quem é Acadêmico anual pode abrir o Enfermeiro (onde estão SAE, gerenciamento, UTI) e vice-versa.
- **O Relatório de Estágio ABNT foi tirado?** Não — a rota `/relatorio-abnt` continua ativa e hoje libera 5 gerações por compra. É essa cota que o plano anual amplia.

## Detalhes técnicos

- `subscription_plans`: adicionar `billing_period` ('mensal' | 'semestral' | 'anual'), `period_days` (30/180/365) e `perks` (jsonb) com os benefícios exibidos na página do plano. Cada período vira uma linha com seu próprio `cakto_product_id` e link de checkout (você cria os produtos novos na Cakto e cola os IDs no admin).
- `src/routes/api/public/cakto-webhook.ts`: calcular o vencimento por `period_days` em vez de assumir 30 dias; para o anual, gravar também o direito ao 2º app e a cota maior de relatório.
- `src/routes/planos.$slug.tsx`: seletor Mensal / Semestral / Anual, com a lista de benefícios de cada faixa e CTA no checkout correto.
- `minha-conta` e o banner de renovação: mostram a data de vencimento conforme o período contratado.
- Admin (Assinaturas): campos de período, preço e benefícios por plano.
- Novas telas de benefício (etapas seguintes): escolha do 2º app no anual, emissão de certificado de 10h por mini app e biblioteca de PDFs restrita a semestral/anual.

## Ordem de execução

1. Logo + ícones (rápido, visual).
2. Migração de banco dos períodos + webhook + página de planos com as 3 opções.
3. Escolha do 2º app (anual) e cota ampliada do relatório.
4. Emissão dos certificados de 10h.
5. Biblioteca de PDFs.
