import DeleteCategoryButton from "./DeleteCategoryButton";
import Link from "next/link";
import Image from "next/image";
import pool from "@/lib/db";

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

async function getCategories(): Promise<Category[]> {
  const result = await pool.query(`
    SELECT
      id,
      name,
      name_urdu,
      slug,
      description,
      description_urdu,
      image,
      is_active
    FROM categories
    ORDER BY id DESC
  `);

  return result.rows;
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/admin"
              className="text-sm font-medium text-green-700 hover:underline"
            >
              ← Back to Dashboard
            </Link>

            <h1 className="mt-3 text-3xl font-bold text-gray-900">
              Categories
            </h1>

            <p className="mt-2 text-gray-600">
              Manage your ISACO product categories.
            </p>
          </div>

          <Link
            href="/admin/products/categories/new"
            className="inline-flex w-fit items-center rounded-lg bg-green-700 px-5 py-3 font-medium text-white transition hover:bg-green-800"
          >
            + Add Category
          </Link>
        </div>

        {/* Count */}
        <div className="mb-5">
          <p className="text-sm text-gray-500">
            Total Categories:{" "}
            <span className="font-semibold text-gray-900">
              {categories.length}
            </span>
          </p>
        </div>

        {/* Categories */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">

          {categories.length === 0 ? (
            <div className="px-6 py-16 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-2xl text-green-700">
                +
              </div>

              <h2 className="mt-5 text-lg font-semibold text-gray-900">
                No categories found
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                You do not have any categories in the database yet.
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

              <table className="w-full min-w-[1200px]">

                <thead className="border-b bg-gray-50">
                  <tr>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Category
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Slug
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Description
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                      Action
                    </th>

                  </tr>
                </thead>

                <tbody className="divide-y">

                  {categories.map((category) => (
                    <tr
                      key={category.id}
                      className="transition hover:bg-gray-50"
                    >

                      {/* Category */}
                      <td className="px-6 py-4">

                        <div className="flex items-center gap-4">

                          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-100">

                            {category.image ? (
                              <Image
                                src={category.image}
                                alt={category.name}
                                width={64}
                                height={64}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                                No Image
                              </div>
                            )}

                          </div>

                          <div>
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
                          </div>

                        </div>

                      </td>

                      {/* Slug */}
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          /{category.slug}
                        </span>
                      </td>

                      {/* Description */}
                      <td className="max-w-sm px-6 py-4">

                        <p className="line-clamp-2 text-sm text-gray-600">
                          {category.description || "No description"}
                        </p>

                        {category.description_urdu && (
                          <p
                            dir="rtl"
                            className="mt-1 line-clamp-1 text-xs text-gray-400"
                          >
                            {category.description_urdu}
                          </p>
                        )}

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
                          {category.is_active ? "Active" : "Inactive"}
                        </span>

                      </td>

                      {/* Action */}
                      <td className="px-6 py-4 text-right">
  <div className="flex justify-end gap-2">
    <Link
      href={`/admin/products/categories/${category.id}/edit`}
      className="inline-flex rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-700 transition hover:bg-green-100"
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

        {/* Bottom Navigation */}
        <div className="mt-6">
          <Link
            href="/admin"
            className="text-sm font-medium text-green-700 hover:underline"
          >
            ← Back to Dashboard
          </Link>
        </div>

      </div>
    </main>
  );
}