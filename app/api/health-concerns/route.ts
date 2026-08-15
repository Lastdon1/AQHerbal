import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

// GET — Fetch all health concerns
export async function GET() {
  try {
    const result = await pool.query(`
      SELECT
        id,
        name,
        name_urdu,
        slug,
        description,
        description_urdu,
        image,
        sort_order,
        is_active
      FROM health_concerns
      ORDER BY sort_order ASC, id DESC
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("GET health concerns error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch health concerns",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// POST — Create health concern
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
      sort_order,
      is_active,
    } = body;

    if (!name || !slug) {
      return NextResponse.json(
        {
          error: "Name and slug are required",
        },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `
      INSERT INTO health_concerns
      (
        name,
        name_urdu,
        slug,
        description,
        description_urdu,
        image,
        sort_order,
        is_active
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
      `,
      [
        name.trim(),
        name_urdu?.trim() || null,
        slug.trim(),
        description?.trim() || null,
        description_urdu?.trim() || null,
        image?.trim() || null,
        Number(sort_order) || 0,
        is_active ?? true,
      ]
    );

    return NextResponse.json(result.rows[0], {
      status: 201,
    });
  } catch (error) {
    console.error("POST health concern error:", error);

    return NextResponse.json(
      {
        error: "Failed to create health concern",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}