# Corrigir “Cuide da Sua Saúde Mental” sem perder o conteúdo

## Diagnóstico confirmado

- O Mini App **CUIDE DA SUA SAÚDE MENTAL** está ativo e vinculado à **Academia da Saúde Mental**.
- O conteúdo está salvo: são **9.915 caracteres**, portanto não está vazio nem perdido.
- O campo de endereço foi salvo como **“Saúde mental”**, sem a barra inicial e sem corresponder a uma página existente. O cartão prioriza esse endereço inválido e termina no erro 404.

## Correção

1. Trocar o endereço do Mini App por uma rota interna válida e estável: `/app/cuide-da-sua-saude-mental`.
2. Normalizar o identificador para `cuide-da-sua-saude-mental`, sem espaço, acento ou letra maiúscula.
3. Preservar integralmente o conteúdo já salvo, o vínculo com a Academia da Saúde Mental e o acesso gratuito.
4. Ajustar o painel Admin para impedir que novos endereços internos sejam salvos sem `/`, evitando a repetição desse 404.
5. Atualizar a cópia do conteúdo no projeto para refletir o nome e endereço corrigidos.

## Validação

- Abrir a Academia da Saúde Mental no celular.
- Clicar em **CUIDE DA SUA SAÚDE MENTAL**.
- Confirmar que a página abre, mostra o conteúdo existente e não apresenta 404.
- Conferir que a edição pelo painel Admin continua funcionando.
