CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public, private
AS $$
  SELECT private.has_role(_user_id, _role)
$$;

REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.has_app_access(_user_id uuid, _mini_app_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public, private
AS $$
  SELECT private.has_app_access(_user_id, _mini_app_id)
$$;

REVOKE ALL ON FUNCTION public.has_app_access(uuid, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_app_access(uuid, uuid) TO authenticated, service_role;