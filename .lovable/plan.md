## Reformular o mini app "Enfermagem Obstétrica"

Atualizar o conteúdo do mini app `obstetricia` (aparece dentro do app Acadêmico) mantendo o mesmo padrão visual das Escalas Clínicas: cores clarinhas (rosa/pêssego/mint pastéis), seções em cards e blocos expansíveis (`<details>`) que abrem ao clicar no título.

### O que muda no banner (topo)
- Mantém a arte/estrutura do banner atual — só troca 2 textos:
  - Onde está "Sinais Vitais" → **"ENFERMAGEM OBSTÉTRICA"**
  - Onde está "Gestante" (subtítulo/tagline) → frase curta descrevendo o que o aluno vai encontrar, ex.: *"Avaliação da gestante, sinais de trabalho de parto, alertas de emergência e escuta ativa para orientar a mãe do pré-natal ao parto."*

### O que sai do conteúdo
- Todo bloco "Diagnósticos de Enfermagem"
- Qualquer citação a NANDA, NIC, NOC (e CIPE)
- Bloco final "Resumo dos pontos-chave"

### O que entra (nesta ordem, logo após o banner)

**1. Avaliação específica da gestante** (card intro claro)
- O que o acadêmico avalia em cada consulta e por que a escuta ativa importa.

**2. Sinais de trabalho de parto** (card destacado, cor mint)
- Contrações rítmicas, perda do tampão, rompimento da bolsa, dilatação — quando ir para a maternidade.

**3. Sinais de alerta / emergência** (card destacado, cor pêssego/vermelho suave)
- Pré-eclâmpsia (cefaleia intensa, visão turva, edema súbito, epigastralgia), sangramento, redução dos movimentos fetais, perda de líquido amniótico.

**4. Pré-natal por trimestre — 3 acordeões `<details>`**
- **1º Trimestre (até 12 sem)** — adaptação, confirmação (TIG/Beta-HCG), cálculo da IG, exames de rotina (hemograma, tipagem, sorologias HIV/Sífilis/Hepatites), ácido fólico, cessar tabagismo/álcool.
- **2º Trimestre (13–28 sem)** — PA/peso/edema, Altura Uterina, BCF, USG morfológica, rastreio de diabetes gestacional.
- **3º Trimestre (29–40 sem)** — sinais de perigo, consultas quinzenais → semanais, preparação das mamas, Plano de Parto.

**5. Papel humanizado e educativo** (card claro)
- Vínculo, educação em saúde, aleitamento, fases do trabalho de parto.

**6. Métodos não farmacológicos para alívio da dor** (grid de mini-cards pastéis)
- Banhos quentes, massagens sacrais, bola de pilates, deambulação, respiração, ambiente acolhedor.

**7. Manobras de Leopold** (acordeão com as 4 manobras)
- 1ª Situação, 2ª Posição, 3ª Apresentação, 4ª Insinuação — passo a passo curto por manobra.

**8. Ausculta dos BCF** (card final)
- Momento (antes/durante/após contração), localização (2ª manobra), instrumento (sonar Doppler / Pinard), contagem por 1 min.

### Estilo
Mesma paleta pastel usada em Escalas Clínicas: fundos suaves (rosa claro, pêssego, mint, lavanda), títulos em destaque, `<details>` nativo para expandir/recolher, sem cores hardcoded fora do tema. Linguagem didática de estudante, sem jargão gratuito.

### Como será aplicado (técnico)
- Um único `UPDATE` na tabela `mini_apps` (slug `obstetricia`) substituindo `content_md` pelo novo HTML rico.
- **Nenhum arquivo de código alterado** — a rota já renderiza `content_md` via `MiniAppContent`.
- Banner atual preservado; só os 2 textos citados são reescritos.

### Verificação
Abrir o mini app "Enfermagem Obstétrica" no app Acadêmico e conferir: banner com os novos textos, seções na ordem acima, acordeões abrindo/fechando, ausência de NANDA/NIC/NOC e do "resumo dos pontos-chave".
