"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Search, User, Heart, ShoppingCart } from "lucide-react";
import { products } from "@/constants/products";

export default function Header() {
  const [search, setSearch] = useState("");
const filteredProducts = products.filter((product) =>
  product.name.toLowerCase().includes(search.toLowerCase())
);
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
            {search && (
  <div className="absolute top-12 left-0 z-50 w-full rounded-xl border bg-white shadow-lg">
    {filteredProducts.length > 0 ? (
      filteredProducts.map((product) => (
        <Link
  key={product.id}
  href={`/product/${product.slug}`}
  onClick={() => setSearch("")}
  className="block px-5 py-3 text-sm hover:bg-green-50"
>
  {product.name}
</Link>
      ))
    ) : (
      <p className="px-5 py-3 text-sm text-gray-500">
        No products found
      </p>
    )}
  </div>
)}
            <input
  type="text"
  value={search}
  onChange={(e) => setSearch(e.target.value)}
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
          <Link
  href="/login"
  className="hidden lg:flex items-center gap-2 text-gray-700 transition hover:text-green-700"
>
  <User size={22} />

  <div className="leading-tight text-left">
    <p className="text-xs text-gray-500">Hello</p>
    <p className="text-sm font-medium">Account</p>
  </div>
</Link>
          {/* Wishlist */}
          <Link
  href="/wishlist"
  className="relative text-gray-700 transition hover:text-red-600"
>
  <Heart
  size={22}
  className="transition hover:text-green-700"
/>

  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-green-700 text-[10px] font-semibold text-white">
    0
  </span>
</Link>
          {/* Cart */}
          <Link
  href="/cart"
  className="relative flex items-center gap-2 text-gray-700 transition hover:text-green-700"
>
  <ShoppingCart
    size={22}
    className="transition hover:text-green-700"
  />

  <span className="absolute -left-1 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-green-700 text-[10px] font-semibold text-white">
    0
  </span>

  <div className="hidden lg:block leading-tight text-left">
    <p className="text-xs text-gray-500">Cart</p>
    <p className="text-sm font-semibold">Rs 0.00</p>
  </div>
</Link>

        </div>

      </div>
    </header>
  );
}