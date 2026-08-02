# Página de cadastro como boas-vindas

Transformar `/cadastro/{slug}` numa página de boas-vindas: em vez de abrir direto no formulário nu, o cliente chega numa tela acolhedora, personalizada pela academia que ele comprou/escolheu, com o formulário logo ao lado (desktop) ou abaixo (mobile).

## O que o cliente vê

1. **Faixa de boas-vindas** com o logo ADEC e o nome da academia:
   "Bem-vinda(o) à Academia do Acadêmico" (ou Técnico, Estudante de Técnico, Enfermeiro), com o slogan já usado na página de planos.
2. **Aviso importante para quem comprou**: "Crie sua conta com o mesmo e-mail usado na compra — é assim que seu acesso é liberado automaticamente."
3. **3 passos rápidos**: 1) Criar conta · 2) Confirmar e-mail · 3) Entrar no app — mostrando que leva menos de 1 minuto.
4. **O que você recebe agora**: 4 a 5 tópicos curtos do que aquela academia entrega (SAE automatizada, escalas, procedimentos ilustrados, calculadoras, quizzes), com selo de 15 dias grátis sem cartão.
5. **Formulário de cadastro**, já com a categoria correta pré-selecionada pelo link (comportamento atual mantido), com "Já tem conta? Entrar" ao lado.
6. **Rodapé de confiança**: conteúdo baseado em COFEN/ANVISA/MS, apoio educacional, e link "Ver detalhes do plano" para `/planos/{slug}`.

Visual: mesma identidade da marca (verde-água/verde-floresta, detalhes em ouro), cartão em vidro sobre o fundo verde — sem mudar o design do formulário em si.

## Detalhes técnicos

- Editar apenas `src/routes/cadastro.$slug.tsx`: envolver `AuthScreen` num novo layout de boas-vindas, mantendo `AuthScreen cadastroSlug={slug}` como está (a lógica de antifraude, trial e signup não muda).
- Criar `src/components/cadastro/WelcomePanel.tsx` com o conteúdo por slug (título, slogan, bullets), reaproveitando os rótulos/slogans já definidos em `planos.$slug.tsx`.
- Adicionar uma prop opcional `embedded` em `AuthScreen` para esconder o cabeçalho duplicado (logo + título) quando ele já aparece no painel de boas-vindas; sem essa prop, nada muda em `/` nem no `AuthGate`.
- Atualizar o `head()` da rota: título e descrição de boas-vindas por academia (og:title/og:description iguais).
- Layout: grid de 2 colunas em `lg`, empilhado no mobile (painel de boas-vindas primeiro, formulário logo abaixo).

Sem mudanças de banco de dados, autenticação ou cobrança.
