// app/admin/products/ProductTable.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useMemo,
  useState,
} from "react";

type Product = {
  id: number;
  name: string;
  name_urdu: string | null;
  slug: string;
  category_name: string | null;
  is_active: boolean;
  is_featured: boolean;
  image_url: string | null;
  image_count: number;
  variant_count: number;
  default_price: number | null;
  default_old_price: number | null;
  default_quantity: number | null;
  default_unit: string | null;
};

type ProductTableProps = {
  products: Product[];
  categories: string[];
  initialFeaturedCount: number;
};

type StatusFilter = "all" | "active" | "inactive";

const MAX_FEATURED_PRODUCTS = 8;

export default function ProductTable({
  products,
  categories,
  initialFeaturedCount,
}: ProductTableProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] =
    useState<StatusFilter>("all");

  const [deletingId, setDeletingId] =
    useState<number | null>(null);

  const [featuredState, setFeaturedState] =
    useState<Record<number, boolean>>(() => {
      const initialState: Record<number, boolean> = {};

      products.forEach((product) => {
        initialState[product.id] =
          product.is_featured;
      });

      return initialState;
    });

  const [featuredCount, setFeaturedCount] =
    useState(initialFeaturedCount);

  const [updatingFeaturedId, setUpdatingFeaturedId] =
    useState<number | null>(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /* ============================================================
     FILTERED PRODUCTS
  ============================================================ */

  const filteredProducts = useMemo(() => {
    const searchText = search
      .trim()
      .toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        searchText === "" ||
        product.name
          .toLowerCase()
          .includes(searchText) ||
        (product.name_urdu ?? "")
          .toLowerCase()
          .includes(searchText) ||
        product.slug
          .toLowerCase()
          .includes(searchText) ||
        (product.category_name ?? "")
          .toLowerCase()
          .includes(searchText);

      const matchesCategory =
        category === "all" ||
        product.category_name === category;

      const matchesStatus =
        status === "all" ||
        (status === "active" &&
          product.is_active) ||
        (status === "inactive" &&
          !product.is_active);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus
      );
    });
  }, [
    products,
    search,
    category,
    status,
  ]);

  /* ============================================================
     CLEAR FILTERS
  ============================================================ */

  const clearFilters = useCallback(() => {
    setSearch("");
    setCategory("all");
    setStatus("all");
  }, []);

  /* ============================================================
     FEATURED PRODUCT TOGGLE
  ============================================================ */

  const handleFeaturedToggle = useCallback(
    async (product: Product) => {
      const currentlyFeatured =
        featuredState[product.id] ?? false;

      const nextValue =
        !currentlyFeatured;

      /*
       * Client-side protection.
       *
       * The API also checks this server-side, so this is
       * only for immediate UI feedback.
       */
      if (
        nextValue &&
        featuredCount >= MAX_FEATURED_PRODUCTS
      ) {
        setError(
          "You can only select 8 Featured Products for the homepage. Please remove one of the existing Featured Products first."
        );

        setMessage("");

        return;
      }

      setUpdatingFeaturedId(product.id);
      setMessage("");
      setError("");

      /*
       * Optimistically update the checkbox.
       */
      setFeaturedState((previous) => ({
        ...previous,
        [product.id]: nextValue,
      }));

      setFeaturedCount((previous) =>
        nextValue
          ? previous + 1
          : Math.max(0, previous - 1)
      );

      try {
        const response = await fetch(
          `/api/admin/products/${product.id}/featured`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              is_featured: nextValue,
            }),
          }
        );

        let data: {
          error?: string;
          message?: string;
          is_featured?: boolean;
          featured_count?: number;
        } = {};

        try {
          data = await response.json();
        } catch {
          data = {};
        }

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Failed to update Featured status."
          );
        }

        /*
         * Use the server's authoritative values.
         */
        const serverValue =
          data.is_featured ??
          nextValue;

        const serverCount =
          typeof data.featured_count ===
          "number"
            ? data.featured_count
            : nextValue
              ? featuredCount + 1
              : Math.max(
                  0,
                  featuredCount - 1
                );

        setFeaturedState((previous) => ({
          ...previous,
          [product.id]: serverValue,
        }));

        setFeaturedCount(serverCount);

        setMessage(
          serverValue
            ? `"${product.name}" is now a Featured Product.`
            : `"${product.name}" was removed from Featured Products.`
        );

        window.setTimeout(() => {
          setMessage("");
        }, 3000);
      } catch (toggleError) {
        console.error(
          "Featured product update error:",
          toggleError
        );

        /*
         * Revert optimistic update.
         */
        setFeaturedState((previous) => ({
          ...previous,
          [product.id]: currentlyFeatured,
        }));

        setFeaturedCount((previous) =>
          currentlyFeatured
            ? previous + (nextValue ? 1 : 0)
            : previous - (nextValue ? 1 : 0)
        );

        /*
         * Safer correction for the count.
         */
        setFeaturedCount(
          currentlyFeatured
            ? Math.max(0, featuredCount)
            : Math.max(
                0,
                featuredCount
              )
        );

        setError(
          toggleError instanceof Error
            ? toggleError.message
            : "Failed to update Featured status."
        );

        setMessage("");
      } finally {
        setUpdatingFeaturedId(null);
      }
    },
    [
      featuredState,
      featuredCount,
    ]
  );

  /* ============================================================
     DELETE PRODUCT
  ============================================================ */

  const handleDelete = useCallback(
    async (product: Product) => {
      const confirmed = window.confirm(
        `Are you sure you want to delete "${product.name}"?\n\n` +
          "This will permanently delete the product, " +
          "its images, variants, and health concern relationships."
      );

      if (!confirmed) {
        return;
      }

      setDeletingId(product.id);
      setMessage("");
      setError("");

      try {
        const response = await fetch(
          `/api/admin/products/${product.id}`,
          {
            method: "DELETE",
          }
        );

        let data: {
          error?: string;
          message?: string;
        } = {};

        try {
          data = await response.json();
        } catch {
          data = {};
        }

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Failed to delete product."
          );
        }

        setMessage(
          data.message ||
            "Product deleted successfully."
        );

        window.setTimeout(() => {
          window.location.reload();
        }, 700);
      } catch (deleteError) {
        console.error(
          "Delete product error:",
          deleteError
        );

        setError(
          deleteError instanceof Error
            ? deleteError.message
            : "Failed to delete product."
        );

        setDeletingId(null);

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    },
    []
  );

  const hasFilters =
    search.trim() !== "" ||
    category !== "all" ||
    status !== "all";

  return (
    <div>
      {/* ========================================================
          SUCCESS / ERROR MESSAGES
      ======================================================== */}

      {error && (
        <div
          role="alert"
          className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700"
        >
          <span aria-hidden="true">
            ✕
          </span>{" "}
          {error}
        </div>
      )}

      {message && (
        <div
          role="status"
          className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-800"
        >
          <span aria-hidden="true">
            ✓
          </span>{" "}
          {message}
        </div>
      )}

      {/* ========================================================
          SEARCH + FILTERS
      ======================================================== */}

      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-3">
          {/* SEARCH */}

          <div>
            <label
              htmlFor="product-search"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Search Products
            </label>

            <div className="relative">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                🔎
              </span>

              <input
                id="product-search"
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search name, Urdu, slug..."
                autoComplete="off"
                className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </div>
          </div>

          {/* CATEGORY */}

          <div>
            <label
              htmlFor="category-filter"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Category
            </label>

            <select
              id="category-filter"
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
            >
              <option value="all">
                All Categories
              </option>

              {categories.map(
                (categoryName) => (
                  <option
                    key={categoryName}
                    value={categoryName}
                  >
                    {categoryName}
                  </option>
                )
              )}
            </select>
          </div>

          {/* STATUS */}

          <div>
            <label
              htmlFor="status-filter"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Status
            </label>

            <select
              id="status-filter"
              value={status}
              onChange={(event) =>
                setStatus(
                  event.target
                    .value as StatusFilter
                )
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
            >
              <option value="all">
                All Statuses
              </option>

              <option value="active">
                Active
              </option>

              <option value="inactive">
                Inactive
              </option>
            </select>
          </div>
        </div>

        {/* FILTER SUMMARY */}

        <div className="mt-4 flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-900">
              {filteredProducts.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900">
              {products.length}
            </span>{" "}
            products
          </p>

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-left text-sm font-medium text-green-700 hover:text-green-800 hover:underline sm:text-right"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* ========================================================
          FEATURED INFORMATION
      ======================================================== */}

      <div className="mb-5 rounded-xl border border-green-100 bg-green-50 px-5 py-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-green-900">
              Homepage Featured Products
            </p>

            <p className="mt-1 text-xs text-green-700">
              Select up to 8 products. The selected
              products will appear in the Featured
              Products section on the homepage.
            </p>
          </div>

          <div className="shrink-0 rounded-full bg-white px-4 py-2 text-sm font-bold text-green-800 shadow-sm">
            {featuredCount} /{" "}
            {MAX_FEATURED_PRODUCTS}
          </div>
        </div>
      </div>

      {/* ========================================================
          PRODUCTS TABLE
      ======================================================== */}

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        {filteredProducts.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-2xl text-gray-400">
              🔎
            </div>

            <h2 className="mt-5 text-lg font-semibold text-gray-900">
              No products found
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Try changing your search or
              filters.
            </p>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 rounded-lg bg-green-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-green-800"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1400px]">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-700"
                  >
                    Product
                  </th>

                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-700"
                  >
                    Category
                  </th>

                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-700"
                  >
                    Price
                  </th>

                  <th
                    scope="col"
                    className="px-6 py-4 text-center text-sm font-semibold text-gray-700"
                  >
                    Images
                  </th>

                  <th
                    scope="col"
                    className="px-6 py-4 text-center text-sm font-semibold text-gray-700"
                  >
                    Variants
                  </th>

                  {/* FEATURED */}

                  <th
                    scope="col"
                    className="px-6 py-4 text-center text-sm font-semibold text-gray-700"
                  >
                    Featured
                  </th>

                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-700"
                  >
                    Status
                  </th>

                  <th
                    scope="col"
                    className="px-6 py-4 text-right text-sm font-semibold text-gray-700"
                  >
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {filteredProducts.map(
                  (product) => {
                    const isFeatured =
                      featuredState[
                        product.id
                      ] ?? false;

                    const isUpdating =
                      updatingFeaturedId ===
                      product.id;

                    return (
                      <tr
                        key={product.id}
                        className={`transition ${
                          isFeatured
                            ? "bg-green-50/40"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        {/* PRODUCT */}

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
                              {product.image_url ? (
                                <Image
                                  src={
                                    product.image_url
                                  }
                                  alt={
                                    product.name
                                  }
                                  width={64}
                                  height={64}
                                  sizes="64px"
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-center text-xs text-gray-400">
                                  No Image
                                </div>
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="font-semibold text-gray-900">
                                {product.name}
                              </p>

                              {product.name_urdu && (
                                <p
                                  dir="rtl"
                                  lang="ur"
                                  className="mt-1 text-sm text-gray-600"
                                >
                                  {
                                    product.name_urdu
                                  }
                                </p>
                              )}

                              <p className="mt-1 truncate text-xs text-gray-400">
                                /{product.slug}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* CATEGORY */}

                        <td className="px-6 py-4 text-sm text-gray-600">
                          {product.category_name ||
                            "Uncategorized"}
                        </td>

                        {/* PRICE */}

                        <td className="px-6 py-4">
                          {product.default_price !==
                          null ? (
                            <div>
                              <p className="font-semibold text-gray-900">
                                Rs{" "}
                                {Number(
                                  product.default_price
                                ).toLocaleString(
                                  "en-PK"
                                )}
                              </p>

                              {product.default_old_price !==
                                null &&
                                Number(
                                  product.default_old_price
                                ) >
                                  Number(
                                    product.default_price
                                  ) && (
                                  <p className="mt-1 text-xs text-gray-400 line-through">
                                    Rs{" "}
                                    {Number(
                                      product.default_old_price
                                    ).toLocaleString(
                                      "en-PK"
                                    )}
                                  </p>
                                )}

                              {product.default_quantity !==
                                null &&
                                product.default_unit && (
                                  <p className="mt-1 text-xs text-gray-500">
                                    {
                                      product.default_quantity
                                    }{" "}
                                    {
                                      product.default_unit
                                    }
                                  </p>
                                )}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">
                              No price
                            </span>
                          )}
                        </td>

                        {/* IMAGES */}

                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex min-w-8 items-center justify-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                            {
                              product.image_count
                            }
                          </span>
                        </td>

                        {/* VARIANTS */}

                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex min-w-8 items-center justify-center rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
                            {
                              product.variant_count
                            }
                          </span>
                        </td>

                        {/* =================================================
                            FEATURED CHECKBOX
                        ================================================= */}

                        <td className="px-6 py-4">
                          <div className="flex flex-col items-center gap-1">
                            <label
                              className={`relative inline-flex items-center ${
                                isUpdating
                                  ? "cursor-wait opacity-60"
                                  : "cursor-pointer"
                              }`}
                              title={
                                isFeatured
                                  ? "Remove from homepage Featured Products"
                                  : featuredCount >=
                                      MAX_FEATURED_PRODUCTS
                                    ? "Maximum 8 Featured Products reached"
                                    : "Show on homepage Featured Products"
                              }
                            >
                              <input
                                type="checkbox"
                                checked={
                                  isFeatured
                                }
                                disabled={
                                  isUpdating
                                }
                                onChange={() =>
                                  handleFeaturedToggle(
                                    product
                                  )
                                }
                                className="peer sr-only"
                              />

                              <span
                                className={`flex h-8 w-8 items-center justify-center rounded-lg border-2 transition ${
                                  isFeatured
                                    ? "border-green-700 bg-green-700 text-white"
                                    : "border-gray-300 bg-white text-transparent hover:border-green-500"
                                }`}
                              >
                                ✓
                              </span>
                            </label>

                            {isFeatured && (
                              <span className="text-[11px] font-semibold text-green-700">
                                Homepage
                              </span>
                            )}
                          </div>
                        </td>

                        {/* STATUS */}

                        <td className="px-6 py-4">
                          <span
                            className={
                              product.is_active
                                ? "rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700"
                                : "rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
                            }
                          >
                            {product.is_active
                              ? "Active"
                              : "Inactive"}
                          </span>
                        </td>

                        {/* ACTIONS */}

                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <Link
                              href={`/admin/products/${product.id}/edit`}
                              className="inline-flex rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-700 transition hover:bg-green-100"
                            >
                              Edit
                            </Link>

                            <button
                              type="button"
                              disabled={
                                deletingId ===
                                product.id
                              }
                              aria-label={`Delete ${product.name}`}
                              onClick={() =>
                                handleDelete(
                                  product
                                )
                              }
                              className="inline-flex rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {deletingId ===
                              product.id
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}