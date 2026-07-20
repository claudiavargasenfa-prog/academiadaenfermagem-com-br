
## Análise da sua ideia

**1. Cards da loja sem preço e sem acesso direto — só via landing page ✅ Viável e recomendado**
Faz sentido comercial: hoje a pessoa vê o preço antes de entender o valor do produto. Movendo tudo para a landing page, ela primeiro se apaixona pelo conteúdo e só depois vê o valor + o botão de 15 dias grátis. Isso costuma aumentar bastante conversão.

**2. Cadastro grátis sem cartão ✅ Correto**
Você está certo: exigir cartão no cadastro afasta muito aluno (que só tem PIX). Melhor deixar o PIX/cartão como opção só na hora de assinar, depois dos 15 dias.

**3. Técnico que também faz faculdade de Enfermagem ✅ Resolvível**
Faço o seguinte no cadastro:
- Pergunta principal: "Qual seu perfil hoje?" (as 4 opções)
- Pergunta extra só para Técnico e Estudante de Técnico: "Você também estuda/atua como enfermeiro(a)?" → se sim, libera trial de 15 dias nos 2 apps (ex: Técnico + Acadêmico) usando o MESMO cadastro.
- Enfermeiro só ganha trial no app de Enfermeiro (como você pediu).

**4. Antifraude do trial (o "malandrinho" que cria e-mail novo)**
Aqui preciso ser honesto: **nenhum método é 100%**, mas dá para dificultar muito. Combinação recomendada:

- **Celular obrigatório + confirmação por SMS/WhatsApp** — é o filtro mais eficaz. O sujeito precisaria de um chip novo a cada trial. Já temos o campo celular no cadastro, falta só validar com código.
- **Fingerprint do dispositivo** (biblioteca gratuita FingerprintJS open-source) — gera um ID único do navegador/celular. Mesmo trocando e-mail, o dispositivo é reconhecido.
- **IP + faixa de IP** — ajuda, mas é fraco sozinho (a pessoa troca de Wi-Fi/4G e escapa). Serve como sinal secundário.
- **Bloqueio de e-mails descartáveis** (tipo tempmail, 10minutemail) — lista pública gratuita.

Com celular verificado + fingerprint, a fraude cai drasticamente. IP sozinho não vale o esforço.

---

## Plano de implementação

### 1. Loja (`src/routes/index.tsx`)
- Remover preço e botão "Experimentar" dos cards dos 4 apps.
- Cada card vira só: emoji + nome + slogan curto + botão **"Conhecer"** que leva para `/planos/{slug}`.
- Manter o resto da home (sobre, depoimentos, etc.) igual.

### 2. Landing pages (`src/routes/planos.$slug.tsx`)
- Continua como está (já tem preço, benefícios, FAQ, mini apps).
- Único ponto de entrada para cadastro/assinatura.
- O botão "Experimentar 15 dias grátis" continua levando para `/?cadastro={slug}`.

### 3. Cadastro (`src/components/AuthGate.tsx`)
- Categoria vem pré-selecionada da landing (já funciona).
- **Novo campo** só quando categoria = `tecnico` ou `tecnico-estudante`:
  checkbox "Também estudo/atuo como Enfermagem (Acadêmico)" → se marcado, cria trial nos 2 apps.
- **Sem cartão** (já é assim hoje).
- **Confirmação de celular por SMS/WhatsApp** — novo passo antes de liberar acesso.

### 4. Trial expandido (banco)
- Ajustar o trigger `handle_new_user` para, quando marcado o segundo perfil, criar 2 linhas em `user_subscriptions` (uma por app).

### 5. Antifraude
- Instalar FingerprintJS open-source (grátis, sem chave).
- Nova tabela `trial_fingerprints` (device_id, phone, email, ip, created_at).
- Antes de criar o trial: se o fingerprint OU o telefone já foi usado em um trial nos últimos 90 dias → bloqueia com mensagem "Você já usou seu período grátis. Continue com uma assinatura."
- Lista de domínios descartáveis para barrar no cadastro.

### 6. Verificação de celular
- Usar SMS via Supabase Auth (nativo) OU WhatsApp Cloud API (grátis até 1.000/mês).
- Preciso confirmar com você qual canal prefere.

---

## O que preciso confirmar com você antes de codar

1. **Verificação de celular:** SMS (nativo, mais fácil, tem custo pequeno depois de X envios) ou WhatsApp (grátis até 1.000/mês, mas precisa configurar Meta Business)?
2. **Duplo perfil:** confirma que só Técnico e Estudante de Técnico podem marcar "também Acadêmico"? Enfermeiro fica só com o app dele?
3. **Bloqueio antifraude:** se detectar fraude, bloqueio total ("já usou seu grátis") ou libero só 3 dias em vez de 15?

Depois que você aprovar, implemento tudo mantendo 100% do design pastel e sem mexer no conteúdo dos mini apps.
