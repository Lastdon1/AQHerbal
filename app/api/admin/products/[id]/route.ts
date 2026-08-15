// app/api/admin/products/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

type ProductImage = {
  image_url: string;
  alt_text?: string | null;
  sort_order?: number;
  is_primary?: boolean;
};

type ProductVariant = {
  quantity_value: number;
  unit: string;
  price: number;
  old_price?: number | null;
  is_default?: boolean;
  is_active?: boolean;
};

type ProductPayload = {
  name: string;
  name_urdu?: string | null;
  slug: string;
  category_id?: number | null;

  description?: string | null;
  description_urdu?: string | null;

  benefits?: string | null;
  benefits_urdu?: string | null;

  ingredients?: string | null;
  ingredients_urdu?: string | null;

  usage?: string | null;
  usage_urdu?: string | null;

  is_active?: boolean;

  is_featured?: boolean;
  is_home_herb?: boolean;
  is_home_nuskhajat?: boolean;
  is_home_murabba?: boolean;

  images?: ProductImage[];
  variants?: ProductVariant[];
  health_concern_ids?: number[];
};

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

/* ============================================================
   HELPERS
============================================================ */

function parseProductId(id: string): number | null {
  const productId = Number(id);

  if (!Number.isInteger(productId) || productId <= 0) {
    return null;
  }

  return productId;
}

function cleanNullableString(
  value?: string | null
): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  return trimmed || null;
}

/* ============================================================
   GET PRODUCT
============================================================ */

export async function GET(
  _request: NextRequest,
  { params }: RouteContext
) {
  const client = await pool.connect();

  try {
    const { id } = await params;

    const productId = parseProductId(id);

    if (productId === null) {
      return NextResponse.json(
        {
          error: "Invalid product ID",
        },
        {
          status: 400,
        }
      );
    }

    /* --------------------------------------------------------
       PRODUCT
    -------------------------------------------------------- */

    const productResult = await client.query(
      `
      SELECT
        p.id,
        p.name,
        p.name_urdu,
        p.slug,
        p.category_id,

        p.description,
        p.description_urdu,

        p.benefits,
        p.benefits_urdu,

        p.ingredients,
        p.ingredients_urdu,

        p.usage,
        p.usage_urdu,

        p.is_active,

        p.is_featured,
        p.is_home_herb,
        p.is_home_nuskhajat,
        p.is_home_murabba,

        p.created_at,
        p.updated_at,

        c.name AS category_name

      FROM products p

      LEFT JOIN categories c
        ON c.id = p.category_id

      WHERE p.id = $1
      `,
      [productId]
    );

    if (productResult.rows.length === 0) {
      return NextResponse.json(
        {
          error: "Product not found",
        },
        {
          status: 404,
        }
      );
    }

    /* --------------------------------------------------------
       LOAD RELATED DATA IN PARALLEL
    -------------------------------------------------------- */

    const [
      imagesResult,
      variantsResult,
      healthConcernsResult,
    ] = await Promise.all([
      client.query(
        `
        SELECT
          product_id,
          image_url,
          alt_text,
          sort_order,
          is_primary,
          created_at

        FROM product_images

        WHERE product_id = $1

        ORDER BY
          is_primary DESC,
          sort_order ASC,
          created_at ASC
        `,
        [productId]
      ),

      client.query(
        `
        SELECT
          id,
          product_id,
          quantity_value,
          unit,
          price,
          old_price,
          is_default,
          is_active,
          created_at,
          updated_at

        FROM product_variants

        WHERE product_id = $1

        ORDER BY
          is_default DESC,
          id ASC
        `,
        [productId]
      ),

      client.query(
        `
        SELECT
          hc.id,
          hc.name,
          hc.name_urdu,
          hc.slug

        FROM health_concerns hc

        INNER JOIN product_health_concerns phc
          ON phc.health_concern_id = hc.id

        WHERE phc.product_id = $1

        ORDER BY
          hc.sort_order ASC,
          hc.name ASC
        `,
        [productId]
      ),
    ]);

    return NextResponse.json({
      product: productResult.rows[0],
      images: imagesResult.rows,
      variants: variantsResult.rows,
      health_concerns: healthConcernsResult.rows,
    });
  } catch (error) {
    console.error("GET product error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch product",
      },
      {
        status: 500,
      }
    );
  } finally {
    client.release();
  }
}

/* ============================================================
   UPDATE PRODUCT
============================================================ */

export async function PUT(
  request: NextRequest,
  { params }: RouteContext
) {
  const client = await pool.connect();

  try {
    const { id } = await params;

    const productId = parseProductId(id);

    if (productId === null) {
      return NextResponse.json(
        {
          error: "Invalid product ID",
        },
        {
          status: 400,
        }
      );
    }

    let body: ProductPayload;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          error: "Invalid JSON request body",
        },
        {
          status: 400,
        }
      );
    }

    const {
      name,
      name_urdu,
      slug,
      category_id,

      description,
      description_urdu,

      benefits,
      benefits_urdu,

      ingredients,
      ingredients_urdu,

      usage,
      usage_urdu,

      is_active,

      is_featured,
      is_home_herb,
      is_home_nuskhajat,
      is_home_murabba,

      images = [],
      variants = [],
      health_concern_ids = [],
    } = body;

    /* --------------------------------------------------------
       BASIC VALIDATION
    -------------------------------------------------------- */

    const productName =
      typeof name === "string"
        ? name.trim()
        : "";

    const productSlug =
      typeof slug === "string"
        ? slug.trim()
        : "";

    if (!productName) {
      return NextResponse.json(
        {
          error: "Product name is required",
        },
        {
          status: 400,
        }
      );
    }

    if (!productSlug) {
      return NextResponse.json(
        {
          error: "Product slug is required",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !Array.isArray(images) ||
      !Array.isArray(variants) ||
      !Array.isArray(health_concern_ids)
    ) {
      return NextResponse.json(
        {
          error: "Invalid product data format",
        },
        {
          status: 400,
        }
      );
    }

    await client.query("BEGIN");

    /* --------------------------------------------------------
       CHECK PRODUCT EXISTS + LOCK IT
    -------------------------------------------------------- */

    const existingProduct = await client.query(
      `
      SELECT
        id
      FROM products
      WHERE id = $1
      FOR UPDATE
      `,
      [productId]
    );

    if (existingProduct.rows.length === 0) {
      await client.query("ROLLBACK");

      return NextResponse.json(
        {
          error: "Product not found",
        },
        {
          status: 404,
        }
      );
    }

    /* --------------------------------------------------------
       CHECK DUPLICATE SLUG
    -------------------------------------------------------- */

    const duplicateSlug = await client.query(
      `
      SELECT id
      FROM products
      WHERE slug = $1
        AND id <> $2
      LIMIT 1
      `,
      [productSlug, productId]
    );

    if (duplicateSlug.rows.length > 0) {
      await client.query("ROLLBACK");

      return NextResponse.json(
        {
          error:
            "Another product already uses this slug",
        },
        {
          status: 409,
        }
      );
    }

    /* --------------------------------------------------------
       CATEGORY VALIDATION
    -------------------------------------------------------- */

    let categoryId: number | null = null;

    if (
      category_id !== undefined &&
      category_id !== null
    ) {
      const parsedCategoryId =
        Number(category_id);

      if (
        !Number.isInteger(parsedCategoryId) ||
        parsedCategoryId <= 0
      ) {
        await client.query("ROLLBACK");

        return NextResponse.json(
          {
            error: "Invalid category ID",
          },
          {
            status: 400,
          }
        );
      }

      const categoryResult =
        await client.query(
          `
          SELECT id
          FROM categories
          WHERE id = $1
          LIMIT 1
          `,
          [parsedCategoryId]
        );

      if (categoryResult.rows.length === 0) {
        await client.query("ROLLBACK");

        return NextResponse.json(
          {
            error:
              "Selected category does not exist",
          },
          {
            status: 400,
          }
        );
      }

      categoryId = parsedCategoryId;
    }

    /* --------------------------------------------------------
       UPDATE PRODUCT
    -------------------------------------------------------- */

    const productResult = await client.query(
      `
      UPDATE products
      SET
        name = $1,
        name_urdu = $2,
        slug = $3,
        category_id = $4,

        description = $5,
        description_urdu = $6,

        benefits = $7,
        benefits_urdu = $8,

        ingredients = $9,
        ingredients_urdu = $10,

        usage = $11,
        usage_urdu = $12,

        is_active = $13,

        is_featured = $14,
        is_home_herb = $15,
        is_home_nuskhajat = $16,
        is_home_murabba = $17,

        updated_at = CURRENT_TIMESTAMP

      WHERE id = $18

      RETURNING *
      `,
      [
        productName,

        cleanNullableString(name_urdu),

        productSlug,

        categoryId,

        cleanNullableString(description),

        cleanNullableString(description_urdu),

        cleanNullableString(benefits),

        cleanNullableString(benefits_urdu),

        cleanNullableString(ingredients),

        cleanNullableString(ingredients_urdu),

        cleanNullableString(usage),

        cleanNullableString(usage_urdu),

        is_active ?? true,

        is_featured ?? false,
        is_home_herb ?? false,
        is_home_nuskhajat ?? false,
        is_home_murabba ?? false,

        productId,
      ]
    );

    /* ========================================================
       IMAGES
    ======================================================== */

    await client.query(
      `
      DELETE FROM product_images
      WHERE product_id = $1
      `,
      [productId]
    );

    const validImages = images.filter(
      (image) =>
        image &&
        typeof image.image_url === "string" &&
        image.image_url.trim()
    );

    let primaryImageFound = false;

    for (
      let index = 0;
      index < validImages.length;
      index++
    ) {
      const image = validImages[index];

      let isPrimary =
        image.is_primary === true;

      if (
        isPrimary &&
        primaryImageFound
      ) {
        isPrimary = false;
      }

      if (isPrimary) {
        primaryImageFound = true;
      }

      await client.query(
        `
        INSERT INTO product_images (
          product_id,
          image_url,
          alt_text,
          sort_order,
          is_primary
        )

        VALUES (
          $1,
          $2,
          $3,
          $4,
          $5
        )
        `,
        [
          productId,

          image.image_url.trim(),

          cleanNullableString(
            image.alt_text
          ),

          Number.isInteger(
            image.sort_order
          )
            ? image.sort_order
            : index,

          isPrimary,
        ]
      );
    }

    /* --------------------------------------------------------
       ENSURE FIRST IMAGE IS PRIMARY
    -------------------------------------------------------- */

    if (
      validImages.length > 0 &&
      !primaryImageFound
    ) {
      await client.query(
        `
        UPDATE product_images
        SET
          is_primary = true
        WHERE id = (
          SELECT id
          FROM product_images
          WHERE product_id = $1
          ORDER BY
            sort_order ASC,
            id ASC
          LIMIT 1
        )
        `,
        [productId]
      );
    }

    /* ========================================================
       VARIANTS
    ======================================================== */

    await client.query(
      `
      DELETE FROM product_variants
      WHERE product_id = $1
      `,
      [productId]
    );

    const validVariants = variants.filter(
      (variant) => {
        const quantity =
          Number(
            variant.quantity_value
          );

        const price =
          Number(
            variant.price
          );

        return (
          Number.isFinite(quantity) &&
          quantity > 0 &&
          typeof variant.unit === "string" &&
          variant.unit.trim() !== "" &&
          Number.isFinite(price) &&
          price >= 0
        );
      }
    );

    let defaultVariantFound = false;

    for (const variant of validVariants) {
      let isDefault =
        variant.is_default === true;

      if (
        isDefault &&
        defaultVariantFound
      ) {
        isDefault = false;
      }

      if (isDefault) {
        defaultVariantFound = true;
      }

      const oldPrice =
        variant.old_price === undefined ||
        variant.old_price === null ||
        variant.old_price === ""
          ? null
          : Number(
              variant.old_price
            );

      await client.query(
        `
        INSERT INTO product_variants (
          product_id,
          quantity_value,
          unit,
          price,
          old_price,
          is_default,
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
        `,
        [
          productId,

          Number(
            variant.quantity_value
          ),

          variant.unit.trim(),

          Number(
            variant.price
          ),

          oldPrice !== null &&
          Number.isFinite(oldPrice)
            ? oldPrice
            : null,

          isDefault,

          variant.is_active ?? true,
        ]
      );
    }

    /* ========================================================
       HEALTH CONCERNS
    ======================================================== */

    const uniqueHealthConcernIds = [
      ...new Set(
        health_concern_ids
          .map(Number)
          .filter(
            (healthConcernId) =>
              Number.isInteger(
                healthConcernId
              ) &&
              healthConcernId > 0
          )
      ),
    ];

    /* --------------------------------------------------------
       VERIFY HEALTH CONCERNS
    -------------------------------------------------------- */

    let validHealthConcernIds: number[] = [];

    if (
      uniqueHealthConcernIds.length > 0
    ) {
      const healthConcernResult =
        await client.query(
          `
          SELECT id
          FROM health_concerns
          WHERE id = ANY($1::int[])
          `,
          [uniqueHealthConcernIds]
        );

      validHealthConcernIds =
        healthConcernResult.rows.map(
          (row: { id: number }) =>
            Number(row.id)
        );
    }

    /* --------------------------------------------------------
       REPLACE HEALTH CONCERN RELATIONSHIPS
    -------------------------------------------------------- */

    await client.query(
      `
      DELETE FROM product_health_concerns
      WHERE product_id = $1
      `,
      [productId]
    );

    if (
      validHealthConcernIds.length > 0
    ) {
      for (
        const healthConcernId of
          validHealthConcernIds
      ) {
        await client.query(
          `
          INSERT INTO product_health_concerns (
            product_id,
            health_concern_id
          )

          VALUES (
            $1,
            $2
          )

          ON CONFLICT (
            product_id,
            health_concern_id
          )

          DO NOTHING
          `,
          [
            productId,
            healthConcernId,
          ]
        );
      }
    }

    /* ========================================================
       COMMIT
    ======================================================== */

    await client.query("COMMIT");

    return NextResponse.json({
      success: true,
      message:
        "Product updated successfully",
      product:
        productResult.rows[0],
    });
  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch (rollbackError) {
      console.error(
        "Product rollback error:",
        rollbackError
      );
    }

    console.error(
      "PUT product error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to update product",
        details:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      {
        status: 500,
      }
    );
  } finally {
    client.release();
  }
}

/* ============================================================
   DELETE PRODUCT
============================================================ */

export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext
) {
  const client = await pool.connect();

  try {
    const { id } = await params;

    const productId = parseProductId(id);

    if (productId === null) {
      return NextResponse.json(
        {
          error: "Invalid product ID",
        },
        {
          status: 400,
        }
      );
    }

    await client.query("BEGIN");

    /* --------------------------------------------------------
       FIND + LOCK PRODUCT
    -------------------------------------------------------- */

    const productResult = await client.query(
      `
      SELECT
        id,
        name
      FROM products
      WHERE id = $1
      FOR UPDATE
      `,
      [productId]
    );

    if (productResult.rows.length === 0) {
      await client.query("ROLLBACK");

      return NextResponse.json(
        {
          error: "Product not found",
        },
        {
          status: 404,
        }
      );
    }

    /* --------------------------------------------------------
       DELETE HEALTH CONCERN RELATIONSHIPS
    -------------------------------------------------------- */

    await client.query(
      `
      DELETE FROM product_health_concerns
      WHERE product_id = $1
      `,
      [productId]
    );

    /* --------------------------------------------------------
       DELETE IMAGES
    -------------------------------------------------------- */

    await client.query(
      `
      DELETE FROM product_images
      WHERE product_id = $1
      `,
      [productId]
    );

    /* --------------------------------------------------------
       DELETE VARIANTS
    -------------------------------------------------------- */

    await client.query(
      `
      DELETE FROM product_variants
      WHERE product_id = $1
      `,
      [productId]
    );

    /* --------------------------------------------------------
       DELETE PRODUCT
    -------------------------------------------------------- */

    const deleteResult =
      await client.query(
        `
        DELETE FROM products
        WHERE id = $1

        RETURNING
          id,
          name
        `,
        [productId]
      );

    if (deleteResult.rows.length === 0) {
      await client.query("ROLLBACK");

      return NextResponse.json(
        {
          error:
            "Product could not be deleted",
        },
        {
          status: 500,
        }
      );
    }

    /* --------------------------------------------------------
       COMMIT
    -------------------------------------------------------- */

    await client.query("COMMIT");

    return NextResponse.json({
      success: true,
      message:
        "Product deleted successfully",
      product:
        deleteResult.rows[0],
    });
  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch (rollbackError) {
      console.error(
        "Delete product rollback error:",
        rollbackError
      );
    }

    console.error(
      "DELETE product error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to delete product",
      },
      {
        status: 500,
      }
    );
  } finally {
    client.release();
  }
}