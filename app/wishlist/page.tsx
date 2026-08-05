export default function WishlistPage() {
  return (
    <main className="mx-auto min-h-[70vh] max-w-5xl px-6 py-16">
      <div className="rounded-2xl border bg-white p-10 text-center shadow-sm">
        <h1 className="text-3xl font-semibold text-green-900">
          Your Wishlist
        </h1>

        <p className="mt-4 text-gray-600">
          Save your favorite herbal products and view them here.
        </p>

        <button className="mt-8 rounded-lg bg-green-700 px-8 py-3 font-medium text-white transition hover:bg-green-800">
          Explore Products
        </button>
      </div>
    </main>
  );
}