# Página de Validação de Certificado + novo modelo de certificado

## O que será feito

### 1. Nova página pública `/validacao`
Réplica fiel da 1ª imagem enviada:
- Faixa verde escura no topo com o logotipo ADEC, título "VALIDAR CERTIFICADO" e a linha dourada com o ponto central.
- Bloco de instrução com o escudo dourado ("Digite o código do seu certificado...").
- Caixa branca com o campo "CÓDIGO DO CERTIFICADO" (exemplo: ADEC-01-023-0099-0826), botão verde "VALIDAR" e, à direita, o bloco "OU ESCANEIE O QR CODE".
- Resultado da consulta: painel verde "CERTIFICADO VÁLIDO — AUTENTICIDADE CONFIRMADA", dados do certificado (Nome do Aluno, Curso/Módulo, Carga Horária, Data de Conclusão, Código) e, à direita, Data da Validação com a assinatura institucional.
- Quando o código não existir: mesmo painel em vermelho, "CERTIFICADO NÃO LOCALIZADO".
- Rodapé "SEGURANÇA E CONFIANÇA" e a barra verde de direitos reservados.
- A página abre também com o código já preenchido pelo link do QR Code: `/validacao?codigo=ADEC-01-023-0099-0826`.
- Acesso livre, sem login. Mostra o nome completo do aluno, conforme decidido.

### 2. Novo padrão de código
Formato: `ADEC-AA-NNN-CCCC-MMAA`
- `AA` = academia: 01 acadêmico, 02 enfermeiro, 03 estudante de técnico, 04 técnico.
- `NNN` = número do mini app (3 dígitos), gerado automaticamente em ordem alfabética dentro de cada academia.
- `CCCC` = número do certificado, começando em `0099` e seguindo 0100, 0101...
- `MMAA` = mês e ano da emissão (agosto/2026 = 0826).

Os números dos mini apps ficam gravados no banco e visíveis no painel de admin (podem ser reordenados depois, se você quiser).

### 3. Novo modelo de certificado (2ª imagem)
O certificado atual é substituído pelo modelo enviado, mantendo tudo igual: moldura dourada com ondas verdes, logotipo ADEC no topo, "CERTIFICADO", nome do aluno em manuscrito dourado, texto "concluiu com êxito o módulo técnico de especialização em ...", carga horária, selo "QUALIDADE PREMIUM ADEC", assinatura ADEC com a pena e o QR Code de validação no canto inferior esquerdo.
- O QR Code aponta para `https://academiadaenfermagem.com.br/validacao?codigo=...`.
- Continua abrindo em nova aba para imprimir ou salvar em PDF, em formato paisagem.

## Detalhes técnicos

- Migração: coluna `codigo` (2 dígitos) em `apps`; coluna `codigo` (3 dígitos) em `mini_app_placements`, preenchida em ordem alfabética por academia; sequência `certificado_seq` iniciando em 99; alteração de `issue_certificate` para montar o código no novo formato.
- Função `validar_certificado(_code text)` (security definer) exposta ao papel `anon`, devolvendo apenas nome, módulo, horas, data de emissão e código — sem expor `user_id` nem e-mail. Sem essa função a tabela `user_certificates` continua fechada por RLS.
- Nova rota `src/routes/validacao.tsx` com `head()` próprio (título, descrição, og/twitter).
- Geração do QR Code via biblioteca leve `qrcode` (data URL embutida no HTML do certificado).
- Ajuste do gerador de certificado em `src/components/conta/BeneficiosPlano.tsx` para o novo layout.
- Certificados já emitidos com o código antigo continuam válidos e consultáveis.

## Verificação

- Emitir um certificado de teste e conferir o código no formato `ADEC-01-023-0099-0826`.
- Ler o QR Code e confirmar que a página abre já validada.
- Testar um código inexistente e conferir a mensagem de não localizado.
- Conferir a página em celular e no computador.
