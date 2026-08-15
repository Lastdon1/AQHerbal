"use client";

import { FormEvent, useState } from "react";

type Props = {
  consultationId: number;
  email: string;
  currentAdvice: string | null;
  status: string;
};

export default function MashoraReplyForm({
  consultationId,
  email,
  currentAdvice,
  status,
}: Props) {
  const [advice, setAdvice] = useState(currentAdvice || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const hasEmail = Boolean(email?.trim());

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    setMessage("");
    setError("");

    if (!advice.trim()) {
      setError("Please write Hakeem Sahib's advice before saving.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/admin/mashora/reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          consultationId,
          advice: advice.trim(),
        }),
      });

      // ---------------------------------------------------------
      // Read response safely
      // ---------------------------------------------------------

      const contentType = response.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        const text = await response.text();

        console.error("Non-JSON API response:", text);

        throw new Error(
          `API returned an unexpected response (${response.status}). Please check the API route.`
        );
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to save the advice."
        );
      }

      setMessage(
        data.message || "Advice has been saved successfully."
      );

      // Keep the textarea showing the saved advice.
      setAdvice(data.consultation?.advice || advice);
    } catch (err) {
      console.error("Mashora reply error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while saving the advice."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="overflow-hidden rounded-xl border border-green-100 bg-white shadow-sm">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="border-b border-green-100 bg-green-50/60 px-6 py-5">
        <h2 className="text-lg font-semibold text-gray-900">
          Hakeem Sahib&apos;s Advice
        </h2>

        <p
          dir="rtl"
          className="mt-1 text-sm font-medium text-green-700"
        >
          حکیم صاحب کا مشورہ
        </p>

        <p className="mt-3 text-sm leading-6 text-gray-500">
          Write the advice below. You can write in English or Urdu.
        </p>
      </div>

      {/* =================================================
          FORM
      ================================================= */}

      <form onSubmit={handleSubmit} className="px-6 py-6">

        {/* =================================================
            EMAIL INFORMATION
        ================================================= */}

        <div
          className={`mb-6 rounded-lg border px-4 py-4 ${
            hasEmail
              ? "border-gray-100 bg-gray-50"
              : "border-amber-100 bg-amber-50"
          }`}
        >
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            Patient Email
          </p>

          {hasEmail ? (
            <>
              <p className="mt-1 break-all text-sm font-semibold text-gray-800">
                {email}
              </p>

              <p
                dir="rtl"
                className="mt-1 text-xs text-gray-500"
              >
                جواب اس ای میل پر بھیجا جائے گا۔
              </p>
            </>
          ) : (
            <>
              <p className="mt-1 text-sm font-semibold text-amber-700">
                No email address available
              </p>

              <p className="mt-1 text-xs leading-5 text-amber-700">
                This is an older consultation. The advice will be saved
                in the CMS, but there is no email address to send it to.
              </p>

              <p
                dir="rtl"
                className="mt-1 text-xs leading-5 text-amber-700"
              >
                اس پرانے مشورے میں ای میل موجود نہیں۔ جواب CMS میں محفوظ
                ہو جائے گا لیکن صارف کو ای میل نہیں بھیجی جا سکے گی۔
              </p>
            </>
          )}
        </div>

        {/* =================================================
            ADVICE
        ================================================= */}

        <div>
          <label
            htmlFor="advice"
            className="block text-sm font-semibold text-gray-800"
          >
            Advice / Response
            <span
              dir="rtl"
              className="ml-2 font-medium text-green-700"
            >
              / مشورہ
            </span>
          </label>

          <textarea
            id="advice"
            name="advice"
            value={advice}
            onChange={(e) => {
              setAdvice(e.target.value);
              setError("");
              setMessage("");
            }}
            disabled={loading}
            rows={12}
            dir="auto"
            placeholder={`Write Hakeem Sahib's advice here...

آپ اردو یا English میں مشورہ لکھ سکتے ہیں۔`}
            className="mt-2 w-full resize-y rounded-xl border border-gray-200 bg-white px-4 py-4 text-[15px] leading-8 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-600/10 disabled:cursor-not-allowed disabled:bg-gray-50"
          />

          <div className="mt-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-gray-400">
              English or Urdu is supported.
            </p>

            <p
              dir="rtl"
              className="text-xs text-gray-400"
            >
              آپ اردو یا English میں مشورہ لکھ سکتے ہیں۔
            </p>
          </div>
        </div>

        {/* =================================================
            SUCCESS
        ================================================= */}

        {message && (
          <div
            role="status"
            className="mt-5 rounded-xl border border-green-100 bg-green-50 px-4 py-4"
          >
            <p className="text-sm font-semibold text-green-800">
              ✓ {message}
            </p>

            <p
              dir="rtl"
              className="mt-1 text-sm text-green-700"
            >
              مشورہ کامیابی سے محفوظ ہو گیا ہے۔
            </p>
          </div>
        )}

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div
            role="alert"
            className="mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-4"
          >
            <p className="text-sm font-semibold text-red-700">
              {error}
            </p>
          </div>
        )}

        {/* =================================================
            ACTION
        ================================================= */}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-xs text-gray-400">
            {hasEmail
              ? "The advice will be saved. Email sending will be connected next."
              : "This consultation has no email. Advice will only be saved in CMS."}
          </p>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-700 px-6 py-3 font-medium text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <svg
                  className="h-5 w-5 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="opacity-30"
                  />

                  <path
                    fill="currentColor"
                    d="M21 12a9 9 0 00-9-9v3a6 6 0 016 6h3z"
                  />
                </svg>

                Saving...
              </>
            ) : hasEmail ? (
              status === "answered"
                ? "Update Advice"
                : "Save Advice"
            ) : (
              "Save Advice"
            )}
          </button>
        </div>
      </form>
    </section>
  );
}