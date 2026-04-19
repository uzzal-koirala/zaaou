import { Apple, Smartphone, Check } from "lucide-react";
import screenHome from "@/assets/app/screen-home.png";
import screenStores from "@/assets/app/screen-stores.png";
import screenProduct from "@/assets/app/screen-product.png";

const perks = [
  "Browse 100+ restaurants by category",
  "Live order tracking, every step of the way",
  "Pay with eSewa, Khalti, card or cash",
  "Save favourites & reorder in one tap",
];

const screens = [
  { src: screenHome, alt: "Zaaou Food home screen with categories and best reviewed items", rotate: "-rotate-6", offset: "lg:-translate-y-6" },
  { src: screenProduct, alt: "Zaaou Food product detail screen with Add to Cart", rotate: "rotate-0", offset: "lg:translate-y-6 z-10" },
  { src: screenStores, alt: "Zaaou Food best stores nearby listing", rotate: "rotate-6", offset: "lg:-translate-y-6" },
];

export function AppDownload() {
  return (
    <section id="app" className="py-20 lg:py-28 bg-background overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="relative bg-gradient-hero rounded-[2.5rem] overflow-hidden text-primary-foreground p-8 sm:p-12 lg:p-16">
          <div aria-hidden className="absolute top-0 right-0 h-72 w-72 rounded-full bg-white/15 blur-3xl" />
          <div aria-hidden className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-yellow-300/15 blur-3xl" />

          <div className="relative grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Copy */}
            <div className="space-y-6">
              <p className="font-semibold text-sm uppercase tracking-widest text-white/80">
                The Zaaou App
              </p>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05]">
                Your next meal is{" "}
                <span className="italic font-light">one tap away.</span>
              </h2>
              <p className="text-white/85 text-lg max-w-lg leading-relaxed">
                Download the Zaaou Food app — Itahari's tastiest kitchens,
                live tracking and exclusive offers, right in your pocket.
              </p>

              <ul className="grid sm:grid-cols-2 gap-3 pt-2">
                {perks.map((p) => (
                  <li key={p} className="flex items-start gap-2.5 text-white/90 text-sm">
                    <span className="mt-0.5 grid place-items-center h-5 w-5 rounded-full bg-white/20 shrink-0">
                      <Check className="h-3 w-3" />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-3 pt-3">
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

            {/* Three phone screens */}
            <div className="relative grid grid-cols-3 gap-3 sm:gap-4 max-w-md mx-auto lg:max-w-none lg:mx-0">
              {screens.map((s, i) => (
                <div
                  key={i}
                  className={`relative rounded-[1.5rem] bg-foreground p-1.5 shadow-2xl ring-1 ring-white/10 transition-transform hover:translate-y-[-6px] ${s.rotate} ${s.offset}`}
                >
                  <div className="relative aspect-[9/19] overflow-hidden rounded-[1.25rem] bg-card">
                    <img
                      src={s.src}
                      alt={s.alt}
                      width={886}
                      height={1920}
                      loading="lazy"
                      className="h-full w-full object-cover object-top"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
