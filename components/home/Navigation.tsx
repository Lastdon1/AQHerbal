"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import { navigation } from "@/constants/navigation";

type Category = {
  id: number;
  name: string;
  name_urdu: string | null;
  slug: string;
};

export default function Navigation() {
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  /* ============================================================
     LOAD CATEGORIES FROM POSTGRESQL
  ============================================================ */

  useEffect(() => {
    let mounted = true;

    async function loadCategories() {
      try {
        const response = await fetch("/api/categories", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to load categories");
        }

        const data = await response.json();

        if (mounted) {
          setCategories(
            Array.isArray(data) ? data : []
          );
        }
      } catch (error) {
        console.error(
          "CATEGORY MENU LOAD ERROR:",
          error
        );

        if (mounted) {
          setCategories([]);
        }
      } finally {
        if (mounted) {
          setCategoriesLoading(false);
        }
      }
    }

    loadCategories();

    return () => {
      mounted = false;
    };
  }, []);

  /* ============================================================
     CATEGORY URL
  ============================================================ */

  const getCategoryHref = (slug: string) => {
    if (slug === "herbs") {
      return "/herbs";
    }

    if (slug === "murabba-jat") {
      return "/murabba-jat";
    }

    if (slug === "nuskhajat") {
      return "/nuskhajat";
    }

    return `/category/${slug}`;
  };

  /* ============================================================
     DESKTOP ACTIVE NAVIGATION
  ============================================================ */

  const isNavigationActive = (href: string) => {
    return (
      pathname === href ||
      (href !== "/" && pathname.startsWith(href))
    );
  };

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex h-14 max-w-7xl items-center px-6">

        {/* ==================================================
            DESKTOP SHOP BY CATEGORY
        =================================================== */}

        <div className="group relative hidden lg:block">
          <button
            type="button"
            className="
              flex
              items-center
              gap-2
              rounded-lg
              bg-green-800
              px-5
              py-2
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-green-900
            "
          >
            <Menu size={18} />

            <span>Shop by Category</span>

            <ChevronDown size={16} />
          </button>

          {/* ==================================================
              DESKTOP CATEGORY MEGA MENU
          =================================================== */}

          <div
            className="
              invisible
              absolute
              left-0
              top-full
              z-50
              mt-2
              w-[560px]
              rounded-xl
              border
              border-gray-100
              bg-white
              p-4
              opacity-0
              shadow-2xl
              transition-all
              duration-200
              group-hover:visible
              group-hover:opacity-100
            "
          >
            {/* ==================================================
                CATEGORIES
            =================================================== */}

            {categoriesLoading ? (
              <div className="py-6 text-center text-sm text-gray-400">
                Loading categories...
              </div>
            ) : categories.length > 0 ? (
              <div className="grid grid-cols-2 gap-x-8 gap-y-1">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={getCategoryHref(category.slug)}
                    className="
                      flex
                      items-center
                      rounded-md
                      px-2
                      py-1.5
                      transition
                      hover:bg-green-50
                    "
                  >
                    {/* English */}

                    <span
                      className="
                        flex-1
                        whitespace-nowrap
                        text-left
                        text-sm
                        font-medium
                        text-gray-700
                      "
                    >
                      {category.name}
                    </span>

                    {/* Urdu */}

                    <span
                      dir="rtl"
                      lang="ur"
                      className="
                        flex-1
                        whitespace-nowrap
                        text-right
                        text-sm
                        font-semibold
                        text-green-800
                      "
                    >
                      {category.name_urdu}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-sm text-gray-400">
                No categories available.
              </div>
            )}

            {/* ==================================================
                VIEW ALL CATEGORIES
            =================================================== */}

            <div className="mt-3 border-t border-gray-100 pt-3 text-center">
              <Link
                href="/categories"
                className="
                  text-sm
                  font-semibold
                  text-green-700
                  transition
                  hover:text-green-800
                "
              >
                View All Categories →
              </Link>
            </div>
          </div>
        </div>

        {/* ==================================================
            DESKTOP NAVIGATION
        =================================================== */}

        <div
          className="
            absolute
            left-1/2
            hidden
            -translate-x-1/2
            items-center
            gap-8
            lg:flex
          "
        >
          <div
            className="
              ml-6
              flex
              items-center
              gap-6
              xl:ml-10
              xl:gap-7
            "
          >
            {navigation.map((item) => {
              const active = isNavigationActive(
                item.href
              );

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    whitespace-nowrap
                    text-sm
                    font-medium
                    transition
                    ${
                      active
                        ? "text-green-700"
                        : "text-gray-700 hover:text-green-700"
                    }
                  `}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* ==================================================
            MOBILE MENU BUTTON
        =================================================== */}

        <button
          type="button"
          onClick={() =>
            setMobileOpen((value) => !value)
          }
          aria-label="Toggle navigation menu"
          className="
            ml-auto
            text-gray-700
            lg:hidden
          "
        >
          {mobileOpen ? (
            <X size={26} />
          ) : (
            <Menu size={26} />
          )}
        </button>
      </div>

      {/* ======================================================
          MOBILE MENU
      ======================================================= */}

      {mobileOpen && (
        <div
          className="
            border-t
            bg-white
            px-6
            py-5
            lg:hidden
          "
        >
          {/* ==================================================
              MOBILE SHOP BY CATEGORY
          =================================================== */}

          <button
            type="button"
            onClick={() =>
              setCategoryOpen(
                (value) => !value
              )
            }
            className="
              flex
              w-full
              items-center
              justify-between
              rounded-md
              bg-green-800
              px-4
              py-3
              text-sm
              font-semibold
              text-white
            "
          >
            <span className="flex items-center gap-2">
              <Menu size={18} />

              Shop by Category
            </span>

            <ChevronDown
              size={18}
              className={`
                transition-transform
                duration-200
                ${
                  categoryOpen
                    ? "rotate-180"
                    : ""
                }
              `}
            />
          </button>

          {/* ==================================================
              MOBILE CATEGORIES
          =================================================== */}

          {categoryOpen && (
            <div
              className="
                mt-4
                rounded-lg
                border
                border-gray-100
                bg-gray-50
                p-3
              "
            >
              {categoriesLoading ? (
                <div className="py-4 text-center text-sm text-gray-400">
                  Loading categories...
                </div>
              ) : categories.length > 0 ? (
                <div className="space-y-1">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={getCategoryHref(
                        category.slug
                      )}
                      onClick={() => {
                        setMobileOpen(false);
                        setCategoryOpen(false);
                      }}
                      className="
                        flex
                        items-center
                        rounded-lg
                        bg-white
                        px-4
                        py-3
                        transition
                        hover:bg-green-50
                      "
                    >
                      {/* English */}

                      <span
                        className="
                          flex-1
                          text-left
                          text-sm
                          font-medium
                          text-gray-700
                        "
                      >
                        {category.name}
                      </span>

                      {/* Urdu */}

                      <span
                        dir="rtl"
                        lang="ur"
                        className="
                          flex-1
                          whitespace-nowrap
                          text-right
                          text-base
                          font-semibold
                          text-green-800
                        "
                      >
                        {category.name_urdu}
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="py-4 text-center text-sm text-gray-400">
                  No categories available.
                </div>
              )}

              {/* ==================================================
                  MOBILE VIEW ALL CATEGORIES
              =================================================== */}

              <div className="mt-3 border-t border-gray-200 pt-3 text-center">
                <Link
                  href="/categories"
                  onClick={() => {
                    setMobileOpen(false);
                    setCategoryOpen(false);
                  }}
                  className="
                    text-sm
                    font-semibold
                    text-green-700
                    transition
                    hover:text-green-800
                  "
                >
                  View All Categories →
                </Link>
              </div>
            </div>
          )}

          {/* ==================================================
              MAIN MOBILE LINKS
          =================================================== */}

          <div className="mt-5 space-y-3">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() =>
                  setMobileOpen(false)
                }
                className="
                  block
                  text-gray-700
                  transition
                  hover:text-green-700
                "
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}