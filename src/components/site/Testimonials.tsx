import { Star, Quote } from "lucide-react";

const reviews = [
  {
    name: "Sushmita Karki",
    role: "Itahari-3",
    stars: 5,
    text: "Zaaou Food has changed our weekends! The momos arrive piping hot every single time. Delivery is unbelievably fast.",
  },
  {
    name: "Bibek Rai",
    role: "Itahari-7",
    stars: 5,
    text: "Best food app in Itahari, hands down. Smooth checkout, great offers, and the rider tracking is super accurate.",
  },
  {
    name: "Nirajan Limbu",
    role: "Itahari-9",
    stars: 5,
    text: "I order dal bhat from Annapurna almost every other day. Quality is consistent and the support team genuinely cares.",
  },
  {
    name: "Asmita Shrestha",
    role: "Itahari-1",
    stars: 5,
    text: "Late night cravings, sorted! Wide selection, fair prices, and the packaging always feels premium and clean.",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-20 lg:py-28 bg-gradient-warm">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="max-w-2xl mb-14">
          <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">Loved in Itahari</p>
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight">
            What our customers <span className="italic font-light">are saying</span>.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {reviews.map((r) => (
            <figure
              key={r.name}
              className="bg-card rounded-3xl p-7 shadow-card border border-border/60 hover:-translate-y-1 transition-transform relative"
            >
              <Quote className="h-8 w-8 text-primary/20 mb-3" />
              <div className="flex gap-0.5 text-yellow-500 mb-3">
                {[...Array(r.stars)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <blockquote className="text-foreground/85 leading-relaxed text-sm mb-5">
                "{r.text}"
              </blockquote>
              <figcaption className="flex items-center gap-3 pt-4 border-t border-border">
                <div className="h-10 w-10 rounded-full bg-gradient-primary text-primary-foreground grid place-items-center font-bold">
                  {r.name[0]}
                </div>
                <div>
                  <p className="font-bold text-sm leading-tight">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
