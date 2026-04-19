-- Link authors table to auth users
ALTER TABLE public.authors
  ADD COLUMN IF NOT EXISTS user_id uuid UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_authors_user_id ON public.authors(user_id);

-- Helper: is this user the author of this post?
CREATE OR REPLACE FUNCTION public.is_post_author(_post_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.posts p
    JOIN public.authors a ON a.id = p.author_id
    WHERE p.id = _post_id AND a.user_id = _user_id
  )
$$;

-- Helper: get current user's author id
CREATE OR REPLACE FUNCTION public.current_author_id()
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.authors WHERE user_id = auth.uid() LIMIT 1
$$;

-- POSTS: authors can manage their own
CREATE POLICY "Authors can view their own posts"
  ON public.posts FOR SELECT TO authenticated
  USING (
    has_role(auth.uid(), 'author'::app_role)
    AND author_id = public.current_author_id()
  );

CREATE POLICY "Authors can insert their own posts"
  ON public.posts FOR INSERT TO authenticated
  WITH CHECK (
    has_role(auth.uid(), 'author'::app_role)
    AND author_id = public.current_author_id()
  );

CREATE POLICY "Authors can update their own posts"
  ON public.posts FOR UPDATE TO authenticated
  USING (
    has_role(auth.uid(), 'author'::app_role)
    AND author_id = public.current_author_id()
  );

CREATE POLICY "Authors can delete their own posts"
  ON public.posts FOR DELETE TO authenticated
  USING (
    has_role(auth.uid(), 'author'::app_role)
    AND author_id = public.current_author_id()
  );

-- AUTHORS: authors can update their own row
CREATE POLICY "Authors can update their own profile"
  ON public.authors FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

-- COMMENTS: authors can view & moderate comments on their own posts
CREATE POLICY "Authors can view comments on their posts"
  ON public.comments FOR SELECT TO authenticated
  USING (
    has_role(auth.uid(), 'author'::app_role)
    AND public.is_post_author(post_id, auth.uid())
  );

CREATE POLICY "Authors can update comments on their posts"
  ON public.comments FOR UPDATE TO authenticated
  USING (
    has_role(auth.uid(), 'author'::app_role)
    AND public.is_post_author(post_id, auth.uid())
  );

CREATE POLICY "Authors can delete comments on their posts"
  ON public.comments FOR DELETE TO authenticated
  USING (
    has_role(auth.uid(), 'author'::app_role)
    AND public.is_post_author(post_id, auth.uid())
  );

-- POST VIEWS: deduped per visitor per day
CREATE TABLE IF NOT EXISTS public.post_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  visitor_hash text NOT NULL,
  viewed_on date NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::date,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (post_id, visitor_hash, viewed_on)
);

CREATE INDEX IF NOT EXISTS idx_post_views_post_id ON public.post_views(post_id);

ALTER TABLE public.post_views ENABLE ROW LEVEL SECURITY;

-- Public can insert (deduped via unique index); reads restricted to admins/authors
CREATE POLICY "Anyone can record a post view"
  ON public.post_views FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view all post views"
  ON public.post_views FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authors can view their post views"
  ON public.post_views FOR SELECT TO authenticated
  USING (
    has_role(auth.uid(), 'author'::app_role)
    AND public.is_post_author(post_id, auth.uid())
  );
