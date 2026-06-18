INSERT INTO public.mini_apps (slug, name, description, kind, price_cents, gratuito, em_breve, route_path, horas_certificado, is_active, sort_order)
VALUES ('simulacoes-reais', 'Simulações Reais', 'Casos clínicos hospitalares com monitor multiparamétrico e decisão de enfermagem em tempo real.', 'extra', 1490, false, false, '/simulacoes-reais', 6, true, 22)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  kind = EXCLUDED.kind,
  price_cents = EXCLUDED.price_cents,
  gratuito = EXCLUDED.gratuito,
  em_breve = EXCLUDED.em_breve,
  route_path = EXCLUDED.route_path,
  horas_certificado = EXCLUDED.horas_certificado,
  is_active = EXCLUDED.is_active,
  sort_order = EXCLUDED.sort_order,
  updated_at = now();