"use client";

import Image from "next/image";
import {
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  Star,
} from "lucide-react";
import { useState } from "react";

type ProductVariant = {
  id: number;
  quantity_value: number;
  unit: string;
  price: number;
  old_price?: number | null;
  is_default?: boolean;
  is_active?: boolean;
};

type ProductDetailsProps = {
  product: {
    id: number;
    name: string;
    nameUrdu: string;
    slug: string;

    category: string;
    healthConcerns?: string[];

    price: number;
    rating?: number;
    reviewCount?: number;

    images: string[];

    description: string;
    descriptionUrdu?: string;

    benefits?: string[];
    ingredients?: string[];
    usage?: string;

    variants?: ProductVariant[];
  };
};

export default function ProductDetails({
  product,
}: ProductDetailsProps) {
  /* =========================================================
     STATE
  ========================================================= */

  const defaultVariantIndex =
    product.variants?.findIndex(
      (variant) => variant.is_default
    ) ?? -1;

  const [selectedImage, setSelectedImage] =
    useState(0);

  const [selectedVariantIndex, setSelectedVariantIndex] =
    useState(
      defaultVariantIndex >= 0
        ? defaultVariantIndex
        : 0
    );

  const [quantity, setQuantity] =
    useState(1);

  const [activeTab, setActiveTab] =
    useState("tafseel");

  /* =========================================================
     PRODUCT DATA
  ========================================================= */

  const rating = product.rating ?? 5;

  const selectedVariant =
    product.variants?.[
      selectedVariantIndex
    ];

  const currentPrice =
    selectedVariant?.price ??
    product.price;

  const oldPrice =
    selectedVariant?.old_price ??
    null;

  const hasOldPrice =
    oldPrice !== null &&
    oldPrice !== undefined;

  const hasDiscount =
    hasOldPrice &&
    oldPrice > currentPrice;

  const discountPercentage =
    hasDiscount
      ? Math.round(
          ((oldPrice - currentPrice) /
            oldPrice) *
            100
        )
      : 0;

  /* =========================================================
     QUANTITY
  ========================================================= */

  const decreaseQuantity = () => {
    setQuantity((current) =>
      Math.max(1, current - 1)
    );
  };

  const increaseQuantity = () => {
    setQuantity(
      (current) => current + 1
    );
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <section>
      {/* =====================================================
          PRODUCT TOP SECTION
      ====================================================== */}

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        {/* ===================================================
            LEFT - PRODUCT IMAGES
        ==================================================== */}

        <div className="w-full">
          {/* Main Product Image */}

          <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-white">
            {product.images?.length > 0 &&
            product.images[selectedImage] ? (
              <Image
                src={
                  product.images[
                    selectedImage
                  ]
                }
                alt={`${product.name} - product image`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain p-4 sm:p-8"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                No Image Available
              </div>
            )}

            {/* Discount Badge */}

            {hasDiscount && (
              <span className="absolute left-5 top-5 rounded-full bg-green-700 px-4 py-2 text-sm font-bold text-white">
                {discountPercentage}% OFF
              </span>
            )}
          </div>

          {/* Thumbnail Images */}

          {product.images?.length > 0 && (
            <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
              {product.images.map(
                (image, index) => (
                  <button
                    key={`product-image-${product.id}-${index}`}
                    type="button"
                    onClick={() =>
                      setSelectedImage(
                        index
                      )
                    }
                    aria-label={`View ${product.name} image ${
                      index + 1
                    }`}
                    className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-white transition sm:h-24 sm:w-24 ${
                      selectedImage === index
                        ? "border-green-700"
                        : "border-gray-200 hover:border-green-400"
                    }`}
                  >
                    {image ? (
                      <Image
                        src={image}
                        alt={`${product.name} image ${
                          index + 1
                        }`}
                        fill
                        sizes="96px"
                        className="object-contain p-2"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                        No Image
                      </span>
                    )}
                  </button>
                )
              )}
            </div>
          )}
        </div>

        {/* ===================================================
            RIGHT - PRODUCT INFORMATION
        ==================================================== */}

        <div className="flex flex-col">
          {/* Category */}

          <p className="text-sm font-medium uppercase tracking-wide text-green-700">
            {product.category}
          </p>

          {/* Health Concerns */}

          {product.healthConcerns &&
            product.healthConcerns.length > 0 && (
              <p className="mt-1 text-sm text-gray-500">
                {product.healthConcerns.join(
                  " • "
                )}
              </p>
            )}

          {/* Urdu Product Name */}

          <h1
            dir="rtl"
            className="mt-3 text-3xl font-bold leading-relaxed text-green-800 sm:text-4xl"
          >
            {product.nameUrdu}
          </h1>

          {/* English Product Name */}

          <h2 className="mt-1 text-2xl font-semibold text-gray-900 sm:text-3xl">
            {product.name}
          </h2>

          {/* Rating */}

          <div className="mt-4 flex items-center gap-2">
            <div className="flex items-center">
              {Array.from({
                length: 5,
              }).map((_, index) => (
                <Star
                  key={`rating-star-${product.id}-${index}`}
                  size={18}
                  className={
                    index < rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }
                />
              ))}
            </div>

            <span className="text-sm text-gray-500">
              {rating}.0
            </span>

            {product.reviewCount !==
              undefined && (
              <span className="text-sm text-gray-400">
                ({product.reviewCount} reviews)
              </span>
            )}
          </div>

          {/* =================================================
              PRICE
          ================================================== */}

          <div className="mt-6 flex flex-wrap items-end gap-3">
            {/* Current Price */}

            <span className="text-3xl font-bold text-green-700">
              Rs.{" "}
              {currentPrice.toLocaleString()}
            </span>

            {/* Old Price */}

            {hasOldPrice && (
              <span className="text-lg text-gray-400 line-through">
                Rs.{" "}
                {oldPrice.toLocaleString()}
              </span>
            )}

            {/* Discount */}

            {hasDiscount && (
              <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-700">
                {discountPercentage}% OFF
              </span>
            )}
          </div>

          {/* =================================================
              VARIANTS / SELECT SIZE
          ================================================== */}

          {product.variants &&
            product.variants.length > 0 && (
              <div className="mt-7">
                <h3 className="mb-3 text-sm font-semibold text-gray-900">
                  Select Size
                </h3>

                <div className="flex flex-wrap gap-3">
                  {product.variants.map(
                    (variant, index) => (
                      <button
                        key={`variant-${product.id}-${variant.id}`}
                        type="button"
                        onClick={() =>
                          setSelectedVariantIndex(
                            index
                          )
                        }
                        className={`rounded-full border px-5 py-2.5 text-sm font-medium transition ${
                          selectedVariantIndex ===
                          index
                            ? "border-green-700 bg-green-700 text-white"
                            : "border-gray-300 bg-white text-gray-700 hover:border-green-600 hover:text-green-700"
                        }`}
                      >
                        {variant.quantity_value}{" "}
                        {variant.unit}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

          {/* Description */}

          <div className="mt-6">
            {product.descriptionUrdu && (
              <p
                dir="rtl"
                className="text-lg leading-9 text-gray-700"
              >
                {product.descriptionUrdu}
              </p>
            )}

            {product.description && (
              <p className="mt-3 leading-7 text-gray-600">
                {product.description}
              </p>
            )}
          </div>

          {/* =================================================
              QUANTITY
          ================================================== */}

          <div className="mt-7">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">
              Quantity
            </h3>

            <div className="flex w-fit items-center overflow-hidden rounded-full border border-gray-300">
              <button
                type="button"
                onClick={
                  decreaseQuantity
                }
                aria-label="Decrease quantity"
                className="flex h-11 w-11 items-center justify-center text-gray-600 transition hover:bg-green-50 hover:text-green-700"
              >
                <Minus size={17} />
              </button>

              <span className="flex h-11 min-w-12 items-center justify-center text-sm font-semibold">
                {quantity}
              </span>

              <button
                type="button"
                onClick={
                  increaseQuantity
                }
                aria-label="Increase quantity"
                className="flex h-11 w-11 items-center justify-center text-gray-600 transition hover:bg-green-50 hover:text-green-700"
              >
                <Plus size={17} />
              </button>
            </div>
          </div>

          {/* =================================================
              ACTION BUTTONS
          ================================================== */}

          <div className="mt-7 flex gap-3">
            {/* Add to Cart */}

            <button
              type="button"
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-green-700 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-green-800 active:scale-[0.98]"
            >
              <ShoppingCart size={19} />
              Add to Cart
            </button>

            {/* Wishlist */}

            <button
              type="button"
              aria-label={`Add ${product.name} to wishlist`}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gray-300 text-gray-500 transition hover:border-green-600 hover:bg-green-50 hover:text-green-700"
            >
              <Heart size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================
          PRODUCT INFORMATION
      ====================================================== */}

      <div className="mt-14 border-t border-gray-200 pt-8">
        {/* Tabs */}

        <div className="flex flex-wrap gap-2 border-b border-gray-200">
          <button
            type="button"
            onClick={() =>
              setActiveTab("tafseel")
            }
            className={`px-5 py-3 text-sm font-semibold transition ${
              activeTab === "tafseel"
                ? "border-b-2 border-green-700 text-green-700"
                : "text-gray-500 hover:text-green-700"
            }`}
          >
            تفصیل
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveTab("ingredients")
            }
            className={`px-5 py-3 text-sm font-semibold transition ${
              activeTab === "ingredients"
                ? "border-b-2 border-green-700 text-green-700"
                : "text-gray-500 hover:text-green-700"
            }`}
          >
            اجزاء
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveTab("usage")
            }
            className={`px-5 py-3 text-sm font-semibold transition ${
              activeTab === "usage"
                ? "border-b-2 border-green-700 text-green-700"
                : "text-gray-500 hover:text-green-700"
            }`}
          >
            استعمال کا طریقہ
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveTab("benefits")
            }
            className={`px-5 py-3 text-sm font-semibold transition ${
              activeTab === "benefits"
                ? "border-b-2 border-green-700 text-green-700"
                : "text-gray-500 hover:text-green-700"
            }`}
          >
            فوائد
          </button>
        </div>

        {/* Tab Content */}

        <div className="py-8">
          {/* Tafseel */}

          {activeTab === "tafseel" && (
            <div>
              <h3
                dir="rtl"
                className="text-2xl font-bold text-green-800"
              >
                تفصیل
              </h3>

              {product.descriptionUrdu && (
                <p
                  dir="rtl"
                  className="mt-5 text-lg leading-10 text-gray-700"
                >
                  {
                    product.descriptionUrdu
                  }
                </p>
              )}

              {product.description && (
                <p className="mt-5 leading-8 text-gray-600">
                  {product.description}
                </p>
              )}
            </div>
          )}

          {/* Ingredients */}

          {activeTab === "ingredients" && (
            <div>
              <h3
                dir="rtl"
                className="text-2xl font-bold text-green-800"
              >
                اجزاء
              </h3>

              {product.ingredients &&
              product.ingredients.length >
                0 ? (
                <ul
                  dir="rtl"
                  className="mt-5 space-y-3 text-lg leading-8 text-gray-700"
                >
                  {product.ingredients.map(
                    (
                      ingredient,
                      index
                    ) => (
                      <li
                        key={`ingredient-${product.id}-${index}`}
                        className="flex gap-3"
                      >
                        <span className="text-green-700">
                          •
                        </span>

                        <span>
                          {ingredient}
                        </span>
                      </li>
                    )
                  )}
                </ul>
              ) : (
                <p className="mt-5 text-gray-500">
                  Ingredients information is not available.
                </p>
              )}
            </div>
          )}

          {/* Usage */}

          {activeTab === "usage" && (
            <div>
              <h3
                dir="rtl"
                className="text-2xl font-bold text-green-800"
              >
                استعمال کا طریقہ
              </h3>

              {product.usage ? (
                <p
                  dir="rtl"
                  className="mt-5 text-lg leading-10 text-gray-700"
                >
                  {product.usage}
                </p>
              ) : (
                <p className="mt-5 text-gray-500">
                  Usage information is not available.
                </p>
              )}
            </div>
          )}

          {/* Benefits */}

          {activeTab === "benefits" && (
            <div>
              <h3
                dir="rtl"
                className="text-2xl font-bold text-green-800"
              >
                فوائد
              </h3>

              {product.benefits &&
              product.benefits.length >
                0 ? (
                <ul
                  dir="rtl"
                  className="mt-5 space-y-3 text-lg leading-8 text-gray-700"
                >
                  {product.benefits.map(
                    (
                      benefit,
                      index
                    ) => (
                      <li
                        key={`benefit-${product.id}-${index}`}
                        className="flex gap-3"
                      >
                        <span className="text-green-700">
                          •
                        </span>

                        <span>
                          {benefit}
                        </span>
                      </li>
                    )
                  )}
                </ul>
              ) : (
                <p className="mt-5 text-gray-500">
                  Benefits information is not available.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}