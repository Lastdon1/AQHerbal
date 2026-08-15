import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query(
      `
        SELECT
          id,
          name,
          name_urdu,
          slug
        FROM categories
        WHERE is_active = true
        ORDER BY id ASC
      `
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("GET CATEGORIES ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to load categories",
      },
      {
        status: 500,
      }
    );
  }
}