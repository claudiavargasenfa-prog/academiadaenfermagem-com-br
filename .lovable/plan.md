# Plano de Implementação: Atualização de Rótulo e Documentação para Mercado Pago

O usuário solicitou a alteração de um rótulo de acessibilidade (aria-label) que tem sido usado como canal de comunicação/instrução técnica. Além disso, o usuário precisa de um texto técnico formatado ("aplicação") para realizar o cadastro da integração no painel do Mercado Pago.

## Alterações de Código

### Componentes UI
- Atualizar `src/components/ui/select.tsx`:
    - Alterar o mapeamento do `ariaLabel` de "escreva aqui para eu colar no mp" para "preciso que vc escreva agora aqui no chat a aplicação: o cadastro técnico da integração do seu app com o Mercado Pago".

## Documentação Técnica (Resposta ao Usuário)

Vou preparar e fornecer no chat o texto técnico necessário para o cadastro da aplicação no Mercado Pago, incluindo:
- Nome da Aplicação.
- Descrição Técnica da Integração.
- URL de Notificação (Webhook).
- Escopos de permissão necessários.
