# Restaurar a ligação existente com o GitHub

## Diagnóstico confirmado pelas telas
- O Lovable mostrou “Old repository unlinked” para `claudiavargasenfa-prog/academiadaenfermagem-com-br`.
- Após clicar em “Restore link”, a tela continua em “Connect project”, sem confirmar um repositório ligado.
- A configuração do aplicativo Lovable no GitHub mostra o repositório original entre os autorizados. Também há um repositório com sufixo `-d88d4830`, mas não há confirmação de que ele está ligado a este projeto.
- A documentação oficial não oferece uma recuperação segura para esse resultado da restauração; orienta procurar o suporte quando a ligação original não retorna.

## Próximo passo seguro
Abrir [o suporte do Lovable](https://lovable.dev/support), enviar as telas anteriores e copiar esta mensagem:

> Preciso restaurar a sincronização deste projeto com claudiavargasenfa-prog/academiadaenfermagem-com-br, branch main. A tela mostrou “Old repository unlinked”. Cliquei em “Restore link”, mas o aviso desapareceu e continua “Connect project”, sem repositório ligado. O aplicativo Lovable tem acesso ao repositório original no GitHub. A alteração a292617 existe no GitHub, mas não chegou ao Lovable. Solicito recuperar a ligação original sem criar outro repositório, sem sobrescrever alterações e sem afetar o aplicativo publicado. Há também um repositório autorizado com sufixo -d88d4830; peço que verifiquem a associação correta.

## Depois da recuperação
1. Conferir que a tela do Lovable mostra o repositório original ligado.
2. Verificar se a alteração da página ADEC chegou à prévia.
3. Atualizar o site publicado somente quando solicitado.

## Proteções e bloqueio
- Não clicar em “Connect” como tentativa: a documentação informa que essa ação cria outro repositório.
- Não excluir, renomear ou desconectar repositórios.
- Não alterar código para tentar corrigir uma ligação gerenciada pelo Lovable.
- A restauração depende do suporte; não há ferramenta disponível neste chat para executar essa recuperação.