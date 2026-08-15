import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

// GET category
export async function GET(
  _request: NextRequest,
  { params }: Params
) {
  try {
    const { id } = await params;

    const categoryId = Number(id);

    if (!Number.isInteger(categoryId)) {
      return NextResponse.json(
        { error: "Invalid category ID." },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `
        SELECT
          id,
          name,
          name_urdu,
          slug,
          description,
          description_urdu,
          image,
          is_active
        FROM categories
        WHERE id = $1
        LIMIT 1
      `,
      [categoryId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Category not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      category: result.rows[0],
    });
  } catch (error) {
    console.error("Get category error:", error);

    return NextResponse.json(
      { error: "Failed to load category." },
      { status: 500 }
    );
  }
}

// DELETE category
export async function DELETE(
  _request: NextRequest,
  { params }: Params
) {
  try {
    const { id } = await params;

    const categoryId = Number(id);

    if (!Number.isInteger(categoryId)) {
      return NextResponse.json(
        { error: "Invalid category ID." },
        { status: 400 }
      );
    }

    // Check whether products are using this category
    const products = await pool.query(
      `
        SELECT COUNT(*)::int AS count
        FROM products
        WHERE category_id = $1
      `,
      [categoryId]
    );

    const productCount = products.rows[0].count;

    if (productCount > 0) {
      return NextResponse.json(
        {
          error: `This category cannot be deleted because ${productCount} product${
            productCount === 1 ? " is" : "s are"
          } using it.`,
        },
        { status: 409 }
      );
    }

    // Delete category
    const result = await pool.query(
      `
        DELETE FROM categories
        WHERE id = $1
        RETURNING id
      `,
      [categoryId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Category not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete category error:",
      error
    );

    return NextResponse.json(
      { error: "Failed to delete category." },
      { status: 500 }
    );
  }
}

// PUT category
export async function PUT(
  request: NextRequest,
  { params }: Params
) {
  try {
    const { id } = await params;

    const categoryId = Number(id);

    if (!Number.isInteger(categoryId)) {
      return NextResponse.json(
        { error: "Invalid category ID." },
        { status: 400 }
      );
    }

    const body = await request.json();

    const {
      name,
      name_urdu,
      slug,
      description,
      description_urdu,
      image,
      is_active,
    } = body;

    if (!name || !slug) {
      return NextResponse.json(
        {
          error: "Category name and slug are required.",
        },
        { status: 400 }
      );
    }

    // Check whether another category already uses this slug
    const duplicate = await pool.query(
      `
        SELECT id
        FROM categories
        WHERE slug = $1
          AND id <> $2
        LIMIT 1
      `,
      [slug.trim(), categoryId]
    );

    if (duplicate.rows.length > 0) {
      return NextResponse.json(
        {
          error:
            "Another category already uses this slug.",
        },
        { status: 409 }
      );
    }

    const result = await pool.query(
      `
        UPDATE categories
        SET
          name = $1,
          name_urdu = $2,
          slug = $3,
          description = $4,
          description_urdu = $5,
          image = $6,
          is_active = $7,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $8
        RETURNING
          id,
          name,
          name_urdu,
          slug,
          description,
          description_urdu,
          image,
          is_active
      `,
      [
        name.trim(),
        name_urdu || null,
        slug.trim(),
        description || null,
        description_urdu || null,
        image || null,
        is_active !== false,
        categoryId,
      ]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Category not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      category: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Update category error:",
      error
    );

    return NextResponse.json(
      { error: "Failed to update category." },
      { status: 500 }
    );
  }
}