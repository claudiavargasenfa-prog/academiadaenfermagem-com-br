CREATE TABLE public.vip_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  author_name TEXT NOT NULL DEFAULT 'Aluno(a)',
  track TEXT,
  category TEXT NOT NULL DEFAULT 'Dúvida',
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  is_official BOOLEAN NOT NULL DEFAULT false,
  likes_count INTEGER NOT NULL DEFAULT 0,
  comments_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.vip_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.vip_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  author_name TEXT NOT NULL DEFAULT 'Aluno(a)',
  body TEXT NOT NULL,
  is_official BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.vip_post_likes (
  post_id UUID NOT NULL REFERENCES public.vip_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (post_id, user_id)
);

CREATE TABLE public.simulado_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  display_name TEXT NOT NULL DEFAULT 'Aluno(a)',
  quiz_slug TEXT NOT NULL,
  quiz_title TEXT NOT NULL,
  category TEXT,
  score INTEGER NOT NULL,
  total INTEGER NOT NULL,
  duration_seconds INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_vip_posts_created ON public.vip_posts (is_pinned DESC, created_at DESC);
CREATE INDEX idx_vip_comments_post ON public.vip_comments (post_id, created_at);
CREATE INDEX idx_simulado_attempts_user ON public.simulado_attempts (user_id, created_at DESC);
CREATE INDEX idx_simulado_attempts_quiz ON public.simulado_attempts (quiz_slug, score DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.vip_posts TO authenticated;
GRANT ALL ON public.vip_posts TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.vip_comments TO authenticated;
GRANT ALL ON public.vip_comments TO service_role;
GRANT SELECT, INSERT, DELETE ON public.vip_post_likes TO authenticated;
GRANT ALL ON public.vip_post_likes TO service_role;
GRANT SELECT, INSERT ON public.simulado_attempts TO authenticated;
GRANT ALL ON public.simulado_attempts TO service_role;

ALTER TABLE public.vip_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vip_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vip_post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simulado_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "vip_posts_read" ON public.vip_posts FOR SELECT TO authenticated USING (true);
CREATE POLICY "vip_posts_insert_own" ON public.vip_posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "vip_posts_update_own" ON public.vip_posts FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin')) WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "vip_posts_delete_own" ON public.vip_posts FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "vip_comments_read" ON public.vip_comments FOR SELECT TO authenticated USING (true);
CREATE POLICY "vip_comments_insert_own" ON public.vip_comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "vip_comments_update_own" ON public.vip_comments FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin')) WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "vip_comments_delete_own" ON public.vip_comments FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "vip_likes_read" ON public.vip_post_likes FOR SELECT TO authenticated USING (true);
CREATE POLICY "vip_likes_insert_own" ON public.vip_post_likes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "vip_likes_delete_own" ON public.vip_post_likes FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "simulado_read" ON public.simulado_attempts FOR SELECT TO authenticated USING (true);
CREATE POLICY "simulado_insert_own" ON public.simulado_attempts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.vip_sync_counts()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_TABLE_NAME = 'vip_comments' THEN
    IF TG_OP = 'INSERT' THEN
      UPDATE public.vip_posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
    ELSIF TG_OP = 'DELETE' THEN
      UPDATE public.vip_posts SET comments_count = GREATEST(comments_count - 1, 0) WHERE id = OLD.post_id;
    END IF;
  ELSE
    IF TG_OP = 'INSERT' THEN
      UPDATE public.vip_posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
    ELSIF TG_OP = 'DELETE' THEN
      UPDATE public.vip_posts SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = OLD.post_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER trg_vip_comments_count
AFTER INSERT OR DELETE ON public.vip_comments
FOR EACH ROW EXECUTE FUNCTION public.vip_sync_counts();

CREATE TRIGGER trg_vip_likes_count
AFTER INSERT OR DELETE ON public.vip_post_likes
FOR EACH ROW EXECUTE FUNCTION public.vip_sync_counts();

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER trg_vip_posts_updated
BEFORE UPDATE ON public.vip_posts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.simulado_ranking(_limit INTEGER DEFAULT 50)
RETURNS TABLE (
  user_id UUID,
  display_name TEXT,
  total_points BIGINT,
  attempts BIGINT,
  accuracy NUMERIC
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    a.user_id,
    MAX(a.display_name) AS display_name,
    SUM(a.score)::BIGINT AS total_points,
    COUNT(*)::BIGINT AS attempts,
    ROUND((SUM(a.score)::NUMERIC / NULLIF(SUM(a.total), 0)) * 100, 1) AS accuracy
  FROM public.simulado_attempts a
  GROUP BY a.user_id
  ORDER BY total_points DESC, accuracy DESC NULLS LAST
  LIMIT COALESCE(_limit, 50);
$$;

GRANT EXECUTE ON FUNCTION public.simulado_ranking(INTEGER) TO authenticated;
