## O que verifiquei no banco (dados reais)

Mini apps ativos por aplicativo:

```text
Acadêmico ............. 17 mini apps · 17 seções (3 vazias)
Enfermeiro ............ 16 mini apps · 15 seções (3 vazias)
Técnico ............... 15 mini apps · 15 seções (3 vazias)
Estudante de Técnico ... 4 mini apps · 15 seções (11 vazias)
Arquivo — 2º Projeto .. 42 mini apps (arquivados)
```

Nenhum mini app está mais em "Sem seção (geral)". A diferença entre os apps tem 3 causas:

### 1. Os catálogos são realmente diferentes
- **Só no Enfermeiro (3):** Anamnese/Exame/Diagnósticos/Prescrição, Farmacologia Avançada, SAE Automática.
- **Só no Acadêmico (3):** Saúde Mental, Orientações para Anamnese/Exame/Evolução, Manual de Sobrevivência (este também no Estudante).
- **Só no Técnico (5):** HAS/DM, Sinais Vitais Adulto, Semana da Enfermagem, Ética do Técnico, Coleta de Dados + Admissão de Turno.
- **Acadêmico + Enfermeiro, fora do Técnico (4):** Simulação/Raciocínio Clínico, Fundamentos dos DE, CCR e Quizz, Obstetrícia.
- **Estudante de Técnico tem só 4** (Escalas, IRAS, Medicação, Manual) — por isso parece vazio.

### 2. Nomes de seção diferentes entre apps
- Acadêmico: **Obstetrícia** · **Neonatologia & Pediatria** · **SAE & Processos de Enfermagem**
- Técnico/Enfermeiro: **Obstétrica** · **Neonatologia e Pediatria** · **SAE & Processo de Enfermagem**
- **Curativos e Lesões de Pele** só existe no Técnico e Enfermeiro (e vazia).
- Acadêmico tem 3 seções extras criadas por engano (já existem como mini app): *SAE Descomplicada – COFEN 736/2024*, *Fundamentos dos Diagnósticos de Enfermagem*, *Diagnósticos de Enfermagem*.

### 3. Seções vazias
Promoção da Saúde, Postura e Ética, Manual de Sobrevivência (vazia no Técnico/Enfermeiro), Curativos, Saúde Mental (vazia no Enfermeiro) aparecem com **(0)** no Admin e não aparecem para o aluno.

## Plano de correção (1 migração + 1 ajuste de UI)

1. **Padronizar os títulos e a ordem das seções** nos 4 apps: Manual de Sobrevivência · Postura e Ética · Segurança do Paciente · Promoção da Saúde · IRAS · Farmacologia e Calculadoras · Clínica Médica · Saúde do Adulto · Saúde do Idoso · Saúde Mental · Obstetrícia · Neonatologia e Pediatria · Curativos e Lesões de Pele · SAE & Processo de Enfermagem · Quizzes e Simulações.
2. **Remover as 3 seções duplicadas do Acadêmico**.
3. **Igualar o catálogo** conforme a regra abaixo.
4. **Marcar seções vazias no Admin** como "sem conteúdo" (só UI, em `src/components/admin/AppsAdmin.tsx`), para não parecer erro.

## Regra de catálogo que vou aplicar (diga se quer diferente)

- **Enfermeiro** = todos os mini apps ativos (o mais completo).
- **Acadêmico** = tudo, menos os exclusivos do técnico (Ética do Técnico, Coleta de Dados de Turno).
- **Técnico** = clínicos/operacionais + Obstetrícia, Simulação, CCR e Quizz.
- **Estudante de Técnico** = básico (Manual, IRAS, Segurança, Escalas, Sinais Vitais, Medicação, Ética do Técnico, Quizzes).

Se preferir outra divisão, me diga e eu aplico exatamente como você quiser — tudo em uma execução só.
