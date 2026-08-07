GRANT EXECUTE ON FUNCTION public.has_app_access(uuid, uuid) TO authenticated;
REVOKE EXECUTE ON FUNCTION public.has_app_access(uuid, uuid) FROM anon, PUBLIC;