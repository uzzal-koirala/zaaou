DROP POLICY IF EXISTS "Anyone can record a post view" ON public.post_views;

CREATE POLICY "Anyone can record a post view"
  ON public.post_views FOR INSERT TO anon, authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.posts
      WHERE id = post_views.post_id
        AND status = 'published'
    )
  );
