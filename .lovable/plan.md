## Objetivo
Transformar o app "Academia da Enfermagem" em um PWA instalável, que funcione offline no celular do aluno/profissional, sem quebrar login, Lovable Cloud, nem preview.

## O que o usuário vai ganhar
- **Instalar no celular** (Android/iOS) como se fosse app de loja, com ícone na tela inicial e sem barra do navegador.
- **Abrir sem internet**: SAE Descomplicada, Escalas Clínicas, Quizzes, Procedimentos, Calculadora — tudo já embarcado no app funciona offline.
- **Rascunhos salvos no aparelho**: evolução, prescrição e diário já usam `localStorage`, então continuam salvos mesmo sem sinal.
- **Login persistente**: exige internet só na primeira vez; depois a sessão fica guardada por semanas.
- **Atualizações automáticas**: quando o app publicado ganhar uma versão nova, o celular atualiza sozinho da próxima vez que abrir com internet.

## O que continua exigindo internet (e por quê)
- Primeiro login e cadastro (validação no servidor).
- Sincronizar entre 2 celulares (dados locais ficam no aparelho).
- Ditado por voz (Web Speech API depende do Google).
- Painel do admin (lê/escreve no banco em tempo real).

## Passos técnicos

1. **Instalar `vite-plugin-pwa`** e configurá-lo em `vite.config.ts` com:
   - `registerType: "autoUpdate"`
   - `injectRegister: null` e `devOptions.enabled: false` (não registra em dev/preview)
   - `workbox`: `NetworkFirst` para navegações HTML, `CacheFirst` só para assets com hash, exclui `/~oauth` e rotas `/api/*`
   - `manifest`: reaproveita o `public/manifest.webmanifest` existente (nome, cores, ícones 192/512 já prontos)

2. **Criar `src/lib/pwa-register.ts`** — wrapper único de registro do service worker, que só registra quando:
   - `import.meta.env.PROD` for verdadeiro
   - não estiver dentro de iframe
   - hostname NÃO for `id-preview--*`, `preview--*`, `lovableproject.com`, `lovableproject-dev.com`, `beta.lovable.dev`
   - URL não tiver `?sw=off` (kill switch de emergência)
   Em qualquer contexto recusado, desregistra SW antigo de `/sw.js`.

3. **Chamar o wrapper** uma única vez em `src/routes/__root.tsx` dentro de `useEffect`.

4. **Confirmar que o manifest está linkado no `<head>`** (já está em `__root.tsx`) e que os ícones 192/512 existem em `public/`.

5. **Não mudar nada em**: Supabase client, rotas autenticadas, SAE, Escalas, Quizzes, admin. O banco mestre da SAE já está embarcado em `src/data/sae-banco.json` — offline nativo.

## Como testar
- No **preview do Lovable**: SW **não** registra (proteção intencional) — nada muda visualmente.
- Depois de **Publicar**: abrir `academiadaenfermagem.com.br` no celular → menu do navegador → "Instalar app" / "Adicionar à tela inicial" → abrir em modo avião → SAE, Escalas, Quizzes carregam.

## Riscos e mitigação
- **Cache preso após atualização**: `autoUpdate` + `NetworkFirst` para HTML resolvem; kill switch `?sw=off` disponível se algo travar.
- **iOS é mais restrito**: instalação via "Compartilhar → Adicionar à Tela de Início" (Safari). Funciona, mas o usuário precisa saber o caminho — vou deixar uma mensagem curta na tela inicial explicando.

Sem mexer em design, conteúdo, ou lógica de negócio. Só infraestrutura.
