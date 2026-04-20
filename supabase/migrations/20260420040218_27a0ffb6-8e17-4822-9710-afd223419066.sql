-- Reviews / testimonials table
CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text,
  rating smallint NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  content text NOT NULL,
  avatar_url text,
  is_featured boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Public can view active reviews
CREATE POLICY "Active reviews are publicly viewable"
ON public.reviews FOR SELECT
USING (is_active = true);

-- Admins can view all
CREATE POLICY "Admins can view all reviews"
ON public.reviews FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert reviews"
ON public.reviews FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update reviews"
ON public.reviews FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete reviews"
ON public.reviews FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- updated_at trigger
CREATE TRIGGER reviews_set_updated_at
BEFORE UPDATE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_reviews_active_order ON public.reviews (is_active, display_order, created_at DESC);

-- Seed the existing hardcoded reviews so the site doesn't go empty
INSERT INTO public.reviews (name, role, rating, content, display_order, is_featured) VALUES
('Sushmita Karki', 'Itahari-3', 5, 'Zaaou Food has changed our weekends! The momos arrive piping hot every single time. Delivery is unbelievably fast.', 1, true),
('Bibek Rai', 'Itahari-7', 5, 'Best food app in Itahari, hands down. Smooth checkout, great offers, and the rider tracking is super accurate.', 2, true),
('Nirajan Limbu', 'Itahari-9', 5, 'I order dal bhat from Annapurna almost every other day. Quality is consistent and the support team genuinely cares.', 3, true),
('Asmita Shrestha', 'Itahari-1', 5, 'Late night cravings, sorted! Wide selection, fair prices, and the packaging always feels premium and clean.', 4, true);