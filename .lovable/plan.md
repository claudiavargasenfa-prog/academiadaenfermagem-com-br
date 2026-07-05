## Objetivo
Refatorar `src/routes/index.tsx` (loja pós-login) para:
1. Adicionar 4 novos banners de impacto ao carrossel.
2. Nos cards dos 4 subaplicativos, apresentar dois botões destacados — **Experimentar Grátis** e **Ativar Assinatura Mensal** — mantendo o fallback **Em breve** quando o app não tem link de checkout (permite tirar do ar).

Sem mudança de esquema no banco. Só front-end.

---

## 1) Carrossel — 4 banners novos

Estender o array `SLIDES` em `src/routes/index.tsx` com 4 novos slides. Cada um usa apenas gradiente + texto (sem imagem de fundo gerada), seguindo o mesmo formato dos atuais (`eyebrow`, `title`, `desc`, `bg`, `accent`).

- **Banner A — Prontuário 1‑click** (para enfermeiros): tom clínico/emerald.
  - Título: *"Menos burocracia, mais paciente"*
  - Texto: *"Cansado de perder o plantão preenchendo prontuário? Com 1 clique, a Academia da Enfermagem transforma sua anamnese e exame físico em evolução cefalocaudal em segundos."*

- **Banner B — Relatório de estágio pelo celular** (para estudantes):
  - Título: *"Chega de nervoso com o relatório de estágio"*
  - Texto: *"Anote suas atividades pelo celular durante o dia e baixe as anotações prontas para o relatório acadêmico."*

- **Banner C — Preço de um lanche**:
  - Título: *"Um ecossistema completo pelo preço de um lanche"*
  - Texto: *"Segurança, calculadoras de medicamentos e raciocínio clínico. Invista na sua educação e profissionalização. Todo o app é baseado nas legislações vigentes do COFEN/CORENs."*

- **Banner D — Segurança jurídica e científica** (verde-escuro + dourado):
  - Eyebrow: *"100% Atualizado"*
  - Título: *"Segurança Jurídica e Científica para o seu Carimbo"*
  - Texto: *"Construído e revisado com base em COFEN, CORENs, ANVISA, MS e OMS. Base atualizada automaticamente a cada mudança de legislação ou PCDT — estude e plantie amparado pela ciência e pelas leis."*
  - Este slide usa classes específicas (`bg-emerald-950`, `text-amber-100`) e mostra o `mascotesAsset` reduzido à direita segurando o "selo" (texto sobreposto "100% Atualizado"). Adaptação mínima do layout do slide para suportar uma imagem quando o slide define um campo `mascot: true`.

Todos os slides continuam entrando na rotação automática de 5 s.

---

## 2) Cards dos 4 subaplicativos — botões

Contexto atual: cada card já mostra "Ver mini apps →" e um único botão de ação (Assinar / Assinatura ativa / Trial ativo / Em breve).

Nova regra por card:

- **Se `ckLink` existe** (plano tem checkout CAKTO configurado):
  - Botão primário destacado: **Ativar Assinatura Mensal** (fundo escuro, texto claro) → abre `ckLink` em nova aba (mesmo comportamento atual do "Assinar").
  - Botão secundário destacado: **Experimentar Grátis** (fundo branco/70, borda) → `Link` para `/trilha/$slug`. A intenção do usuário é: dentro da trilha o cliente vê os mini apps marcados `gratuito=true` desbloqueados (regra já implementada em `has_app_access`), e os demais permanecem bloqueados até o pagamento. Não cria subscription trial — o acesso free "por tempo indeterminado" já é servido pelo flag `gratuito` no `mini_apps`.
  - Se o usuário já é `subscribed`: manter o selo "✓ Assinatura ativa" (sem os dois botões).
  - Se está em `trial`: manter o selo de trial + botão **Ativar Assinatura Mensal**.

- **Se `ckLink` NÃO existe** (plano sem checkout configurado / desativado):
  - Renderiza apenas **Em breve** (desabilitado), preservando o mecanismo para tirar o app do ar apagando/limpando o `cakto_link_novo` no banco.

O link "Ver mini apps →" existente será substituído pelo botão **Experimentar Grátis** (mesmo destino `/trilha/$slug`) para evitar dois CTAs redundantes.

---

## Detalhes técnicos

- Arquivo único alterado: `src/routes/index.tsx`.
- Extensão do tipo do array `SLIDES` (adicionar campos opcionais `mascot?: boolean`, `img?: string` já é opcional) — todos os campos são estáticos, sem i18n via `app_texts` para não gastar setup.
- Reaproveitar `mascotesAsset` já importado para o banner D.
- Nenhum backend, migration, edge function ou secret.
- Nenhuma dependência nova.

## Fora de escopo
- Não criar tabela/coluna para trial "por tempo indeterminado". A gratuidade já é servida pelo flag `mini_apps.gratuito` + `has_app_access`. Se você quiser marcar mini apps específicos como grátis por app, isso é um segundo passo (posso listar quais marcar depois).
- Não alterar textos em `app_texts`.
- Não gerar imagens novas para banners.
