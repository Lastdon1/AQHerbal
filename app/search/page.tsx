export default function SearchPage() {
  return (
    <main className="mx-auto min-h-[70vh] max-w-5xl px-6 py-16">
      <div className="rounded-2xl border bg-white p-10 text-center shadow-sm">
        <h1 className="text-3xl font-semibold text-green-900">
          Search Products
        </h1>

        <div className="mx-auto mt-8 flex max-w-xl items-center gap-3">
          <input
            type="text"
            placeholder="Search herbal products..."
            className="h-12 flex-1 rounded-lg border px-5 outline-none focus:border-green-700"
          />

          <button className="rounded-lg bg-green-700 px-6 py-3 font-medium text-white hover:bg-green-800">
            Search
          </button>
        </div>
      </div>
    </main>
  );
}