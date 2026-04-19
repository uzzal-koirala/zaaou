-- Allow authenticated users (admins & authors) to manage files in public-images bucket
CREATE POLICY "Authenticated users can upload to public-images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'public-images');

CREATE POLICY "Authenticated users can update public-images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'public-images');

CREATE POLICY "Authenticated users can delete public-images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'public-images');

CREATE POLICY "Public can read public-images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'public-images');