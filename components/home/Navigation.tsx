import Link from "next/link";
import { ChevronDown, Menu } from "lucide-react";

const categories = [
  {
    title: "Herbal Medicines",
    items: [
      "Herbal Capsules",
      "Herbal Tablets",
      "Herbal Syrups",
      "Herbal Powders",
    ],
  },
  {
    title: "Natural Foods",
    items: [
      "Honey",
      "Black Seed",
      "Dates",
      "Dry Fruits",
    ],
  },
  {
    title: "Health & Wellness",
    items: [
      "Immunity",
      "Digestive Health",
      "Men's Health",
      "Women's Health",
    ],
  },
  {
    title: "Personal Care",
    items: [
      "Hair Care",
      "Skin Care",
      "Herbal Oils",
    ],
  },
];

const menuItems = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "Categories", href: "/categories" },
  { name: "Health Concerns", href: "/health-concerns" },
  { name: "Knowledge Center", href: "/knowledge-center" },
  { name: "Blog", href: "/blog" },
  { name: "About Us", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Navigation() {
  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex h-14 max-w-7xl items-center px-6">

        {/* Shop Category */}
        <div className="group relative">

          <button className="flex items-center gap-2 rounded-md bg-green-800 px-5 py-2 text-sm font-semibold text-white transition hover:bg-green-900">
            <Menu size={18} />
            Shop by Category
            <ChevronDown size={16} />
          </button>


          {/* Mega Menu */}
          <div className="invisible absolute left-0 top-full z-50 mt-2 w-[850px] rounded-lg border bg-white p-6 opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:opacity-100">

            <div className="grid grid-cols-4 gap-8">

              {categories.map((category) => (
                <div key={category.title}>

                  <h3 className="mb-3 text-sm font-bold text-green-800">
                    {category.title}
                  </h3>


                  <ul className="space-y-2">

                    {category.items.map((item) => (
                      <li key={item}>
                        <Link
                          href="#"
                          className="text-sm text-gray-600 transition hover:text-green-700"
                        >
                          {item}
                        </Link>
                      </li>
                    ))}

                  </ul>

                </div>
              ))}

            </div>

          </div>

        </div>


        {/* Main Menu */}
        <div className="hidden lg:flex items-center gap-8 ml-10">

          {menuItems.map((item) => (
  <Link
    key={item.href}
    href={item.href}
    className="text-sm font-medium text-gray-700 transition hover:text-green-700"
  >
    {item.name}
  </Link>
))}
        </div>

      </div>
    </nav>
  );
}