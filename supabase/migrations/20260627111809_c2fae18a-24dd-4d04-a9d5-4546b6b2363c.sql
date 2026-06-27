CREATE TABLE public.mini_app_subtopics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mini_app_id UUID NOT NULL REFERENCES public.mini_apps(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  ordem INT NOT NULL DEFAULT 0,
  icon TEXT,
  content_md TEXT,
  video_url TEXT,
  audio_url TEXT,
  is_draft BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (mini_app_id, slug)
);

CREATE INDEX idx_mini_app_subtopics_app_ordem
  ON public.mini_app_subtopics(mini_app_id, ordem);

GRANT SELECT ON public.mini_app_subtopics TO authenticated;
GRANT SELECT ON public.mini_app_subtopics TO anon;
GRANT ALL ON public.mini_app_subtopics TO service_role;

ALTER TABLE public.mini_app_subtopics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published subtopics"
  ON public.mini_app_subtopics
  FOR SELECT
  USING (is_draft = false OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert subtopics"
  ON public.mini_app_subtopics
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update subtopics"
  ON public.mini_app_subtopics
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete subtopics"
  ON public.mini_app_subtopics
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_mini_app_subtopics_updated_at
  BEFORE UPDATE ON public.mini_app_subtopics
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();