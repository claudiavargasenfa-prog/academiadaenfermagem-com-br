# Plano de Ação: Tabela Fidedigna de Itens e Subitens para Certificados (Técnico/Estudante)

Este plano visa realizar a revisão sistemática e fidedigna de todos os temas solicitados para a categoria **Estudante Técnico**, extraindo cada item e subitem real diretamente dos conteúdos implementados no aplicativo.

## Passos para Implementação

### 1. Extração Técnica de Conteúdos
Realizar a leitura profunda dos seguintes módulos para mapear os subitens:
- **Procedimentos Técnicos:** Ler `src/data/procedimentos/*.ts` para detalhar Punção, SVD, SVA, SNG e Curativos.
- **Segurança e IRAS:** Analisar `src/routes/seguranca.tsx` e `src/routes/iras.tsx` para as Metas Internacionais e Bundles.
- **Sinais Vitais:** Mapear parâmetros de Adulto, Pediatria, Neonatologia, Idoso e Gestante em suas respectivas rotas.
- **Farmacologia:** Detalhar a lista de A-Z e cálculos em `src/routes/calculadora.tsx` e `src/routes/farmacologia-avancada.tsx`.
- **Ética e Postura:** Extrair itens do manual de conduta e COFEN em `src/routes/postura-etica.tsx` e `src/routes/legal.tsx`.
- **Urgência e Emergência:** Mapear protocolos de SBV/ACLS em `src/routes/sbv.tsx` e `src/routes/acls.tsx`.

### 2. Consolidação na Memória Técnica
Atualizar o arquivo `mem://features/conteudo-programatico-certificados.md` com uma nova seção dedicada à tabela exaustiva para **Estudante Técnico**, garantindo que nenhum subitem seja esquecido.

### 3. Estrutura da Tabela por Temas (Estudante Técnico)
A tabela seguirá o mapeamento real:
- **CENTRO CIRÚRGICO / CME:** Períodos, Checklist, Degermação, Fluxo de materiais, Esterilização.
- **CÓDIGO DE ÉTICA:** Direitos, Deveres, Resoluções, Sigilo, Biossegurança (NR-32).
- **CUIDADOS COM DISPOSITIVOS:** Manutenção, Higiene, Drenos, Sondas e Cateteres.
- **ESCALAS CLÍNICAS:** Braden (Pressão), Morse (Queda), Glasgow (Consciência), Maddox (Flebite).
- **FÁRMACOS DE A-Z:** Farmacocinética, 9 Certos, Cálculo de Dosagem, Diluição, Vias.
- **IRAS:** Higiene das Mãos, Precauções, EPIs (Paramentação/Desparamentação).
- **PUNÇÃO VENOSA:** Escolha do Jelco/Scalp, Sequência de Punção, Prevenção de Flebite.
- **SINAIS VITAIS (Categorias):** FC, FR, PA, SpO2, Temperatura, Glicemia Capilar e Red Flags.

## Detalhes Técnicos
- **Fidelidade:** A lista não será baseada em nomes genéricos, mas nos campos de marcação (`checkbox`) e textos didáticos existentes no código.
- **Formatação:** Tabela Markdown numerada, organizada por Tema > Item > Subitem.

## Próximo Passo
Após a aprovação, gerarei a tabela completa e a salvarei na memória do projeto para uso imediato na emissão de certificados.
