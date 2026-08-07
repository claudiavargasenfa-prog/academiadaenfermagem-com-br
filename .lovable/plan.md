# Corrigir o Guia de Punção Venosa Periférica

Foco exclusivo: **Punção Venosa Periférica** (não cateterismo vesical).

## O que eu confirmei agora (sem alterar nada)

- O guia tem 13 etapas em `puncao-adulto.ts`.
- Existem **7 fotos reais suas** já enviadas ao projeto: garroteando, tateando, assepsia, puncionando 1, puncionando 2, retirando agulha e identificação.
- As outras 6 etapas (preparo, higiene das mãos, posicionamento, calibre, conexão, salinização) usam imagens genéricas antigas, não fotos suas.
- O que **não** consegui confirmar: se essas fotos realmente aparecem na tela para você. Isso é o primeiro passo abaixo.

## Passo 1 — Diagnóstico visual (antes de qualquer mudança)

Abrir o guia no navegador, entrar em "Punção Venosa Periférica" e tirar prints de cada etapa. Isso responde de forma definitiva:

- as fotos carregam ou aparecem quebradas/em branco?
- o problema é a imagem em si, ou a área de exibição fica achatada e você só vê texto?

Sem esse print, qualquer conserto é chute — e foi isso que consumiu créditos sem resultado.

## Passo 2 — Correção conforme o que o print mostrar

Só um destes caminhos será executado, o que o diagnóstico indicar:

- **Se as fotos não carregam:** corrigir o caminho/servimento das imagens no player.
- **Se carregam mas não aparecem:** corrigir a altura e o enquadramento do palco de imagem no `ProcedimentoPlayer`, garantindo foto grande e visível em celular e desktop.
- **Se aparecem cortadas:** ajustar o enquadramento para mostrar a foto inteira.

## Passo 3 — Layout de estudo, não de "player"

Além do passo a passo navegável, exibir a sequência completa em lista vertical: foto grande + número da etapa + título + descrição + alerta técnico. Assim você e o aluno veem todas as fotos de uma vez, sem depender de clicar em setas.

## Passo 4 — Validação obrigatória antes de encerrar

Print de tela de cada etapa com a foto visível. Só então digo que está pronto. Se alguma etapa continuar sem foto, eu digo qual é, em vez de afirmar que está tudo certo.

## Fora do escopo

Não mexo em flebite, cateterismo vesical, outros guias, banco de dados nem em nada de design fora dessa tela.

## Detalhes técnicos

- `src/data/procedimentos/puncao-adulto.ts` — sequência das 13 etapas.
- `src/components/procedimentos/ProcedimentoPlayer.tsx` — palco da imagem, miniaturas e a nova lista vertical.
- `src/routes/procedimentos-enfermagem.tsx` — remoção do pré-carregamento apontando para caminhos `/lovable-uploads/` antigos, que não correspondem mais às imagens atuais.
