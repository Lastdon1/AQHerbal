
import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getCustomerSession } from "@/lib/customer-auth";

type RouteContext = {
  params: Promise<{
    orderNumber: string;
  }>;
};

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const session =
      await getCustomerSession();

    if (!session) {
      return NextResponse.json(
        {
          error:
            "Please login to view this order.",
        },
        {
          status: 401,
        }
      );
    }

    const customerId =
      Number(session.customerId);

    const { orderNumber } =
      await context.params;

    if (!orderNumber) {
      return NextResponse.json(
        {
          error:
            "Order number is required.",
        },
        {
          status: 400,
        }
      );
    }

    const orderResult =
      await pool.query(
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
        WHERE order_number = $1
          AND customer_id = $2
        LIMIT 1
        `,
        [
          orderNumber,
          customerId,
        ]
      );

    if (
      orderResult.rows.length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "Order not found.",
        },
        {
          status: 404,
        }
      );
    }

    const order =
      orderResult.rows[0];

    const itemsResult =
      await pool.query(
        `
        SELECT
          id,
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
        [order.id]
      );

    return NextResponse.json(
      {
        success: true,

        order: {
          ...order,
          items:
            itemsResult.rows,
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "CUSTOMER ORDER DETAIL API ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to load order details.",
      },
      {
        status: 500,
      }
    );
  }
}

