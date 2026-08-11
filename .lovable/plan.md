# Análise técnica do CompleteRegistration

## Como está hoje (verificado no código)

- O cadastro (`AuthGate`) envia o e-mail de confirmação com destino `/trilha/{categoria}`.
- Na página `/trilha/{slug}` há um efeito que chama `getUser()`, confere se o e-mail está confirmado e se a conta é recente (24h) e dispara `CompleteRegistration` uma vez, gravando `adec_cr_<id>` no navegador.
- O Pixel completo (init + PageView) está apenas em `/adec`; fora dela o utilitário `meta-pixel.ts` carrega o Pixel sob demanda.

## Problemas encontrados

1. **Corrida com o login do link de confirmação (principal risco de evento não disparar).**
   Quando a pessoa chega pelo link do e-mail, a sessão ainda está sendo processada a partir do endereço. O código lê o usuário uma única vez, logo na abertura da página; se a sessão ainda não estiver pronta naquele instante, nada dispara e o evento é perdido para sempre naquele cadastro.

2. **Carregar o Pixel na trilha dispara um PageView extra.**
   Ao acionar o evento dentro do app, o utilitário também envia um `PageView` de página interna. Isso suja o relatório (PageViews de área logada misturados com os da landing).

3. **Janela de 24 horas descarta cadastros legítimos.**
   Quem confirma o e-mail no dia seguinte (muito comum) não gera conversão.

4. **Se a confirmação de e-mail estiver desativada no backend, o evento dispara sem confirmação real.**
   Nesse caso o cadastro já vem com e-mail marcado como confirmado e o evento sai no primeiro acesso — contrariando a regra "só após confirmar".

5. **Marca de "já disparado" presa ao navegador.**
   O link do e-mail costuma abrir no navegador interno do app de e-mail. Se a pessoa depois abrir no Chrome, o navegador não sabe que já disparou e pode enviar o evento de novo (duplicidade), pois o controle é local e o evento não leva identificador de deduplicação.

6. **Sem deduplicação/ID de evento e sem dados avançados de correspondência.**
   O Meta não consegue casar eventos repetidos nem atribuir bem a conversão; parte do volume se perde com bloqueadores e iOS.

## Correções propostas

- Substituir a leitura única por uma escuta do estado de login (com nova checagem quando a sessão ficar pronta), garantindo o disparo mesmo quando o link demora a autenticar.
- Ao disparar dentro do app, inicializar o Pixel **sem** enviar PageView extra; o PageView da landing continua igual.
- Ampliar a janela de 24 horas para 7 dias.
- Só disparar quando houver diferença real entre criação da conta e confirmação (indicando confirmação de verdade), ou confirmar que a exigência de confirmação está ativa no backend.
- Gravar a marca de disparo também no perfil do usuário no banco (campo simples de data), para valer em qualquer navegador/aparelho e eliminar duplicidade.
- Enviar o evento com um identificador único (`eventID`) baseado no usuário, preparando a deduplicação.

## Detalhes técnicos

- `src/lib/meta-pixel.ts`: `ensurePixel({ pageView = true })`; `trackOnce(event, key, opts)` passando `{ eventID }` ao `fbq`.
- `src/routes/trilha.$slug.tsx`: trocar o `useEffect` de leitura única por `supabase.auth.onAuthStateChange` + checagem inicial; janela de 7 dias; exigir `email_confirmed_at - created_at > ~2s` quando confirmação estiver ativa.
- Persistência: coluna `meta_cr_sent_at timestamptz` em `public.profiles` (migração + grant/policy de update do próprio perfil), verificada antes do disparo e gravada depois; `localStorage` permanece como cache rápido.
