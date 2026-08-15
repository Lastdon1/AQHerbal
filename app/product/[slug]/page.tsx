import Link from "next/link";
import pool from "@/lib/db";
import ProductDetailClient from "@/components/product/ProductDetailClient";

type ProductImage = {
  id: number;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
};

type ProductVariant = {
  id: number;
  quantity_value: number;
  unit: string;
  price: number;
  old_price: number | null;
  is_default: boolean;
  is_active: boolean;
};

type HealthConcern = {
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

  benefits: string | null;
  benefits_urdu: string | null;

  ingredients: string | null;
  ingredients_urdu: string | null;

  usage: string | null;
  usage_urdu: string | null;

  is_active: boolean;

  category_id: number | null;
  category_name: string | null;
  category_name_urdu: string | null;
  category_slug: string | null;

  images: ProductImage[];
  variants: ProductVariant[];
  health_concerns: HealthConcern[];
};

/* =====================================================
   GET PRODUCT
===================================================== */

async function getProduct(
  slug: string
): Promise<Product | null> {
  /* ===================================================
     PRODUCT
  =================================================== */

  const productResult = await pool.query(
    `
      SELECT
        p.id,
        p.name,
        p.name_urdu,
        p.slug,

        p.description,
        p.description_urdu,

        p.benefits,
        p.benefits_urdu,

        p.ingredients,
        p.ingredients_urdu,

        p.usage,
        p.usage_urdu,

        p.is_active,

        c.id AS category_id,
        c.name AS category_name,
        c.name_urdu AS category_name_urdu,
        c.slug AS category_slug

      FROM products p

      LEFT JOIN categories c
        ON c.id = p.category_id

      WHERE p.slug = $1
        AND p.is_active = true

      LIMIT 1
    `,
    [slug]
  );

  if (productResult.rows.length === 0) {
    return null;
  }

  const product = productResult.rows[0];

  /* ===================================================
     PRODUCT IMAGES
  =================================================== */

  const imagesResult = await pool.query(
    `
      SELECT
        id,
        image_url,
        alt_text,
        sort_order,
        is_primary

      FROM product_images

      WHERE product_id = $1

      ORDER BY
        is_primary DESC,
        sort_order ASC,
        id ASC
    `,
    [product.id]
  );

  /* ===================================================
     PRODUCT VARIANTS
  =================================================== */

  const variantsResult = await pool.query(
    `
      SELECT
        id,
        quantity_value,
        unit,
        price,
        old_price,
        is_default,
        is_active

      FROM product_variants

      WHERE product_id = $1
        AND is_active = true

      ORDER BY
        is_default DESC,
        quantity_value ASC,
        id ASC
    `,
    [product.id]
  );

  /* ===================================================
     HEALTH CONCERNS
  =================================================== */

  const healthConcernsResult = await pool.query(
    `
      SELECT
        hc.id,
        hc.name,
        hc.name_urdu,
        hc.slug

      FROM health_concerns hc

      INNER JOIN product_health_concerns phc
        ON phc.health_concern_id = hc.id

      WHERE phc.product_id = $1
        AND hc.is_active = true

      ORDER BY
        hc.sort_order ASC,
        hc.id ASC
    `,
    [product.id]
  );

  /* ===================================================
     RETURN PRODUCT
  =================================================== */

  return {
    ...product,

    images: imagesResult.rows,

    variants: variantsResult.rows,

    health_concerns:
      healthConcernsResult.rows,
  };
}

/* =====================================================
   PRODUCT PAGE
===================================================== */

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await getProduct(slug);

  /* ===================================================
     PRODUCT NOT FOUND
  =================================================== */

  if (!product) {
    return (
      <main className="min-h-[60vh] bg-white px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Product Not Found
          </h1>

          <p className="mt-3 text-gray-600">
            The product you are looking for could not
            be found.
          </p>

          <Link
            href="/shop"
            className="mt-6 inline-flex rounded-lg bg-green-700 px-6 py-3 font-medium text-white hover:bg-green-800"
          >
            Back to Shop
          </Link>
        </div>
      </main>
    );
  }

  /* ===================================================
     PRODUCT PAGE
  =================================================== */

  return (
    <main className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-8">

        {/* =========================================
            BREADCRUMB
        ========================================= */}

        <div className="mb-8 text-sm text-gray-500">
          <Link
            href="/"
            className="hover:text-green-700"
          >
            Home
          </Link>

          <span className="mx-2">/</span>

          <Link
            href="/shop"
            className="hover:text-green-700"
          >
            Shop
          </Link>

          {product.category_slug && (
            <>
              <span className="mx-2">/</span>

              <Link
                href={`/category/${product.category_slug}`}
                className="hover:text-green-700"
              >
                {product.category_name}
              </Link>
            </>
          )}

          <span className="mx-2">/</span>

          <span className="text-gray-900">
            {product.name}
          </span>
        </div>

        {/* =========================================
            INTERACTIVE PRODUCT
        ========================================= */}

        <ProductDetailClient
          product={product}
        />

      </div>
    </main>
  );
}