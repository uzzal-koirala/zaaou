-- Status enum shared by both inquiry tables
CREATE TYPE public.inquiry_status AS ENUM ('new', 'in_progress', 'resolved', 'archived');

-- ===== contact_submissions =====
CREATE TABLE public.contact_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  topic TEXT,
  message TEXT NOT NULL,
  status public.inquiry_status NOT NULL DEFAULT 'new',
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact messages"
ON public.contact_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (
  char_length(name) BETWEEN 1 AND 80
  AND char_length(email) BETWEEN 3 AND 254
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND char_length(message) BETWEEN 1 AND 3000
  AND (topic IS NULL OR char_length(topic) <= 80)
  AND status = 'new'
  AND admin_notes IS NULL
);

CREATE POLICY "Admins can view contact submissions"
ON public.contact_submissions FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update contact submissions"
ON public.contact_submissions FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete contact submissions"
ON public.contact_submissions FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER contact_submissions_updated_at
BEFORE UPDATE ON public.contact_submissions
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_contact_submissions_created ON public.contact_submissions (created_at DESC);
CREATE INDEX idx_contact_submissions_status ON public.contact_submissions (status);

-- ===== partner_applications =====
CREATE TABLE public.partner_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  address TEXT,
  cuisine TEXT,
  message TEXT,
  status public.inquiry_status NOT NULL DEFAULT 'new',
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.partner_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can apply to partner"
ON public.partner_applications
FOR INSERT
TO anon, authenticated
WITH CHECK (
  char_length(restaurant_name) BETWEEN 1 AND 120
  AND char_length(owner_name) BETWEEN 1 AND 80
  AND char_length(phone) BETWEEN 3 AND 40
  AND char_length(email) BETWEEN 3 AND 254
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND (address IS NULL OR char_length(address) <= 300)
  AND (cuisine IS NULL OR char_length(cuisine) <= 80)
  AND (message IS NULL OR char_length(message) <= 3000)
  AND status = 'new'
  AND admin_notes IS NULL
);

CREATE POLICY "Admins can view partner applications"
ON public.partner_applications FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update partner applications"
ON public.partner_applications FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete partner applications"
ON public.partner_applications FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER partner_applications_updated_at
BEFORE UPDATE ON public.partner_applications
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_partner_applications_created ON public.partner_applications (created_at DESC);
CREATE INDEX idx_partner_applications_status ON public.partner_applications (status);