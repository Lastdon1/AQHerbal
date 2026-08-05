export default function CartPage() {
  return (
    <main className="mx-auto min-h-[70vh] max-w-5xl px-6 py-16">
      <div className="rounded-2xl border bg-white p-10 text-center shadow-sm">
        <h1 className="text-3xl font-semibold text-green-900">
          Your Cart
        </h1>

        <p className="mt-4 text-gray-600">
          Your shopping cart is currently empty.
        </p>

        <button className="mt-8 rounded-lg bg-green-700 px-8 py-3 font-medium text-white hover:bg-green-800">
          Continue Shopping
        </button>
      </div>
    </main>
  );
}