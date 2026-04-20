CREATE TABLE public.job_postings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  department text NOT NULL DEFAULT 'General',
  job_type text NOT NULL DEFAULT 'Full-time',
  location text NOT NULL DEFAULT 'Itahari',
  description text NOT NULL,
  apply_url text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active jobs are publicly viewable"
ON public.job_postings FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can view all jobs"
ON public.job_postings FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert jobs"
ON public.job_postings FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update jobs"
ON public.job_postings FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete jobs"
ON public.job_postings FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER job_postings_set_updated_at
BEFORE UPDATE ON public.job_postings
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_job_postings_active_order ON public.job_postings (is_active, display_order, created_at DESC);

-- Seed existing hardcoded jobs so the site doesn't go empty
INSERT INTO public.job_postings (title, department, job_type, location, description, apply_url, display_order) VALUES
('Delivery Rider', 'Operations', 'Full-time', 'Itahari (On-field)', 'Deliver hot, fresh food across Itahari. Own bike and smartphone required. Daily payouts.', 'https://wa.me/9779705047000?text=Hi%20Zaaou%2C%20I%27d%20like%20to%20apply%20for%20the%20Delivery%20Rider%20role.', 1),
('Operations Lead', 'Operations', 'Full-time', 'Itahari (On-site)', 'Lead the rider fleet, manage live dispatch and improve delivery times across the city.', 'https://wa.me/9779705047000?text=Hi%20Zaaou%2C%20I%27d%20like%20to%20apply%20for%20the%20Operations%20Lead%20role.', 2),
('Flutter Mobile Developer', 'Engineering', 'Full-time', 'Itahari / Remote', 'Build and ship features for the Zaaou Food customer and rider apps in Flutter.', 'mailto:careers@zaaoufood.com?subject=Application%3A%20Flutter%20Mobile%20Developer', 3),
('Backend Engineer (Node.js)', 'Engineering', 'Full-time', 'Remote', 'Design scalable APIs, payments and order pipelines powering thousands of daily orders.', 'mailto:careers@zaaoufood.com?subject=Application%3A%20Backend%20Engineer', 4),
('Restaurant Success Manager', 'Partnerships', 'Full-time', 'Itahari (On-site)', 'Onboard new partner restaurants and help them grow on the Zaaou platform.', 'mailto:careers@zaaoufood.com?subject=Application%3A%20Restaurant%20Success%20Manager', 5),
('Social Media Intern', 'Marketing', 'Internship', 'Itahari (Hybrid)', 'Run our Facebook, Instagram and TikTok - shoot food, write captions, engage the community.', 'mailto:careers@zaaoufood.com?subject=Application%3A%20Social%20Media%20Intern', 6);