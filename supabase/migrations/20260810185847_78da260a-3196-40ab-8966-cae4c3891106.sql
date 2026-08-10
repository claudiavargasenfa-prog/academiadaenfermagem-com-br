UPDATE public.mini_apps
SET content_md = replace(content_md, '                    ======================================= -->
                <!-- SEÇÃO DE PRESCRIÇÃO INTERATIVA COM CAPTURA AUTOMÁTICA -->', '                    <!-- SEÇÃO DE PRESCRIÇÃO INTERATIVA COM CAPTURA AUTOMÁTICA -->')
WHERE slug = 'DE-FUNDAMENTOS';