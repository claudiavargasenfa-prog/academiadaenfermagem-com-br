
-- Revogar acesso público de funções SECURITY DEFINER conforme alertado pelo linter
REVOKE ALL ON FUNCTION public.issue_certificate(uuid, numeric, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.internal_issue_certificate(uuid, uuid, numeric, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.validar_certificado(text) FROM PUBLIC;

-- Conceder permissões apenas para quem precisa
GRANT EXECUTE ON FUNCTION public.issue_certificate(uuid, numeric, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.internal_issue_certificate(uuid, uuid, numeric, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.validar_certificado(text) TO anon, authenticated;
