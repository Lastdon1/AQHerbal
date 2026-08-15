import { NextResponse } from "next/server";
import pool from "@/lib/db";

function normalizeSearchText(value: string) {
  return value
    .normalize("NFKC")
    .replace(/[\u064B-\u065F\u0670]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const rawQuery = searchParams.get("q") || "";
    const language =
      searchParams.get("language") === "ur"
        ? "ur"
        : "en";

    const query = normalizeSearchText(rawQuery);

    if (!query || query.length < 1) {
      return NextResponse.json({
        products: [],
      });
    }

    /*
     * Limit query length so the endpoint
     * cannot receive unnecessarily large
     * search strings.
     */
    const safeQuery = query.slice(0, 100);

    const searchPattern = `%${safeQuery}%`;

    let result;

    if (language === "ur") {
      /*
       * Urdu search
       *
       * Search:
       * - Urdu product name
       * - Urdu description
       * - category Urdu name
       */
      result = await pool.query(
        `
        SELECT
          p.id,
          p.name,
          p.name_urdu,
          p.slug,

          COALESCE(
            (
              SELECT pi.image_url
              FROM product_images pi
              WHERE pi.product_id = p.id
              ORDER BY
                pi.is_primary DESC,
                pi.sort_order ASC,
                pi.id ASC
              LIMIT 1
            ),
            ''
          ) AS image,

          COALESCE(
            (
              SELECT pv.price
              FROM product_variants pv
              WHERE pv.product_id = p.id
              ORDER BY
                pv.is_default DESC,
                pv.id ASC
              LIMIT 1
            ),
            0
          ) AS price

        FROM products p

        LEFT JOIN categories c
          ON c.id = p.category_id

        WHERE
          p.is_active = true

          AND (
            LOWER(
              regexp_replace(
                COALESCE(p.name_urdu, ''),
                '[\\u064B-\\u065F\\u0670]',
                '',
                'g'
              )
            ) LIKE LOWER($1)

            OR

            LOWER(
              regexp_replace(
                COALESCE(p.description_urdu, ''),
                '[\\u064B-\\u065F\\u0670]',
                '',
                'g'
              )
            ) LIKE LOWER($1)

            OR

            LOWER(
              regexp_replace(
                COALESCE(c.name_urdu, ''),
                '[\\u064B-\\u065F\\u0670]',
                '',
                'g'
              )
            ) LIKE LOWER($1)
          )

        ORDER BY
          CASE
            WHEN LOWER(
              regexp_replace(
                COALESCE(p.name_urdu, ''),
                '[\\u064B-\\u065F\\u0670]',
                '',
                'g'
              )
            ) LIKE LOWER($2)
            THEN 0

            ELSE 1
          END,

          p.id DESC

        LIMIT 20
        `,
        [
          searchPattern,
          `${safeQuery}%`,
        ]
      );
    } else {
      /*
       * English search
       *
       * Search:
       * - Product name
       * - Slug
       * - Description
       * - Category
       */
      result = await pool.query(
        `
        SELECT
          p.id,
          p.name,
          p.name_urdu,
          p.slug,

          COALESCE(
            (
              SELECT pi.image_url
              FROM product_images pi
              WHERE pi.product_id = p.id
              ORDER BY
                pi.is_primary DESC,
                pi.sort_order ASC,
                pi.id ASC
              LIMIT 1
            ),
            ''
          ) AS image,

          COALESCE(
            (
              SELECT pv.price
              FROM product_variants pv
              WHERE pv.product_id = p.id
              ORDER BY
                pv.is_default DESC,
                pv.id ASC
              LIMIT 1
            ),
            0
          ) AS price

        FROM products p

        LEFT JOIN categories c
          ON c.id = p.category_id

        WHERE
          p.is_active = true

          AND (
            p.name ILIKE $1
            OR p.slug ILIKE $1
            OR p.description ILIKE $1
            OR c.name ILIKE $1
          )

        ORDER BY
          CASE
            WHEN p.name ILIKE $2 THEN 0
            WHEN p.slug ILIKE $2 THEN 1
            ELSE 2
          END,

          p.id DESC

        LIMIT 20
        `,
        [
          searchPattern,
          `${safeQuery}%`,
        ]
      );
    }

    return NextResponse.json({
      products: result.rows,
    });
  } catch (error) {
    console.error(
      "Product search error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to search products.",
        products: [],
      },
      {
        status: 500,
      }
    );
  }
}