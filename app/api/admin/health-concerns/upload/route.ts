import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const file = formData.get("file");

    // =====================================================
    // VALIDATE FILE
    // =====================================================

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

    // =====================================================
    // VALIDATE MIME TYPE
    // =====================================================

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        {
          error: "Only image files are allowed.",
        },
        {
          status: 400,
        }
      );
    }

    // =====================================================
    // VALIDATE FILE SIZE
    // =====================================================

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

    // =====================================================
    // VALIDATE EXTENSION
    // =====================================================

    const extension =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase() || "jpg";

    const allowedExtensions = [
      "jpg",
      "jpeg",
      "png",
      "webp",
      "gif",
    ];

    if (
      !allowedExtensions.includes(
        extension
      )
    ) {
      return NextResponse.json(
        {
          error: "Unsupported image format.",
        },
        {
          status: 400,
        }
      );
    }

    // =====================================================
    // GENERATE FILE NAME
    // =====================================================

    const fileName =
      `${randomUUID()}.${extension}`;

    // =====================================================
    // UPLOAD DIRECTORY
    // =====================================================

    const uploadDirectory =
      path.join(
        process.cwd(),
        "public",
        "uploads",
        "health-concerns"
      );

    await mkdir(
      uploadDirectory,
      {
        recursive: true,
      }
    );

    // =====================================================
    // FILE PATH
    // =====================================================

    const filePath =
      path.join(
        uploadDirectory,
        fileName
      );

    // =====================================================
    // WRITE FILE
    // =====================================================

    const bytes =
      await file.arrayBuffer();

    await writeFile(
      filePath,
      Buffer.from(bytes)
    );

    // =====================================================
    // PUBLIC URL
    // =====================================================

    const imageUrl =
      `/uploads/health-concerns/${fileName}`;

    return NextResponse.json({
      success: true,
      image_url: imageUrl,
    });
  } catch (error) {
    console.error(
      "Health concern image upload error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to upload health concern image.",
      },
      {
        status: 500,
      }
    );
  }
}