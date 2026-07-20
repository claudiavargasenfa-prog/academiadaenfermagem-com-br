Plano para corrigir sem mexer no design nem fazer tentativa aleatória:

1. Confirmar o fluxo exato que falha
- Testar em navegador limpo o acesso direto a `/planos/academico` e o clique em “Experimentar 15 dias grátis”.
- Verificar se o erro é 404 da página do app, 404 de rede, ou versão antiga do app sendo carregada.

2. Corrigir a causa mais provável encontrada no código
- O app hoje tem PWA/cache de páginas habilitado para navegação, inclusive páginas públicas. Isso pode entregar uma versão antiga no primeiro acesso e só atualizar na segunda tentativa.
- Vou alterar o cache para não servir página antiga em rotas críticas de venda/cadastro: `/`, `/planos/*` e links com `cadastro`.
- Manter cache de arquivos estáticos para o app continuar leve, mas impedir cache velho em página de compra/cadastro.

3. Tornar o teste grátis mais robusto
- Manter os botões “Experimentar 15 dias grátis” apontando para cadastro correto.
- Se necessário, trocar o fluxo de `/?cadastro=academico` para uma rota real de cadastro por plano, para evitar depender de query string no primeiro carregamento.
- Garantir as quatro categorias: Acadêmico, Estudante de Técnico, Técnico e Enfermeiro.

4. Validar antes de dizer que está resolvido
- Abrir `/planos/academico` em sessão limpa.
- Clicar em “Experimentar 15 dias grátis”.
- Confirmar que abre o cadastro na primeira tentativa, sem 404.
- Repetir com pelo menos mais um plano para garantir que não ficou corrigido só no Acadêmico.

Detalhe técnico:
- Arquivos prováveis: `vite.config.ts`, `src/routes/index.tsx`, `src/routes/planos.$slug.tsx`, `src/components/AuthGate.tsx`.
- Não vou alterar conteúdo visual, textos de landing page ou design; é uma correção técnica de rota/cache/cadastro.