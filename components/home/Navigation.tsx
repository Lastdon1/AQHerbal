"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu } from "lucide-react";
import { navigation } from "@/constants/navigation";
import { categories } from "@/constants/categories";

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex h-14 max-w-7xl items-center px-6">
        {/* Shop by Category */}
        <div className="group relative">
          <button className="flex items-center gap-2 rounded-md bg-green-800 px-5 py-2 text-sm font-semibold text-white transition hover:bg-green-900">
            <Menu size={18} />
            Shop by Category
            <ChevronDown size={16} />
          </button>

          {/* Mega Menu */}
          <div className="invisible absolute left-0 top-full z-50 mt-2 w-[900px] rounded-xl border border-gray-100 bg-white p-6 opacity-0 shadow-2xl transition-all duration-200 group-hover:visible group-hover:opacity-100">
            <div className="grid grid-cols-4 gap-8">
              {categories.map((category) => (
                <div key={category.title}>
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-green-800">
                      {category.title}
                    </h3>

                    <Link
                      href={`/category/${category.slug}`}
                      className="text-xs font-medium text-green-700 hover:underline"
                    >
                      View All
                    </Link>
                  </div>

                  <ul className="space-y-2">
                    {category.items.map((item) => (
                      <li key={item.slug}>
                        <Link
                          href={`/category/${item.slug}`}
                          className="block text-sm text-gray-600 transition hover:translate-x-1 hover:text-green-700"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t pt-4 text-center">
              <Link
                href="/categories"
                className="inline-flex rounded-lg bg-green-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-green-800"
              >
                Browse All Categories
              </Link>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="ml-10 hidden items-center gap-8 lg:flex">
          {navigation.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative text-sm font-medium transition ${
                  active
                    ? "font-semibold text-green-700"
                    : "text-gray-700 hover:text-green-700"
                }`}
              >
                {item.name}

                {active && (
                  <span className="absolute -bottom-[18px] left-0 h-[2px] w-full rounded-full bg-green-700" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}