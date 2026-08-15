import Link from "next/link";
import {
  Package,
  FolderTree,
  HeartPulse,
  ShoppingBag,
  MessageCircle,
  Settings,
  Info,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import pool from "@/lib/db";

type DashboardStats = {
  products: number;
  categories: number;
  healthConcerns: number;
  orders: number;
  mashora: number;
};

async function getDashboardStats(): Promise<DashboardStats> {
  const productsResult = await pool.query(`
    SELECT COUNT(*)::int AS count
    FROM products
  `);

  const categoriesResult = await pool.query(`
    SELECT COUNT(*)::int AS count
    FROM categories
  `);

  const healthConcernsResult = await pool.query(`
    SELECT COUNT(*)::int AS count
    FROM health_concerns
  `);

  const ordersResult = await pool.query(`
    SELECT COUNT(*)::int AS count
    FROM orders
  `);

  const mashoraResult = await pool.query(`
    SELECT COUNT(*)::int AS count
    FROM mashora_consultations
    WHERE status = 'pending'
  `);

  return {
    products: productsResult.rows[0]?.count ?? 0,
    categories: categoriesResult.rows[0]?.count ?? 0,
    healthConcerns: healthConcernsResult.rows[0]?.count ?? 0,
    orders: ordersResult.rows[0]?.count ?? 0,
    mashora: mashoraResult.rows[0]?.count ?? 0,
  };
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  const statsCards = [
    {
      label: "Products",
      value: stats.products,
      href: "/admin/products",
      icon: Package,
      description: "Manage your product catalog",
    },
    {
      label: "Categories",
      value: stats.categories,
      href: "/admin/categories",
      icon: FolderTree,
      description: "Organize your store",
    },
    {
      label: "Health Concerns",
      value: stats.healthConcerns,
      href: "/admin/health-concerns",
      icon: HeartPulse,
      description: "Manage wellness concerns",
    },
    {
      label: "Orders",
      value: stats.orders,
      href: "/admin/orders",
      icon: ShoppingBag,
      description: "View customer orders",
    },
    {
      label: "Mashora",
      value: stats.mashora,
      href: "/admin/mashora",
      icon: MessageCircle,
      description: "Pending consultations",
    },
  ];

  const managementCards = [
    {
      title: "Site Settings",
      description:
        "Manage contact details, WhatsApp, social media and branding text.",
      href: "/admin/settings",
      icon: Settings,
    },
    {
      title: "About Us",
      description:
        "Manage your About page, story, mission, values and call to action.",
      href: "/admin/about",
      icon: Info,
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="relative overflow-hidden rounded-3xl bg-green-950 px-6 py-8 shadow-sm sm:px-8 sm:py-10">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-green-800/40 blur-3xl" />

          <div className="absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-green-700/20 blur-3xl" />

          <div className="relative">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-green-100">
              <Sparkles className="h-3.5 w-3.5" />
              ISACO Administration
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Admin Dashboard
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-green-100 sm:text-base">
              Manage your ISACO store, products, customers,
              content and website settings from one place.
            </p>
          </div>
        </div>

        {/* =====================================================
            STORE OVERVIEW
        ====================================================== */}

        <div className="mt-8">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-gray-900">
              Store Overview
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              A quick look at your current store data.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {statsCards.map((card) => {
              const Icon = card.icon;

              return (
                <Link
                  key={card.label}
                  href={card.href}
                  className="
                    group
                    rounded-2xl
                    border
                    border-gray-100
                    bg-white
                    p-5
                    shadow-sm
                    transition-all
                    duration-200
                    hover:-translate-y-1
                    hover:border-green-100
                    hover:shadow-lg
                  "
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-700 transition-colors group-hover:bg-green-700 group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </div>

                    <ArrowRight className="h-4 w-4 text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-green-600" />
                  </div>

                  <p className="mt-5 text-sm font-medium text-gray-500">
                    {card.label}
                  </p>

                  <p className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
                    {card.value}
                  </p>

                  <p className="mt-2 text-xs leading-5 text-gray-400">
                    {card.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* =====================================================
            WEBSITE MANAGEMENT
        ====================================================== */}

        <div className="mt-10">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-gray-900">
              Website Management
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Control the content and information displayed
              across your storefront.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {managementCards.map((card) => {
              const Icon = card.icon;

              return (
                <Link
                  key={card.title}
                  href={card.href}
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-2xl
                    border
                    border-gray-100
                    bg-white
                    p-6
                    shadow-sm
                    transition-all
                    duration-200
                    hover:-translate-y-1
                    hover:border-green-100
                    hover:shadow-lg
                  "
                >
                  <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-green-50 transition-transform duration-300 group-hover:scale-125" />

                  <div className="relative flex items-start gap-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700 transition-colors group-hover:bg-green-700 group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {card.title}
                        </h3>

                        <ArrowRight className="h-5 w-5 shrink-0 text-gray-300 transition-all group-hover:translate-x-1 group-hover:text-green-600" />
                      </div>

                      <p className="mt-2 max-w-lg text-sm leading-6 text-gray-500">
                        {card.description}
                      </p>

                      <p className="mt-4 text-sm font-semibold text-green-700">
                        Manage {card.title}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* =====================================================
            QUICK ACTIONS
        ====================================================== */}

        <div className="mt-10 rounded-2xl border border-green-100 bg-green-50/70 p-6 sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-green-700">
                Quick Access
              </p>

              <h2 className="mt-1 text-xl font-bold text-green-950">
                Keep your storefront up to date
              </h2>

              <p className="mt-1 text-sm text-green-800/70">
                Add products, update content and manage customer activity.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/admin/products/new"
                className="
                  inline-flex
                  items-center
                  justify-center
                  rounded-xl
                  bg-green-800
                  px-5
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  shadow-sm
                  transition
                  hover:bg-green-900
                "
              >
                Add Product
              </Link>

              <Link
                href="/admin/about"
                className="
                  inline-flex
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-green-200
                  bg-white
                  px-5
                  py-2.5
                  text-sm
                  font-semibold
                  text-green-800
                  transition
                  hover:bg-green-100
                "
              >
                Edit About Us
              </Link>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}