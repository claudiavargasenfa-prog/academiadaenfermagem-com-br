---
name: Impressão do Verso do Certificado com Conteúdo Programático
description: Implementar a geração e impressão do verso do certificado contendo o conteúdo programático detalhado por tema e categoria.
type: feature
---

O usuário deseja que, ao emitir o certificado na página "Minha Conta", seja possível imprimir também o verso com o conteúdo programático detalhado (itens e subitens) extraído do documento enviado.

## Mudanças propostas

### 1. Dados e Estrutura
- Criar um novo arquivo `src/data/conteudo-programatico.ts` para armazenar o mapeamento detalhado de temas -> conteúdos (itens/subitens) extraídos do DOCX para cada categoria (Acadêmico, Técnico, Enfermeiro).
- Atualizar `src/lib/certificado.ts` para incluir uma nova função `versoCertificadoHtml` que gera o HTML da página de verso.

### 2. Motor de Certificado (`src/lib/certificado.ts`)
- Implementar a função `versoCertificadoHtml(c: CertificadoDados)`:
  - Buscar o conteúdo detalhado no novo arquivo de dados com base na categoria e nome do tema.
  - Renderizar uma página A4 paisagem com o layout oficial da ADEC.
  - Incluir o título do tema, a lista de itens/subitens e o selo de autenticidade/QR Code (opcional, mas recomendado para o verso também).
- Atualizar `abrirCertificado` para abrir duas abas ou, preferencialmente, gerar um único documento com duas páginas (frente e verso) para facilitar a impressão.

### 3. Interface do Usuário (`src/components/conta/BeneficiosPlano.tsx`)
- Adicionar um botão ou opção "Imprimir Frente e Verso" na listagem de certificados.
- Garantir que o usuário saiba que o verso contém o conteúdo programático legal.

## Detalhes Técnicos
- O verso deve manter a identidade visual (Cormorant Garamond, Montserrat).
- O conteúdo programático será injetado dinamicamente conforme o `mini_app_name` (tema) e a categoria do usuário.
- Utilizar `window.print()` com CSS `@page { size: A4 landscape }`.

## Conteúdo Programático (Exemplo de extração)
- **Acadêmico/Anamnese:** 1. Técnicas de Entrevista... 2. Exame Físico...
- **Técnico/Centro Cirúrgico:** Pré/Trans/Pós-operatório; Paramentação...
- **Enfermeiro/PCR:** Algoritmos ACLS, drogas da parada...

---
**Dúvida para o usuário:**
Você prefere que o certificado abra em um único arquivo PDF/Impressão com 2 páginas (página 1 frente, página 2 verso) ou quer botões separados para imprimir a frente e depois o verso?
