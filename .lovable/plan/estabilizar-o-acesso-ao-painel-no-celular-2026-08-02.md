# Estabilizar o acesso ao painel no celular

## Diagnóstico confirmado

- O erro do print é `net::ERR_NAME_NOT_RESOLVED`: o celular não conseguiu resolver temporariamente o endereço da prévia do editor.
- A aplicação está respondendo normalmente: o servidor local retorna 200 e `https://academiadaenfermagem.com.br/admin` também retorna 200.
- O endereço temporário da prévia voltou a resolver e responder, e não há erro correspondente no código da aplicação.
- Portanto, alterar o código do app não corrigiria essa falha de DNS da prévia e poderia gerar mudanças desnecessárias.

## Plano

1. Manter o código do app intacto, pois a falha não está na rota `/admin` nem no conteúdo.
2. Usar o endereço estável `https://academiadaenfermagem.com.br/admin` para administrar o app no celular, em vez do endereço `id-preview--...lovable.app` do editor.
3. Tratar a prévia do editor somente como ambiente temporário de edição; se ela falhar, recarregar a prévia ou alternar a rede, sem mexer no app.
4. A falha intermitente, com os testes técnicos e horários, já foi encaminhada à equipe da plataforma para investigação da infraestrutura de prévia móvel.

## Resultado esperado

O painel continuará acessível pelo domínio oficial mesmo quando o endereço temporário da prévia apresentar instabilidade de DNS.