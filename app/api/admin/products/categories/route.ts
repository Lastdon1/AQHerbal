import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT
        id,
        name,
        name_urdu
      FROM categories
      WHERE is_active = true
      ORDER BY name ASC
    `);

    return NextResponse.json({
      categories: result.rows,
    });
  } catch (error) {
    console.error("Categories API error:", error);

    return NextResponse.json(
      {
        error: "Failed to load categories.",
      },
      {
        status: 500,
      }
    );
  }
}