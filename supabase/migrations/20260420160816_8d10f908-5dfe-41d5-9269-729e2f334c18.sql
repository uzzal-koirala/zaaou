-- Re-add public SELECT RLS so the view (security_invoker) can read approved rows.
-- Email column remains protected via column-level grants (revoked earlier from anon).
CREATE POLICY "Approved comments are publicly viewable"
ON public.comments
FOR SELECT
TO anon, authenticated
USING (status = 'approved');

-- Re-grant SELECT on safe columns only (in case earlier grants were lost)
GRANT SELECT (id, post_id, name, content, status, created_at, updated_at)
  ON public.comments TO anon;
GRANT SELECT (id, post_id, name, content, status, created_at, updated_at)
  ON public.comments TO authenticated;
