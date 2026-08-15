
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT
        p.id,
        p.name,
        p.name_urdu,
        p.slug,

        c.name AS category,

        COALESCE(
          (
            SELECT pv.price
            FROM product_variants pv
            WHERE pv.product_id = p.id
              AND pv.is_default = true
              AND pv.is_active = true
            LIMIT 1
          ),
          0
        ) AS price,

        COALESCE(
          (
            SELECT json_agg(
              pi.image_url
              ORDER BY pi.sort_order ASC
            )
            FROM product_images pi
            WHERE pi.product_id = p.id
          ),
          '[]'::json
        ) AS images

      FROM products p

      LEFT JOIN categories c
        ON c.id = p.category_id

      WHERE p.is_active = true

      ORDER BY p.id DESC
    `);

    const products = result.rows.map(
      (product) => ({
        id: Number(product.id),

        name: product.name,

        nameUrdu:
          product.name_urdu || "",

        slug: product.slug,

        category:
          product.category || "",

        price: Number(product.price),

        images:
          Array.isArray(product.images)
            ? product.images
            : [],

        rating: 5,
      })
    );

    return NextResponse.json({
      products,
    });
  } catch (error) {
    console.error(
      "Products API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to load products.",
      },
      {
        status: 500,
      }
    );
  }
}

