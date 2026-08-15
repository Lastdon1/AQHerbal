"use client";

import Image from "next/image";
import { useState } from "react";

type ProductImage = {
  id: number;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
};

type ProductGalleryProps = {
  images: ProductImage[];
  productName: string;
};

export default function ProductGallery({
  images,
  productName,
}: ProductGalleryProps) {
  const initialImage =
    images.find((image) => image.is_primary) ||
    images[0] ||
    null;

  const [selectedImageId, setSelectedImageId] =
    useState<number | null>(
      initialImage?.id ?? null
    );

  const selectedImage =
    images.find(
      (image) => image.id === selectedImageId
    ) || initialImage;

  if (!selectedImage) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-2xl bg-gray-50 text-gray-400">
        No Image
      </div>
    );
  }

  return (
    <div>
      {/* =========================================
          MAIN IMAGE
      ========================================= */}

      <div className="flex min-h-[400px] items-center justify-center overflow-hidden rounded-2xl bg-gray-50 p-6 sm:min-h-[480px]">
        <div className="relative h-[360px] w-full max-w-[480px] sm:h-[440px]">
          <Image
            key={selectedImage.id}
            src={selectedImage.image_url}
            alt={
              selectedImage.alt_text ||
              productName
            }
            fill
            sizes="(max-width: 640px) 90vw, 480px"
            className="object-contain"
            priority={
              selectedImage.id ===
              initialImage?.id
            }
          />
        </div>
      </div>

      {/* =========================================
          THUMBNAILS
      ========================================= */}

      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
          {images.map((image) => {
            const isSelected =
              image.id === selectedImage.id;

            return (
              <button
                key={image.id}
                type="button"
                onClick={() =>
                  setSelectedImageId(
                    image.id
                  )
                }
                aria-label={`View ${
                  image.alt_text ||
                  `product image`
                }`}
                className={`relative aspect-square overflow-hidden rounded-xl border-2 bg-white transition ${
                  isSelected
                    ? "border-green-600 ring-2 ring-green-100"
                    : "border-gray-200 hover:border-green-400"
                }`}
              >
                <Image
                  src={image.image_url}
                  alt={
                    image.alt_text ||
                    productName
                  }
                  fill
                  sizes="100px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Image count */}

      {images.length > 1 && (
        <p className="mt-3 text-center text-xs text-gray-400">
          {images.length} product images
        </p>
      )}
    </div>
  );
}