## Plano de Revisão do App

Vou aplicar todas as mudanças em blocos. Como são muitas alterações, divido em 4 blocos. Confirme para eu começar pelo Bloco 1.

---

### Bloco 1 — Ajustes de texto e campos (rápido)

1. **Início (`/`)**: trocar subtítulo por:
  *"Faça login e tenha acesso a todo o conteúdo, tudo salvo no seu app. mesmo offline."*
2. **Diário de Bordo → Identificação**: tornar editáveis os campos **Campo**, **Preceptor** e **Período** (hoje não digitam).
3. **Segurança**:
  - Renomear rota/título para **"Segurança do Paciente"**.
  - Remover todas as abreviaturas no menu lateral e nos atalhos rápidos da Home (escrever por extenso: "Sinais Vitais", "Sinais Vitais Pediátricos", "Sinais Vitais Gestante", "Segurança do Paciente", "Cálculos de Medicamentos", "Procedimentos e Exame Físico" etc.).

---

### Bloco 2 — Calculadora de Medicamentos

1. **Dose por Peso** passa a ter 3 campos:
  - Peso do paciente (kg)
  - Dose recomendada (mg/kg)
  - Concentração do medicamento (mg/mL)
  - Resultado: **Dose Total (mg) = Peso × Dose** e **Volume (mL) = Dose Total ÷ Concentração**.
2. Adicionar bloco **"Considerações de Segurança"** logo após Equipos e Conversões, com os 5 itens enviados (Verificação, Atenção às Concentrações, Ferramentas, Profissional de Saúde, Nota de precisão pediátrica).

---

### Bloco 3 — Mini app único "Exame físico & Escalas de avaliações"

1. Unificar **Escalas** + **Exame Físico** em um único mini app chamado **"**Exame físico & Escalas de avaliação**"** (rota `/exame fisico-escalas`); remover entradas duplicadas do menu.
2. **Exame Físico Céfalo-Caudal**: cada item vira clicável → abre popover/modal com explicação curta do *que examinar* + **desenho/ícone ilustrativo** de cada região (cabeça, tórax, abdome, MMSS, MMII, etc.).
3. **Escalas**: cada escala recebe:
  - Linha verde divisória entre uma escala e outra quando abertas.
  - Botões **Calcular / Como usar / Indicação / Limites** em verde mais escuro.
  - **Score final destacado** no fim de cada escala (ex.: "Escala de Coma de Glasgow — Score: 13 → Trauma leve").
4. **Sinais Vitais Pediátricos**: incluir a **Escala de Dor com carinhas** (0–10, Sem dor → Pior dor possível) usando o desenho enviado.

---

### Bloco 4 — Relatório de estágio - ABNT pago 

1. **Novo mini app "Relatório de Estágio em ABNT"**: (fica dentro da minha lojinha bloqueado, liberado, quado comprado)
  - Puxa **automaticamente** todos os dados do Diário de Bordo (identificação, atividades, reflexões) e monta o relatório na estrutura ABNT (capa, introdução, desenvolvimento por dia, considerações finais, referências).
  - **Pago — R$ 60,00** (one-time, cadastrado na Cakto como os outros).
  - **Trava de uso único por aluno**: cada compra dá direito a **1 relatório**, com **4 aberturas/correções/impressões** extras (total 5 acessos: gerar + 4 correções). Depois disso, bloqueia.
  - Tela antes da compra mostra explicitamente: *"Uso único. Você poderá abrir, corrigir e imprimir até 2 vezes após gerar. Vinculado ao seu cadastro — não transferível."*
  - Backend: nova tabela `relatorio_uses` (user_id, mini_app_id, opens_left INT default 4, generated_at) com RLS por `auth.uid()`. Cada abertura decrementa `opens_left`. Webhook Cakto cria o registro ao pagar.
  - Cadastro inicial do mini app no admin com link Cakto (você me envia depois). não sei como faz

---

### Ordem de execução

Bloco 1 → Bloco 2 → Bloco 3 → Bloco 4 (o mais pesado).

**Posso começar pelo Bloco 1? sim**

&nbsp;