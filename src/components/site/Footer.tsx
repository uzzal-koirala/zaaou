import { Mail, Phone, MapPin, Send, Camera, MessageCircle } from "lucide-react";
import logo from "@/assets/zaaou-logo.png";

const Facebook = MessageCircle;
const Instagram = Camera;
const Twitter = Send;

export function Footer() {
  return (
    <footer className="bg-foreground text-background pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <img src={logo} alt="Zaaou Food" className="h-11 w-11 rounded-xl" />
              <span className="font-display font-extrabold text-xl">Zaaou food</span>
            </div>
            <p className="text-background/70 text-sm leading-relaxed">
              Itahari's favourite food delivery — connecting you to the city's best kitchens.
            </p>
            <div className="flex gap-3 mt-5">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="h-9 w-9 rounded-full bg-white/10 hover:bg-primary grid place-items-center transition-colors">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display font-bold mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm text-background/70">
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Partner with us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Become a Rider</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold mb-4">Support</h4>
            <ul className="space-y-2.5 text-sm text-background/70">
              <li><a href="#" className="hover:text-primary transition-colors">Help Centre</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">FAQs</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold mb-4">Get in touch</h4>
            <ul className="space-y-3 text-sm text-background/70">
              <li className="flex items-center gap-2.5"><MapPin className="h-4 w-4 text-primary shrink-0" /> Itahari, Sunsari, Nepal</li>
              <li className="flex items-center gap-2.5"><Phone className="h-4 w-4 text-primary shrink-0" /> +977 980-0000000</li>
              <li className="flex items-center gap-2.5"><Mail className="h-4 w-4 text-primary shrink-0" /> hello@zaaoufood.com</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-wrap items-center justify-between gap-3 text-xs text-background/60">
          <p>© {new Date().getFullYear()} Zaaou Food. All rights reserved.</p>
          <p>Made with ♥ in Itahari</p>
        </div>
      </div>
    </footer>
  );
}
