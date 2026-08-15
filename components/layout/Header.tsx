"use client";

import Image from "next/image";
import Link from "next/link";

import {
  Search,
  ShoppingCart,
  User,
  X,
  LogOut,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import {
  getCartItemCount,
  onCartUpdated,
} from "@/lib/cart";

/* ============================================================
   TYPES
============================================================ */

type Language = "en" | "ur";

type SearchProduct = {
  id: number;
  name: string;
  name_urdu: string | null;
  slug: string;
  image: string | null;
  price: number | string;
};

type SiteSettings = {
  logo_text_urdu: string | null;
  tagline_urdu: string | null;
};

/* ============================================================
   SEARCH BOX
============================================================ */

function SearchBox({
  language,
  search,
  setSearch,
  onProductClick,
}: {
  language: Language;
  search: string;
  setSearch: React.Dispatch<
    React.SetStateAction<string>
  >;
  onProductClick: () => void;
}) {
  const isUrdu = language === "ur";

  const [results, setResults] =
    useState<SearchProduct[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [hasSearched, setHasSearched] =
    useState(false);

  /* ==========================================================
     SEARCH API
  ========================================================== */

  useEffect(() => {
    const query = search.trim();

    if (!query) {
      setResults([]);
      setLoading(false);
      setHasSearched(false);
      return;
    }

    let cancelled = false;

    const timer = window.setTimeout(
      async () => {
        try {
          setLoading(true);
          setHasSearched(true);

          const params =
            new URLSearchParams();

          params.set("q", query);
          params.set(
            "language",
            language
          );

          const response =
            await fetch(
              `/api/products/search?${params.toString()}`,
              {
                method: "GET",
                cache: "no-store",
              }
            );

          if (!response.ok) {
            throw new Error(
              "Search request failed."
            );
          }

          const data =
            await response.json();

          if (cancelled) {
            return;
          }

          setResults(
            Array.isArray(
              data?.products
            )
              ? data.products
              : []
          );
        } catch (error) {
          console.error(
            "Search error:",
            error
          );

          if (!cancelled) {
            setResults([]);
          }
        } finally {
          if (!cancelled) {
            setLoading(false);
          }
        }
      },
      250
    );

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [search, language]);

  const showResults =
    search.trim().length > 0;

  return (
    <div className="relative w-full">
      {/* ======================================================
          SEARCH INPUT
      ======================================================= */}

      <div className="relative">
        <Search
          size={18}
          className="
            pointer-events-none
            absolute
            top-1/2
            z-10
            -translate-y-1/2
            text-green-700
            ltr:left-4
            rtl:right-4
          "
        />

        <input
          type="text"
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value
            )
          }
          placeholder={
            isUrdu
              ? "مصنوعات تلاش کریں"
              : "Search products"
          }
          dir={
            isUrdu
              ? "rtl"
              : "ltr"
          }
          lang={
            isUrdu
              ? "ur"
              : "en"
          }
          autoComplete="off"
          spellCheck={false}
          className={`h-12 w-full rounded-full border border-gray-600 bg-gray-50 text-sm text-gray-800 outline-none transition focus:border-green-600 focus:bg-white focus:ring-2 focus:ring-green-100 ${
            isUrdu
              ? "pl-12 pr-11 text-right"
              : "pl-11 pr-12 text-left"
          }`}
        />

        {search && (
          <button
            type="button"
            onClick={() =>
              setSearch("")
            }
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
              hover:bg-gray-100
              hover:text-gray-700
              ltr:right-3
              rtl:left-3
            `}
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* ======================================================
          SEARCH RESULTS
      ======================================================= */}

      {showResults && (
        <div className="absolute left-0 right-0 top-full z-[200] mt-2 max-h-[420px] overflow-y-auto rounded-2xl border border-gray-100 bg-white p-2 shadow-2xl">
          {/* Loading */}

          {loading && (
            <div
              dir={
                isUrdu
                  ? "rtl"
                  : "ltr"
              }
              className="px-4 py-8 text-center text-sm text-gray-500"
            >
              {isUrdu
                ? "تلاش جاری ہے..."
                : "Searching..."}
            </div>
          )}

          {/* Results */}

          {!loading &&
            results.length > 0 && (
              <>
                <div
                  dir={
                    isUrdu
                      ? "rtl"
                      : "ltr"
                  }
                  className={`px-3 pb-2 pt-1 text-xs text-gray-400 ${
                    isUrdu
                      ? "text-right"
                      : "text-left"
                  }`}
                >
                  {results.length}{" "}
                  {isUrdu
                    ? "نتائج"
                    : results.length ===
                        1
                      ? "result"
                      : "results"}
                </div>

                {results.map(
                  (product) => (
                    <Link
                      key={
                        product.id
                      }
                      href={`/product/${product.slug}`}
                      onClick={
                        onProductClick
                      }
                      className="flex items-center gap-3 rounded-xl p-3 transition hover:bg-green-50"
                    >
                      {/* Image */}

                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-50">
                        {product.image ? (
                          <Image
                            src={
                              product.image
                            }
                            alt={
                              product.name
                            }
                            fill
                            sizes="56px"
                            className="object-contain p-1"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-[10px] text-gray-400">
                            No Image
                          </div>
                        )}
                      </div>

                      {/* Content */}

                      <div className="min-w-0 flex-1">
                        <p
                          dir="rtl"
                          className="truncate text-right text-sm font-semibold text-green-800"
                        >
                          {product.name_urdu ||
                            product.name}
                        </p>

                        <p
                          dir="ltr"
                          className="truncate text-left text-sm font-medium text-gray-800"
                        >
                          {product.name}
                        </p>

                        <p
                          dir="ltr"
                          className="mt-1 text-xs text-gray-500"
                        >
                          Rs.{" "}
                          {Number(
                            product.price
                          ).toLocaleString(
                            "en-PK"
                          )}
                        </p>
                      </div>
                    </Link>
                  )
                )}
              </>
            )}

          {/* No results */}

          {!loading &&
            hasSearched &&
            results.length === 0 && (
              <div className="px-4 py-9 text-center">
                <p
                  dir={
                    isUrdu
                      ? "rtl"
                      : "ltr"
                  }
                  className="text-sm font-semibold text-gray-600"
                >
                  {isUrdu
                    ? "کوئی مصنوعات نہیں ملیں"
                    : "No products found"}
                </p>

                <p
                  dir={
                    isUrdu
                      ? "rtl"
                      : "ltr"
                  }
                  className="mt-1 text-xs text-gray-400"
                >
                  {isUrdu
                    ? "براہ کرم مختلف الفاظ استعمال کریں"
                    : "Try a different search term"}
                </p>
              </div>
            )}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   CUSTOMER SESSION
============================================================ */

async function getCustomerSessionState() {
  try {
    const response =
      await fetch(
        "/api/account/session",
        {
          method: "GET",
          cache: "no-store",
        }
      );

    if (!response.ok) {
      return {
        loggedIn: false,
        name: "",
      };
    }

    const data =
      await response.json();

    const loggedIn =
      data?.loggedIn === true;

    return {
      loggedIn,
      name:
        loggedIn &&
        typeof data?.customer
          ?.name === "string"
          ? data.customer.name
          : "",
    };
  } catch {
    return {
      loggedIn: false,
      name: "",
    };
  }
}

/* ============================================================
   MAIN HEADER
============================================================ */

export default function Header() {
  const pathname =
    usePathname();

  const router =
    useRouter();

  const isAdminPage =
    pathname.startsWith(
      "/admin"
    );

  /* ==========================================================
     SEARCH
  ========================================================== */

  const [search, setSearch] =
    useState("");

  /*
   * IMPORTANT:
   *
   * Always start with the same value during SSR
   * and the first client render.
   *
   * localStorage is read only after hydration.
   */
  const [language, setLanguage] =
    useState<Language>("en");

  const [
    mobileSearchOpen,
    setMobileSearchOpen,
  ] = useState(false);

  /* ==========================================================
     LOAD SAVED LANGUAGE
  ========================================================== */

  useEffect(() => {
    const savedLanguage =
      localStorage.getItem(
        "site-language"
      );

    if (
      savedLanguage === "en" ||
      savedLanguage === "ur"
    ) {
      setLanguage(
        savedLanguage
      );
    }
  }, []);

  /* ==========================================================
     SITE SETTINGS
  ========================================================== */

  const [
    siteSettings,
    setSiteSettings,
  ] = useState<SiteSettings>({
    logo_text_urdu:
      "مرحوم حکیم عبدالعلی خان رحمہ اللہ علیہ",

    tagline_urdu:
      "بانیِ مشرقی دواخانہ",
  });

  /* ==========================================================
     LOAD SITE SETTINGS
  ========================================================== */

  useEffect(() => {
    let mounted = true;

    async function loadSiteSettings() {
      try {
        const response =
          await fetch(
            "/api/admin/site-settings",
            {
              method: "GET",
              cache: "no-store",
            }
          );

        if (!response.ok) {
          return;
        }

        const data =
          await response.json();

        if (!mounted) {
          return;
        }

        setSiteSettings({
          logo_text_urdu:
            data?.logo_text_urdu ||
            "مرحوم حکیم عبدالعلی خان رحمہ اللہ علیہ",

          tagline_urdu:
            data?.tagline_urdu ||
            "بانیِ مشرقی دواخانہ",
        });
      } catch {
        // Keep defaults.
      }
    }

    loadSiteSettings();

    return () => {
      mounted = false;
    };
  }, []);

  /* ==========================================================
     CART
  ========================================================== */

  const [cartCount, setCartCount] =
    useState(0);

  /* ==========================================================
     CUSTOMER SESSION
  ========================================================== */

  const [
    customerLoggedIn,
    setCustomerLoggedIn,
  ] = useState(false);

  const [
    customerName,
    setCustomerName,
  ] = useState("");

  const [
    customerSessionLoading,
    setCustomerSessionLoading,
  ] = useState(
    !isAdminPage
  );

  /* ==========================================================
     ADMIN SESSION
  ========================================================== */

  const [
    adminLoggedIn,
    setAdminLoggedIn,
  ] = useState(false);

  const [
    adminSessionLoading,
    setAdminSessionLoading,
  ] = useState(
    isAdminPage
  );

  /* ==========================================================
     CUSTOMER SESSION
  ========================================================== */

  useEffect(() => {
    if (isAdminPage) {
      return;
    }

    let mounted = true;

    const checkCustomerSession =
      async () => {
        const session =
          await getCustomerSessionState();

        if (!mounted) {
          return;
        }

        setCustomerLoggedIn(
          session.loggedIn
        );

        setCustomerName(
          session.name
        );

        setCustomerSessionLoading(
          false
        );
      };

    checkCustomerSession();

    const handleCustomerAuthChanged =
      () => {
        checkCustomerSession();
      };

    window.addEventListener(
      "customer-auth-changed",
      handleCustomerAuthChanged
    );

    return () => {
      mounted = false;

      window.removeEventListener(
        "customer-auth-changed",
        handleCustomerAuthChanged
      );
    };
  }, [isAdminPage]);

  /* ==========================================================
     ADMIN SESSION
  ========================================================== */

  useEffect(() => {
    if (!isAdminPage) {
      return;
    }

    let mounted = true;

    async function checkAdminSession() {
      try {
        const response =
          await fetch(
            "/api/auth/session",
            {
              method: "GET",
              cache: "no-store",
            }
          );

        if (!mounted) {
          return;
        }

        if (!response.ok) {
          setAdminLoggedIn(
            false
          );
          return;
        }

        const data =
          await response.json();

        setAdminLoggedIn(
          data?.loggedIn === true
        );
      } catch {
        if (mounted) {
          setAdminLoggedIn(
            false
          );
        }
      } finally {
        if (mounted) {
          setAdminSessionLoading(
            false
          );
        }
      }
    }

    checkAdminSession();

    return () => {
      mounted = false;
    };
  }, [isAdminPage]);

  /* ==========================================================
     LANGUAGE CHANGE EVENT
  ========================================================== */

  useEffect(() => {
    const handleLanguageChange =
      (event: Event) => {
        const customEvent =
          event as CustomEvent<Language>;

        if (
          customEvent.detail ===
            "en" ||
          customEvent.detail ===
            "ur"
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
     CART
  ========================================================== */

  useEffect(() => {
    const updateCartCount =
      () => {
        setCartCount(
          getCartItemCount()
        );
      };

    updateCartCount();

    const unsubscribe =
      onCartUpdated(
        updateCartCount
      );

    window.addEventListener(
      "storage",
      updateCartCount
    );

    return () => {
      unsubscribe();

      window.removeEventListener(
        "storage",
        updateCartCount
      );
    };
  }, []);

  /* ==========================================================
     PRODUCT CLICK
  ========================================================== */

  const handleProductClick =
    useCallback(() => {
      setSearch("");
      setMobileSearchOpen(
        false
      );
    }, []);

  /* ==========================================================
     MOBILE SEARCH
  ========================================================== */

  const toggleMobileSearch =
    useCallback(() => {
      setMobileSearchOpen(
        (value) => !value
      );
    }, []);

  /* ==========================================================
     ADMIN LOGOUT
  ========================================================== */

  const handleAdminLogout =
    useCallback(async () => {
      try {
        await fetch(
          "/api/auth/logout",
          {
            method: "POST",
          }
        );
      } catch {
        // Continue logout navigation.
      } finally {
        setAdminLoggedIn(
          false
        );

        router.push("/login");
      }
    }, [router]);

  /* ==========================================================
     HEADER
  ========================================================== */

  return (
    <header className="w-full border-b bg-white">
      <div className="mx-auto flex min-h-[78px] max-w-7xl items-center gap-5 px-6">

        {/* ==================================================
            LOGO
        =================================================== */}

        <Link
          href="/"
          aria-label="آئی ساکو ہوم"
          className="flex shrink-0 items-center gap-3"
        >
          <Image
            src="/logos/logo.webp"
            alt="آئی ساکو"
            width={140}
            height={50}
            priority
            className="h-[45px] w-[110px] object-contain sm:h-[65px]"
          />

          <div className="hidden text-center sm:block">
            <p
              dir="rtl"
              lang="ur"
              className="text-center text-xl font-bold leading-tight text-green-800"
            >
              آئی ساکو
            </p>

            <p
              dir="rtl"
              lang="ur"
              className="mt-1 max-w-[270px] text-center text-[14px] leading-4 text-gray-800"
            >
              {siteSettings.logo_text_urdu}

              <br />

              {siteSettings.tagline_urdu}
            </p>
          </div>
        </Link>

        {/* ==================================================
            DESKTOP SEARCH
        =================================================== */}

        {!isAdminPage && (
          <div className="hidden min-w-0 flex-1 md:block">
            <div className="mx-auto max-w-2xl">
              <SearchBox
                language={language}
                search={search}
                setSearch={setSearch}
                onProductClick={
                  handleProductClick
                }
              />
            </div>
          </div>
        )}

        {/* ==================================================
            RIGHT SIDE
        =================================================== */}

        <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">

          {/* ACCOUNT */}

          {isAdminPage ? (
            !adminSessionLoading &&
            adminLoggedIn && (
              <button
                type="button"
                onClick={
                  handleAdminLogout
                }
                aria-label="Admin Logout"
                className="flex h-10 items-center justify-center gap-1.5 rounded-lg px-3 text-sm font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700"
              >
                <LogOut size={19} />

                <span className="hidden sm:inline">
                  Logout
                </span>
              </button>
            )
          ) : (
            !customerSessionLoading && (
              <Link
                href={
                  customerLoggedIn
                    ? "/account"
                    : "/account/login"
                }
                aria-label={
                  customerLoggedIn
                    ? "My Account"
                    : "Customer Login"
                }
                className="flex h-10 items-center justify-center gap-1.5 rounded-lg px-3 text-sm font-medium text-gray-700 transition hover:bg-green-50 hover:text-green-700"
              >
                <User size={19} />

                <span className="hidden sm:inline">
                  {customerLoggedIn
                    ? customerName ||
                      "My Account"
                    : "Login"}
                </span>
              </Link>
            )
          )}

          {/* CART */}

          {!isAdminPage && (
            <Link
              href="/cart"
              aria-label={
                cartCount > 0
                  ? `Shopping Cart, ${cartCount} items`
                  : "Shopping Cart"
              }
              className={`relative flex h-10 w-10 items-center justify-center rounded-full transition ${
                cartCount > 0
                  ? "bg-green-50 text-green-700 hover:bg-green-100"
                  : "text-gray-700 hover:bg-green-50 hover:text-green-700"
              }`}
            >
              <ShoppingCart
                size={20}
                strokeWidth={
                  cartCount > 0
                    ? 2.4
                    : 2
                }
                className={
                  cartCount > 0
                    ? "fill-green-700"
                    : ""
                }
              />

              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold leading-none text-white shadow-sm ring-2 ring-white">
                  {cartCount > 99
                    ? "99+"
                    : cartCount}
                </span>
              )}
            </Link>
          )}

          {/* MOBILE SEARCH */}

          {!isAdminPage && (
            <button
              type="button"
              onClick={
                toggleMobileSearch
              }
              aria-label="Search"
              className="flex h-10 w-10 items-center justify-center rounded-full text-gray-700 transition hover:bg-green-50 hover:text-green-700 md:hidden"
            >
              {mobileSearchOpen ? (
                <X size={21} />
              ) : (
                <Search size={21} />
              )}
            </button>
          )}
        </div>
      </div>

      {/* ======================================================
          MOBILE SEARCH
      ======================================================= */}

      {mobileSearchOpen &&
        !isAdminPage && (
          <div className="border-t bg-white px-6 py-3 md:hidden">
            <SearchBox
              language={language}
              search={search}
              setSearch={setSearch}
              onProductClick={
                handleProductClick
              }
            />
          </div>
        )}
    </header>
  );
}