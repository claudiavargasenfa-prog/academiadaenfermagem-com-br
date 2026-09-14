REVOKE ALL ON FUNCTION public.has_active_membership(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_active_membership(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_active_membership(uuid) TO service_role;