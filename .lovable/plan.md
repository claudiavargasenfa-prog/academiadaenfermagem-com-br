# Gratuidade, compra na Cakto e proteção de conteúdo

Quatro regras de negócio para colocar no ar antes da divulgação.

## 1. Quem vem da Cakto já pagou — não recebe gratuidade

Hoje o sistema não sabe reconhecer a compra da mensalidade de uma academia: o recebimento automático da Cakto só entende mini apps avulsos, e todo cadastro novo ganha 15 dias grátis, inclusive quem já pagou.

O que muda:
- Cada plano (Acadêmico, Técnico, Estudante de Técnico, Enfermeiro) passa a ter o código do produto da Cakto cadastrado, editável na área de administração.
- Quando a Cakto avisar "compra aprovada", o aluno recebe acesso pago de 30 dias àquela academia e a gratuidade daquele plano é encerrada na hora (vira assinatura paga).
- Se a compra for reembolsada, cancelada ou houver chargeback, o acesso é encerrado — sem voltar para a gratuidade.
- Se o aluno comprar antes de criar a conta, a liberação acontece assim que ele se cadastrar com o mesmo e-mail da compra: no cadastro o sistema procura uma compra pendente por e-mail e, se existir, entra já pago, sem trial.
- Renovação mensal aprovada estende o acesso por mais 30 dias.

## 2. Avisos de fim da gratuidade (banner dentro do app)

O banner já existe; será ajustado para os textos e a régua pedidos:
- **Faltando 5 dias** (azul): "Seu tempo grátis termina em 5 dias."
- **Faltando 3 dias** (laranja): "Seu tempo grátis termina em 3 dias. Para continuar acessando todos os conteúdos, acesse o link e seja um associado."
- **Último dia** (vermelho, não pode ser fechado): "Seu prazo de gratuidade vai até amanhã. Não perca todo esse conteúdo e os que ainda virão — acesse o link e associe-se."

Cada aviso leva ao checkout do plano do próprio aluno. Também sai a frase de "vagas limitadas" que não corresponde à inauguração.

## 3. Bloqueio às 24h do 15º dia + uma academia por gratuidade

- **Bloqueio automático:** ao completar 15 dias, o acesso é encerrado no mesmo instante — sem depender de o aluno recarregar a página. Uma rotina diária marca as gratuidades vencidas como expiradas e o app passa a mostrar a tela de "Gratuidade encerrada" com o botão de assinar.
- **Uma academia por gratuidade:** o aluno em teste grátis só pode ter uma academia liberada. O sistema passa a garantir uma única gratuidade por pessoa (nunca uma segunda, nem em outra categoria, nem depois de a primeira acabar). Ao tentar abrir outra academia no plano gratuito, ele vê o convite para assinar aquela academia.
- **Quem paga não tem esse limite:** comprando as 4 academias, acessa as 4 normalmente.

## 4. Bloqueio de cópia

- Auditoria de todas as páginas de app e mini app: as que ainda não passam pela camada de proteção passam a passar. Com isso ficam bloqueados menu do botão direito, seleção de texto, arrastar imagens, Ctrl+C/Ctrl+P/Ctrl+S e atalhos de inspeção, com a marca d'água do e-mail do aluno sobre o conteúdo.
- **Exceção mantida exatamente como hoje:** os blocos que possuem botão de salvar (SAE/prescrição/evolução, anotação de enfermagem, relatório ABNT e demais exportações já existentes) continuam funcionando — o texto que o aluno digitou continua selecionável e o download em PDF/Word segue igual.

## Detalhes técnicos

- Migração: coluna `cakto_product_id` em `subscription_plans` (+ campo no admin de planos); índice único garantindo no máximo uma linha `status = 'trial'` por usuário em `user_subscriptions`; ajuste em `handle_new_user()` para só abrir trial quando o usuário não tiver nenhum trial/assinatura prévia e não houver compra pendente para o e-mail.
- Tabela `pending_purchases` (e-mail, plan_slug, order_id, data) alimentada pelo webhook quando o comprador ainda não tem conta; consumida no `handle_new_user()`.
- `src/routes/api/public/cakto-webhook.ts`: novo ramo que casa o `product.id` com `subscription_plans.cakto_product_id` → grava/atualiza `user_subscriptions` com `status='active'`, `expires_at = now() + 30 dias`, e apaga o trial do mesmo `plan_slug`; cancelamento → `status='cancelled'` e `expires_at = now()`.
- `pg_cron` diário chamando uma rota em `src/routes/api/public/` que expira trials vencidos (`status='expired'`), autenticada pela chave pública padrão.
- `src/components/TrialCountdownBanner.tsx`: textos novos, valor formatado em reais, faixa vermelha sem botão fechar, CTA usando `cakto_link_novo` do plano do aluno.
- `src/components/ContentProtection.tsx`: aplicar `AppAccessGate`/`ContentProtection` nas rotas de conteúdo que hoje não usam; adicionar um wrapper `SelectableArea` que reativa seleção/cópia apenas dentro dos blocos com salvamento, sem mudar os handlers de exportação.
- Sem alteração de layout, cores ou conteúdo dos mini apps.
