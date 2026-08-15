---
name: Atualização de Temas para Certificados
description: Introduzir lista oficial de temas por categoria para emissão de certificados conforme documento fornecido.
type: feature
---

# Plano de Implementação: Atualização de Temas para Certificados

O objetivo é substituir a busca dinâmica de temas no banco de dados pela lista estática e oficial fornecida no documento `LISTAGEM_DE_TEMAS_POR_APP.docx`, garantindo que cada categoria veja exatamente os temas correspondentes e que o fluxo de emissão (seleção única, horas 10-40 e pagamento) funcione corretamente.

## Alterações Sugeridas

### Frontend e Lógica de Negócio

1.  **Criar Dicionário de Temas Estáticos**
    *   Criar um novo arquivo `src/data/temas-certificados.ts` contendo o mapeamento das categorias para os arrays de strings (títulos dos temas) extraídos do documento.
    *   Isso resolve o problema de "A aba de temas está vazia" e garante precisão técnica.

2.  **Refatorar Componente de Benefícios (`src/components/conta/BeneficiosPlano.tsx`)**
    *   Remover a dependência da query `miniQ` e da função `listMiniAppsCatalog` para o seletor de temas.
    *   Importar os temas do novo arquivo `src/data/temas-certificados.ts`.
    *   Atualizar a lógica de `displayThemes` para usar o mapeamento estático baseado na `category` selecionada.
    *   Garantir que o seletor exiba a lista correta para:
        *   **ACADÊMICO** (Academia do Acadêmico)
        *   **ENFERMEIRO** (Academia do Enfermeiro)
        *   **TÉCNICO** (Academia do Técnico)
        *   **ESTUDANTE DE TÉCNICO** (Estudante Técnico)

3.  **Ajustes de UX e Texto**
    *   Garantir que apenas um tema possa ser selecionado por vez.
    *   Manter o seletor de horas (10-40) vinculado ao preço (R$ 1,00 por hora).
    *   Remover mensagens de erro/aviso de depuração que foram colocadas temporariamente no `option` default.

## Detalhes Técnicos

*   **Estrutura de Dados:**
    ```typescript
    export const TEMAS_POR_CATEGORIA = {
      ACADEMICO: [...],
      ENFERMEIRO: [...],
      TECNICO: [...],
      TECNICO_ESTUDANTE: [...]
    };
    ```
*   **Mapeamento de Categoria:** Ajustar os valores do `select` para baterem exatamente com as chaves do dicionário.

---

Este plano foca na estabilidade e fidelidade ao documento enviado, eliminando a variabilidade do banco de dados para este fim específico.
