# Liberar o período grátis para quem está tentando se cadastrar

## O que está acontecendo

No cadastro existe uma trava antifraude que compara dois dados antes de liberar os 15 dias:

1. o número de celular informado;
2. uma "impressão digital" do aparelho/navegador (device id).

No banco há apenas 3 registros dessa trava e 4 assinaturas de teste criadas — ou seja, quase ninguém realmente usou o período grátis. Mesmo assim as pessoas recebem a mensagem "Detectamos que você já utilizou seu período grátis".

A causa mais provável é a impressão digital do aparelho: aparelhos parecidos (mesmo modelo de celular + mesmo navegador Chrome Android) geram o mesmo código, então pessoas diferentes são confundidas com alguém que já se cadastrou. Um mesmo celular usado por duas pessoas também é barrado.

## O que será feito

1. **Parar de bloquear pelo aparelho.** O device id continua sendo gravado (para você ver depois no histórico), mas não bloqueia mais ninguém.
2. **Bloquear só por celular repetido**, e mesmo assim apenas quando aquele celular realmente já teve um período grátis. O bloqueio por número continua valendo para evitar cadastro em série.
3. **Durante a campanha (10/08 a 10/09/2026), liberar todo mundo**, como você definiu: qualquer pessoa que chegar pela landing page ou por link recebe os 15 dias. A trava por celular volta a valer automaticamente depois de 10/09.
4. **Limpar os registros antigos** de impressão digital que possam estar barrando pessoas agora.
5. **Testar um cadastro novo** para confirmar que a conta é criada e já entra com os 15 dias.

Nada de layout, textos, cores, pagamentos, rotas ou Meta Pixel será alterado.

## Detalhes técnicos

- `src/lib/trial-guard.functions.ts`: em `checkTrialEligibility`, remover `device_id` da condição `.or(...)` (mantendo a gravação em `recordTrialFingerprint`); retornar `{ allowed: true }` enquanto `now <= TRIAL_FREE_UNTIL` (`src/lib/trial-window.ts`); manter o bloqueio de e-mails descartáveis e a política de "falha aberta" em caso de erro.
- Limpeza de dados via ferramenta de dados: apagar/neutralizar linhas de `trial_fingerprints` sem assinatura de trial correspondente.
- Sem mudanças no `handle_new_user()` (a concessão do trial já está correta) e sem mudanças em `AuthGate.tsx`.
