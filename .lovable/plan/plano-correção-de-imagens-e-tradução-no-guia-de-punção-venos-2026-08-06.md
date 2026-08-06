# Plano - Correção de Imagens e Tradução no Guia de Punção Venosa

O usuário relatou que o guia de "Punção Venosa Periférica" não está exibindo imagens, parecendo apenas um bloco de texto, e expressou frustração com textos em inglês.

## Análise do Problema de Imagens
- **Causa Provável**: O usuário pode estar acessando variantes do guia (Segurança, Pediatria ou Jugular) que estão marcadas como "Em Produção" e possuem o array de `cenas` vazio em `src/data/procedimentos/`.
- **Guia Principal**: O guia "Punção Venosa Adulto" (`puncao-adulto.ts`) possui 7 cenas com imagens reais configuradas.
- **Feedback Visual**: Atualmente, quando um guia está em produção, ele mostra um card de aviso, mas o usuário pode estar interpretando isso como uma falha técnica ("está a mesma coisa").

## Análise do Problema de Idioma
- O usuário viu textos em inglês (provavelmente "language selector" ou labels do Radix UI).
- O pedido é para mudar o gatilho de tradução forçada para "poxa querido esta tudo em ingles".

## Ações Propostas

### 1. Tradução e Branding (UI)
- Atualizar `src/components/ui/select.tsx` para interceptar o `aria-label` e aplicar a tradução forçada solicitada.

### 2. Correção de Conteúdo (Guia de Punção)
- **Melhoria no Player**: Garantir que o `ProcedimentoPlayer` trate corretamente o carregamento e cache.
- **Destaque Visual**: Tornar a diferenciação entre o guia completo (Adulto) e os "Em Produção" mais clara na lista inicial.
- **Consolidação**: Verificar se há algum conflito no componente `FlebitePanel` que possa estar obscurecendo o player de imagens.

### 3. Verificação Técnica
- Validar se as importações de ativos `.asset.json` em `puncao-adulto.ts` estão resolvendo para as URLs corretas do CDN Lovable.
- Testar a renderização do componente `img` dentro do `ProcedimentoPlayer`.

## Etapas de Implementação

1. **Ajuste de Idioma**: Modificar `src/components/ui/select.tsx`.
2. **Auditoria de Dados**: Confirmar que `PROC_PUNCAO_ADULTO` é o guia principal selecionado.
3. **Refinamento da UI**: Se um guia estiver sem cenas, melhorar a mensagem de erro para que o usuário saiba que é um conteúdo futuro e não um erro de carregamento.
4. **Verificação de Cache**: Garantir que o `useMemo` de pré-carregamento no `ProcedimentoPlayer` não esteja bloqueando o render inicial.

