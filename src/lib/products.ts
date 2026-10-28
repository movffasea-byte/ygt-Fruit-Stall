import { createClient } from "@supabase/supabase-js";
import { products as fallbackProducts, type Product } from "@/data/products";

type ProductRow = {
  id: string;
  name: string;
  category: Product["category"];
  description: string | null;
  image: string | null;
  available: boolean;
  variants: Product["variants"];
};

// Public, read-only browsing of the shop: no login cookies needed.
// If the database can't be reached, the shop falls back to the list in src/data/products.ts.
export async function getProducts(): Promise<Product[]> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    );
    const { data, error } = await supabase.from("products").select("*").order("sort");
    if (error || !data || data.length === 0) return fallbackProducts;
    return (data as ProductRow[]).map((r) => ({
      id: r.id,
      name: r.name,
      category: r.category,
      description: r.description ?? undefined,
      image: r.image ?? undefined,
      available: r.available,
      variants: r.variants,
    }));
  } catch {
    return fallbackProducts;
  }
}
