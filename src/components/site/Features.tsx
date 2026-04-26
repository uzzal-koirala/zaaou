import { Award, Rocket, Leaf, Smartphone } from "lucide-react";

const features = [
  { icon: Award, title: "Quality Food", desc: "Hand-picked kitchens, hygiene checked - every single order." },
  { icon: Rocket, title: "Fastest Delivery", desc: "Hot food at your door in 30 minutes, anywhere in Itahari.", featured: true },
  { icon: Leaf, title: "Fresh Food", desc: "Locally sourced, freshly prepared meals from trusted chefs." },
  { icon: Smartphone, title: "Easy To Order", desc: "Order in three taps with eSewa or cash on delivery." },
];

export function Features() {
  return (
    <section className="py-20 lg:py-24 bg-gradient-peach">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className={`group relative rounded-3xl bg-card border border-border p-7 text-center transition-all hover:-translate-y-2 hover:shadow-glow ${
                f.featured ? "shadow-glow lg:-translate-y-4 ring-1 ring-primary/20" : "shadow-card"
              }`}
            >
              <div className="mx-auto mb-5 h-16 w-16 rounded-2xl bg-primary/10 grid place-items-center text-primary group-hover:bg-gradient-primary group-hover:text-primary-foreground transition-colors">
                <f.icon className="h-7 w-7" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-foreground">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">{f.desc}</p>
              <a
                href="#how"
                className={`inline-block text-sm font-semibold transition-colors ${
                  f.featured ? "text-primary" : "text-foreground/70 hover:text-primary"
                }`}
              >
                Learn More
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
