# Correção completa do SEO e Google Search Console

## Diagnóstico confirmado

- A revisão técnica atual passou em **9 de 9 verificações básicas**: página inicial acessível, leitura pelo Google, renderização completa, `robots.txt`, sitemap, idioma, celular, ícone, título e descrição.
- O domínio principal responde corretamente em `https://academiadaenfermagem.com.br`, e `www` redireciona para ele.
- O bloqueio do Google Search Console é real: **nenhuma conexão está ligada a este projeto**.
- A única conexão disponível, “Enfermagem's Google Search Console”, pertence a outra pessoa. Você consegue vê-la, mas o proprietário deste projeto não tem permissão para vinculá-la.
- O sitemap publicado funciona, mas está incompleto: lista 14 endereços e deixa de fora páginas públicas importantes.
- O sitemap inclui páginas de cadastro, que não devem aparecer no Google.
- Páginas privadas ou operacionais ainda podem ser indexadas: Área VIP, checkout, redefinição de senha, trilhas e conteúdos pagos.
- `/novo-app` repete o conteúdo de `/escalas-clinicas`, criando duplicidade.
- A página de validação não tem endereço principal declarado ao Google.

## Plano de correção

### 1. Criar e vincular uma conexão própria do Google

- Abrir uma **nova conexão** do Google Search Console usando a conta Google da proprietária.
- Não reutilizar a conexão antiga sem permissão.
- Confirmar que a nova conexão ficou vinculada a este projeto.

### 2. Organizar o que deve aparecer no Google

- Manter indexáveis as páginas públicas institucionais, comerciais e educativas.
- Retirar do Google: Admin, Minha Conta, Área VIP, checkout, cadastro, redefinição de senha, diário pessoal, prescrição pessoal, trilhas, Mini Apps e demais conteúdos protegidos por assinatura.
- Preservar o acesso normal dos alunos; essa alteração afeta somente os robôs de busca.

### 3. Corrigir o sitemap

- Remover do sitemap os endereços de cadastro.
- Incluir as páginas públicas úteis que já existem, como sinais vitais, escalas clínicas, IRAS, procedimentos, segurança, saúde mental, SBV, UTI, quizzes públicos e materiais institucionais.
- Não incluir páginas de conta, pagamento, administração ou conteúdo pago.
- Manter o domínio oficial sem `www` e sem datas artificiais de atualização.

### 4. Eliminar duplicidade e corrigir metadados

- Transformar `/novo-app` em redirecionamento permanente para `/escalas-clinicas`.
- Adicionar o endereço principal correto à página `/validacao`.
- Garantir título, descrição, endereço principal e informações de compartilhamento próprios nas páginas públicas relevantes.
- Remover informações globais que possam substituir indevidamente os dados específicos de cada página.
- Substituir imagens da página ADEC que ainda dependem do endereço temporário de prévia.

### 5. Verificar o domínio no Google

- Solicitar ao Google a etiqueta oficial de verificação para `https://academiadaenfermagem.com.br/`.
- Inserir a etiqueta exata no cabeçalho do site junto das correções do sitemap.
- Publicar uma única vez e confirmar que a etiqueta e o sitemap estão visíveis no domínio oficial.
- Concluir a verificação e adicionar a propriedade à conta.

### 6. Enviar e validar o sitemap

- Consultar novamente as propriedades verificadas e selecionar exatamente a propriedade do domínio oficial.
- Enviar `https://academiadaenfermagem.com.br/sitemap.xml`.
- Conferir o status informado pelo Google sem atribuir causas não comprovadas.
- Consultar a situação da página inicial na versão conhecida pelo índice do Google.

### 7. Confirmação final

- Executar nova revisão técnica de SEO.
- Testar páginas públicas, redirecionamentos, páginas privadas e sitemap no celular e computador.
- Atualizar as falhas de SEO somente depois de cada correção estar realmente concluída.
- Entregar um resumo simples: conexão, propriedade verificada, sitemap enviado, páginas indexáveis e páginas protegidas.

## O que não será alterado

- Conteúdo dos Mini Apps.
- Acesso, pagamentos ou assinaturas dos alunos.
- Organização das Academias.
- Textos visíveis, exceto onde houver endereço/imagem técnica incorreta.
