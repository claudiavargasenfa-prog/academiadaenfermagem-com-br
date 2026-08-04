# Plano Trimestral (3 meses) nos 4 apps

Adicionar um novo período **Trimestral** entre o Mensal e o Semestral, nos 4 aplicativos (Enfermeiro, Acadêmico, Técnico, Técnico-Estudante).

## Regras do novo plano

- Duração: 90 dias.
- Preço: valor mensal x 3 (mesmo valor por mês dos demais planos):
  - Enfermeiro: R$ 119,97
  - Acadêmico: R$ 74,97
  - Técnico: R$ 50,97
  - Técnico-Estudante: R$ 41,97
- Benefício extra: **1 certificado de 10h** (o Semestral continua com 2 e o Anual com 4).
- Sem app bônus (continua exclusivo do Anual).

## O que muda

1. **Banco de dados**: nova oferta `trimestral` (90 dias) para os 4 planos, com preço, 1 certificado e ordem de exibição entre Mensal e Semestral. Fica ativa já, com o link de checkout em branco até você colar o link da Cakto no painel de admin.
2. **Página de planos**: o seletor de período passa a mostrar 4 opções (Mensal, Trimestral, Semestral, Anual), com rótulo e cálculo de valor por mês do trimestral.
3. **Webhook de pagamento (Cakto)**: já lê a duração e os benefícios direto da oferta, então o trimestral funciona automaticamente assim que o link/ID do produto for cadastrado.
4. **Minha Conta**: a cota de certificados já é lida da assinatura, então o aluno do trimestral verá 1 certificado disponível sem mudanças adicionais.

## Detalhes técnicos

- Migração de dados inserindo 4 linhas em `plan_offers` (`billing_period = 'trimestral'`, `period_days = 90`, `certificates_included = 1`, `report_quota = 0`, `bonus_app_included = false`, `sort_order = 2`) e reordenando semestral/anual para 3 e 4.
- `src/components/planos/OfertasPeriodo.tsx`: incluir `trimestral` no tipo `Offer["billing_period"]` e no mapa `LABELS` (`{ title: "Trimestral", months: 3 }`).
- Sem alterações necessárias em `cakto-webhook.ts` nem em `BeneficiosPlano.tsx` (ambos genéricos por oferta).

## Depois

Você cadastra os produtos trimestrais na Cakto e cola os links de checkout no admin, como já fez com o mensal.
