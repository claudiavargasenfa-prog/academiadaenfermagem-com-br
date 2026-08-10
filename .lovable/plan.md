# Organizar a área de Teste de Links

Nenhum link será alterado, criado ou removido. A mudança é só de organização visual e de rótulos na tela de teste.

## O que está errado hoje

Na tela, os planos são separados por categoria comparando o começo do slug. Como "tecnico" é o começo de "tecnico-estudante", os planos do Estudante de Técnico aparecem misturados dentro do bloco TÉCNICO (e repetidos no bloco Estudante). Além disso, a ordem é a de cadastro, não Mensal → Trimestral → Semestral → Anual, e os planos sem sufixo não mostram "(Mensal)".

## O que vou fazer

1. **Ordem igual para todos**: em cada bloco, os cartões passam a aparecer nesta sequência: Mensal, Trimestral, Semestral, Anual. Quem não tem período escrito no nome passa a exibir "(Mensal)".
2. **Separação correta**: os planos do Estudante de Técnico saem do bloco TÉCNICO e ficam só no bloco dele. O bloco TÉCNICO fica apenas com os 4 planos do técnico.
3. **Posições pedidas**:
   - Coluna esquerda: ACADÊMICO e, logo abaixo, ENFERMEIRO com cerca de 2 cm de distância.
   - Coluna direita: TÉCNICO no lugar onde já está e, cerca de 2 cm abaixo, ESTUDANTE DE TÉCNICO.
4. **Nome corrigido**: o bloco passa a se chamar "Estudante de Técnico em Enfermagem" e os cartões ficam com nomes curtos e padronizados (ex.: "Academia do Estudante de Técnico (Semestral)").

## Detalhes técnicos

- Arquivo único: `src/components/admin/PaymentTester.tsx`.
- Categoria por lista explícita de slugs (não mais `startsWith`), com o Estudante de Técnico avaliado antes do Técnico.
- Período derivado do sufixo do slug (`-trimestral`, `-semestral`, `-anual`, incluindo variantes `-v2`); sem sufixo = mensal. Ordenação por esse período.
- Rótulo do cartão montado na interface (nome base do app + período), sem tocar em `subscription_plans` nem em `mp_link`.
- Layout: duas colunas, cada uma com duas seções empilhadas e espaçamento de ~2 cm (`gap-[2cm]`).
