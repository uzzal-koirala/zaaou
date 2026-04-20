import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Linkedin, Youtube, Music2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import logo from "@/assets/zaaou-logo.png";
import { useSiteSettings } from "@/hooks/use-site-settings";

const CURRENT_YEAR = 2026;

export function Footer() {
  const { settings } = useSiteSettings();

  const siteName = settings?.site_name ?? "Zaaou food";
  const tagline = settings?.site_tagline ?? "Itahari's favourite food delivery - connecting you to the city's best kitchens.";
  const logoUrl = settings?.site_logo_url || logo;
  const phone1 = settings?.contact_phone_primary ?? "+977 970-5047000";
  const phone2 = settings?.contact_phone_secondary ?? "+977 982-0757417";
  const email = settings?.contact_email ?? "info@zaaoufoods.com";
  const address = settings?.contact_address ?? "Itahari, Sunsari, Nepal";

  const socials: { url: string | null | undefined; icon: typeof Facebook; label: string }[] = [
    { url: settings?.social_facebook_url, icon: Facebook, label: "Facebook" },
    { url: settings?.social_instagram_url, icon: Instagram, label: "Instagram" },
    { url: settings?.social_tiktok_url, icon: Music2, label: "TikTok" },
    { url: settings?.social_youtube_url, icon: Youtube, label: "YouTube" },
    { url: settings?.social_twitter_url, icon: Twitter, label: "Twitter / X" },
    { url: settings?.social_linkedin_url, icon: Linkedin, label: "LinkedIn" },
  ];
  const activeSocials = socials.filter((s) => s.url && s.url.trim().length > 0);

  return (
    <footer className="bg-foreground text-background pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-10 border-b border-white/10 pb-12 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="mb-4 flex items-center gap-2.5">
              <img src={logoUrl} alt={siteName} className="h-11 w-11 rounded-xl object-cover" />
              <span className="font-display text-xl font-extrabold">{siteName}</span>
            </div>
            <p className="text-sm leading-relaxed text-background/70">{tagline}</p>
            {activeSocials.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-3">
                {activeSocials.map(({ url, icon: Icon, label }) => (
                  <a
                    key={label}
                    href={url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grid h-9 w-9 place-items-center rounded-full bg-white/10 transition-colors hover:bg-primary"
                    aria-label={label}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <h4 className="mb-4 font-display font-bold">Company</h4>
            <ul className="space-y-2.5 text-sm text-background/70">
              <li><a href="#" className="transition-colors hover:text-primary">About Us</a></li>
              <li><Link to="/careers" className="transition-colors hover:text-primary">Careers</Link></li>
              <li><Link to="/partner" className="transition-colors hover:text-primary">Partner with us</Link></li>
              <li><Link to="/blog" className="transition-colors hover:text-primary">Blog</Link></li>
              <li><Link to="/restaurants" className="transition-colors hover:text-primary">All Restaurants</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-display font-bold">Support</h4>
            <ul className="space-y-2.5 text-sm text-background/70">
              <li><a href="#" className="transition-colors hover:text-primary">Help Centre</a></li>
              <li><a href="#" className="transition-colors hover:text-primary">Terms of Service</a></li>
              <li><a href="#" className="transition-colors hover:text-primary">Privacy Policy</a></li>
              <li><a href="#" className="transition-colors hover:text-primary">FAQs</a></li>
              <li><Link to="/author/login" className="transition-colors hover:text-primary">Author Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-display font-bold">Get in touch</h4>
            <ul className="space-y-3 text-sm text-background/70">
              <li className="flex items-center gap-2.5"><MapPin className="h-4 w-4 shrink-0 text-primary" /><span>{address}</span></li>
              <li className="flex items-start gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                <span>{phone1}{phone2 ? <><br />{phone2}</> : null}</span>
              </li>
              <li className="flex items-center gap-2.5"><Mail className="h-4 w-4 shrink-0 text-primary" /><span>{email}</span></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-8 text-xs text-background/60">
          <p>© {CURRENT_YEAR} {siteName}. All rights reserved.</p>
          <p>
            Designed with <span className="text-primary">♥</span> by{" "}
            <a
              href="https://www.nepsustech.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-background hover:text-primary transition-colors underline-offset-4 hover:underline"
            >
              Nepsus Tech
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
