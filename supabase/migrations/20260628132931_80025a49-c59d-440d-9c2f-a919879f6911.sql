
-- =====================================================
-- 1) apps
-- =====================================================
CREATE TABLE public.apps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  short_name TEXT,
  emoji TEXT,
  bg_color TEXT,
  fg_color TEXT,
  description TEXT,
  ordem INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.apps TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.apps TO authenticated;
GRANT ALL ON public.apps TO service_role;
ALTER TABLE public.apps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "apps_select_all" ON public.apps FOR SELECT USING (true);
CREATE POLICY "apps_admin_write" ON public.apps FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER apps_updated_at BEFORE UPDATE ON public.apps
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- 2) app_sections
-- =====================================================
CREATE TABLE public.app_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id UUID NOT NULL REFERENCES public.apps(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  emoji TEXT,
  ordem INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.app_sections TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.app_sections TO authenticated;
GRANT ALL ON public.app_sections TO service_role;
ALTER TABLE public.app_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "app_sections_select_all" ON public.app_sections FOR SELECT USING (true);
CREATE POLICY "app_sections_admin_write" ON public.app_sections FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER app_sections_updated_at BEFORE UPDATE ON public.app_sections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX app_sections_app_id_idx ON public.app_sections(app_id, ordem);

-- =====================================================
-- 3) mini_app_placements
-- =====================================================
CREATE TABLE public.mini_app_placements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mini_app_id UUID NOT NULL REFERENCES public.mini_apps(id) ON DELETE CASCADE,
  app_id UUID NOT NULL REFERENCES public.apps(id) ON DELETE CASCADE,
  section_id UUID REFERENCES public.app_sections(id) ON DELETE SET NULL,
  ordem INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (mini_app_id, app_id)
);
GRANT SELECT ON public.mini_app_placements TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mini_app_placements TO authenticated;
GRANT ALL ON public.mini_app_placements TO service_role;
ALTER TABLE public.mini_app_placements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "mini_app_placements_select_all" ON public.mini_app_placements FOR SELECT USING (true);
CREATE POLICY "mini_app_placements_admin_write" ON public.mini_app_placements FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER mini_app_placements_updated_at BEFORE UPDATE ON public.mini_app_placements
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX mini_app_placements_app_idx ON public.mini_app_placements(app_id, section_id, ordem);
CREATE INDEX mini_app_placements_mini_app_idx ON public.mini_app_placements(mini_app_id);

-- =====================================================
-- 4) Seed dos 4 apps iniciais
-- =====================================================
INSERT INTO public.apps (slug, name, short_name, emoji, bg_color, fg_color, description, ordem) VALUES
  ('academico', 'Academia do Acadêmico', 'Acadêmico', '🎓', '#FEF3C7', '#78350F', 'Para estudantes de graduação em Enfermagem.', 1),
  ('tecnico-estudante', 'Academia do Estudante de Técnico', 'Estudante Técnico', '🧑‍🎓', '#E0F2FE', '#0C4A6E', 'Para estudantes de Técnico em Enfermagem.', 2),
  ('tecnico', 'Academia do Técnico', 'Técnico', '🩺', '#DBEAFE', '#1E3A8A', 'Para Técnicos em Enfermagem formados.', 3),
  ('enfermeiro', 'Academia do Enfermeiro', 'Enfermeiro', '👩‍⚕️', '#DCFCE7', '#14532D', 'Para Enfermeiros graduados.', 4)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- 5) Plano de assinatura para o novo app
-- =====================================================
INSERT INTO public.subscription_plans (slug, name, description, price_cents, price_novo_cents, is_active, sort_order)
VALUES ('tecnico-estudante', 'Academia do Estudante de Técnico', 'Mensalidade do app para Estudante de Técnico em Enfermagem.', 1999, 1999, true, 15)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- 6) Backfill: cria placements a partir das colunas track_*
-- =====================================================
INSERT INTO public.mini_app_placements (mini_app_id, app_id, section_id, ordem)
SELECT m.id, a.id, NULL, COALESCE(m.sort_order, 0)
FROM public.mini_apps m
JOIN public.apps a ON a.slug = 'academico'
WHERE m.track_academico = true
ON CONFLICT (mini_app_id, app_id) DO NOTHING;

INSERT INTO public.mini_app_placements (mini_app_id, app_id, section_id, ordem)
SELECT m.id, a.id, NULL, COALESCE(m.sort_order, 0)
FROM public.mini_apps m
JOIN public.apps a ON a.slug = 'tecnico'
WHERE m.track_tecnico = true
ON CONFLICT (mini_app_id, app_id) DO NOTHING;

INSERT INTO public.mini_app_placements (mini_app_id, app_id, section_id, ordem)
SELECT m.id, a.id, NULL, COALESCE(m.sort_order, 0)
FROM public.mini_apps m
JOIN public.apps a ON a.slug = 'enfermeiro'
WHERE m.track_enfermeiro = true
ON CONFLICT (mini_app_id, app_id) DO NOTHING;

-- =====================================================
-- 7) has_app_access usa placements + apps + subscriptions
-- =====================================================
CREATE OR REPLACE FUNCTION public.has_app_access(_user_id uuid, _mini_app_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT
    CASE
      WHEN public.has_role(_user_id, 'admin') THEN true
      WHEN EXISTS (SELECT 1 FROM public.mini_apps WHERE id = _mini_app_id AND gratuito = true) THEN true
      WHEN EXISTS (
        SELECT 1 FROM public.user_app_access a
        WHERE a.user_id = _user_id AND a.mini_app_id = _mini_app_id AND a.expires_at > now()
      ) THEN true
      ELSE EXISTS (
        SELECT 1
        FROM public.user_subscriptions s
        JOIN public.apps app ON app.slug = s.plan_slug
        JOIN public.mini_app_placements p ON p.app_id = app.id AND p.mini_app_id = _mini_app_id
        WHERE s.user_id = _user_id
          AND s.status IN ('active','trial')
          AND s.expires_at > now()
      )
    END
$function$;
