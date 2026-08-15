
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Customer = {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
};

export default function AccountPage() {
  const router = useRouter();

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    async function loadAccount() {
      try {
        const response = await fetch(
          "/api/account/me",
          {
            method: "GET",
            cache: "no-store",
          }
        );

        if (!response.ok) {
          router.replace("/account/login");
          return;
        }

        const data = await response.json();

        if (!data?.customer) {
          router.replace("/account/login");
          return;
        }

        setCustomer(data.customer);
      } catch (error) {
        console.error(
          "ACCOUNT LOAD ERROR:",
          error
        );

        router.replace("/account/login");
      } finally {
        setLoading(false);
      }
    }

    loadAccount();
  }, [router]);

  async function handleLogout() {
    setLoggingOut(true);

    try {
      const response = await fetch(
        "/api/account/logout",
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        console.error(
          "Logout failed."
        );
      }

      router.replace("/account/login");
      router.refresh();
    } catch (error) {
      console.error(
        "CUSTOMER LOGOUT ERROR:",
        error
      );

      setLoggingOut(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-[70vh] bg-white">
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-green-700" />

            <p className="mt-3 text-sm text-gray-500">
              Loading account...
            </p>

            <p
              dir="rtl"
              className="mt-1 text-sm text-gray-500"
            >
              اکاؤنٹ لوڈ ہو رہا ہے...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!customer) {
    return null;
  }

  return (
    <main className="min-h-[70vh] bg-white py-10 sm:py-14">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold text-gray-900 sm:text-4xl">
            My Account
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage your ISACO account
          </p>

          <p
            dir="rtl"
            className="mt-1 text-base text-gray-600"
          >
            اپنے آئی ساکو اکاؤنٹ کا انتظام کریں
          </p>
        </div>

        {/* Account Card */}
        <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

          {/* Customer Header */}
          <div className="bg-green-50 px-6 py-7 sm:px-8">
            <div className="flex items-center gap-4">

              {/* Avatar */}
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-green-700 text-xl font-semibold text-white">
                {customer.name
                  ? customer.name
                      .charAt(0)
                      .toUpperCase()
                  : "U"}
              </div>

              <div className="min-w-0">
                <h2 className="truncate text-xl font-semibold text-gray-900">
                  {customer.name}
                </h2>

                <p className="mt-1 truncate text-sm text-gray-600">
                  {customer.email}
                </p>
              </div>

            </div>
          </div>

          {/* Account Details */}
          <div className="divide-y divide-gray-100">

            {/* Name */}
            <div className="px-6 py-5 sm:px-8">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Name
              </p>

              <p className="mt-1 text-sm text-gray-800">
                {customer.name}
              </p>

              <p
                dir="rtl"
                className="mt-1 text-sm text-gray-500"
              >
                نام
              </p>
            </div>

            {/* Email */}
            <div className="px-6 py-5 sm:px-8">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Email
              </p>

              <p className="mt-1 text-sm text-gray-800">
                {customer.email}
              </p>

              <p
                dir="rtl"
                className="mt-1 text-sm text-gray-500"
              >
                ای میل
              </p>
            </div>

            {/* Phone */}
            {customer.phone && (
              <div className="px-6 py-5 sm:px-8">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Phone
                </p>

                <p className="mt-1 text-sm text-gray-800">
                  {customer.phone}
                </p>

                <p
                  dir="rtl"
                  className="mt-1 text-sm text-gray-500"
                >
                  فون
                </p>
              </div>
            )}

          </div>

          {/* Actions */}
          <div className="border-t border-gray-100 bg-gray-50 px-6 py-6 sm:px-8">

            <div className="grid gap-3 sm:grid-cols-2">

              {/* Orders */}
              <Link
                href="/account/orders"
                className="flex items-center justify-center rounded-xl bg-green-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-green-800"
              >
                My Orders
              </Link>

              {/* Store */}
              <Link
                href="/store"
                className="flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition hover:border-green-600 hover:text-green-700"
              >
                Continue Shopping
              </Link>

            </div>

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="mt-4 w-full rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loggingOut
                ? "Logging out..."
                : "Logout"}
            </button>

            <p
              dir="rtl"
              className="mt-2 text-center text-sm text-gray-500"
            >
              {loggingOut
                ? "لاگ آؤٹ ہو رہا ہے..."
                : "لاگ آؤٹ کریں"}
            </p>

          </div>
        </div>
      </div>
    </main>
  );
}

