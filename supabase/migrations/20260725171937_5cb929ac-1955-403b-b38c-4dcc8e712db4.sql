-- Revoke public/anon execute on privileged SECURITY DEFINER functions
REVOKE ALL ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.has_app_access(uuid, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_app_access(uuid, uuid) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.consume_relatorio_open(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.consume_relatorio_open(uuid) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;

REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.update_updated_at_column() TO service_role;

-- Public store catalog stays readable by visitors (metadata only, no paid content)
REVOKE ALL ON FUNCTION public.list_mini_apps_catalog() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.list_mini_apps_catalog() TO anon, authenticated, service_role;