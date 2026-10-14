ALTER TABLE public.user_subscriptions ADD COLUMN IF NOT EXISTS payment_order_id uuid;
CREATE UNIQUE INDEX IF NOT EXISTS user_subscription_payment_order ON public.user_subscriptions(payment_order_id) WHERE payment_order_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS order_provider_payment_unique ON public.orders(external_id) WHERE external_id IS NOT NULL AND payment_method='mercadopago';
CREATE OR REPLACE FUNCTION public.create_annual_order(_plan_slug text) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE o uuid; p record;
BEGIN
 IF auth.uid() IS NULL THEN RAISE EXCEPTION 'not_authenticated'; END IF;
 IF _plan_slug NOT IN ('academico','tecnico','tecnico-estudante','enfermeiro') THEN RAISE EXCEPTION 'invalid_plan'; END IF;
 SELECT * INTO p FROM public.plan_offers WHERE plan_slug=_plan_slug AND billing_period='anual' AND is_active=true;
 IF p.id IS NULL OR p.price_cents<=0 OR p.period_days<>365 THEN RAISE EXCEPTION 'offer_unavailable'; END IF;
 INSERT INTO public.orders(user_id,plan_slug,amount_cents,currency,payment_method,status,metadata) VALUES(auth.uid(),_plan_slug,p.price_cents,'BRL','mercadopago','pending',jsonb_build_object('type','annual_membership','billing_period','anual','period_days',365,'offer_id',p.id)) RETURNING id INTO o;
 RETURN o;
END $$;
REVOKE ALL ON FUNCTION public.create_annual_order(text) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.create_annual_order(text) TO authenticated;
CREATE OR REPLACE FUNCTION public.process_annual_payment(_order_id uuid,_payment_id text,_status text,_amount_cents integer,_approved_at timestamptz) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE o record; r record; ending timestamptz;
BEGIN
 SELECT * INTO o FROM public.orders WHERE id=_order_id FOR UPDATE;
 IF o.id IS NULL OR o.user_id IS NULL OR o.metadata->>'type'<>'annual_membership' OR o.currency<>'BRL' OR o.amount_cents<>_amount_cents THEN RAISE EXCEPTION 'payment_mismatch'; END IF;
 IF o.external_id IS NOT NULL AND o.external_id<>_payment_id THEN RAISE EXCEPTION 'payment_already_bound'; END IF;
 PERFORM pg_advisory_xact_lock(hashtextextended(o.user_id::text||o.plan_slug,0));
 IF _status='approved' AND o.status NOT IN ('paid','refunded','charged_back') THEN
  IF _approved_at IS NULL THEN RAISE EXCEPTION 'approval_missing'; END IF;
  UPDATE public.orders SET status='paid',external_id=_payment_id,metadata=metadata||jsonb_build_object('approved_at',_approved_at),updated_at=now() WHERE id=o.id;
  INSERT INTO public.user_subscriptions(user_id,plan_slug,status,started_at,expires_at,billing_period,was_trial,certificates_allowed,report_quota,bonus_app_slug,payment_order_id) VALUES(o.user_id,o.plan_slug,'active',_approved_at,_approved_at+interval '365 days','anual',false,0,0,NULL,o.id) ON CONFLICT (payment_order_id) WHERE payment_order_id IS NOT NULL DO NOTHING;
 ELSIF _status IN ('refunded','charged_back') THEN
  UPDATE public.orders SET status=_status,external_id=_payment_id,updated_at=now() WHERE id=o.id;
  UPDATE public.user_subscriptions SET status='cancelled',updated_at=now() WHERE payment_order_id=o.id;
 ELSIF o.status NOT IN ('paid','refunded','charged_back') THEN
  UPDATE public.orders SET status=CASE WHEN _status IN ('rejected','cancelled') THEN _status ELSE 'pending' END,updated_at=now() WHERE id=o.id;
 END IF;
 ending := NULL;
 FOR r IN SELECT s.id,s.started_at FROM public.user_subscriptions s JOIN public.orders p ON p.id=s.payment_order_id WHERE s.user_id=o.user_id AND s.plan_slug=o.plan_slug AND p.status='paid' ORDER BY s.started_at,s.id LOOP
  ending:=greatest(r.started_at,ending)+interval '365 days';
  UPDATE public.user_subscriptions SET expires_at=ending,status='active',updated_at=now() WHERE id=r.id;
 END LOOP;
END $$;
REVOKE ALL ON FUNCTION public.process_annual_payment(uuid,text,text,integer,timestamptz) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.process_annual_payment(uuid,text,text,integer,timestamptz) TO service_role;
CREATE OR REPLACE FUNCTION public.set_bonus_app(_bonus_slug text) RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$ BEGIN RAISE EXCEPTION 'Os planos anuais não incluem aplicativo bônus'; END $$;
CREATE OR REPLACE FUNCTION public.has_active_membership(_user_id uuid) RETURNS boolean LANGUAGE sql STABLE SET search_path=public AS $$ SELECT _user_id IS NOT NULL AND (public.has_role(_user_id,'admin') OR EXISTS(SELECT 1 FROM public.user_subscriptions s WHERE s.user_id=_user_id AND s.status='active' AND NOT s.was_trial AND s.expires_at>now())) $$;
CREATE OR REPLACE FUNCTION private.has_app_access(_user_id uuid,_mini_app_id uuid) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$ SELECT CASE WHEN public.has_role(_user_id,'admin') THEN true WHEN EXISTS(SELECT 1 FROM public.user_app_access a WHERE a.user_id=_user_id AND a.mini_app_id=_mini_app_id AND a.expires_at>now()) THEN true WHEN EXISTS(SELECT 1 FROM public.mini_apps m WHERE m.id=_mini_app_id AND m.gratuito=true AND NOT EXISTS(SELECT 1 FROM public.mini_app_placements p JOIN public.apps app ON app.id=p.app_id WHERE p.mini_app_id=m.id AND app.slug IN ('academico','tecnico','tecnico-estudante','enfermeiro'))) THEN true ELSE EXISTS(SELECT 1 FROM public.user_subscriptions s JOIN public.apps app ON app.slug=s.plan_slug JOIN public.mini_app_placements p ON p.app_id=app.id AND p.mini_app_id=_mini_app_id WHERE s.user_id=_user_id AND s.status='active' AND NOT s.was_trial AND s.expires_at>now()) END $$;