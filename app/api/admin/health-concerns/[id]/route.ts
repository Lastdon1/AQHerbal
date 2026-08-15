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
        {
          error: "Invalid health concern ID",
        },
        {
          status: 400,
        }
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
        {
          error: "Health concern not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error(
      "GET health concern error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to fetch health concern",
      },
      {
        status: 500,
      }
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

  const concernId = Number(id);

  if (!Number.isInteger(concernId)) {
    return NextResponse.json(
      {
        error: "Invalid health concern ID",
      },
      {
        status: 400,
      }
    );
  }

  const client = await pool.connect();

  try {
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

    if (
      typeof name !== "string" ||
      !name.trim()
    ) {
      return NextResponse.json(
        {
          error: "Name is required",
        },
        {
          status: 400,
        }
      );
    }

    if (
      typeof slug !== "string" ||
      !slug.trim()
    ) {
      return NextResponse.json(
        {
          error: "Slug is required",
        },
        {
          status: 400,
        }
      );
    }

    const validPositions = [
      "keep",
      "first",
      "after",
      "last",
    ];

    if (
      position !== undefined &&
      !validPositions.includes(position)
    ) {
      return NextResponse.json(
        {
          error: "Invalid position.",
        },
        {
          status: 400,
        }
      );
    }

    // =================================================
    // START TRANSACTION
    // =================================================

    await client.query("BEGIN");

    // =================================================
    // GET CURRENT HEALTH CONCERN
    // =================================================

    const currentResult = await client.query(
      `
      SELECT
        id,
        sort_order
      FROM health_concerns
      WHERE id = $1
      FOR UPDATE
      `,
      [concernId]
    );

    if (currentResult.rows.length === 0) {
      await client.query("ROLLBACK");

      return NextResponse.json(
        {
          error: "Health concern not found",
        },
        {
          status: 404,
        }
      );
    }

    // =================================================
    // GET ALL OTHER HEALTH CONCERNS
    //
    // We rebuild the complete order instead of trying
    // to calculate whether the item moved up or down.
    // =================================================

    const allResult = await client.query(
      `
      SELECT
        id,
        sort_order
      FROM health_concerns
      WHERE id <> $1
      ORDER BY sort_order ASC, id ASC
      FOR UPDATE
      `,
      [concernId]
    );

    let orderedIds: number[] =
      allResult.rows.map(
        (row) => Number(row.id)
      );

    // =================================================
    // POSITION: KEEP
    // =================================================

    if (!position || position === "keep") {
      // Current concern stays at its existing position.
      //
      // We reconstruct the complete list using the
      // current concern's existing sort_order.

      const currentOrder = Number(
        currentResult.rows[0].sort_order
      );

      const insertIndex = Math.max(
        0,
        Math.min(
          currentOrder - 1,
          orderedIds.length
        )
      );

      orderedIds.splice(
        insertIndex,
        0,
        concernId
      );
    }

    // =================================================
    // POSITION: FIRST
    // =================================================

    else if (position === "first") {
      orderedIds.unshift(concernId);
    }

    // =================================================
    // POSITION: LAST
    // =================================================

    else if (position === "last") {
      orderedIds.push(concernId);
    }

    // =================================================
    // POSITION: AFTER ANOTHER HEALTH CONCERN
    // =================================================

    else if (position === "after") {
      const afterId = Number(after_id);

      if (!Number.isInteger(afterId)) {
        await client.query("ROLLBACK");

        return NextResponse.json(
          {
            error:
              "Please select a health concern to place this after.",
          },
          {
            status: 400,
          }
        );
      }

      if (afterId === concernId) {
        await client.query("ROLLBACK");

        return NextResponse.json(
          {
            error:
              "A health concern cannot be placed after itself.",
          },
          {
            status: 400,
          }
        );
      }

      // Make sure the selected concern exists.
      const afterResult = await client.query(
        `
        SELECT id
        FROM health_concerns
        WHERE id = $1
        `,
        [afterId]
      );

      if (afterResult.rows.length === 0) {
        await client.query("ROLLBACK");

        return NextResponse.json(
          {
            error:
              "Selected health concern was not found.",
          },
          {
            status: 400,
          }
        );
      }

      const afterIndex =
        orderedIds.indexOf(afterId);

      if (afterIndex === -1) {
        await client.query("ROLLBACK");

        return NextResponse.json(
          {
            error:
              "Selected health concern could not be positioned.",
          },
          {
            status: 400,
          }
        );
      }

      // Insert immediately after the selected item.
      orderedIds.splice(
        afterIndex + 1,
        0,
        concernId
      );
    }

    // =================================================
    // SAFETY CHECK
    // =================================================

    if (
      orderedIds.length !==
      allResult.rows.length + 1
    ) {
      throw new Error(
        "Health concern ordering became inconsistent."
      );
    }

    // =================================================
    // REBUILD sort_order
    //
    // 1, 2, 3, 4...
    // =================================================

    for (
      let index = 0;
      index < orderedIds.length;
      index++
    ) {
      await client.query(
        `
        UPDATE health_concerns
        SET sort_order = $1
        WHERE id = $2
        `,
        [index + 1, orderedIds[index]]
      );
    }

    // =================================================
    // UPDATE HEALTH CONCERN DATA
    // =================================================

    const result = await client.query(
      `
      UPDATE health_concerns
      SET
        name = $1,
        name_urdu = $2,
        slug = $3,
        description = $4,
        description_urdu = $5,
        image = $6,
        is_active = $7,
        updated_at = NOW()
      WHERE id = $8
      RETURNING *
      `,
      [
        name.trim(),

        typeof name_urdu === "string"
          ? name_urdu.trim() || null
          : null,

        slug.trim(),

        typeof description === "string"
          ? description.trim() || null
          : null,

        typeof description_urdu === "string"
          ? description_urdu.trim() || null
          : null,

        typeof image === "string"
          ? image.trim() || null
          : null,

        typeof is_active === "boolean"
          ? is_active
          : true,

        concernId,
      ]
    );

    // =================================================
    // COMMIT
    // =================================================

    await client.query("COMMIT");

    return NextResponse.json(
      result.rows[0]
    );
  } catch (error) {
    // =================================================
    // ROLLBACK
    // =================================================

    try {
      await client.query("ROLLBACK");
    } catch (rollbackError) {
      console.error(
        "Health concern rollback error:",
        rollbackError
      );
    }

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
      {
        status: 500,
      }
    );
  } finally {
    client.release();
  }
}