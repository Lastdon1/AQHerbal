export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md items-center justify-center px-6 pt-16">
      <div className="w-full rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-center text-3xl font-semibold">
          Login
        </h1>

        <form className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-green-700 py-3 font-medium text-white hover:bg-green-800"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
  New customer?{" "}
  <a
    href="/register"
    className="font-medium text-green-700 hover:text-green-900 hover:underline"
  >
    Create an account
  </a>
</p>
      </div>
    </main>
  );
}