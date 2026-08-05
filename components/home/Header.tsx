import Image from "next/image";
import Link from "next/link";
import { Search, User, Heart, ShoppingCart } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src="/logos/logo.png"
            alt="AQ Herbal"
            width={180}
            height={70}
            className="h-14 w-auto object-contain"
            priority
          />
<div className="hidden sm:flex flex-col items-center justify-center leading-none">
  <span className="text-4xl font-black tracking-widest text-green-800">
    AQ
  </span>

  <span className="mt-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-gray-900">
    Herbal Store
  </span>
</div>
          
        </Link>

        {/* Search */}
        <div className="hidden lg:flex flex-1 justify-center px-6">
          <div className="relative w-full max-w-lg">
            <input
              type="text"
              placeholder="Search products..."
              className="h-10 w-full rounded-full border border-gray-300 px-5 pr-12 text-sm outline-none transition focus:border-green-700"
            />

            <button
              className="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-green-700 text-white transition hover:bg-green-800"
            >
              <Search size={18} />
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex shrink-0 items-center gap-6">

          {/* Account */}
          <button className="hidden lg:flex items-center gap-2 text-gray-700 transition hover:text-green-700">
            <User size={22} />

            <div className="leading-tight text-left">
              <p className="text-xs text-gray-500">Hello</p>
              <p className="text-sm font-medium">Account</p>
            </div>
          </button>

          {/* Wishlist */}
          <button className="relative text-gray-700 transition hover:text-green-700">
            <Heart size={22} />

            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-green-700 text-[10px] font-semibold text-white">
              0
            </span>
          </button>

          {/* Cart */}
          <button className="relative flex items-center gap-2 text-gray-700 transition hover:text-green-700">
            <ShoppingCart size={22} />

            <span className="absolute -left-1 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-green-700 text-[10px] font-semibold text-white">
              0
            </span>

            <div className="hidden lg:block leading-tight text-left">
              <p className="text-xs text-gray-500">Cart</p>
              <p className="text-sm font-semibold">$0.00</p>
            </div>
          </button>

        </div>

      </div>
    </header>
  );
}