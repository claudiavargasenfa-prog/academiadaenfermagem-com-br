
# Reorganização: todos os mini apps dentro das trilhas + admin total de usuários

Baseado no DOCX que você anexou. Nenhum app fica solto na loja — nem os grátis. Cada trilha vira a única porta de entrada dos seus apps.

## 1. Home: nova organização

Tira da home as seções "Conteúdo grátis" e "Demais mini apps". A home passa a ter:

```text
Header → Banner verde → 3 cards de trilha → Footer
```

Os mini apps só aparecem clicando numa trilha (`/trilha/academico`, `/trilha/enfermeiro`, `/trilha/tecnico`). Apps grátis continuam grátis (qualquer pessoa logada abre), mas a vitrine deles fica dentro da trilha correspondente.

## 2. Mapeamento de apps por trilha (vindo do DOCX)

Marca quem já existe (✅) e quem precisa ser criado vazio para você preencher depois (🆕).

### Trilha 1 — Academia de Enfermagem (R$ 24,99/mês)

```text
01 Manual de Sobrevivência do Estágio ........ ✅ FREE
02 Sinais Vitais (RN/Ped/Adulto/Gestante/Idoso) ✅ FREE (agrupar Adulto+Ped+Gestante+🆕RN+🆕Idoso)
03 Postura e Ética Profissional .............. ✅ FREE
04 Saúde Mental do Aluno e Profissional ...... ✅ FREE (renomear saude-mental)
05 IRAS ...................................... ✅
06 Exame Físico e Escalas Clínicas ........... ✅
07 Prescrição NANDA-I / NOC / NIC ............ 🆕
08 Calculadoras de Medicamentos .............. ✅
09 Curativos e Lesões de Pele ................ ✅
10 SBV — Suporte Básico de Vida .............. ✅
11 Enfermagem em Clínica Médica .............. 🆕
12 Segurança do Paciente ..................... ✅
13 Anatomia Clínica Aplicada ................. ✅
14 Fisiologia para Enfermagem ................ ✅
15 Microbiologia para a Prática .............. ✅
16 Simulações Reais (Casos Clínicos) ......... ✅
17 Relatório de Estágio (ABNT) ............... ✅
18 Quizzes de Enfermagem ..................... ✅
```

### Trilha 2 — Enfermagem Avançada (R$ 39,99/mês)

```text
01 Saúde Mental do Profissional .............. ✅ (reusa saude-mental)
02 Sinais Vitais (todas as faixas) ........... ✅
03 Calculadoras .............................. ✅
04 SAE Completo + Processos .................. 🆕
05 Prescrição NANDA-I/NOC/NIC 2026 ........... 🆕 (mesmo do acadêmico se preferir)
06 Enfermagem em UTI ......................... ✅
07 Farmacologia Avançada ..................... ✅
08 Enfermagem em Clínica Médica .............. 🆕
09 Enfermagem em Clínica Cirúrgica ........... 🆕
10 Enfermagem em Centro Cirúrgico ............ 🆕
11 Enfermagem em CME ......................... 🆕
12 Enfermagem Obstétrica ..................... ✅
13 Enfermagem Pediátrica ..................... ✅
14 Enfermagem em Saúde do Homem .............. 🆕
15 Enfermagem em Saúde do Idoso .............. 🆕
16 Saúde Mental e Cuidado Psiquiátrico ....... ✅
17 Gestão em Enfermagem ...................... ✅
18 Simulações Reais .......................... ✅
19 Procedimentos de Enfermagem ............... ✅
20 Enfermagem em Nefrologia .................. 🆕
21 Enfermagem em Urologia .................... 🆕
22 Enfermagem em Neurologia .................. 🆕
23 Enfermagem em Hepatologia ................. 🆕
24 Enfermagem em Hematologia ................. 🆕
25 Enfermagem em Ginecologia ................. 🆕
26 Curativos (versão profissional) ........... 🆕
27 Quizzes de Enfermagem ..................... ✅
28 Enfermagem Offshore ....................... 🆕
29 Enfermagem de Bordo ....................... 🆕
```

### Trilha 3 — Academia de Técnicos (R$ 16,99/mês)

```text
01 Manual de Sobrevivência do Estágio ........ ✅ FREE  *(assumindo o padrão — confirma depois)*
02 Postura e Ética Profissional .............. ✅ FREE
03 Sinais Vitais (todas as faixas) ........... ✅ FREE
04 Saúde Mental do Profissional .............. ✅ FREE
05 Sinais Vitais (premium completo) .......... ✅
06 Calculadoras .............................. ✅
07 SAE Completo + Processos .................. 🆕 (mesmo do enfermeiro)
08 Protocolos de IRAS ........................ ✅
09 Saúde Digital: PEP/Prontuário/Registro .... 🆕
10 Tele-enfermagem, LGPD e Segurança ......... 🆕
11 Equipamentos Hospitalares e Tecnologias ... 🆕
12 SUS: Programas e Indicadores .............. 🆕
13 Vigilância Epidemiológica ................. 🆕
14 Cadernetas de Vacinação e Imunização ...... 🆕
15 Hipertensão e Diabetes na Prática ......... 🆕
16 Código de Ética do Técnico ................ 🆕
17 Semana da Enfermagem ...................... 🆕
18 Simulações Reais .......................... ✅
19 Quizzes de Enfermagem ..................... ✅
```

Total a criar: **~28 mini apps novos** (placeholders com `markdown_pt = '*(em breve)*'`, ícone padrão, status `gratuito = false`, marcados na trilha correta). Você abre depois no admin e cola o conteúdo.

## 3. Limpeza

- Removo o registro duplicado do app `IRAS` (existe `iras` e `IRAS` com mesmo nome).
- Cada app passa a ter pelo menos uma trilha marcada `true`. Nenhum app fica com as 3 trilhas falsas (isso é o que estava "soltando" da loja).
- Apps grátis continuam grátis, mas só renderizam dentro da página da trilha.

## 4. Admin: cadastrar e excluir qualquer pessoa

Reforço no painel **Admin → Usuários** (já existe a aba):

- **Criar usuário** (novo botão): modal pedindo nome, email, telefone, categoria, senha inicial e opção "marcar como admin". Usa `supabaseAdmin.auth.admin.createUser` com `email_confirm: true` (não precisa de confirmação por e-mail).
- **Excluir usuário** (já existe — vou validar): confirma duas vezes, bloqueia o admin de excluir a si mesmo, faz `auth.admin.deleteUser` e o cascade já apaga `profiles`, `user_subscriptions`, `user_roles`, `user_app_access`, `relatorio_uses`. Registra em `admin_actions`.
- **Conceder/revogar trilha manualmente** e **prorrogar trial** (já existem, mantenho).

## 5. Detalhes técnicos

- Migration única: insere os ~28 mini apps novos (idempotente com `ON CONFLICT (slug) DO NOTHING`), atualiza flags `track_*` dos existentes conforme tabela acima, remove o `IRAS` duplicado.
- `src/routes/index.tsx`: remove blocos "Conteúdo grátis" e "Demais mini apps".
- Server fn `createUserAsAdmin` em `src/lib/users-admin.functions.ts` + botão na UI `UsersAdmin.tsx`.
- Nenhum mexer em paywall, preço, trial ou cobrança.

## 6. Não incluído nesta entrega

- Conteúdo (markdown) dos apps novos — você preenche depois pelo admin.
- Apps "extras" que apareceram no DOCX mas não estão em nenhuma das 3 listas finais (Diagnóstico Laboratorial, Liderança/Gestão Unidades, Mentor Científico TCC, Cuidados Críticos VM, Auditoria/Glosas, Bloco Operatório, Oncologia/Paliativo, Imunização Coletiva, Atenção Básica ESF). Posso adicionar numa próxima rodada se quiser — me diz em qual trilha entram.

## Confirmação rápida antes de implementar

Os 4 primeiros itens da trilha **Técnico** estavam cortados no DOCX. Assumi o padrão (Manual + Postura + Sinais Vitais + Saúde Mental, todos grátis). Se for diferente, me corrige antes que eu rodo.
