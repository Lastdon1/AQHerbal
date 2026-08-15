import Link from "next/link";
import pool from "@/lib/db";

type Category = {
  id: number;
  name: string;
  name_urdu: string | null;
  slug: string;
};

/* =====================================================
   GET ALL ACTIVE CATEGORIES
===================================================== */

async function getCategories(): Promise<Category[]> {
  const result = await pool.query(
    `
      SELECT
        id,
        name,
        name_urdu,
        slug
      FROM categories
      WHERE is_active = true
      ORDER BY id ASC
    `
  );

  return result.rows;
}

/* =====================================================
   ALL CATEGORIES PAGE
===================================================== */

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <main className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-10 sm:py-12">

        {/* =================================================
            BREADCRUMB
        ================================================== */}

        <nav
          aria-label="Breadcrumb"
          className="mb-8 flex flex-wrap items-center text-sm text-gray-500"
        >
          <Link
            href="/"
            className="transition hover:text-green-700"
          >
            Home
          </Link>

          <span className="mx-2 text-gray-300">
            /
          </span>

          <span className="font-medium text-gray-900">
            Categories
          </span>
        </nav>

        {/* =================================================
            PAGE HEADER
        ================================================== */}

        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-green-800 sm:text-4xl">
            تمام زمرے
          </h1>

          <p className="mt-1 text-xl font-semibold text-gray-900">
            All Categories
          </p>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-gray-600">
            Explore all ISACO wellness categories and discover
            products according to your needs.
          </p>
        </div>

        {/* =================================================
            CATEGORIES
        ================================================== */}

        {categories.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">

            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="
                  group
                  flex
                  min-h-[130px]
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-gray-100
                  bg-white
                  px-4
                  py-6
                  text-center
                  shadow-sm
                  transition
                  duration-300
                  hover:-translate-y-1
                  hover:border-green-100
                  hover:bg-green-50/30
                  hover:shadow-lg
                "
              >

                {/* =================================================
                    CATEGORY NAME
                ================================================== */}

                <div className="flex flex-col items-center">

                  {/* URDU NAME */}

                  {category.name_urdu && (
                    <h2
                      dir="rtl"
                      lang="ur"
                      className="
                        text-xl
                        font-semibold
                        leading-9
                        text-green-800
                        transition
                        duration-300
                        group-hover:text-green-700
                      "
                    >
                      {category.name_urdu}
                    </h2>
                  )}

                  {/* ENGLISH NAME */}

                  <p
                    className="
                      mt-1
                      text-sm
                      font-semibold
                      text-gray-800
                      transition
                      duration-300
                      group-hover:text-green-700
                    "
                  >
                    {category.name}
                  </p>

                </div>

              </Link>
            ))}

          </div>
        ) : (

          /* =================================================
             NO CATEGORIES
          ================================================== */

          <div
            className="
              rounded-2xl
              border
              border-dashed
              border-gray-200
              bg-gray-50
              px-6
              py-16
              text-center
            "
          >
            <h2 className="text-xl font-semibold text-gray-900">
              No Categories Found
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              There are currently no active categories available.
            </p>

            <p
              dir="rtl"
              className="mt-2 text-sm text-gray-400"
            >
              فی الحال کوئی زمرہ دستیاب نہیں ہے۔
            </p>

            <Link
              href="/"
              className="
                mt-6
                inline-flex
                rounded-xl
                bg-green-700
                px-5
                py-3
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-green-800
              "
            >
              Back to Home
            </Link>
          </div>
        )}

      </div>
    </main>
  );
}