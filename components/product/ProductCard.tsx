import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  slug: string;
  name: string;
  image: string;
  price: number;
  description?: string;
  oldPrice?: number;
  rating?: number;
}

export default function ProductCard({
  slug,
  name,
  image,
  price,
  description,
  oldPrice,
  rating = 5,
}: ProductCardProps) {
  return (
    <div
      className="
        group
        overflow-hidden
        rounded-3xl
        bg-white
        shadow-sm
        transition
        hover:shadow-lg
      "
    >
      {/* Product Image */}
      <div
        className="
          relative
          flex
          h-64
          items-center
          justify-center
          bg-green-50
        "
      >
        <Link href={`/product/${slug}`}>
          <Image
            src={image}
            alt={name}
            width={220}
            height={220}
            className="
              h-52
              w-52
              object-contain
              transition
              duration-300
              group-hover:scale-105
            "
          />
        </Link>

        {/* Wishlist */}
        <button
          className="
            absolute
            right-4
            top-4
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            bg-white
            shadow-sm
          "
        >
          ♡
        </button>
      </div>

      {/* Product Details */}
      <div className="p-5">

        {/* Rating */}
        <div className="text-sm text-yellow-500">
          {"★".repeat(rating)}
        </div>

        {/* Name */}
        <Link href={`/product/${slug}`}>
          <h3
            className="
              mt-2
              text-lg
              font-semibold
              text-gray-900
              transition
              hover:text-green-700
            "
          >
            {name}
          </h3>
        </Link>

        {/* Description */}
        {description && (
          <p
            className="
              mt-2
              line-clamp-2
              text-sm
              leading-5
              text-gray-600
            "
          >
            {description}
          </p>
        )}

        {/* Price */}
        <div
          className="
            mt-4
            flex
            items-center
            gap-2
          "
        >
          <span
            className="
              text-xl
              font-bold
              text-green-700
            "
          >
            Rs. {price.toLocaleString()}
          </span>

          {oldPrice && (
            <span
              className="
                text-sm
                text-gray-400
                line-through
              "
            >
              Rs. {oldPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Add Cart Button */}
        <button
          className="
            mt-5
            w-full
            rounded-full
            bg-green-700
            py-3
            text-white
            transition
            hover:bg-green-800
          "
        >
          Add to Cart
        </button>

      </div>
    </div>
  );
}