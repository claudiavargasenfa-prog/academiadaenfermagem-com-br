
CREATE TABLE public.trial_fingerprints (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  device_id TEXT,
  phone_digits TEXT,
  email TEXT NOT NULL,
  ip TEXT,
  user_id UUID,
  blocked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_trial_fp_device ON public.trial_fingerprints (device_id) WHERE device_id IS NOT NULL;
CREATE INDEX idx_trial_fp_phone ON public.trial_fingerprints (phone_digits) WHERE phone_digits IS NOT NULL;
CREATE INDEX idx_trial_fp_email ON public.trial_fingerprints (email);

GRANT ALL ON public.trial_fingerprints TO service_role;

ALTER TABLE public.trial_fingerprints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_only_read" ON public.trial_fingerprints
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
