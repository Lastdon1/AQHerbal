import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import type { FeaturedProduct } from "@/lib/featured-products";

type Props = {
  products: FeaturedProduct[];
};

export default function FeaturedProducts({
  products,
}: Props) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      {/* =====================================================
          SECTION HEADER
      ====================================================== */}

      <div className="relative mb-10 text-center">
        <h2 className="text-3xl font-bold text-green-800">
          منتخب مصنوعات
        </h2>

        <p className="mt-1 text-lg text-gray-700">
          Featured Products
        </p>

        {/* Desktop View All */}

        <Link
          href="/shop"
          className="absolute right-0 top-1/2 hidden -translate-y-1/2 text-sm font-semibold text-green-700 transition hover:text-green-800 sm:inline-flex"
        >
          View All Products →
        </Link>
      </div>

      {/* =====================================================
          PRODUCTS
      ====================================================== */}

      {products.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white px-6 py-12 text-center">
          <p className="text-sm text-gray-500">
            No products available.
          </p>
        </div>
      ) : (
        <>
          {/* =================================================
              MOBILE
              Horizontal swipe
          ================================================== */}

          <div
            className="
              flex
              gap-4
              overflow-x-auto
              pb-2
              touch-pan-x
              [-ms-overflow-style:none]
              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
              sm:hidden
            "
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="
                  w-[calc((100vw-64px)/2)]
                  min-w-[145px]
                  max-w-[170px]
                  shrink-0
                "
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* =================================================
              TABLET / DESKTOP
          ================================================== */}

          <div
            className="
              hidden
              sm:grid
              sm:grid-cols-2
              sm:gap-6
              lg:grid-cols-4
            "
          >
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        </>
      )}

      {/* =====================================================
          MOBILE VIEW ALL
      ====================================================== */}

      <div className="mt-8 text-center sm:hidden">
        <Link
          href="/shop"
          className="
            inline-flex
            items-center
            justify-center
            rounded-full
            border
            border-green-700
            px-6
            py-3
            text-sm
            font-semibold
            text-green-700
            transition
            hover:bg-green-700
            hover:text-white
          "
        >
          View All Products
        </Link>
      </div>
    </section>
  );
}