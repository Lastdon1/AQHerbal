"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

import { products } from "@/constants/products";

/* ============================================================
   TYPES
============================================================ */

type SearchLanguage = "en" | "ur";

type SearchAreaProps = {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  language: SearchLanguage;
  onProductClick: () => void;
};

/* ============================================================
   NORMALIZE SEARCH TEXT
============================================================ */

function normalizeText(text: string = "") {
  return text
    .normalize("NFKC")
    .replace(/[\u064B-\u065F\u0670]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

/* ============================================================
   SEARCH AREA
============================================================ */

function SearchArea({
  search,
  setSearch,
  language,
  onProductClick,
}: SearchAreaProps) {
  const isUrdu = language === "ur";

  /* ==========================================================
     SEARCH RESULTS
  ========================================================== */

  const query = normalizeText(search);

  const results = query
    ? products.filter((product) => {
        /* ====================================================
           URDU SEARCH
        ==================================================== */

        if (isUrdu) {
          const urduName = normalizeText(
            product.nameUrdu || ""
          );

          const urduDescription = normalizeText(
            product.descriptionUrdu || ""
          );

          return (
            urduName.includes(query) ||
            urduDescription.includes(query)
          );
        }

        /* ====================================================
           ENGLISH SEARCH
        ==================================================== */

        const name = normalizeText(
          product.name || ""
        );

        const slug = normalizeText(
          product.slug || ""
        );

        const category = normalizeText(
          product.category || ""
        );

        const description = normalizeText(
          product.description || ""
        );

        const healthConcerns = normalizeText(
          product.healthConcerns?.join(" ") || ""
        );

        return (
          name.includes(query) ||
          slug.includes(query) ||
          category.includes(query) ||
          description.includes(query) ||
          healthConcerns.includes(query)
        );
      })
    : [];

  /* ==========================================================
     CLEAR SEARCH
  ========================================================== */

  const clearSearch = () => {
    setSearch("");
  };

  return (
    <div className="relative w-full min-w-0">
      {/* ======================================================
          SEARCH INPUT
      ======================================================= */}

      <div className="relative min-w-0">
        <Search
          size={18}
          className={`
            pointer-events-none
            absolute
            top-1/2
            z-10
            -translate-y-1/2
            text-gray-400
            ${
              isUrdu
                ? "right-4"
                : "left-4"
            }
          `}
        />

        <input
          type="text"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
            }
          }}
          placeholder={
            isUrdu
              ? "مصنوعات تلاش کریں"
              : "Search products"
          }
          dir={isUrdu ? "rtl" : "ltr"}
          lang={isUrdu ? "ur" : "en"}
          autoComplete="off"
          spellCheck={false}
          className={`
            h-12
            w-full
            min-w-0
            rounded-full
            border
            border-gray-200
            bg-gray-50
            text-sm
            text-gray-800
            outline-none
            transition
            focus:border-green-600
            focus:bg-white
            focus:ring-2
            focus:ring-green-100
            ${
              isUrdu
                ? "pl-12 pr-11 text-right"
                : "pl-11 pr-12 text-left"
            }
          `}
        />

        {/* ==================================================
            CLEAR BUTTON
        =================================================== */}

        {search && (
          <button
            type="button"
            onClick={clearSearch}
            aria-label="Clear search"
            className={`
              absolute
              top-1/2
              flex
              h-8
              w-8
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              text-gray-400
              transition
              hover:bg-gray-100
              hover:text-gray-700
              ${
                isUrdu
                  ? "left-3"
                  : "right-3"
              }
            `}
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* ======================================================
          SEARCH RESULTS
      ======================================================= */}

      {search.trim() && (
        <div
          className="
            absolute
            left-0
            right-0
            top-full
            z-[200]
            mt-2
            max-h-[420px]
            overflow-y-auto
            overflow-x-hidden
            rounded-2xl
            border
            border-gray-100
            bg-white
            p-2
            shadow-2xl
          "
        >
          {results.length > 0 ? (
            <>
              {/* Result Count */}

              <div
                dir={isUrdu ? "rtl" : "ltr"}
                className={`
                  px-3
                  pb-2
                  pt-1
                  text-xs
                  text-gray-400
                  ${
                    isUrdu
                      ? "text-right"
                      : "text-left"
                  }
                `}
              >
                {results.length}{" "}
                {isUrdu
                  ? "نتائج"
                  : results.length === 1
                    ? "result"
                    : "results"}
              </div>

              {/* Product Results */}

              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  onClick={onProductClick}
                  className="
                    flex
                    min-w-0
                    items-center
                    gap-3
                    rounded-xl
                    p-3
                    transition
                    hover:bg-green-50
                  "
                >
                  {/* Product Image */}

                  <div
                    className="
                      relative
                      h-14
                      w-14
                      shrink-0
                      overflow-hidden
                      rounded-lg
                      bg-gray-50
                    "
                  >
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      sizes="56px"
                      className="
                        object-contain
                        p-1
                      "
                    />
                  </div>

                  {/* Product Details */}

                  <div className="min-w-0 flex-1">
                    {/* Urdu Product Name */}

                    <p
                      dir="rtl"
                      className="
                        truncate
                        text-right
                        text-sm
                        font-semibold
                        text-green-800
                      "
                    >
                      {product.nameUrdu}
                    </p>

                    {/* English Product Name */}

                    <p
                      dir="ltr"
                      className="
                        truncate
                        text-left
                        text-sm
                        font-medium
                        text-gray-800
                      "
                    >
                      {product.name}
                    </p>

                    {/* Price */}

                    <p
                      dir="ltr"
                      className="
                        mt-1
                        text-xs
                        text-gray-500
                      "
                    >
                      Rs.{" "}
                      {Number(
                        product.price
                      ).toLocaleString()}
                    </p>
                  </div>
                </Link>
              ))}
            </>
          ) : (
            /* ==================================================
               NO RESULTS
            =================================================== */

            <div
              className="
                px-4
                py-9
                text-center
              "
            >
              <p
                dir={isUrdu ? "rtl" : "ltr"}
                className="
                  text-sm
                  font-semibold
                  text-gray-700
                "
              >
                {isUrdu
                  ? "کوئی مصنوعات نہیں ملیں"
                  : "No products found"}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   MAIN HEADER
============================================================ */

export default function Header() {
  const [search, setSearch] = useState("");

  const [language, setLanguage] =
    useState<SearchLanguage>("en");

  const [searchOpen, setSearchOpen] =
    useState(false);

  /* ==========================================================
     LOAD SAVED LANGUAGE
  ========================================================== */

  useEffect(() => {
    const savedLanguage =
      localStorage.getItem(
        "site-language"
      ) as SearchLanguage | null;

    if (
      savedLanguage === "en" ||
      savedLanguage === "ur"
    ) {
      setLanguage(savedLanguage);
    }

    const handleLanguageChange = (
      event: Event
    ) => {
      const customEvent =
        event as CustomEvent<SearchLanguage>;

      if (
        customEvent.detail === "en" ||
        customEvent.detail === "ur"
      ) {
        setLanguage(
          customEvent.detail
        );

        setSearch("");
      }
    };

    window.addEventListener(
      "language-change",
      handleLanguageChange
    );

    return () => {
      window.removeEventListener(
        "language-change",
        handleLanguageChange
      );
    };
  }, []);

  /* ==========================================================
     PRODUCT CLICK
  ========================================================== */

  const handleProductClick = () => {
    setSearch("");
    setSearchOpen(false);
  };

  /* ============================================================
     HEADER
  ============================================================ */

  return (
    <header
      className="
        w-full
        min-w-0
        overflow-x-hidden
        border-b
        bg-white
      "
    >
      {/* ======================================================
          MAIN HEADER ROW
      ======================================================= */}

      <div
        className="
          mx-auto
          flex
          min-h-[82px]
          w-full
          max-w-7xl
          min-w-0
          items-center
          gap-5
          overflow-hidden
          px-3
          sm:px-6
        "
      >
        {/* ==================================================
            LOGO
        =================================================== */}

        <Link
          href="/"
          aria-label="ISACO Home"
          className="
            flex
            min-w-0
            shrink-0
            items-center
          "
        >
          <Image
            src="/logos/logo.webp"
            alt="ISACO"
            width={150}
            height={60}
            priority
            className="
              h-auto
              w-[105px]
              max-w-full
              object-contain
              sm:w-[120px]
            "
          />

          {/* =================================================
              DESKTOP BRAND TEXT
              UNCHANGED
          ================================================= */}

          <div
            className="
              hidden
              leading-tight
              sm:block
              sm:ml-3
            "
          >
            <p
              className="
                text-lg
                font-bold
                text-green-800
              "
            >
              ISACO
            </p>

            <p
              className="
                max-w-[210px]
                text-[10px]
                leading-4
                text-gray-500
              "
            >
              Inspired by Tibb-e-Nabawi (ﷺ),
              Trusted for Wellness.
            </p>
          </div>

          {/* =================================================
              MOBILE BRANDING ONLY
          ================================================= */}

          <div
            className="
              ml-2
              min-w-0
              leading-tight
              sm:hidden
            "
          >
            {/* ISACO */}

            <p
              className="
                text-sm
                font-bold
                leading-4
                text-green-800
              "
            >
              ISACO
            </p>

            {/* Urdu Brand */}

            <p
              dir="rtl"
              lang="ur"
              className="
                mt-0.5
                text-[11px]
                font-semibold
                leading-5
                text-green-800
              "
            >
              آئی ساکو
            </p>

            {/* Founder */}

            <p
              dir="rtl"
              lang="ur"
              className="
                text-[7px]
                leading-3
                text-gray-500
              "
            >
              مرحوم حکیم عبدالعلی خان رحمہ اللہ علی
            </p>

            {/* Original Founder */}

            <p
              dir="rtl"
              lang="ur"
              className="
                text-[7px]
                leading-3
                text-gray-500
              "
            >
              بانیِ مشرقی دواخانہ
            </p>
          </div>
        </Link>

        {/* ==================================================
            DESKTOP SEARCH
        =================================================== */}

        <div
          className="
            hidden
            min-w-0
            flex-1
            md:block
          "
        >
          <div
            className="
              mx-auto
              w-full
              max-w-2xl
            "
          >
            <SearchArea
              search={search}
              setSearch={setSearch}
              language={language}
              onProductClick={
                handleProductClick
              }
            />
          </div>
        </div>

        {/* ==================================================
            RIGHT ACTIONS
        =================================================== */}

        <div
          className="
            ml-auto
            flex
            shrink-0
            items-center
            justify-end
          "
        >
          {/* =================================================
              DESKTOP LOGIN
          ================================================= */}

          <Link
            href="/login"
            className="
              hidden
              items-center
              gap-1.5
              rounded-lg
              px-2
              py-2
              text-sm
              font-medium
              text-gray-700
              transition
              hover:bg-green-50
              hover:text-green-700
              sm:flex
            "
          >
            <User size={19} />

            <span>
              Login
            </span>
          </Link>

          {/* =================================================
              DESKTOP WISHLIST
          ================================================= */}

          <Link
            href="/wishlist"
            aria-label="Wishlist"
            className="
              hidden
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              text-gray-700
              transition
              hover:bg-green-50
              hover:text-green-700
              sm:flex
            "
          >
            <Heart size={20} />
          </Link>

          {/* =================================================
              DESKTOP CART
          ================================================= */}

          <Link
            href="/cart"
            aria-label="Shopping Cart"
            className="
              hidden
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              text-gray-700
              transition
              hover:bg-green-50
              hover:text-green-700
              sm:flex
            "
          >
            <ShoppingCart size={20} />
          </Link>

          {/* =================================================
              MOBILE USER
          ================================================= */}

          <Link
            href="/login"
            aria-label="Login"
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-full
              text-gray-700
              transition
              hover:bg-green-50
              hover:text-green-700
              sm:hidden
            "
          >
            <User size={21} />
          </Link>

          {/* =================================================
              MOBILE SEARCH BUTTON
          ================================================= */}

          <button
            type="button"
            onClick={() =>
              setSearchOpen(
                (value) => !value
              )
            }
            aria-label="Search"
            className="
              hidden
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-full
              text-gray-700
              transition
              hover:bg-green-50
              hover:text-green-700
              md:hidden
            "
          >
            {searchOpen ? (
              <X size={21} />
            ) : (
              <Search size={21} />
            )}
          </button>
        </div>
      </div>

      {/* ======================================================
          MOBILE SEARCH ROW
      ======================================================= */}

      {searchOpen && (
        <div
          className="
            w-full
            min-w-0
            overflow-hidden
            border-t
            bg-white
            px-3
            py-3
            sm:px-6
            md:hidden
          "
        >
          <SearchArea
            search={search}
            setSearch={setSearch}
            language={language}
            onProductClick={
              handleProductClick
            }
          />
        </div>
      )}
    </header>
  );
}
