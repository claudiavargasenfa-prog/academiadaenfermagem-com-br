CREATE OR REPLACE FUNCTION public.get_manual_estagio_content()
RETURNS text LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT content_md FROM public.mini_apps WHERE slug = 'manual-sobrevivencia' AND is_active LIMIT 1;
$$;
REVOKE ALL ON FUNCTION public.get_manual_estagio_content() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_manual_estagio_content() TO anon, authenticated, service_role;