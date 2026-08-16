-- Limpa sub-tópicos anteriores para evitar duplicidade
DELETE FROM public.mini_app_subtopics WHERE mini_app_id = '3b689d95-0730-4bb5-a47a-7fd59ddaa624';

-- Insere Noradrenalina (Vasoativo)
INSERT INTO public.mini_app_subtopics (mini_app_id, title, slug, content_md, icon, ordem)
VALUES (
  '3b689d95-0730-4bb5-a47a-7fd59ddaa624',
  '[Vasoativos] Noradrenalina (Norepinefrina)',
  'noradrenalina-v2',
  '### 💉 Noradrenalina (Levofed)
**Classe:** Vasopressor potente (Agonista α1, β1).

#### 🧪 Diluição Padrão ADEC (UTI)
- **Concentração:** 4 ampolas (4mg/4mL cada) em 250mL de SG 5%.
- **Concentração Final:** 64 mcg/mL.

#### ⚖️ Dosagem
- **Dose Inicial:** 0,05 a 0,1 mcg/kg/min.
- **Titulação:** A cada 5-10 min conforme PAM alvo (>65 mmHg).

#### ⚠️ Cuidados Premium ADEC
- **Fotossensibilidade:** Exige equipo e capa fotoprotetora (laranja/âmbar).
- **Acesso:** Exclusivamente em **Acesso Venoso Central**.
- **Desmame:** Nunca desligar abruptamente; risco de choque rebote.',
  '💉',
  10
);

-- Insere Dobutamina (Vasoativo)
INSERT INTO public.mini_app_subtopics (mini_app_id, title, slug, content_md, icon, ordem)
VALUES (
  '3b689d95-0730-4bb5-a47a-7fd59ddaa624',
  '[Vasoativos] Dobutamina (Dobutrex)',
  'dobutamina-v2',
  '### 🧪 Dobutamina
**Classe:** Inotrópico (Agonista β1 predominante).

#### 💉 Diluição Padrão ADEC
- **Concentração:** 1 ampola (250mg/20mL) em 230mL de SG 5% ou SF 0,9%.
- **Concentração Final:** 1.000 mcg/mL.

#### ⚖️ Dosagem
- **Dose:** 2,5 a 20 mcg/kg/min.

#### 📢 Alertas Beira-Leito
- **Hipotensão:** Pode causar queda de pressão inicial (efeito β2 periférico).
- **Diurese:** O aumento do débito urinário é o melhor sinal clínico de sucesso.
- **Taquifilaxia:** Perda de efeito após 72h de uso contínuo.',
  '💉',
  20
);

-- Placeholders para as outras categorias solicitadas
INSERT INTO public.mini_app_subtopics (mini_app_id, title, slug, content_md, icon, ordem)
VALUES ('3b689d95-0730-4bb5-a47a-7fd59ddaa624', '[Sedativos] Fentanil / Midazolam', 'sedativos-placeholder', 'Conteúdo em breve...', '💊', 30);

INSERT INTO public.mini_app_subtopics (mini_app_id, title, slug, content_md, icon, ordem)
VALUES ('3b689d95-0730-4bb5-a47a-7fd59ddaa624', '[Analgésicos] Morfina / Dipirona', 'analgesicos-placeholder', 'Conteúdo em breve...', '💊', 40);

INSERT INTO public.mini_app_subtopics (mini_app_id, title, slug, content_md, icon, ordem)
VALUES ('3b689d95-0730-4bb5-a47a-7fd59ddaa624', '[Antibióticos] Meropenem / Vancomicina', 'antibioticos-placeholder', 'Conteúdo em breve...', '💊', 50);

INSERT INTO public.mini_app_subtopics (mini_app_id, title, slug, content_md, icon, ordem)
VALUES ('3b689d95-0730-4bb5-a47a-7fd59ddaa624', '[Eletrólitos] KCl / NaCl 20%', 'eletrolitos-placeholder', 'Conteúdo em breve...', '💊', 60);

INSERT INTO public.mini_app_subtopics (mini_app_id, title, slug, content_md, icon, ordem)
VALUES ('3b689d95-0730-4bb5-a47a-7fd59ddaa624', '[Anticoagulantes] Heparina / Enoxaparina', 'anticoagulantes-placeholder', 'Conteúdo em breve...', '💊', 70);
