import { NextResponse } from "next/server";
import {
  randomBytes,
  scrypt,
} from "crypto";
import { promisify } from "util";
import pool from "@/lib/db";

const scryptAsync = promisify(scrypt);

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = String(body?.name || "").trim();
    const email = normalizeEmail(
      String(body?.email || "")
    );
    const phone = String(body?.phone || "").trim();
    const password = String(body?.password || "");

    if (!name) {
      return NextResponse.json(
        {
          error: "Please enter your name.",
        },
        {
          status: 400,
        }
      );
    }

    if (!email) {
      return NextResponse.json(
        {
          error: "Please enter your email.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
      )
    ) {
      return NextResponse.json(
        {
          error: "Please enter a valid email address.",
        },
        {
          status: 400,
        }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          error:
            "Password must be at least 8 characters long.",
        },
        {
          status: 400,
        }
      );
    }

    const existingCustomer = await pool.query(
      `
        SELECT id
        FROM customers
        WHERE email = $1
        LIMIT 1
      `,
      [email]
    );

    if (existingCustomer.rows.length > 0) {
      return NextResponse.json(
        {
          error:
            "An account with this email already exists.",
        },
        {
          status: 409,
        }
      );
    }

    /*
     * Generate a unique salt for this password.
     */
    const salt = randomBytes(16).toString("hex");

    /*
     * Create a secure password hash.
     */
    const derivedKey = (await scryptAsync(
      password,
      salt,
      64
    )) as Buffer;

    /*
     * Store salt + hash together.
     *
     * Format:
     * salt:hash
     */
    const passwordHash = `${salt}:${derivedKey.toString(
      "hex"
    )}`;

    const result = await pool.query(
      `
        INSERT INTO customers (
          name,
          email,
          phone,
          password_hash
        )
        VALUES ($1, $2, $3, $4)
        RETURNING
          id,
          name,
          email,
          phone,
          created_at
      `,
      [
        name,
        email,
        phone || null,
        passwordHash,
      ]
    );

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully.",
        customer: result.rows[0],
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "CUSTOMER REGISTRATION API ERROR:",
      error
    );

    /*
     * Handle PostgreSQL unique-email constraint
     * safely in case two requests arrive together.
     */
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "23505"
    ) {
      return NextResponse.json(
        {
          error:
            "An account with this email already exists.",
        },
        {
          status: 409,
        }
      );
    }

    return NextResponse.json(
      {
        error:
          "Unable to create your account. Please try again.",
      },
      {
        status: 500,
      }
    );
  }
}