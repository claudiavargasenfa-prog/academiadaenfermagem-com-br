CREATE TABLE public.user_feedbacks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    category text NOT NULL,
    rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
    message text NOT NULL,
    improvement_suggestion text,
    status text NOT NULL DEFAULT 'pendente',
    admin_response text,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

GRANT SELECT, INSERT, UPDATE ON public.user_feedbacks TO authenticated;
GRANT ALL ON public.user_feedbacks TO service_role;

ALTER TABLE public.user_feedbacks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own feedback" 
ON public.user_feedbacks FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own feedback" 
ON public.user_feedbacks FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all feedback" 
ON public.user_feedbacks FOR SELECT 
TO authenticated 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update feedback status and response" 
ON public.user_feedbacks FOR UPDATE 
TO authenticated 
USING (public.has_role(auth.uid(), 'admin'));

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_seen_at timestamptz;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_online boolean DEFAULT false;

GRANT UPDATE (last_seen_at, is_online) ON public.profiles TO authenticated;
