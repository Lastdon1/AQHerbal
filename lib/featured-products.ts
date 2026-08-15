import pool from "@/lib/db";

/*
 * ============================================================
 * FEATURED PRODUCT TYPES
 * ============================================================
 */

export type FeaturedProductVariant = {
  id: number;
  quantityValue: number;
  unit: string;
  price: number;
  oldPrice: number | null;
  isDefault: boolean;
  isActive: boolean;
};

export type FeaturedProduct = {
  id: number;

  name: string;
  nameUrdu: string;

  slug: string;

  category: string;

  healthConcerns: string[];

  /*
   * All active variants.
   */
  variants: FeaturedProductVariant[];

  /*
   * Default variant fields.
   *
   * Kept for compatibility with existing
   * ProductCard / storefront code.
   */
  variantId: number;
  quantityValue: number;
  unit: string;
  price: number;
  oldPrice: number | null;

  rating?: number;

  images: string[];
};

/*
 * ============================================================
 * GET FEATURED PRODUCTS
 * ============================================================
 *
 * Homepage Featured Products:
 *
 * - Only active products
 * - Only products marked as is_featured = true
 * - Maximum 8 products
 * - Must have at least one active variant
 *
 * Admin controls which products are featured.
 */

export async function getFeaturedProducts(
  limit = 8
): Promise<FeaturedProduct[]> {
  const safeLimit = Math.max(
    1,
    Math.min(
      Number(limit) || 8,
      8
    )
  );

  try {
    const result = await pool.query(
      `
        WITH featured AS (
          SELECT
            p.id,
            p.name,
            p.name_urdu,
            p.slug,
            p.category_id

          FROM products p

          WHERE
            p.is_active = true

            /*
             * IMPORTANT:
             * Only products selected as Featured
             * in Admin Products should appear here.
             */
            AND p.is_featured = true

            /*
             * Product must have at least one
             * active variant.
             */
            AND EXISTS (
              SELECT 1
              FROM product_variants pv
              WHERE
                pv.product_id = p.id
                AND pv.is_active = true
            )

          ORDER BY
            p.id DESC

          LIMIT $1
        ),

        variant_data AS (
          SELECT
            pv.product_id,

            json_agg(
              json_build_object(
                'id', pv.id,
                'quantityValue', pv.quantity_value,
                'unit', pv.unit,
                'price', pv.price,
                'oldPrice', pv.old_price,
                'isDefault', pv.is_default,
                'isActive', pv.is_active
              )
              ORDER BY
                pv.is_default DESC,
                pv.id ASC
            ) AS variants

          FROM product_variants pv

          INNER JOIN featured f
            ON f.id = pv.product_id

          WHERE
            pv.is_active = true

          GROUP BY
            pv.product_id
        ),

        health_data AS (
          SELECT
            phc.product_id,

            json_agg(
              DISTINCT hc.name
            ) AS health_concerns

          FROM product_health_concerns phc

          INNER JOIN health_concerns hc
            ON hc.id = phc.health_concern_id

          INNER JOIN featured f
            ON f.id = phc.product_id

          WHERE
            hc.is_active = true

          GROUP BY
            phc.product_id
        ),

        image_data AS (
          SELECT
            pi.product_id,

            json_agg(
              pi.image_url
              ORDER BY
                pi.is_primary DESC,
                pi.sort_order ASC,
                pi.id ASC
            ) AS images

          FROM product_images pi

          INNER JOIN featured f
            ON f.id = pi.product_id

          GROUP BY
            pi.product_id
        )

        SELECT
          f.id,
          f.name,
          f.name_urdu,
          f.slug,

          c.name AS category,

          COALESCE(
            vd.variants,
            '[]'::json
          ) AS variants,

          COALESCE(
            hd.health_concerns,
            '[]'::json
          ) AS health_concerns,

          COALESCE(
            idata.images,
            '[]'::json
          ) AS images

        FROM featured f

        LEFT JOIN categories c
          ON c.id = f.category_id

        LEFT JOIN variant_data vd
          ON vd.product_id = f.id

        LEFT JOIN health_data hd
          ON hd.product_id = f.id

        LEFT JOIN image_data idata
          ON idata.product_id = f.id

        ORDER BY
          f.id DESC
      `,
      [safeLimit]
    );

    /*
     * ========================================================
     * MAP DATABASE RESULTS
     * ========================================================
     */

    return result.rows.map((row) => {
      /*
       * ======================================================
       * VARIANTS
       * ======================================================
       */

      const variants: FeaturedProductVariant[] =
        Array.isArray(row.variants)
          ? row.variants.map(
              (variant: {
                id: number | string;
                quantityValue:
                  | number
                  | string;
                unit: string | null;
                price:
                  | number
                  | string;
                oldPrice:
                  | number
                  | string
                  | null;
                isDefault: boolean;
                isActive: boolean;
              }) => ({
                id: Number(
                  variant.id
                ),

                quantityValue:
                  Number(
                    variant.quantityValue
                  ),

                unit:
                  String(
                    variant.unit || ""
                  ),

                price:
                  Number(
                    variant.price
                  ),

                oldPrice:
                  variant.oldPrice ===
                    null ||
                  variant.oldPrice ===
                    undefined
                    ? null
                    : Number(
                        variant.oldPrice
                      ),

                isDefault:
                  Boolean(
                    variant.isDefault
                  ),

                isActive:
                  Boolean(
                    variant.isActive
                  ),
              })
            )
          : [];

      /*
       * ======================================================
       * DEFAULT VARIANT
       * ======================================================
       */

      const defaultVariant =
        variants.find(
          (variant) =>
            variant.isDefault
        ) ||
        variants.find(
          (variant) =>
            variant.isActive
        ) ||
        variants[0] ||
        null;

      /*
       * ======================================================
       * IMAGES
       * ======================================================
       */

      const images: string[] =
        Array.isArray(row.images)
          ? row.images.filter(
              (
                image: unknown
              ): image is string =>
                typeof image ===
                  "string" &&
                image.trim()
                  .length > 0
            )
          : [];

      /*
       * ======================================================
       * HEALTH CONCERNS
       * ======================================================
       */

      const healthConcerns: string[] =
        Array.isArray(
          row.health_concerns
        )
          ? row.health_concerns.filter(
              (
                concern: unknown
              ): concern is string =>
                typeof concern ===
                  "string" &&
                concern.trim()
                  .length > 0
            )
          : [];

      /*
       * ======================================================
       * RETURN PRODUCT
       * ======================================================
       */

      return {
        id: Number(
          row.id
        ),

        name: String(
          row.name || ""
        ),

        nameUrdu: String(
          row.name_urdu || ""
        ),

        slug: String(
          row.slug || ""
        ),

        category: String(
          row.category || ""
        ),

        healthConcerns,

        variants,

        /*
         * Backward-compatible default variant fields.
         */

        variantId:
          defaultVariant?.id ??
          0,

        quantityValue:
          defaultVariant
            ?.quantityValue ??
          0,

        unit:
          defaultVariant?.unit ??
          "",

        price:
          defaultVariant?.price ??
          0,

        oldPrice:
          defaultVariant?.oldPrice ??
          null,

        images,
      };
    });
  } catch (error) {
    console.error(
      "GET FEATURED PRODUCTS ERROR:",
      error
    );

    return [];
  }
}