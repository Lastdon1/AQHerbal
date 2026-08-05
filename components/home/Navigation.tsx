"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";

import { navigation } from "@/constants/navigation";
import { categories } from "@/constants/categories";

export default function Navigation() {
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);

  return (
    <nav className="border-b bg-white">

      <div className="mx-auto flex h-14 max-w-7xl items-center px-6">

        {/* Desktop Shop Category */}

        <div className="group relative hidden lg:block">

          <button
            className="
              flex items-center gap-2
              rounded-md
              bg-green-800
              px-5 py-2
              text-sm
              font-semibold
              text-white
              hover:bg-green-900
            "
          >
            <Menu size={18} />
            Shop by Category
            <ChevronDown size={16} />
          </button>


          {/* Desktop Mega Menu */}

          <div
            className="
              invisible
              absolute
              left-0
              top-full
              z-50
              mt-2
              w-[900px]
              rounded-xl
              border
              bg-white
              p-6
              opacity-0
              shadow-2xl
              transition-all
              duration-200
              group-hover:visible
              group-hover:opacity-100
            "
          >

            <div className="grid grid-cols-4 gap-8">

              {categories.map((category) => (

                <div key={category.title}>

                  <div className="mb-3 flex justify-between">

                    <h3 className="text-sm font-bold text-green-800">
                      {category.title}
                    </h3>

                    <Link
                      href={`/category/${category.slug}`}
                      className="text-xs text-green-700"
                    >
                      View All
                    </Link>

                  </div>


                  <ul className="space-y-2">

                    {category.items.map((item) => (

                      <li key={item.slug}>

                        <Link
                          href={`/category/${item.slug}`}
                          className="
                            text-sm
                            text-gray-600
                            hover:text-green-700
                          "
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
                className="
                  inline-flex
                  rounded-lg
                  bg-green-700
                  px-5
                  py-2
                  text-sm
                  font-semibold
                  text-white
                  hover:bg-green-800
                "
              >
                Browse All Categories
              </Link>

            </div>


          </div>

        </div>



        {/* Desktop Navigation */}

        <div className="ml-10 hidden items-center gap-8 lg:flex">

          {navigation.map((item) => {

            const active =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));


            return (

              <Link
                key={item.href}
                href={item.href}
                className={`
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



        {/* Mobile Menu Button */}

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="ml-auto lg:hidden text-gray-700"
        >

          {mobileOpen ? <X size={26} /> : <Menu size={26} />}

        </button>


      </div>



      {/* Mobile Menu */}

      {mobileOpen && (

        <div className="border-t bg-white px-6 py-5 lg:hidden">


          {/* Shop Category Button */}

          <button
            onClick={() => setCategoryOpen(!categoryOpen)}
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
              className={categoryOpen ? "rotate-180" : ""}
            />

          </button>



          {/* Mobile Categories */}

          {categoryOpen && (

            <div className="mt-4 rounded-lg border p-4">

              {categories.map((category) => (

                <div
                  key={category.title}
                  className="mb-5"
                >

                  <Link
                    href={`/category/${category.slug}`}
                    className="
                      font-semibold
                      text-green-700
                    "
                  >
                    {category.title}
                  </Link>


                  {category.items.map((item) => (

                    <Link
                      key={item.slug}
                      href={`/category/${item.slug}`}
                      className="
                        block
                        py-1
                        text-sm
                        text-gray-600
                        hover:text-green-700
                      "
                    >

                      {item.name}

                    </Link>

                  ))}


                </div>

              ))}


            </div>

          )}



          {/* Main Links */}

          <div className="mt-5 space-y-3">

            {navigation.map((item) => (

              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="
                  block
                  text-gray-700
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