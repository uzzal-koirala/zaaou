
-- ============================================================
-- ENUMS
-- ============================================================
CREATE TYPE public.app_role AS ENUM ('admin', 'user');
CREATE TYPE public.post_status AS ENUM ('draft', 'published');
CREATE TYPE public.comment_status AS ENUM ('pending', 'approved', 'rejected');

-- ============================================================
-- USER ROLES (security)
-- ============================================================
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert roles"
  ON public.user_roles FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update roles"
  ON public.user_roles FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles"
  ON public.user_roles FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- SHARED HELPERS
-- ============================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.slugify(value text)
RETURNS text
LANGUAGE sql
IMMUTABLE
SET search_path = public
AS $$
  SELECT trim(both '-' from regexp_replace(lower(coalesce(value, '')), '[^a-z0-9]+', '-', 'g'))
$$;

-- ============================================================
-- AUTHORS
-- ============================================================
CREATE TABLE public.authors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  role text,
  bio text,
  avatar_url text,
  twitter_url text,
  facebook_url text,
  linkedin_url text,
  instagram_url text,
  website_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER authors_set_updated_at
BEFORE UPDATE ON public.authors
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.authors_set_slug()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug = public.slugify(NEW.name);
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER authors_set_slug_trg
BEFORE INSERT OR UPDATE ON public.authors
FOR EACH ROW EXECUTE FUNCTION public.authors_set_slug();

CREATE POLICY "Authors are publicly viewable"
  ON public.authors FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert authors"
  ON public.authors FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update authors"
  ON public.authors FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete authors"
  ON public.authors FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- POSTS
-- ============================================================
CREATE TABLE public.posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text,
  content text NOT NULL DEFAULT '',
  cover_image_url text,
  author_id uuid REFERENCES public.authors(id) ON DELETE SET NULL,
  category text,
  tags text[] NOT NULL DEFAULT '{}',
  status public.post_status NOT NULL DEFAULT 'draft',
  published_at timestamptz,
  reading_time_minutes int,
  seo_title text,
  seo_description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX posts_status_published_at_idx ON public.posts (status, published_at DESC);
CREATE INDEX posts_author_id_idx ON public.posts (author_id);
CREATE INDEX posts_category_idx ON public.posts (category);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER posts_set_updated_at
BEFORE UPDATE ON public.posts
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.posts_set_slug()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug = public.slugify(NEW.title);
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER posts_set_slug_trg
BEFORE INSERT OR UPDATE ON public.posts
FOR EACH ROW EXECUTE FUNCTION public.posts_set_slug();

CREATE POLICY "Published posts are publicly viewable"
  ON public.posts FOR SELECT
  USING (status = 'published');

CREATE POLICY "Admins can view all posts"
  ON public.posts FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert posts"
  ON public.posts FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update posts"
  ON public.posts FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete posts"
  ON public.posts FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- BLOG SETTINGS (single row)
-- ============================================================
CREATE TABLE public.blog_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  singleton boolean NOT NULL DEFAULT true UNIQUE,
  comments_enabled boolean NOT NULL DEFAULT true,
  comments_auto_approve boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_settings ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER blog_settings_set_updated_at
BEFORE UPDATE ON public.blog_settings
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE POLICY "Blog settings are publicly viewable"
  ON public.blog_settings FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert blog settings"
  ON public.blog_settings FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update blog settings"
  ON public.blog_settings FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.blog_settings (singleton, comments_enabled, comments_auto_approve)
VALUES (true, true, false);

-- ============================================================
-- COMMENTS
-- ============================================================
CREATE TABLE public.comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  content text NOT NULL,
  status public.comment_status NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX comments_post_id_status_idx ON public.comments (post_id, status);
CREATE INDEX comments_status_created_at_idx ON public.comments (status, created_at DESC);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER comments_set_updated_at
BEFORE UPDATE ON public.comments
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Auto-set comment status based on settings on INSERT
CREATE OR REPLACE FUNCTION public.comments_apply_settings()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  auto_approve boolean;
  enabled boolean;
BEGIN
  SELECT s.comments_auto_approve, s.comments_enabled
    INTO auto_approve, enabled
  FROM public.blog_settings s
  WHERE s.singleton = true
  LIMIT 1;

  IF enabled IS NOT NULL AND enabled = false THEN
    RAISE EXCEPTION 'Comments are disabled';
  END IF;

  IF auto_approve IS TRUE THEN
    NEW.status = 'approved';
  ELSE
    NEW.status = 'pending';
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER comments_apply_settings_trg
BEFORE INSERT ON public.comments
FOR EACH ROW EXECUTE FUNCTION public.comments_apply_settings();

CREATE POLICY "Approved comments are publicly viewable"
  ON public.comments FOR SELECT
  USING (status = 'approved');

CREATE POLICY "Admins can view all comments"
  ON public.comments FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can submit comments"
  ON public.comments FOR INSERT
  WITH CHECK (
    char_length(name) BETWEEN 1 AND 80
    AND char_length(email) BETWEEN 3 AND 254
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND char_length(content) BETWEEN 1 AND 1500
  );

CREATE POLICY "Admins can update comments"
  ON public.comments FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete comments"
  ON public.comments FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- SEED: default author
-- ============================================================
INSERT INTO public.authors (name, slug, role, bio)
VALUES (
  'Zaaou Food Team',
  'zaaou-food-team',
  'Editorial',
  'The team behind Zaaou Food — sharing food stories, restaurant guides, and updates from Itahari.'
);
