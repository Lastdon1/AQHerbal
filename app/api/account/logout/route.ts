
import { NextResponse } from "next/server";
import { destroyCustomerSession } from "@/lib/customer-auth";

export async function POST() {
  try {
    await destroyCustomerSession();

    return NextResponse.json(
      {
        success: true,
        message: "Logout successful.",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "CUSTOMER LOGOUT API ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to logout.",
      },
      {
        status: 500,
      }
    );
  }
}

