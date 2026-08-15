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
    images[0];

  const [selectedImage, setSelectedImage] =
    useState<ProductImage | undefined>(
      initialImage
    );

  if (!images.length || !selectedImage) {
    return (
      <div className="flex h-[420px] items-center justify-center rounded-2xl bg-gray-50 text-gray-400">
        No Image
      </div>
    );
  }

  return (
    <div>
      {/* =========================================
          MAIN PRODUCT IMAGE
      ========================================= */}

      <div className="flex h-[420px] items-center justify-center overflow-hidden rounded-2xl bg-gray-50 p-6 sm:h-[460px]">
        <Image
          src={selectedImage.image_url}
          alt={
            selectedImage.alt_text ||
            productName
          }
          width={600}
          height={600}
          priority
          className="h-auto max-h-[360px] w-auto max-w-[90%] object-contain"
        />
      </div>

      {/* =========================================
          IMAGE THUMBNAILS
      ========================================= */}

      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-3">
          {images.map((image) => {
            const isSelected =
              selectedImage.id === image.id;

            return (
              <button
                key={image.id}
                type="button"
                onClick={() =>
                  setSelectedImage(image)
                }
                aria-label={`View image ${
                  image.sort_order + 1
                }`}
                className={`flex aspect-square items-center justify-center overflow-hidden rounded-xl border-2 bg-white p-2 transition ${
                  isSelected
                    ? "border-green-600 ring-2 ring-green-100"
                    : "border-gray-200 hover:border-green-400"
                }`}
              >
                <Image
                  src={image.image_url}
                  alt={
                    image.alt_text ||
                    `${productName} image`
                  }
                  width={120}
                  height={120}
                  className="h-full w-full object-contain"
                />
              </button>
            );
          })}
        </div>
      )}

      {images.length > 1 && (
        <p className="mt-3 text-center text-xs text-gray-400">
          Click an image to view it
        </p>
      )}
    </div>
  );
}