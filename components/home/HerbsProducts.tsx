import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import type { HerbsProduct } from "@/lib/herbs-products";

type Props = {
  products: HerbsProduct[];
};

export default function HerbsProducts({
  products,
}: Props) {
  const visibleProducts = products.slice(0, 4);

  return (
    <section
      id="herbs-products"
      className="mx-auto max-w-7xl px-6 py-12"
    >
      {/* =====================================================
          SECTION HEADER
      ====================================================== */}

      <div className="relative mb-10 text-center">
        <h2 className="text-3xl font-bold text-green-800">
          جڑی بوٹیاں
        </h2>

        <p className="mt-1 text-lg text-gray-700">
          Herbs Products
        </p>

        {/* Desktop View All */}

        <Link
          href="/herbs"
          className="
            absolute
            right-0
            top-1/2
            hidden
            -translate-y-1/2
            text-sm
            font-semibold
            text-green-700
            transition-colors
            hover:text-green-800
            sm:inline-flex
          "
        >
          View All Herbs →
        </Link>
      </div>

      {/* =====================================================
          PRODUCTS
      ====================================================== */}

      {visibleProducts.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white px-6 py-12 text-center">
          <p className="text-sm text-gray-500">
            No herbs products available.
          </p>

          <p
            dir="rtl"
            className="mt-1 text-sm text-gray-400"
          >
            ابھی جڑی بوٹیوں کی مصنوعات دستیاب نہیں ہیں۔
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
            {visibleProducts.map((product) => (
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
              Four products
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
            {visibleProducts.map((product) => (
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
          href="/herbs"
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
            transition-colors
            hover:bg-green-700
            hover:text-white
          "
        >
          View All Herbs
        </Link>
      </div>
    </section>
  );
}