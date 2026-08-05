# Plano de Implementação: Atualização de Rótulo e Elaboração da Descrição da Aplicação Mercado Pago

O usuário solicitou a alteração do rótulo de acessibilidade (aria-label) em um componente UI e está aguardando a definição da "aplicação" (informações técnicas) para cadastrar a integração no Mercado Pago.

## Alterações de Código

### Componentes UI
- Atualizar `src/components/ui/select.tsx`:
    - Alterar o mapeamento do `ariaLabel` de "escreva aqui para eu colar no mp" para "qual é a aplicação por favor????????????".

## Definição Técnica (Resposta ao Usuário)

Vou elaborar e fornecer o texto descritivo da aplicação para o Mercado Pago, estruturado da seguinte forma:

1.  **Nome da Aplicação**: Academia da Enfermagem (ADEC).
2.  **Descrição da Integração**: Sistema de gestão de assinaturas para cursos e ferramentas de enfermagem, com liberação automática de conteúdo via Webhook após confirmação de pagamento.
3.  **URL de Notificação (Webhook)**: `https://academiadaenfermagem.com.br/api/public/payments`.
4.  **Escopos sugeridos**: `payments`, `orders`, `offline_access`.
