# Revisão do texto legal — correções recomendadas

O texto está bom: bem estruturado, com fundamentação correta (Lei 7.498/86, COFEN 564/2017, LGPD, CDC, Lei 9.610/98) e com registro eletrônico do aceite. Mas ele descreve um app **gratuito e informativo** — e o seu app hoje **vende assinatura, tem teste de 15 dias, usa fingerprint antifraude e bloqueia cópia**. Isso não está no texto, e é justamente onde nascem reclamações e processos de consumidor.

## O que falta (pontos de risco real)

1. **Nada sobre pagamento e assinatura.** Não há capítulo de preço, forma de cobrança, renovação, inadimplência e perda de acesso.
2. **Nada sobre o teste gratuito de 15 dias**, nem a regra de "1 app por vez no plano gratuito", nem o bloqueio automático às 24h do 15º dia.
3. **Falta o direito de arrependimento (art. 49 do CDC — 7 dias)** e a política de cancelamento/reembolso. Ausência disso é o item mais cobrado em compra online.
4. **A Cakto (processadora de pagamento) não aparece** na cláusula de compartilhamento, nem os provedores de infraestrutura por nome.
5. **Coleta não declarada:** o app coleta identificador do dispositivo (fingerprint) e IP para antifraude do teste gratuito. Precisa constar em "dados coletados", com base legal de legítimo interesse e prevenção à fraude.
6. **Falta transferência internacional de dados** (servidores fora do Brasil) — art. 33 da LGPD.
7. **Falta prazo concreto de retenção** ("apenas o necessário" é vago) e como excluir a conta.
8. **Falta cláusula de conta individual e intransferível** + proibição de compartilhar login, cópia, print e redistribuição do conteúdo, com consequência (suspensão sem reembolso do período).
9. **Falta idade mínima (18 anos ou menor assistido)** e comunicações por e-mail/WhatsApp (grupo VIP) com opção de sair.
10. **Foro do Rio de Janeiro:** em relação de consumo essa cláusula é anulável. Ajustar para preservar o direito do consumidor de acionar no próprio domicílio.
11. **Disponibilidade do serviço:** não há cláusula de manutenção/indisponibilidade programada.

## O que será feito

- Ampliar `Parte I` com novas cláusulas: 1.9 Planos, Assinatura e Pagamento; 1.10 Teste Gratuito; 1.11 Arrependimento, Cancelamento e Reembolso; 1.12 Conta Individual e Uso Indevido; 1.13 Disponibilidade e Suporte.
- Ajustar 1.8 (foro) para versão compatível com o CDC.
- Ampliar `Parte III`: incluir fingerprint/IP, pagamento via Cakto, provedores de infraestrutura, transferência internacional, prazos de retenção, exclusão de conta e comunicações de marketing.
- Ajustar `Parte IV` para o aceite mencionar também os termos de assinatura.
- Subir a versão do documento de 1.0 para 1.1 em `src/lib/legal.ts`, o que dispara novo aceite e preserva o histórico anterior como prova.
- Atualizar a data de vigência.

## Detalhes técnicos

Arquivos tocados: `src/routes/legal.tsx` (conteúdo) e `src/lib/legal.ts` (`LEGAL_DOC_VERSION` → 1.1, data). Nenhuma mudança de banco: a tabela `legal_acceptances` já grava a versão aceita, então usuários antigos verão o modal de reaceite automaticamente.

## Antes de eu escrever

Preciso confirmar dois números para não inventar: prazo de reembolso além dos 7 dias legais e se a assinatura é mensal com renovação automática. SIM 7 DIAS 