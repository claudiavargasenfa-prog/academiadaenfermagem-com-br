Vou corrigir os dois pontos como auditoria técnica, sem mexer no design do app:

1. Corrigir o erro 404 no primeiro acesso ao teste grátis
- Ajustar todos os botões “Experimentar Grátis / 15 dias grátis” que ainda apontam para `/trilha/...` sem cadastro.
- Na loja principal, trocar esse caminho para abrir diretamente o cadastro com a categoria selecionada: `/?cadastro=academico`, `/?cadastro=tecnico-estudante`, `/?cadastro=tecnico` ou `/?cadastro=enfermeiro`.
- Padronizar o texto para “Experimentar 15 dias grátis”, evitando qualquer fluxo antigo.

2. Evitar que a página dê 404 enquanto os dados carregam
- Na página da trilha, impedir que ela jogue 404 antes de terminar de buscar o aplicativo.
- Mostrar carregamento enquanto `app`, seções, mini apps e permissões ainda estão sendo consultados.
- Só exibir 404 se, depois da consulta concluída, o app realmente não existir.

3. Melhorar a opção de sair da conta
- Manter o botão “Sair” no topo para desktop.
- Adicionar “Sair” também no menu do celular e na barra inferior, porque hoje no celular ele fica escondido/ausente.
- Ao sair, fechar a sessão e voltar para a tela inicial/login, permitindo entrar com outra conta ou admin.

4. Ajustar detalhes de consistência
- Garantir que o app “Estudante de Técnico” continue aceito no cadastro.
- Conferir os textos públicos ainda com “30 dias grátis” e trocar para “15 dias grátis” onde estiver visível.

Arquivos principais a alterar:
- `src/routes/index.tsx`
- `src/routes/trilha.$slug.tsx`
- `src/components/AppShell.tsx`
- possivelmente `src/components/AuthGate.tsx` apenas se necessário para melhorar a saída/redirecionamento.

Resultado esperado:
- No primeiro clique em “Experimentar 15 dias grátis”, a pessoa cai direto no cadastro correto, sem 404.
- Usuário comum consegue sair da conta no celular e no computador.
- Você consegue sair e entrar como admin sem ficar presa na conta anterior.