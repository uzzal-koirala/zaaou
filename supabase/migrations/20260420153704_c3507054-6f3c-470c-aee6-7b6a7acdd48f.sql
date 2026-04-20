-- 1) Storage: remove overly-permissive authenticated policies
DROP POLICY IF EXISTS "Authenticated users can delete public-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update public-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload to public-images" ON storage.objects;

-- Author-owned prefix policies (files under {auth.uid}/...)
CREATE POLICY "Authors can upload to own folder in public-images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'public-images'
  AND has_role(auth.uid(), 'author'::app_role)
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Authors can update own files in public-images"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'public-images'
  AND has_role(auth.uid(), 'author'::app_role)
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Authors can delete own files in public-images"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'public-images'
  AND has_role(auth.uid(), 'author'::app_role)
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 2) Remove broad public SELECT (listing) on public-images; public URL reads still work via CDN
DROP POLICY IF EXISTS "Public can read public-images" ON storage.objects;
DROP POLICY IF EXISTS "Public read for public-images" ON storage.objects;

CREATE POLICY "Admins can list public-images"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'public-images' AND has_role(auth.uid(), 'admin'::app_role)
);

-- 3) Hash login_gate_questions answers at rest
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;

ALTER TABLE public.login_gate_questions
  ADD COLUMN IF NOT EXISTS answer_hash text;

-- Drop the length check on plaintext answer (we'll store empty strings after scrubbing)
ALTER TABLE public.login_gate_questions
  DROP CONSTRAINT IF EXISTS login_gate_questions_answer_check;

-- Backfill hashes from existing plaintext answers (case-insensitive + trimmed)
UPDATE public.login_gate_questions
SET answer_hash = encode(digest(lower(btrim(answer)), 'sha256'), 'hex')
WHERE answer_hash IS NULL AND answer IS NOT NULL AND answer <> '';

-- Trigger to hash on write and scrub plaintext
CREATE OR REPLACE FUNCTION public.login_gate_hash_answer()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.answer IS NOT NULL AND NEW.answer <> '' THEN
    NEW.answer_hash = encode(digest(lower(btrim(NEW.answer)), 'sha256'), 'hex');
    NEW.answer = ''; -- scrub plaintext
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_login_gate_hash_answer ON public.login_gate_questions;
CREATE TRIGGER trg_login_gate_hash_answer
BEFORE INSERT OR UPDATE ON public.login_gate_questions
FOR EACH ROW EXECUTE FUNCTION public.login_gate_hash_answer();

-- Scrub any remaining plaintext now
UPDATE public.login_gate_questions SET answer = '' WHERE answer <> '';
