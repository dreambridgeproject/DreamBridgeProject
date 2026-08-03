-- Fix: "Bucket not found" error when uploading identity/verification documents.
-- The verification-docs bucket + its RLS policies exist in supabase_schema.sql
-- (lines 190, 209-226) but were apparently never actually run against this project.
-- Safe to run even if partially applied already (idempotent).

INSERT INTO storage.buckets (id, name, public)
VALUES ('verification-docs', 'verification-docs', false)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Users can upload own verification docs" ON storage.objects;
CREATE POLICY "Users can upload own verification docs" ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'verification-docs'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "Users can view own verification docs" ON storage.objects;
CREATE POLICY "Users can view own verification docs" ON storage.objects FOR SELECT
USING (
    bucket_id = 'verification-docs'
    AND (
        (storage.foldername(name))[1] = auth.uid()::text
        OR (auth.jwt() ->> 'email') = 'admin@dreambridge.jp'
        OR (auth.jwt() ->> 'email') LIKE '%admin@%'
    )
);
