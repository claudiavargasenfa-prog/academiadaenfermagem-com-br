# Ampliar a campanha de gratuidade até 30/09/2026

## O que muda

Hoje a campanha termina em 10/09/2026. Vamos estender para **30/09/2026**: quem se cadastrar até o dia 30/09 ganha os 15 dias grátis individuais, contados da data do próprio cadastro (como já funciona hoje).

Exemplo: cadastro em 28/09 → acesso grátis até 13/10.

## Onde está a data hoje (confirmado)

1. **No app** (`src/lib/trial-window.ts`): data final 10/09/2026 e o texto "10/09/2026" exibido nas telas de cadastro e boas-vindas.
2. **No banco de dados** (função `handle_new_user`): a mesma data 10/09/2026 — é ela que decide se o novo cadastro ganha o trial de 15 dias.

Os dois precisam mudar juntos, senão o app mostra uma data e o banco aplica outra.

## O que será feito

1. Alterar `TRIAL_FREE_UNTIL` para `2026-09-30T23:59:59-03:00` e o rótulo para "30/09/2026" em `src/lib/trial-window.ts` (as telas que mostram a data se atualizam sozinhas, pois já usam essa fonte única).
2. Atualizar o comentário no `trial-guard.functions.ts` (sem mudança de lógica — ele já usa a constante).
3. Rodar uma migração no banco atualizando a função `handle_new_user`: trocar a data final de 10/09 para 30/09/2026 e ajustar o texto da nota do trial.

## O que NÃO muda

- Os 15 dias continuam individuais (cada um conta do seu próprio cadastro).
- Regras de acesso por academia, bloqueio de e-mail temporário e regra do celular continuam iguais.
- Nenhuma tela, cor, texto ou fluxo de pagamento é alterado — apenas as datas da campanha.
