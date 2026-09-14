# Cuidando de Quem Cuida: tudo escrito e editável por você

## O problema real

A tela desse mini app é desenhada dentro do programa e só aparece quando o endereço é exatamente `SAUDEMENTALPROF.` (com o ponto final). Todo o texto dela está preso no código: espelho, cartões de humor, sinais, respiração, diário e SOS. Por isso, o que você escreve no painel nunca substitui aquilo — e qualquer variação do endereço quebra a página.

## O que vou fazer

1. **Apagar a tela desenhada.** O mini app deixa de ter tratamento especial e passa a funcionar igual a todos os outros: mostra o que estiver escrito no painel, e só isso.
2. **Escrever todo o conteúdo no painel.** Transfiro para o campo de conteúdo o texto completo da jornada, já organizado com títulos, parágrafos, listas e destaques: apresentação, como você está chegando, sinais no corpo/mente/emoções, rede de apoio, respiração e pausa, diário, direitos e canais de ajuda (CVV 188, SAMU 192). Tudo em texto que você pode alterar, acrescentar ou apagar quando quiser.
3. **Acabar com a dependência do endereço exato.** Sem o tratamento especial, não importa se o endereço tem ponto ou não: a página sempre mostra o conteúdo salvo.
4. **Remover os arquivos da tela antiga**, para não sobrar código morto atrapalhando futuras edições.

## Depois da mudança

- Você edita tudo pelo painel, no mesmo lugar dos outros mini apps.
- O que salvar aparece na hora ao voltar para a página.
- As partes interativas (respiração animada, diário, humor) deixam de existir; elas eram fixas e impediam sua edição. Se depois quiser alguma delas de volta, eu recrio como recurso à parte, sem travar o texto.

## Detalhes técnicos

- Em `src/components/MiniAppContent.tsx`, remover o desvio `if (slug === "SAUDEMENTALPROF.")` (linhas 161–166) e o import de `CuidandoQuemCuida`, deixando o fluxo padrão de `content_md`.
- Excluir `src/components/miniapps/CuidandoQuemCuida.tsx` e `CuidandoQuemCuidaPremium.tsx`; conferir e limpar `src/data/cuidandoDeQuemCuida.ts` e `cuidandoDeQuemCuidaDesign.ts` se ficarem sem uso.
- Gravar o texto completo em `mini_apps.content_md` do slug `SAUDEMENTALPROF.` (hoje com 1 caractere), em markdown compatível com `renderContent`.
- Sem mudanças em acesso, pagamentos, academias ou placements.
- Registrar a tarefa em `roadmap.md` ao iniciar a execução.

## Verificação

Abrir `/app/SAUDEMENTALPROF.`, conferir o conteúdo completo, editar um trecho no painel e confirmar que a alteração aparece.
