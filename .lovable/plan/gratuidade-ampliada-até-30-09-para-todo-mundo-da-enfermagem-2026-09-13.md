# Gratuidade ampliada até 30/09 para todo mundo da enfermagem

## O que muda

1. **Quem já perdeu o acesso volta a ter**
   Todos os testes gratuitos que já venceram são reativados e passam a valer até **30/09/2026**, 23h59. Quem ainda está no teste também tem a data esticada para 30/09/2026 (ninguém perde dias).

2. **Durante a gratuidade, acesso às 4 academias**
   Enquanto a pessoa estiver no período gratuito, ela abre o conteúdo das quatro academias (Acadêmico, Estudante de Técnico, Técnico/Auxiliar e Enfermeiro). Quando o teste acaba, volta a regra normal: só o que o plano pago dá, e os mini apps gratuitos continuam livres.

3. **Cadastro com a área de atuação**
   A tela de cadastro já pede a categoria; os nomes ficam mais claros:
   - Estudante de Técnico
   - Acadêmico (graduação em Enfermagem)
   - Técnico/Auxiliar
   - Enfermeiro
   A categoria continua definindo a academia principal e o plano depois do teste.

## O que NÃO muda

- Os 15 dias individuais de quem se cadastrar de agora em diante.
- Regras de pagamento, planos, certificados e bloqueio por celular/e-mail.
- Quem não tem teste nem plano continua vendo só os mini apps gratuitos.
- Administrador segue com acesso total.

## Detalhes técnicos

- **Dados**: `UPDATE public.user_subscriptions` nas linhas `was_trial = true` (status `trial` ou `expired`) definindo `status = 'trial'` e `expires_at = '2026-09-30 23:59:59-03'` quando a data atual for menor.
- **Banco**: `has_app_access` ganha um ramo — se existir assinatura com `status = 'trial'` e `expires_at > now()`, o acesso é concedido a qualquer mini app ativo, sem depender do `plan_slug`/`mini_app_placements`.
- **Frontend**: em `src/lib/access.ts`, a checagem por academia passa a conceder acesso quando houver assinatura `trial` ativa (qualquer `plan_slug`), mantendo a regra atual para `active`.
- **Cadastro**: `src/components/AuthGate.tsx` — ajuste apenas dos rótulos das quatro opções (valores `academico`, `tecnico-estudante`, `tecnico`, `enfermeiro` permanecem).
- Sem mudança em `trial-window.ts` (campanha já vai até 30/09/2026) nem em `handle_new_user`.
