
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const id = Number(formData.get("id"));

    if (!Number.isInteger(id)) {
      return NextResponse.json(
        {
          error: "Invalid category ID.",
        },
        { status: 400 }
      );
    }

    // Check whether products are using this category
    const productResult = await pool.query(
      `
        SELECT COUNT(*)::int AS count
        FROM products
        WHERE category_id = $1
      `,
      [id]
    );

    const productCount = productResult.rows[0]?.count ?? 0;

    // Block deletion if products exist
    if (productCount > 0) {
      return NextResponse.json(
        {
          error: `This category cannot be deleted because it contains ${productCount} product${
            productCount === 1 ? "" : "s"
          }. Please move the product${
            productCount === 1 ? "" : "s"
          } to another category first.`,
        },
        { status: 409 }
      );
    }

    // Delete category
    const deleteResult = await pool.query(
      `
        DELETE FROM categories
        WHERE id = $1
      `,
      [id]
    );

    if (deleteResult.rowCount === 0) {
      return NextResponse.json(
        {
          error: "Category not found.",
        },
        { status: 404 }
      );
    }

    // Return JSON instead of redirecting
    return NextResponse.json({
      success: true,
      message: "Category deleted successfully.",
    });
  } catch (error) {
    console.error("Delete category error:", error);

    return NextResponse.json(
      {
        error: "Failed to delete category.",
      },
      { status: 500 }
    );
  }
}

