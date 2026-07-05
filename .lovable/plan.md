## Tela "Minha História" — Fundadora da Academia da Enfermagem

### Objetivo
Criar uma nova rota `/minha-historia` com layout limpo e humanizado, apresentando a história da fundadora, sua foto profissional, os mascotes da Prevenção contra IRAS e um botão para o grupo do WhatsApp.

---

### Arquivos alterados / criados

1. **`src/routes/minha-historia.tsx`** — Nova rota da página.
   - Rota: `/minha-historia`
   - `head()` com title, description, og:title, og:description
   - Layout responsivo:
     - **Desktop**: grid 2 colunas (esquerda = foto + mascotes, direita = texto narrativo)
     - **Mobile**: coluna única empilhada (foto → mascotes → texto)
   - Componentes visuais:
     - Foto da fundadora em círculo com contorno verde (border-4 border-emerald-600/80 ou branco/60)
     - Abaixo da foto: mascotes `mascotes-iras.png.asset.json` acenando de forma simpática (animação leve de onda/wave)
     - Título principal com fonte display (Manrope) em tom verde escuro
     - Texto da história estruturado em seções: "A História", "O Propósito", "Minha Promessa"
     - Botão verde destacado do WhatsApp no final (ícone WhatsApp + texto "Entrar no grupo do WhatsApp")

2. **`src/components/AppShell.tsx`** — Adicionar link "Minha História" na navegação:
   - Adicionar ao `baseNav` (após "Minha Conta")
   - Ícone: `BookOpen` do lucide-react
   - Mobile bottom tab: incluir nos primeiros 5 itens

3. **Asset da foto** — Upload da imagem `CAMISA_AZUL_NA_SALA.jpeg` via `lovable-assets` para CDN, gerando o `.asset.json` pointer em `src/assets/foto-fundadora.jpeg.asset.json`.

---

### Design & Estilo

- Paleta: tons de verde da marca (primary emerald, gold accent) via tokens do `styles.css`
- Fundo: leve gradiente sutil verde/claro ou branco puro — o que fique mais limpo e elegante
- Tipografia: `font-display` (Manrope) para títulos, `font-sans` (Inter) para corpo
- Foto: `rounded-full`, `border-4 border-primary/80`, sombra suave (`shadow-soft`)
- Mascotes: tamanho médio (~120px), animação de `animate-bounce` leve ou CSS custom de "aceno"
- Botão WhatsApp: `bg-green-600` ou similar verde intenso, texto branco, ícone WhatsApp, `rounded-xl`, sombra, hover escurecer

---

### Texto (conteúdo exato a ser inserido)

**Título Principal**: "Da Beira do Leito para a Tecnologia: Conheça um pouco da minha História."

**A História**: "A Academia da Enfermagem não nasceu em um escritório de tecnologia de computadores. Ela nasceu nos corredores de hospitais, nas noites em claro de plantão e na vivência real de quem dedicou 35 anos da vida à arte de cuidar. Sou auxiliar de enfermagem e enfermeira e, assim como você, passei décadas sentindo a dor de usar horas preciosas do plantão preenchendo as burocracias necessárias em papéis e tentando decifrar manuais complexos, em vez de focar no que realmente importa: o nosso paciente."

**O Propósito**: "Após me aposentar, a apenas 4 anos, decidi que a minha missão ainda não estava cumprida. Eu precisava usar toda a minha bagagem prática para criar a ferramenta que eu sempre sonhei em ter na beira do leito. Um ecossistema simples, ágil e seguro, feito de enfermeira para a enfermagem, de enfermeira para estudante, a final, também passei por esse caminho."

**Minha Promessa**: "A Academia da Enfermagem é o resultado de uma vida inteira de dedicação. Ela foi feita para mitigar o seu tempo, descomplicar o seu estágio, garantir a precisão dos seus cálculos e te levar uma certa segurança jurídica, desde que bem empregada, tudo baseado rigorosamente nas leis do nosso COFEN. Seja muito bem-vindo à evolução da nossa categoria. Aqui, nós cuidamos de quem cuida!"

**Botão WhatsApp**: Link `https://chat.whatsapp.com/HUv5XdngfQYGR3pxWuG3J3` com texto "Entrar no grupo do WhatsApp"

---

### Dependências
- Nenhuma nova dependência npm necessária.
- Ícone WhatsApp: usar SVG inline ou `MessageCircle` do lucide-react (sem instalar nada novo).