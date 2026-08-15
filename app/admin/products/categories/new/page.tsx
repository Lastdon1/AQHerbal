"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function NewCategoryPage() {
  const [name, setName] = useState("");
  const [nameUrdu, setNameUrdu] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionUrdu, setDescriptionUrdu] = useState("");
  const [image, setImage] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  function generateSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  function handleNameChange(value: string) {
    setName(value);

    if (!slug) {
      setSlug(generateSlug(value));
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setSuccess("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    try {
      const response = await fetch(
        "/api/admin/categories",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            name_urdu: nameUrdu || null,
            slug,
            description: description || null,
            description_urdu:
              descriptionUrdu || null,
            image: image || null,
            is_active: isActive,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Failed to create category."
        );
      }

      setSuccess(
        "Category created successfully."
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      setTimeout(() => {
        window.location.href =
          "/admin/products/categories";
      }, 1000);
    } catch (err) {
      console.error(
        "Create category error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to create category."
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-6 py-8">

        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/products/categories"
            className="text-sm font-medium text-green-700 hover:underline"
          >
            ← Back to Categories
          </Link>

          <h1 className="mt-3 text-3xl font-bold text-gray-900">
            Add Category
          </h1>

          <p className="mt-2 text-gray-600">
            Create a new ISACO product category.
          </p>
        </div>

        {/* Success */}
        {success && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-5 py-4 text-sm font-medium text-green-800">
            ✓ {success}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            ✕ {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* Basic Information */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <h2 className="text-lg font-semibold text-gray-900">
              Basic Information
            </h2>

            <div className="mt-6 grid gap-6 md:grid-cols-2">

              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Category Name
                  <span className="text-red-500">
                    {" "}*
                  </span>
                </label>

                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(event) =>
                    handleNameChange(
                      event.target.value
                    )
                  }
                  placeholder="e.g. Black Seed"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>

              {/* Urdu Name */}
              <div>
                <label
                  htmlFor="nameUrdu"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Category Name (Urdu)
                </label>

                <input
                  id="nameUrdu"
                  type="text"
                  dir="rtl"
                  value={nameUrdu}
                  onChange={(event) =>
                    setNameUrdu(
                      event.target.value
                    )
                  }
                  placeholder="مثلاً کلونجی"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-right text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>

              {/* Slug */}
              <div className="md:col-span-2">
                <label
                  htmlFor="slug"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Slug
                  <span className="text-red-500">
                    {" "}*
                  </span>
                </label>

                <input
                  id="slug"
                  type="text"
                  required
                  value={slug}
                  onChange={(event) =>
                    setSlug(
                      event.target.value
                        .toLowerCase()
                        .trim()
                    )
                  }
                  placeholder="black-seed"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />

                <p className="mt-2 text-xs text-gray-500">
                  Used in the category URL.
                </p>
              </div>

            </div>
          </div>

          {/* Descriptions */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <h2 className="text-lg font-semibold text-gray-900">
              Descriptions
            </h2>

            <div className="mt-6 space-y-6">

              {/* English Description */}
              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  rows={5}
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value
                    )
                  }
                  placeholder="Enter category description..."
                  className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>

              {/* Urdu Description */}
              <div>
                <label
                  htmlFor="descriptionUrdu"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Description (Urdu)
                </label>

                <textarea
                  id="descriptionUrdu"
                  rows={5}
                  dir="rtl"
                  value={descriptionUrdu}
                  onChange={(event) =>
                    setDescriptionUrdu(
                      event.target.value
                    )
                  }
                  placeholder="زمرے کی تفصیل درج کریں..."
                  className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-right text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>

            </div>
          </div>

          {/* Image */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <h2 className="text-lg font-semibold text-gray-900">
              Category Image
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Enter the image path or URL for this category.
            </p>

            <div className="mt-5">

              <label
                htmlFor="image"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Image URL
              </label>

              <input
                id="image"
                type="text"
                value={image}
                onChange={(event) =>
                  setImage(event.target.value)
                }
                placeholder="/categories/black-seed.png"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />

            </div>

            {image && (
              <div className="mt-5">

                <p className="mb-2 text-sm font-medium text-gray-700">
                  Preview
                </p>

                <div className="h-32 w-32 overflow-hidden rounded-xl border border-gray-200 bg-gray-100">

                  <img
                    src={image}
                    alt="Category preview"
                    className="h-full w-full object-cover"
                  />

                </div>

              </div>
            )}

          </div>

          {/* Status */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <h2 className="text-lg font-semibold text-gray-900">
              Status
            </h2>

            <label className="mt-5 flex cursor-pointer items-center gap-3">

              <input
                type="checkbox"
                checked={isActive}
                onChange={(event) =>
                  setIsActive(
                    event.target.checked
                  )
                }
                className="h-5 w-5 rounded border-gray-300 text-green-700 focus:ring-green-600"
              />

              <span className="text-sm font-medium text-gray-700">
                Category is active
              </span>

            </label>

          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

            <Link
              href="/admin/products/categories"
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center rounded-lg bg-green-700 px-6 py-3 text-sm font-medium text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : "Save Category"}
            </button>

          </div>

        </form>

      </div>
    </main>
  );
}