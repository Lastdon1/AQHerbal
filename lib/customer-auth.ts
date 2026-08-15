import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET
);

const CUSTOMER_COOKIE_NAME =
  "isaco_customer_session";

/* ============================================================
   CREATE CUSTOMER SESSION
============================================================ */

export async function createCustomerSession(
  customerId: number,
  name: string,
  email: string
) {
  const token = await new SignJWT({
    customerId,
    name,
    email,
    role: "customer",
  })
    .setProtectedHeader({
      alg: "HS256",
    })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);

  const cookieStore = await cookies();

  cookieStore.set(
    CUSTOMER_COOKIE_NAME,
    token,
    {
      httpOnly: true,
      secure:
        process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    }
  );

  return token;
}

/* ============================================================
   GET CUSTOMER SESSION
============================================================ */

export async function getCustomerSession() {
  const cookieStore = await cookies();

  const token = cookieStore.get(
    CUSTOMER_COOKIE_NAME
  )?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(
      token,
      secret
    );

    if (
      payload.role !== "customer" ||
      typeof payload.customerId !== "number" ||
      typeof payload.email !== "string"
    ) {
      return null;
    }

    return {
      customerId: payload.customerId,
      name:
        typeof payload.name === "string"
          ? payload.name
          : "",
      email: payload.email,
      role: payload.role,
    };
  } catch {
    return null;
  }
}

/* ============================================================
   DESTROY CUSTOMER SESSION
============================================================ */

export async function destroyCustomerSession() {
  const cookieStore = await cookies();

  cookieStore.delete(
    CUSTOMER_COOKIE_NAME
  );
}

/* ============================================================
   COOKIE NAME
============================================================ */

export { CUSTOMER_COOKIE_NAME };