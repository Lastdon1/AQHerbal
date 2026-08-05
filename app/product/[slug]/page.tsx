import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { products } from "@/constants/products";

type Props = {
  params: {
    slug: string;
  };
};

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  const product = products.find(
    (item) => item.slug === slug
  );

  if (!product) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      {/* Back Link */}
      <Link
        href="/shop"
        className="mb-8 inline-block text-sm font-medium text-green-700 hover:underline"
      >
        ← Back to Shop
      </Link>

      <div className="grid gap-10 md:grid-cols-2">
        {/* Product Image */}
        <div className="flex items-center justify-center rounded-2xl border bg-white p-8">
          <div className="relative h-[400px] w-full">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-4xl font-bold text-green-800">
            {product.name}
          </h1>

          <p className="mt-4 text-2xl font-semibold text-gray-900">
            Rs. {product.price}
          </p>

          <p className="mt-6 leading-7 text-gray-600">
            {product.description}
          </p>

          <div className="mt-8 flex gap-4">
            <button className="rounded-lg bg-green-700 px-6 py-3 font-semibold text-white transition hover:bg-green-800">
              Add to Cart
            </button>

            <button className="rounded-lg border border-green-700 px-6 py-3 font-semibold text-green-700 transition hover:bg-green-50">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}