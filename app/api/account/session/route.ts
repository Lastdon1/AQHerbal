import { NextResponse } from "next/server";
import { getCustomerSession } from "@/lib/customer-auth";

export async function GET() {
  try {
    const session =
      await getCustomerSession();

    if (!session) {
      return NextResponse.json({
        loggedIn: false,
      });
    }

    return NextResponse.json({
      loggedIn: true,
      customer: {
        id: session.customerId,
        name: session.name,
        email: session.email,
      },
    });
  } catch (error) {
    console.error(
      "CUSTOMER SESSION API ERROR:",
      error
    );

    return NextResponse.json({
      loggedIn: false,
    });
  }
}