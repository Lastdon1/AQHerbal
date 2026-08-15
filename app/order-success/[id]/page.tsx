"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type OrderItem = {
  id: number;
  product_id: number;
  variant_id: number;
  product_name: string;
  product_name_urdu?: string | null;
  image?: string | null;
  quantity_value: number;
  unit: string;
  price: number;
  quantity: number;
  subtotal: number;
};

type Order = {
  id: number;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  address: string;
  city: string;
  payment_method:
    | "easypaisa"
    | "jazzcash"
    | "cod";
  subtotal: number;
  delivery_fee: number;
  total_amount: number;
  status: string;
  created_at: string;
  items: OrderItem[];
};

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default function OrderSuccessPage({
  params,
}: Props) {
  const [orderId, setOrderId] =
    useState<string>("");

  const [order, setOrder] =
    useState<Order | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  /* ============================================================
     LOAD ORDER
  ============================================================ */

  useEffect(() => {
    let isMounted = true;

    async function loadOrder() {
      try {
        const resolvedParams =
          await params;

        if (!isMounted) {
          return;
        }

        setOrderId(resolvedParams.id);

        const response = await fetch(
          `/api/orders/${resolvedParams.id}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              "Unable to load your order."
          );
        }

        if (!isMounted) {
          return;
        }

        setOrder(data.order);
      } catch (error) {
        console.error(
          "ORDER SUCCESS PAGE ERROR:",
          error
        );

        if (!isMounted) {
          return;
        }

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to load your order."
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadOrder();

    return () => {
      isMounted = false;
    };
  }, [params]);

  /* ============================================================
     LOADING
  ============================================================ */

  if (isLoading) {
    return (
      <main className="min-h-[65vh] bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex min-h-[50vh] items-center justify-center">
            <div className="text-center">
              <div
                className="
                  mx-auto
                  h-8
                  w-8
                  animate-spin
                  rounded-full
                  border-2
                  border-gray-200
                  border-t-green-700
                "
              />

              <p className="mt-4 text-sm text-gray-500">
                Loading your order...
              </p>

              <p
                dir="rtl"
                className="mt-1 text-sm text-gray-500"
              >
                آپ کا آرڈر لوڈ ہو رہا ہے...
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* ============================================================
     ERROR
  ============================================================ */

  if (errorMessage || !order) {
    return (
      <main className="min-h-[65vh] bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto flex min-h-[50vh] max-w-xl items-center justify-center">
            <div
              className="
                w-full
                rounded-2xl
                border
                border-red-100
                bg-[#fffafa]
                px-6
                py-10
                text-center
                shadow-sm
              "
            >
              <div
                className="
                  mx-auto
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-full
                  bg-red-50
                "
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-8 w-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  aria-hidden="true"
                >
                  <path
                    d="M12 8v5"
                    strokeLinecap="round"
                  />

                  <path
                    d="M12 16.5h.01"
                    strokeLinecap="round"
                  />

                  <path
                    d="M10.3 3.8 2.9 17a2 2 0 0 0 1.75 3h14.7a2 2 0 0 0 1.75-3L13.7 3.8a2 2 0 0 0-3.4 0Z"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <h1 className="mt-5 text-2xl font-bold text-gray-900">
                Order Not Found
              </h1>

              <p
                dir="rtl"
                className="mt-1 text-sm text-gray-500"
              >
                آرڈر نہیں ملا
              </p>

              <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-gray-500">
                We could not find the order you
                are looking for.
              </p>

              {orderId && (
                <p className="mt-2 text-xs text-gray-400">
                  Order ID: {orderId}
                </p>
              )}

              <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/store"
                  className="
                    inline-flex
                    h-11
                    items-center
                    justify-center
                    rounded-lg
                    bg-green-700
                    px-6
                    text-sm
                    font-semibold
                    text-white
                    shadow-sm
                    transition
                    hover:bg-green-800
                  "
                >
                  Continue Shopping
                </Link>

                <Link
                  href="/"
                  className="
                    inline-flex
                    h-11
                    items-center
                    justify-center
                    rounded-lg
                    border
                    border-gray-200
                    bg-white
                    px-6
                    text-sm
                    font-semibold
                    text-gray-700
                    transition
                    hover:border-green-300
                    hover:text-green-700
                  "
                >
                  Go Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* ============================================================
     PAYMENT LABEL
  ============================================================ */

  const paymentLabel =
    order.payment_method === "cod"
      ? "Cash on Delivery"
      : order.payment_method ===
          "easypaisa"
        ? "EasyPaisa"
        : "JazzCash";

  const paymentLabelUrdu =
    order.payment_method === "cod"
      ? "کیش آن ڈیلیوری"
      : order.payment_method ===
          "easypaisa"
        ? "ایزی پیسہ"
        : "جاز کیش";

  /* ============================================================
     MAIN SUCCESS PAGE
  ============================================================ */

  return (
    <main className="min-h-[65vh] bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

        {/* ======================================================
            SUCCESS HEADER
        ====================================================== */}

        <div className="mx-auto max-w-2xl text-center">
          <div
            className="
              mx-auto
              flex
              h-20
              w-20
              items-center
              justify-center
              rounded-full
              bg-green-50
            "
          >
            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-full
                bg-green-700
              "
            >
              <svg
                viewBox="0 0 24 24"
                className="h-7 w-7 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path
                  d="m5 12 4 4L19 6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <h1 className="mt-6 text-3xl font-bold text-gray-900 sm:text-4xl">
            Order Placed Successfully
          </h1>

          <p
            dir="rtl"
            className="mt-1 text-base text-gray-500"
          >
            آپ کا آرڈر کامیابی سے مکمل ہو گیا ہے
          </p>

          <p className="mt-4 text-sm leading-6 text-gray-500">
            Thank you for shopping with ISACO.
            Your order has been received and will
            be processed shortly.
          </p>

          <p
            dir="rtl"
            className="mt-1 text-sm leading-6 text-gray-500"
          >
            آئی ساکو سے خریداری کا شکریہ۔ آپ کا
            آرڈر موصول ہو گیا ہے اور جلد پروسیس
            کیا جائے گا۔
          </p>
        </div>

        {/* ======================================================
            ORDER NUMBER
        ====================================================== */}

        <div
          className="
            mx-auto
            mt-8
            max-w-2xl
            rounded-2xl
            border
            border-green-100
            bg-[#f8faf8]
            p-5
            text-center
            shadow-sm
            sm:p-6
          "
        >
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            Order Number
          </p>

          <p className="mt-1 text-2xl font-bold text-green-700">
            {order.order_number}
          </p>

          <p
            dir="rtl"
            className="mt-1 text-xs text-gray-500"
          >
            آرڈر نمبر
          </p>
        </div>

        {/* ======================================================
            ORDER DETAILS
        ====================================================== */}

        <div className="mx-auto mt-6 grid max-w-5xl gap-6 lg:grid-cols-[1fr_330px]">

          {/* ====================================================
              LEFT
          ==================================================== */}

          <div className="space-y-6">

            {/* ==================================================
                DELIVERY INFORMATION
            ================================================== */}

            <section
              className="
                rounded-2xl
                border
                border-gray-100
                bg-white
                p-5
                shadow-sm
                sm:p-6
              "
            >
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Delivery Information
                </h2>

                <p
                  dir="rtl"
                  className="mt-0.5 text-sm text-gray-500"
                >
                  ڈیلیوری کی معلومات
                </p>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">

                {/* NAME */}

                <div>
                  <p className="text-xs text-gray-400">
                    Customer Name
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {order.customer_name}
                  </p>
                </div>

                {/* PHONE */}

                <div>
                  <p className="text-xs text-gray-400">
                    Phone Number
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {order.customer_phone}
                  </p>
                </div>

                {/* CITY */}

                <div>
                  <p className="text-xs text-gray-400">
                    City
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {order.city}
                  </p>
                </div>

                {/* PAYMENT */}

                <div>
                  <p className="text-xs text-gray-400">
                    Payment Method
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {paymentLabel}
                  </p>

                  <p
                    dir="rtl"
                    className="mt-0.5 text-xs text-gray-500"
                  >
                    {paymentLabelUrdu}
                  </p>
                </div>
              </div>

              {/* ADDRESS */}

              <div className="mt-5 border-t border-gray-100 pt-4">
                <p className="text-xs text-gray-400">
                  Delivery Address
                </p>

                <p className="mt-1 text-sm leading-6 text-gray-800">
                  {order.address}
                </p>

                <p
                  dir="rtl"
                  className="mt-1 text-xs text-gray-500"
                >
                  ڈیلیوری کا پتہ
                </p>
              </div>
            </section>

            {/* ==================================================
                ORDERED PRODUCTS
            ================================================== */}

            <section
              className="
                rounded-2xl
                border
                border-gray-100
                bg-white
                p-5
                shadow-sm
                sm:p-6
              "
            >
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Ordered Products
                </h2>

                <p
                  dir="rtl"
                  className="mt-0.5 text-sm text-gray-500"
                >
                  آرڈر کی گئی مصنوعات
                </p>
              </div>

              <div className="mt-5 divide-y divide-gray-100">

                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="
                      flex
                      gap-3
                      py-4
                      first:pt-0
                      last:pb-0
                    "
                  >

                    {/* ==================================================
                        PRODUCT IMAGE
                    ================================================== */}

                    <div
                      className="
                        relative
                        h-20
                        w-20
                        shrink-0
                        overflow-hidden
                        rounded-xl
                        bg-[#f8faf8]
                        ring-1
                        ring-gray-100
                      "
                    >
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.product_name}
                          fill
                          sizes="80px"
                          className="object-contain p-1.5"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] text-gray-400">
                          No Image
                        </div>
                      )}
                    </div>

                    {/* ==================================================
                        PRODUCT DETAILS
                    ================================================== */}

                    <div className="min-w-0 flex-1">

                      <p className="line-clamp-2 text-sm font-semibold text-gray-800">
                        {item.product_name}
                      </p>

                      {item.product_name_urdu && (
                        <p
                          dir="rtl"
                          className="mt-0.5 text-right text-xs text-gray-500"
                        >
                          {item.product_name_urdu}
                        </p>
                      )}

                      <p className="mt-1 text-xs text-gray-500">
                        {item.quantity_value}{" "}
                        {item.unit} ×{" "}
                        {item.quantity}
                      </p>

                      <p className="mt-1 text-[11px] text-gray-400">
                        Rs{" "}
                        {item.price.toLocaleString(
                          "en-PK"
                        )}{" "}
                        each
                      </p>
                    </div>

                    {/* ==================================================
                        PRICE
                    ================================================== */}

                    <div className="shrink-0 text-right">
                      <p className="text-sm font-bold text-gray-900">
                        Rs{" "}
                        {item.subtotal.toLocaleString(
                          "en-PK"
                        )}
                      </p>
                    </div>
                  </div>
                ))}

              </div>
            </section>
          </div>

          {/* ====================================================
              RIGHT — ORDER SUMMARY
          ==================================================== */}

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div
              className="
                rounded-2xl
                border
                border-gray-100
                bg-[#f8faf8]
                p-5
                shadow-sm
              "
            >
              <h2 className="text-lg font-bold text-gray-900">
                Order Summary
              </h2>

              <p
                dir="rtl"
                className="mt-0.5 text-sm text-gray-500"
              >
                آرڈر کا خلاصہ
              </p>

              <div className="mt-5 space-y-3 border-t border-gray-200 pt-4">

                {/* SUBTOTAL */}

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    Subtotal
                  </span>

                  <span className="font-medium text-gray-900">
                    Rs{" "}
                    {order.subtotal.toLocaleString(
                      "en-PK"
                    )}
                  </span>
                </div>

                {/* DELIVERY */}

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    Delivery
                  </span>

                  <span className="font-medium text-green-700">
                    {order.delivery_fee === 0
                      ? "Free"
                      : `Rs ${order.delivery_fee.toLocaleString(
                          "en-PK"
                        )}`}
                  </span>
                </div>
              </div>

              {/* TOTAL */}

              <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
                <div>
                  <p className="text-base font-bold text-gray-900">
                    Total
                  </p>

                  <p
                    dir="rtl"
                    className="text-xs text-gray-500"
                  >
                    کل رقم
                  </p>
                </div>

                <p className="text-xl font-bold text-green-700">
                  Rs{" "}
                  {order.total_amount.toLocaleString(
                    "en-PK"
                  )}
                </p>
              </div>

              {/* STATUS */}

              <div className="mt-5 rounded-lg bg-white p-3 text-center">
                <p className="text-xs text-gray-400">
                  Order Status
                </p>

                <p className="mt-1 text-sm font-semibold capitalize text-green-700">
                  {order.status}
                </p>

                <p
                  dir="rtl"
                  className="mt-0.5 text-xs text-gray-500"
                >
                  آرڈر کی صورتحال
                </p>
              </div>

              {/* ACTIONS */}

              <div className="mt-5 space-y-3">

                <Link
                  href="/store"
                  className="
                    flex
                    h-11
                    w-full
                    items-center
                    justify-center
                    rounded-lg
                    bg-green-700
                    px-5
                    text-sm
                    font-semibold
                    text-white
                    shadow-sm
                    transition
                    hover:bg-green-800
                  "
                >
                  Continue Shopping
                </Link>

                <Link
                  href="/"
                  className="
                    flex
                    h-11
                    w-full
                    items-center
                    justify-center
                    rounded-lg
                    border
                    border-gray-200
                    bg-white
                    px-5
                    text-sm
                    font-semibold
                    text-gray-700
                    transition
                    hover:border-green-300
                    hover:text-green-700
                  "
                >
                  Back to Home
                </Link>

              </div>
            </div>
          </aside>
        </div>

        {/* ======================================================
            THANK YOU NOTE
        ====================================================== */}

        <div className="mx-auto mt-8 max-w-2xl text-center">
          <p className="text-sm text-gray-500">
            Thank you for choosing ISACO for your
            wellness journey.
          </p>

          <p
            dir="rtl"
            className="mt-1 text-sm text-gray-500"
          >
            اپنی صحت کے سفر کے لیے آئی ساکو کا
            انتخاب کرنے کا شکریہ۔
          </p>
        </div>
      </div>
    </main>
  );
}