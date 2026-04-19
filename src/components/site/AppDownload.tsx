import { Check, QrCode, Sparkles, Star } from "lucide-react";
import { AppStoreBadge, GooglePlayBadge } from "./StoreBadges";
import screenHome from "@/assets/app/screen-home.png";
import screenStores from "@/assets/app/screen-stores.png";
import screenProduct from "@/assets/app/screen-product.png";
import zaaouQr from "@/assets/zaaou-qr.png";

const perks = [
  "Browse 100+ restaurants by category",
  "Live order tracking, every step of the way",
  "Pay with eSewa, Khalti, card or cash",
  "Save favourites & reorder in one tap",
];

const screens = [
  {
    src: screenHome,
    alt: "Zaaou Food home screen with categories and best reviewed items",
    rotate: "lg:-rotate-[8deg]",
    offset: "lg:translate-y-8 lg:translate-x-2",
    z: "z-10",
  },
  {
    src: screenProduct,
    alt: "Zaaou Food product detail screen with Add to Cart",
    rotate: "rotate-0",
    offset: "lg:-translate-y-4",
    z: "z-20",
  },
  {
    src: screenStores,
    alt: "Zaaou Food best stores nearby listing",
    rotate: "lg:rotate-[8deg]",
    offset: "lg:translate-y-8 lg:-translate-x-2",
    z: "z-10",
  },
];

export function AppDownload() {
  return (
    <section id="app" className="relative py-20 lg:py-28 bg-background overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="relative bg-gradient-hero rounded-[2.5rem] overflow-hidden text-primary-foreground p-8 sm:p-12 lg:p-16 shadow-glow">
          {/* Background ornaments */}
          <div aria-hidden className="absolute -top-32 -right-24 h-[28rem] w-[28rem] rounded-full bg-white/15 blur-3xl" />
          <div aria-hidden className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-yellow-300/15 blur-3xl" />
          <div aria-hidden className="absolute inset-0 opacity-[0.07]" style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }} />
          {/* Spinning seal */}
          <div aria-hidden className="absolute -top-10 -left-10 hidden lg:block">
            <div className="animate-spin-slow h-32 w-32 rounded-full border border-white/20 grid place-items-center">
              <Sparkles className="h-6 w-6 text-white/60" />
            </div>
          </div>

          <div className="relative grid lg:grid-cols-2 gap-12 lg:gap-10 items-center">
            {/* Copy */}
            <div className="space-y-7">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-4 py-1.5 text-xs font-bold uppercase tracking-widest border border-white/20">
                <Sparkles className="h-3.5 w-3.5" />
                The Zaaou App
              </div>

              <h2 className="font-display text-4xl sm:text-5xl lg:text-[4.25rem] font-extrabold tracking-tight leading-[1.02]">
                Your next meal is{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 italic font-light">one tap</span>
                  <span aria-hidden className="absolute left-0 right-0 bottom-1 h-3 bg-yellow-300/40 rounded-md -z-0" />
                </span>{" "}
                <span className="text-yellow-200">away.</span>
              </h2>

              <p className="text-white/85 text-lg max-w-lg leading-relaxed">
                Download the Zaaou Food app - Itahari's tastiest kitchens,
                live tracking and exclusive offers, right in your pocket.
              </p>

              <ul className="grid sm:grid-cols-2 gap-3 pt-1">
                {perks.map((p) => (
                  <li key={p} className="flex items-start gap-2.5 text-white/95 text-sm">
                    <span className="mt-0.5 grid place-items-center h-5 w-5 rounded-full bg-yellow-300 text-foreground shrink-0">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap items-center gap-4 pt-3">
                <div className="flex flex-col gap-3">
                  <a
                    href="https://apps.apple.com/np/app/zaaou-sewa/id6479515378"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Download on the App Store"
                    className="inline-block rounded-xl overflow-hidden hover:scale-[1.04] transition-transform shadow-soft"
                  >
                    <AppStoreBadge className="h-12 w-auto" />
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.zaaou24x7.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Get it on Google Play"
                    className="inline-block rounded-xl overflow-hidden hover:scale-[1.04] transition-transform shadow-soft"
                  >
                    <GooglePlayBadge className="h-12 w-auto" />
                  </a>
                </div>

                <div className="relative flex items-center gap-3 bg-card text-foreground rounded-2xl p-3 shadow-card ring-1 ring-white/10">
                  <div className="absolute -top-2 -right-2 bg-yellow-300 text-foreground text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full shadow">
                    New
                  </div>
                  <img
                    src={zaaouQr}
                    alt="Scan QR code to download Zaaou Food app"
                    width={120}
                    height={120}
                    loading="lazy"
                    className="h-24 w-24 rounded-lg"
                  />
                  <div className="pr-2 max-w-[10rem]">
                    <div className="inline-flex items-center gap-1.5 text-primary text-[10px] font-bold uppercase tracking-wider mb-1">
                      <QrCode className="h-3 w-3" />
                      Quick Install
                    </div>
                    <p className="font-display font-extrabold text-sm leading-tight">
                      Scan to download Zaaou Food
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 pt-4">
                <div>
                  <p className="font-display font-extrabold text-3xl">50K+</p>
                  <p className="text-xs text-white/75 uppercase tracking-wider">Downloads</p>
                </div>
                <div className="h-10 w-px bg-white/25" />
                <div>
                  <p className="font-display font-extrabold text-3xl flex items-center gap-1">
                    4.9 <Star className="h-5 w-5 fill-yellow-300 text-yellow-300" />
                  </p>
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
            <div className="relative">
              {/* Glow behind phones */}
              <div aria-hidden className="absolute inset-0 m-auto h-80 w-80 rounded-full bg-yellow-300/30 blur-3xl" />

              <div className="relative grid grid-cols-3 gap-3 sm:gap-4 max-w-md mx-auto lg:max-w-none lg:mx-0">
                {screens.map((s, i) => (
                  <div
                    key={i}
                    className={`relative rounded-[1.5rem] bg-foreground p-1.5 shadow-2xl ring-1 ring-white/10 transition-all hover:translate-y-[-8px] hover:scale-[1.02] ${s.rotate} ${s.offset} ${s.z}`}
                  >
                    {/* Notch */}
                    <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-20 h-3 w-12 rounded-full bg-foreground/90" />
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

              {/* Floating chips */}
              <div className="absolute -left-2 sm:-left-6 top-6 bg-card text-foreground rounded-2xl shadow-card px-3.5 py-2.5 flex items-center gap-2.5 z-30">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
                </span>
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-muted-foreground font-bold leading-none">
                    Live order
                  </p>
                  <p className="font-bold text-xs leading-tight mt-0.5">Rider 2 min away</p>
                </div>
              </div>

              <div className="absolute -right-2 sm:-right-4 bottom-8 bg-card text-foreground rounded-2xl shadow-card px-3.5 py-2.5 z-30">
                <div className="flex items-center gap-1 text-primary mb-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-current" />
                  ))}
                </div>
                <p className="text-[10px] font-bold leading-tight">Loved by 12k+ foodies</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
