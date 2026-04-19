import { Bike, ShieldCheck, UtensilsCrossed, Wallet } from "lucide-react";

const features = [
  { icon: Bike, title: "Lightning Delivery", desc: "Hot food at your door in 30 minutes — guaranteed." },
  { icon: UtensilsCrossed, title: "Best Restaurants", desc: "Hand-picked kitchens across Itahari, all in one app." },
  { icon: Wallet, title: "Easy Payments", desc: "Pay with eSewa, Khalti, cards or cash on delivery." },
  { icon: ShieldCheck, title: "Quality You Trust", desc: "Sealed packaging, hygiene checked, every single order." },
];

export function Features() {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="max-w-2xl mb-14">
          <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">Why Zaaou</p>
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight">
            Built for hungry <span className="text-gradient-primary">Itaharians</span>.
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className="group p-7 rounded-3xl bg-card border border-border hover:border-primary/30 hover:-translate-y-1 transition-all shadow-card"
            >
              <div className="h-14 w-14 rounded-2xl bg-gradient-primary grid place-items-center text-primary-foreground mb-5 group-hover:scale-110 transition-transform">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
