import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";

type Product = {
  id: number;
  name: string;
  nameUrdu: string;
  slug: string;

  category: string;
  healthConcerns?: string[];

  price: number;
  oldPrice?: number | null;

  rating?: number;

  images: string[];
};

type NuskhajatProductsProps = {
  products: Product[];
};

export default function NuskhajatProducts({
  products,
}: NuskhajatProductsProps) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      {/* =====================================================
          SECTION HEADER
      ====================================================== */}

      <div className="relative mb-10 text-center">
        <h2 className="text-3xl font-bold text-green-800">
          نسخہ جات
        </h2>

        <p className="mt-1 text-lg text-gray-700">
          Nuskhajat Products
        </p>

        {/* Desktop View All */}

        <Link
          href="/nuskhajat"
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
          View All Nuskhajat →
        </Link>
      </div>

      {/* =====================================================
          PRODUCTS
      ====================================================== */}

      {products.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white px-6 py-12 text-center">
          <p className="text-sm text-gray-500">
            No Nuskhajat products available.
          </p>

          <p
            dir="rtl"
            className="mt-1 text-sm text-gray-400"
          >
            ابھی نسخہ جات کی مصنوعات دستیاب نہیں ہیں۔
          </p>
        </div>
      ) : (
        <div
          className="
            flex
            gap-4
            overflow-x-auto
            pb-2
            sm:grid
            sm:grid-cols-2
            sm:gap-6
            sm:overflow-visible
            lg:grid-cols-4
            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
          "
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="
               min-w-[46%]
                flex-shrink-0
                sm:min-w-0
              "
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}

      {/* =====================================================
          MOBILE VIEW ALL
      ====================================================== */}

      <div className="mt-8 text-center sm:hidden">
        <Link
          href="/nuskhajat"
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
          View All Nuskhajat
        </Link>
      </div>
    </section>
  );
}