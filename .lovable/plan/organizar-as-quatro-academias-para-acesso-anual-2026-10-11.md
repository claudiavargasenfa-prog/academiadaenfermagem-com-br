# Organizar as quatro academias para acesso anual

## Nova oferta

Pagamento único pelo Mercado Pago, sem mensalidade nem renovação automática. A liberação ocorrerá automaticamente após a confirmação do pagamento, sem envio de comprovante no chat.


| Academia                           | Valor total anual |
| ---------------------------------- | ----------------- |
| Estudante de Técnico em Enfermagem | R$ 37,99          |
| Técnico em Enfermagem              | R$ 57,99          |
| Acadêmico em Enfermagem            | R$ 77,99          |
| Enfermeiro                         | R$ 97,99          |


Usar 365 dias de acesso contados a partir da aprovação do pagamento. Cada compra libera a academia escolhida e seus conteúdos, não as quatro academias. Uma nova compra durante o acesso vigente acrescentará 365 dias ao vencimento existente.

## O que a análise confirmou

- Existem ofertas mensais, trimestrais, semestrais e anuais ainda ativas, com preços diferentes dos novos valores; também existem planos ativos com preço zero.
- O pagamento das academias usa um endereço salvo no campo antigo de checkout e não chama a criação de pagamento individual do Mercado Pago.
- A confirmação de pagamento atualmente calcula apenas **30 dias** de acesso.
- O valor e os dados do pedido podem ser fornecidos pelo navegador; precisam ser determinados e validados pelo servidor.
- A confirmação do pedido e a liberação do acesso ocorrem separadamente, com risco de pagamento marcado como confirmado sem acesso concedido.
- A assinatura anual atualmente permite escolher um segundo aplicativo; a função de liberação não exige uma autorização específica de bônus.
- Há regras de teste e gratuidade no código e nas funções de acesso, além de mensagens antigas de 15 dias grátis e assinatura mensal na página ADEC.
- Nos registros consultados há 11 pedidos pendentes, nenhum pedido marcado como pago e nenhuma assinatura ativa. Existem duas assinaturas vencidas sem marca de teste: não apagar nem tratar esses registros como compras comprovadas.
- A chave de assinatura das notificações do Mercado Pago não aparece entre os segredos configurados. A chave de acesso existe, mas o funcionamento real da conta de pagamentos ainda precisa ser validado.

## Bônus encontrados — decisão antes de retirar

Nas ofertas cadastradas:

1. **Certificados gratuitos de 10h:** um no trimestral, dois no semestral e quatro no anual.
2. **Segundo aplicativo completo:** escolha de outra academia no plano anual.
3. **15 gerações de relatório de estágio ABNT:** cota ampliada no anual.
4. **Biblioteca de PDFs para download:** escalas, protocolos e tabelas de aprazamento, anunciada no semestral e herdada pelo anual.
5. **Plantão semanal de dúvidas no Grupo VIP do WhatsApp:** anunciado no semestral e durante os 12 meses do anual.

Há também promessas de teste grátis e Grupo VIP da inauguração na página ADEC. Teste gratuito é uma regra de acesso, não um brinde.

**Não excluir esses bônus nesta etapa sem sua decisão.** Antes de disponibilizar a nova oferta, confirmar quais serão retirados. Os novos preços não devem herdar automaticamente os benefícios antigos. Remover um brinde não significa apagar ferramentas de estudo: o relatório ABNT, os materiais e os certificados vendidos separadamente devem ser avaliados como produtos distintos. Preservar conteúdos e registros existentes.

## Implementação

### 1. Unificar oferta e identificação

- Usar as quatro academias existentes, sem criar academias duplicadas.
- Cadastrar uma oferta anual por academia com os valores acima; desativar suas variações antigas de venda sem apagar históricos.
- Corrigir divergências entre nomes, preços e destinos. Foi encontrado um plano de R$ 97,99 com nome de Enfermeiro vinculado ao identificador de UTI: não transferir conteúdos nem alterar outras academias automaticamente.
- Manter outras academias cadastradas fora desta mudança comercial, sem inventar preços ou liberar acesso conjunto.

### 2. Corrigir compra e liberação automática

- Exigir uma conta identificada para comprar; vincular pedido, academia e pagamento à mesma conta.
- Criar o pagamento no Mercado Pago com preço anual consultado no servidor e referência única ao pedido. Não aceitar valor, beneficiário ou duração enviados pelo cliente como fonte de verdade.
- Exigir assinatura válida da notificação e consultar o pagamento no Mercado Pago. Validar valor, moeda, recebedor, referência e status aprovado antes da liberação.
- Confirmar pedido e conceder acesso em uma única operação, protegida contra notificações repetidas e simultâneas.
- Mostrar pagamento pendente, recusado e confirmado; recuperar o pedido ao voltar do Mercado Pago ou recarregar a página.
- Permitir reprocessar confirmações que falharam sem duplicar acesso. Tratar estorno integral e contestação na concessão correspondente, sem cancelar outras compras válidas da conta.

### 3. Organizar toda a apresentação

- Atualizar ADEC do banner coral ao rodapé, loja, páginas das academias, compra, cadastro, Minha Conta, comparativos, avisos e administração.
- Exibir o **valor total anual**, não um preço mensal como destaque; remover opções de períodos antigos das quatro academias.
- Substituir anúncios de gratuidade vencida e testes por acesso anual pago. Não reabrir a campanha gratuita.
- Ajustar nomes das academias, perguntas frequentes, explicações sobre pagamento e vencimento, metadados e textos já salvos no editor.
- Manter a edição completa da página ADEC disponível no Admin.

### 4. Alinhar permissões e bônus

- Conferir acesso tanto na tela quanto nas regras que protegem o conteúdo: somente pagamento vigente da academia correspondente ou administrador.
- Encerrar concessões de teste nas quatro academias e revisar exceções antigas para que não contornem a nova oferta.
- Quando você decidir os bônus, retirar suas promessas, concessões e botões de ativação — não apenas esconder textos. Certificados avulsos e conteúdos não serão apagados por consequência.
- Mostrar academia comprada, início, vencimento e situação do pagamento na conta e no Admin.

## Validação antes de disponibilizar

- Testes separados para os quatro preços exatos, prazo de 365 dias, renovação e acesso restrito à academia comprada.
- Testar pagamento pendente, aprovado, recusado, repetido, valor divergente, notificação inválida, falha de processamento e estorno.
- Conferir compra autenticada do início ao fim em ambiente de teste do Mercado Pago e verificar a leitura do acesso na conta e na academia, incluindo retorno e recarregamento.
- Conferir telas no celular e computador, acesso do administrador, edição da ADEC e ausência de erros.
- Publicar somente após solicitação e validação; não realizar cobrança real para testar sem autorização.

## Detalhes técnicos

Reutilizar `subscription_plans`, `plan_offers`, `orders` e `user_subscriptions`, com migrações compatíveis e preservação do histórico. Centralizar regras comerciais e a criação autenticada de checkout em funções de servidor. Processar notificações verificadas em `/api/public/payments`, com concessão transacional e identificação única por pagamento. Revisar as políticas de pedidos e as funções `has_active_membership`, `has_app_access` e `set_bonus_app`. Preservar OAuth/MCP e registro dos campos ADEC em `app_texts`.

## Dependências e limites

- **Decisão sobre bônus:** você recebeu a lista acima; nenhuma exclusão definitiva será feita sem sua escolha. PODE RETIRAR TODOS OS BONUS DOS 4 APPS.
- **Mercado Pago:** configurar a chave de assinatura das notificações por formulário seguro e validar a conta e o recebimento dos eventos antes de prometer liberação automática em produção. QUERO QUE O CLIENTE ENTRE PELA LANDING PAGE,  LÁ ELE ESCOLHE A ACADEMIA QUE DESEJA, CLICA EM ADQUIRIR, É DIRECIONADO AO MERCADO PAGO, ELE PAGA, O MERCADO PAGO COMUNICA A LOVABLE QUE APOS CONFIRMAÇÃO DO PAGAMENTO, LIBERA O ACESSO AO CLIENTE. PODE SER ASSIM?
- Sua informação de que ninguém comprou será respeitada, mas pedidos, contas e registros antigos não serão apagados. OK