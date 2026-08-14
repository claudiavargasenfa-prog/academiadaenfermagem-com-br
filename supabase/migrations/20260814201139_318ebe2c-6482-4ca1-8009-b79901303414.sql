
-- 1. Atualizar a função issue_certificate para aceitar horas e tema personalizado
CREATE OR REPLACE FUNCTION public.issue_certificate(_mini_app_id uuid, _hours numeric DEFAULT 10, _custom_theme text DEFAULT NULL)
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
  _is_admin boolean;
BEGIN
  IF _user IS NULL THEN
    RAISE EXCEPTION 'not_authenticated';
  END IF;

  _is_admin := public.has_role(_user, 'admin');

  IF _custom_theme IS NULL AND NOT _is_admin THEN
      SELECT COALESCE(MAX(certificates_allowed), 0) INTO _allowed
      FROM public.user_subscriptions
      WHERE user_id = _user AND status IN ('active','trial') AND expires_at > now();

      SELECT COUNT(*) INTO _used FROM public.user_certificates WHERE user_id = _user AND app_slug IS NOT NULL;

      IF _used >= _allowed THEN
        RAISE EXCEPTION 'certificate_quota_exceeded';
      END IF;

      IF NOT public.has_app_access(_user, _mini_app_id) THEN
        RAISE EXCEPTION 'no_access_to_mini_app';
      END IF;
  END IF;

  IF _custom_theme IS NOT NULL THEN
     _app_name := _custom_theme;
  ELSE
     SELECT name INTO _app_name FROM public.mini_apps WHERE id = _mini_app_id;
  END IF;

  SELECT COALESCE(NULLIF(full_name, ''), email) INTO _name FROM public.profiles WHERE id = _user;

  SELECT a.slug, a.name, a.codigo, p.codigo AS placement_codigo
    INTO _acad
  FROM public.apps a
  LEFT JOIN public.mini_app_placements p ON p.app_id = a.id AND (p.mini_app_id = _mini_app_id OR _mini_app_id IS NULL)
  LEFT JOIN public.user_subscriptions s
    ON s.user_id = _user
   AND s.status IN ('active','trial')
   AND s.expires_at > now()
   AND (s.plan_slug = a.slug OR s.bonus_app_slug = a.slug)
  WHERE a.codigo IS NOT NULL
  ORDER BY (s.id IS NOT NULL) DESC, a.codigo
  LIMIT 1;

  _num := nextval('public.certificado_seq');

  _code := 'ADEC-'
    || COALESCE(_acad.codigo, '00') || '-'
    || lpad(COALESCE(_acad.placement_codigo, 0)::text, 3, '0') || '-'
    || lpad(_num::text, 4, '0') || '-'
    || to_char(now() AT TIME ZONE 'America/Sao_Paulo', 'MM/YYYY');

  INSERT INTO public.user_certificates (user_id, mini_app_id, mini_app_name, student_name, hours, code, app_slug, app_name)
  VALUES (_user, COALESCE(_mini_app_id, '00000000-0000-0000-0000-000000000000'), COALESCE(_app_name, 'Estudos'), COALESCE(_name, 'Aluno'), _hours, _code, _acad.slug, _acad.name);

  RETURN QUERY
    SELECT c.code, c.mini_app_name, c.student_name, c.hours, c.issued_at
    FROM public.user_certificates c WHERE c.code = _code;
END;
$function$;

CREATE OR REPLACE FUNCTION public.internal_issue_certificate(_user_id uuid, _mini_app_id uuid, _hours numeric, _custom_theme text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  _app_name text;
  _name text;
  _code text;
  _acad RECORD;
  _num integer;
BEGIN
  IF _custom_theme IS NOT NULL THEN
     _app_name := _custom_theme;
  ELSE
     SELECT name INTO _app_name FROM public.mini_apps WHERE id = _mini_app_id;
  END IF;

  SELECT COALESCE(NULLIF(full_name, ''), email) INTO _name FROM public.profiles WHERE id = _user_id;

  SELECT a.slug, a.name, a.codigo, p.codigo AS placement_codigo
    INTO _acad
  FROM public.apps a
  LEFT JOIN public.mini_app_placements p ON p.app_id = a.id AND (p.mini_app_id = _mini_app_id OR _mini_app_id IS NULL)
  WHERE a.codigo IS NOT NULL
  ORDER BY a.codigo
  LIMIT 1;

  _num := nextval('public.certificado_seq');

  _code := 'ADEC-'
    || COALESCE(_acad.codigo, '00') || '-'
    || lpad(COALESCE(_acad.placement_codigo, 0)::text, 3, '0') || '-'
    || lpad(_num::text, 4, '0') || '-'
    || to_char(now() AT TIME ZONE 'America/Sao_Paulo', 'MM/YYYY');

  INSERT INTO public.user_certificates (user_id, mini_app_id, mini_app_name, student_name, hours, code, app_slug, app_name)
  VALUES (_user_id, COALESCE(_mini_app_id, '00000000-0000-0000-0000-000000000000'), COALESCE(_app_name, 'Estudos'), COALESCE(_name, 'Aluno'), _hours, _code, _acad.slug, _acad.name);
END;
$function$;

REVOKE ALL ON FUNCTION public.issue_certificate(uuid, numeric, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.issue_certificate(uuid, numeric, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.internal_issue_certificate(uuid, uuid, numeric, text) TO service_role;
