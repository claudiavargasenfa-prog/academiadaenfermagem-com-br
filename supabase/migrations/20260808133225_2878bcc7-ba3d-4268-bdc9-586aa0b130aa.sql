-- Removendo a linha de suspeita de AVC no Mini App CCR
UPDATE public.mini_apps 
SET content_md = REPLACE(content_md, '<li>Suspeita de AVC agudo com sintomas iniciados há menos de 4,5 horas (boca torta, perda de força).</li>', '') 
WHERE id = 'fdbccdd7-15ca-451e-92a2-e8b794923270';

-- Neutralizando referências no Quiz do Mini App CCR
UPDATE public.mini_apps 
SET content_md = REPLACE(content_md, 'Linha de Cuidado do AVC', 'Protocolo de Emergência') 
WHERE id = 'fdbccdd7-15ca-451e-92a2-e8b794923270';

-- Neutralizando referências no Mini App de Simulações
UPDATE public.mini_apps 
SET content_md = REPLACE(content_md, 'Suspeita de Acidente Vascular Cerebral (AVC) agudo', 'Suspeita de disfunção neurológica aguda') 
WHERE id = 'd8fd0a59-5578-4531-9b9c-68405c08ff6c';

UPDATE public.mini_apps 
SET content_md = REPLACE(content_md, 'Acionar imediatamente a Linha de Cuidado do AVC', 'Acionar imediatamente a equipe de resposta rápida') 
WHERE id = 'd8fd0a59-5578-4531-9b9c-68405c08ff6c';

UPDATE public.mini_apps 
SET content_md = REPLACE(content_md, 'Quadro de AVC agudo em evolução', 'Quadro de alteração neurológica súbita') 
WHERE id = 'd8fd0a59-5578-4531-9b9c-68405c08ff6c';

UPDATE public.mini_apps 
SET content_md = REPLACE(content_md, 'Acionar o protocolo Linha de AVC imediatamente', 'Acionar a equipe de emergência neurológica imediatamente') 
WHERE id = 'd8fd0a59-5578-4531-9b9c-68405c08ff6c';