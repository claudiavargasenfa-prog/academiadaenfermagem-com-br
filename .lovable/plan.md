# Plano de Implementação: Terapia Intensiva - Manejo de Drogas Vasoativas (ADEC)

Este plano detalha a criação do conteúdo técnico para o Mini App **Manejo de Drogas Vasoativas** dentro da nova academia **ICU Master (Terapia Intensiva & Emergência)**, seguindo as diretrizes técnicas solicitadas e mantendo a identidade visual Premium Plus.

## Alterações

### 1. Banco de Dados (Migração SQL)
- Inserir o primeiro Mini App na academia `uti-emergencia`: **Manejo de Drogas Vasoativas** (`slug: manejo-drogas-vasoativas`).
- Criar os dois primeiros sub-tópicos dentro deste Mini App:
  - **1.1 Noradrenalina — a rainha do choque**
  - **1.2 Dopamina — por que saiu de moda**
- O conteúdo incluirá o passo a passo técnico, mecanismos de ação, diluições padrão, doses e cuidados críticos de enfermagem.
- **Importante:** Garantir o `GRANT` de acesso para as novas linhas.

### 2. Frontend & Conteúdo
- Configurar o conteúdo em Markdown/HTML no banco de dados para que seja renderizado automaticamente pelo componente `MiniAppContent`.
- Utilizar a paleta **Premium Plus** (Dark Mode, bordas douradas) já implementada na trilha para manter a consistência.
- Implementar o texto técnico completo solicitado, formatado com ênfases (negrito/badges) para facilitar a leitura rápida à beira-leito.

## Detalhes Técnicos

### Estrutura de Conteúdo (Markdown)
O conteúdo será estruturado com:
- `##` para títulos de seções.
- `**` para termos técnicos importantes.
- Listas numeradas e com bullets para o passo a passo.
- Avisos de segurança em blocos de destaque (badges).

### Exemplo de SQL para Sub-tópicos:
```sql
INSERT INTO public.mini_app_subtopics (mini_app_id, slug, title, content_md, ordem)
VALUES (
  (SELECT id FROM public.mini_apps WHERE slug = 'manejo-drogas-vasoativas'),
  'noradrenalina',
  '1.1 Noradrenalina — a rainha do choque',
  '## Mecanismo de Ação...',
  1
);
```

## Verificação
1. Acessar a trilha `/trilha/uti-emergencia`.
2. Verificar se o card "Manejo de Drogas Vasoativas" aparece com estilo Premium.
3. Entrar no Mini App e validar a presença dos sub-tópicos no menu lateral e o conteúdo formatado.
4. Validar o redirecionamento correto entre tópicos.
