# Por que suas edições não aparecem em "Cuidando de Quem Cuida"

## O que está acontecendo (confirmado no código)

Esse mini app é o único que tem uma tela própria, desenhada à mão (a jornada com espelho, humor, sinais, respiração, diário, SOS). Todo o texto dessa tela está fixo dentro do código.

Quando você edita o conteúdo no Admin, o texto **é salvo corretamente no banco** e até chega até a tela — mas a tela simplesmente o ignora e descarta. Por isso nada muda, por mais que você edite e salve.

Ou seja: não é erro seu, não é cache, não é o site fora do ar. É a tela que nunca foi ligada ao texto do Admin.

## Como resolver de vez

1. **Ligar o texto do Admin à jornada.** O que você escrever no Admin passa a aparecer de verdade, logo no começo da jornada, formatado com o visual da página (títulos, parágrafos, destaques, listas).
2. **Atualização imediata.** Hoje a página pode segurar a versão antiga por até um minuto. Passa a recarregar o conteúdo ao voltar para a tela, então você salva no Admin, volta e já vê.
3. **Aviso claro no Admin.** Quando o campo estiver vazio, a jornada continua exibindo o conteúdo padrão, sem buraco na página.
4. **Deixar explícito o que é editável.** As partes desenhadas (espelho, cartões de humor, radar de sinais, respiração, diário, SOS) continuam fixas por design; o bloco editável é o texto de apresentação/conteúdo. Se você quiser depois editar também as seções internas, isso é um trabalho maior e faço em seguida.

## Detalhes técnicos

- `src/components/miniapps/CuidandoQuemCuida.tsx` recebe `editableContent` e o descarta (`_editableContent`), repassando nada para `CuidandoQuemCuidaPremium`.
- Passar `editableContent` para `CuidandoQuemCuidaPremium` e renderizá-lo com `renderContent` de `src/lib/markdown.tsx`, em uma seção nova logo após o herói, com as classes tipográficas da jornada.
- Em `src/components/MiniAppContent.tsx`, na query `mini_app_content`, reduzir `staleTime` e ativar `refetchOnMount`/`refetchOnWindowFocus` para o slug `SAUDEMENTALPROF.`, para que o salvamento no Admin reflita na volta à página.
- Nenhuma mudança em banco, acesso, pagamentos, academias ou placements.

## Verificação

Editar o conteúdo no Admin, abrir `/app/SAUDEMENTALPROF.` e confirmar que o texto novo aparece; conferir no celular e no computador.
