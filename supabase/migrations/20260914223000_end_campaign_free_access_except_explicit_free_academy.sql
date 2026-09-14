-- Política comercial da Academia da Enfermagem:
-- 1) Até 30/09/2026, novos cadastros recebem trial pela campanha vigente.
-- 2) A partir de 01/10/2026, os Mini Apps existentes não permanecem gratuitos por acidente.
-- 3) Uma nova Academia/Mini App poderá ser marcada explicitamente como gratuito=true
--    quando for criada. Essa marcação é a exceção permanente desejada pela campanha.
--
-- Importante: não removemos assinaturas/trials existentes. O trial da campanha continua
-- válido até 30/09/2026 conforme a migration anterior.

UPDATE public.mini_apps
SET gratuito = false
WHERE gratuito = true;
