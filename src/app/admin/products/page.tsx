import { categories, type Variant } from "@/data/products";
import { createClient } from "@/lib/supabase/server";
import { updateProduct } from "../actions";

export const metadata = { title: "Products | Yandaki Fruit Stall" };

type Row = {
  id: string;
  name: string;
  category: string;
  description: string | null;
  available: boolean;
  variants: Variant[];
};

const field = "mt-1 w-full rounded border border-brand-green/40 bg-white px-3 py-2";

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user?.id ?? "").maybeSingle();

  if (profile?.role !== "admin") {
    return <p className="py-8">Only admins can edit products.</p>;
  }

  const { data } = await supabase.from("products").select("*").order("sort");
  const rows = (data ?? []) as Row[];

  return (
    <main className="py-8">
      <h1 className="text-3xl font-bold text-brand-green">Products</h1>
      <p className="mt-1 text-sm text-foreground/70">
        Change prices, descriptions and availability. Leave a price empty to show &quot;Price on request&quot;.
      </p>

      {categories.map((category) => {
        const items = rows.filter((r) => r.category === category.id);
        if (items.length === 0) return null;
        return (
          <section key={category.id} className="mt-8">
            <h2 className="inline-block rounded bg-brand-gold px-3 py-1 text-xl font-bold text-brand-green">
              {category.label}
            </h2>
            <div className="mt-4 space-y-4">
              {items.map((p) => (
                <form
                  key={p.id}
                  action={updateProduct}
                  className="rounded-lg border border-brand-green/20 bg-white p-4 shadow-sm"
                >
                  <input type="hidden" name="id" value={p.id} />
                  <label className="block text-sm font-semibold">
                    Name
                    <input name="name" required defaultValue={p.name} className={field} />
                  </label>
                  <label className="mt-3 block text-sm font-semibold">
                    Description
                    <textarea name="description" rows={2} defaultValue={p.description ?? ""} className={field} />
                  </label>
                  <div className="mt-3 flex flex-wrap gap-4">
                    {p.variants.map((v, i) => (
                      <label key={v.size} className="text-sm font-semibold">
                        {v.size} price (₦)
                        <input
                          name={`price_${i}`}
                          type="number"
                          min={0}
                          step={50}
                          defaultValue={v.price ?? ""}
                          className="mt-1 block w-32 rounded border border-brand-green/40 bg-white px-3 py-2"
                        />
                      </label>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <label className="flex items-center gap-2 text-sm font-semibold">
                      <input type="checkbox" name="available" defaultChecked={p.available} className="h-4 w-4" />
                      Available
                    </label>
                    <button type="submit" className="rounded-full bg-brand-green px-5 py-2 text-sm font-semibold text-white">
                      Save
                    </button>
                  </div>
                </form>
              ))}
            </div>
          </section>
        );
      })}
    </main>
  );
}
