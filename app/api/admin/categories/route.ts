import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
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

    // Required fields
    if (!name || !slug) {
      return NextResponse.json(
        {
          error: "Category name and slug are required.",
        },
        { status: 400 }
      );
    }

    // Check duplicate slug
    const existing = await pool.query(
      `
        SELECT id
        FROM categories
        WHERE slug = $1
        LIMIT 1
      `,
      [slug]
    );

    if (existing.rows.length > 0) {
      return NextResponse.json(
        {
          error: "A category with this slug already exists.",
        },
        { status: 409 }
      );
    }

    // Insert category
    const result = await pool.query(
      `
        INSERT INTO categories (
          name,
          name_urdu,
          slug,
          description,
          description_urdu,
          image,
          is_active
        )
        VALUES (
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7
        )
        RETURNING *
      `,
      [
        name.trim(),
        name_urdu || null,
        slug.trim(),
        description || null,
        description_urdu || null,
        image || null,
        is_active !== false,
      ]
    );

    return NextResponse.json(
      {
        success: true,
        category: result.rows[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Create category error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to create category.",
      },
      { status: 500 }
    );
  }
}