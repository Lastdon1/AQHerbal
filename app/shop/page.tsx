import PageHeader from "@/components/layout/PageHeader";
import ProductCard from "@/components/product/ProductCard";
import { products } from "@/constants/products";

export default function ShopPage() {
  return (
    <>
      <PageHeader
        title="Shop"
        description="Discover premium herbal medicines, natural foods, and wellness products inspired by Tibb-e-Nabawi (ﷺ)."
      />

      <main className="mx-auto max-w-7xl px-6 py-16">
        <div
          className="
            grid
            gap-8
            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4
          "
        >
          {products.map((product) => (
            <ProductCard
              key={product.id}
              slug={product.slug}
              name={product.name}
              image={product.image}
              price={product.price}
              description={product.description}
            />
          ))}
        </div>
      </main>
    </>
  );
}