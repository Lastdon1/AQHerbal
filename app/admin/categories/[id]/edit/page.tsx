import Link from "next/link";
import pool from "@/lib/db";
import { notFound } from "next/navigation";

type Category = {
  id: number;
  name: string;
  name_urdu: string | null;
  slug: string;
  description: string | null;
  description_urdu: string | null;
  is_active: boolean;
};

async function getCategory(id: number): Promise<Category | null> {
  const result = await pool.query(
    `
      SELECT
        id,
        name,
        name_urdu,
        slug,
        description,
        description_urdu,
        is_active
      FROM categories
      WHERE id = $1
    `,
    [id]
  );

  return result.rows[0] || null;
}

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const categoryId = Number(id);

  if (!Number.isInteger(categoryId)) {
    notFound();
  }

  const category = await getCategory(categoryId);

  if (!category) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-3xl">

        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/categories"
            className="text-sm font-medium text-green-700 hover:text-green-900"
          >
            ← Back to Categories
          </Link>

          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            Edit Category
          </h1>

          <p className="mt-2 text-gray-600">
            Update category information.
          </p>
        </div>

        {/* Form */}
        <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">

          <form
            action="/api/admin/categories/update"
            method="POST"
            className="space-y-6"
          >
            <input
              type="hidden"
              name="id"
              value={category.id}
            />

            {/* English Name */}
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
                defaultValue={category.name}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </div>

            {/* Urdu Name */}
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
                defaultValue={category.name_urdu || ""}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </div>

            {/* Slug */}
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
                defaultValue={category.slug}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />

              <p className="mt-2 text-xs text-gray-500">
                Example: herbal-medicines
              </p>
            </div>

            {/* English Description */}
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
                defaultValue={category.description || ""}
                className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </div>

            {/* Urdu Description */}
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
                defaultValue={category.description_urdu || ""}
                className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-lg outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </div>

            {/* Active */}
            <div className="flex items-center gap-3">
              <input
                id="is_active"
                name="is_active"
                type="checkbox"
                defaultChecked={category.is_active}
                className="h-5 w-5 rounded border-gray-300 text-green-700 focus:ring-green-600"
              />

              <label
                htmlFor="is_active"
                className="text-sm font-medium text-gray-700"
              >
                Category is active
              </label>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3 border-t pt-6 sm:flex-row sm:justify-end">

              <Link
                href="/admin/categories"
                className="rounded-lg border border-gray-300 px-6 py-3 text-center text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="rounded-lg bg-green-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
              >
                Update Category
              </button>

            </div>
          </form>

        </div>
      </div>
    </main>
  );
}