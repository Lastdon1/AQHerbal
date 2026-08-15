import Link from "next/link";
import pool from "@/lib/db";
import OrdersSearch from "./OrdersSearch";

type Order = {
  id: number;
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

async function getOrders(): Promise<Order[]> {
  const result = await pool.query(
    `
      SELECT
        id,
        order_number,
        customer_name,
        customer_phone,
        city,
        payment_method,
        subtotal,
        delivery_fee,
        total_amount,
        status,
        created_at
      FROM orders
      ORDER BY created_at DESC
    `
  );

  return result.rows;
}

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  const pendingOrders = orders.filter(
    (order) => order.status === "pending"
  ).length;

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mb-8">

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

            <div>

              <Link
                href="/admin"
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
                ← Back to Dashboard
              </Link>

              <h1 className="mt-4 text-3xl font-bold text-gray-900">
                Orders
              </h1>

              <p className="mt-2 text-gray-600">
                Manage customer orders and update their status.
              </p>

            </div>

            <div className="flex gap-3">

              <div className="rounded-xl bg-white px-4 py-3 shadow-sm">

                <p className="text-xs text-gray-500">
                  Total Orders
                </p>

                <p className="mt-1 text-xl font-bold text-gray-900">
                  {orders.length}
                </p>

              </div>

              <div className="rounded-xl bg-white px-4 py-3 shadow-sm">

                <p className="text-xs text-gray-500">
                  Pending
                </p>

                <p className="mt-1 text-xl font-bold text-yellow-600">
                  {pendingOrders}
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* =====================================================
            SEARCH + ORDERS
        ===================================================== */}

        <OrdersSearch orders={orders} />

      </div>
    </main>
  );
}