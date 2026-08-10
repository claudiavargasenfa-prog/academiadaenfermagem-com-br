# Anamnese, Exame Físico, Diagnósticos, Prescrição e Evolução — Modo Treinamento

Transformar esse mini app (rota `/diagnosticos-aede`) em uma **trilha de treinamento clínico**, usando a planilha mestre ADEC (1.344 códigos) que já está no app, em vez da lista pequena que ele usa hoje.

## Como vai funcionar para o aluno

Seis passos, com barra de progresso e pontuação:

1. **Anamnese** — identificação, queixa, história e antecedentes (campos + marcações rápidas).
2. **Exame físico** — sinais vitais e achados por sistema (marcações).
3. **Evidências clínicas / Sinais e sintomas** — tudo que foi **marcado ou escrito** nos passos 1 e 2 (inclusive ditado por voz) cai automaticamente aqui, já separado entre "reconhecido pela planilha" e "texto livre". O aluno pode incluir/excluir itens.
4. **Diagnósticos (com ensinamento crítico)** — o app faz a busca na planilha e mostra as hipóteses ordenadas por prioridade. Antes de revelar as melhores, o aluno escolhe quais considera corretos; ao confirmar, recebe o retorno:
   - acertos, o que faltou e o que foi escolhido sem sustentação;
   - para cada hipótese: **quais achados do paciente a geraram**, os **critérios essenciais** (coluna 5), a **hipótese diagnóstica** (coluna 7) e o **objetivo assistencial** (coluna 10);
   - selo de correspondência (Alta/Média/Baixa) e explicação do raciocínio clínico.
5. **Prescrição** — monta a prescrição a partir das intervenções da coluna 8 dos diagnósticos escolhidos, com horário, aprazamento e prioridade clínica editáveis. O aluno também recebe crítica aqui: intervenção obrigatória que ficou de fora é sinalizada.
6. **Evolução** — texto final gerado automaticamente reunindo anamnese, exame físico, evidências clínicas, diagnósticos escolhidos (com metas) e a prescrição. Botões de copiar, imprimir e baixar.

No fim: **placar do treinamento** (diagnósticos e intervenções acertados, % de acerto) e opção de refazer com outro caso.

Casos prontos para treinar (respiratório, hemodinâmico, neurológico e mais alguns) continuam disponíveis com um clique, e há o modo "paciente em branco" para o aluno digitar o caso real.

## Prioridade da busca

A busca passa a valorizar, nesta ordem: **critérios essenciais (col. 5)** → **hipótese diagnóstica (col. 7)** → **intervenções/palavras-chave (col. 8)** → **objetivo (col. 10)**, mantendo o filtro por idade/sexo/setor que já existe (não sugerir diagnóstico obstétrico para homem, por exemplo) e o corte que descarta hipóteses sem nenhum achado específico do paciente.

## Detalhes técnicos

- Reescrita de `src/routes/diagnosticos-aede.tsx` mantendo o visual atual (AppShell, Cards, passos).
- Fonte de dados: `src/data/sae-banco.json` via `src/lib/sae-engine.ts` (`matchDiagnosticos`, `separarSinaisSintomas`, `buildEvolucao`), no lugar das tabelas `diagnosticos_aede` / `diagnosticos_condutas`.
- Ajuste em `sae-engine.ts`: pesos por coluna (5 > 7 > 8 > 10) expostos numa constante única, e `matchDiagnosticos` passa a devolver também os critérios essenciais/objetivo já formatados para a tela de crítica. Nada muda no comportamento do mini app SAE Descomplicada, que usa a mesma função com os pesos atuais como padrão.
- Novo componente `src/components/sae/TreinamentoFeedback.tsx` para a crítica e o placar.
- Estado do caso salvo em `localStorage` para o aluno não perder o preenchimento.
- Sem mudanças de banco de dados e sem mexer em pagamentos, acessos ou nos demais mini apps.
