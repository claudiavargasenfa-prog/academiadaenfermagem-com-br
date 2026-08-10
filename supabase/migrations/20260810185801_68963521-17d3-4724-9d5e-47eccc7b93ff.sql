DO $$
DECLARE
  _c text;
  _ini int;
  _fim int;
BEGIN
  SELECT content_md INTO _c FROM public.mini_apps WHERE slug = 'DE-FUNDAMENTOS';
  IF _c IS NULL THEN RETURN; END IF;

  _ini := position('<!-- MATRIZ AUTORAL 1' in _c);
  IF _ini = 0 THEN RETURN; END IF;

  _fim := position('<!-- SEÇÃO DE PRESCRIÇÃO INTERATIVA COM CAPTURA AUTOMÁTICA -->' in _c);
  IF _fim = 0 OR _fim <= _ini THEN RETURN; END IF;

  -- volta até a abertura do comentário separador que antecede a seção de prescrição
  _fim := _fim - (length(substr(_c, 1, _fim)) - length(rtrim(substr(_c, 1, _fim - 1))) ) ;

  UPDATE public.mini_apps
    SET content_md = substr(_c, 1, _ini - 1) || substr(_c, position('<!-- SEÇÃO DE PRESCRIÇÃO INTERATIVA COM CAPTURA AUTOMÁTICA -->' in _c) - 60)
    WHERE slug = 'DE-FUNDAMENTOS';
END $$;