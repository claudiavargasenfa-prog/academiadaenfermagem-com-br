## 1. Botão "Compartilhar App" no cabeçalho

Adicionar um item **Compartilhar** no menu de navegação do `AppShell` (aparece logo abaixo de "Minha Conta" no menu mobile e ao lado dela no desktop), disponível em todos os apps (Acadêmico, Estudante de Técnico, Técnico, Enfermeiro).

Comportamento ao clicar:
- Se o navegador suportar **Web Share API** (padrão em celular Android/iOS): abre a folha nativa de compartilhar (WhatsApp, Instagram, e-mail, SMS etc.) com:
  - Título: "Academia da Enfermagem"
  - Texto: "Informação atualizada em suas mãos — conheça o app que descomplica a enfermagem."
  - Link: `https://academiadaenfermagem.com.br`
- Se não suportar (desktop antigo): copia o link para a área de transferência e mostra um toast "Link copiado! Cole onde quiser compartilhar."

Ícone: `Share2` do lucide-react. Rótulo editável via `app_texts` na chave `menu.compartilhar` (padrão "Compartilhar").

Arquivo alterado: `src/components/AppShell.tsx` (acrescentar o item no array `baseNav` e criar handler `handleShare`). Nenhuma mudança de layout ou cor.

## 2. Corrigir frase cortada no celular na Home

Na Home (`src/routes/index.tsx`), o título vem do texto editável `home.description`. O texto atual salvo no banco é **"Quatro aplicativos, uma só academia..."**, mas no celular aparece só **"Três app, uma só academia"** sem o resto.

Causas prováveis (a confirmar ao abrir o arquivo em build mode):
- O elemento `<h1>` ou `<p>` da descrição está com `truncate` / `overflow-hidden` cortando no mobile.
- Ou uma versão antiga do texto foi cacheada no PWA/service worker.

Correção:
- Remover qualquer classe `truncate` do bloco de título/descrição da Home para deixar quebrar em várias linhas no celular.
- Confirmar que o valor salvo em `app_texts.home.description` está com o texto novo ("Quatro aplicativos, uma só academia..."). Se estiver desatualizado, atualizar via UPDATE simples no `app_texts`.
- Como o PWA já tem `autoUpdate`, após publicar o texto correto aparece assim que o usuário reabrir o app.

## Detalhes técnicos

- Web Share API: `navigator.share({ title, text, url })`. Fallback: `navigator.clipboard.writeText(url)` + toast (já existe `sonner` no projeto).
- Não altero cores, banner, logo, nem estrutura de menu — só adiciono 1 item.
- Não mexo em nada da SAE, escalas ou outros mini apps.

## O que vou entregar

1. Item **Compartilhar** funcionando no cabeçalho de todos os apps (mobile + desktop).
2. Frase "Quatro aplicativos, uma só academia..." aparecendo por inteiro no celular.
