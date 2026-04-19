import { Award, MapPin, Wallet, Headphones, Leaf, Zap } from "lucide-react";

const reasons = [
  {
    icon: Award,
    title: "Best Food Delivery Service in Itahari",
    desc: "Trusted by thousands of foodies across Itahari for fast, reliable and tasty deliveries - every single day.",
    accent: "from-primary to-primary-glow",
  },
  {
    icon: Zap,
    title: "Lightning-Fast Delivery",
    desc: "Average delivery in under 30 minutes. Our riders know every shortcut so your food arrives hot and fresh.",
    accent: "from-yellow-400 to-orange-500",
  },
  {
    icon: MapPin,
    title: "100% Local to Itahari",
    desc: "Born and raised in Itahari. We partner with the kitchens you already love - from momos to thakali sets.",
    accent: "from-emerald-400 to-teal-500",
  },
  {
    icon: Wallet,
    title: "Pay Your Way",
    desc: "eSewa, Khalti, IME Pay, cards or good old cash on delivery. No hidden fees, ever.",
    accent: "from-violet-400 to-fuchsia-500",
  },
  {
    icon: Headphones,
    title: "24/7 Local Support",
    desc: "Real humans from Itahari, available any time you need help. We pick up the phone - promise.",
    accent: "from-sky-400 to-blue-500",
  },
  {
    icon: Leaf,
    title: "Fresh, Hygienic, Safe",
    desc: "Every partner kitchen is verified. Tamper-proof packaging and contactless delivery available on every order.",
    accent: "from-lime-400 to-green-500",
  },
];

export function WhyZaaou() {
  return (
    <section id="why" className="relative py-20 lg:py-28 bg-background overflow-hidden">
      {/* Background ornaments */}
      <div aria-hidden className="absolute top-20 -left-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div aria-hidden className="absolute bottom-20 -right-32 h-96 w-96 rounded-full bg-yellow-300/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-14 lg:mb-20">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-4 py-1.5 text-xs font-bold uppercase tracking-widest mb-5">
            <Award className="h-3.5 w-3.5" />
            Why Zaaou Food
          </div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05] text-foreground">
            Itahari's{" "}
            <span className="relative inline-block">
              <span className="relative z-10 italic font-light text-primary">favourite</span>
              <span aria-hidden className="absolute left-0 right-0 bottom-1 h-3 bg-yellow-300/50 rounded-md -z-0" />
            </span>{" "}
            way to eat in.
          </h2>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            From the first tap to the last bite - we obsess over every detail
            so you get the best food, faster, fresher and at a fair price.
          </p>
        </div>

        {/* Reasons grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {reasons.map((r) => (
            <div
              key={r.title}
              className="group relative rounded-2xl bg-card border border-border p-6 lg:p-7 shadow-soft hover:shadow-glow hover:-translate-y-1 transition-all duration-300"
            >
              <div
                aria-hidden
                className={`absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r ${r.accent} opacity-80`}
              />
              <div
                className={`grid place-items-center h-12 w-12 rounded-xl bg-gradient-to-br ${r.accent} text-white shadow-soft mb-5 group-hover:scale-110 transition-transform`}
              >
                <r.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display font-extrabold text-xl text-foreground leading-tight mb-2">
                {r.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {r.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom strip */}
        <div className="mt-14 lg:mt-16 rounded-3xl bg-gradient-hero text-primary-foreground p-8 sm:p-10 lg:p-12 shadow-glow relative overflow-hidden">
          <div aria-hidden className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div aria-hidden className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-yellow-300/20 blur-3xl" />

          <div className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center sm:text-left">
            <div>
              <p className="font-display font-extrabold text-4xl lg:text-5xl">50K+</p>
              <p className="text-sm text-white/80 uppercase tracking-wider mt-1">Happy Customers</p>
            </div>
            <div>
              <p className="font-display font-extrabold text-4xl lg:text-5xl">100+</p>
              <p className="text-sm text-white/80 uppercase tracking-wider mt-1">Partner Restaurants</p>
            </div>
            <div>
              <p className="font-display font-extrabold text-4xl lg:text-5xl">28<span className="text-2xl">min</span></p>
              <p className="text-sm text-white/80 uppercase tracking-wider mt-1">Avg. Delivery Time</p>
            </div>
            <div>
              <p className="font-display font-extrabold text-4xl lg:text-5xl">4.9★</p>
              <p className="text-sm text-white/80 uppercase tracking-wider mt-1">Customer Rating</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
