import { Apple, Smartphone } from "lucide-react";
import appMockup from "@/assets/app-mockup.png";

export function AppDownload() {
  return (
    <section id="app" className="py-20 lg:py-28 bg-background overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="relative bg-gradient-hero rounded-[2.5rem] overflow-hidden text-primary-foreground p-8 sm:p-12 lg:p-16 grid lg:grid-cols-2 gap-10 items-center">
          <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-white/15 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-yellow-300/15 blur-3xl" />

          <div className="relative space-y-6">
            <p className="font-semibold text-sm uppercase tracking-widest text-white/80">The Zaaou App</p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05]">
              Hungry? Your next meal is <span className="italic font-light">one tap away.</span>
            </h2>
            <p className="text-white/85 text-lg max-w-lg leading-relaxed">
              Download the Zaaou Food app — track orders live, save favourites and unlock exclusive offers in Itahari.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="#"
                className="group inline-flex items-center gap-3 bg-foreground text-background rounded-2xl px-6 py-3.5 hover:scale-[1.03] transition-transform"
              >
                <Apple className="h-7 w-7" />
                <span className="text-left">
                  <span className="block text-[10px] uppercase tracking-wider opacity-70">Download on the</span>
                  <span className="block font-bold leading-tight">App Store</span>
                </span>
              </a>
              <a
                href="#"
                className="group inline-flex items-center gap-3 bg-foreground text-background rounded-2xl px-6 py-3.5 hover:scale-[1.03] transition-transform"
              >
                <Smartphone className="h-7 w-7" />
                <span className="text-left">
                  <span className="block text-[10px] uppercase tracking-wider opacity-70">Get it on</span>
                  <span className="block font-bold leading-tight">Google Play</span>
                </span>
              </a>
            </div>

            <div className="flex items-center gap-6 pt-4">
              <div>
                <p className="font-display font-extrabold text-3xl">50K+</p>
                <p className="text-xs text-white/75 uppercase tracking-wider">Downloads</p>
              </div>
              <div className="h-10 w-px bg-white/25" />
              <div>
                <p className="font-display font-extrabold text-3xl">4.9★</p>
                <p className="text-xs text-white/75 uppercase tracking-wider">App Rating</p>
              </div>
              <div className="h-10 w-px bg-white/25" />
              <div>
                <p className="font-display font-extrabold text-3xl">100+</p>
                <p className="text-xs text-white/75 uppercase tracking-wider">Restaurants</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <img
              src={appMockup}
              alt="Zaaou Food mobile app preview"
              width={800}
              height={1200}
              loading="lazy"
              className="relative z-10 max-w-sm mx-auto animate-float drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
