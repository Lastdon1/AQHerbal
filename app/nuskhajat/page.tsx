import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import pool from "@/lib/db";

const PRODUCTS_PER_PAGE = 12;

type Props = {
  searchParams: Promise<{
    page?: string;
  }>;
};

export default async function NuskhajatPage({
  searchParams,
}: Props) {
  const params = await searchParams;

  const requestedPage = Number(params.page ?? "1");

  const currentPage =
    Number.isInteger(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1;

  /* =========================================================
     TOTAL NUSKHAJAT PRODUCTS
  ========================================================= */

  const countResult = await pool.query(`
    SELECT COUNT(*)::int AS total
    FROM products p
    INNER JOIN categories c
      ON c.id = p.category_id
    WHERE p.is_active = true
      AND c.slug = 'nuskhajat'
  `);

  const totalProducts = countResult.rows[0]?.total ?? 0;

  const totalPages = Math.max(
    1,
    Math.ceil(totalProducts / PRODUCTS_PER_PAGE)
  );

  const safePage = Math.min(
    currentPage,
    totalPages
  );

  const offset =
    (safePage - 1) * PRODUCTS_PER_PAGE;

  /* =========================================================
     LOAD NUSKHAJAT PRODUCTS
  ========================================================= */

  const productsResult = await pool.query(
    `
      SELECT
        p.id,
        p.name,
        p.name_urdu,
        p.slug,
        p.description,
        p.description_urdu,

        c.name AS category,
        c.name_urdu AS category_urdu

      FROM products p

      INNER JOIN categories c
        ON c.id = p.category_id

      WHERE p.is_active = true
        AND c.slug = 'nuskhajat'

      ORDER BY p.id DESC

      LIMIT $1
      OFFSET $2
    `,
    [PRODUCTS_PER_PAGE, offset]
  );

  /* =========================================================
     PRODUCT IDS
  ========================================================= */

  const productIds = productsResult.rows.map(
    (product) => Number(product.id)
  );

  /* =========================================================
     LOAD PRODUCT IMAGES
  ========================================================= */

  let imagesResult = {
    rows: [] as Array<{
      product_id: number;
      image_url: string;
      sort_order: number;
      is_primary: boolean;
    }>,
  };

  if (productIds.length > 0) {
    imagesResult = await pool.query(
      `
        SELECT
          product_id,
          image_url,
          sort_order,
          is_primary

        FROM product_images

        WHERE product_id = ANY($1::int[])

        ORDER BY
          is_primary DESC,
          sort_order ASC
      `,
      [productIds]
    );
  }

  /* =========================================================
     LOAD PRODUCT VARIANTS
  ========================================================= */

  let variantsResult = {
    rows: [] as Array<{
      product_id: number;
      quantity_value: number;
      unit: string;
      price: number;
      old_price: number | null;
      is_default: boolean;
    }>,
  };

  if (productIds.length > 0) {
    variantsResult = await pool.query(
      `
        SELECT
          product_id,
          quantity_value,
          unit,
          price,
          old_price,
          is_default

        FROM product_variants

        WHERE product_id = ANY($1::int[])
          AND is_active = true

        ORDER BY
          is_default DESC,
          id ASC
      `,
      [productIds]
    );
  }

  /* =========================================================
     BUILD PRODUCT DATA
  ========================================================= */

  const products = productsResult.rows.map(
    (product) => {
      const productId = Number(product.id);

      const productImages = imagesResult.rows
        .filter(
          (image) =>
            Number(image.product_id) === productId
        )
        .sort(
          (a, b) =>
            Number(a.sort_order) -
            Number(b.sort_order)
        )
        .map((image) => image.image_url);

      const productVariants =
        variantsResult.rows.filter(
          (variant) =>
            Number(variant.product_id) === productId
        );

      const defaultVariant =
        productVariants.find(
          (variant) => variant.is_default
        ) ?? productVariants[0];

      return {
        id: productId,

        name: product.name,

        nameUrdu:
          product.name_urdu ?? "",

        slug: product.slug,

        category:
          product.category ?? "",

        healthConcerns: [],

        price: defaultVariant
          ? Number(defaultVariant.price)
          : 0,

        oldPrice:
          defaultVariant?.old_price !== null &&
          defaultVariant?.old_price !== undefined
            ? Number(defaultVariant.old_price)
            : null,

        rating: 5,

        images: productImages,

        description:
          product.description ?? "",

        descriptionUrdu:
          product.description_urdu ?? "",

        benefits: [],

        ingredients: [],

        usage: "",

        variants: productVariants.map(
          (variant) => ({
            quantity: Number(
              variant.quantity_value
            ),

            unit: variant.unit,

            price: Number(
              variant.price
            ),

            oldPrice:
              variant.old_price !== null &&
              variant.old_price !== undefined
                ? Number(variant.old_price)
                : null,
          })
        ),
      };
    }
  );

  /* =========================================================
     PAGE NUMBERS
  ========================================================= */

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  return (
    <main className="bg-white">

      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <section className="bg-white py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-6 text-center">

          {/* URDU TITLE */}

          <p
            dir="rtl"
            lang="ur"
            className="
              text-lg
              font-semibold
              text-green-800
              sm:text-xl
            "
          >
            نسخہ جات
          </p>

          {/* ENGLISH TITLE */}

          <h1
            className="
              mt-1
              text-3xl
              font-bold
              tracking-tight
              text-green-900
              sm:text-4xl
            "
          >
            Nuskhajat
          </h1>

          {/* ENGLISH DESCRIPTION */}

          <p
            className="
              mx-auto
              mt-3
              max-w-2xl
              text-sm
              leading-6
              text-gray-600
              sm:text-base
            "
          >
            Traditional herbal formulations prepared
            according to the principles of Eastern medicine.
          </p>

          {/* URDU DESCRIPTION */}

          <p
            dir="rtl"
            lang="ur"
            className="
              mx-auto
              mt-1
              max-w-2xl
              text-sm
              leading-7
              text-gray-500
            "
          >
            روایتی اصولِ طب کے مطابق تیار کردہ
            نسخہ جات کا انتخاب۔
          </p>

        </div>
      </section>

      {/* =====================================================
          PRODUCTS
      ====================================================== */}

      <section className="bg-white py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-6">

          {products.length > 0 ? (
            <>

              {/* =================================================
                  PRODUCT GRID
              ================================================== */}

              <div
                className="
                  grid
                  grid-cols-2
                  gap-4
                  sm:gap-6
                  lg:grid-cols-4
                "
              >
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>

              {/* =================================================
                  PAGINATION
              ================================================== */}

              {totalPages > 1 && (
                <div
                  className="
                    mt-12
                    flex
                    flex-wrap
                    items-center
                    justify-center
                    gap-2
                  "
                >

                  {/* PREVIOUS */}

                  {safePage > 1 ? (
                    <Link
                      href={`/nuskhajat?page=${safePage - 1}`}
                      className="
                        rounded-full
                        border
                        border-gray-300
                        px-4
                        py-2
                        text-sm
                        font-medium
                        text-gray-700
                        transition
                        hover:border-green-700
                        hover:text-green-700
                      "
                    >
                      Previous
                    </Link>
                  ) : (
                    <span
                      className="
                        rounded-full
                        border
                        border-gray-200
                        px-4
                        py-2
                        text-sm
                        font-medium
                        text-gray-300
                      "
                    >
                      Previous
                    </span>
                  )}

                  {/* PAGE NUMBERS */}

                  {pageNumbers.map((page) => (
                    <Link
                      key={page}
                      href={`/nuskhajat?page=${page}`}
                      className={`
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-full
                        text-sm
                        font-semibold
                        transition
                        ${
                          page === safePage
                            ? "bg-green-700 text-white"
                            : "border border-gray-300 text-gray-700 hover:border-green-700 hover:text-green-700"
                        }
                      `}
                    >
                      {page}
                    </Link>
                  ))}

                  {/* NEXT */}

                  {safePage < totalPages ? (
                    <Link
                      href={`/nuskhajat?page=${safePage + 1}`}
                      className="
                        rounded-full
                        border
                        border-gray-300
                        px-4
                        py-2
                        text-sm
                        font-medium
                        text-gray-700
                        transition
                        hover:border-green-700
                        hover:text-green-700
                      "
                    >
                      Next
                    </Link>
                  ) : (
                    <span
                      className="
                        rounded-full
                        border
                        border-gray-200
                        px-4
                        py-2
                        text-sm
                        font-medium
                        text-gray-300
                      "
                    >
                      Next
                    </span>
                  )}

                </div>
              )}

            </>
          ) : (

            /* =================================================
               EMPTY STATE
            ================================================== */

            <div className="py-20 text-center">

              <p
                className="
                  text-lg
                  font-medium
                  text-gray-700
                "
              >
                No Nuskhajat products available.
              </p>

              <p
                dir="rtl"
                lang="ur"
                className="
                  mt-2
                  text-sm
                  text-gray-500
                "
              >
                ابھی نسخہ جات دستیاب نہیں ہیں۔
              </p>

              <Link
                href="/store"
                className="
                  mt-6
                  inline-flex
                  rounded-full
                  bg-green-700
                  px-6
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-green-800
                "
              >
                Browse Store
              </Link>

            </div>
          )}

        </div>
      </section>

    </main>
  );
}