import { NextResponse } from "next/server";
import pool from "@/lib/db";
import type { PoolClient } from "pg";
import { getCustomerSession } from "@/lib/customer-auth";

type OrderItemInput = {
  product_id: number;
  variant_id: number;
  product_name: string;
  product_name_urdu?: string | null;
  quantity_value: number;
  unit: string;
  price: number;
  quantity: number;
};

type OrderRequest = {
  customer_name: string;
  phone: string;
  address: string;
  city: string;
  order_notes?: string;
  payment_method: "easypaisa" | "jazzcash" | "cod";
  items: OrderItemInput[];
  subtotal?: number;
  delivery?: number;
  total?: number;
};

/* ============================================================
   GET PAKISTAN DATE
============================================================ */

function getPakistanDatePrefix(): string {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Karachi",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const parts = formatter.formatToParts(new Date());

  const day =
    parts.find((part) => part.type === "day")?.value ?? "";

  const month =
    parts.find((part) => part.type === "month")?.value ?? "";

  const year =
    parts.find((part) => part.type === "year")?.value ?? "";

  return `${day}${month}${year}`;
}

/* ============================================================
   GENERATE DAILY ORDER NUMBER
============================================================ */

async function generateOrderNumber(
  client: PoolClient
): Promise<string> {
  const datePrefix = getPakistanDatePrefix();

  await client.query(
    `
      SELECT pg_advisory_xact_lock(
        hashtext($1)
      )
    `,
    [`isaco-order-${datePrefix}`]
  );

  const result = await client.query(
    `
      SELECT COALESCE(
        MAX(
          CAST(
            substring(
              order_number
              FROM '[0-9]+$'
            ) AS INTEGER
          )
        ),
        0
      ) AS max_sequence
      FROM orders
      WHERE order_number LIKE $1
    `,
    [`${datePrefix}-%`]
  );

  const maxSequence =
    Number(result.rows[0]?.max_sequence) || 0;

  const nextSequence = maxSequence + 1;

  return `${datePrefix}-${nextSequence}`;
}

/* ============================================================
   POST /api/orders
============================================================ */

export async function POST(request: Request) {
  try {
    const body =
      (await request.json()) as OrderRequest;

    console.log("ORDER REQUEST RECEIVED");

    /* ========================================================
       CUSTOMER SESSION
    ======================================================== */

    const customerSession =
      await getCustomerSession();

    const customerId =
      customerSession &&
      typeof customerSession.customerId === "number"
        ? customerSession.customerId
        : null;

    /* ========================================================
       BASIC VALIDATION
    ======================================================== */

    if (
      !body.customer_name?.trim() ||
      !body.phone?.trim() ||
      !body.address?.trim() ||
      !body.city?.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Customer information is incomplete.",
        },
        { status: 400 }
      );
    }

    if (
      !body.items ||
      !Array.isArray(body.items) ||
      body.items.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Your cart is empty.",
        },
        { status: 400 }
      );
    }

    if (
      ![
        "easypaisa",
        "jazzcash",
        "cod",
      ].includes(body.payment_method)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid payment method.",
        },
        { status: 400 }
      );
    }

    /* ========================================================
       DATABASE CONNECTION
    ======================================================== */

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      /* ======================================================
         GENERATE ORDER NUMBER
      ====================================================== */

      const orderNumber =
        await generateOrderNumber(client);

      /* ======================================================
         VERIFY CART ITEMS
      ====================================================== */

      const verifiedItems: Array<{
        productId: number;
        variantId: number;
        productName: string;
        productNameUrdu: string | null;
        productImage: string | null;
        quantityValue: number;
        unit: string;
        price: number;
        quantity: number;
        subtotal: number;
      }> = [];

      for (const item of body.items) {
        const productId =
          Number(item.product_id);

        const variantId =
          Number(item.variant_id);

        const requestedQuantity =
          Math.max(
            1,
            Number(item.quantity) || 1
          );

        /* ----------------------------------------------------
           BASIC ITEM VALIDATION
        ---------------------------------------------------- */

        if (
          !Number.isInteger(productId) ||
          productId <= 0 ||
          !Number.isInteger(variantId) ||
          variantId <= 0
        ) {
          throw new Error(
            "Invalid product or variant in order."
          );
        }

        /* ----------------------------------------------------
           DATABASE VALIDATION

           Product + variant + primary image.
        ---------------------------------------------------- */

        const variantResult =
          await client.query(
            `
              SELECT
                p.id AS product_id,
                p.name AS product_name,
                p.name_urdu AS product_name_urdu,

                pv.id AS variant_id,
                pv.quantity_value,
                pv.unit,
                pv.price,

                (
                  SELECT pi.image_url
                  FROM product_images pi
                  WHERE pi.product_id = p.id
                  ORDER BY
                    pi.is_primary DESC,
                    pi.sort_order ASC,
                    pi.id ASC
                  LIMIT 1
                ) AS product_image

              FROM products p

              INNER JOIN product_variants pv
                ON pv.product_id = p.id

              WHERE p.id = $1
                AND pv.id = $2
                AND p.is_active = true
                AND pv.is_active = true

              LIMIT 1
            `,
            [
              productId,
              variantId,
            ]
          );

        if (
          variantResult.rows.length === 0
        ) {
          throw new Error(
            "Invalid product or variant in order."
          );
        }

        const databaseItem =
          variantResult.rows[0];

        /* ----------------------------------------------------
           DATABASE VALUES
        ---------------------------------------------------- */

        const verifiedProductId =
          Number(
            databaseItem.product_id
          );

        const verifiedVariantId =
          Number(
            databaseItem.variant_id
          );

        const quantityValue =
          Number(
            databaseItem.quantity_value
          );

        const price =
          Number(
            databaseItem.price
          );

        const unit =
          String(
            databaseItem.unit || ""
          );

        const productImage =
          databaseItem.product_image
            ? String(
                databaseItem.product_image
              )
            : null;

        if (
          !Number.isFinite(price) ||
          price < 0
        ) {
          throw new Error(
            "Invalid product price."
          );
        }

        if (
          !Number.isFinite(quantityValue) ||
          quantityValue <= 0
        ) {
          throw new Error(
            "Invalid product quantity."
          );
        }

        if (!unit) {
          throw new Error(
            "Invalid product unit."
          );
        }

        /* ----------------------------------------------------
           ITEM SUBTOTAL
        ---------------------------------------------------- */

        const itemSubtotal =
          price * requestedQuantity;

        verifiedItems.push({
          productId:
            verifiedProductId,

          variantId:
            verifiedVariantId,

          productName:
            databaseItem.product_name,

          productNameUrdu:
            databaseItem.product_name_urdu ||
            null,

          productImage,

          quantityValue,

          unit,

          price,

          quantity:
            requestedQuantity,

          subtotal:
            itemSubtotal,
        });
      }

      /* ======================================================
         CALCULATE SUBTOTAL
      ====================================================== */

      const calculatedSubtotal =
        verifiedItems.reduce(
          (total, item) =>
            total + item.subtotal,
          0
        );

      /* ======================================================
         DELIVERY
      ====================================================== */

      const deliveryFee = 0;

      /* ======================================================
         TOTAL
      ====================================================== */

      const calculatedTotal =
        calculatedSubtotal +
        deliveryFee;

      /* ======================================================
         CREATE ORDER
      ====================================================== */

      const orderResult =
        await client.query(
          `
            INSERT INTO orders (
              order_number,
              customer_id,
              customer_name,
              customer_phone,
              address,
              city,
              payment_method,
              subtotal,
              delivery_fee,
              total_amount,
              status
            )
            VALUES (
              $1,
              $2,
              $3,
              $4,
              $5,
              $6,
              $7,
              $8,
              $9,
              $10,
              $11
            )
            RETURNING id, order_number
          `,
          [
            orderNumber,
            customerId,
            body.customer_name.trim(),
            body.phone.trim(),
            body.address.trim(),
            body.city.trim(),
            body.payment_method,
            calculatedSubtotal,
            deliveryFee,
            calculatedTotal,
            "pending",
          ]
        );

      if (
        !orderResult.rows ||
        orderResult.rows.length === 0
      ) {
        throw new Error(
          "Order could not be created in the database."
        );
      }

      const createdOrder =
        orderResult.rows[0];

      if (!createdOrder?.id) {
        throw new Error(
          "Order was created but its ID was not returned."
        );
      }

      const orderId =
        Number(createdOrder.id);

      const savedOrderNumber =
        createdOrder.order_number;

      /* ======================================================
         CREATE ORDER ITEMS
      ====================================================== */

      for (const item of verifiedItems) {
        await client.query(
          `
            INSERT INTO order_items (
              order_id,
              product_id,
              variant_id,
              product_name,
              product_name_urdu,
              product_image,
              quantity_value,
              unit,
              price,
              quantity,
              subtotal
            )
            VALUES (
              $1,
              $2,
              $3,
              $4,
              $5,
              $6,
              $7,
              $8,
              $9,
              $10,
              $11
            )
          `,
          [
            orderId,
            item.productId,
            item.variantId,
            item.productName,
            item.productNameUrdu,
            item.productImage,
            item.quantityValue,
            item.unit,
            item.price,
            item.quantity,
            item.subtotal,
          ]
        );
      }

      /* ======================================================
         COMMIT
      ====================================================== */

      await client.query("COMMIT");

      console.log(
        "ORDER CREATED:",
        savedOrderNumber,
        "CUSTOMER ID:",
        customerId
      );

      /* ======================================================
         SUCCESS
      ====================================================== */

      return NextResponse.json(
        {
          success: true,

          order: {
            id: orderId,
            order_number:
              savedOrderNumber,
          },

          order_id:
            orderId,

          order_number:
            savedOrderNumber,

          subtotal:
            calculatedSubtotal,

          delivery:
            deliveryFee,

          total:
            calculatedTotal,
        },
        { status: 201 }
      );
    } catch (error) {
      await client.query("ROLLBACK");

      console.error(
        "ORDER DATABASE ERROR:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "Database error while creating order.",
        },
        { status: 500 }
      );
    } finally {
      client.release();
    }
  } catch (error) {
    console.error(
      "ORDER API ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to create your order.",
      },
      { status: 500 }
    );
  }
}