import { Mail, Phone, MapPin, Music2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import logo from "@/assets/zaaou-logo.png";
import { useSiteSettings } from "@/hooks/use-site-settings";

const CURRENT_YEAR = 2026;

type IconProps = { className?: string };
const FacebookIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden><path d="M22 12a10 10 0 10-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.3.2 2.3.2v2.5h-1.3c-1.3 0-1.7.8-1.7 1.6V12h2.9l-.5 2.9h-2.4v7A10 10 0 0022 12z"/></svg>
);
const InstagramIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>
);
const TwitterIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden><path d="M18.244 2H21l-6.52 7.45L22.5 22h-6.93l-4.83-6.31L5 22H2.24l7-8L1.5 2h7.06l4.36 5.77L18.244 2zm-1.214 18h1.62L7.06 4H5.36l11.67 16z"/></svg>
);
const LinkedinIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden><path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8h4.56v14H.22V8zm7.5 0h4.37v1.91h.06c.61-1.15 2.1-2.36 4.32-2.36 4.62 0 5.47 3.04 5.47 7v7.45h-4.56v-6.6c0-1.57-.03-3.6-2.2-3.6-2.2 0-2.54 1.71-2.54 3.48V22H7.72V8z"/></svg>
);
const YoutubeIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden><path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 00.5 6.2 31 31 0 000 12a31 31 0 00.5 5.8 3 3 0 002.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 002.1-2.1A31 31 0 0024 12a31 31 0 00-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z"/></svg>
);



export function Footer() {
  const { settings } = useSiteSettings();

  const siteName = settings?.site_name ?? "Zaaou food";
  const tagline = settings?.site_tagline ?? "Itahari's favourite food delivery - connecting you to the city's best kitchens.";
  const logoUrl = settings?.site_logo_url || logo;
  const phone1 = settings?.contact_phone_primary ?? "+977 970-5047000";
  const phone2 = settings?.contact_phone_secondary ?? "+977 982-0757417";
  const email = settings?.contact_email ?? "info@zaaoufoods.com";
  const address = settings?.contact_address ?? "Itahari, Sunsari, Nepal";

  const socials: { url: string | null | undefined; icon: React.ComponentType<{ className?: string }>; label: string }[] = [
    { url: settings?.social_facebook_url, icon: FacebookIcon, label: "Facebook" },
    { url: settings?.social_instagram_url, icon: InstagramIcon, label: "Instagram" },
    { url: settings?.social_tiktok_url, icon: Music2, label: "TikTok" },
    { url: settings?.social_youtube_url, icon: YoutubeIcon, label: "YouTube" },
    { url: settings?.social_twitter_url, icon: TwitterIcon, label: "Twitter / X" },
    { url: settings?.social_linkedin_url, icon: LinkedinIcon, label: "LinkedIn" },
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
              <li><Link to="/support" className="transition-colors hover:text-primary">Help Centre</Link></li>
              <li><Link to="/faq" className="transition-colors hover:text-primary">FAQs</Link></li>
              <li><Link to="/privacy" className="transition-colors hover:text-primary">Privacy Policy</Link></li>
              <li><Link to="/support" className="transition-colors hover:text-primary">Contact Us</Link></li>
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
            Design, develop &amp; manage by{" "}
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
