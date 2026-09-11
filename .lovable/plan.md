# Celular obrigatório e válido no cadastro

## O que muda

No formulário de cadastro, o campo de celular passa a ser obrigatório e só aceita um número
brasileiro real. Abaixo do campo aparece o aviso:

> Obrigatório um celular ativo — você poderá receber confirmação.

## Regras de aceitação do número

O cadastro não conclui se o número:

- não tiver 11 dígitos (DDD + 9 dígitos);
- tiver um DDD que não existe no Brasil;
- não começar com 9 depois do DDD (ou seja, fixo não é aceito);
- for claramente falso (todos os dígitos iguais, sequências como 11999999999 ou 11912345678);
- já estiver cadastrado por outra pessoa — nesse caso a mensagem é "Este celular já está em uso".

Enquanto a pessoa digita, o número é formatado sozinho como (00) 90000-0000 e, se estiver errado,
o aviso aparece em vermelho logo abaixo, sem precisar clicar em Criar conta.

## Sobre o SMS

Este passo deixa o número confiável e avisa a pessoa que poderá receber confirmação. O envio
automático do código por SMS depende de contratar um serviço de mensagens (custa por mensagem
enviada). Quando você quiser ativar, é só me falar que eu ligo o código de 6 dígitos no cadastro.

## O que não muda

Layout, cores, textos das academias, período grátis de 15 dias, pagamentos e login por e-mail e
Google continuam iguais.

## Detalhes técnicos

- `src/lib/phone-br.ts` (novo): lista de DDDs válidos, `validatePhoneBR` (11 dígitos, nono dígito 9,
  rejeição de repetidos/sequenciais) e `formatPhoneBR` para a máscara.
- `src/components/AuthGate.tsx`: trocar a checagem `phoneDigits.length < 10 || > 11` por
  `validatePhoneBR`, aplicar máscara no `onChange`, marcar o input como `required` com
  `inputMode="tel"`, e renderizar o texto de ajuda e o erro inline abaixo do campo.
- `src/lib/trial-guard.functions.ts`: em `checkTrialEligibility`, antes do atalho de campanha,
  consultar `profiles.phone` via `supabaseAdmin` e retornar
  `{ allowed: false, reason: "Este celular já está em uso." }` quando houver duplicidade.
