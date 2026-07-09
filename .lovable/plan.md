Entendi o problema do print: o campo grande do admin aparece vazio porque os 50 quizzes não ficam salvos em “Conteúdo / Markdown”. Eles estão em uma tela dinâmica própria (`/quizzes`) e em um arquivo de dados do app. Por isso o aluno vê os quizzes na página certa, mas o editor do admin parece vazio.

Plano para corrigir sem apagar nada:

1. Ajustar a tela do admin para mini apps dinâmicos
   - Quando o mini app tiver rota própria, como `/quizzes`, mostrar um aviso claro acima do campo vazio:
     “Este mini app usa uma tela dinâmica. O conteúdo principal não fica neste campo.”
   - Assim você não vai achar que perdeu o conteúdo.

2. Mostrar um resumo dos quizzes no próprio admin
   - Para o slug `quizzes`, exibir no editor:
     - total de quizzes encontrados;
     - total de perguntas;
     - primeiros títulos como conferência rápida.
   - Isso confirma visualmente que os quizzes continuam lá.

3. Proteger contra confusão no campo “Conteúdo / Markdown”
   - Manter o campo disponível apenas para descrição complementar.
   - Não mexer nos 50 quizzes nem sobrescrever o conteúdo dinâmico.

4. Conferir o link do card
   - Garantir que a rota interna continue `/quizzes`, para abrir a página dinâmica correta e não uma página genérica vazia.

Resultado esperado:
- No admin, o mini app “Quizzes de Enfermagem” não parecerá mais vazio.
- Os 50 quizzes continuarão intactos.
- Você conseguirá identificar que aquele mini app é dinâmico, não preenchido pelo campo markdown.