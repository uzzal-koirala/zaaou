import { Star, Clock } from "lucide-react";
import momos from "@/assets/dish-momos.jpg";
import burger from "@/assets/dish-burger.jpg";
import pizza from "@/assets/dish-pizza.jpg";
import purwanchalCafe from "@/assets/restaurants/purwanchal-cafe.jpg";

const restaurants = [
  { img: purwanchalCafe, name: "Purwanchal Cafe", tag: "Thakali Food · Khana", rating: 4.9, time: "25-35 min", price: "Rs. 250+" },
  { img: momos, name: "Himalayan Momo House", tag: "Nepali · Tibetan", rating: 4.8, time: "20-30 min", price: "Rs. 180+" },
  { img: burger, name: "Burger Junction", tag: "Burgers · Fast Food", rating: 4.7, time: "15-25 min", price: "Rs. 220+" },
  { img: pizza, name: "Forno Pizzeria", tag: "Italian · Pizza", rating: 4.8, time: "30-40 min", price: "Rs. 450+" },
];

export function Restaurants() {
  return (
    <section id="restaurants" className="py-20 lg:py-28 bg-cream">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div className="max-w-2xl">
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">Featured Kitchens</p>
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight">
              Itahari's most <span className="italic font-light">loved</span> spots.
            </h2>
          </div>
          <a href="#app" className="text-primary font-semibold hover:underline underline-offset-4">
            See all restaurants →
          </a>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {restaurants.map((r) => (
            <div
              key={r.name}
              className="group bg-card rounded-3xl overflow-hidden shadow-card hover:shadow-glow transition-all hover:-translate-y-1.5 border border-border/60"
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={r.img}
                  alt={r.name}
                  width={800}
                  height={800}
                  loading="lazy"
                  className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur rounded-full px-2.5 py-1 flex items-center gap-1 text-xs font-bold">
                  <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                  {r.rating}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg leading-tight">{r.name}</h3>
                <p className="text-muted-foreground text-sm mt-1">{r.tag}</p>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    {r.time}
                  </span>
                  <span className="text-xs font-bold text-primary">{r.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
