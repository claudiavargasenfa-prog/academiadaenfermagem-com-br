CREATE OR REPLACE FUNCTION public.create_escala_order()
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE o uuid;
BEGIN
 IF auth.uid() IS NULL THEN RAISE EXCEPTION 'not_authenticated'; END IF;
 INSERT INTO public.orders(user_id,plan_slug,amount_cents,currency,payment_method,status,metadata)
 VALUES(auth.uid(),'esc2026',3797,'BRL','mercadopago','pending',jsonb_build_object('type','escala_2027','ano',2027)) RETURNING id INTO o;
 RETURN o;
END $$;
REVOKE ALL ON FUNCTION public.create_escala_order() FROM public, anon;
GRANT EXECUTE ON FUNCTION public.create_escala_order() TO authenticated;

CREATE OR REPLACE FUNCTION public.process_escala_payment(_order_id uuid, _payment_id text, _status text, _amount_cents integer)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE o record; app uuid; fim timestamptz := '2027-12-31 23:59:59-03';
BEGIN
 SELECT * INTO o FROM public.orders WHERE id=_order_id FOR UPDATE;
 IF o.id IS NULL OR o.user_id IS NULL OR o.metadata->>'type'<>'escala_2027' OR o.currency<>'BRL' OR o.amount_cents<>_amount_cents THEN RAISE EXCEPTION 'payment_mismatch'; END IF;
 IF o.external_id IS NOT NULL AND o.external_id<>_payment_id THEN RAISE EXCEPTION 'payment_already_bound'; END IF;
 SELECT id INTO app FROM public.mini_apps WHERE slug='Escala_2026';
 IF _status='approved' AND o.status NOT IN ('paid','refunded','charged_back') THEN
  UPDATE public.orders SET status='paid',external_id=_payment_id,updated_at=now() WHERE id=o.id;
  IF EXISTS (SELECT 1 FROM public.user_app_access WHERE user_id=o.user_id AND mini_app_id=app) THEN
   UPDATE public.user_app_access SET expires_at=greatest(expires_at,fim),updated_at=now() WHERE user_id=o.user_id AND mini_app_id=app;
  ELSE
   INSERT INTO public.user_app_access(user_id,mini_app_id,expires_at) VALUES(o.user_id,app,fim);
  END IF;
 ELSIF _status IN ('refunded','charged_back') AND o.status='paid' THEN
  UPDATE public.orders SET status=_status,updated_at=now() WHERE id=o.id;
  UPDATE public.user_app_access SET expires_at=least(expires_at,'2026-12-31 23:59:59-03'),updated_at=now() WHERE user_id=o.user_id AND mini_app_id=app;
 ELSIF o.status NOT IN ('paid','refunded','charged_back') THEN
  UPDATE public.orders SET status=CASE WHEN _status IN ('rejected','cancelled') THEN _status ELSE 'pending' END,updated_at=now() WHERE id=o.id;
 END IF;
END $$;
REVOKE ALL ON FUNCTION public.process_escala_payment(uuid,text,text,integer) FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.process_escala_payment(uuid,text,text,integer) TO service_role;