# Plan - Adição de Credenciais de Teste no Painel Admin

Adicionar as credenciais de teste do Mercado Pago fornecidas pelo usuário ao componente `PaymentTester` para facilitar a validação dos fluxos de pagamento.

## Alterações

### Frontend

- **src/components/admin/PaymentTester.tsx**
    - Adicionar um novo bloco informativo no topo da página contendo os dados das credenciais de teste:
        - N.º da aplicação
        - User ID
        - Usuário de teste
        - Senha
        - Código de verificação
    - Estilizar o bloco para se destacar como um guia de referência rápida para testes em ambiente Sandbox.

## Detalhes Técnicos

- Utilizar ícones pertinentes (como `Key` ou `UserCheck`) para facilitar a identificação.
- Manter o design consistente com os demais cards do painel administrativo (glassmorphism/tons sóbrios).
- Garantir que a informação seja exibida apenas para administradores (já garantido pelo componente pai).
