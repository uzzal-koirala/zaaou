-- Site notifications (fake social-proof popups)
CREATE TABLE public.site_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  icon_url text,
  message text NOT NULL,
  time_ago_label text NOT NULL DEFAULT 'just now',
  is_active boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.site_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active notifications are publicly viewable"
ON public.site_notifications FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can view all notifications"
ON public.site_notifications FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert notifications"
ON public.site_notifications FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update notifications"
ON public.site_notifications FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete notifications"
ON public.site_notifications FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER site_notifications_set_updated_at
BEFORE UPDATE ON public.site_notifications
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Global on/off switch lives on blog_settings (site-wide settings table)
ALTER TABLE public.blog_settings
  ADD COLUMN IF NOT EXISTS notifications_enabled boolean NOT NULL DEFAULT true;

-- Seed a couple of example notifications
INSERT INTO public.site_notifications (icon_url, message, time_ago_label, display_order) VALUES
(NULL, 'Sushmita just ordered momos from Bhansa Ghar', '2 minutes ago', 1),
(NULL, 'Bibek from Itahari-7 ordered chowmein worth Rs. 480', '8 minutes ago', 2),
(NULL, 'New offer: Flat 20% off on your first order!', '15 minutes ago', 3);