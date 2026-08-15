// app/api/admin/products/[id]/featured/route.ts

import { NextResponse } from "next/server";
import pool from "@/lib/db";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

const MAX_FEATURED_PRODUCTS = 8;

export async function PATCH(
  request: Request,
  context: RouteContext
) {
  const client = await pool.connect();

  try {
    const { id } = await context.params;

    const productId = Number(id);

    if (
      !Number.isInteger(productId) ||
      productId <= 0
    ) {
      return NextResponse.json(
        {
          error: "Invalid product ID.",
        },
        {
          status: 400,
        }
      );
    }

    const body = await request.json();

    if (
      typeof body?.is_featured !==
      "boolean"
    ) {
      return NextResponse.json(
        {
          error:
            "is_featured must be a boolean.",
        },
        {
          status: 400,
        }
      );
    }

    const isFeatured =
      body.is_featured;

    await client.query("BEGIN");

    /*
     * Make sure the product exists.
     */
    const productResult =
      await client.query(
        `
          SELECT
            id,
            is_featured
          FROM products
          WHERE id = $1
          FOR UPDATE
        `,
        [productId]
      );

    if (
      productResult.rowCount === 0
    ) {
      await client.query("ROLLBACK");

      return NextResponse.json(
        {
          error:
            "Product not found.",
        },
        {
          status: 404,
        }
      );
    }

    const currentValue =
      productResult.rows[0]
        .is_featured;

    /*
     * Nothing to change.
     */
    if (currentValue === isFeatured) {
      const countResult =
        await client.query(`
          SELECT COUNT(*)::int AS count
          FROM products
          WHERE is_featured = true
        `);

      await client.query("COMMIT");

      return NextResponse.json({
        success: true,
        is_featured: currentValue,
        featured_count:
          countResult.rows[0].count,
      });
    }

    /*
     * If selecting the product as Featured,
     * enforce the maximum of 8 on the server.
     */
    if (isFeatured) {
      const countResult =
        await client.query(`
          SELECT COUNT(*)::int AS count
          FROM products
          WHERE is_featured = true
        `);

      const featuredCount =
        countResult.rows[0].count;

      if (
        featuredCount >=
        MAX_FEATURED_PRODUCTS
      ) {
        await client.query("ROLLBACK");

        return NextResponse.json(
          {
            error:
              "You can only have 8 Featured Products on the homepage. Please remove one of the existing Featured Products first.",
            featured_count:
              featuredCount,
          },
          {
            status: 409,
          }
        );
      }
    }

    /*
     * Update Featured status.
     */
    await client.query(
      `
        UPDATE products
        SET is_featured = $1
        WHERE id = $2
      `,
      [isFeatured, productId]
    );

    /*
     * Return the authoritative Featured count.
     */
    const countResult =
      await client.query(`
        SELECT COUNT(*)::int AS count
        FROM products
        WHERE is_featured = true
      `);

    const featuredCount =
      countResult.rows[0].count;

    await client.query("COMMIT");

    return NextResponse.json({
      success: true,
      is_featured: isFeatured,
      featured_count: featuredCount,
      message: isFeatured
        ? "Product added to Featured Products."
        : "Product removed from Featured Products.",
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error(
      "Featured product API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to update Featured Product status.",
      },
      {
        status: 500,
      }
    );
  } finally {
    client.release();
  }
}