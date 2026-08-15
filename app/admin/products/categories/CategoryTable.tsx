"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

type Category = {
  id: number;
  name: string;
  name_urdu: string | null;
  slug: string;
  description: string | null;
  description_urdu: string | null;
  image: string | null;
  is_active: boolean;
};

type CategoryTableProps = {
  categories: Category[];
};

export default function CategoryTable({
  categories,
}: CategoryTableProps) {
  const [items, setItems] =
    useState<Category[]>(categories);

  const [deletingId, setDeletingId] =
    useState<number | null>(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleDelete(
    category: Category
  ) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${category.name}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(category.id);
    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    try {
      const response = await fetch(
        `/api/admin/categories/${category.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Failed to delete category."
        );
      }

      setItems((current) =>
        current.filter(
          (item) => item.id !== category.id
        )
      );

      setMessage(
        "Category deleted successfully."
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      console.error(
        "Delete category error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete category."
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      {/* Success */}
      {message && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-5 py-4 text-sm font-medium text-green-800">
          ✓ {message}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
          ✕ {error}
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        {items.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-2xl text-green-700">
              +
            </div>

            <h2 className="mt-5 text-lg font-semibold text-gray-900">
              No categories found
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              You do not have any categories in the
              database yet.
            </p>

            <Link
              href="/admin/products/categories/new"
              className="mt-5 inline-flex rounded-lg bg-green-700 px-5 py-3 font-medium text-white transition hover:bg-green-800"
            >
              Add Your First Category
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Category
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Slug
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {items.map((category) => (
                  <tr
                    key={category.id}
                    className="transition hover:bg-gray-50"
                  >
                    {/* Category */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {/* Image */}
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
                          {category.image ? (
                            <Image
                              src={category.image}
                              alt={category.name}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                              No Image
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900">
                            {category.name}
                          </p>

                          {category.name_urdu && (
                            <p
                              dir="rtl"
                              className="mt-1 text-sm text-gray-600"
                            >
                              {category.name_urdu}
                            </p>
                          )}

                          {category.description && (
                            <p className="mt-1 max-w-xl truncate text-xs text-gray-400">
                              {category.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Slug */}
                    <td className="px-6 py-4 text-sm text-gray-500">
                      /{category.slug}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={
                          category.is_active
                            ? "rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700"
                            : "rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
                        }
                      >
                        {category.is_active
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/categories/${category.id}/edit`}
                          className="inline-flex rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-700 transition hover:bg-green-100"
                        >
                          Edit
                        </Link>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(category)
                          }
                          disabled={
                            deletingId === category.id
                          }
                          className="inline-flex rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {deletingId === category.id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}