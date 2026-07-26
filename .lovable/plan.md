## Objetivo

Fazer os dois módulos do seu HTML funcionarem de verdade dentro do mini app:

1. **Gotejamento** — informar Volume (mL) + Tempo (horas **ou** minutos) e o sistema calcula automaticamente **macrogotas (gts/min)**, **microgotas (mgts/min)** e **mL/h (bomba)**.
2. **Dose pediátrica por Kg** — informar dose (mg/Kg/dia), peso, vezes ao dia, concentração e volume do líquido, e o sistema calcula **mg/dia**, **mg/dose** e **mL por dose**.

## Por que hoje não funciona

O conteúdo dos mini apps é injetado como HTML no React. Handlers escritos direto no HTML (`oninput="..."`, `<script>`) não são executados de forma confiável nesse caminho — por isso os campos ficam com `--`. Os mini apps que já funcionam (SAE Descomplicada, Coleta de Dados/Admissão de Turno) usam um motor nativo em `src/components/MiniAppContent.tsx` que reconhece o bloco pela classe e liga os campos por ID.

## O que será feito

- Em `src/components/MiniAppContent.tsx`, adicionar um motor nativo que detecta o bloco pela classe `central-calculos-enfermagem`.
- Ele liga os inputs pelos IDs que você já usa (`got-v`, `got-th`, `got-tm`, `ped-dose`, `ped-peso`, `ped-fraca`, `ped-conc`, `ped-liq`) e escreve nos resultados (`out-gotas`, `out-microgotas`, `out-mlhora`, `out-mg-dia`, `out-mg-dose`, `out-ml-ped-final`).
- Regras de cálculo:
  - Horas: macrogotas = Volume ÷ (Horas × 3); microgotas = mL/h = Volume ÷ Horas.
  - Minutos: macrogotas = (Volume × 20) ÷ min; microgotas = (Volume × 60) ÷ min; mL/h = (Volume × 60) ÷ min.
  - Pediatria: mg/dia = dose × peso; mg/dose = mg/dia ÷ vezes; mL/dose = (mg/dose × volume do líquido) ÷ concentração.
  - Se os dois campos de tempo estiverem preenchidos, **minutos tem prioridade** e o campo de horas fica visualmente atenuado (evita erro de leitura).
- Limpeza automática (`--`) quando os campos estiverem vazios ou inválidos, e proteção contra divisão por zero.

## Sem mudanças de design ou conteúdo

O HTML que você escreveu (cores, cards, textos, medidas) permanece exatamente igual. Só passa a ter cérebro por trás. Você continua colando o mesmo HTML no admin do mini app.

## Detalhes técnicos

- Ativação via `useEffect` no `MiniAppHtmlContent`, com listeners `input` delegados no container e `cleanup` no desmonte — mesmo padrão dos motores SAE/Coleta já existentes.
- Nenhuma alteração de banco, rota ou backend.
