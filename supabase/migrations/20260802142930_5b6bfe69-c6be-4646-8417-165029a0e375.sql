CREATE TABLE public.legal_acceptances (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  device_id text,
  doc_version text not null,
  doc_date date not null,
  terms_version text not null,
  privacy_version text not null,
  scope text not null default 'primeiro_acesso',
  user_agent text,
  accepted_at timestamptz not null default now()
);

CREATE INDEX idx_legal_acceptances_user ON public.legal_acceptances(user_id);
CREATE INDEX idx_legal_acceptances_device ON public.legal_acceptances(device_id);

GRANT INSERT ON public.legal_acceptances TO anon;
GRANT SELECT, INSERT ON public.legal_acceptances TO authenticated;
GRANT ALL ON public.legal_acceptances TO service_role;

ALTER TABLE public.legal_acceptances ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can log an acceptance"
  ON public.legal_acceptances FOR INSERT TO anon, authenticated
  WITH CHECK (user_id IS NULL OR user_id = auth.uid());

CREATE POLICY "users read own acceptances"
  ON public.legal_acceptances FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));