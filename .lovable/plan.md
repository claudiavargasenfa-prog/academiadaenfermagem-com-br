# Plano de Correção: Imagens e Temas do Certificado

Este plano resolve os problemas críticos de visualização na seção de emissão de certificados na aba "Minha Conta".

## Problemas Identificados
1. **Imagens Quebradas:** Os modelos de certificado (Frente/Verso) estão apontando para URLs externas que retornam erro 404.
2. **Lista de Temas Vazia:** O seletor de "Tema de Estudo" não carrega os títulos dos Mini Apps devido a restrições de permissão ou falha na função de busca.

## Ações Técnicas
1. **Geração de Imagens Locais:**
   - Criar arquivos de imagem locais `/public/modelo-frente.png` e `/public/modelo-verso.png` com branding da ADEC.
   - Atualizar `src/components/conta/BeneficiosPlano.tsx` para usar estas imagens locais.
2. **Correção da Busca de Temas:**
   - Refatorar `src/lib/catalog.functions.ts` para usar o cliente `supabaseAdmin`, garantindo acesso total à tabela de Mini Apps no servidor.
   - Melhorar o tratamento de erros e logs para facilitar diagnósticos futuros.
3. **Melhoria da UI:**
   - Garantir que o fallback de temas funcione corretamente mesmo se o filtro de categoria falhar.

## Detalhes Técnicos
- Uso de `supabaseAdmin` em `listMiniAppsCatalog` para ignorar políticas de RLS no carregamento do catálogo administrativo.
- Substituição de URLs absolutas externas por caminhos relativos internos.
