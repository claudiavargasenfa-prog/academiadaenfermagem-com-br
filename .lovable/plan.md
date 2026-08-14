# Plano de Implementação: Área de Emissão de Certificado Avulso

O objetivo é criar uma interface em "Minha Conta" para que o aluno possa emitir certificados avulsos (pagos) informando o tema e a carga horária, integrando com o Mercado Pago para cobrança e liberando o certificado automaticamente após a confirmação.

## Alterações de Design e Texto

- Em `src/components/conta/BeneficiosPlano.tsx`:
    - Renomear o título da seção de "Benefícios do seu plano" para **"Emissão de Certificados"**.
    - Criar a nova área **"Emissão de Certificado"** com o texto explicativo solicitado.
    - Adicionar campo de texto livre para o **Tema estudado**.
    - Adicionar seletor de carga horária (10h, 20h, 30h, 40h) com seus respectivos preços (R$ 10, R$ 20, R$ 30, R$ 40).
    - Botão **"EMITIR CERTIFICADO"** que redireciona para o checkout.

## Alterações Técnicas

### 1. Banco de Dados (Supabase)
- Adicionar suporte a carga horária dinâmica em `public.user_certificates` (a coluna `hours` já existe, mas a função `issue_certificate` fixa em 10h).
- Adaptar o `public.issue_certificate` para aceitar `_hours` e opcionalmente um `_custom_theme`.
- Modificar o webhook para processar metadados de certificado avulso.

### 2. Frontend
- Atualizar `BeneficiosPlano.tsx` para incluir o formulário e a lógica de redirecionamento para o checkout com `metadata` (tema e horas).
- Garantir que o botão azul anterior seja removido conforme solicitado.

### 3. Backend (Server Routes)
- Refatorar `src/routes/api/public/payments.ts` para que, ao receber um pagamento aprovado de um "certificado avulso" (identificado via metadata no `orders`), ele chame a função de emissão no banco de dados com os parâmetros corretos.

## Detalhes Técnicos

- **Preços:** R$ 1,00 por hora (10h = R$ 10,00, etc).
- **Metadata:** O objeto `metadata` na tabela `orders` armazenará `{ type: 'certificate', theme: '...', hours: 20 }`.
- **Validação:** O webhook do Mercado Pago já valida a assinatura e consulta a API oficial antes de processar.

## User Review Required

> [!IMPORTANT]
> A funcionalidade de "Emissão de Certificado" avulso exige que o sistema reconheça o pagamento via Webhook. O fluxo será:
> 1. Usuário preenche o tema e horas.
> 2. Clica em emitir -> Cria um registro em `orders` com status `pending`.
> 3. Redireciona para o link do Mercado Pago.
> 4. Mercado Pago avisa nosso Webhook -> Webhook marca `orders` como `paid` e gera o certificado.
