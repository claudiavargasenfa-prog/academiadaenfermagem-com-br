# Disparar CompleteRegistration só após confirmação do e-mail

## Situação atual
O Pixel só existe na página pública /adec (init + PageView). O link de confirmação do e-mail leva o novo aluno para /trilha/{categoria}, uma página onde o Pixel nem sequer é carregado. Hoje nenhum evento de conversão é disparado.

## O que será feito

1. **Carregador único do Pixel**
   Criar um pequeno arquivo utilitário que carrega o Pixel (mesmo ID 2479743902438109) apenas uma vez, sem duplicar o que já existe em /adec, e uma função para disparar eventos.

2. **Disparo do CompleteRegistration na chegada ao app**
   Na página /trilha/{categoria} (destino do link de confirmação), o evento é disparado somente quando todas estas condições forem verdadeiras:
   - o usuário está autenticado (sessão válida);
   - o e-mail está confirmado na conta;
   - a conta é nova (confirmada há pouco / ainda não marcada como convertida).

3. **Uma única vez por cadastro**
   Depois de disparar, grava uma marca permanente no navegador vinculada ao identificador do usuário (ex.: `adec_cr_<id>`), impedindo novo disparo em futuros logins ou recarregamentos.

4. **Nada dispara em caso de erro ou no clique**
   O botão "Criar conta" continua sem qualquer evento de conversão; erros de cadastro não disparam nada.

5. **PageView intacto**
   O PageView de /adec continua exatamente como está.

## Detalhes técnicos
- Novo arquivo `src/lib/meta-pixel.ts`: `ensurePixel()` (injeta o snippet se `window.fbq` não existir, com `init` + `PageView`) e `trackOnce(event, key)`.
- Em `src/routes/trilha.$slug.tsx`: `useEffect` que chama `supabase.auth.getUser()`; se `user.email_confirmed_at` existir e não houver a chave `adec_cr_<user.id>` no localStorage, chama `ensurePixel()` e `fbq('track','CompleteRegistration')`, depois grava a chave.
- Salvaguarda contra contas antigas: só dispara se `email_confirmed_at` for recente (últimas 24h) ou se o cadastro (`created_at`) for recente, evitando conversões falsas de usuários já existentes.
- Nenhum outro arquivo é alterado.
