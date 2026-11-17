DROP POLICY IF EXISTS "Qualquer um envia cadastro" ON public.manual_leads;
CREATE POLICY "Qualquer um envia cadastro valido" ON public.manual_leads
FOR INSERT TO anon, authenticated
WITH CHECK (
  char_length(btrim(nome)) BETWEEN 2 AND 120
  AND whatsapp ~ '^[0-9]{10,13}$'
  AND char_length(perfil) BETWEEN 1 AND 40
);