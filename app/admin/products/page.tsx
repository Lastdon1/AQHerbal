// app/admin/products/page.tsx

import Link from "next/link";
import pool from "@/lib/db";
import ProductTable from "./ProductTable";

type Product = {
  id: number;
  name: string;
  name_urdu: string | null;
  slug: string;
  category_name: string | null;
  is_active: boolean;
  is_featured: boolean;
  image_url: string | null;
  image_count: number;
  variant_count: number;
  default_price: number | null;
  default_old_price: number | null;
  default_quantity: number | null;
  default_unit: string | null;
};

/**
 * Fetch all products for the admin product table.
 *
 * Featured status is loaded here because Featured Products
 * are managed directly from the Products admin listing.
 *
 * Optimizations:
 * - Uses LATERAL joins for the selected image/default variant.
 * - Aggregates image/variant counts once per product.
 * - Avoids repeating the same variant lookup four times.
 */
async function getProducts(): Promise<Product[]> {
  const result = await pool.query(`
    SELECT
      p.id,
      p.name,
      p.name_urdu,
      p.slug,
      c.name AS category_name,
      p.is_active,
      p.is_featured,

      image_data.image_url,

      COALESCE(image_data.image_count, 0)::int AS image_count,

      COALESCE(variant_data.variant_count, 0)::int AS variant_count,

      variant_data.default_price,
      variant_data.default_old_price,
      variant_data.default_quantity,
      variant_data.default_unit

    FROM products p

    LEFT JOIN categories c
      ON c.id = p.category_id

    /* ==========================================================
       IMAGE DATA
    ========================================================== */
    LEFT JOIN LATERAL (
      SELECT
        (
          SELECT pi.image_url
          FROM product_images pi
          WHERE pi.product_id = p.id
          ORDER BY
            pi.is_primary DESC,
            pi.sort_order ASC,
            pi.id ASC
          LIMIT 1
        ) AS image_url,

        COUNT(*)::int AS image_count

      FROM product_images pi
      WHERE pi.product_id = p.id
    ) image_data
      ON true

    /* ==========================================================
       VARIANT DATA
    ========================================================== */
    LEFT JOIN LATERAL (
      SELECT
        COUNT(*)::int AS variant_count,

        (
          SELECT pv.price
          FROM product_variants pv
          WHERE pv.product_id = p.id
            AND pv.is_active = true
          ORDER BY
            pv.is_default DESC,
            pv.id ASC
          LIMIT 1
        ) AS default_price,

        (
          SELECT pv.old_price
          FROM product_variants pv
          WHERE pv.product_id = p.id
            AND pv.is_active = true
          ORDER BY
            pv.is_default DESC,
            pv.id ASC
          LIMIT 1
        ) AS default_old_price,

        (
          SELECT pv.quantity_value
          FROM product_variants pv
          WHERE pv.product_id = p.id
            AND pv.is_active = true
          ORDER BY
            pv.is_default DESC,
            pv.id ASC
          LIMIT 1
        ) AS default_quantity,

        (
          SELECT pv.unit
          FROM product_variants pv
          WHERE pv.product_id = p.id
            AND pv.is_active = true
          ORDER BY
            pv.is_default DESC,
            pv.id ASC
          LIMIT 1
        ) AS default_unit

      FROM product_variants pv
      WHERE pv.product_id = p.id
    ) variant_data
      ON true

    ORDER BY p.id DESC
  `);

  return result.rows as Product[];
}

/**
 * Fetch active categories for the ProductTable filter.
 */
async function getCategories(): Promise<string[]> {
  const result = await pool.query(`
    SELECT name
    FROM categories
    WHERE is_active = true
    ORDER BY name ASC
  `);

  return result.rows.map(
    (row: { name: string }) => row.name
  );
}

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  const featuredCount = products.filter(
    (product) => product.is_featured
  ).length;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-8">

        {/* =====================================================
            HEADER
        ===================================================== */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/admin"
              className="text-sm font-medium text-green-700 hover:underline"
            >
              ← Back to Dashboard
            </Link>

            <h1 className="mt-3 text-3xl font-bold text-gray-900">
              Products
            </h1>

            <p className="mt-2 text-gray-600">
              Manage your ISACO products.
            </p>
          </div>

          <Link
            href="/admin/products/new"
            className="inline-flex w-fit items-center rounded-lg bg-green-700 px-5 py-3 font-medium text-white transition hover:bg-green-800"
          >
            + Add Product
          </Link>
        </div>

        {/* =====================================================
            PRODUCT COUNTS
        ===================================================== */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500">
            Total Products:{" "}
            <span className="font-semibold text-gray-900">
              {products.length}
            </span>
          </p>

          <div
            className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
              featuredCount >= 8
                ? "bg-green-100 text-green-800"
                : "bg-green-50 text-green-700"
            }`}
          >
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                featuredCount >= 8
                  ? "bg-green-700"
                  : "bg-green-500"
              }`}
            />

            Featured Products: {featuredCount} / 8
          </div>
        </div>

        {/* =====================================================
            PRODUCT TABLE
        ===================================================== */}
        <ProductTable
          products={products}
          categories={categories}
          initialFeaturedCount={featuredCount}
        />

        {/* =====================================================
            BOTTOM NAVIGATION
        ===================================================== */}
        <div className="mt-6">
          <Link
            href="/admin"
            className="text-sm font-medium text-green-700 hover:underline"
          >
            ← Back to Dashboard
          </Link>
        </div>

      </div>
    </main>
  );
}