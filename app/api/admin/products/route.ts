// app/api/admin/products/route.ts

import { NextResponse } from "next/server";
import pool from "@/lib/db";

type ImageInput = {
  image_url: string;
  alt_text?: string | null;
  sort_order?: number;
  is_primary?: boolean;
};

type VariantInput = {
  quantity_value: number;
  unit: string;
  price: number;
  old_price?: number | null;
  is_default?: boolean;
  is_active?: boolean;
};

type ProductInput = {
  name: string;
  name_urdu?: string | null;
  slug: string;
  category_id: number;

  description?: string | null;
  description_urdu?: string | null;

  benefits?: string | null;
  benefits_urdu?: string | null;

  ingredients?: string | null;
  ingredients_urdu?: string | null;

  usage?: string | null;
  usage_urdu?: string | null;

  is_active?: boolean;

  /*
   * Product display order.
   *
   * 1 = first
   * 2 = second
   * 0 / omitted = last
   */
  sort_order?: number | null;

  health_concern_ids?: number[];
  images: ImageInput[];
  variants: VariantInput[];
};

export async function POST(request: Request) {
  const client = await pool.connect();

  try {
    const body = (await request.json()) as ProductInput;

    /* --------------------------------
       Basic validation
    -------------------------------- */

    const name = body.name?.trim();
    const nameUrdu = body.name_urdu?.trim() || null;
    const slug = body.slug?.trim();

    if (!name) {
      return NextResponse.json(
        { error: "Product name is required." },
        { status: 400 }
      );
    }

    if (!slug) {
      return NextResponse.json(
        { error: "Product slug is required." },
        { status: 400 }
      );
    }

    if (
      !Number.isInteger(body.category_id) ||
      body.category_id <= 0
    ) {
      return NextResponse.json(
        { error: "A valid category is required." },
        { status: 400 }
      );
    }

    /* --------------------------------
       Slug validation
    -------------------------------- */

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      return NextResponse.json(
        {
          error:
            "Slug may only contain lowercase letters, numbers and hyphens.",
        },
        { status: 400 }
      );
    }

    /* --------------------------------
       Product content
    -------------------------------- */

    const description =
      body.description?.trim() || null;

    const descriptionUrdu =
      body.description_urdu?.trim() || null;

    const benefits =
      body.benefits?.trim() || null;

    const benefitsUrdu =
      body.benefits_urdu?.trim() || null;

    const ingredients =
      body.ingredients?.trim() || null;

    const ingredientsUrdu =
      body.ingredients_urdu?.trim() || null;

    const usage =
      body.usage?.trim() || null;

    const usageUrdu =
      body.usage_urdu?.trim() || null;

    /* --------------------------------
       Product sort order
    -------------------------------- */

    let requestedSortOrder = 0;

    /*
     * IMPORTANT:
     * sort_order is typed as number | null,
     * so do not compare it with "".
     */
    if (
      body.sort_order !== undefined &&
      body.sort_order !== null
    ) {
      const parsedSortOrder =
        Number(body.sort_order);

      if (
        !Number.isInteger(parsedSortOrder) ||
        parsedSortOrder < 0
      ) {
        return NextResponse.json(
          {
            error:
              "Sort order must be a whole number greater than or equal to 0.",
          },
          { status: 400 }
        );
      }

      requestedSortOrder =
        parsedSortOrder;
    }

    /* --------------------------------
       Health concerns
    -------------------------------- */

    const healthConcernIds = Array.isArray(
      body.health_concern_ids
    )
      ? [
          ...new Set(
            body.health_concern_ids
              .map(Number)
              .filter(
                (id) =>
                  Number.isInteger(id) &&
                  id > 0
              )
          ),
        ]
      : [];

    /* --------------------------------
       Images validation
    -------------------------------- */

    if (
      !Array.isArray(body.images) ||
      body.images.length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "At least one product image is required.",
        },
        { status: 400 }
      );
    }

    const images = body.images.map(
      (image, index) => ({
        image_url:
          image.image_url?.trim() || "",
        alt_text:
          image.alt_text?.trim() || null,
        sort_order: index,
        is_primary:
          image.is_primary === true,
      })
    );

    if (
      images.some(
        (image) => !image.image_url
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Every product image must have an image URL.",
        },
        { status: 400 }
      );
    }

    /* --------------------------------
       Ensure exactly one primary image
    -------------------------------- */

    const primaryImageIndex =
      images.findIndex(
        (image) => image.is_primary
      );

    if (primaryImageIndex === -1) {
      images[0].is_primary = true;
    } else {
      images.forEach(
        (image, index) => {
          image.is_primary =
            index === primaryImageIndex;
        }
      );
    }

    /* --------------------------------
       Variants validation
    -------------------------------- */

    if (
      !Array.isArray(body.variants) ||
      body.variants.length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "At least one product variant is required.",
        },
        { status: 400 }
      );
    }

    const variants = body.variants.map(
      (variant) => ({
        quantity_value: Number(
          variant.quantity_value
        ),
        unit:
          variant.unit?.trim() || "",
        price: Number(
          variant.price
        ),
        old_price:
          variant.old_price === null ||
          variant.old_price === undefined
            ? null
            : Number(
                variant.old_price
              ),
        is_default:
          variant.is_default === true,
        is_active:
          variant.is_active !== false,
      })
    );

    const invalidVariant =
      variants.some(
        (variant) =>
          !Number.isFinite(
            variant.quantity_value
          ) ||
          variant.quantity_value <= 0 ||
          !variant.unit ||
          !Number.isFinite(
            variant.price
          ) ||
          variant.price < 0 ||
          (variant.old_price !== null &&
            (!Number.isFinite(
              variant.old_price
            ) ||
              variant.old_price < 0))
      );

    if (invalidVariant) {
      return NextResponse.json(
        {
          error:
            "One or more product variants contain invalid values.",
        },
        { status: 400 }
      );
    }

    /* --------------------------------
       Ensure exactly one default variant
    -------------------------------- */

    const defaultVariantIndex =
      variants.findIndex(
        (variant) =>
          variant.is_default
      );

    if (defaultVariantIndex === -1) {
      variants[0].is_default = true;
    } else {
      variants.forEach(
        (variant, index) => {
          variant.is_default =
            index ===
            defaultVariantIndex;
        }
      );
    }

    /* --------------------------------
       Start database transaction
    -------------------------------- */

    await client.query("BEGIN");

    /* --------------------------------
       Verify category
    -------------------------------- */

    const categoryResult =
      await client.query(
        `
          SELECT id
          FROM categories
          WHERE id = $1
        `,
        [body.category_id]
      );

    if (
      categoryResult.rows.length === 0
    ) {
      await client.query("ROLLBACK");

      return NextResponse.json(
        {
          error:
            "The selected category does not exist.",
        },
        { status: 400 }
      );
    }

    /* --------------------------------
       Verify health concerns
    -------------------------------- */

    if (healthConcernIds.length > 0) {
      const healthConcernResult =
        await client.query(
          `
            SELECT id
            FROM health_concerns
            WHERE id = ANY($1::int[])
              AND is_active = true
          `,
          [healthConcernIds]
        );

      const validHealthConcernIds =
        new Set(
          healthConcernResult.rows.map(
            (row) => Number(row.id)
          )
        );

      const invalidHealthConcern =
        healthConcernIds.some(
          (id) =>
            !validHealthConcernIds.has(
              id
            )
        );

      if (invalidHealthConcern) {
        await client.query("ROLLBACK");

        return NextResponse.json(
          {
            error:
              "One or more selected health concerns are invalid.",
          },
          { status: 400 }
        );
      }
    }

    /* --------------------------------
       Determine product position
    -------------------------------- */

    const existingProducts =
      await client.query(
        `
          SELECT id, sort_order
          FROM products
          ORDER BY sort_order ASC, id ASC
          FOR UPDATE
        `
      );

    const productCount =
      existingProducts.rows.length;

    /*
     * 0 means "last".
     *
     * If the requested position is greater
     * than the available range, also put it
     * at the end.
     */
    let finalSortOrder =
      requestedSortOrder;

    if (
      finalSortOrder <= 0 ||
      finalSortOrder >
        productCount + 1
    ) {
      finalSortOrder =
        productCount + 1;
    }

    /* --------------------------------
       Shift existing products
    -------------------------------- */

    await client.query(
      `
        UPDATE products
        SET
          sort_order = sort_order + 1,
          updated_at = CURRENT_TIMESTAMP
        WHERE sort_order >= $1
      `,
      [finalSortOrder]
    );

    /* --------------------------------
       Create product
    -------------------------------- */

    const productResult =
      await client.query(
        `
          INSERT INTO products (
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
            sort_order
          )
          VALUES (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7,
            $8,
            $9,
            $10,
            $11,
            $12,
            $13,
            $14
          )
          RETURNING id, sort_order
        `,
        [
          name,
          nameUrdu,
          slug,
          body.category_id,
          description,
          descriptionUrdu,
          benefits,
          benefitsUrdu,
          ingredients,
          ingredientsUrdu,
          usage,
          usageUrdu,
          body.is_active !== false,
          finalSortOrder,
        ]
      );

    const productId =
      productResult.rows[0].id;

    /* --------------------------------
       Insert product images
    -------------------------------- */

    for (const image of images) {
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
          image.image_url,
          image.alt_text,
          image.sort_order,
          image.is_primary,
        ]
      );
    }

    /* --------------------------------
       Insert product variants
    -------------------------------- */

    for (const variant of variants) {
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
          variant.quantity_value,
          variant.unit,
          variant.price,
          variant.old_price,
          variant.is_default,
          variant.is_active,
        ]
      );
    }

    /* --------------------------------
       Insert product health concerns
    -------------------------------- */

    for (const healthConcernId of healthConcernIds) {
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
        `,
        [
          productId,
          healthConcernId,
        ]
      );
    }

    /* --------------------------------
       Commit transaction
    -------------------------------- */

    await client.query("COMMIT");

    return NextResponse.json(
      {
        success: true,
        product_id: productId,
        sort_order: finalSortOrder,
        message:
          "Product created successfully.",
      },
      { status: 201 }
    );
  } catch (error) {
    /* --------------------------------
       Rollback transaction
    -------------------------------- */

    try {
      await client.query("ROLLBACK");
    } catch (rollbackError) {
      console.error(
        "Create product rollback error:",
        rollbackError
      );
    }

    console.error(
      "Create product API error:",
      error
    );

    /* --------------------------------
       Duplicate slug
    -------------------------------- */

    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "23505"
    ) {
      return NextResponse.json(
        {
          error:
            "A product with this slug already exists.",
        },
        { status: 409 }
      );
    }

    /* --------------------------------
       Foreign key error
    -------------------------------- */

    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "23503"
    ) {
      return NextResponse.json(
        {
          error:
            "A selected category or health concern does not exist.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error:
          "Failed to create product. Please try again.",
      },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}