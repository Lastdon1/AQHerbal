import pool from "@/lib/db";

export type HerbsProduct = {
  id: number;
  name: string;
  nameUrdu: string;
  slug: string;
  category: string;
  price: number;
  rating: number;
  images: string[];
};

export async function getHerbsProducts(): Promise<
  HerbsProduct[]
> {
  try {
    const result = await pool.query(
      `
        SELECT
          p.id,
          p.name,
          p.name_urdu,
          p.slug,

          c.name AS category,

          COALESCE(
            pv.price,
            0
          ) AS price,

          COALESCE(
            img.images,
            '[]'::json
          ) AS images

        FROM products p

        LEFT JOIN categories c
          ON c.id = p.category_id

        /*
         * Get the active default variant.
         */
        LEFT JOIN LATERAL (
          SELECT
            price
          FROM product_variants
          WHERE
            product_id = p.id
            AND is_default = true
            AND is_active = true
          ORDER BY id ASC
          LIMIT 1
        ) pv
          ON true

        /*
         * Get all product images in one aggregation.
         */
        LEFT JOIN LATERAL (
          SELECT
            json_agg(
              pi.image_url
              ORDER BY
                pi.sort_order ASC,
                pi.id ASC
            ) AS images
          FROM product_images pi
          WHERE
            pi.product_id = p.id
        ) img
          ON true

        WHERE
          p.is_active = true

          AND (
            LOWER(TRIM(c.name)) = 'herbs'
            OR LOWER(TRIM(c.name)) = 'herb'
            OR LOWER(TRIM(c.slug)) = 'herbs'
            OR TRIM(c.name) = 'جڑی بوٹیاں'
          )

        ORDER BY
          p.id DESC

        LIMIT 4
      `
    );

    return result.rows.map((product) => ({
      id: Number(product.id),

      name: String(
        product.name || ""
      ),

      nameUrdu: String(
        product.name_urdu || ""
      ),

      slug: String(
        product.slug || ""
      ),

      category: String(
        product.category || ""
      ),

      price: Number(
        product.price || 0
      ),

      images:
        Array.isArray(product.images)
          ? product.images.filter(
              (
                image: unknown
              ): image is string =>
                typeof image === "string" &&
                image.trim().length > 0
            )
          : [],

      /*
       * Current storefront displays
       * Herbs as 5-star products.
       *
       * Keeping this unchanged prevents
       * any UI changes.
       */
      rating: 5,
    }));
  } catch (error) {
    console.error(
      "GET HERBS PRODUCTS ERROR:",
      error
    );

    return [];
  }
}