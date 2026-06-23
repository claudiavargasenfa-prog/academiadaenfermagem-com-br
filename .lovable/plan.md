# PDF restrito: Relatório ABNT e Prescrição

## Respondendo suas dúvidas

**1. Só o Relatório ABNT gera PDF hoje?**
Sim. Hoje só ele tem botão de imprimir/salvar. As outras telas (trilhas, calculadora, procedimentos, etc.) já têm proteção contra cópia/print via `ContentProtection`.

**2. Tem custo pra você enviar PDF pro email do aluno?**
Sim, envio de email tem custo de infra (mesmo no plano gratuito da Lovable, passa a cobrar acima de ~3.000/mês). Como você escolheu **sem email**, fica custo zero — o aluno salva/imprime direto no navegador.

**3. Quando eu colar o material da Prescrição, já fica livre pra impressão?**
Sim — vou deixar a página de Prescrição já pronta com o botão "Baixar PDF / Imprimir" ativo. Quando você colar o conteúdo, ele já sai imprimível automaticamente, sem precisar mexer em nada.

## O que vou fazer

1. **Criar rota `/prescricao`** (`src/routes/prescricao.tsx`)
   - Mesma estrutura visual do Relatório ABNT (AppShell, layout limpo pra impressão)
   - Área de conteúdo pronta pra você colar o material
   - Botão "Baixar PDF / Imprimir" usando `window.print()` + CSS `@media print` (mesma técnica do ABNT, sem biblioteca externa, custo zero)
   - **Sem** `ContentProtection` nessa página (pra permitir o print)

2. **Garantir que SÓ essas 2 rotas permitem impressão**
   - Conferir que `ContentProtection` está ativo nas demais (já está, mas valido)
   - Relatório ABNT e Prescrição ficam liberados; o resto continua bloqueado contra print/cópia

3. **Sem envio por email** — nenhuma integração de email será adicionada (custo zero pra você)

## Detalhes técnicos

- PDF gerado pelo próprio navegador (Ctrl+P → "Salvar como PDF"), funciona em celular e PC
- Sem bibliotecas (`jspdf`, `html2pdf`) — mantém o app leve
- CSS de impressão esconde header/footer/botões, deixa só o conteúdo
