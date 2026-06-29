# Landing Page — Projeto Separado

A landing page **não será criada dentro deste app**. Será um **projeto novo, independente**, para não interferir em nada do Academia da Enfermagem (rotas, banco, deploy, créditos de build).

## Por que separar

- Zero risco de quebrar o app em produção.
- Deploy e domínio independentes (`academiadaenfermagem.com.br` aponta para a LP; o app continua em `academiadaenfermagem-app.lovable.app` ou subdomínio).
- Você pode editar a LP sem mexer no app, e vice-versa.
- Sem compartilhamento de banco — a LP é estática/marketing, não precisa de Supabase.

## Como vamos fazer

1. **Você cria um novo projeto Lovable** (no dashboard, "New Project") chamado, por exemplo, **"Academia da Enfermagem — Landing"**.
2. **Abre esse novo projeto** e me chama lá com o briefing (posso reaproveitar o HTML/texto que você já enviou).
3. Eu construo a LP nesse projeto novo com:
   - Cores do app (verde escuro #0b3d2e + dourado).
   - Mascote pulsante, hero, bônus dos 100 primeiros, planos, depoimentos, FAQ, rodapé.
   - Admin simples (tabela `landing_texts`) para você editar título, subtítulo, CTAs, bônus, preços, depoimentos, rodapé — tudo sem precisar do meu apoio.
   - Botões CTA apontando para o app (`https://academiadaenfermagem-app.lovable.app` ou domínio do app).
4. **Conectar o domínio** `academiadaenfermagem.com.br`:
   - Apontar no projeto da LP (Project Settings → Domains).
   - Requer **plano pago Lovable Pro** no projeto da LP.
   - O app pode ficar em `app.academiadaenfermagem.com.br` (subdomínio) se você quiser unificar marca depois — opcional.

## O que faço agora neste projeto

**Nada.** Não vou criar `/lp` aqui nem mexer em arquivos. Espero você abrir o novo projeto.

## Confirma?

- **Sim** → você cria o projeto novo e me chama lá.
- **Quero mudar algo do plano** → me diga o que ajustar antes.
