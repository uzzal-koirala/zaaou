-- Restaurants table for admin management
CREATE TABLE public.restaurants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  cuisine TEXT,
  description TEXT,
  cover_image_url TEXT,
  address TEXT,
  phone TEXT,
  rating NUMERIC(2,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  delivery_time_minutes INTEGER,
  price_range TEXT CHECK (price_range IN ('$', '$$', '$$$', '$$$$')),
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  tags TEXT[] NOT NULL DEFAULT '{}'::text[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-slug trigger
CREATE OR REPLACE FUNCTION public.restaurants_set_slug()
RETURNS TRIGGER
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

CREATE TRIGGER restaurants_set_slug_trigger
  BEFORE INSERT OR UPDATE ON public.restaurants
  FOR EACH ROW EXECUTE FUNCTION public.restaurants_set_slug();

CREATE TRIGGER restaurants_set_updated_at
  BEFORE UPDATE ON public.restaurants
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active restaurants are publicly viewable"
  ON public.restaurants FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can view all restaurants"
  ON public.restaurants FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert restaurants"
  ON public.restaurants FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update restaurants"
  ON public.restaurants FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete restaurants"
  ON public.restaurants FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Riders table (placeholder structure for future operational use)
CREATE TABLE public.riders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  vehicle_type TEXT CHECK (vehicle_type IN ('bike', 'scooter', 'cycle', 'car')),
  status TEXT NOT NULL DEFAULT 'offline' CHECK (status IN ('online', 'offline', 'busy', 'inactive')),
  avatar_url TEXT,
  rating NUMERIC(2,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  total_deliveries INTEGER NOT NULL DEFAULT 0,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER riders_set_updated_at
  BEFORE UPDATE ON public.riders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.riders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all riders"
  ON public.riders FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert riders"
  ON public.riders FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update riders"
  ON public.riders FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete riders"
  ON public.riders FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));