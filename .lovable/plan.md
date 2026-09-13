# Conectar o app ao GitHub (para usar com o ChatGPT)

## Objetivo
Criar uma ponte entre seu app Lovable e o GitHub. Com isso, você poderá pedir correções e melhorias no ChatGPT, ele fará as alterações no GitHub, e o Lovable puxa tudo automaticamente de volta para o seu app.

## Como funciona a ponte

```text
┌──────────────┐      edita código       ┌──────────┐
│   ChatGPT    │ ───────────────────────▶ │  GitHub  │
└──────────────┘                          └────┬─────┘
                                               │ sincroniza
                                               ▼
                                        ┌──────────────┐
                                        │  Lovable     │
                                        │  (seu app)   │
                                        └──────────────┘
```

- **Lovable → GitHub:** tudo que já existe no seu app vai para o GitHub
- **GitHub → Lovable:** quando o ChatGPT (ou você) mudar algo no GitHub, o Lovable recebe automaticamente

## O que será feito

### Passo 1 — Conectar o projeto ao GitHub (você faz, 2 minutos)
1. No editor Lovable, clique no botão **+ (Plus)** no canto inferior esquerdo do chat
2. Escolha **GitHub** → **Connect project**
3. Autorize o Lovable na sua conta do GitHub (se não tiver conta, crie grátis em github.com)
4. Clique em **Create Repository** — o Lovable cria um repositório com todo o código do seu app

### Passo 2 — Conectar o ChatGPT ao mesmo GitHub (você faz)
1. No ChatGPT, vá em **Configurações** → **Aplicativos conectados** (ou "Connected apps")
2. Conecte sua conta do **GitHub**
3. Quando quiser fazer uma correção no app, diga ao ChatGPT o nome do repositório e o que precisa mudar

### Passo 3 — Testar a sincronização (eu faço)
1. Depois de conectado, faço uma pequena alteração de teste
2. Confirmamos que ela aparece no GitHub
3. Você testa pedir algo simples ao ChatGPT e verificamos se volta para o Lovable

## Importante saber

- **O GitHub é grátis** para esse uso
- **Seu código fica privado** — só você e quem você autorizar vê
- **A sincronização é automática** nos dois sentidos, sem precisar apertar botão
- **Você continua usando o Lovable normalmente** — o GitHub é só uma ponte extra
- Se algo der errado, o Lovable tem **histórico de versões** para voltar atrás

## O que NÃO muda
- Nada no visual ou funcionamento do app muda agora
- Seus alunos, pagamentos e conteúdo continuam exatamente iguais
- O app publicado no ar não é afetado

## Sua parte
Só o Passo 1 e 2 precisam de você (cliques na tela). Eu te guio em cada um. Depois disso, o caminho ChatGPT → GitHub → Lovable fica aberto para sempre.
