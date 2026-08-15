import { NextResponse } from "next/server";
import {
  scrypt,
  timingSafeEqual,
} from "crypto";
import { promisify } from "util";
import pool from "@/lib/db";
import { createCustomerSession } from "@/lib/customer-auth";

const scryptAsync = promisify(scrypt);

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email = normalizeEmail(
      String(body?.email || "")
    );

    const password = String(
      body?.password || ""
    );

    if (!email || !password) {
      return NextResponse.json(
        {
          error:
            "Email and password are required.",
        },
        {
          status: 400,
        }
      );
    }

    const result = await pool.query(
      `
        SELECT
          id,
          name,
          email,
          phone,
          password_hash
        FROM customers
        WHERE email = $1
        LIMIT 1
      `,
      [email]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        {
          error:
            "Invalid email or password.",
        },
        {
          status: 401,
        }
      );
    }

    const customer = result.rows[0];

    if (!customer.password_hash) {
      return NextResponse.json(
        {
          error:
            "This account does not have a valid password.",
        },
        {
          status: 401,
        }
      );
    }

    /*
     * Registration stores passwords as:
     *
     * salt:hash
     */
    const [
      salt,
      storedHashHex,
    ] = String(
      customer.password_hash
    ).split(":");

    if (!salt || !storedHashHex) {
      return NextResponse.json(
        {
          error:
            "Invalid account password data.",
        },
        {
          status: 401,
        }
      );
    }

    /*
     * Generate the password hash again
     * using the stored salt.
     */
    const derivedKey =
      (await scryptAsync(
        password,
        salt,
        64
      )) as Buffer;

    const storedHash =
      Buffer.from(
        storedHashHex,
        "hex"
      );

    if (
      storedHash.length !==
      derivedKey.length
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid email or password.",
        },
        {
          status: 401,
        }
      );
    }

    const passwordMatch =
      timingSafeEqual(
        derivedKey,
        storedHash
      );

    if (!passwordMatch) {
      return NextResponse.json(
        {
          error:
            "Invalid email or password.",
        },
        {
          status: 401,
        }
      );
    }

    /*
     * Password is correct.
     *
     * Create the customer session.
     */
    await createCustomerSession(
  Number(customer.id),
  customer.name,
  customer.email
);
    return NextResponse.json(
      {
        success: true,
        message:
          "Login successful.",
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
      "CUSTOMER LOGIN API ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to login. Please try again.",
      },
      {
        status: 500,
      }
    );
  }
}