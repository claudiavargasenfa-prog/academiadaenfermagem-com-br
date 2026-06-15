-- Trigger-only functions: revoke from everyone except postgres/service_role
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;

-- Helper/RPC functions: keep available to authenticated (used by RLS / app), revoke from anon
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

REVOKE ALL ON FUNCTION public.has_app_access(uuid, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_app_access(uuid, uuid) TO authenticated;

REVOKE ALL ON FUNCTION public.consume_relatorio_open(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.consume_relatorio_open(uuid) TO authenticated;