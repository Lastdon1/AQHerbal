import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error: "No image file was provided.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * WebP only
     */
    if (file.type !== "image/webp") {
      return NextResponse.json(
        {
          error: "Only WebP images are allowed.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Also check the filename extension.
     */
    const extension =
      file.name.split(".").pop()?.toLowerCase();

    if (extension !== "webp") {
      return NextResponse.json(
        {
          error: "Only .webp image files are allowed.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Maximum 5MB
     */
    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error: "Image must be smaller than 5MB.",
        },
        {
          status: 400,
        }
      );
    }

    const fileName = `${randomUUID()}.webp`;

    const uploadDirectory = path.join(
      process.cwd(),
      "public",
      "uploads",
      "about"
    );

    await mkdir(uploadDirectory, {
      recursive: true,
    });

    const filePath = path.join(
      uploadDirectory,
      fileName
    );

    const bytes = await file.arrayBuffer();

    await writeFile(
      filePath,
      Buffer.from(bytes)
    );

    const imageUrl =
      `/uploads/about/${fileName}`;

    return NextResponse.json({
      success: true,
      image_url: imageUrl,
    });
  } catch (error) {
    console.error(
      "About image upload error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to upload About image.",
      },
      {
        status: 500,
      }
    );
  }
}