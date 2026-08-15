import pool from "@/lib/db";

export type MurabbaJatProduct = {
  id: number;
  name: string;
  nameUrdu: string;
  slug: string;
  category: string;
  price: number;
  oldPrice: number | null;
  rating: number;
  images: string[];
};

export async function getMurabbaJatProducts(): Promise<
  MurabbaJatProduct[]
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

          /*
           * Active default variant
           */
          COALESCE(
            pv.price,
            0
          ) AS price,

          pv.old_price,

          /*
           * All product images
           */
          COALESCE(
            img.images,
            '[]'::json
          ) AS images

        FROM products p

        LEFT JOIN categories c
          ON c.id = p.category_id

        /*
         * Get the default active variant once.
         */
        LEFT JOIN LATERAL (
          SELECT
            price,
            old_price
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
         * Aggregate product images once.
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
            LOWER(TRIM(c.name)) = 'murabba jat'
            OR LOWER(TRIM(c.name)) = 'murabba-jat'
            OR LOWER(TRIM(c.slug)) = 'murabba-jat'
            OR TRIM(c.name) = 'مربہ جات'
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

      oldPrice:
        product.old_price === null ||
        product.old_price === undefined
          ? null
          : Number(
              product.old_price
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
       * Preserve existing storefront behavior.
       */
      rating: 5,
    }));
  } catch (error) {
    console.error(
      "GET MURABBA JAT PRODUCTS ERROR:",
      error
    );

    return [];
  }
}