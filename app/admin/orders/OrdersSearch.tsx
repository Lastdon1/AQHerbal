"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Order = {
  id: number | string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
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
  created_at: string;
};

type Props = {
  orders: Order[];
};

function formatMoney(value: number) {
  return `Rs ${Number(value || 0).toLocaleString("en-PK")}`;
}

function formatDate(value: string) {
  if (!value) return "-";

  return new Date(value).toLocaleString("en-PK", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatStatus(status: Order["status"]) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function getStatusClasses(status: Order["status"]) {
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

function getPaymentLabel(paymentMethod: Order["payment_method"]) {
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

export default function OrdersSearch({ orders }: Props) {
  const [localOrders, setLocalOrders] = useState<Order[]>(orders);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return localOrders;
    }

    const normalizedQuery = query.replace(/^#/, "");

    return localOrders.filter((order) => {
      const orderId = String(order.id)
        .trim()
        .toLowerCase();

      const orderNumber = String(order.order_number || "")
        .trim()
        .toLowerCase();

      const customerName = String(order.customer_name || "")
        .trim()
        .toLowerCase();

      const phone = String(order.customer_phone || "")
        .trim()
        .toLowerCase();

      return (
        orderId === normalizedQuery ||
        orderId.includes(normalizedQuery) ||
        orderNumber.includes(query) ||
        customerName.includes(query) ||
        phone.includes(query)
      );
    });
  }, [localOrders, search]);

  async function handleDelete(order: Order) {
    const confirmed = window.confirm(
      `Are you sure you want to delete order ${order.order_number}?\n\nThis action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    const id = String(order.id);

    try {
      setDeletingId(id);

      const response = await fetch(`/api/admin/orders/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Failed to delete order."
        );
      }

      setLocalOrders((currentOrders) =>
        currentOrders.filter(
          (currentOrder) =>
            String(currentOrder.id) !== id
        )
      );
    } catch (error) {
      console.error("Delete order error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete order."
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      {/* =====================================================
          SEARCH
      ===================================================== */}

      <div className="mb-5">
        <div className="relative">
          <svg
            viewBox="0 0 24 24"
            className="
              pointer-events-none
              absolute
              left-3
              top-1/2
              h-5
              w-5
              -translate-y-1/2
              text-gray-400
            "
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <circle
              cx="11"
              cy="11"
              r="7"
            />

            <path
              d="m20 20-4-4"
              strokeLinecap="round"
            />
          </svg>

          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search order number, order ID, customer name or phone..."
            className="
              h-12
              w-full
              rounded-xl
              border
              border-gray-200
              bg-white
              pl-10
              pr-10
              text-sm
              text-gray-900
              shadow-sm
              outline-none
              transition
              placeholder:text-gray-400
              focus:border-green-600
              focus:ring-2
              focus:ring-green-100
            "
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="
                absolute
                right-3
                top-1/2
                flex
                h-7
                w-7
                -translate-y-1/2
                items-center
                justify-center
                rounded-full
                text-gray-400
                transition
                hover:bg-gray-100
                hover:text-gray-700
              "
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        {search.trim() && (
          <p className="mt-2 text-xs text-gray-500">
            Showing {filteredOrders.length}{" "}
            {filteredOrders.length === 1
              ? "order"
              : "orders"}{" "}
            matching{" "}
            <span className="font-medium text-gray-700">
              "{search}"
            </span>
          </p>
        )}
      </div>

      {/* =====================================================
          NO SEARCH RESULTS
      ===================================================== */}

      {filteredOrders.length === 0 ? (
        <div
          className="
            rounded-2xl
            bg-white
            px-6
            py-14
            text-center
            shadow-sm
          "
        >
          <div
            className="
              mx-auto
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-full
              bg-gray-100
              text-gray-400
            "
          >
            <svg
              viewBox="0 0 24 24"
              className="h-7 w-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
            >
              <circle
                cx="11"
                cy="11"
                r="7"
              />

              <path
                d="m20 20-4-4"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <h2 className="mt-4 text-lg font-bold text-gray-900">
            No Orders Found
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Try searching with an order number, order ID,
            customer name or phone number.
          </p>

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="
                mt-5
                inline-flex
                h-10
                items-center
                justify-center
                rounded-lg
                bg-green-700
                px-5
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-green-800
              "
            >
              Show All Orders
            </button>
          )}
        </div>
      ) : (
        <div
          className="
            overflow-hidden
            rounded-2xl
            bg-white
            shadow-sm
          "
        >
          {/* =================================================
              DESKTOP TABLE
          ================================================= */}

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[1000px]">
              <thead className="border-b border-gray-100 bg-gray-50">
                <tr>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Order
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Customer
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    City
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Payment
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Total
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Date
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order) => {
                  const isDeleting =
                    deletingId === String(order.id);

                  return (
                    <tr
                      key={order.id}
                      className="transition hover:bg-gray-50"
                    >
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-gray-900">
                          {order.order_number}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          Order ID: #{order.id}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-gray-900">
                          {order.customer_name}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {order.customer_phone}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm text-gray-700">
                          {order.city}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm text-gray-700">
                          {getPaymentLabel(
                            order.payment_method
                          )}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <p className="text-sm font-bold text-gray-900">
                          {formatMoney(
                            order.total_amount
                          )}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`
                            inline-flex
                            rounded-full
                            px-2.5
                            py-1
                            text-xs
                            font-semibold
                            ${getStatusClasses(
                              order.status
                            )}
                          `}
                        >
                          {formatStatus(
                            order.status
                          )}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-xs text-gray-500">
                          {formatDate(
                            order.created_at
                          )}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="
                              inline-flex
                              h-9
                              items-center
                              justify-center
                              rounded-lg
                              bg-green-700
                              px-4
                              text-xs
                              font-semibold
                              text-white
                              transition
                              hover:bg-green-800
                            "
                          >
                            View
                          </Link>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(order)
                            }
                            disabled={isDeleting}
                            className="
                              inline-flex
                              h-9
                              items-center
                              justify-center
                              rounded-lg
                              bg-red-600
                              px-4
                              text-xs
                              font-semibold
                              text-white
                              transition
                              hover:bg-red-700
                              disabled:cursor-not-allowed
                              disabled:opacity-50
                            "
                          >
                            {isDeleting
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* =================================================
              MOBILE ORDERS
          ================================================= */}

          <div className="divide-y divide-gray-100 md:hidden">
            {filteredOrders.map((order) => {
              const isDeleting =
                deletingId === String(order.id);

              return (
                <div
                  key={order.id}
                  className="p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-gray-900">
                        {order.order_number}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        Order ID: #{order.id}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        {formatDate(
                          order.created_at
                        )}
                      </p>
                    </div>

                    <span
                      className={`
                        shrink-0
                        rounded-full
                        px-2.5
                        py-1
                        text-[11px]
                        font-semibold
                        ${getStatusClasses(
                          order.status
                        )}
                      `}
                    >
                      {formatStatus(
                        order.status
                      )}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                        Customer
                      </p>

                      <p className="mt-1 text-sm font-medium text-gray-900">
                        {order.customer_name}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                        Phone
                      </p>

                      <p className="mt-1 text-sm text-gray-700">
                        {order.customer_phone}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                        City
                      </p>

                      <p className="mt-1 text-sm text-gray-700">
                        {order.city}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                        Payment
                      </p>

                      <p className="mt-1 text-sm text-gray-700">
                        {getPaymentLabel(
                          order.payment_method
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                        Total
                      </p>

                      <p className="mt-1 text-sm font-bold text-gray-900">
                        {formatMoney(
                          order.total_amount
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-2">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="
                        flex
                        h-10
                        items-center
                        justify-center
                        rounded-lg
                        bg-green-700
                        text-sm
                        font-semibold
                        text-white
                        transition
                        hover:bg-green-800
                      "
                    >
                      View Order
                    </Link>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(order)
                      }
                      disabled={isDeleting}
                      className="
                        flex
                        h-10
                        items-center
                        justify-center
                        rounded-lg
                        bg-red-600
                        text-sm
                        font-semibold
                        text-white
                        transition
                        hover:bg-red-700
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >
                      {isDeleting
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}