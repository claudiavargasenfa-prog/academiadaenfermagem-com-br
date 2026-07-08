## Problema
No formulário admin do mini app "Diagnósticos e Prescrição AE/DE", o campo **Conteúdo (texto/markdown)** está exibindo `\n` literais no meio do texto ("...em 5 passos:\n\n1. Anamnese...\n2. Exame físico..."), em vez de quebras de linha reais.

Isso aconteceu porque, na correção anterior, o `content_md` foi gravado no banco com a sequência de caracteres `\` + `n` em vez de quebras de linha reais (`E'...'` faltando ou aspas simples normais interpretando `\n` como texto).

## Correção
Rodar UMA migração que faz `UPDATE public.mini_apps SET content_md = ...` para o slug `diagnosticos-aede`, usando string com quebras de linha reais (via `E'...\n...'` do Postgres ou string multi-linha), com este conteúdo:

```
Diagnósticos e Prescrição AE/DE

Siga os 5 passos para gerar diagnósticos e prescrição em até 2 minutos:

1. Anamnese — dados do paciente e queixa principal.
2. Exame físico — achados por sistema.
3. Sinais e sintomas — selecione os achados do paciente.
4. Diagnósticos — escolha os diagnósticos com CDE, MM e RC.
5. Prescrição — gere a tabela com Nº, Diagnóstico, Horário e Aprazamento.

Clique em acessar para abrir o formulário dinâmico completo.
```

Nenhuma outra mudança — só reescrever esse campo com as quebras de linha corretas. O front-end e o restante do mini app continuam iguais.