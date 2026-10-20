-- Run in Supabase SQL Editor. Keeps messaging limited to management accounts.
CREATE OR REPLACE FUNCTION public.message_recipients()
RETURNS TABLE (user_id uuid, display_name text, email text, role text)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  IF NOT (public.has_role('manager') OR public.has_role('assistant_manager')) THEN
    RAISE EXCEPTION 'Not authorized' USING ERRCODE = '42501';
  END IF;
  RETURN QUERY
  SELECT r.user_id,
    COALESCE(NULLIF(u.raw_user_meta_data->>'full_name',''), split_part(u.email,'@',1)),
    u.email::text, r.role
  FROM public.user_roles r JOIN auth.users u ON u.id = r.user_id
  WHERE r.role IN ('manager','assistant_manager')
  ORDER BY r.role, u.email;
END;
$$;
REVOKE ALL ON FUNCTION public.message_recipients() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.message_recipients() TO authenticated;

CREATE OR REPLACE FUNCTION public.is_management_user(target_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = target_user_id AND role IN ('manager','assistant_manager')); $$;
REVOKE ALL ON FUNCTION public.is_management_user(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_management_user(uuid) TO authenticated;

-- Remove all prior INSERT policies: permissive policies combine with OR.
DO $$ DECLARE policy_record record; BEGIN
 FOR policy_record IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='internal_messages' AND cmd IN ('INSERT','ALL') LOOP
  EXECUTE format('DROP POLICY IF EXISTS %I ON public.internal_messages', policy_record.policyname);
 END LOOP;
END $$;

ALTER TABLE public.internal_messages ENABLE ROW LEVEL SECURITY;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT ON public.internal_messages TO authenticated;
CREATE POLICY "Management can send messages" ON public.internal_messages
FOR INSERT TO authenticated WITH CHECK (
 sender_id = (SELECT auth.uid())
 AND (public.has_role('manager') OR public.has_role('assistant_manager'))
 AND public.is_management_user(recipient_id)
 AND length(trim(subject)) BETWEEN 1 AND 200
 AND length(trim(body)) BETWEEN 1 AND 20000
);

-- Ensure users can only see their own correspondence.
DO $$ DECLARE policy_record record; BEGIN
 FOR policy_record IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='internal_messages' AND cmd='SELECT' LOOP
  EXECUTE format('DROP POLICY IF EXISTS %I ON public.internal_messages', policy_record.policyname);
 END LOOP;
END $$;
CREATE POLICY "Participants can view messages" ON public.internal_messages
FOR SELECT TO authenticated USING (sender_id = (SELECT auth.uid()) OR recipient_id = (SELECT auth.uid()));

-- Only recipient can change read state; prevent updates to other columns via column grant.
REVOKE UPDATE ON public.internal_messages FROM authenticated;
GRANT UPDATE (is_read) ON public.internal_messages TO authenticated;
DO $$ DECLARE policy_record record; BEGIN
 FOR policy_record IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='internal_messages' AND cmd='UPDATE' LOOP
  EXECUTE format('DROP POLICY IF EXISTS %I ON public.internal_messages', policy_record.policyname);
 END LOOP;
END $$;
CREATE POLICY "Recipients mark read" ON public.internal_messages
FOR UPDATE TO authenticated USING (recipient_id = (SELECT auth.uid())) WITH CHECK (recipient_id = (SELECT auth.uid()));
