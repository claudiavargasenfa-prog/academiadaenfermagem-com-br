# Correção definitiva do acesso ao aplicativo

## Objetivo
Garantir que alunos e administradora consigam entrar pelo domínio oficial usando e-mail/senha ou Google, sem ficarem presos na tela de entrada.

## O que foi confirmado
- O sistema de contas e o banco estão ativos e respondendo normalmente.
- Os registros mais recentes mostram entradas concluídas com sucesso tanto por e-mail/senha quanto pelo Google.
- Também existe registro de uma sessão antiga tentando reutilizar um acesso já vencido.
- Atualmente, após a senha ser aceita, a tela depende apenas de uma atualização automática da sessão e não confirma nem direciona explicitamente a pessoa para dentro do aplicativo.
- No acesso pelo Google, qualquer falha aparece apenas como “Não foi possível entrar com Google”, escondendo a causa real.

## Correções
1. Revalidar e ativar explicitamente as duas formas de acesso: e-mail/senha e Google.
2. Após uma senha correta, confirmar a nova sessão e abrir a área da pessoa imediatamente.
3. Após o retorno do Google, concluir a sessão no domínio oficial e direcionar para a página solicitada.
4. Detectar sessão antiga, inválida ou já utilizada, limpá-la com segurança e permitir uma nova entrada sem travar o aplicativo.
5. Trocar a mensagem genérica do Google por mensagens claras em português, incluindo cancelamento, conta não permitida, sessão vencida e falha de conexão.
6. Impedir tentativas duplicadas enquanto o acesso está sendo processado.

## Verificação
- Testar entrada por e-mail/senha em uma janela limpa.
- Testar entrada pelo Google em uma janela limpa.
- Confirmar abertura da Minha Conta e de uma Academia após cada método.
- Confirmar saída e nova entrada sem reaproveitar sessão vencida.
- Conferir o funcionamento no celular e no computador, usando o domínio oficial.
