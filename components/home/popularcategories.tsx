import Image from "next/image";
import Link from "next/link";
import { popularCategories } from "@/constants/popularcategories";

export default function PopularCategories() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4">

        {/* Heading */}
        <div className="mb-12 flex items-center justify-between">
          <div>
            <p className="mb-2 font-nastaliq text-lg text-green-700">
              مقبول زمرے
            </p>

            <h2 className="text-3xl font-bold text-gray-900">
              Popular Categories
            </h2>
          </div>

          <Link
            href="/categories"
            className="rounded-full border border-green-600 px-5 py-2 text-sm font-semibold text-green-700 transition-all hover:bg-green-600 hover:text-white"
          >
            View All
          </Link>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
          {popularCategories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="group flex flex-col items-center"
            >
              <div
                className="flex h-40 w-40 items-center justify-center rounded-full border-2 bg-white shadow-md transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl"
                style={{
                  borderColor: category.color,
                }}
              >
                <Image
                  src={category.image}
                  alt={category.title}
                  width={100}
                  height={100}
                  className="object-contain transition-transform duration-300 group-hover:scale-110"
                />
              </div>

              <h3 className="mt-5 font-nastaliq text-xl text-gray-900">
                {category.urdu}
              </h3>

              <p className="mt-1 text-center text-sm font-medium text-gray-600">
                {category.title}
              </p>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}