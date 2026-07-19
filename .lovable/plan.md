Diagnóstico técnico confirmado:

1. O manifest existe e está válido.
2. O Chrome não aponta erro de instalabilidade no manifest.
3. Porém o service worker não fica registrado no domínio publicado.
4. O arquivo `sw.js` gerado está tentando cachear arquivos no caminho `/client/assets/...`, mas no site publicado os arquivos reais estão em `/assets/...`. Esses caminhos dão 404.
5. Resultado prático: o PWA fica tecnicamente incompleto para o Chrome Android liberar o banner automático de instalação.
6. O botão interno “Instalar App” também não aparece para visitante não logado, porque está dentro do layout protegido por login.

Plano de correção:

1. Ajustar a configuração do PWA para gerar o cache com os caminhos corretos do site publicado, removendo o prefixo incorreto `client/` dos arquivos cacheados.
2. Garantir que o service worker registre corretamente em `academiadaenfermagem.com.br` e continue bloqueado no preview do Lovable, para não travar versões antigas.
3. Tornar o botão “Instalar App” visível também na tela pública de login/cadastro, não apenas depois que a pessoa entra no app.
4. Adicionar metadados móveis faltantes para Android/iPhone, como `apple-touch-icon` e tags de app mobile, mantendo o nome “Academia da Enfermagem”.
5. Depois da implementação, testar tecnicamente no domínio publicado: manifest, service worker, erros de instalabilidade e presença do botão de instalação.

Observação importante: no Android o banner automático depende do Chrome e pode não aparecer em todos os acessos; por isso o botão fixo “Instalar App” será a solução prática e controlável dentro do próprio app.