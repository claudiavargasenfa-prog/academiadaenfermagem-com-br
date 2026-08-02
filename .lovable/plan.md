# Resumo digital (hash) e Declaração de Veracidade para o INPI

Não, ainda não. O que já existe são três arquivos: o memorial descritivo, o ZIP do código-fonte e a listagem contínua em TXT. Falta a etapa específica que o INPI pede: gerar o **resumo digital hash** do código-fonte e preparar a **Declaração de Veracidade (DV)**.

Importante: a DV oficial é **baixada do próprio sistema e-Software do INPI** depois que você faz o upload do arquivo hash no formulário — ela não pode ser emitida por fora. O que dá para preparar aqui é tudo que o sistema exige antes disso, mais uma via impressa para conferência e assinatura.

## O que será entregue

### 1. Arquivo do resumo digital (hash)
Um arquivo `.txt` no padrão aceito pelo e-Software, contendo:
- o algoritmo usado (SHA-512, o recomendado pelo INPI)
- o hash do arquivo de código-fonte que será declarado
- o nome e o tamanho exato do arquivo de origem

### 2. Pacote de código-fonte padronizado para o hash
O hash precisa corresponder a um único arquivo, imutável. Será gerado um ZIP definitivo e determinístico (`ADEC-codigo-fonte-registro.zip`), com o conteúdo congelado, e o hash calculado sobre ele. Esse ZIP é o que você guarda: se alterar um byte, o hash muda e a declaração perde validade.

### 3. Declaração de Veracidade — via de conferência
Um documento em DOCX com o texto padrão da DV preenchido: identificação do titular/autor, título do programa, versão, linguagem, campo de aplicação, algoritmo e o hash gerado, com espaço para data e assinatura. Serve para você conferir os dados antes de preencher no e-Software e para arquivo próprio.

### 4. Guia passo a passo do e-Software
Um resumo curto, dentro do mesmo DOCX, com a ordem das etapas: emissão da GRU, preenchimento do formulário, upload do arquivo hash, download da DV gerada pelo sistema, assinatura e envio.

## Dados que preciso de você

Para preencher a DV corretamente, confirme:
- Nome completo e CPF do titular/autor (ou razão social e CNPJ)
- Título exato do programa a registrar
- Versão a declarar (sugestão: 1.0)
- Data de criação/publicação a declarar

Se preferir, gero tudo com esses campos em branco para você preencher à mão.

## Detalhes técnicos

- Hash SHA-512 calculado via `sha256sum`/`sha512sum` sobre o ZIP final, com o valor registrado em texto puro.
- ZIP gerado com timestamps normalizados para ser reproduzível.
- Nenhuma alteração no código da aplicação — apenas geração de artefatos em `/mnt/documents`.
