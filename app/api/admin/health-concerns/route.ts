import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT
        id,
        name,
        name_urdu, 
        Sort_order
      FROM health_concerns
      WHERE is_active = true
      ORDER BY sort_order ASC, name ASC
    `);

    return NextResponse.json({
      healthConcerns: result.rows,
    });
  } catch (error) {
    console.error("GET health concerns error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch health concerns",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const id = Number(body.id);

    if (!id || Number.isNaN(id)) {
      return NextResponse.json(
        {
          error: "Valid health concern ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    // Find products linked to this health concern
    const linkedProducts = await pool.query(
      `
      SELECT
        p.id,
        p.name
      FROM product_health_concerns phc
      INNER JOIN products p
        ON p.id = phc.product_id
      WHERE phc.health_concern_id = $1
      ORDER BY p.name ASC
      `,
      [id]
    );

    if (linkedProducts.rows.length > 0) {
      return NextResponse.json(
        {
          error: "This health concern is linked to products.",
          products: linkedProducts.rows,
        },
        {
          status: 409,
        }
      );
    }

    const result = await pool.query(
      `
      DELETE FROM health_concerns
      WHERE id = $1
      RETURNING id, name, name_urdu
      `,
      [id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        {
          error: "Health concern not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Health concern deleted successfully.",
      healthConcern: result.rows[0],
    });
  } catch (error) {
    console.error("DELETE health concern error:", error);

    return NextResponse.json(
      {
        error: "Failed to delete health concern.",
        details:
          error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}