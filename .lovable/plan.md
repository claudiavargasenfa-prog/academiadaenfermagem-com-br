# Ajuste no banner de fim de gratuidade e rastreio de cliques

## O que será feito

1. Remover o valor "R$ 0,00/mês" do texto do banner de contagem regressiva da gratuidade (`src/components/TrialCountdownBanner.tsx`). O corpo do aviso ficará genérico, chamando para associar-se sem mostrar preço. O botão "SER ASSOCIADO" continua levando à página do plano, onde o preço real será exibido.

2. Contabilizar cliques no botão "SER ASSOCIADO" do mesmo banner. Adicionar rastreamento via Meta Pixel com evento padrão de conversão (`InitiateCheckout` ou `Lead`) ao clicar no CTA, para que seja possível ver quantas pessoas clicaram.

## Detalhes técnicos

- Em `src/components/TrialCountdownBanner.tsx`:
  - Substituir a frase que concatena `R$ ${priceLabel}/mês` por uma frase sem valor (ex.: "...acesse o link e seja um associado.").
  - Manter o link para `/planos/$slug` e o preço sendo exibido normalmente na página de planos.
  - Adicionar `onClick` no `Link` do CTA que dispara o evento do Meta Pixel usando a função existente em `src/lib/meta-pixel.ts`.

- Sem alteração de layout, cores, rotas ou banco de dados.
