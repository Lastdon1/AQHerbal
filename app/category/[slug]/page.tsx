import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import pool from "@/lib/db";

type Category = {
  id: number;
  name: string;
  name_urdu: string | null;
  slug: string;
};

type Product = {
  id: number;
  name: string;
  name_urdu: string | null;
  slug: string;
  description: string | null;
  description_urdu: string | null;
  category_id: number | null;
  category_name: string | null;
  category_name_urdu: string | null;
  price: number | null;
  old_price: number | null;
  image_url: string | null;
};

/* =====================================================
   GET CATEGORY
===================================================== */

async function getCategory(
  slug: string
): Promise<Category | null> {
  const result = await pool.query(
    `
      SELECT
        id,
        name,
        name_urdu,
        slug

      FROM categories

      WHERE slug = $1
        AND is_active = true

      LIMIT 1
    `,
    [slug]
  );

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0];
}

/* =====================================================
   GET PRODUCTS
===================================================== */

async function getCategoryProducts(
  categoryId: number
): Promise<Product[]> {
  const result = await pool.query(
    `
      SELECT
        p.id,
        p.name,
        p.name_urdu,
        p.slug,
        p.description,
        p.description_urdu,

        p.category_id,

        c.name AS category_name,
        c.name_urdu AS category_name_urdu,

        pv.price,
        pv.old_price,

        pi.image_url

      FROM products p

      LEFT JOIN categories c
        ON c.id = p.category_id

      LEFT JOIN LATERAL (
        SELECT
          price,
          old_price

        FROM product_variants

        WHERE product_id = p.id
          AND is_active = true

        ORDER BY
          is_default DESC,
          quantity_value ASC,
          id ASC

        LIMIT 1
      ) pv ON true

      LEFT JOIN LATERAL (
        SELECT
          image_url

        FROM product_images

        WHERE product_id = p.id

        ORDER BY
          is_primary DESC,
          sort_order ASC,
          id ASC

        LIMIT 1
      ) pi ON true

      WHERE p.category_id = $1
        AND p.is_active = true

      ORDER BY
        p.id DESC
    `,
    [categoryId]
  );

  return result.rows;
}

/* =====================================================
   CATEGORY PAGE
===================================================== */

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  /* ===================================================
     GET CATEGORY FROM DATABASE
  =================================================== */

  const category = await getCategory(slug);

  if (!category) {
    notFound();
  }

  /* ===================================================
     GET PRODUCTS
  =================================================== */

  const products = await getCategoryProducts(
    category.id
  );

  /* ===================================================
     PAGE
  =================================================== */

  return (
    <main className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-8">

        {/* =========================================
            BREADCRUMB
        ========================================= */}

        <nav
          aria-label="Breadcrumb"
          className="mb-8 flex flex-wrap items-center text-sm text-gray-500"
        >
          <Link
            href="/"
            className="transition hover:text-green-700"
          >
            Home
          </Link>

          <span className="mx-2 text-gray-300">
            /
          </span>

          <Link
            href="/shop"
            className="transition hover:text-green-700"
          >
            Shop
          </Link>

          <span className="mx-2 text-gray-300">
            /
          </span>

          <span className="font-medium text-gray-900">
            {category.name}
          </span>
        </nav>

        {/* =========================================
            CATEGORY HEADER
        ========================================= */}

        <div className="mb-10 text-center">

          {/* ENGLISH CATEGORY NAME */}

          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            {category.name}
          </h1>

          {/* URDU CATEGORY NAME */}

          {category.name_urdu && (
            <p
              dir="rtl"
              lang="ur"
              className="mt-1 text-center text-xl font-semibold text-green-800"
            >
              {category.name_urdu}
            </p>
          )}

          {/* DESCRIPTION */}

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-gray-600">
            Browse all products available in this category.
          </p>

        </div>

        {/* =========================================
            PRODUCTS
            MOBILE: 2 PRODUCTS PER ROW
            TABLET: 2 PRODUCTS PER ROW
            DESKTOP: 4 PRODUCTS PER ROW
        ========================================= */}

        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">

            {products.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className="
                  group
                  overflow-hidden
                  rounded-2xl
                  border
                  border-gray-100
                  bg-white
                  shadow-sm
                  transition
                  hover:-translate-y-1
                  hover:shadow-lg
                "
              >

                {/* PRODUCT IMAGE */}

                <div className="relative aspect-square overflow-hidden bg-[#f8faf8]">

                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      sizes="(max-width: 639px) 50vw, (max-width: 1024px) 50vw, 25vw"
                      className="
                        object-contain
                        p-3
                        transition
                        duration-300
                        group-hover:scale-105
                        sm:p-6
                      "
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-gray-400 sm:text-sm">
                      No Image
                    </div>
                  )}

                </div>

                {/* PRODUCT INFORMATION */}

                <div className="p-3 sm:p-5">

                  {/* URDU NAME */}

                  {product.name_urdu && (
                    <p
                      dir="rtl"
                      lang="ur"
                      className="
                        text-left
                        text-sm
                        font-semibold
                        leading-6
                        text-gray-900
                        sm:text-lg
                        sm:leading-8
                      "
                    >
                      {product.name_urdu}
                    </p>
                  )}

                  {/* ENGLISH NAME */}

                  <h2
                    className="
                      mt-0.5
                      line-clamp-2
                      text-sm
                      font-semibold
                      leading-5
                      text-gray-900
                      sm:text-base
                      sm:leading-6
                    "
                  >
                    {product.name}
                  </h2>

                  {/* DESCRIPTION */}

                  {product.description && (
                    <p
                      className="
                        mt-1.5
                        hidden
                        line-clamp-2
                        text-sm
                        leading-6
                        text-gray-500
                        sm:mt-2
                        sm:block
                      "
                    >
                      {product.description}
                    </p>
                  )}

                  {/* PRICE */}

                  {product.price !== null && (
                    <div className="mt-2 flex flex-wrap items-center gap-1.5 sm:mt-4 sm:gap-2">

                      <span className="text-sm font-bold text-green-700 sm:text-lg">
                        Rs{" "}
                        {Number(
                          product.price
                        ).toLocaleString("en-PK")}
                      </span>

                      {product.old_price !== null &&
                        Number(product.old_price) >
                          Number(product.price) && (
                          <span className="text-[10px] text-gray-400 line-through sm:text-sm">
                            Rs{" "}
                            {Number(
                              product.old_price
                            ).toLocaleString("en-PK")}
                          </span>
                        )}

                    </div>
                  )}

                  {/* VIEW PRODUCT */}

                  <div
                    className="
                      mt-2
                      text-xs
                      font-semibold
                      text-green-700
                      transition
                      group-hover:text-green-800
                      sm:mt-4
                      sm:text-sm
                    "
                  >
                    View Product →
                  </div>

                </div>
              </Link>
            ))}

          </div>
        ) : (

          /* =========================================
             NO PRODUCTS
          ========================================= */

          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 py-16 text-center">

            <h2 className="text-xl font-semibold text-gray-900">
              No Products Found
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              There are currently no products available
              in this category.
            </p>

            <Link
              href="/shop"
              className="mt-6 inline-flex rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
            >
              Continue Shopping
            </Link>

          </div>
        )}

      </div>
    </main>
  );
}