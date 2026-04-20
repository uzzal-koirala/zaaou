-- Restrict public read access on comments.email (and admin notes-style fields)
-- Public/anon users can still read approved comments but NOT the email column.
-- Admins and post authors retain full access via existing RLS policies + table-level grants.

-- Revoke broad SELECT on the table from anon/public, then re-grant only safe columns.
REVOKE SELECT ON public.comments FROM anon;
REVOKE SELECT ON public.comments FROM PUBLIC;

GRANT SELECT (id, post_id, name, content, status, created_at, updated_at)
  ON public.comments TO anon;
GRANT SELECT (id, post_id, name, content, status, created_at, updated_at)
  ON public.comments TO authenticated;
