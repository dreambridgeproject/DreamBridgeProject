-- Adds columns to persist the corporate ID / company site URL that
-- agency & casting accounts enter during /verification, which were
-- previously captured in the form but never saved to the profile.
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS corporate_id TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS corporate_site TEXT;
