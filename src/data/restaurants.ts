import momos from "@/assets/dish-momos.jpg";
import burger from "@/assets/dish-burger.jpg";
import pizza from "@/assets/dish-pizza.jpg";
import thali from "@/assets/dish-thali.jpg";
import purwanchalCafe from "@/assets/restaurants/purwanchal-cafe.jpg";
import royalBiryani from "@/assets/restaurants/royal-biryani.jpg";
import bahattarCafe from "@/assets/restaurants/bahattar-cafe.jpg";
import pauroti from "@/assets/restaurants/pauroti.jpg";

export type Restaurant = {
  id: string;
  img: string;
  name: string;
  tag: string;
  cuisines: string[];
  rating: number;
  reviews: number;
  time: string;
  price: string;
  area: string;
  featured?: boolean;
};

export const restaurants: Restaurant[] = [
  {
    id: "purwanchal-cafe",
    img: purwanchalCafe,
    name: "Purwanchal Cafe",
    tag: "Thakali Food · Khana",
    cuisines: ["Thakali", "Nepali", "Cafe"],
    rating: 4.9,
    reviews: 312,
    time: "25-35 min",
    price: "Rs. 250+",
    area: "Itahari-1, Pipal Chowk",
    featured: true,
  },
  {
    id: "royal-biryani",
    img: royalBiryani,
    name: "Royal Biryani",
    tag: "Biryani · Chicken Specialists",
    cuisines: ["Biryani", "Chicken", "Indian"],
    rating: 4.8,
    reviews: 524,
    time: "25-35 min",
    price: "Rs. 280+",
    area: "Itahari, Dharan Road",
    featured: true,
  },
  {
    id: "bahattar-cafe",
    img: bahattarCafe,
    name: "Bahattar Restro & Lounge",
    tag: "Cafe · Coffee · Cakes",
    cuisines: ["Coffee", "Tea", "Cakes", "Cafe"],
    rating: 4.7,
    reviews: 348,
    time: "20-30 min",
    price: "Rs. 200+",
    area: "Itahari, Main Road",
    featured: true,
  },
  {
    id: "pauroti",
    img: pauroti,
    name: "Pauroti",
    tag: "Bakery · Cakes · Pastries",
    cuisines: ["Cakes", "Pastries", "Coffee", "Bakery"],
    rating: 4.8,
    reviews: 286,
    time: "20-30 min",
    price: "Rs. 180+",
    area: "Itahari, Main Road",
    featured: true,
  },
  {
    id: "himalayan-momo",
    img: momos,
    name: "Himalayan Momo House",
    tag: "Nepali · Tibetan",
    cuisines: ["Momo", "Nepali", "Tibetan"],
    rating: 4.8,
    reviews: 980,
    time: "20-30 min",
    price: "Rs. 180+",
    area: "Dharan Road",
  },
  {
    id: "burger-junction",
    img: burger,
    name: "Burger Junction",
    tag: "Burgers · Fast Food",
    cuisines: ["Burger", "Fast Food"],
    rating: 4.7,
    reviews: 612,
    time: "15-25 min",
    price: "Rs. 220+",
    area: "Halgada",
  },
  {
    id: "forno-pizzeria",
    img: pizza,
    name: "Forno Pizzeria",
    tag: "Italian · Pizza",
    cuisines: ["Pizza", "Italian"],
    rating: 4.8,
    reviews: 745,
    time: "30-40 min",
    price: "Rs. 450+",
    area: "Koshi Highway",
  },
  {
    id: "annapurna-bhojanalaya",
    img: thali,
    name: "Annapurna Bhojanalaya",
    tag: "Traditional Thali",
    cuisines: ["Thali", "Nepali"],
    rating: 4.9,
    reviews: 421,
    time: "25-35 min",
    price: "Rs. 280+",
    area: "Itahari Chowk",
  },
  {
    id: "munch-food-service",
    img: pizza,
    name: "Munch Food Service",
    tag: "Pizza · Snacks",
    cuisines: ["Pizza", "Snacks", "Fast Food"],
    rating: 4.6,
    reviews: 287,
    time: "20-30 min",
    price: "Rs. 350+",
    area: "Itahari-4",
  },
  {
    id: "the-momo-hub",
    img: momos,
    name: "The Mo:Mo Hub",
    tag: "Momo Specialists",
    cuisines: ["Momo", "Nepali"],
    rating: 4.5,
    reviews: 198,
    time: "20-30 min",
    price: "Rs. 150+",
    area: "Itahari-Dharan Road",
  },
];

export const cuisineFilters = [
  "All",
  "Thakali",
  "Biryani",
  "Chicken",
  "Coffee",
  "Cakes",
  "Momo",
  "Pizza",
  "Burger",
  "Thali",
  "Cafe",
];
