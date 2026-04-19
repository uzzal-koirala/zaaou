-- Create a public storage bucket for admin-uploaded images
INSERT INTO storage.buckets (id, name, public)
VALUES ('public-images', 'public-images', true)
ON CONFLICT (id) DO NOTHING;

-- Anyone can view (public bucket)
CREATE POLICY "Public read for public-images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'public-images');

-- Only admins can upload
CREATE POLICY "Admins can upload public-images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'public-images'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- Only admins can update
CREATE POLICY "Admins can update public-images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'public-images'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- Only admins can delete
CREATE POLICY "Admins can delete public-images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'public-images'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);