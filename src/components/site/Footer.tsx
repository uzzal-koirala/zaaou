import { Mail, Phone, MapPin, Send, Camera, MessageCircle } from "lucide-react";
import { Link } from "@tanstack/react-router";
import logo from "@/assets/zaaou-logo.png";

const Facebook = MessageCircle;
const Instagram = Camera;
const Twitter = Send;

const CURRENT_YEAR = 2026;

export function Footer() {
  return (
    <footer className="bg-foreground text-background pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-10 border-b border-white/10 pb-12 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="mb-4 flex items-center gap-2.5">
              <img src={logo} alt="Zaaou Food" className="h-11 w-11 rounded-xl" />
              <span className="font-display text-xl font-extrabold">Zaaou food</span>
            </div>
            <p className="text-sm leading-relaxed text-background/70">
              Itahari&apos;s favourite food delivery — connecting you to the city&apos;s best kitchens.
            </p>
            <div className="mt-5 flex gap-3">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="grid h-9 w-9 place-items-center rounded-full bg-white/10 transition-colors hover:bg-primary"
                  aria-label="Social link"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
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
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-display font-bold">Get in touch</h4>
            <ul className="space-y-3 text-sm text-background/70">
              <li className="flex items-center gap-2.5"><MapPin className="h-4 w-4 shrink-0 text-primary" /><span>Itahari, Sunsari, Nepal</span></li>
              <li className="flex items-center gap-2.5"><Phone className="h-4 w-4 shrink-0 text-primary" /><span>+977 980-0000000</span></li>
              <li className="flex items-center gap-2.5"><Mail className="h-4 w-4 shrink-0 text-primary" /><span>hello@zaaoufood.com</span></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-8 text-xs text-background/60">
          <p>© {CURRENT_YEAR} Zaaou Food. All rights reserved.</p>
          <p>Made with ♥ in Itahari</p>
        </div>
      </div>
    </footer>
  );
}
