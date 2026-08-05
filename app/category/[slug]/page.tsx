import Link from "next/link";
import { notFound } from "next/navigation";
import { categories } from "@/constants/categories";

type Props = {
  params: {
    slug: string;
  };
};

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  // Find either a main category or a subcategory
  const category = categories.find((c) => c.slug === slug);

  const subCategory = categories
    .flatMap((c) =>
      c.items.map((item) => ({
        ...item,
        parent: c.title,
      }))
    )
    .find((item) => item.slug === slug);

  if (!category && !subCategory) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-8">
        <Link
          href="/categories"
          className="text-sm font-medium text-green-700 hover:underline"
        >
          ← Back to Categories
        </Link>
      </div>

      {category ? (
        <>
          <h1 className="mb-3 text-4xl font-bold text-green-800">
            {category.title}
          </h1>

          <p className="mb-10 text-gray-600">
            Browse all products available in the{" "}
            <strong>{category.title}</strong> category.
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {category.items.map((item) => (
              <div
                key={item.slug}
                className="rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-lg"
              >
                <h3 className="mb-3 font-semibold text-gray-900">
                  {item.name}
                </h3>

                <Link
                  href={`/category/${item.slug}`}
                  className="text-sm font-medium text-green-700 hover:underline"
                >
                  Explore →
                </Link>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <h1 className="mb-3 text-4xl font-bold text-green-800">
            {subCategory?.name}
          </h1>

          <p className="mb-2 text-gray-600">
            Parent Category:
          </p>

          <p className="mb-8 font-semibold text-green-700">
            {subCategory?.parent}
          </p>

          <div className="rounded-xl border bg-white p-8 shadow-sm">
            <p className="text-gray-600">
              Product listing for <strong>{subCategory?.name}</strong> will be
              added in the next module.
            </p>
          </div>
        </>
      )}
    </main>
  );
}