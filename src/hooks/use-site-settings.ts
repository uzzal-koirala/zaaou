import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type SiteSettings = {
  id: string;
  comments_enabled: boolean;
  comments_auto_approve: boolean;
  notifications_enabled: boolean;
  site_name: string;
  site_tagline: string;
  site_logo_url: string | null;
  contact_phone_primary: string;
  contact_phone_secondary: string;
  contact_email: string;
  contact_address: string;
  contact_whatsapp: string;
  social_facebook_url: string | null;
  social_instagram_url: string | null;
  social_tiktok_url: string | null;
  social_youtube_url: string | null;
  social_twitter_url: string | null;
  social_linkedin_url: string | null;
  seo_default_title: string;
  seo_default_description: string;
  seo_default_og_image_url: string | null;
  maintenance_mode: boolean;
  maintenance_message: string;
};

const ALL_COLUMNS =
  "id, comments_enabled, comments_auto_approve, notifications_enabled, site_name, site_tagline, site_logo_url, contact_phone_primary, contact_phone_secondary, contact_email, contact_address, contact_whatsapp, social_facebook_url, social_instagram_url, social_tiktok_url, social_youtube_url, social_twitter_url, social_linkedin_url, seo_default_title, seo_default_description, seo_default_og_image_url, maintenance_mode, maintenance_message";

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("blog_settings")
        .select(ALL_COLUMNS)
        .eq("singleton", true)
        .maybeSingle();
      if (!cancelled) {
        setSettings(data as SiteSettings | null);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { settings, loading };
}

export const SETTINGS_COLUMNS = ALL_COLUMNS;
