Vou corrigir o desaparecimento do Admin sem mexer nas permissões da conta principal.

Plano:
1. Ajustar o menu para aguardar corretamente a verificação do papel de administrador, evitando que o botão Admin suma por falha/atraso de carregamento.
2. Usar o hook já existente de verificação de admin, com cache por usuário, em vez de uma chamada manual no `useEffect`.
3. Garantir que a opção Admin apareça para a conta que já tem papel `admin`: `enfa.contato@gmail.com`.
4. Manter a conta `formataedigita.suporte@gmail.com` como está, sem promover automaticamente a admin.
5. Verificar no preview se o menu Admin volta a aparecer após login com a conta admin.

Observação: confirmei no banco que `enfa.contato@gmail.com` tem papel `admin`; `formataedigita.suporte@gmail.com` tem apenas `aluno`.