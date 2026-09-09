# Diagnóstico: por que os alunos em período grátis não veem toda a Academia

## Resultado da investigação

A campanha e o banco **estão corretos**. O que quebrou foi o código que veio do GitHub.

Verifiquei no banco:

- Os cadastros recebem 15 dias individuais, contados da hora do próprio cadastro (ex.: cadastro 04/09 → vence 19/09; cadastro 29/08 → vence 13/09). Nenhuma data única de expiração.
- Cada aluno recebe o plano da categoria escolhida (acadêmico, técnico, estudante de técnico, enfermeiro).
- As Academias têm os conteúdos vinculados: Acadêmico 29, Estudante de Técnico 20, Técnico 24, Enfermeiro 30.
- As regras de acesso do banco (função de liberação e permissões) continuam corretas.

## A causa real

Algumas correções feitas direto no GitHub passaram a pedir ao banco uma **coluna que não existe**: `track_tecnico_estudante` na tabela dos Mini Apps. O banco só tem `track_academico`, `track_tecnico` e `track_enfermeiro` — a migration que criaria essa coluna nunca foi aplicada.

Consequências, exatamente o sintoma relatado:

1. `src/lib/catalog.functions.ts` — a busca do catálogo falha e o código devolve uma lista **vazia**. Sem catálogo, a página da Academia não consegue montar os cards, mesmo com os vínculos certos no banco. Isso afeta a trilha, a página Minha Conta e a de planos.
2. `src/lib/apps.ts` (`fetchPlacementsForApp`) — a mesma coluna inexistente faz a consulta dar erro e a página da Academia quebrar/ficar sem itens.

Ou seja: **não é RLS, não é o trial, não é placements, não é o frontend de bloqueio**. É desalinhamento entre o código do GitHub e o banco (migration não aplicada).

## Correção proposta (para sua aprovação, ainda não executada)

Opção recomendada — alinhar o banco ao código:

1. Criar a coluna `track_tecnico_estudante` na tabela dos Mini Apps (padrão: desmarcado).
2. Preencher essa marcação para os 20 conteúdos já vinculados à Academia do Estudante de Técnico, e conferir as demais marcações de trilha contra os vínculos existentes de cada Academia.
3. Nenhuma mudança nas regras de acesso, no trial de 15 dias, em preços, layout ou textos.

Alternativa (se preferir não mexer no banco): remover a coluna nova das duas consultas do código. Funciona, mas desfaz as correções feitas no GitHub e volta a depender só dos vínculos.

## Verificação após a correção

- Abrir cada uma das 4 Academias e conferir as contagens: 29 / 20 / 24 / 30.
- Entrar com um aluno em trial vigente e confirmar que todos os conteúdos da Academia dele aparecem liberados e abrem.
- Confirmar que quem não tem trial nem assinatura continua vendo só os gratuitos.

## Detalhes técnicos

- `mini_apps` não possui `track_tecnico_estudante`; `catalog.functions.ts` inclui essa coluna no `select` (PostgREST 42703) e o handler faz `return []` no erro, silenciando a falha.
- `apps.ts:85` faz o mesmo `select` e ainda `.eq(trackField, true)`, com `throw` no erro — quebra `/trilha/tecnico-estudante`.
- `access.ts` referencia `track_uti_emergencia` (também inexistente) apenas em memória, sem consulta ao banco: inofensivo hoje, mas vale normalizar.
- Correção via migration: `ALTER TABLE public.mini_apps ADD COLUMN track_tecnico_estudante boolean NOT NULL DEFAULT false;` + UPDATE marcando os `mini_app_id` presentes em `mini_app_placements` do app `tecnico-estudante`.
