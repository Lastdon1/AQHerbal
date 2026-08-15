import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    /* ============================================================
       VALIDATE FILE
    ============================================================ */

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error: "No logo file was provided.",
        },
        {
          status: 400,
        }
      );
    }

    /* ============================================================
       WEBP ONLY
    ============================================================ */

    if (
      file.type !== "image/webp" &&
      !file.name.toLowerCase().endsWith(".webp")
    ) {
      return NextResponse.json(
        {
          error: "Logo must be a WebP image.",
        },
        {
          status: 400,
        }
      );
    }

    /* ============================================================
       MAX FILE SIZE
    ============================================================ */

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error: "Logo must be smaller than 5MB.",
        },
        {
          status: 400,
        }
      );
    }

    /* ============================================================
       UPLOAD DIRECTORY
    ============================================================ */

    const uploadDirectory = path.join(
      process.cwd(),
      "public",
      "uploads",
      "site"
    );

    await mkdir(uploadDirectory, {
      recursive: true,
    });

    /* ============================================================
       FIXED LOGO FILE
       
       There is only one global site logo.
       Uploading a new logo replaces the existing logo.webp.
    ============================================================ */

    const filePath = path.join(
      uploadDirectory,
      "logo.webp"
    );

    const bytes = await file.arrayBuffer();

    await writeFile(
      filePath,
      Buffer.from(bytes)
    );

    /* ============================================================
       IMAGE URL
    ============================================================ */

    const imageUrl =
      "/uploads/site/logo.webp";

    return NextResponse.json({
      success: true,
      image_url: imageUrl,
    });
  } catch (error) {
    console.error(
      "Site logo upload error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to upload logo.",
      },
      {
        status: 500,
      }
    );
  }
}