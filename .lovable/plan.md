# Correção definitiva do site saindo do ar

## Diagnóstico confirmado
- O Lovable Cloud está saudável: cadastro, autenticação e banco respondem normalmente.
- A tela de erro nasce no navegador: a versão carregada tentou abrir a conexão sem receber os dois dados públicos necessários e interrompeu toda a página.
- Há um segundo problema que mantém a falha: o aplicativo guarda páginas completas antes de consultar a versão nova, por até 30 dias. Assim, uma versão quebrada pode continuar aparecendo mesmo após uma correção.
- A Área VIP usa essa conexão logo ao abrir, por isso foi uma das páginas afetadas.

## O que será corrigido
1. **Garantir a ligação em toda versão**
   - Ajustar a configuração de geração do site para sempre incluir os dados públicos gerenciados do Lovable Cloud na prévia e no site publicado.
   - Não trocar chaves privadas, não expor dados sigilosos e não alterar contas de alunos.

2. **Eliminar a versão quebrada guardada no aparelho**
   - Remover a regra que guarda páginas inteiras por 30 dias antes de buscar a versão atual.
   - Fazer páginas navegáveis consultarem primeiro a versão atual, mantendo apenas arquivos seguros para funcionamento offline.
   - Trocar os nomes dos armazenamentos e apagar automaticamente os antigos, inclusive o que pode estar entregando a tela quebrada agora.

3. **Impedir queda total por falha de conexão**
   - Proteger a entrada e a Área VIP para uma oscilação momentânea mostrar uma mensagem local com nova tentativa, sem derrubar todo o site.
   - Manter loja e páginas públicas abertas mesmo se a autenticação estiver temporariamente indisponível.

4. **Validar antes de concluir**
   - Testar entrada, loja, Área VIP e “Cuidando de Quem Cuida” na prévia.
   - Conferir que a página nova substitui a versão antiga guardada.
   - Conferir o site publicado e o domínio próprio após a atualização.

## Fora do escopo
- Nenhuma mudança em pagamentos, alunos, assinaturas, conteúdo, academias ou permissões.
