export type Variant = {
  size: string;
  price: number | null; // null = price on request
  fromPrice?: boolean; // shown as "from ₦x" (customised blends)
};

export type Product = {
  id: string;
  name: string;
  category: CategoryId;
  image?: string; // path under /public; products without one show the logo
  description?: string;
  variants: Variant[];
  available: boolean;
};

export const categories = [
  { id: "juices", label: "Fresh Juices" },
  { id: "green", label: "Green Juices" },
  { id: "sugarcane", label: "Sugarcane Juices" },
  { id: "yoghurt", label: "Yoghurt" },
  { id: "granola", label: "Granola & Flakes" },
  { id: "packs", label: "Packs" },
] as const;

export type CategoryId = (typeof categories)[number]["id"];

export const products: Product[] = [
  // Fresh juices, 500ml
  { id: "tropical-sunshine", image: "/products/tropical-sunshine.jpg", name: "Tropical Sunshine", category: "juices", description: "Ginger, turmeric, apple, pineapple, orange", variants: [{ size: "500ml", price: 3300 }], available: true },
  { id: "magical-splash", image: "/products/magical-splash.jpg", name: "Magical Splash", category: "juices", description: "Carrot, pineapple, apple", variants: [{ size: "500ml", price: 3300 }], available: true },
  { id: "the-quencher", image: "/products/the-quencher.jpg", name: "The Quencher", category: "juices", description: "Watermelon, mint, apple, lemon", variants: [{ size: "500ml", price: 3000 }], available: true },
  { id: "beetbliss", image: "/products/beetbliss.jpg", name: "Beetbliss", category: "juices", description: "Beetroot, ginger, carrot, pineapple", variants: [{ size: "500ml", price: 3500 }], available: true },
  { id: "orange", name: "Orange", category: "juices", description: "Oranges only", variants: [{ size: "500ml", price: 3000 }], available: true },
  { id: "pineapple-crush", name: "Pineapple Crush", category: "juices", description: "Pineapple, ginger", variants: [{ size: "500ml", price: 3500 }], available: true },

  // Green juices, 500ml
  { id: "green-element", image: "/products/green-element.jpg", name: "Green Element", category: "green", description: "Celery, cucumber, apple, kale, lemon", variants: [{ size: "500ml", price: 3600 }], available: true },
  { id: "toxin-killer", name: "Toxin Killer", category: "green", description: "Cucumber, apple, spinach, lettuce, lemon", variants: [{ size: "500ml", price: 3600 }], available: true },
  { id: "go-detox", image: "/products/go-detox.jpg", name: "Go-Detox", category: "green", description: "Pumpkin leaves, pineapple, cucumber, ginger", variants: [{ size: "500ml", price: 3800 }], available: true },
  { id: "the-cleanse", image: "/products/the-cleanse.jpg", name: "The Cleanse", category: "green", description: "Parsley, cucumber, lemon, orange", variants: [{ size: "500ml", price: 3500 }], available: true },
  { id: "customized-juice", name: "Customised Juice", category: "green", description: "Tell us your mood and we'll press your blend fresh. Add beetroot, carrot, celery, pineapple or apple for an extra kick.", variants: [{ size: "500ml", price: 3500, fromPrice: true }], available: true },

  // Sugarcane juices
  { id: "raw-sugarcane", name: "Raw Sugarcane", category: "sugarcane", description: "Sugarcane, lemon", variants: [{ size: "350ml", price: 1800 }, { size: "500ml", price: 1800 }, { size: "1 litre", price: 3500 }], available: true },
  { id: "sugarcane-lemonade", name: "Sugarcane Lemonade", category: "sugarcane", description: "Sugarcane, lemon, ginger", variants: [{ size: "350ml", price: 2000 }, { size: "500ml", price: 2500 }, { size: "1 litre", price: 4000 }], available: true },
  { id: "mint-sugarcane", name: "Mint Sugarcane", category: "sugarcane", description: "Sugarcane, lemon, mint", variants: [{ size: "350ml", price: 2000 }, { size: "500ml", price: 2500 }, { size: "1 litre", price: 4000 }], available: true },

  // Yoghurt
  { id: "greek-yoghurt", image: "/products/greek-yoghurt.jpg", name: "Unsweetened Greek Yoghurt", category: "yoghurt", description: "Creamy, thick, plain", variants: [{ size: "500ml", price: 4500 }, { size: "1 litre", price: 8800 }], available: true },
  { id: "drinking-yoghurt", name: "Drinking Yoghurt (Vanilla)", category: "yoghurt", variants: [{ size: "Bottle", price: null }], available: true },
  { id: "chiaseeds-parfait", name: "Chiaseeds Parfait", category: "yoghurt", description: "Greek yoghurt, chiaseeds, apple, pumpkin seeds, almonds, coconut", variants: [{ size: "500ml", price: null }], available: false },
  { id: "chiaseeds-pudding", name: "Chiaseeds Pudding", category: "yoghurt", description: "Chiaseeds, fruits, nuts", variants: [{ size: "500ml", price: null }], available: false },
  { id: "granola-parfait", name: "Granola Parfait", category: "yoghurt", description: "Greek yoghurt, granola, fruits, nuts", variants: [{ size: "500ml", price: null }], available: false },

  // Granola & flakes
  // Prices for 100g and 200g come from the WhatsApp catalogue; the printed menu shows ₦4,000 for 200g.
  { id: "granola", image: "/products/granola.jpg", name: "Granola", category: "granola", description: "Almonds, seeds and raisins with a hint of honey. No refined sugar.", variants: [{ size: "100g", price: 2800 }, { size: "200g", price: 4800 }, { size: "400g", price: null }], available: true },
  { id: "coconut-flakes", image: "/products/coconut-flakes.jpg", name: "Coconut Flakes", category: "granola", description: "Nature's crunchy goodness. Great with oats, parfait, yoghurt and salads.", variants: [{ size: "Pack", price: null }], available: true },

  // Packs
  { id: "refreshment-pack", image: "/products/refreshment-pack.jpg", name: "Pack of 6 Sweet Refreshment Juices", category: "packs", description: "Watermelon/pineapple, pineapple orange, orange carrot, cool cucumber, mango, orange", variants: [{ size: "6 x 350ml", price: 15500 }], available: true },
];

export function formatPrice(variant: Variant): string {
  if (variant.price === null) return "Price on request";
  const amount = `₦${variant.price.toLocaleString("en-NG")}`;
  return variant.fromPrice ? `from ${amount}` : amount;
}
