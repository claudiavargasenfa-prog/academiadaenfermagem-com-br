# Plano de Melhoria: Sistema de Certificados ADEC

Redesenhar a interface de emissão de certificados na área "Minha Conta" para um fluxo mais profissional, segmentado por categoria profissional e temas de estudo, integrando os novos modelos visuais.

## Ações Imediatas

### 1. Interface de Visualização do Certificado
- Remover o bloco de texto "CERTIFICADOS 10H".
- Exibir as imagens de **Frente** e **Verso** do certificado lado a lado com destaque.
- Corrigir o link da imagem do **Verso** (que estava abrindo tela preta) e garantir que a visualização seja fluida.

### 2. Novo Fluxo de Seleção (Formulário)
- **Categoria Profissional:** Adicionar seletor para Acadêmico, Enfermeiro, Técnico ou Estudante de Técnico.
- **Tema de Estudo:** Filtrar a lista de conteúdos (antigos Mini Apps) baseada na categoria selecionada.
- **Carga Horária:** Seletor simplificado para 10h, 20h, 30h e 40h com seus respectivos valores.
- **Renomeação:** Trocar o termo "Mini App" por "Tema de Estudo" em toda a seção.

### 3. Integração com Pagamento
- Configurar o botão "Emitir Certificado" para redirecionar aos links do Mercado Pago conforme a carga horária selecionada.
- Preparar a estrutura para receber os 4 links específicos (10h, 20h, 30h, 40h).

## Detalhes Técnicos
- Atualizar `src/components/conta/BeneficiosPlano.tsx` com o novo layout e lógica de filtragem.
- Utilizar os assets:
  - Frente: `https://763be538-2d93-4e4b-9706-e7e0e7a46979.lovable.app/modelo-frente.png`
  - Verso: `https://31804b77-ed14-411a-8212-680482b84234.lovable.app/modelo-verso.png`
- Lógica de filtro: 
  - `track_tecnico` para as categorias de Técnico.
  - `track_academico` para Acadêmico.
  - `track_enfermeiro` para Enfermeiro.
