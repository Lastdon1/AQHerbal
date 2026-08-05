import Link from "next/link";
import { categories } from "@/constants/categories";

export default function CategoriesPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      {/* Heading */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900">
          Shop by Category
        </h1>

        <p className="mt-3 text-gray-600">
          Discover our premium collection of herbal medicines, natural foods,
          wellness products and personal care essentials.
        </p>
      </div>

      {/* Category Cards */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <div
            key={category.slug}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <h2 className="mb-4 text-xl font-semibold text-green-800">
              {category.title}
            </h2>

            <ul className="mb-6 space-y-2">
              {category.items.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/category/${item.slug}`}
                    className="text-gray-600 transition hover:text-green-700"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            <Link
              href={`/category/${category.slug}`}
              className="inline-flex rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-800"
            >
              View All
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}