"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Star } from "lucide-react";

type ProductCardProps = {
  product: {
    id: number;
    name: string;
    nameUrdu: string;
    slug: string;

    category: string;
    healthConcerns?: string[];

    variantId?: number | null;
    quantityValue?: number | null;
    unit?: string | null;

    price: number;
    oldPrice?: number | null;

    rating?: number;

    images: string[];
  };
};

/*
 * ============================================================
 * PRODUCT CARD
 * ============================================================
 *
 * Performance notes:
 *
 * - No useEffect
 * - No useState
 * - No browser API requests
 * - No IntersectionObserver
 * - No review API request per product
 *
 * Product data is supplied by the server.
 *
 * This keeps the homepage lightweight, especially when
 * multiple product sections render several cards.
 * ============================================================
 */

export default function ProductCard({
  product,
}: ProductCardProps) {
  /* ============================================================
     PRODUCT IMAGE
  ============================================================ */

  const productImage =
    product.images?.[0] ?? "";

  /* ============================================================
     PRODUCT URL
  ============================================================ */

  const productUrl =
    `/product/${product.slug}`;

  /* ============================================================
     PRICE
  ============================================================ */

  const hasOldPrice =
    product.oldPrice !== null &&
    product.oldPrice !== undefined;

  const hasDiscount =
    hasOldPrice &&
    product.oldPrice! > product.price;

  const discountPercentage =
    hasDiscount
      ? Math.round(
          ((product.oldPrice! -
            product.price) /
            product.oldPrice!) *
            100
        )
      : 0;

  /* ============================================================
     RATING
  ============================================================ */

  const rating =
    typeof product.rating === "number" &&
    product.rating > 0
      ? Math.min(
          5,
          Math.max(0, product.rating)
        )
      : 0;

  const displayRating =
    Math.round(rating * 2) / 2;

  /* ============================================================
     RENDER STARS
  ============================================================ */

  const renderStars = () => {
    if (rating <= 0) {
      return null;
    }

    return (
      <div
        className="flex items-center gap-0.5"
        aria-label={`${displayRating} out of 5 stars`}
      >
        {Array.from(
          { length: 5 },
          (_, index) => {
            const starNumber =
              index + 1;

            const full =
              displayRating >=
              starNumber;

            const half =
              !full &&
              displayRating >=
                starNumber - 0.5;

            return (
              <span
                key={`${product.id}-star-${index}`}
                className="relative h-[15px] w-[15px]"
                aria-hidden="true"
              >
                {/* EMPTY STAR */}

                <Star
                  size={15}
                  className="absolute inset-0 text-gray-300"
                />

                {/* FULL STAR */}

                {full && (
                  <Star
                    size={15}
                    className="absolute inset-0 fill-yellow-400 text-yellow-400"
                  />
                )}

                {/* HALF STAR */}

                {half && (
                  <span className="absolute inset-0 w-1/2 overflow-hidden">
                    <Star
                      size={15}
                      className="fill-yellow-400 text-yellow-400"
                    />
                  </span>
                )}
              </span>
            );
          }
        )}
      </div>
    );
  };

  /* ============================================================
     RETURN
  ============================================================ */

  return (
    <article
      className="
        group
        overflow-hidden
        rounded-2xl
        border
        border-gray-100
        bg-white
        shadow-sm
        transition
        duration-300
        hover:-translate-y-1
        hover:shadow-md
      "
    >
      {/* ========================================================
          PRODUCT IMAGE
      ======================================================== */}

      <Link
        href={productUrl}
        className="block"
        aria-label={`View ${product.name}`}
      >
        <div className="relative aspect-square overflow-hidden bg-white">
          {productImage ? (
            <Image
              src={productImage}
              alt={product.name}
              fill
              sizes="
                (max-width: 640px) 78vw,
                (max-width: 1024px) 50vw,
                25vw
              "
              className="
                object-contain
                p-5
                transition-transform
                duration-500
                group-hover:scale-105
              "
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
              No Image Available
            </div>
          )}

          {/* ======================================================
              DISCOUNT BADGE
          ======================================================= */}

          {hasDiscount && (
            <span className="absolute left-4 top-4 rounded-full bg-green-700 px-3 py-1 text-xs font-bold text-white">
              {discountPercentage}% OFF
            </span>
          )}
        </div>
      </Link>

      {/* ========================================================
          PRODUCT INFORMATION
      ======================================================== */}

      <div className="p-5">
        {/* ======================================================
            CATEGORY
        ======================================================= */}

        <p className="text-xs font-medium uppercase tracking-wide text-green-700">
          {product.category}
        </p>

        {/* ======================================================
            URDU NAME
        ======================================================= */}

        <Link
          href={productUrl}
          className="block"
        >
          <h3
            dir="rtl"
            className="
              mt-2
              text-lg
              font-bold
              leading-8
              text-green-800
            "
          >
            {product.nameUrdu}
          </h3>
        </Link>

        {/* ======================================================
            ENGLISH NAME
        ======================================================= */}

        <Link
          href={productUrl}
          className="block"
        >
          <h4 className="mt-1 line-clamp-1 text-base font-semibold text-gray-900">
            {product.name}
          </h4>
        </Link>

        {/* ======================================================
            PRODUCT RATING
        ======================================================= */}

        <div className="mt-3 flex min-h-[20px] items-center">
          {rating > 0 ? (
            <div className="flex items-center gap-1.5">
              {renderStars()}

              <span className="ml-0.5 text-xs font-medium text-gray-600">
                {displayRating.toFixed(1)}
              </span>
            </div>
          ) : (
            <span className="text-xs text-gray-400">
              No reviews yet
            </span>
          )}
        </div>

        {/* ======================================================
            PRICE + CART / VIEW PRODUCT
        ======================================================= */}

        <div className="mt-4 flex items-center justify-between gap-3">
          {/* ====================================================
              PRICE
          ===================================================== */}

          <div className="flex min-w-0 flex-col">
            <span className="text-xl font-bold text-green-700">
              Rs.{" "}
              {Number(
                product.price
              ).toLocaleString("en-PK")}
            </span>

            {/* ==================================================
                DEFAULT VARIANT SIZE
            =================================================== */}

            {product.quantityValue !==
              null &&
              product.quantityValue !==
                undefined &&
              product.unit && (
                <span className="text-xs text-gray-500">
                  {product.quantityValue}{" "}
                  {product.unit}
                </span>
              )}

            {/* ==================================================
                OLD PRICE
            =================================================== */}

            {hasOldPrice && (
              <span className="text-sm text-gray-400 line-through">
                Rs.{" "}
                {Number(
                  product.oldPrice
                ).toLocaleString("en-PK")}
              </span>
            )}
          </div>

          {/* ====================================================
              PRODUCT / CART BUTTON

              Product cards can contain multiple variants.

              Therefore the customer goes to the product page
              where the correct variant can be selected.
          ===================================================== */}

          <Link
            href={productUrl}
            aria-label={`Choose size and add ${product.name} to cart`}
            title="Choose size"
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-green-700
              text-white
              transition-all
              hover:bg-green-800
              active:scale-95
            "
          >
            <ShoppingCart
              size={18}
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </article>
  );
}