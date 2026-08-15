"use client";

import Link from "next/link";
import { FormEvent, Suspense, useState } from "react";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";

function CustomerLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const registered =
    searchParams.get("registered");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "/api/account/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data?.error ||
            "Invalid email or password."
        );
        return;
      }

      /*
       * Login API has successfully created
       * the customer session cookie.
       *
       * Notify the Header immediately so it can
       * update the account state without requiring
       * router.refresh().
       */
      window.dispatchEvent(
        new Event("customer-auth-changed")
      );

      /*
       * Client-side navigation is enough here.
       */
      router.push("/account");
    } catch (error) {
      console.error(
        "CUSTOMER LOGIN ERROR:",
        error
      );

      setError(
        "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto flex min-h-[calc(100vh-120px)] max-w-md items-center px-4 py-12">
        <div className="w-full rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">

          {/* Heading */}

          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold text-gray-900">
              Welcome Back
            </h1>

            <p
              dir="rtl"
              className="mt-2 text-base text-gray-600"
            >
              خوش آمدید
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Login to your ISACO account
            </p>

            <p
              dir="rtl"
              className="mt-1 text-sm text-gray-500"
            >
              اپنے آئی ساکو اکاؤنٹ میں لاگ اِن کریں
            </p>
          </div>

          {/* Registration success */}

          {registered === "1" && (
            <div className="mb-5 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
              <p>
                Account created successfully.
                Please login to continue.
              </p>

              <p
                dir="rtl"
                className="mt-1"
              >
                اکاؤنٹ کامیابی سے بن گیا ہے۔
                براہِ کرم لاگ اِن کریں۔
              </p>
            </div>
          )}

          {/* Error */}

          {error && (
            <div className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Login form */}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* Email */}

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="Enter your email"
                autoComplete="email"
                required
                disabled={loading}
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:bg-gray-50"
              />
            </div>

            {/* Password */}

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                disabled={loading}
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:bg-gray-50"
              />
            </div>

            {/* Login button */}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-green-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Logging in..."
                : "Login"}
            </button>
          </form>

          {/* Register */}

          <div className="mt-6 text-center text-sm text-gray-500">
            <span>
              Don&apos;t have an account?{" "}
            </span>

            <Link
              href="/account/register"
              className="font-medium text-green-700 hover:text-green-800"
            >
              Create Account
            </Link>
          </div>

          <div className="mt-2 text-center">
            <Link
              href="/account/register"
              dir="rtl"
              className="text-sm text-gray-500 hover:text-green-700"
            >
              نیا اکاؤنٹ بنائیں
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}

export default function CustomerLoginPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-white">
          <div className="mx-auto flex min-h-[calc(100vh-120px)] max-w-md items-center px-4 py-12">
            <div className="w-full rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
              <div className="text-center text-sm text-gray-500">
                Loading...
              </div>
            </div>
          </div>
        </main>
      }
    >
      <CustomerLoginForm />
    </Suspense>
  );
}