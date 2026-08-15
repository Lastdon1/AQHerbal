
import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getCustomerSession } from "@/lib/customer-auth";

export async function GET() {
  try {
    const session = await getCustomerSession();

    if (!session) {
      return NextResponse.json(
        {
          error: "Please login to view your orders.",
        },
        {
          status: 401,
        }
      );
    }

    const customerId = Number(
      session.customerId
    );

    const result = await pool.query(
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
      WHERE customer_id = $1
      ORDER BY created_at DESC
      `,
      [customerId]
    );

    return NextResponse.json(
      {
        success: true,
        orders: result.rows,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "CUSTOMER ORDERS API ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to load your orders.",
      },
      {
        status: 500,
      }
    );
  }
}

