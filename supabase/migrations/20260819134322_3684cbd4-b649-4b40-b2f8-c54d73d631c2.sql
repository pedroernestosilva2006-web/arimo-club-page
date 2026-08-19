CREATE TABLE public.lead_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  telefone TEXT NOT NULL,
  instagram TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
GRANT INSERT ON public.lead_applications TO anon;
GRANT INSERT ON public.lead_applications TO authenticated;
GRANT ALL ON public.lead_applications TO service_role;
ALTER TABLE public.lead_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit an application" ON public.lead_applications FOR INSERT TO anon, authenticated WITH CHECK (true);