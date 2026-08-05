-- Update user_feedbacks with a visibility toggle
ALTER TABLE public.user_feedbacks ADD COLUMN IF NOT EXISTS is_public boolean DEFAULT false;

-- Create a table for public student area comments (after admin approval)
CREATE TABLE public.student_comments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    content text NOT NULL,
    category text,
    is_approved boolean DEFAULT false, -- Must be manually approved by admin
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

GRANT SELECT, INSERT ON public.student_comments TO authenticated;
GRANT ALL ON public.student_comments TO service_role;

ALTER TABLE public.student_comments ENABLE ROW LEVEL SECURITY;

-- Everyone can view approved comments
CREATE POLICY "Anyone can view approved comments" 
ON public.student_comments FOR SELECT 
TO authenticated 
USING (is_approved = true OR auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Users can insert their own comments (pending approval)
CREATE POLICY "Users can insert their own comments" 
ON public.student_comments FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Admins can update approval status
CREATE POLICY "Admins can moderate comments" 
ON public.student_comments FOR UPDATE 
TO authenticated 
USING (public.has_role(auth.uid(), 'admin'));
