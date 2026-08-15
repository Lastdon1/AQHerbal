"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function NewCategoryPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =====================================================
  // AUTOMATIC SLUG GENERATION
  // =====================================================

  useEffect(() => {
    if (!slugEdited) {
      const generatedSlug = name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

      setSlug(generatedSlug);
    }
  }, [name, slugEdited]);

  // =====================================================
  // SUBMIT
  // =====================================================

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const formData = new FormData(event.currentTarget);

      const response = await fetch(
        "/api/admin/categories/create",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error || "Failed to create category."
        );

        setSaving(false);
        return;
      }

      setMessage("Category added successfully.");

      setTimeout(() => {
        router.push("/admin/categories");
        router.refresh();
      }, 1000);
    } catch (error) {
      console.error("Create category error:", error);

      setError(
        "Something went wrong while creating the category."
      );

      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-3xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-8">

          <Link
            href="/admin/categories"
            className="text-sm font-medium text-green-700 hover:text-green-900"
          >
            ← Back to Categories
          </Link>

          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            Add Category
          </h1>

          <p className="mt-2 text-gray-600">
            Create a new ISACO product category.
          </p>

        </div>

        {/* =================================================
            SUCCESS MESSAGE
        ================================================= */}

        {message && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-5 py-4">

            <p className="font-semibold text-green-800">
              ✓ {message}
            </p>

            <p className="mt-1 text-sm text-green-700">
              Redirecting to categories...
            </p>

          </div>
        )}

        {/* =================================================
            ERROR MESSAGE
        ================================================= */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4">

            <p className="font-semibold text-red-800">
              Unable to create category
            </p>

            <p className="mt-1 text-sm text-red-700">
              {error}
            </p>

          </div>
        )}

        {/* =================================================
            FORM
        ================================================= */}

        <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* =================================================
                CATEGORY NAME
            ================================================= */}

            <div>

              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Category Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="e.g. Herbal Medicines"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />

            </div>

            {/* =================================================
                URDU NAME
            ================================================= */}

            <div>

              <label
                htmlFor="name_urdu"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Category Name (Urdu)
              </label>

              <input
                id="name_urdu"
                name="name_urdu"
                type="text"
                dir="rtl"
                placeholder="مثلاً جڑی بوٹیاں"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />

            </div>

            {/* =================================================
                SLUG
            ================================================= */}

            <div>

              <label
                htmlFor="slug"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Slug
              </label>

              <input
                id="slug"
                name="slug"
                type="text"
                required
                value={slug}
                onChange={(event) => {
                  setSlugEdited(true);

                  setSlug(
                    event.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9-]/g, "-")
                      .replace(/-+/g, "-")
                      .replace(/^-|-$/g, "")
                  );
                }}
                placeholder="herbal-medicines"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />

              <p className="mt-2 text-xs text-gray-500">
                Automatically generated from the category
                name. You can edit it manually.
              </p>

            </div>

            {/* =================================================
                DESCRIPTION
            ================================================= */}

            <div>

              <label
                htmlFor="description"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Description
              </label>

              <textarea
                id="description"
                name="description"
                rows={5}
                placeholder="Enter category description..."
                className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />

            </div>

            {/* =================================================
                URDU DESCRIPTION
            ================================================= */}

            <div>

              <label
                htmlFor="description_urdu"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Description (Urdu)
              </label>

              <textarea
                id="description_urdu"
                name="description_urdu"
                rows={5}
                dir="rtl"
                placeholder="زمرے کی تفصیل لکھیں..."
                className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-lg outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />

            </div>

            {/* =================================================
                ACTIVE
            ================================================= */}

            <div className="flex items-center gap-3">

              <input
                id="is_active"
                name="is_active"
                type="checkbox"
                defaultChecked
                className="h-5 w-5 rounded border-gray-300 text-green-700 focus:ring-green-600"
              />

              <label
                htmlFor="is_active"
                className="text-sm font-medium text-gray-700"
              >
                Category is active
              </label>

            </div>

            {/* =================================================
                BUTTONS
            ================================================= */}

            <div className="flex flex-col gap-3 border-t pt-6 sm:flex-row sm:justify-end">

              <Link
                href="/admin/categories"
                className="rounded-lg border border-gray-300 px-6 py-3 text-center text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-green-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Creating..."
                  : "Create Category"}
              </button>

            </div>

          </form>

        </div>
      </div>
    </main>
  );
}