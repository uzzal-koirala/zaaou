-- Restrict login_gate_* columns from public/anon reads.
-- Server functions use the service role and bypass these grants.
-- Admins read these via admin dashboard while authenticated.

REVOKE SELECT ON public.blog_settings FROM anon;
REVOKE SELECT ON public.blog_settings FROM PUBLIC;

-- Re-grant SELECT on safe columns only to anon
GRANT SELECT (
  id, singleton,
  site_name, site_tagline, site_logo_url,
  contact_phone_primary, contact_phone_secondary, contact_email, contact_address, contact_whatsapp,
  social_facebook_url, social_instagram_url, social_tiktok_url, social_youtube_url, social_twitter_url, social_linkedin_url,
  seo_default_title, seo_default_description, seo_default_og_image_url,
  maintenance_mode, maintenance_message,
  notifications_enabled,
  comments_enabled, comments_auto_approve,
  created_at, updated_at
) ON public.blog_settings TO anon;

-- Authenticated users (including admins) get full SELECT
GRANT SELECT ON public.blog_settings TO authenticated;
