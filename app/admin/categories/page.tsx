  import Link from "next/link";
import pool from "@/lib/db";
import DeleteCategoryButton from "@/components/admin/DeleteCategoryButton";

type Category = {
  id: number;
  name: string;
  name_urdu: string | null;
  slug: string;
  description: string | null;
  description_urdu: string | null;
  image: string | null;
  is_active: boolean;
  product_count: number;
};

async function getCategories(): Promise<Category[]> {
  const result = await pool.query(`
    SELECT
      c.id,
      c.name,
      c.name_urdu,
      c.slug,
      c.description,
      c.description_urdu,
      c.image,
      c.is_active,
      COUNT(p.id)::int AS product_count
    FROM categories c
    LEFT JOIN products p
      ON p.category_id = c.id
    GROUP BY
      c.id,
      c.name,
      c.name_urdu,
      c.slug,
      c.description,
      c.description_urdu,
      c.image,
      c.is_active
    ORDER BY c.id ASC
  `);

  return result.rows;
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8">

          {/* Back to Dashboard */}
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

          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Categories
              </h1>

              <p className="mt-2 text-gray-600">
                Manage your ISACO product categories.
              </p>
            </div>

            <Link
              href="/admin/categories/new"
              className="inline-flex items-center justify-center rounded-lg bg-green-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
            >
              + Add Category
            </Link>
          </div>
        </div>

        {/* Category Table */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          {categories.length === 0 ? (
            <div className="p-10 text-center">
              <h2 className="text-lg font-semibold text-gray-900">
                No categories found
              </h2>

              <p className="mt-2 text-gray-500">
                Create your first category to get started.
              </p>

              <Link
                href="/admin/categories/new"
                className="mt-5 inline-block rounded-lg bg-green-700 px-5 py-3 text-sm font-semibold text-white hover:bg-green-800"
              >
                Add Category
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">

                {/* Table Header */}
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Image
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Category
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Urdu
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Slug
                    </th>

                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                      Products
                    </th>

                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                      Action
                    </th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-gray-100">
                  {categories.map((category) => (
                    <tr
                      key={category.id}
                      className="transition hover:bg-gray-50"
                    >

                      {/* Image */}
                      <td className="px-6 py-4">
                        {category.image ? (
                          <img
                            src={category.image}
                            alt={category.name}
                            className="h-14 w-14 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
                            No Image
                          </div>
                        )}
                      </td>

                      {/* English Name */}
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">
                          {category.name}
                        </div>

                        {category.description && (
                          <div className="mt-1 max-w-xs truncate text-sm text-gray-500">
                            {category.description}
                          </div>
                        )}
                      </td>

                      {/* Urdu Name */}
                      <td
                        className="px-6 py-4 text-lg text-gray-800"
                        dir="rtl"
                      >
                        {category.name_urdu || "—"}
                      </td>

                      {/* Slug */}
                      <td className="px-6 py-4">
                        <code className="rounded bg-gray-100 px-2 py-1 text-sm text-gray-600">
                          {category.slug}
                        </code>
                      </td>

                      {/* Product Count */}
                      <td className="px-6 py-4 text-center">
                        {category.product_count > 0 ? (
                          <span className="inline-flex min-w-[32px] items-center justify-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                            {category.product_count}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">
                            0
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 text-center">
                        {category.is_active ? (
                          <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                            Inactive
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-4">

                          <Link
                            href={`/admin/categories/${category.id}/edit`}
                            className="font-medium text-green-700 hover:text-green-900"
                          >
                            Edit
                          </Link>

                          <DeleteCategoryButton
                            id={category.id}
                            name={category.name}
                          />

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
    </main>
  );
}