-- 1. Código da academia
ALTER TABLE public.apps ADD COLUMN IF NOT EXISTS codigo TEXT;
UPDATE public.apps SET codigo = '01' WHERE slug = 'academico';
UPDATE public.apps SET codigo = '02' WHERE slug = 'enfermeiro';
UPDATE public.apps SET codigo = '03' WHERE slug = 'tecnico-estudante';
UPDATE public.apps SET codigo = '04' WHERE slug = 'tecnico';

-- 2. Número do mini app dentro de cada academia (sequência própria por academia)
ALTER TABLE public.mini_app_placements ADD COLUMN IF NOT EXISTS codigo INTEGER;

WITH numerado AS (
  SELECT p.id,
         ROW_NUMBER() OVER (PARTITION BY p.app_id ORDER BY lower(m.name), m.slug) AS n
  FROM public.mini_app_placements p
  JOIN public.mini_apps m ON m.id = p.mini_app_id
)
UPDATE public.mini_app_placements p
SET codigo = numerado.n
FROM numerado
WHERE numerado.id = p.id AND p.codigo IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS mini_app_placements_app_codigo_uidx
  ON public.mini_app_placements (app_id, codigo);

-- 3. Sequência corrida dos certificados começando em 0099
CREATE SEQUENCE IF NOT EXISTS public.certificado_seq START WITH 99 INCREMENT BY 1;

-- 4. Academia gravada no certificado
ALTER TABLE public.user_certificates ADD COLUMN IF NOT EXISTS app_slug TEXT;
ALTER TABLE public.user_certificates ADD COLUMN IF NOT EXISTS app_name TEXT;

-- 5. Nova emissão de certificado
CREATE OR REPLACE FUNCTION public.issue_certificate(_mini_app_id uuid)
 RETURNS TABLE(code text, mini_app_name text, student_name text, hours numeric, issued_at timestamp with time zone)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  _user uuid := auth.uid();
  _allowed integer;
  _used integer;
  _app_name text;
  _name text;
  _code text;
  _acad RECORD;
  _num integer;
BEGIN
  IF _user IS NULL THEN
    RAISE EXCEPTION 'not_authenticated';
  END IF;

  SELECT COALESCE(MAX(certificates_allowed), 0) INTO _allowed
  FROM public.user_subscriptions
  WHERE user_id = _user AND status IN ('active','trial') AND expires_at > now();

  SELECT COUNT(*) INTO _used FROM public.user_certificates WHERE user_id = _user;

  IF _used >= _allowed THEN
    RAISE EXCEPTION 'certificate_quota_exceeded';
  END IF;

  IF NOT public.has_app_access(_user, _mini_app_id) THEN
    RAISE EXCEPTION 'no_access_to_mini_app';
  END IF;

  SELECT name INTO _app_name FROM public.mini_apps WHERE id = _mini_app_id;
  SELECT COALESCE(NULLIF(full_name, ''), email) INTO _name FROM public.profiles WHERE id = _user;

  -- academia: prioriza a academia assinada pelo aluno
  SELECT a.slug, a.name, a.codigo, p.codigo AS placement_codigo
    INTO _acad
  FROM public.mini_app_placements p
  JOIN public.apps a ON a.id = p.app_id
  LEFT JOIN public.user_subscriptions s
    ON s.user_id = _user
   AND s.status IN ('active','trial')
   AND s.expires_at > now()
   AND (s.plan_slug = a.slug OR s.bonus_app_slug = a.slug)
  WHERE p.mini_app_id = _mini_app_id
    AND a.codigo IS NOT NULL
  ORDER BY (s.id IS NOT NULL) DESC, a.codigo
  LIMIT 1;

  _num := nextval('public.certificado_seq');

  _code := 'ADEC-'
    || COALESCE(_acad.codigo, '00') || '-'
    || lpad(COALESCE(_acad.placement_codigo, 0)::text, 3, '0') || '-'
    || lpad(_num::text, 4, '0') || '-'
    || to_char(now() AT TIME ZONE 'America/Sao_Paulo', 'MM/YYYY');

  INSERT INTO public.user_certificates (user_id, mini_app_id, mini_app_name, student_name, hours, code, app_slug, app_name)
  VALUES (_user, _mini_app_id, _app_name, COALESCE(_name, 'Aluno'), 10, _code, _acad.slug, _acad.name);

  RETURN QUERY
    SELECT c.code, c.mini_app_name, c.student_name, c.hours, c.issued_at
    FROM public.user_certificates c WHERE c.code = _code;
END;
$function$;

-- 6. Validação pública por código
CREATE OR REPLACE FUNCTION public.validar_certificado(_code text)
 RETURNS TABLE(code text, student_name text, mini_app_name text, app_name text, hours numeric, issued_at timestamp with time zone)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT c.code, c.student_name, c.mini_app_name, c.app_name, c.hours, c.issued_at
  FROM public.user_certificates c
  WHERE upper(regexp_replace(c.code, '[^A-Za-z0-9]', '', 'g'))
      = upper(regexp_replace(COALESCE(_code, ''), '[^A-Za-z0-9]', '', 'g'))
  LIMIT 1;
$function$;

REVOKE ALL ON FUNCTION public.validar_certificado(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.validar_certificado(text) TO anon, authenticated;