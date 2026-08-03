-- Fix: admin dashboard can't see all pending talent, and the approve/reject
-- button silently does nothing. Root cause: profiles RLS had no policy
-- letting an admin read or update rows other than their own. Run this once
-- in the Supabase SQL Editor.
--
-- Also tightens the verification-docs viewing policy from the earlier
-- fix (which used a loose "email contains admin@" match) to an exact
-- allowlist, since a substring match on storage.objects would let anyone
-- self-register with an "xadmin@..." email and read every uploaded ID
-- document.

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT
USING ((auth.jwt() ->> 'email') IN ('admin@dreambridge.jp', 'gengen718008+admin@gmail.com'));

DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
CREATE POLICY "Admins can update all profiles" ON public.profiles FOR UPDATE
USING ((auth.jwt() ->> 'email') IN ('admin@dreambridge.jp', 'gengen718008+admin@gmail.com'));

DROP POLICY IF EXISTS "Users can view own verification docs" ON storage.objects;
CREATE POLICY "Users can view own verification docs" ON storage.objects FOR SELECT
USING (
    bucket_id = 'verification-docs'
    AND (
        (storage.foldername(name))[1] = auth.uid()::text
        OR (auth.jwt() ->> 'email') IN ('admin@dreambridge.jp', 'gengen718008+admin@gmail.com')
    )
);
