-- Run in Supabase SQL Editor. Exposes a manager-only list of real Auth users.
CREATE OR REPLACE FUNCTION public.admin_list_users()
RETURNS TABLE (id uuid, email text, name text, role text, created_at timestamptz, banned boolean)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT u.id, u.email::text, COALESCE(u.raw_user_meta_data->>'full_name', '')::text,
         COALESCE(r.role, 'employee')::text, u.created_at,
         (u.banned_until IS NOT NULL AND u.banned_until > now())
  FROM auth.users u LEFT JOIN public.user_roles r ON r.user_id = u.id
  WHERE public.has_role('manager')
  ORDER BY u.created_at DESC;
$$;
REVOKE ALL ON FUNCTION public.admin_list_users() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_list_users() TO authenticated;
