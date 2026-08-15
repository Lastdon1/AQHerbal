"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CartItem,
  getCart,
  getCartSubtotal,
  removeFromCart,
  updateCartQuantity,
} from "@/lib/cart";

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCart = () => {
      setCart(getCart());
      setIsLoading(false);
    };

    loadCart();

    window.addEventListener("cart-updated", loadCart);

    return () => {
      window.removeEventListener("cart-updated", loadCart);
    };
  }, []);

  function handleQuantityChange(
    item: CartItem,
    quantity: number
  ) {
    const updatedCart = updateCartQuantity(
      item.product_id,
      item.variant_id,
      quantity
    );

    setCart(updatedCart);
  }

  function handleRemove(item: CartItem) {
    const updatedCart = removeFromCart(
      item.product_id,
      item.variant_id
    );

    setCart(updatedCart);
  }

  const subtotal = getCartSubtotal(cart);

  /*
   * =====================================================
   * LOADING
   * =====================================================
   */

  if (isLoading) {
    return (
      <main className="min-h-[60vh] bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex min-h-[40vh] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-gray-200 border-t-green-700" />

              <p className="mt-3 text-sm text-gray-500">
                Loading cart...
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /*
   * =====================================================
   * EMPTY CART
   * =====================================================
   */

  if (cart.length === 0) {
    return (
      <main className="min-h-[60vh] bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto flex min-h-[55vh] max-w-xl items-center justify-center">
            <div className="w-full rounded-2xl border border-gray-100 bg-[#f8faf8] px-6 py-10 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
                <svg
                  viewBox="0 0 24 24"
                  className="h-8 w-8 text-green-700"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  aria-hidden="true"
                >
                  <path
                    d="M6 7h12l1 13H5L6 7Z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  <path
                    d="M9 7a3 3 0 0 1 6 0"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <h1 className="mt-5 text-2xl font-bold text-gray-900">
                Your Cart is Empty
              </h1>

              <p
                dir="rtl"
                className="mt-1 text-sm text-gray-500"
              >
                آپ کی کارٹ خالی ہے
              </p>

              <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-gray-500">
                Looks like you haven't added any products to your
                cart yet.
              </p>

              <p
                dir="rtl"
                className="mx-auto mt-1 max-w-md text-sm leading-6 text-gray-500"
              >
                ابھی تک آپ نے اپنی کارٹ میں کوئی پروڈکٹ شامل نہیں کی۔
              </p>

              <Link
                href="/store"
                className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-green-700 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /*
   * =====================================================
   * CART
   * =====================================================
   */

  return (
    <main className="min-h-[60vh] bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

        {/* PAGE HEADER */}

        <div className="mb-7">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Shopping Cart
          </h1>

          <p
            dir="rtl"
            className="mt-1 text-left text-sm text-gray-500"
          >
            خریداری کی کارٹ
          </p>

          <p className="mt-2 text-sm text-gray-500">
            {cart.length}{" "}
            {cart.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[1fr_330px]">

          {/* =================================================
              CART ITEMS
          ================================================= */}

          <div className="space-y-3">
            {cart.map((item) => (
              <article
                key={`${item.product_id}-${item.variant_id}`}
                className="rounded-2xl border border-gray-100 bg-white p-3 shadow-sm sm:p-4"
              >
                <div className="flex gap-3 sm:gap-4">

                  {/* IMAGE */}

                  <Link
                    href={`/store/${item.slug}`}
                    className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#f8faf8] sm:h-28 sm:w-28"
                  >
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.product_name}
                        fill
                        sizes="112px"
                        className="object-contain p-2"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-gray-400">
                        No Image
                      </div>
                    )}
                  </Link>

                  {/* DETAILS */}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">

                      {/* PRODUCT NAME */}

                      <div className="min-w-0">
                        <Link
                          href={`/store/${item.slug}`}
                          className="block break-words text-sm font-semibold text-gray-900 transition hover:text-green-700 sm:text-base"
                        >
                          {item.product_name}
                        </Link>

                        {item.product_name_urdu && (
                          <p
                            dir="rtl"
                            className="mt-0.5 break-words text-left text-sm text-gray-500"
                          >
                            {item.product_name_urdu}
                          </p>
                        )}
                      </div>

                      {/* REMOVE */}

                      <button
                        type="button"
                        onClick={() => handleRemove(item)}
                        aria-label={`Remove ${item.product_name} from cart`}
                        className="shrink-0 rounded-md p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          className="h-[18px] w-[18px]"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          aria-hidden="true"
                        >
                          <path
                            d="M4 7h16"
                            strokeLinecap="round"
                          />

                          <path
                            d="M10 11v6M14 11v6"
                            strokeLinecap="round"
                          />

                          <path
                            d="M6 7l1 13h10l1-13"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />

                          <path
                            d="M9 7V4h6v3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* SIZE + PRICE */}

                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
                      <div className="text-xs text-gray-500">
                        <span className="font-medium text-gray-700">
                          Size:
                        </span>{" "}
                        {item.quantity_value} {item.unit}
                      </div>

                      <div className="text-sm font-bold text-green-700">
                        Rs{" "}
                        {Number(item.price).toLocaleString("en-PK")}
                      </div>
                    </div>

                    {/* QUANTITY + SUBTOTAL */}

                    <div className="mt-3 flex items-center justify-between gap-3">

                      {/* QUANTITY */}

                      <div className="flex h-9 items-center overflow-hidden rounded-lg border border-gray-200 bg-white">
                        <button
                          type="button"
                          onClick={() =>
                            handleQuantityChange(
                              item,
                              Math.max(1, item.quantity - 1)
                            )
                          }
                          aria-label="Decrease quantity"
                          className="flex h-full w-8 items-center justify-center text-base text-gray-600 transition hover:bg-gray-50 hover:text-green-700"
                        >
                          −
                        </button>

                        <span className="flex h-full min-w-[34px] items-center justify-center border-x border-gray-200 text-xs font-semibold text-gray-900">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            handleQuantityChange(
                              item,
                              item.quantity + 1
                            )
                          }
                          aria-label="Increase quantity"
                          className="flex h-full w-8 items-center justify-center text-base text-gray-600 transition hover:bg-gray-50 hover:text-green-700"
                        >
                          +
                        </button>
                      </div>

                      {/* ITEM SUBTOTAL */}

                      <div className="text-right">
                        <p className="text-[10px] text-gray-400">
                          Subtotal
                        </p>

                        <p className="text-sm font-bold text-gray-900">
                          Rs{" "}
                          {(
                            Number(item.price) *
                            Number(item.quantity)
                          ).toLocaleString("en-PK")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* =================================================
              SUMMARY
          ================================================= */}

          <aside className="lg:sticky lg:top-24">
            <div className="rounded-2xl border border-gray-100 bg-[#f8faf8] p-5 shadow-sm">

              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Cart Summary
                </h2>

                <p
                  dir="rtl"
                  className="mt-0.5 text-left text-sm text-gray-500"
                >
                  کارٹ کا خلاصہ
                </p>
              </div>

              <div className="mt-5 space-y-3 border-b border-gray-200 pb-4">

                {/* ITEMS */}

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    Items
                  </span>

                  <span className="font-medium text-gray-800">
                    {cart.reduce(
                      (total, item) =>
                        total + Number(item.quantity),
                      0
                    )}
                  </span>
                </div>

                {/* SUBTOTAL */}

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    Subtotal
                  </span>

                  <span className="font-semibold text-gray-900">
                    Rs{" "}
                    {subtotal.toLocaleString("en-PK")}
                  </span>
                </div>

                {/* DELIVERY */}

                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-gray-500">
                    Delivery
                  </span>

                  <span className="text-right font-medium text-green-700">
                    Calculated at checkout
                  </span>
                </div>
              </div>

              {/* TOTAL */}

              <div className="mt-4 flex items-center justify-between">

                <div>
                  <p className="text-base font-bold text-gray-900">
                    Total
                  </p>

                  <p
                    dir="rtl"
                    className="text-xs text-gray-500"
                  >
                    کل رقم
                  </p>
                </div>

                <p className="text-xl font-bold text-green-700">
                  Rs{" "}
                  {subtotal.toLocaleString("en-PK")}
                </p>
              </div>

              {/* CHECKOUT */}

              <Link
                href="/checkout"
                className="mt-5 flex h-11 w-full items-center justify-center rounded-lg bg-green-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800"
              >
                Proceed to Checkout
              </Link>

              {/* CONTINUE SHOPPING */}

              <Link
                href="/store"
                className="mt-2 flex h-10 w-full items-center justify-center rounded-lg border border-gray-200 bg-white px-5 text-xs font-semibold text-gray-700 transition hover:border-green-400 hover:text-green-700"
              >
                Continue Shopping
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}