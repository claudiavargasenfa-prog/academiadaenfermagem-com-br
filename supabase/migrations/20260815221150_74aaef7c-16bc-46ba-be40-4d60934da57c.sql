DELETE FROM public.mini_app_subtopics 
WHERE mini_app_id IN (
    SELECT id 
    FROM public.mini_apps 
    WHERE name = 'Manejo de Drogas Vasoativas'
);