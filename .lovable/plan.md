## Objetivo
Limpar o menu lateral para mostrar apenas **Loja** e **Minha Conta** (e **Admin**, quando o usuário for administrador). Os mini apps deixam de ser links diretos no menu — o acesso passa a ser exclusivamente pela Loja, após compra (ou se forem gratuitos).

## Mudança
Arquivo: `src/components/AppShell.tsx`

- Reduzir o array `nav` para apenas:
  - `/` — Loja
  - `/minha-conta` — Minha Conta
- Remover os imports de ícones que ficarem sem uso (`Stethoscope`, `Calculator`, `Activity`, `NotebookPen`, `Baby`, `HeartPulse`, `ShieldCheck`, `HandHeart`, `GraduationCap`, `FileText`).
- Manter intacta a lógica que adiciona o item **Admin** quando `isAdmin()` é `true`.

## O que NÃO muda
- As rotas dos mini apps continuam existindo (`/iras`, `/seguranca`, `/calculadora`, etc.) — quem comprou continua acessando normalmente pelos cards da Loja, e os links/CTAs internos seguem funcionando.
- Nenhuma alteração em banco, RLS, regras de acesso ou na Loja.
