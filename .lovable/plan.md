# Aviso de vencimento: o que já existe e o que falta

## Situação atual (verificada no código)

Já existe uma faixa piscante no topo da conta do aluno (`TrialCountdownBanner`, renderizada dentro do layout `AppShell`, em todas as páginas internas). Ela usa a animação `trial-pulse` (pisca a cada 1,4s) e aparece em 3 estágios:

- 5 dias antes: faixa azul — "Seu tempo grátis termina em 5 dias" (pode ser fechada)
- 3 dias antes: faixa laranja — "Seu tempo grátis termina em 3 dias" (pode ser fechada)
- 1 dia antes: faixa vermelha — "Seu prazo de gratuidade é até amanhã" (não pode ser fechada)

Cada faixa traz o botão de checkout do plano (link Cakto do plano correspondente).

**Limitação encontrada:** a faixa só é exibida para assinaturas com status `trial`. Quem já é **pagante mensal** (status `active`) não recebe nenhum aviso de que a mensalidade está vencendo. Também não há aviso por e-mail ou WhatsApp — o aviso é apenas dentro do app.

## O que proponho construir

1. **Aviso de renovação para assinantes pagantes**
   - A mesma faixa passa a considerar também assinaturas `active`.
   - Estágios: 5 dias (azul, "Sua mensalidade vence em X dias"), 3 dias (laranja), 1 dia (vermelha, não fechável).
   - Botão leva ao checkout/renovação do plano.
   - Textos diferentes dos de trial (renovação x associação).

2. **Reaparecer depois de fechada**
   - Hoje, ao fechar, a faixa some até recarregar. Passa a reaparecer a cada nova sessão/dia, para não perder o aviso.

3. **Lembrete também na página Minha Conta**
   - Um cartão fixo com a data exata de vencimento e o botão de renovar, para quem fechou a faixa.

## Detalhes técnicos

- `src/components/TrialCountdownBanner.tsx`: incluir o ramo `active`, calcular dias com base em `expires_at`, escolher textos por tipo (trial vs. pago) e persistir o "fechado" em `sessionStorage` por dia.
- `src/routes/minha-conta.tsx`: bloco de status da assinatura com data de vencimento e CTA de renovação.
- Sem mudanças de banco: `user_subscriptions.status` e `expires_at` já contêm o necessário.

## Fora do escopo (pode ser feito depois)

Aviso por e-mail ou WhatsApp automático 3 dias antes — exige job agendado e serviço de envio; posso planejar separadamente se quiser.
