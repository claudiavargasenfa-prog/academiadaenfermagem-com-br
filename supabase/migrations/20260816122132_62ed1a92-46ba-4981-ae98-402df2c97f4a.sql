UPDATE public.mini_app_subtopics 
SET is_draft = false 
WHERE mini_app_id IN (SELECT id FROM public.mini_apps WHERE slug = 'drogas-vasoativas');