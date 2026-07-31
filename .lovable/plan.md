# Cateterismo Vesical — conteúdo completo com imagens passo a passo

Hoje o mini app "Procedimentos de Enfermagem" já tem os módulos de SVD feminino, SVD masculino e técnica estéril, mas os três estão marcados como "Em breve", sem etapas e sem imagens. O plano é transformá-los em um conteúdo completo, no mesmo padrão da Punção Venosa Periférica (imagens fotorrealistas + texto técnico por etapa).

## O que será entregue

### 1. SVD Feminino — 12 etapas ilustradas
Preparo e checagem da prescrição, higiene das mãos, materiais e escolha do calibre, privacidade e posicionamento (ginecológica), abertura da bandeja e campo estéril, teste do balonete e lubrificação, higiene íntima/antissepsia no sentido correto, separação dos grandes/pequenos lábios e identificação do meato uretral, introdução do cateter (5–7 cm) até refluxo de urina, insuflação do balonete, conexão ao sistema fechado e fixação na coxa, registro em prontuário.

### 2. SVD Masculino — 12 etapas ilustradas
Mesma espinha dorsal, com as diferenças anatômicas: retração do prepúcio e antissepsia da glande em movimentos circulares, instilação de lidocaína gel uretral (10–20 mL), pênis tracionado a 90°, progressão de 18–22 cm com manobra de abaixamento na resistência do esfíncter externo, avanço adicional antes de insuflar o balonete, recolocação obrigatória do prepúcio (prevenção de parafimose) e fixação no abdome inferior.

### 3. Comparativo Homem × Mulher
Painel lado a lado: comprimento uretral, posicionamento, uso de anestésico, profundidade de introdução, ponto de resistência, calibres usuais, fixação e complicações mais frequentes de cada sexo.

### 4. Técnica estéril / prevenção de ITU-AC
Bundle de inserção e manutenção, sistema fechado, bolsa sempre abaixo do nível da bexiga, higiene diária, indicações e não-indicações de sondagem, critérios de retirada precoce, sinais de alerta (hematúria, ausência de refluxo, dor intensa, febre) e conduta em falso trajeto.

### 5. Texto do mini app (campo CONTEÚDO do Admin)
O mesmo material em markdown no campo editável do mini app, para você poder revisar/editar pelo Admin, com referências (ANVISA RDC 36/2013 e caderno de IRAS, COFEN, INS/CDC 2024–2025).

## Imagens

Serão geradas imagens clínicas fotorrealistas, uma por etapa: 12 para o módulo feminino e 12 para o masculino (24 no total), com enquadramento didático e respeitoso, mostrando mãos enluvadas, campo estéril e materiais — sem exposição gráfica desnecessária, no estilo já usado na punção venosa.

## Detalhes técnicos

- `src/data/procedimentos/svd-fem.ts` e `svd-masc.ts`: remover `emProducao`, preencher `materiais`, `indicacoes`, `contraindicacoes`, `complicacoes` e 12 `cenas` com `imagem`, título, descrição e alertas.
- `src/data/procedimentos/svd-esteril.ts`: bundle de prevenção de ITU-AC e comparativo homem × mulher.
- Imagens em `src/assets/procedimentos/svd-f-01..12.jpg` e `svd-m-01..12.jpg`, importadas como ES modules (mesmo padrão do `pva-*`).
- Novo componente de comparativo em `src/components/procedimentos/` exibido dentro do detalhe dos módulos de SVD.
- Migração para preencher `content_md` do mini app `procedimentos-enfermagem` com a seção de cateterismo vesical, preservando o conteúdo atual de punção venosa/flebite.
