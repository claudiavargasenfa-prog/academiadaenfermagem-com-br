# Cateterismo Vesical — reorganização e passo a passo feminino

## Modelo que já está feito (resposta direta)

O mini app **CATETERISMO VESICAL** (App Acadêmico) não é uma página de código: todo o conteúdo está salvo no campo de conteúdo do próprio mini app no banco (hoje com ~32.500 caracteres) e é renderizado como HTML.

O padrão visual atual é:

- **Banner de topo** em degradê tons bebê (azul-céu → verde-água → rosa) com ícone 💧 em círculo branco, título em maiúsculas, subtítulo rosa e tarja com a base normativa (ANVISA 2025, CDC, COFEN 450/2013 e 736/2024).
- **Linha de "chips"** numerados (1 · Passo a passo, 2 · Indicações, 3 · POP, 4 · Manutenção, 5 · Checklists), cada um com sua cor pastel.
- **Sanfonas** (`details/summary`) com fundo pastel, borda suave, sombra leve, ícone emoji, título + linha descritiva e o rótulo "ABRIR ▾".
- Dentro das sanfonas: parágrafos, **figuras com foto real + legenda técnica**, caixas de alerta (vermelha/âmbar/verde) e tabelas em tom pastel.

Tudo o que for acrescentado seguirá exatamente esse mesmo padrão — nada de design novo.

## O que muda

1. **Título do banner** passa a ser: *CATETERISMO VESICAL DE ALÍVIO E DE DEMORA — FEMININO & MASCULINO*, com subtítulo indicando técnica completa nos dois sexos.
2. **Nova sanfona 1 — Conceitos: alívio × demora**, com o texto enviado e a **tabela comparativa** (6 critérios: cateter, permanência, indicações, técnica, risco de ITU, registro) em tons bebê, com rolagem lateral no celular.
3. **Nova sanfona 2 — Preparo quando o enfermeiro está sozinho**, em duas etapas numeradas:
   - Abordagem ao paciente/família, retorno ao posto, lavagem das mãos, preparo do material, biombos, despir/ajudar, luvas de procedimento, comadre, higiene íntima, cobrir com lençol, retirar luvas e álcool nas mãos.
   - Montagem do campo estéril: mesa junto ao leito, abertura do kit, campo esticado, cuba/bandeja com pinça de assepsia e pinça dente de rato, abertura de seringa/agulha, soro fisiológico 0,9% na cuba, abertura do coletor sem contaminar, fixação da ponta com a pinça dente de rato no campo e coletor já pendurado na cama na posição final.
4. **Nova sanfona 3 — Passo a passo técnico completo, paciente FEMININA**, com as 8 imagens enviadas, na ordem: 1. Higiene das mãos · 2. Identificação do paciente · 3. Reunião do material · 4. Posicionamento da paciente · 5. Higiene íntima · 6. Colocação do campo estéril · 7. Calçar luvas estéreis · 8. Lubrificação da sonda. Cada imagem recebe legenda técnica + descrição do que se vê + pontos críticos (uretra de 3–5 cm, posição ginecológica, antissepsia de cima para baixo em movimento único, erro de sondar a vagina, insuflar só após refluxo).
5. **Passo a passo MASCULINO** é mantido como está (4 cenas já publicadas), apenas reposicionado depois do feminino.
6. As seções já existentes (indicações/contraindicações, POP de inserção, manutenção e troca, checklists e indicadores) permanecem iguais, reordenadas para o fim, e os chips de navegação são atualizados para a nova ordem.

## Detalhes técnicos

- As 8 imagens enviadas serão publicadas via Lovable Assets (`lovable-assets create`), gerando ponteiros `.asset.json` em `src/assets/cvd-fem/`; as URLs de CDN entram nas tags `<img>` do conteúdo, no mesmo formato das 4 fotos masculinas já usadas.
- O conteúdo é atualizado no registro `mini_apps` de slug `CVD` (id `0d619edc-…`), reescrevendo o campo de conteúdo completo com a nova ordem.
- Nenhuma alteração de rota, de componente React ou de estilo global — apenas conteúdo do mini app.
