
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type OrderItem = {
  id: number;
  product_id: number;
  variant_id: number;
  product_name: string;
  product_name_urdu?: string | null;
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

function formatDate(
  date: string
) {
  return new Date(date).toLocaleDateString(
    "en-PK",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  );
}

function statusClass(
  status: string
) {
  switch (status) {
    case "pending":
      return "bg-yellow-50 text-yellow-700";

    case "confirmed":
      return "bg-blue-50 text-blue-700";

    case "processing":
      return "bg-indigo-50 text-indigo-700";

    case "shipped":
      return "bg-purple-50 text-purple-700";

    case "delivered":
      return "bg-green-50 text-green-700";

    case "cancelled":
      return "bg-red-50 text-red-700";

    default:
      return "bg-gray-50 text-gray-700";
  }
}

export default function CustomerOrderDetailPage() {
  const params = useParams();
  const router = useRouter();

  const orderNumber =
    String(params.orderNumber || "");

  const [order, setOrder] =
    useState<Order | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (!orderNumber) {
      return;
    }

    async function loadOrder() {
      try {
        const response = await fetch(
          `/api/account/orders/${encodeURIComponent(
            orderNumber
          )}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const data =
          await response.json();

        if (response.status === 401) {
          router.replace(
            "/account/login"
          );
          return;
        }

        if (!response.ok) {
          setError(
            data?.error ||
              "Unable to load order."
          );
          return;
        }

        setOrder(data.order);
      } catch (error) {
        console.error(
          "LOAD ORDER DETAIL ERROR:",
          error
        );

        setError(
          "Unable to load order details."
        );
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [
    orderNumber,
    router,
  ]);

  if (loading) {
    return (
      <main className="min-h-[70vh] bg-white">
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-green-700" />

            <p className="mt-3 text-sm text-gray-500">
              Loading order...
            </p>

            <p
              dir="rtl"
              className="mt-1 text-sm text-gray-500"
            >
              آرڈر لوڈ ہو رہا ہے...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="min-h-[70vh] bg-white py-12">
        <div className="mx-auto max-w-3xl px-4 text-center">

          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">

            <h1 className="text-2xl font-semibold text-gray-900">
              Order Not Found
            </h1>

            <p className="mt-2 text-sm text-red-600">
              {error ||
                "This order could not be found."}
            </p>

            <Link
              href="/account/orders"
              className="mt-6 inline-flex rounded-xl bg-green-700 px-6 py-3 text-sm font-medium text-white hover:bg-green-800"
            >
              Back to My Orders
            </Link>

          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[70vh] bg-white py-10 sm:py-14">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

        {/* Back */}
        <Link
          href="/account/orders"
          className="text-sm font-medium text-gray-500 hover:text-green-700"
        >
          ← Back to My Orders
        </Link>

        {/* Header */}
        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Order
            </p>

            <h1 className="mt-1 text-3xl font-semibold text-gray-900">
              #{order.order_number}
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              {formatDate(
                order.created_at
              )}
            </p>
          </div>

          <span
            className={`inline-flex w-fit rounded-full px-4 py-2 text-sm font-medium capitalize ${statusClass(
              order.status
            )}`}
          >
            {order.status}
          </span>

        </div>

        {/* Customer Information */}
        <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">

          <h2 className="text-lg font-semibold text-gray-900">
            Delivery Information
          </h2>

          <p
            dir="rtl"
            className="mt-1 text-sm text-gray-500"
          >
            ڈیلیوری کی معلومات
          </p>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">

            <div>
              <p className="text-xs text-gray-400">
                Name
              </p>

              <p className="mt-1 text-sm text-gray-800">
                {order.customer_name}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-400">
                Phone
              </p>

              <p className="mt-1 text-sm text-gray-800">
                {order.customer_phone}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-400">
                Address
              </p>

              <p className="mt-1 text-sm text-gray-800">
                {order.address}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-400">
                City
              </p>

              <p className="mt-1 text-sm text-gray-800">
                {order.city}
              </p>
            </div>

          </div>
        </div>

        {/* Order Items */}
        <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">

          <h2 className="text-lg font-semibold text-gray-900">
            Order Items
          </h2>

          <p
            dir="rtl"
            className="mt-1 text-sm text-gray-500"
          >
            آرڈر کی اشیاء
          </p>

          <div className="mt-5 divide-y divide-gray-100">

            {order.items.map(
              (item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 py-4"
                >

                  <div className="min-w-0">

                    <p className="font-medium text-gray-900">
                      {item.product_name}
                    </p>

                    {item.product_name_urdu && (
                      <p
                        dir="rtl"
                        className="mt-1 text-sm text-gray-500"
                      >
                        {item.product_name_urdu}
                      </p>
                    )}

                    <p className="mt-1 text-xs text-gray-500">
                      {item.quantity_value}{" "}
                      {item.unit} ×{" "}
                      {item.quantity}
                    </p>

                  </div>

                  <p className="shrink-0 font-medium text-gray-900">
                    Rs{" "}
                    {Number(
                      item.subtotal
                    ).toLocaleString(
                      "en-PK"
                    )}
                  </p>

                </div>
              )
            )}

          </div>
        </div>

        {/* Payment + Total */}
        <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">

          <h2 className="text-lg font-semibold text-gray-900">
            Order Summary
          </h2>

          <div className="mt-5 space-y-3 text-sm">

            <div className="flex justify-between">
              <span className="text-gray-500">
                Subtotal
              </span>

              <span className="font-medium text-gray-900">
                Rs{" "}
                {Number(
                  order.subtotal
                ).toLocaleString(
                  "en-PK"
                )}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">
                Delivery
              </span>

              <span className="font-medium text-gray-900">
                Rs{" "}
                {Number(
                  order.delivery_fee
                ).toLocaleString(
                  "en-PK"
                )}
              </span>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <div className="flex justify-between">
                <span className="text-base font-semibold text-gray-900">
                  Total
                </span>

                <span className="text-lg font-semibold text-green-700">
                  Rs{" "}
                  {Number(
                    order.total_amount
                  ).toLocaleString(
                    "en-PK"
                  )}
                </span>
              </div>
            </div>

          </div>

          <div className="mt-5 rounded-xl bg-gray-50 px-4 py-3">

            <p className="text-xs text-gray-400">
              Payment Method
            </p>

            <p className="mt-1 text-sm font-medium capitalize text-gray-800">
              {order.payment_method}
            </p>

          </div>

        </div>

      </div>
    </main>
  );
}

