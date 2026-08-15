"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type OrderItem = {
  id: number;
  order_id: number;
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
  payment_method: "easypaisa" | "jazzcash" | "cod";
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
  order_notes?: string | null;
  created_at: string;
};

type OrderResponse = {
  success: boolean;
  order?: Order;
  items?: OrderItem[];
  message?: string;
};

const statuses = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;

type OrderStatus = (typeof statuses)[number];

/* ============================================================
   HELPERS
============================================================ */

function formatMoney(value: number) {
  return `Rs ${Number(value || 0).toLocaleString("en-PK")}`;
}

function formatDate(value: string) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString("en-PK", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function getStatusClasses(status: OrderStatus) {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-700";

    case "confirmed":
      return "bg-blue-100 text-blue-700";

    case "processing":
      return "bg-purple-100 text-purple-700";

    case "shipped":
      return "bg-indigo-100 text-indigo-700";

    case "delivered":
      return "bg-green-100 text-green-700";

    case "cancelled":
      return "bg-red-100 text-red-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
}

function formatStatus(status: OrderStatus) {
  return (
    status.charAt(0).toUpperCase() +
    status.slice(1)
  );
}

function getPaymentMethodLabel(
  paymentMethod: Order["payment_method"]
) {
  switch (paymentMethod) {
    case "easypaisa":
      return "EasyPaisa";

    case "jazzcash":
      return "JazzCash";

    case "cod":
      return "Cash on Delivery";

    default:
      return paymentMethod;
  }
}

/* ============================================================
   PAGE
============================================================ */

export default function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [order, setOrder] =
    useState<Order | null>(null);

  const [items, setItems] =
    useState<OrderItem[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isUpdating, setIsUpdating] =
    useState(false);

  const [selectedStatus, setSelectedStatus] =
    useState<OrderStatus>("pending");

  const [errorMessage, setErrorMessage] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  const [orderId, setOrderId] =
    useState("");

  /* ============================================================
     LOAD ORDER
  ============================================================ */

  useEffect(() => {
    let cancelled = false;

    async function loadOrder() {
      try {
        const resolvedParams = await params;

        if (cancelled) {
          return;
        }

        const id = resolvedParams.id;

        setOrderId(id);

        const response = await fetch(
          `/api/admin/orders/${id}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const data: OrderResponse =
          await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message ||
              "Unable to load order."
          );
        }

        if (!data.order) {
          throw new Error(
            "Order data was not returned."
          );
        }

        if (cancelled) {
          return;
        }

        setOrder(data.order);

        setItems(
          Array.isArray(data.items)
            ? data.items
            : []
        );

        setSelectedStatus(
          data.order.status
        );

        setErrorMessage("");
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          "LOAD ADMIN ORDER ERROR:",
          error
        );

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to load order."
        );
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadOrder();

    return () => {
      cancelled = true;
    };
  }, [params]);

  /* ============================================================
     UPDATE STATUS
  ============================================================ */

  async function handleUpdateStatus() {
    if (!order || isUpdating) {
      return;
    }

    if (
      selectedStatus === order.status
    ) {
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");
    setIsUpdating(true);

    try {
      const response = await fetch(
        `/api/admin/orders/${order.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: selectedStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to update order status."
        );
      }

      setOrder((currentOrder) => {
        if (!currentOrder) {
          return currentOrder;
        }

        return {
          ...currentOrder,
          status: selectedStatus,
        };
      });

      setSuccessMessage(
        "Order status updated successfully."
      );
    } catch (error) {
      console.error(
        "UPDATE ORDER STATUS ERROR:",
        error
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to update order status."
      );
    } finally {
      setIsUpdating(false);
    }
  }

  /* ============================================================
     LOADING
  ============================================================ */

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center">
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

            <p className="mt-3 text-sm text-gray-500">
              Loading order...
            </p>
          </div>
        </div>
      </main>
    );
  }

  /* ============================================================
     ORDER NOT FOUND
  ============================================================ */

  if (!order) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/admin/orders"
            className="
              text-sm
              font-medium
              text-green-700
              hover:text-green-800
            "
          >
            ← Back to Orders
          </Link>

          <div
            className="
              mt-6
              rounded-2xl
              bg-white
              p-8
              text-center
              shadow-sm
            "
          >
            <h1 className="text-xl font-bold text-gray-900">
              Order Not Found
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              {errorMessage ||
                `Order ${orderId} could not be found.`}
            </p>
          </div>
        </div>
      </main>
    );
  }

  /* ============================================================
     MAIN
  ============================================================ */

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">

        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="mb-6">
          <Link
            href="/admin/orders"
            className="
              inline-flex
              items-center
              text-sm
              font-medium
              text-gray-500
              transition
              hover:text-green-700
            "
          >
            ← Back to Orders
          </Link>

          <div
            className="
              mt-4
              flex
              flex-col
              justify-between
              gap-4
              sm:flex-row
              sm:items-end
            "
          >
            <div>
              <p className="text-sm font-medium text-gray-500">
                Order
              </p>

              <h1
                className="
                  mt-1
                  text-2xl
                  font-bold
                  text-gray-900
                  sm:text-3xl
                "
              >
                {order.order_number}
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Placed on{" "}
                {formatDate(order.created_at)}
              </p>
            </div>

            <span
              className={`
                inline-flex
                w-fit
                rounded-full
                px-3
                py-1.5
                text-xs
                font-semibold
                ${getStatusClasses(order.status)}
              `}
            >
              {formatStatus(order.status)}
            </span>
          </div>
        </div>

        {/* ======================================================
            MESSAGES
        ====================================================== */}

        {errorMessage && (
          <div
            className="
              mb-5
              rounded-xl
              border
              border-red-200
              bg-red-50
              px-4
              py-3
              text-sm
              text-red-700
            "
          >
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div
            className="
              mb-5
              rounded-xl
              border
              border-green-200
              bg-green-50
              px-4
              py-3
              text-sm
              text-green-700
            "
          >
            {successMessage}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">

          {/* ====================================================
              LEFT SIDE
          ==================================================== */}

          <div className="space-y-6">

            {/* CUSTOMER INFORMATION */}

            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Customer Information
                </h2>

                <p className="mt-0.5 text-sm text-gray-500">
                  Customer details
                </p>
              </div>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Name
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {order.customer_name}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Phone
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {order.customer_phone}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    City
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {order.city}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Payment Method
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {getPaymentMethodLabel(
                      order.payment_method
                    )}
                  </p>
                </div>
              </div>

              <div className="mt-5 border-t border-gray-100 pt-5">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Delivery Address
                </p>

                <p className="mt-2 text-sm leading-6 text-gray-700">
                  {order.address}
                </p>
              </div>

              {/* ORDER NOTES */}

              {order.order_notes?.trim() && (
                <div className="mt-5 border-t border-gray-100 pt-5">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Order Notes
                  </p>

                  <p className="mt-2 rounded-lg bg-gray-50 p-3 text-sm leading-6 text-gray-700">
                    {order.order_notes}
                  </p>
                </div>
              )}
            </section>

            {/* ORDER ITEMS */}

            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Order Items
                </h2>

                <p className="mt-0.5 text-sm text-gray-500">
                  Products included in this order
                </p>
              </div>

              <div className="mt-5 divide-y divide-gray-100">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="
                      flex
                      gap-4
                      py-4
                      first:pt-0
                      last:pb-0
                    "
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-900">
                        {item.product_name}
                      </p>

                      {item.product_name_urdu && (
                        <p
                          dir="rtl"
                          className="
                            mt-1
                            text-right
                            text-sm
                            text-gray-500
                          "
                        >
                          {item.product_name_urdu}
                        </p>
                      )}

                      <div
                        className="
                          mt-2
                          flex
                          flex-wrap
                          gap-x-3
                          gap-y-1
                          text-xs
                          text-gray-500
                        "
                      >
                        <span>
                          {Number(
                            item.quantity_value
                          )}{" "}
                          {item.unit}
                        </span>

                        <span>
                          × {Number(item.quantity)}
                        </span>

                        <span>
                          {formatMoney(
                            Number(item.price)
                          )}{" "}
                          each
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-sm font-bold text-gray-900">
                        {formatMoney(
                          Number(item.subtotal)
                        )}
                      </p>
                    </div>
                  </div>
                ))}

                {items.length === 0 && (
                  <p className="py-4 text-sm text-gray-500">
                    No items found for this order.
                  </p>
                )}
              </div>
            </section>
          </div>

          {/* ====================================================
              RIGHT SIDE
          ==================================================== */}

          <aside className="space-y-6">

            {/* ORDER STATUS */}

            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">
                Order Status
              </h2>

              <p className="mt-0.5 text-sm text-gray-500">
                Update order progress
              </p>

              <div className="mt-5">
                <label
                  htmlFor="order-status"
                  className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-gray-700
                  "
                >
                  Status
                </label>

                <select
                  id="order-status"
                  value={selectedStatus}
                  onChange={(event) =>
                    setSelectedStatus(
                      event.target.value as OrderStatus
                    )
                  }
                  disabled={isUpdating}
                  className="
                    h-11
                    w-full
                    rounded-lg
                    border
                    border-gray-200
                    bg-white
                    px-3
                    text-sm
                    text-gray-900
                    outline-none
                    transition
                    focus:border-green-600
                    focus:ring-2
                    focus:ring-green-100
                    disabled:cursor-not-allowed
                    disabled:bg-gray-50
                  "
                >
                  {statuses.map((status) => (
                    <option
                      key={status}
                      value={status}
                    >
                      {formatStatus(status)}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleUpdateStatus}
                disabled={
                  isUpdating ||
                  selectedStatus === order.status
                }
                className="
                  mt-4
                  flex
                  h-11
                  w-full
                  items-center
                  justify-center
                  rounded-lg
                  bg-green-700
                  px-4
                  text-sm
                  font-semibold
                  text-white
                  shadow-sm
                  transition
                  hover:bg-green-800
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {isUpdating
                  ? "Updating..."
                  : "Update Status"}
              </button>
            </section>

            {/* ORDER SUMMARY */}

            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">
                Order Summary
              </h2>

              <div className="mt-5 space-y-3">

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    Subtotal
                  </span>

                  <span className="font-medium text-gray-900">
                    {formatMoney(
                      Number(order.subtotal)
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    Delivery
                  </span>

                  <span className="font-medium text-gray-900">
                    {Number(order.delivery_fee) ===
                    0
                      ? "Free"
                      : formatMoney(
                          Number(
                            order.delivery_fee
                          )
                        )}
                  </span>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-gray-900">
                      Total
                    </span>

                    <span className="text-xl font-bold text-green-700">
                      {formatMoney(
                        Number(
                          order.total_amount
                        )
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* PAYMENT */}

            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">
                Payment
              </h2>

              <div className="mt-4">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Method
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {getPaymentMethodLabel(
                    order.payment_method
                  )}
                </p>

                {order.payment_method ===
                  "cod" && (
                  <p className="mt-2 text-xs text-gray-500">
                    Payment will be collected when
                    the order is delivered.
                  </p>
                )}

                {order.payment_method ===
                  "easypaisa" && (
                  <p className="mt-2 text-xs text-gray-500">
                    EasyPaisa payment selected.
                  </p>
                )}

                {order.payment_method ===
                  "jazzcash" && (
                  <p className="mt-2 text-xs text-gray-500">
                    JazzCash payment selected.
                  </p>
                )}
              </div>
            </section>

          </aside>
        </div>
      </div>
    </main>
  );
}