import Image from "next/image";
import { notFound } from "next/navigation";

import pool from "@/lib/db";
import ProductCard from "@/components/product/ProductCard";

type HealthConcernPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function HealthConcernPage({
  params,
}: HealthConcernPageProps) {
  const { slug } = await params;

  /* =====================================================
     LOAD HEALTH CONCERN
  ====================================================== */

  const healthConcernResult = await pool.query(
    `
      SELECT
        id,
        name,
        name_urdu,
        slug,
        description,
        description_urdu,
        image
      FROM health_concerns
      WHERE slug = $1
        AND is_active = true
      LIMIT 1
    `,
    [slug]
  );

  const healthConcern =
    healthConcernResult.rows[0];

  if (!healthConcern) {
    notFound();
  }

  /* =====================================================
     LOAD PRODUCTS FOR THIS HEALTH CONCERN
  ====================================================== */

  const productsResult = await pool.query(
    `
      SELECT
        p.id,
        p.name,
        p.name_urdu,
        p.slug,
        p.description,
        p.description_urdu,

        c.name AS category,
        c.name_urdu AS category_urdu

      FROM products p

      INNER JOIN product_health_concerns phc
        ON phc.product_id = p.id

      LEFT JOIN categories c
        ON c.id = p.category_id

      WHERE phc.health_concern_id = $1
        AND p.is_active = true

      ORDER BY p.id DESC
    `,
    [healthConcern.id]
  );

  /* =====================================================
     PRODUCT IDS
  ====================================================== */

  const productIds = productsResult.rows.map(
    (product) => Number(product.id)
  );

  /* =====================================================
     LOAD IMAGES
  ====================================================== */

  let imagesResult = {
    rows: [] as Array<{
      product_id: number;
      image_url: string;
      sort_order: number;
      is_primary: boolean;
    }>,
  };

  if (productIds.length > 0) {
    imagesResult = await pool.query(
      `
        SELECT
          product_id,
          image_url,
          sort_order,
          is_primary

        FROM product_images

        WHERE product_id = ANY($1::int[])

        ORDER BY
          is_primary DESC,
          sort_order ASC
      `,
      [productIds]
    );
  }

  /* =====================================================
     LOAD VARIANTS
  ====================================================== */

  let variantsResult = {
    rows: [] as Array<{
      product_id: number;
      quantity_value: number;
      unit: string;
      price: number;
      old_price: number | null;
      is_default: boolean;
      is_active: boolean;
      id: number;
    }>,
  };

  if (productIds.length > 0) {
    variantsResult = await pool.query(
      `
        SELECT
          id,
          product_id,
          quantity_value,
          unit,
          price,
          old_price,
          is_default,
          is_active

        FROM product_variants

        WHERE product_id = ANY($1::int[])

          AND is_active = true

        ORDER BY
          is_default DESC,
          id ASC
      `,
      [productIds]
    );
  }

  /* =====================================================
     BUILD PRODUCT DATA
  ====================================================== */

  const products = productsResult.rows.map(
    (product) => {
      const productId =
        Number(product.id);

      const productImages =
        imagesResult.rows
          .filter(
            (image) =>
              Number(
                image.product_id
              ) === productId
          )
          .sort(
            (a, b) =>
              Number(a.sort_order) -
              Number(b.sort_order)
          )
          .map(
            (image) =>
              image.image_url
          );

      const productVariants =
        variantsResult.rows.filter(
          (variant) =>
            Number(
              variant.product_id
            ) === productId
        );

      const defaultVariant =
        productVariants.find(
          (variant) =>
            variant.is_default
        ) ??
        productVariants[0];

      return {
        id: productId,

        name: product.name,

        nameUrdu:
          product.name_urdu ?? "",

        slug: product.slug,

        category:
          product.category ?? "",

        healthConcerns: [],

        price: defaultVariant
          ? Number(
              defaultVariant.price
            )
          : 0,

        rating: 5,

        images:
          productImages,

        description:
          product.description ?? "",

        descriptionUrdu:
          product.description_urdu ??
          "",

        benefits: [],

        ingredients: [],

        usage: "",

        variants:
          productVariants.map(
            (variant) => ({
              quantity:
                Number(
                  variant.quantity_value
                ),

              unit:
                variant.unit,

              price:
                Number(
                  variant.price
                ),
            })
          ),
      };
    }
  );

  return (
    <main>

      {/* =================================================
          HEALTH CONCERN IMAGE
      ================================================== */}

      <section className="mx-auto max-w-7xl px-6 pt-6 pb-1 sm:pt-6">

        <div className="flex justify-center">

          <div className="relative h-36 w-36 sm:h-44 sm:w-44">

            {healthConcern.image && (
              <Image
                src={healthConcern.image}
                alt={healthConcern.name}
                fill
                priority
                sizes="(max-width: 640px) 144px, 176px"
                className="object-contain"
              />
            )}

          </div>

        </div>

      </section>

      {/* =================================================
          RELATED PRODUCTS
      ================================================== */}

      <section className="bg-gray-50 py-10 sm:py-14">

        <div className="mx-auto max-w-7xl px-6">

          {/* Products Heading */}

          <div className="mb-8 text-center">

            <h1
              className="
                text-2xl
                font-bold
                text-gray-900
                sm:text-3xl
              "
            >
              Products for{" "}
              {healthConcern.name}
            </h1>

            {healthConcern.name_urdu && (
              <p
                dir="rtl"
                className="mt-2 text-gray-600"
              >
                {healthConcern.name_urdu}
              </p>
            )}

          </div>

          {/* =================================================
              PRODUCT GRID
          ================================================== */}

          {products.length > 0 ? (

            <div
              className="
                grid
                grid-cols-2
                gap-4
                sm:gap-6
                lg:grid-cols-4
              "
            >

              {products.map(
                (product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                )
              )}

            </div>

          ) : (

            <div
              className="
                rounded-xl
                bg-white
                p-10
                text-center
                shadow-sm
              "
            >

              <p className="text-gray-500">
                No products are currently
                available for this health
                concern.
              </p>

            </div>

          )}

        </div>

      </section>

    </main>
  );
}