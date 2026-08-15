import { NextResponse } from "next/server";
import pool from "@/lib/db";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const orderId = Number(id);

    /* ============================================================
       VALIDATE ORDER ID
    ============================================================ */

    if (!Number.isInteger(orderId) || orderId <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid order ID.",
        },
        { status: 400 }
      );
    }

    /* ============================================================
       GET ORDER
    ============================================================ */

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
        { status: 404 }
      );
    }

    const order = orderResult.rows[0];

    /* ============================================================
       GET ORDER ITEMS + PRODUCT IMAGE

       We get the primary product image from product_images.

       IMPORTANT:
       - order_items.product_id identifies the product
       - product_images.product_id identifies its images
       - is_primary = true is preferred
       - sort_order is used as fallback
    ============================================================ */

    const itemsResult = await pool.query(
      `
      SELECT
        oi.id,
        oi.product_id,
        oi.variant_id,
        oi.product_name,
        oi.product_name_urdu,
        oi.quantity_value,
        oi.unit,
        oi.price,
        oi.quantity,
        oi.subtotal,

        (
          SELECT pi.image_url
          FROM product_images pi
          WHERE pi.product_id = oi.product_id
          ORDER BY
            pi.is_primary DESC,
            pi.sort_order ASC,
            pi.id ASC
          LIMIT 1
        ) AS image

      FROM order_items oi

      WHERE oi.order_id = $1

      ORDER BY oi.id ASC
      `,
      [orderId]
    );

    /* ============================================================
       RESPONSE
    ============================================================ */

    return NextResponse.json({
      success: true,

      order: {
        id: Number(order.id),

        order_number:
          order.order_number,

        customer_name:
          order.customer_name,

        customer_phone:
          order.customer_phone,

        address:
          order.address,

        city:
          order.city,

        payment_method:
          order.payment_method,

        subtotal:
          Number(order.subtotal),

        delivery_fee:
          Number(order.delivery_fee),

        total_amount:
          Number(order.total_amount),

        status:
          order.status,

        created_at:
          order.created_at,

        /* ========================================================
           ORDER ITEMS
        ======================================================== */

        items: itemsResult.rows.map(
          (item) => ({
            id: Number(item.id),

            product_id:
              Number(item.product_id),

            variant_id:
              Number(item.variant_id),

            product_name:
              item.product_name,

            product_name_urdu:
              item.product_name_urdu,

            quantity_value:
              Number(
                item.quantity_value
              ),

            unit:
              item.unit,

            price:
              Number(item.price),

            quantity:
              Number(item.quantity),

            subtotal:
              Number(item.subtotal),

            /* ====================================================
               PRODUCT IMAGE

               Example:
               /uploads/products/example.png
            ==================================================== */

            image:
              item.image || null,
          })
        ),
      },
    });
  } catch (error) {
    console.error(
      "GET ORDER ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to load order.",
      },
      { status: 500 }
    );
  }
}