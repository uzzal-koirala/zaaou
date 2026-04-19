import { Search, ShoppingBag, Bike } from "lucide-react";

const steps = [
  { icon: Search, title: "Pick a restaurant", desc: "Browse hundreds of dishes from Itahari's top kitchens." },
  { icon: ShoppingBag, title: "Place your order", desc: "Customise, add to cart, and pay your way — quick & easy." },
  { icon: Bike, title: "Get it delivered", desc: "Track your rider live until your food arrives, hot & fresh." },
];

export function HowItWorks() {
  return (
    <section id="how" className="py-20 lg:py-28 bg-background">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">How it works</p>
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight">
            Three taps to a <span className="text-gradient-primary">delicious meal</span>.
          </h2>
        </div>

        <div className="relative grid md:grid-cols-3 gap-8">
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px border-t-2 border-dashed border-primary/30" />
          {steps.map((s, i) => (
            <div key={s.title} className="relative text-center">
              <div className="relative mx-auto h-24 w-24 rounded-3xl bg-gradient-primary grid place-items-center text-primary-foreground shadow-glow mb-6">
                <s.icon className="h-10 w-10" />
                <span className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-card text-primary border-2 border-primary font-display font-extrabold grid place-items-center text-sm shadow-card">
                  {i + 1}
                </span>
              </div>
              <h3 className="font-bold text-xl mb-2">{s.title}</h3>
              <p className="text-muted-foreground max-w-xs mx-auto leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
