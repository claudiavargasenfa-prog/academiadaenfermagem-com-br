## Refatoração da Página 2 (Loja / `src/routes/index.tsx`)

### O que muda visualmente

Ordem nova da página, de cima para baixo:

1. Título "Loja / Academia da Enfermagem" + descrição (sem mudança)
2. **Carrossel de banners em largura total** (mobile, tablet e desktop)
3. **Mascotes maiores**, centralizados, no lugar onde estava o banner verde
4. **3 cards de aplicativos** (Acadêmico / Técnico / Enfermeiro) — sem mudança

Sai da página principal:
- Bloco verde escuro "Chegue no estágio sabendo o que fazer…" (banner primary)
- Card lateral "Identificação / Meu estágio"

### Onde vai o "Meu estágio"

Movido para **dentro das trilhas** (`src/routes/trilha.$slug.tsx`), aparecendo **apenas** quando `slug === "academico"` ou `slug === "tecnico"` (não aparece na trilha do Enfermeiro, que não faz estágio supervisionado).

Posição na trilha: logo abaixo do `PageHeader` do app, antes das seções de mini apps, como um Card compacto com os mesmos campos atuais (Campo, Preceptor, Período) e o link "Editar no Diário".

### Detalhes técnicos

**`src/routes/index.tsx`**
- Remover o `<section>` inteiro que hoje contém o banner verde + Card "Meu estágio" (linhas ~139–186).
- Remover o wrapper `grid md:grid-cols-[1fr_auto]` que hoje coloca mascotes ao lado do carrossel (linhas ~127–136). Substituir por:
  - `<Carousel />` sozinho, ocupando 100% da largura do container (`max-w-5xl` do `AppShell` já é o limite; nada de coluna auto ao lado).
  - Abaixo do carrossel, um bloco centralizado com `<img src={mascotesAsset.url} />` em tamanho maior: `h-56 sm:h-72 md:h-96` (mantendo `w-auto object-contain` e a animação `pulse` atual).
- Remover imports não usados após a limpeza: `Card`, `useLocal`, `logoAsset`, `Check`, `Zap`, `estagio`, `migracaoBanner` (verificar antes de remover). `RichText`/`useText` continuam sendo usados.
- O botão "Ver aplicativos" some junto com o banner; a seção `#aplicativos` continua acessível via scroll natural.

**`src/routes/trilha.$slug.tsx`**
- Adicionar `import { useLocal } from "@/lib/storage"`.
- Renderizar, apenas para `slug === "academico" || slug === "tecnico"`, um novo componente `MeuEstagioCard` logo após o `PageHeader`, com o mesmo conteúdo hoje presente no index (Campo / Preceptor(a) / Período + link "Editar no Diário").

### Carrossel largura total

O componente `Carousel` já é fluido (`w-full` via `<section>` e `rounded-3xl` interno). A "largura da página" é herdada do `AppShell` (`max-w-5xl`). Basta removê-lo da grid de 2 colunas para que ocupe 100% em todos os breakpoints.

### Fora de escopo

- Não mexer no banner de trial (`TrialCountdownBanner`) nem no header.
- Não alterar textos editáveis do `app_texts` (as chaves `home.cta_section`, `compra.segura`, `migracao.banner` seguem iguais).
- Nenhuma migração de banco.