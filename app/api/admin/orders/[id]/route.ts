import { NextResponse } from "next/server";
import pool from "@/lib/db";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

const allowedStatuses = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;

type OrderStatus = (typeof allowedStatuses)[number];

/* ============================================================
   GET — LOAD INDIVIDUAL ORDER
============================================================ */

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const orderId = Number(id);

    if (!Number.isInteger(orderId) || orderId <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid order ID.",
        },
        {
          status: 400,
        }
      );
    }

    const orderResult = await pool.query(
      `
        SELECT
          id,
          order_number,
          customer_name,
          customer_phone,
          address,
          city,
          payment_method,
          subtotal,
          delivery_fee,
          total_amount,
          status,
          created_at
        FROM orders
        WHERE id = $1
        LIMIT 1
      `,
      [orderId]
    );

    if (orderResult.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found.",
        },
        {
          status: 404,
        }
      );
    }

    const itemsResult = await pool.query(
      `
        SELECT
          id,
          order_id,
          product_id,
          variant_id,
          product_name,
          product_name_urdu,
          quantity_value,
          unit,
          price,
          quantity,
          subtotal
        FROM order_items
        WHERE order_id = $1
        ORDER BY id ASC
      `,
      [orderId]
    );

    return NextResponse.json({
      success: true,
      order: orderResult.rows[0],
      items: itemsResult.rows,
    });
  } catch (error) {
    console.error("GET ADMIN ORDER ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load order.",
      },
      {
        status: 500,
      }
    );
  }
}

/* ============================================================
   PATCH — UPDATE ORDER STATUS
============================================================ */

export async function PATCH(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const orderId = Number(id);

    if (!Number.isInteger(orderId) || orderId <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid order ID.",
        },
        {
          status: 400,
        }
      );
    }

    const body = await request.json();

    const status = body?.status as OrderStatus;

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid order status.",
        },
        {
          status: 400,
        }
      );
    }

    const result = await pool.query(
      `
        UPDATE orders
        SET status = $1
        WHERE id = $2
        RETURNING
          id,
          order_number,
          status
      `,
      [status, orderId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Order status updated successfully.",
      order: result.rows[0],
    });
  } catch (error) {
    console.error(
      "PATCH ADMIN ORDER ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Unable to update order status.",
      },
      {
        status: 500,
      }
    );
  }
}

/* ============================================================
   DELETE — DELETE ORDER
============================================================ */

export async function DELETE(
  request: Request,
  context: RouteContext
) {
  const client = await pool.connect();

  try {
    const { id } = await context.params;

    const orderId = Number(id);

    if (!Number.isInteger(orderId) || orderId <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid order ID.",
        },
        {
          status: 400,
        }
      );
    }

    await client.query("BEGIN");

    /*
     * Delete order items first because they reference
     * the order through order_id.
     */
    await client.query(
      `
        DELETE FROM order_items
        WHERE order_id = $1
      `,
      [orderId]
    );

    const result = await client.query(
      `
        DELETE FROM orders
        WHERE id = $1
        RETURNING id, order_number
      `,
      [orderId]
    );

    if (result.rowCount === 0) {
      await client.query("ROLLBACK");

      return NextResponse.json(
        {
          success: false,
          message: "Order not found.",
        },
        {
          status: 404,
        }
      );
    }

    await client.query("COMMIT");

    return NextResponse.json({
      success: true,
      message: "Order deleted successfully.",
      order: result.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error(
      "DELETE ADMIN ORDER ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete order.",
      },
      {
        status: 500,
      }
    );
  } finally {
    client.release();
  }
}