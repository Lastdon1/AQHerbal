
import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getCustomerSession } from "@/lib/customer-auth";

export async function GET() {
  try {
    const session = await getCustomerSession();

    if (!session) {
      return NextResponse.json(
        {
          error: "Not authenticated.",
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
          name,
          email,
          phone
        FROM customers
        WHERE id = $1
        LIMIT 1
      `,
      [customerId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        {
          error: "Customer not found.",
        },
        {
          status: 404,
        }
      );
    }

    const customer = result.rows[0];

    return NextResponse.json(
      {
        success: true,
        customer: {
          id: customer.id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "CUSTOMER ACCOUNT API ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to load account.",
      },
      {
        status: 500,
      }
    );
  }
}

