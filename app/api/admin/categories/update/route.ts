
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const id = Number(formData.get("id"));
    const name = String(formData.get("name") || "").trim();
    const name_urdu = String(formData.get("name_urdu") || "").trim();
    const slug = String(formData.get("slug") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const description_urdu = String(
      formData.get("description_urdu") || ""
    ).trim();
    const image = String(formData.get("image") || "").trim();

    const is_active = formData.get("is_active") === "on";

    if (!Number.isInteger(id) || !name || !slug) {
      return NextResponse.json(
        {
          error: "Category ID, name and slug are required.",
        },
        { status: 400 }
      );
    }

    await pool.query(
      `
        UPDATE categories
        SET
          name = $1,
          name_urdu = $2,
          slug = $3,
          description = $4,
          description_urdu = $5,
          image = $6,
          is_active = $7
        WHERE id = $8
      `,
      [
        name,
        name_urdu || null,
        slug,
        description || null,
        description_urdu || null,
        image || null,
        is_active,
        id,
      ]
    );

    return NextResponse.redirect(
      new URL("/admin/categories", request.url)
    );
  } catch (error) {
    console.error("Update category error:", error);

    return NextResponse.json(
      {
        error: "Failed to update category.",
      },
      { status: 500 }
    );
  }
}

