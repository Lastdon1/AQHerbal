import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

// =====================================================
// GET — Fetch One Health Concern
// =====================================================

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const concernId = Number(id);

    if (!Number.isInteger(concernId)) {
      return NextResponse.json(
        { error: "Invalid health concern ID" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `
      SELECT *
      FROM health_concerns
      WHERE id = $1
      `,
      [concernId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Health concern not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("GET health concern error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch health concern",
      },
      { status: 500 }
    );
  }
}

// =====================================================
// PUT — Update One Health Concern
// =====================================================

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const concernId = Number(id);

    if (!Number.isInteger(concernId)) {
      return NextResponse.json(
        { error: "Invalid health concern ID" },
        { status: 400 }
      );
    }

    const body = await request.json();

    const {
      name,
      name_urdu,
      slug,
      description,
      description_urdu,
      image,
      position,
      after_id,
      is_active,
    } = body;

    // =================================================
    // BASIC VALIDATION
    // =================================================

    if (!name || !name.trim()) {
      return NextResponse.json(
        {
          error: "Name is required",
        },
        { status: 400 }
      );
    }

    if (!slug || !slug.trim()) {
      return NextResponse.json(
        {
          error: "Slug is required",
        },
        { status: 400 }
      );
    }

    // =================================================
    // GET CURRENT HEALTH CONCERN
    // =================================================

    const currentResult = await pool.query(
      `
      SELECT
        id,
        sort_order
      FROM health_concerns
      WHERE id = $1
      `,
      [concernId]
    );

    if (currentResult.rows.length === 0) {
      return NextResponse.json(
        {
          error: "Health concern not found",
        },
        { status: 404 }
      );
    }

    const currentOrder = Number(
      currentResult.rows[0].sort_order
    );

    let newSortOrder = currentOrder;

    // =================================================
    // POSITION: KEEP
    // =================================================

    if (!position || position === "keep") {
      newSortOrder = currentOrder;
    }

    // =================================================
    // POSITION: FIRST
    // =================================================

    if (position === "first") {
      await pool.query(
        `
        UPDATE health_concerns
        SET sort_order = sort_order + 1
        WHERE id <> $1
        `,
        [concernId]
      );

      newSortOrder = 1;
    }

    // =================================================
    // POSITION: AFTER ANOTHER HEALTH CONCERN
    // =================================================

    if (position === "after") {
      const afterId = Number(after_id);

      if (!Number.isInteger(afterId)) {
        return NextResponse.json(
          {
            error:
              "Please select a health concern to place this after.",
          },
          { status: 400 }
        );
      }

      if (afterId === concernId) {
        return NextResponse.json(
          {
            error:
              "A health concern cannot be placed after itself.",
          },
          { status: 400 }
        );
      }

      const afterResult = await pool.query(
        `
        SELECT sort_order
        FROM health_concerns
        WHERE id = $1
        `,
        [afterId]
      );

      if (afterResult.rows.length === 0) {
        return NextResponse.json(
          {
            error:
              "Selected health concern was not found.",
          },
          { status: 400 }
        );
      }

      const afterOrder = Number(
        afterResult.rows[0].sort_order
      );

      // -----------------------------------------------
      // Moving DOWN
      // -----------------------------------------------

      if (currentOrder < afterOrder) {
        await pool.query(
          `
          UPDATE health_concerns
          SET sort_order = sort_order - 1
          WHERE sort_order > $1
            AND sort_order <= $2
            AND id <> $3
          `,
          [
            currentOrder,
            afterOrder,
            concernId,
          ]
        );

        newSortOrder = afterOrder;
      }

      // -----------------------------------------------
      // Moving UP
      // -----------------------------------------------

      else if (currentOrder > afterOrder) {
        await pool.query(
          `
          UPDATE health_concerns
          SET sort_order = sort_order + 1
          WHERE sort_order >= $1
            AND sort_order < $2
            AND id <> $3
          `,
          [
            afterOrder,
            currentOrder,
            concernId,
          ]
        );

        newSortOrder = afterOrder + 1;
      }

      // -----------------------------------------------
      // Already immediately after selected item
      // -----------------------------------------------

      else {
        newSortOrder = currentOrder;
      }
    }

    // =================================================
    // POSITION: LAST
    // =================================================

    if (position === "last") {
      const maxResult = await pool.query(
        `
        SELECT COALESCE(
          MAX(sort_order),
          0
        ) AS max_sort_order
        FROM health_concerns
        WHERE id <> $1
        `,
        [concernId]
      );

      const maxSortOrder = Number(
        maxResult.rows[0].max_sort_order
      );

      await pool.query(
        `
        UPDATE health_concerns
        SET sort_order = sort_order - 1
        WHERE sort_order > $1
          AND id <> $2
        `,
        [
          currentOrder,
          concernId,
        ]
      );

      newSortOrder = maxSortOrder;
    }

    // =================================================
    // UPDATE HEALTH CONCERN
    // =================================================

    const result = await pool.query(
      `
      UPDATE health_concerns
      SET
        name = $1,
        name_urdu = $2,
        slug = $3,
        description = $4,
        description_urdu = $5,
        image = $6,
        sort_order = $7,
        is_active = $8,
        updated_at = NOW()
      WHERE id = $9
      RETURNING *
      `,
      [
        name.trim(),

        name_urdu?.trim() || null,

        slug.trim(),

        description?.trim() || null,

        description_urdu?.trim() || null,

        image?.trim() || null,

        newSortOrder,

        is_active ?? true,

        concernId,
      ]
    );

    return NextResponse.json(
      result.rows[0]
    );
  } catch (error) {
    console.error(
      "PUT health concern error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to update health concern",

        details:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      { status: 500 }
    );
  }
}