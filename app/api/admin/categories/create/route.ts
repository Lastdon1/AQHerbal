
import { NextResponse } from "next/server";
import pool from "@/lib/db";
import fs from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const name = String(formData.get("name") || "").trim();

    const name_urdu = String(
      formData.get("name_urdu") || ""
    ).trim();

    const slug = String(
      formData.get("slug") || ""
    ).trim();

    const description = String(
      formData.get("description") || ""
    ).trim();

    const description_urdu = String(
      formData.get("description_urdu") || ""
    ).trim();

    const is_active =
      formData.get("is_active") === "on";

    const imageFile = formData.get("image");

    // --------------------------------
    // Validate required fields
    // --------------------------------

    if (!name || !slug) {
      return NextResponse.json(
        {
          error:
            "Category name and slug are required.",
        },
        { status: 400 }
      );
    }

    // --------------------------------
    // Check duplicate slug
    // --------------------------------

    const existingCategory = await pool.query(
      `
        SELECT id
        FROM categories
        WHERE slug = $1
        LIMIT 1
      `,
      [slug]
    );

    if (existingCategory.rows.length > 0) {
      return NextResponse.json(
        {
          error: `A category with the slug "${slug}" already exists.`,
        },
        { status: 409 }
      );
    }

    // --------------------------------
    // Image upload
    // --------------------------------

    let imagePath: string | null = null;

    if (
      imageFile &&
      imageFile instanceof File &&
      imageFile.size > 0
    ) {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/jpg",
      ];

      // Check file type
      if (!allowedTypes.includes(imageFile.type)) {
        return NextResponse.json(
          {
            error:
              "Only JPG, PNG and WebP images are allowed.",
          },
          { status: 400 }
        );
      }

      // Maximum 5MB
      if (imageFile.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          {
            error:
              "Image size must be less than 5MB.",
          },
          { status: 400 }
        );
      }

      // Determine extension
      const extension =
        imageFile.type === "image/jpeg" ||
        imageFile.type === "image/jpg"
          ? "jpg"
          : imageFile.type === "image/png"
          ? "png"
          : "webp";

      // Clean slug for filename
      const safeSlug = slug
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

      const filename = `${safeSlug}-${Date.now()}.${extension}`;

      // Upload directory
      const uploadDirectory = path.join(
        process.cwd(),
        "public",
        "uploads",
        "categories"
      );

      // Make directory if it doesn't exist
      await fs.mkdir(uploadDirectory, {
        recursive: true,
      });

      // Full file path
      const filePath = path.join(
        uploadDirectory,
        filename
      );

      // Convert file to Buffer
      const bytes =
        await imageFile.arrayBuffer();

      const buffer = Buffer.from(bytes);

      // Save image
      await fs.writeFile(
        filePath,
        buffer
      );

      // Save public URL
      imagePath =
        `/uploads/categories/${filename}`;
    }

    // --------------------------------
    // Create category
    // --------------------------------

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
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id
      `,
      [
        name,
        name_urdu || null,
        slug,
        description || null,
        description_urdu || null,
        imagePath,
        is_active,
      ]
    );

    // --------------------------------
    // Success response
    // --------------------------------

    return NextResponse.json(
      {
        success: true,
        message:
          "Category created successfully.",
        categoryId:
          result.rows[0].id,
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
        error:
          "Failed to create category.",
      },
      { status: 500 }
    );
  }
}

