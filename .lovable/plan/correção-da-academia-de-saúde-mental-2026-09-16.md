# Correção da Academia de Saúde Mental

## O que foi confirmado

- A **Academia da Saúde Mental** está ativa e já possui **9 Mini Apps ativos vinculados**.
- O cartão especial da Saúde Mental na página inicial abre `/app/suporte-tecnico`, que procura um Mini App com esse nome. A Academia correta abre em `/trilha/suporte-tecnico`; por isso a loja mostra uma página vazia em vez dos 9 conteúdos.
- No painel “Apps & Organização” existe um tratamento separado para Saúde Mental nas opções de destino. Isso será removido para ela seguir exatamente a mesma regra das demais Academias.

## Alterações

1. **Corrigir o acesso pela loja**
   - Fazer o cartão “Academia de Saúde Mental” abrir a página da Academia em `/trilha/suporte-tecnico`.
   - Preservar o visual atual do cartão e o acesso gratuito.

2. **Incluir Saúde Mental em todas as opções de organização**
   - Retirar filtros e exceções específicas do endereço `suporte-tecnico`.
   - Montar todas as opções de adicionar, reativar e mover Mini Apps usando a lista completa de Academias ativas.
   - Garantir que a Academia de Saúde Mental apareça no formulário de Mini App em “Disponível nos aplicativos”, como todas as outras.

3. **Manter os conteúdos já cadastrados**
   - Não apagar nem recriar os 9 vínculos existentes.
   - Não alterar textos, pagamentos, assinaturas ou acesso das outras Academias.

4. **Testar o resultado**
   - Abrir Saúde Mental pelo cartão da loja e confirmar os 9 Mini Apps.
   - Conferir no painel que Saúde Mental aparece ao adicionar, mover e reativar conteúdo.
   - Testar também uma Academia comum para garantir que o ajuste não afetou as demais.
