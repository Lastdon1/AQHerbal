import Image from "next/image";
import Link from "next/link";

import pool from "@/lib/db";

type SiteSettings = {
  whatsapp_number: string | null;
  contact_number: string | null;
  email: string | null;
};

/* ============================================================
   LOAD SITE SETTINGS
============================================================ */

async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const result = await pool.query(`
      SELECT
        whatsapp_number,
        contact_number,
        email
      FROM site_settings
      WHERE id = 1
      LIMIT 1
    `);

    if (result.rows.length === 0) {
      return {
        whatsapp_number: null,
        contact_number: null,
        email: null,
      };
    }

    return {
      whatsapp_number:
        result.rows[0].whatsapp_number ?? null,

      contact_number:
        result.rows[0].contact_number ?? null,

      email:
        result.rows[0].email ?? null,
    };
  } catch (error) {
    console.error(
      "Footer site settings error:",
      error
    );

    return {
      whatsapp_number: null,
      contact_number: null,
      email: null,
    };
  }
}

/* ============================================================
   FOOTER
============================================================ */

export default async function Footer() {
  const settings =
    await getSiteSettings();

  return (
    <footer className="bg-green-900 text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div
          className="
            grid
            grid-cols-1
            gap-10
            divide-y
            divide-white/20
            md:grid-cols-2
            md:divide-y-0
            md:divide-x
            md:divide-white/20
            lg:grid-cols-4
          "
        >
          {/* =====================================================
              BRAND
          ====================================================== */}

          <div>
            <Link
              href="/"
              className="mb-5 flex items-center gap-3"
            >
              <Image
                src="/logos/logo.webp"
                alt="ISACO"
                width={60}
                height={60}
                priority={false}
              />

              <div>
                <h2 className="text-center text-2xl font-bold text-white">
                  آئی ساکو
                </h2>

                <p className="text-sm text-green-100">
                  Herbal Store
                </p>
              </div>
            </Link>

            <p className="text-sm leading-7 text-green-100">
              Inspired by Tibb-e-Nabawi ﷺ,
              Trusted for Wellness.
              Natural herbal solutions rooted in
              tradition, purity and quality.
            </p>
          </div>

          {/* =====================================================
              QUICK LINKS
          ====================================================== */}

          <div>
            <h3 className="mb-5 text-lg font-semibold">
              Quick Links
            </h3>

            <ul className="space-y-3 text-sm text-green-100">
              <li>
                <Link
                  href="/"
                  className="transition-colors hover:text-white"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="/about"
                  className="transition-colors hover:text-white"
                >
                  About ISACO
                </Link>
              </li>

              <li>
                <Link
                  href="/store"
                  className="transition-colors hover:text-white"
                >
                  Store
                </Link>
              </li>

              <li>
                <Link
                  href="/mashora"
                  className="transition-colors hover:text-white"
                >
                  Mashora
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="transition-colors hover:text-white"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* =====================================================
              CATEGORIES
          ====================================================== */}

          <div>
            <h3 className="mb-5 text-lg font-semibold">
              Categories
            </h3>

            <ul className="space-y-3 text-sm text-green-100">
              <li>
                <Link
                  href="/herbs"
                  className="transition-colors hover:text-white"
                >
                  Herbs
                </Link>
              </li>

              <li>
                <Link
                  href="/murabba-jat"
                  className="transition-colors hover:text-white"
                >
                  Murabba Jat
                </Link>
              </li>

              <li>
                <Link
                  href="/nuskhajat"
                  className="transition-colors hover:text-white"
                >
                  Nuskhajat
                </Link>
              </li>

              <li>
                <Link
                  href="/health-concerns"
                  className="transition-colors hover:text-white"
                >
                  Health Concerns
                </Link>
              </li>

              <li>
                <Link
                  href="/store"
                  className="transition-colors hover:text-white"
                >
                  All Products
                </Link>
              </li>
            </ul>
          </div>

          {/* =====================================================
              CONTACT
          ====================================================== */}

          <div>
            <h3 className="mb-5 text-lg font-semibold">
              Contact
            </h3>

            <ul className="space-y-3 text-sm text-green-100">

              {/* ==================================================
                  WHATSAPP
              ================================================== */}

              {settings.whatsapp_number && (
                <li>
                  📞 WhatsApp:{" "}
                  {settings.whatsapp_number}
                </li>
              )}

              {/* ==================================================
                  CONTACT NUMBER
              ================================================== */}

              {settings.contact_number && (
                <li>
                  ☎ Contact:{" "}
                  {settings.contact_number}
                </li>
              )}

              {/* ==================================================
                  EMAIL
              ================================================== */}

              {settings.email && (
                <li>
                  ✉ Email:{" "}
                  {settings.email}
                </li>
              )}

              {/* ==================================================
                  FALLBACK
              ================================================== */}

              {!settings.whatsapp_number &&
                !settings.contact_number &&
                !settings.email && (
                  <li>
                    🌿 Natural Wellness Store
                  </li>
                )}

              {(
                settings.whatsapp_number ||
                settings.contact_number ||
                settings.email
              ) && (
                <li>
                  🌿 Natural Wellness Store
                </li>
              )}

            </ul>
          </div>
        </div>
      </div>

      {/* ==========================================================
          BOTTOM BAR
      =========================================================== */}

      <div
        className="
          border-t
          border-green-800
          py-5
          text-center
          text-sm
          text-green-100
        "
      >
        © {new Date().getFullYear()} ISACO آئی ساکو.
        All rights reserved.
      </div>
    </footer>
  );
}