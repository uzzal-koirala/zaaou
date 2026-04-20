-- 1) Create a public-safe view excluding email
CREATE OR REPLACE VIEW public.comments_public AS
SELECT id, post_id, name, content, status, created_at, updated_at
FROM public.comments
WHERE status = 'approved';

-- 2) Drop the public SELECT policy on the table so anon can't read it directly
DROP POLICY IF EXISTS "Approved comments are publicly viewable" ON public.comments;

-- 3) Grant anon SELECT on the view only
GRANT SELECT ON public.comments_public TO anon;

-- 4) Ensure authenticated also has view access (for non-admin/author users)
GRANT SELECT ON public.comments_public TO authenticated;
