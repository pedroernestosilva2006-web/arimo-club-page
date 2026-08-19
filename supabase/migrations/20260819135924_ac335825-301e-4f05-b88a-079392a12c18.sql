drop policy "Admins can view applications" on public.lead_applications;

create policy "Admins can view applications"
on public.lead_applications for select to authenticated
using (exists (
  select 1 from public.user_roles ur
  where ur.user_id = auth.uid() and ur.role = 'admin'
));