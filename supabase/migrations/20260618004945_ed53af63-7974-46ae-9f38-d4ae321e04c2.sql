ALTER TABLE public.mini_apps ALTER COLUMN kind DROP DEFAULT;
ALTER TABLE public.mini_apps ALTER COLUMN kind TYPE text USING kind::text;
ALTER TABLE public.mini_apps ALTER COLUMN kind SET DEFAULT 'extra';