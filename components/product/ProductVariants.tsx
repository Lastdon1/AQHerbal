"use client";

import { useState } from "react";

type ProductVariant = {
  id: number;
  quantity_value: number;
  unit: string;
  price: number;
  old_price: number | null;
  is_default: boolean;
  is_active: boolean;
};

type ProductVariantsProps = {
  variants: ProductVariant[];
};

export default function ProductVariants({
  variants,
}: ProductVariantsProps) {
  const initialVariant =
    variants.find(
      (variant) => variant.is_default
    ) || variants[0];

  const [selectedVariantId, setSelectedVariantId] =
    useState<number | null>(
      initialVariant?.id ?? null
    );

  const selectedVariant =
    variants.find(
      (variant) =>
        variant.id === selectedVariantId
    ) || initialVariant;

  if (!variants.length || !selectedVariant) {
    return null;
  }

  return (
    <div className="mt-7">

      {/* =========================================
          CURRENT SELECTED VARIANT
      ========================================= */}

      <div className="rounded-xl border border-green-200 bg-green-50 p-4">
        <p className="text-sm text-gray-500">
          Selected Size
        </p>

        <div className="mt-1 flex flex-wrap items-center gap-3">
          <span className="text-2xl font-bold text-gray-900">
            {selectedVariant.quantity_value}{" "}
            {selectedVariant.unit}
          </span>

          <span className="text-2xl font-bold text-green-700">
            Rs{" "}
            {Number(
              selectedVariant.price
            ).toLocaleString("en-PK")}
          </span>

          {selectedVariant.old_price !==
            null &&
            Number(
              selectedVariant.old_price
            ) >
              Number(
                selectedVariant.price
              ) && (
              <span className="text-base text-gray-400 line-through">
                Rs{" "}
                {Number(
                  selectedVariant.old_price
                ).toLocaleString(
                  "en-PK"
                )}
              </span>
            )}
        </div>
      </div>

      {/* =========================================
          AVAILABLE SIZES
      ========================================= */}

      <h2 className="mt-6 text-lg font-semibold text-gray-900">
        Available Sizes
      </h2>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {variants.map((variant) => {
          const isSelected =
            variant.id ===
            selectedVariantId;

          return (
            <button
              key={variant.id}
              type="button"
              onClick={() =>
                setSelectedVariantId(
                  variant.id
                )
              }
              className={`relative rounded-xl border-2 p-4 text-left transition ${
                isSelected
                  ? "border-green-600 bg-green-50 shadow-sm"
                  : "border-gray-200 bg-white hover:border-green-400 hover:bg-green-50/50"
              }`}
            >

              {/* Selected check */}

              {isSelected && (
                <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-green-700 text-xs font-bold text-white">
                  ✓
                </span>
              )}

              {/* Quantity */}

              <p className="pr-6 font-semibold text-gray-900">
                {variant.quantity_value}{" "}
                {variant.unit}
              </p>

              {/* Price */}

              <p className="mt-2 text-lg font-bold text-green-700">
                Rs{" "}
                {Number(
                  variant.price
                ).toLocaleString("en-PK")}
              </p>

              {/* Old Price */}

              {variant.old_price !==
                null &&
                Number(
                  variant.old_price
                ) >
                  Number(
                    variant.price
                  ) && (
                  <p className="mt-1 text-xs text-gray-400 line-through">
                    Rs{" "}
                    {Number(
                      variant.old_price
                    ).toLocaleString(
                      "en-PK"
                    )}
                  </p>
                )}

              {/* Default */}

              {variant.is_default && (
                <span className="mt-2 inline-block rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                  Default
                </span>
              )}

            </button>
          );
        })}
      </div>
    </div>
  );
}