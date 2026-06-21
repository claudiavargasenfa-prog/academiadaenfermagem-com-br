# Renomeação geral + Autonomia total de textos/destaques

Mudanças amplas em todo o app. Lista do que vou fazer:

## 1. "Trilha" → "Aplicativo" (em todo o app)

Trocar em todos os lugares visíveis ao usuário:

- **Home:** "Conheça nossos aplicativos" no lugar de "trilhas"
- **Rotas:** mantém URL `/trilha/:slug` por compatibilidade dos links já enviados, mas o **título visível** vira "Aplicativo Acadêmico / Técnico / Enfermeiro"
- **Admin → aba "Assinaturas":** renomear para **"Aplicativos (Planos)"**
- **Cards, banners, breadcrumbs, botões** ("Voltar para aplicativo", "Acessar aplicativo", "Assinar aplicativo")
- **Mini apps:** continuam se chamando "mini apps" (são os conteúdos internos)

## 2. Cores das trilhas = padrão em TODAS as páginas

Hoje a cor só aparece no card e no header. Vou aplicar a cor de fundo do aplicativo em:

- Página `/trilha/:slug` (fundo suave da cor)
- Páginas dos mini apps DENTRO daquele aplicativo (faixa lateral/topo da cor)
- Banner de "trial ativo" mostra a cor do aplicativo do usuário

Padrão fixo:
- **Acadêmico:** amarelo ouro claro
- **Técnico:** azul bebê
- **Enfermeiro:** verde claro

## 3. Cakto vazio → "COMPRA SEGURA"

No card de cada aplicativo (loja), onde hoje aparece o aviso vermelho "Cakto novo: vazio", remover esse texto e mostrar em **destaque verde**: **🔒 COMPRA SEGURA**. O aviso vermelho de link faltando fica só visível no Admin.

## 4. Texto de "Migração" reescrito

Onde aparece "Migração / preço de migração", trocar por:

> **MIGRE PARA OUTRO APP E GANHE 15% DE DESCONTO POR 3 MESES**

Tanto no card da loja quanto no admin.

## 5. Editor de textos com destaques (autonomia total)

Adicionar no Admin uma nova aba **"Textos do App"** onde você edita TODOS os textos visíveis sem mexer no código:

- Título e subtítulo da Home
- Nome de cada aplicativo (ex: "Acadêmico" → você pode trocar para o que quiser)
- Slogan/destaque de cada aplicativo (ex: "ATUALIZAÇÕES AUTOMÁTICAS")
- Textos dos banners de trial (D-5, D-3, D-1)
- Texto do rodapé
- Aviso "compra segura"
- Texto de migração

Cada campo aceita **marcação simples de destaque**:
- `**texto**` → **negrito**
- `__texto__` → cor de destaque (amarelo/vermelho dependendo do contexto)
- `^^texto^^` → CAIXA ALTA com badge colorido

Tudo salvo numa nova tabela `app_texts` (chave/valor) → você edita pelo admin e aparece na hora no app.

## 6. Badges/Destaques nos mini apps (admin)

Hoje só tem "Ativo na loja" (tick azul). Vou adicionar ao lado de cada mini app no admin um seletor de **destaque**, com opções pré-prontas + custom:

- 🆕 **NOVO**
- 🔄 **ATUALIZADO**
- 🔥 **PROMOÇÃO**
- 🎁 **COMBO**
- ⭐ **DESTAQUE**
- ➕ **Custom** (você escreve o texto e escolhe a cor)

O badge aparece no card do mini app dentro do aplicativo, em cima/canto, bem visível. Múltiplos badges por mini app permitidos.

## 7. Lista de mini apps no admin: 1 por linha

A lista de mini apps no admin vira lista vertical (1 por linha) com:

```
[ícone] Nome do mini app           [badges atuais] [Ativo ✓] [Editar] [Destaques ▾]
        slug · aplicativo: Acadêmico
```

Fica fácil ver tudo e dar destaque rápido sem abrir o modal.

---

## Resumo técnico (para você ter ideia, não precisa entender)

- **Banco:** nova tabela `app_texts` (chave, valor, atualizado_em) + novas colunas em `mini_apps`: `badges jsonb` (lista de `{label, color, icon}`).
- **Frontend:** novo hook `useAppText(chave)` que lê textos do banco com fallback pro texto padrão; renderiza com parser de destaques.
- **Admin:** nova aba "Textos do App"; lista de mini apps vira vertical com seletor de badges inline.
- **Cores:** classe utility por aplicativo aplicada via `data-app="academico|tecnico|enfermeiro"` no root das páginas filhas.
- **Compatibilidade:** URLs `/trilha/:slug` continuam funcionando, só os textos visíveis mudam.

---

Posso aprovar e seguir?
