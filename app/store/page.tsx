import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import pool from "@/lib/db";

const PRODUCTS_PER_PAGE = 12;

type StorePageProps = {
  searchParams: Promise<{
    page?: string;
  }>;
};

type PageItem = number | "ellipsis";

function getPaginationItems(
  currentPage: number,
  totalPages: number
): PageItem[] {
  /*
   * ==========================================================
   * FEW PAGES
   * ==========================================================
   *
   * If there are only a few pages, show all of them.
   */

  if (totalPages <= 7) {
    return Array.from(
      { length: totalPages },
      (_, index) => index + 1
    );
  }

  /*
   * ==========================================================
   * PAGINATION WITH ELLIPSIS
   * ==========================================================
   *
   * Examples:
   *
   * 1 2 3 4 ... 10
   * 1 ... 4 5 6 ... 10
   * 1 ... 7 8 9 10
   */

  if (currentPage <= 4) {
    return [
      1,
      2,
      3,
      4,
      5,
      "ellipsis",
      totalPages,
    ];
  }

  if (currentPage >= totalPages - 3) {
    return [
      1,
      "ellipsis",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "ellipsis",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis",
    totalPages,
  ];
}

export default async function StorePage({
  searchParams,
}: StorePageProps) {
  /* ==========================================================
     GET CURRENT PAGE
  ========================================================== */

  const params = await searchParams;

  const requestedPage = Number(
    params.page ?? "1"
  );

  const currentPage =
    Number.isInteger(requestedPage) &&
    requestedPage > 0
      ? requestedPage
      : 1;

  /* ==========================================================
     GET TOTAL PRODUCT COUNT
  ========================================================== */

  const countResult = await pool.query(`
    SELECT COUNT(*)::int AS total
    FROM products
    WHERE is_active = true
  `);

  const totalProducts =
    countResult.rows[0]?.total ?? 0;

  const totalPages = Math.max(
    1,
    Math.ceil(
      totalProducts /
        PRODUCTS_PER_PAGE
    )
  );

  /*
   * If someone manually enters a page
   * higher than the last page, use the
   * last available page.
   */

  const safePage = Math.min(
    currentPage,
    totalPages
  );

  const offset =
    (safePage - 1) *
    PRODUCTS_PER_PAGE;

  /* ==========================================================
     LOAD PRODUCTS
  ========================================================== */

  const productsResult =
    await pool.query(
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

      LEFT JOIN categories c
        ON c.id = p.category_id

      WHERE p.is_active = true

      ORDER BY p.id DESC

      LIMIT $1
      OFFSET $2
      `,
      [
        PRODUCTS_PER_PAGE,
        offset,
      ]
    );

  /* ==========================================================
     PRODUCT IDS
  ========================================================== */

  const productIds =
    productsResult.rows.map(
      (product) =>
        Number(product.id)
    );

  /* ==========================================================
     LOAD IMAGES
  ========================================================== */

  let imagesResult = {
    rows: [] as Array<{
      product_id: number;
      image_url: string;
      sort_order: number;
      is_primary: boolean;
    }>,
  };

  if (productIds.length > 0) {
    imagesResult =
      await pool.query(
        `
        SELECT
          product_id,
          image_url,
          sort_order,
          is_primary

        FROM product_images

        WHERE product_id =
          ANY($1::int[])

        ORDER BY
          is_primary DESC,
          sort_order ASC
        `,
        [productIds]
      );
  }

  /* ==========================================================
     LOAD VARIANTS
  ========================================================== */

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
    variantsResult =
      await pool.query(
        `
        SELECT
          product_id,
          quantity_value,
          unit,
          price,
          old_price,
          is_default

        FROM product_variants

        WHERE product_id =
          ANY($1::int[])

          AND is_active = true

        ORDER BY
          is_default DESC,
          id ASC
        `,
        [productIds]
      );
  }

  /* ==========================================================
     BUILD PRODUCT DATA
  ========================================================== */

  const products =
    productsResult.rows.map(
      (product) => {
        const productId =
          Number(product.id);

        const productImages =
          imagesResult.rows
            .filter(
              (image) =>
                Number(
                  image.product_id
                ) === productId
            )
            .sort(
              (a, b) =>
                Number(
                  a.sort_order
                ) -
                Number(
                  b.sort_order
                )
            )
            .map(
              (image) =>
                image.image_url
            );

        const productVariants =
          variantsResult.rows.filter(
            (variant) =>
              Number(
                variant.product_id
              ) === productId
          );

        const defaultVariant =
          productVariants.find(
            (variant) =>
              variant.is_default
          ) ??
          productVariants[0];

        return {
          id: productId,

          name: product.name,

          nameUrdu:
            product.name_urdu ??
            "",

          slug: product.slug,

          category:
            product.category ??
            "",

          healthConcerns: [],

          price: defaultVariant
            ? Number(
                defaultVariant.price
              )
            : 0,

          oldPrice:
            defaultVariant?.old_price !==
              null &&
            defaultVariant?.old_price !==
              undefined
              ? Number(
                  defaultVariant.old_price
                )
              : null,

          rating: 5,

          images:
            productImages,

          description:
            product.description ??
            "",

          descriptionUrdu:
            product.description_urdu ??
            "",

          benefits: [],

          ingredients: [],

          usage: "",

          variants:
            productVariants.map(
              (variant) => ({
                quantity:
                  Number(
                    variant.quantity_value
                  ),

                unit:
                  variant.unit,

                price:
                  Number(
                    variant.price
                  ),

                oldPrice:
                  variant.old_price !==
                    null &&
                  variant.old_price !==
                    undefined
                    ? Number(
                        variant.old_price
                      )
                    : null,
              })
            ),
        };
      }
    );

  /* ==========================================================
     PAGINATION ITEMS
  ========================================================== */

  const paginationItems =
    getPaginationItems(
      safePage,
      totalPages
    );

  /*
   * Helper for generating page URLs.
   */

  const getPageUrl = (
    page: number
  ) =>
    page === 1
      ? "/store"
      : `/store?page=${page}`;

  /* ==========================================================
     RETURN PAGE
  ========================================================== */

  return (
    <main>
      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <section className="bg-green-700 py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Store
          </h1>

          <p className="mt-2 text-sm text-green-50 sm:text-base">
            Explore our complete
            collection of natural
            wellness products.
          </p>
        </div>
      </section>

      {/* =====================================================
          PRODUCTS
      ====================================================== */}

      <section className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-6">
          {products.length > 0 ? (
            <>
              {/* =================================================
                  PRODUCT COUNT
              ================================================== */}

              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Showing{" "}
                  <span className="font-semibold text-gray-800">
                    {offset + 1}
                  </span>{" "}
                  –
                  <span className="font-semibold text-gray-800">
                    {" "}
                    {Math.min(
                      offset +
                        products.length,
                      totalProducts
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-gray-800">
                    {totalProducts}
                  </span>{" "}
                  products
                </p>
              </div>

              {/* =================================================
                  PRODUCT GRID
              ================================================== */}

              <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
                {products.map(
                  (product) => (
                    <ProductCard
                      key={
                        product.id
                      }
                      product={
                        product
                      }
                    />
                  )
                )}
              </div>

              {/* =================================================
                  PAGINATION
              ================================================== */}

              {totalPages > 1 && (
                <nav
                  aria-label="Store pagination"
                  className="mt-14"
                >
                  <div className="flex items-center justify-center gap-2">
                    {/* =================================================
                        PREVIOUS
                    ================================================== */}

                    {safePage > 1 ? (
                      <Link
                        href={getPageUrl(
                          safePage -
                            1
                        )}
                        aria-label="Previous page"
                        className="
                          inline-flex
                          h-10
                          items-center
                          justify-center
                          rounded-full
                          border
                          border-gray-300
                          px-4
                          text-sm
                          font-medium
                          text-gray-700
                          transition
                          hover:border-green-700
                          hover:bg-green-50
                          hover:text-green-700
                          sm:h-11
                        "
                      >
                        <span className="sm:hidden">
                          ←
                        </span>

                        <span className="hidden sm:inline">
                          ← Previous
                        </span>
                      </Link>
                    ) : (
                      <span
                        aria-disabled="true"
                        className="
                          inline-flex
                          h-10
                          cursor-not-allowed
                          items-center
                          justify-center
                          rounded-full
                          border
                          border-gray-200
                          px-4
                          text-sm
                          font-medium
                          text-gray-300
                          sm:h-11
                        "
                      >
                        <span className="sm:hidden">
                          ←
                        </span>

                        <span className="hidden sm:inline">
                          ← Previous
                        </span>
                      </span>
                    )}

                    {/* =================================================
                        PAGE NUMBERS
                    ================================================== */}

                    <div className="flex items-center gap-1">
                      {paginationItems.map(
                        (
                          item,
                          index
                        ) => {
                          if (
                            item ===
                            "ellipsis"
                          ) {
                            return (
                              <span
                                key={`ellipsis-${index}`}
                                className="
                                  flex
                                  h-10
                                  w-8
                                  items-center
                                  justify-center
                                  text-sm
                                  font-medium
                                  text-gray-400
                                  sm:h-11
                                "
                              >
                                …
                              </span>
                            );
                          }

                          const isActive =
                            item ===
                            safePage;

                          return (
                            <Link
                              key={
                                item
                              }
                              href={getPageUrl(
                                item
                              )}
                              aria-current={
                                isActive
                                  ? "page"
                                  : undefined
                              }
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
                                sm:h-11
                                sm:w-11
                                ${
                                  isActive
                                    ? "bg-green-700 text-white shadow-sm"
                                    : "border border-gray-300 text-gray-700 hover:border-green-700 hover:bg-green-50 hover:text-green-700"
                                }
                              `}
                            >
                              {
                                item
                              }
                            </Link>
                          );
                        }
                      )}
                    </div>

                    {/* =================================================
                        NEXT
                    ================================================== */}

                    {safePage <
                    totalPages ? (
                      <Link
                        href={getPageUrl(
                          safePage +
                            1
                        )}
                        aria-label="Next page"
                        className="
                          inline-flex
                          h-10
                          items-center
                          justify-center
                          rounded-full
                          border
                          border-gray-300
                          px-4
                          text-sm
                          font-medium
                          text-gray-700
                          transition
                          hover:border-green-700
                          hover:bg-green-50
                          hover:text-green-700
                          sm:h-11
                        "
                      >
                        <span className="sm:hidden">
                          →
                        </span>

                        <span className="hidden sm:inline">
                          Next →
                        </span>
                      </Link>
                    ) : (
                      <span
                        aria-disabled="true"
                        className="
                          inline-flex
                          h-10
                          cursor-not-allowed
                          items-center
                          justify-center
                          rounded-full
                          border
                          border-gray-200
                          px-4
                          text-sm
                          font-medium
                          text-gray-300
                          sm:h-11
                        "
                      >
                        <span className="sm:hidden">
                          →
                        </span>

                        <span className="hidden sm:inline">
                          Next →
                        </span>
                      </span>
                    )}
                  </div>

                  {/* =================================================
                      MOBILE PAGE INDICATOR
                  ================================================== */}

                  <p className="mt-4 text-center text-xs text-gray-400 sm:hidden">
                    Page{" "}
                    <span className="font-semibold text-gray-600">
                      {safePage}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-gray-600">
                      {totalPages}
                    </span>
                  </p>
                </nav>
              )}
            </>
          ) : (
            /* =================================================
               EMPTY STATE
            ================================================== */

            <div className="py-20 text-center">
              <p className="text-gray-500">
                No products available at
                the moment.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}