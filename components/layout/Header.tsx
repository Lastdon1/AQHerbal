import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full border-b bg-white">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">

        <div className="text-2xl font-bold text-green-700">
          AQ Herbal
        </div>

        <nav className="flex gap-6 text-sm font-medium">

          <Link href="/">
            Home
          </Link>

          <Link href="/shop">
            Shop
          </Link>

          <Link href="/about">
            About
          </Link>

          <Link href="/contact">
            Contact
          </Link>

        </nav>

        <div className="flex gap-4">
          <button>
            🔍
          </button>

          <button>
            🛒
          </button>
        </div>

      </div>
    </header>
  );
}