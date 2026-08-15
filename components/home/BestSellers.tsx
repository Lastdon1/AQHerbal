
"use client";

import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import { products } from "@/constants/products";

export default function BestSellers() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12">

      {/* =====================================================
          SECTION HEADER
      ====================================================== */}

      <div className="relative mb-10 text-center">

        {/* Urdu Heading */}
        <h2 className="text-3xl font-bold text-green-800">
          سب سے زیادہ پسند کی جانے والی مصنوعات
        </h2>

        {/* English Heading */}
        <p className="mt-1 text-lg text-gray-700">
          Best Sellers
        </p>

        {/* Desktop View All */}
        <Link
          href="/shop"
          className="absolute right-0 top-1/2 hidden -translate-y-1/2 text-sm font-semibold text-green-700 transition hover:text-green-800 sm:inline-flex"
        >
          View All →
        </Link>
      </div>

      {/* =====================================================
          PRODUCT GRID
      ====================================================== */}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        {products.slice(0, 4).map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>

      {/* =====================================================
          MOBILE VIEW ALL
      ====================================================== */}

      <div className="mt-8 text-center sm:hidden">
        <Link
          href="/shop"
          className="inline-flex items-center justify-center rounded-full border border-green-700 px-6 py-3 text-sm font-semibold text-green-700 transition hover:bg-green-700 hover:text-white"
        >
          View All Products
        </Link>
      </div>

    </section>
  );
}

