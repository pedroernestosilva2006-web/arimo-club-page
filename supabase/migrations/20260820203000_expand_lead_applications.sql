alter table public.lead_applications
  add column if not exists nome text,
  add column if not exists situacao_profissional text,
  add column if not exists empresa text,
  add column if not exists cargo text,
  add column if not exists segmento text,
  add column if not exists faturamento_aproximado text,
  add column if not exists cidade text,
  add column if not exists motivacao text;

comment on column public.lead_applications.situacao_profissional is
  'Momento profissional, incluindo pessoas que ainda não possuem empresa.';
