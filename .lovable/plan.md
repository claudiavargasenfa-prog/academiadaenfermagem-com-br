## Objetivo

Hoje todos os textos de **Minha História** estão fixos no código. Vou migrar tudo para o painel **Admin → Textos**, para você editar sem precisar me chamar.

## O que ficará editável

Cada item vira uma chave editável, já preenchida com o texto atual:

- `historia.titulo` — título principal da página
- `historia.sec1.titulo` / `historia.sec1.texto` — "A História"
- `historia.sec2.titulo` / `historia.sec2.texto` — "O Propósito"
- `historia.sec3.titulo` / `historia.sec3.texto` — "Minha Promessa"
- `historia.mascotes.legenda` — "Prevenção contra IRAS"
- `historia.foto.alt` — descrição da foto (acessibilidade/SEO)
- `historia.whatsapp.label` — texto do botão verde
- `historia.whatsapp.url` — link do grupo do WhatsApp
- `historia.voltar.label` — texto do botão "Voltar"
- `historia.seo.titulo` / `historia.seo.descricao` — título e descrição que aparecem no Google e ao compartilhar

Todos os textos aceitarão a mesma marcação já usada no app: `**negrito**`, `__dourado__`, `^^pílula^^` e listas com `-`, `>`, `*`, `+`, `#`.

## Como vai funcionar

1. Uma migração insere essas chaves na tabela de textos com o conteúdo atual (nada muda visualmente).
2. A página passa a ler os textos do banco via `useAppTexts`, com o texto atual como reserva caso a chave não exista.
3. No Admin → Textos, as chaves aparecem agrupadas por prefixo `historia.` com prévia ao vivo.

## Detalhes técnicos

- Migração `INSERT ... ON CONFLICT (key) DO NOTHING` em `app_texts` com descrição amigável em cada chave.
- `src/routes/minha-historia.tsx`: substituir strings por `useText("historia.x", "fallback")` e renderizar parágrafos com `<RichText>`.
- Título/descrição SEO: o `head()` é estático (roda antes do fetch), então o SEO usará o valor do banco só quando disponível; mantenho o texto atual como padrão fixo para não quebrar o compartilhamento.
- Sem mudanças de layout, cores, foto ou mascotes.
