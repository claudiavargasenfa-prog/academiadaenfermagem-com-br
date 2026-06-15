-- Tabela de usos do Relatório de Estágio em ABNT
-- Cada compra concede N aberturas (gerar + correções/impressões)

CREATE TABLE public.relatorio_uses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mini_app_id UUID NOT NULL REFERENCES public.mini_apps(id) ON DELETE CASCADE,
  opens_left INT NOT NULL DEFAULT 5,
  total_opens INT NOT NULL DEFAULT 5,
  generated_at TIMESTAMPTZ,
  cakto_order_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX relatorio_uses_user_app_unique
  ON public.relatorio_uses (user_id, mini_app_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.relatorio_uses TO authenticated;
GRANT ALL ON public.relatorio_uses TO service_role;

ALTER TABLE public.relatorio_uses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuário vê seu próprio uso"
  ON public.relatorio_uses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Usuário pode atualizar seu próprio uso via função"
  ON public.relatorio_uses FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TRIGGER update_relatorio_uses_updated_at
  BEFORE UPDATE ON public.relatorio_uses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Função SECURITY DEFINER para consumir uma abertura atomicamente.
-- Retorna o novo opens_left, ou -1 se sem acesso.
CREATE OR REPLACE FUNCTION public.consume_relatorio_open(_mini_app_id UUID)
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_id UUID;
  _new_left INT;
BEGIN
  _user_id := auth.uid();
  IF _user_id IS NULL THEN RETURN -1; END IF;

  UPDATE public.relatorio_uses
    SET opens_left = opens_left - 1,
        generated_at = COALESCE(generated_at, now())
    WHERE user_id = _user_id
      AND mini_app_id = _mini_app_id
      AND opens_left > 0
    RETURNING opens_left INTO _new_left;

  IF _new_left IS NULL THEN RETURN -1; END IF;
  RETURN _new_left;
END;
$$;

GRANT EXECUTE ON FUNCTION public.consume_relatorio_open(UUID) TO authenticated;