## Objetivo

Preencher o mini app **Código de Ética: Direitos, Deveres e Limites Técnicos** (hoje vazio, slug `etica-tecnico`) com um conteúdo bonito, fluido e didático, baseado na **Resolução COFEN nº 564/2017**, em tons pastel (azul bebê, verde menta, rosa claro, lilás suave).

## Fonte

Vou ler a página oficial do COFEN (Resolução 564/2017) e extrair, com fidelidade, os capítulos de **Direitos**, **Deveres**, **Proibições** e **Responsabilidades**, além das penalidades. Nada de invenção: cada bloco cita o artigo correspondente.

## Estrutura do conteúdo

1. **Capa (banner pastel)** — título, subtítulo "Resolução COFEN nº 564/2017", chips dos temas.
2. **AVISO EM DESTAQUE (logo abaixo da capa)** — faixa dourada/âmbar com ícone de alerta informando: *o Código de Ética está em processo de atualização desde março/2026, com previsão de publicação ainda em 2026*; enquanto isso, a Resolução COFEN nº 564/2017 permanece vigente, e o conteúdo do mini app será revisado assim que o novo texto for publicado.
3. **Por que isso importa** — 3 cartões curtos: proteger o paciente, proteger você, proteger a profissão.
4. **Princípios fundamentais** — resumo do preâmbulo em linguagem simples.
5. **SEUS DIREITOS** (cartões verde-menta) — recusa de atividade fora da competência, condições dignas de trabalho, objeção de consciência, acesso a informações, com nº do artigo.
6. **SEUS DEVERES** (cartões azul bebê) — registro, sigilo, comunicação, identificação, cuidado seguro.
7. **É PROIBIDO** (cartões rosa/coral suave) — foto de paciente em rede social, delegar fora da competência, administrar sem conferência, abandono de plantão, assinar o que não executou.
8. **Limites técnicos por categoria** — tabela pastel comparando o privativo do **Enfermeiro**, o que cabe ao **Técnico/Auxiliar** e o que o **Acadêmico** só faz sob supervisão.
9. **Penalidades** — advertência verbal, multa, censura, suspensão e cassação, em linguagem clara.
10. **Situações reais do dia a dia** — 5 mini-casos "e agora?" com a resposta ética correta.
11. **Checklist final** — "antes de agir, pergunte-se…" (5 itens).
12. **Rodapé** — repete de forma discreta o aviso da revisão em curso (março/2026, previsão 2026) + aviso educativo e referência COFEN.

## Estilo

Mesmo padrão visual já aprovado no projeto: cartões arredondados, gradientes suaves, ícones/emojis discretos, blocos curtos, muito respiro, leitura em tópicos. Paleta bebê: `#EAF4FF`, `#E7F7F0`, `#FDEEF4`, `#F3EEFB`, textos em `#1F3A5F`/`#4B5563`. O aviso da atualização usa âmbar suave (`#FEF3C7` com borda `#D4A84B`) para se destacar sem quebrar a harmonia.

## Detalhes técnicos

- Conteúdo em HTML inline (mesmo formato dos outros mini apps) gravado em `mini_apps.content_md` do registro `etica-tecnico`, via migração SQL — sem alterar componentes React nem o design do app.
- Nenhuma mudança em rotas, RLS ou tabelas; apenas `UPDATE` de conteúdo.
- Sem scripts/handlers inline (removidos pela sanitização): conteúdo 100% estático.
