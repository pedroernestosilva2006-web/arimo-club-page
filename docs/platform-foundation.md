# Fundação da plataforma ARIMO

Esta entrega implementa a Fase 1 da plataforma: candidaturas controladas, autenticação, roles,
perfis, aprovação, convites, onboarding, foto de perfil e auditoria.

## Ordem de publicação

As migrations precisam ser aplicadas antes do código da aplicação. O site público mantém uma
compatibilidade temporária com o formulário antigo, mas as rotas autenticadas dependem do novo
schema.

1. Abra o projeto Supabase `xmhuprcszrshsmeineej`.
2. Aplique estes arquivos, nesta ordem, pelo SQL Editor ou pela CLI do Supabase:
   - `supabase/migrations/20260822190000_expand_platform_roles.sql`
   - `supabase/migrations/20260822190100_platform_foundation.sql`
   - `supabase/migrations/20260822190200_profile_avatars.sql`
3. Adicione `SUPABASE_SERVICE_ROLE_KEY` na Vercel para Production, Preview e Development.
4. Adicione `APP_URL` com o domínio canônico, sem barra no final.
5. Faça um novo deploy depois que as migrations e as variáveis estiverem ativas.

Nunca exponha `SUPABASE_SERVICE_ROLE_KEY` em uma variável `VITE_` ou em código enviado ao navegador.

## Autenticação no Supabase

Em Authentication > URL Configuration:

- Defina o Site URL como o domínio canônico de produção.
- Adicione `https://seu-dominio.com/activate` em Redirect URLs.
- Adicione `https://seu-dominio.com/reset-password` em Redirect URLs.
- Durante o desenvolvimento, adicione também as URLs equivalentes do localhost.

O produto não oferece cadastro público. Uma conta recebe a role de membro somente quando é criada
a partir de uma candidatura aprovada. A role legada `user` não concede acesso à plataforma.

Se o projeto ainda não possuir nenhum administrador, crie primeiro o usuário pelo painel de
Authentication e atribua `super_admin` explicitamente pelo SQL Editor. Nunca reative a regra antiga
que transformava automaticamente o primeiro cadastro público em administrador.

```sql
insert into public.user_roles (user_id, role)
select id, 'super_admin'::public.app_role
from auth.users
where lower(email) = lower('SEU_EMAIL_ADMIN')
on conflict (user_id, role) do nothing;
```

## E-mail transacional

A aprovação usa `supabase.auth.admin.inviteUserByEmail`, portanto cada membro cria a própria senha.
Configure um SMTP personalizado no Supabase antes de convidar membros reais. Os arquivos em
`supabase/templates` contêm a copy e a direção visual ARIMO para os e-mails de convite e recuperação.

## Rotas entregues

- `/login`
- `/activate`
- `/reset-password`
- `/application-status`
- `/onboarding`
- `/club`
- `/profile`
- `/admin/applications`

`/auth` e `/leads` continuam disponíveis apenas como redirecionamentos de compatibilidade.

## Modelo de segurança

- Roles são verificadas nas server functions e no RLS, não apenas na interface.
- Candidatos enviam dados por uma RPC controlada e não podem ler a tabela de candidaturas.
- O status usa um protocolo aleatório de alta entropia e não retorna dados pessoais.
- Apenas `admin` e `super_admin` podem analisar candidaturas.
- Operações privadas usam a service role somente dentro de handlers no servidor.
- Toda aprovação e recusa cria um registro de auditoria.
- A role legada `user` é explicitamente bloqueada.
- Fotos são limitadas a 5 MB e cada membro só pode alterar objetos dentro da própria pasta.
