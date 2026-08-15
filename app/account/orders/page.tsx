
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
  status:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  created_at: string;
};

function formatDate(
  date: string
) {
  return new Date(date).toLocaleDateString(
    "en-PK",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

function statusClass(
  status: Order["status"]
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

export default function CustomerOrdersPage() {
  const router = useRouter();

  const [orders, setOrders] =
    useState<Order[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadOrders() {
      try {
        const response = await fetch(
          "/api/account/orders",
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
              "Unable to load orders."
          );
          return;
        }

        setOrders(
          data?.orders || []
        );
      } catch (error) {
        console.error(
          "LOAD CUSTOMER ORDERS ERROR:",
          error
        );

        setError(
          "Unable to load your orders. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-[70vh] bg-white">
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-green-700" />

            <p className="mt-3 text-sm text-gray-500">
              Loading your orders...
            </p>

            <p
              dir="rtl"
              className="mt-1 text-sm text-gray-500"
            >
              آپ کے آرڈرز لوڈ ہو رہے ہیں...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[70vh] bg-white py-10 sm:py-14">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">

          <Link
            href="/account"
            className="text-sm font-medium text-gray-500 hover:text-green-700"
          >
            ← Back to Account
          </Link>

          <div className="mt-5">
            <h1 className="text-3xl font-semibold text-gray-900">
              My Orders
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              View your order history and order status.
            </p>

            <p
              dir="rtl"
              className="mt-1 text-base text-gray-600"
            >
              اپنے آرڈرز اور ان کی صورتحال دیکھیں
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl bg-red-50 px-5 py-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Empty */}
        {!error && orders.length === 0 && (
          <div className="rounded-2xl border border-gray-100 bg-white px-6 py-12 text-center shadow-sm">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-500">
              🛍
            </div>

            <h2 className="mt-5 text-xl font-semibold text-gray-900">
              No Orders Yet
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              You haven't placed any orders yet.
            </p>

            <p
              dir="rtl"
              className="mt-1 text-sm text-gray-500"
            >
              آپ نے ابھی تک کوئی آرڈر نہیں کیا۔
            </p>

            <Link
              href="/store"
              className="mt-6 inline-flex rounded-xl bg-green-700 px-6 py-3 text-sm font-medium text-white hover:bg-green-800"
            >
              Start Shopping
            </Link>
          </div>
        )}

        {/* Orders */}
        {orders.length > 0 && (
          <div className="space-y-4">

            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/account/orders/${order.order_number}`}
                className="block rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:border-green-200 hover:shadow-md sm:p-6"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                  {/* Order Info */}
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Order Number
                    </p>

                    <p className="mt-1 text-lg font-semibold text-gray-900">
                      #{order.order_number}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      {formatDate(
                        order.created_at
                      )}
                    </p>
                  </div>

                  {/* Status */}
                  <div>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium capitalize ${statusClass(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  {/* Total */}
                  <div className="sm:text-right">
                    <p className="text-xs text-gray-400">
                      Total
                    </p>

                    <p className="mt-1 text-lg font-semibold text-gray-900">
                      Rs{" "}
                      {Number(
                        order.total_amount
                      ).toLocaleString(
                        "en-PK"
                      )}
                    </p>

                    <p className="mt-1 text-xs text-green-700">
                      View Details →
                    </p>
                  </div>

                </div>
              </Link>
            ))}

          </div>
        )}
      </div>
    </main>
  );
}

