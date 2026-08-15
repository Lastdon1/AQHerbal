import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { error: "Product slug is required." },
        { status: 400 }
      );
    }

    /* ============================================
       PRODUCT
    ============================================ */

    const productResult = await pool.query(
      `
      SELECT
        p.id,
        p.name,
        p.name_urdu,
        p.slug,
        p.description,
        p.description_urdu,
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
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }

    const product = productResult.rows[0];

    /* ============================================
       IMAGES
    ============================================ */

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

    /* ============================================
       VARIANTS
    ============================================ */

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

    /* ============================================
       HEALTH CONCERNS
    ============================================ */

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

      ORDER BY hc.sort_order ASC, hc.id ASC
      `,
      [product.id]
    );

    return NextResponse.json({
      product: {
        ...product,
        images: imagesResult.rows,
        variants: variantsResult.rows,
        health_concerns: healthConcernsResult.rows,
      },
    });
  } catch (error) {
    console.error("Product detail API error:", error);

    return NextResponse.json(
      {
        error: "Failed to load product.",
      },
      { status: 500 }
    );
  }
}