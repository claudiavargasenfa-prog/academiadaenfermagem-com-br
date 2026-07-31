# Punção Venosa Periférica — conteúdo premium com imagens passo a passo

Hoje o procedimento "Punção Venosa Periférica — Adulto" (dentro de Procedimentos de Enfermagem) está marcado como "Em produção": tem materiais, indicações, contraindicações, complicações e checklist, mas nenhuma cena ilustrada. O player animado já existe e funciona — falta o conteúdo visual.

## O que será feito

1. **12 ilustrações originais** (estilo médico-didático, cores claras/bebê no padrão do app), uma por etapa:
   1. Higienização das mãos e preparo da bandeja
   2. Identificação do paciente e explicação do procedimento
   3. Escolha do membro e avaliação da rede venosa
   4. Aplicação do garrote 10–15 cm acima do sítio
   5. Seleção da veia (mapa das veias do antebraço/dorso da mão)
   6. Calçar luvas e antissepsia com movimento unidirecional
   7. Tracionar a pele e posicionar o cateter (bisel para cima, 15–30°)
   8. Punção e observação do refluxo
   9. Recuar a agulha e progredir o cateter
   10. Soltar o garrote, acionar dispositivo de segurança e descartar em perfurocortante
   11. Conectar extensor, salinizar e testar permeabilidade
   12. Fixação com filme transparente, identificação (data/hora/calibre) e registro

2. **Texto de cada cena**: título, descrição técnica e um alerta "Atenção" com o erro mais comum daquela etapa.

3. **Pontos pulsantes (overlays)** sobre a imagem indicando onde olhar (local da veia, ângulo da agulha, ponto de fixação) — recurso já suportado pelo player.

4. **Remover o aviso "Em produção"** desse procedimento, mantendo os demais blocos (materiais, indicações, contraindicações, complicações, checklist interativo e referências) como estão.

5. Opcional, sem custo extra de imagens: reaproveitar as mesmas cenas na versão "Punção com Dispositivo de Segurança", ajustando as etapas 10–12.

## Detalhes técnicos

- Imagens geradas em `src/assets/procedimentos/puncao/` e referenciadas por import no arquivo de dados.
- Edição apenas em `src/data/procedimentos/puncao-adulto.ts`: preencher `cenas[]` (ordem, título, descrição, atenção, imagem, overlays, duração ~6s) e remover `emProducao: true`.
- Nenhuma mudança no player, no design ou no restante do app.

## Observação sobre custo

São 12 imagens geradas por IA — é a parte mais pesada do trabalho. Se preferir começar menor, posso fazer 6 cenas essenciais agora e completar depois.
