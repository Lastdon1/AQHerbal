"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
  CartItem,
  getCart,
  getCartSubtotal,
  clearCart,
  removeFromCart,
  updateCartQuantity,
} from "@/lib/cart";

type PaymentMethod =
  | "easypaisa"
  | "jazzcash"
  | "cod";

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("cod");

  const [customerName, setCustomerName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [address, setAddress] =
    useState("");

  const [city, setCity] =
    useState("");

  const [orderNotes, setOrderNotes] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  /* ============================================================
     LOAD CART
  ============================================================ */

  useEffect(() => {
    const loadedCart = getCart();

    setCart(loadedCart);
    setIsLoading(false);
  }, []);

  /* ============================================================
     CART CONTROLS
  ============================================================ */

  function handleQuantityChange(
    item: CartItem,
    quantity: number
  ) {
    const updatedCart =
      updateCartQuantity(
        item.product_id,
        item.variant_id,
        quantity
      );

    setCart(updatedCart);
  }

  function handleRemove(item: CartItem) {
    const updatedCart =
      removeFromCart(
        item.product_id,
        item.variant_id
      );

    setCart(updatedCart);
  }

  /* ============================================================
     TOTALS
  ============================================================ */

  const subtotal = getCartSubtotal(cart);

  const delivery = 0;

  const total = subtotal + delivery;

  const totalItems = cart.reduce(
    (sum, item) =>
      sum + Number(item.quantity),
    0
  );

  /* ============================================================
     LOADING
  ============================================================ */

  if (isLoading) {
    return (
      <main className="min-h-[60vh] bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex min-h-[40vh] items-center justify-center">
            <div className="text-center">
              <div
                className="
                  mx-auto
                  h-7
                  w-7
                  animate-spin
                  rounded-full
                  border-2
                  border-gray-200
                  border-t-green-700
                "
              />

              <p className="mt-3 text-sm text-gray-500">
                Loading checkout...
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* ============================================================
     EMPTY CART
  ============================================================ */

  if (cart.length === 0) {
    return (
      <main className="min-h-[60vh] bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto flex min-h-[55vh] max-w-xl items-center justify-center">
            <div
              className="
                w-full
                rounded-2xl
                border
                border-gray-100
                bg-[#f8faf8]
                px-6
                py-10
                text-center
                shadow-sm
              "
            >
              <div
                className="
                  mx-auto
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-full
                  bg-green-50
                "
              >
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
                Please add products to your cart before
                proceeding to checkout.
              </p>

              <p
                dir="rtl"
                className="mx-auto mt-1 max-w-md text-sm leading-6 text-gray-500"
              >
                چیک آؤٹ سے پہلے اپنی کارٹ میں
                پروڈکٹس شامل کریں۔
              </p>

              <Link
                href="/store"
                className="
                  mt-6
                  inline-flex
                  h-11
                  items-center
                  justify-center
                  rounded-lg
                  bg-green-700
                  px-6
                  text-sm
                  font-semibold
                  text-white
                  shadow-sm
                  transition
                  hover:bg-green-800
                "
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* ============================================================
     PLACE ORDER
  ============================================================ */

  async function handlePlaceOrder(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    if (cart.length === 0) {
      setErrorMessage(
        "Your cart is empty. Please add a product before placing an order."
      );

      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      /*
       * IMPORTANT:
       *
       * The product image is now included in every
       * order item.
       *
       * This is required so the order details page
       * can display the product image after checkout.
       */
      const orderItems = cart.map((item) => ({
        product_id: Number(
          item.product_id
        ),

        variant_id: Number(
          item.variant_id
        ),

        product_name:
          item.product_name,

        product_name_urdu:
          item.product_name_urdu,

        /*
         * PRODUCT IMAGE
         *
         * Previously this was missing from the
         * checkout -> order request.
         */
        image: item.image || "",

        quantity_value: Number(
          item.quantity_value
        ),

        unit: item.unit,

        price: Number(
          item.price
        ),

        quantity: Number(
          item.quantity
        ),
      }));

      const response = await fetch(
        "/api/orders",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            customer_name:
              customerName,

            phone,

            address,

            city,

            order_notes:
              orderNotes,

            payment_method:
              paymentMethod,

            items: orderItems,
          }),
        }
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Unable to place your order."
        );
      }

      /*
       * Only clear the cart after the
       * order has been successfully created.
       */
      clearCart();

      /*
       * Redirect to the order success page.
       */
      window.location.href =
        `/order-success/${data.order.id}`;
    } catch (error) {
      console.error(
        "PLACE ORDER ERROR:",
        error
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to place your order. Please try again."
      );

      setIsSubmitting(false);
    }
  }

  /* ============================================================
     MAIN CHECKOUT
  ============================================================ */

  return (
    <main className="min-h-[60vh] bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

        {/* PAGE HEADER */}

        <div className="mb-7">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Checkout
          </h1>

          <p
            dir="rtl"
            className="mt-1 text-left text-sm text-gray-500"
          >
            چیک آؤٹ
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Complete your details and select your
            preferred payment method.
          </p>

          <p
            dir="rtl"
            className="mt-1 text-sm text-gray-500"
          >
            اپنی معلومات مکمل کریں اور ادائیگی کا
            طریقہ منتخب کریں۔
          </p>
        </div>

        {/* ERROR */}

        {errorMessage && (
          <div
            className="
              mb-6
              rounded-xl
              border
              border-red-200
              bg-red-50
              px-4
              py-3
              text-sm
              text-red-700
            "
          >
            {errorMessage}
          </div>
        )}

        <form onSubmit={handlePlaceOrder}>
          <div className="grid items-start gap-6 lg:grid-cols-[1fr_330px]">

            {/* ==================================================
                LEFT SIDE
            ================================================== */}

            <div className="space-y-6">

              {/* CUSTOMER INFORMATION */}

              <section
                className="
                  rounded-2xl
                  border
                  border-gray-100
                  bg-white
                  p-5
                  shadow-sm
                  sm:p-6
                "
              >
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Customer Information
                  </h2>

                  <p
                    dir="rtl"
                    className="mt-0.5 text-sm text-gray-500"
                  >
                    کسٹمر کی معلومات
                  </p>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">

                  {/* NAME */}

                  <div>
                    <label
                      htmlFor="customer-name"
                      className="mb-1.5 block text-sm font-medium text-gray-700"
                    >
                      Full Name
                    </label>

                    <input
                      id="customer-name"
                      type="text"
                      value={customerName}
                      onChange={(event) =>
                        setCustomerName(
                          event.target.value
                        )
                      }
                      required
                      placeholder="Enter your full name"
                      className="
                        h-11
                        w-full
                        rounded-lg
                        border
                        border-gray-200
                        bg-white
                        px-3
                        text-sm
                        text-gray-900
                        outline-none
                        transition
                        placeholder:text-gray-400
                        focus:border-green-600
                        focus:ring-2
                        focus:ring-green-100
                      "
                    />
                  </div>

                  {/* PHONE */}

                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-1.5 block text-sm font-medium text-gray-700"
                    >
                      Phone Number
                    </label>

                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(event) =>
                        setPhone(
                          event.target.value
                        )
                      }
                      required
                      placeholder="03XX XXXXXXX"
                      className="
                        h-11
                        w-full
                        rounded-lg
                        border
                        border-gray-200
                        bg-white
                        px-3
                        text-sm
                        text-gray-900
                        outline-none
                        transition
                        placeholder:text-gray-400
                        focus:border-green-600
                        focus:ring-2
                        focus:ring-green-100
                      "
                    />
                  </div>
                </div>

                {/* ADDRESS */}

                <div className="mt-4">
                  <label
                    htmlFor="address"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Delivery Address
                  </label>

                  <textarea
                    id="address"
                    value={address}
                    onChange={(event) =>
                      setAddress(
                        event.target.value
                      )
                    }
                    required
                    rows={3}
                    placeholder="Enter your complete delivery address"
                    className="
                      w-full
                      resize-none
                      rounded-lg
                      border
                      border-gray-200
                      bg-white
                      px-3
                      py-2.5
                      text-sm
                      text-gray-900
                      outline-none
                      transition
                      placeholder:text-gray-400
                      focus:border-green-600
                      focus:ring-2
                      focus:ring-green-100
                    "
                  />
                </div>

                {/* CITY */}

                <div className="mt-4">
                  <label
                    htmlFor="city"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    City
                  </label>

                  <input
                    id="city"
                    type="text"
                    value={city}
                    onChange={(event) =>
                      setCity(
                        event.target.value
                      )
                    }
                    required
                    placeholder="Enter your city"
                    className="
                      h-11
                      w-full
                      rounded-lg
                      border
                      border-gray-200
                      bg-white
                      px-3
                      text-sm
                      text-gray-900
                      outline-none
                      transition
                      placeholder:text-gray-400
                      focus:border-green-600
                      focus:ring-2
                      focus:ring-green-100
                    "
                  />
                </div>

                {/* NOTES */}

                <div className="mt-4">
                  <label
                    htmlFor="notes"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Order Notes

                    <span className="ml-1 font-normal text-gray-400">
                      (Optional)
                    </span>
                  </label>

                  <textarea
                    id="notes"
                    value={orderNotes}
                    onChange={(event) =>
                      setOrderNotes(
                        event.target.value
                      )
                    }
                    rows={2}
                    placeholder="Any special instructions?"
                    className="
                      w-full
                      resize-none
                      rounded-lg
                      border
                      border-gray-200
                      bg-white
                      px-3
                      py-2.5
                      text-sm
                      text-gray-900
                      outline-none
                      transition
                      placeholder:text-gray-400
                      focus:border-green-600
                      focus:ring-2
                      focus:ring-green-100
                    "
                  />
                </div>
              </section>

              {/* PAYMENT METHOD */}

              <section
                className="
                  rounded-2xl
                  border
                  border-gray-100
                  bg-white
                  p-5
                  shadow-sm
                  sm:p-6
                "
              >
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Payment Method
                  </h2>

                  <p
                    dir="rtl"
                    className="mt-0.5 text-sm text-gray-500"
                  >
                    ادائیگی کا طریقہ
                  </p>
                </div>

                <div className="mt-5 space-y-3">

                  {/* EASYPAISA */}

                  <label
                    className={`
                      block
                      cursor-pointer
                      rounded-xl
                      border
                      p-4
                      transition
                      ${
                        paymentMethod ===
                        "easypaisa"
                          ? "border-green-600 bg-green-50"
                          : "border-gray-200 bg-white hover:border-green-300"
                      }
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="payment"
                        value="easypaisa"
                        checked={
                          paymentMethod ===
                          "easypaisa"
                        }
                        onChange={() =>
                          setPaymentMethod(
                            "easypaisa"
                          )
                        }
                        className="mt-1 h-4 w-4 accent-green-700"
                      />

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              EasyPaisa
                            </p>

                            <p
                              dir="rtl"
                              className="mt-0.5 text-xs text-gray-500"
                            >
                              ایزی پیسہ
                            </p>
                          </div>

                          <div className="rounded-md bg-green-100 px-2 py-1 text-[10px] font-semibold text-green-700">
                            ONLINE
                          </div>
                        </div>

                        {paymentMethod ===
                          "easypaisa" && (
                          <div className="mt-3 rounded-lg bg-white p-3 text-xs leading-5 text-gray-600 ring-1 ring-green-100">
                            <p className="font-medium text-gray-800">
                              EasyPaisa payment
                            </p>

                            <p className="mt-1">
                              Payment account details
                              will be provided here
                              when the payment system
                              is activated.
                            </p>

                            <p
                              dir="rtl"
                              className="mt-1"
                            >
                              ادائیگی کی تفصیلات یہاں
                              فراہم کی جائیں گی۔
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </label>

                  {/* JAZZCASH */}

                  <label
                    className={`
                      block
                      cursor-pointer
                      rounded-xl
                      border
                      p-4
                      transition
                      ${
                        paymentMethod ===
                        "jazzcash"
                          ? "border-green-600 bg-green-50"
                          : "border-gray-200 bg-white hover:border-green-300"
                      }
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="payment"
                        value="jazzcash"
                        checked={
                          paymentMethod ===
                          "jazzcash"
                        }
                        onChange={() =>
                          setPaymentMethod(
                            "jazzcash"
                          )
                        }
                        className="mt-1 h-4 w-4 accent-green-700"
                      />

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              JazzCash
                            </p>

                            <p
                              dir="rtl"
                              className="mt-0.5 text-xs text-gray-500"
                            >
                              جاز کیش
                            </p>
                          </div>

                          <div className="rounded-md bg-green-100 px-2 py-1 text-[10px] font-semibold text-green-700">
                            ONLINE
                          </div>
                        </div>

                        {paymentMethod ===
                          "jazzcash" && (
                          <div className="mt-3 rounded-lg bg-white p-3 text-xs leading-5 text-gray-600 ring-1 ring-green-100">
                            <p className="font-medium text-gray-800">
                              JazzCash payment
                            </p>

                            <p className="mt-1">
                              Payment account details
                              will be provided here
                              when the payment system
                              is activated.
                            </p>

                            <p
                              dir="rtl"
                              className="mt-1"
                            >
                              ادائیگی کی تفصیلات یہاں
                              فراہم کی جائیں گی۔
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </label>

                  {/* COD */}

                  <label
                    className={`
                      block
                      cursor-pointer
                      rounded-xl
                      border
                      p-4
                      transition
                      ${
                        paymentMethod === "cod"
                          ? "border-green-600 bg-green-50"
                          : "border-gray-200 bg-white hover:border-green-300"
                      }
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={
                          paymentMethod === "cod"
                        }
                        onChange={() =>
                          setPaymentMethod("cod")
                        }
                        className="mt-1 h-4 w-4 accent-green-700"
                      />

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              Cash on Delivery
                            </p>

                            <p
                              dir="rtl"
                              className="mt-0.5 text-xs text-gray-500"
                            >
                              کیش آن ڈیلیوری
                            </p>
                          </div>

                          <div className="rounded-md bg-gray-100 px-2 py-1 text-[10px] font-semibold text-gray-600">
                            COD
                          </div>
                        </div>

                        {paymentMethod ===
                          "cod" && (
                          <div className="mt-3 rounded-lg bg-white p-3 text-xs leading-5 text-gray-600 ring-1 ring-green-100">
                            <p>
                              Pay when your order is
                              delivered to your
                              address.
                            </p>

                            <p
                              dir="rtl"
                              className="mt-1"
                            >
                              آرڈر موصول ہونے پر رقم
                              ادا کریں۔
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </label>
                </div>
              </section>

              {/* BACK TO CART */}

              <div>
                <Link
                  href="/cart"
                  className="
                    inline-flex
                    items-center
                    text-sm
                    font-medium
                    text-gray-500
                    transition
                    hover:text-green-700
                  "
                >
                  ← Back to Cart
                </Link>
              </div>
            </div>

            {/* ==================================================
                RIGHT SIDE — ORDER SUMMARY
            ================================================== */}

            <aside className="lg:sticky lg:top-24">
              <div
                className="
                  rounded-2xl
                  border
                  border-gray-100
                  bg-[#f8faf8]
                  p-5
                  shadow-sm
                "
              >

                {/* SUMMARY HEADER */}

                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Your Order
                  </h2>

                  <p
                    dir="rtl"
                    className="mt-0.5 text-sm text-gray-500"
                  >
                    آپ کا آرڈر
                  </p>
                </div>

                {/* CART ITEMS */}

                <div className="mt-5 max-h-[500px] space-y-4 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div
                      key={`${item.product_id}-${item.variant_id}`}
                      className="
                        rounded-xl
                        bg-white
                        p-3
                        ring-1
                        ring-gray-100
                      "
                    >
                      <div className="flex gap-3">

                        {/* IMAGE */}

                        <div
                          className="
                            relative
                            h-16
                            w-16
                            shrink-0
                            overflow-hidden
                            rounded-lg
                            bg-[#f8faf8]
                          "
                        >
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.product_name}
                              fill
                              sizes="64px"
                              className="object-contain p-1"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-[10px] text-gray-400">
                              No Image
                            </div>
                          )}
                        </div>

                        {/* DETAILS */}

                        <div className="min-w-0 flex-1">
                          <Link
                            href={`/store/${item.slug}`}
                            className="
                              line-clamp-2
                              text-xs
                              font-semibold
                              text-gray-800
                              transition
                              hover:text-green-700
                            "
                          >
                            {item.product_name}
                          </Link>

                          {item.product_name_urdu && (
                            <p
                              dir="rtl"
                              className="
                                mt-0.5
                                truncate
                                text-right
                                text-xs
                                text-gray-500
                              "
                            >
                              {item.product_name_urdu}
                            </p>
                          )}

                          <p className="mt-1 text-[11px] text-gray-500">
                            {item.quantity_value}{" "}
                            {item.unit}
                          </p>
                        </div>

                        {/* REMOVE */}

                        <button
                          type="button"
                          onClick={() =>
                            handleRemove(item)
                          }
                          aria-label={`Remove ${item.product_name} from checkout`}
                          className="
                            shrink-0
                            self-start
                            rounded-md
                            p-1
                            text-gray-400
                            transition
                            hover:bg-red-50
                            hover:text-red-600
                          "
                        >
                          <svg
                            viewBox="0 0 24 24"
                            className="h-4 w-4"
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

                      {/* QUANTITY + PRICE */}

                      <div className="mt-3 flex items-center justify-between gap-3">

                        {/* QUANTITY */}

                        <div className="flex h-8 items-center overflow-hidden rounded-lg border border-gray-200 bg-white">
                          <button
                            type="button"
                            onClick={() =>
                              handleQuantityChange(
                                item,
                                Math.max(
                                  1,
                                  item.quantity - 1
                                )
                              )
                            }
                            aria-label="Decrease quantity"
                            className="
                              flex
                              h-full
                              w-8
                              items-center
                              justify-center
                              text-sm
                              text-gray-600
                              transition
                              hover:bg-gray-50
                              hover:text-green-700
                            "
                          >
                            −
                          </button>

                          <span
                            className="
                              flex
                              h-full
                              min-w-[32px]
                              items-center
                              justify-center
                              border-x
                              border-gray-200
                              text-xs
                              font-semibold
                              text-gray-900
                            "
                          >
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
                            className="
                              flex
                              h-full
                              w-8
                              items-center
                              justify-center
                              text-sm
                              text-gray-600
                              transition
                              hover:bg-gray-50
                              hover:text-green-700
                            "
                          >
                            +
                          </button>
                        </div>

                        {/* PRICE */}

                        <div className="text-right">
                          <p className="text-xs font-bold text-gray-900">
                            Rs{" "}
                            {(
                              Number(item.price) *
                              Number(item.quantity)
                            ).toLocaleString(
                              "en-PK"
                            )}
                          </p>

                          <p className="mt-0.5 text-[10px] text-gray-400">
                            Rs{" "}
                            {Number(
                              item.price
                            ).toLocaleString(
                              "en-PK"
                            )}{" "}
                            each
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* SUMMARY TOTALS */}

                <div className="mt-5 space-y-3 border-t border-gray-200 pt-4">

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      Items
                    </span>

                    <span className="font-medium text-gray-800">
                      {totalItems}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      Subtotal
                    </span>

                    <span className="font-semibold text-gray-900">
                      Rs{" "}
                      {subtotal.toLocaleString(
                        "en-PK"
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      Delivery
                    </span>

                    <span className="font-medium text-green-700">
                      Calculated later
                    </span>
                  </div>
                </div>

                {/* TOTAL */}

                <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
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
                    {total.toLocaleString(
                      "en-PK"
                    )}
                  </p>
                </div>

                {/* PLACE ORDER */}

                <button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    cart.length === 0
                  }
                  className="
                    mt-5
                    flex
                    h-12
                    w-full
                    items-center
                    justify-center
                    rounded-lg
                    bg-green-700
                    px-5
                    text-sm
                    font-semibold
                    text-white
                    shadow-sm
                    transition
                    hover:bg-green-800
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  {isSubmitting
                    ? "Placing Order..."
                    : "Place Order"}
                </button>

                <p
                  dir="rtl"
                  className="mt-2 text-center text-xs text-gray-500"
                >
                  آرڈر مکمل کرنے کے لیے اوپر بٹن دبائیں
                </p>

                {/* SECURITY NOTE */}

                <div className="mt-4 rounded-lg bg-white p-3 text-center">
                  <p className="text-[11px] leading-5 text-gray-500">
                    Your order information is used only
                    to process and deliver your order.
                  </p>

                  <p
                    dir="rtl"
                    className="mt-1 text-[11px] leading-5 text-gray-500"
                  >
                    آپ کی معلومات صرف آرڈر مکمل کرنے
                    اور ڈیلیوری کے لیے استعمال کی جائیں گی۔
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </form>
      </div>
    </main>
  );
}