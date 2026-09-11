# Só permitir cadastro com celular válido

## O que você pediu

Bloquear o cadastro de quem coloca um celular falso e, se possível, confirmar por SMS.

## Sobre o SMS

Enviar SMS não é gratuito: é preciso contratar um serviço de envio (por exemplo Twilio ou Zenvia)
e cada mensagem custa em média R$ 0,10 a R$ 0,30. Como hoje não há esse serviço contratado, o
plano abaixo faz duas coisas:

1. Aperta agora, sem custo, a checagem do número no cadastro.
2. Deixa o caminho pronto para ligar o SMS quando você quiser contratar (é só me avisar e me
   passar os dados do provedor).

## Etapa 1 — Validação forte do celular (sem custo, feita agora)

No formulário de cadastro, o número só passa se:

- Tiver 11 dígitos (DDD + 9 dígitos).
- O DDD for um DDD brasileiro que realmente existe.
- O primeiro dígito depois do DDD for 9 (celular, não fixo).
- Não for um número obviamente falso (todos os dígitos iguais, sequências como 99999999999,
  912345678, etc.).
- Não estiver já cadastrado por outra pessoa — mensagem clara: "Este celular já está em uso".

Enquanto a pessoa digita, o campo mostra a máscara (00) 90000-0000 e um aviso vermelho embaixo
quando o número não é aceito, em vez de só falhar ao clicar em Criar conta.

## Etapa 2 — Confirmação por SMS (quando você contratar)

Quando quiser ativar, o fluxo passa a ser:

1. Pessoa preenche o cadastro.
2. Recebe um código de 6 dígitos no celular.
3. Só depois de digitar o código certo a conta é criada e o período grátis liberado.
4. Reenvio permitido a cada 60 segundos, código expira em 10 minutos, máximo de 5 tentativas.

Isso elimina de vez cadastro com número inventado.

## O que não muda

Layout, cores, textos das academias, pagamentos, período grátis de 15 dias individuais, login por
e-mail e Google — tudo continua igual.

## Detalhes técnicos

- `src/lib/phone-br.ts` (novo): `normalizePhoneBR`, lista de DDDs válidos, detecção de padrões
  repetidos/sequenciais, `formatPhoneBR` para a máscara.
- `src/components/AuthGate.tsx`: substituir a checagem `length < 10 || > 11` por
  `validatePhoneBR`, aplicar máscara no `onChange` do campo e exibir erro inline abaixo do input.
- `src/lib/trial-guard.functions.ts`: em `checkTrialEligibility`, adicionar verificação de celular
  já vinculado a um perfil existente (`profiles.phone`) via `supabaseAdmin`, retornando
  `{ allowed: false, reason: "Este celular já está em uso." }`. Essa checagem vale sempre, inclusive
  durante a campanha (hoje a campanha retorna `allowed: true` antes de qualquer consulta).
- Etapa 2 (só ao contratar o provedor): habilitar phone auth no backend, guardar o token do
  provedor como segredo e inserir um passo de OTP entre o formulário e `supabase.auth.signUp`.
