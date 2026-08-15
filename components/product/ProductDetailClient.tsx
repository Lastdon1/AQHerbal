"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type ProductImage = {
  id: number;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
};

type ProductVariant = {
  id: number;
  quantity_value: number;
  unit: string;
  price: number;
  old_price: number | null;
  is_default: boolean;
  is_active: boolean;
};

type HealthConcern = {
  id: number;
  name: string;
  name_urdu: string | null;
  slug: string;
};

type Product = {
  id: number;
  name: string;
  name_urdu: string | null;
  slug: string;

  description: string | null;
  description_urdu: string | null;

  benefits: string | null;
  benefits_urdu: string | null;

  ingredients: string | null;
  ingredients_urdu: string | null;

  usage: string | null;
  usage_urdu: string | null;

  is_active: boolean;

  category_id: number | null;
  category_name: string | null;
  category_name_urdu: string | null;
  category_slug: string | null;

  images: ProductImage[];
  variants: ProductVariant[];
  health_concerns: HealthConcern[];
};

type ProductDetailClientProps = {
  product: Product;
};

type Tab =
  | "description"
  | "benefits"
  | "ingredients"
  | "usage"
  | "reviews";

type Review = {
  id: number;
  customer_name: string;
  review_title: string | null;
  review_text: string;
  rating: number;
  created_at: string;
};

type ReviewSummary = {
  total_reviews: number;
  average_rating: number;
  five_star: number;
  four_star: number;
  three_star: number;
  two_star: number;
  one_star: number;
};

type ReviewsResponse = {
  success: boolean;
  summary: ReviewSummary;
  reviews: Review[];
  message?: string;
};

const emptyReviewSummary: ReviewSummary = {
  total_reviews: 0,
  average_rating: 0,
  five_star: 0,
  four_star: 0,
  three_star: 0,
  two_star: 0,
  one_star: 0,
};

export default function ProductDetailClient({
  product,
}: ProductDetailClientProps) {
  /*
   * =====================================================
   * INITIAL IMAGE
   * =====================================================
   */

  const initialImage =
    product.images.find((image) => image.is_primary) ||
    product.images[0] ||
    null;

  const [selectedImageId, setSelectedImageId] =
    useState<number | null>(initialImage?.id ?? null);

  /*
   * =====================================================
   * INITIAL VARIANT
   * =====================================================
   */

  const initialVariant =
    product.variants.find((variant) => variant.is_default) ||
    product.variants[0] ||
    null;

  const [selectedVariantId, setSelectedVariantId] =
    useState<number | null>(initialVariant?.id ?? null);

  /*
   * =====================================================
   * QUANTITY
   * =====================================================
   */

  const [quantity, setQuantity] = useState(1);

  /*
   * =====================================================
   * TABS
   * =====================================================
   */

  const [activeTab, setActiveTab] =
    useState<Tab>("description");

  /*
   * =====================================================
   * CART FEEDBACK
   * =====================================================
   */

  const [cartMessage, setCartMessage] = useState("");

  /*
   * =====================================================
   * REVIEWS
   * =====================================================
   */

  const [reviews, setReviews] = useState<Review[]>([]);

  const [reviewSummary, setReviewSummary] =
    useState<ReviewSummary>(emptyReviewSummary);

  const [reviewsLoading, setReviewsLoading] =
    useState(false);

  const [reviewsError, setReviewsError] = useState("");

  const [showReviewForm, setShowReviewForm] =
    useState(false);

  const [reviewSubmitting, setReviewSubmitting] =
    useState(false);

  const [reviewSuccess, setReviewSuccess] = useState("");

  const [reviewSubmitError, setReviewSubmitError] =
    useState("");

  const [customerName, setCustomerName] = useState("");

  const [reviewTitle, setReviewTitle] = useState("");

  const [reviewText, setReviewText] = useState("");

  const [reviewRating, setReviewRating] = useState(0);

  const [hoverRating, setHoverRating] = useState(0);

  /*
   * =====================================================
   * SELECTED IMAGE
   * =====================================================
   */

  const selectedImage =
    product.images.find(
      (image) => image.id === selectedImageId
    ) || initialImage;

  /*
   * =====================================================
   * SELECTED VARIANT
   * =====================================================
   */

  const selectedVariant =
    product.variants.find(
      (variant) => variant.id === selectedVariantId
    ) || initialVariant;

  /*
   * =====================================================
   * LOAD REVIEWS
   * =====================================================
   */

  useEffect(() => {
    async function loadReviews() {
      setReviewsLoading(true);
      setReviewsError("");

      try {
        const response = await fetch(
          `/api/products/${product.slug}/reviews`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const data: ReviewsResponse =
          await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Unable to load reviews."
          );
        }

        setReviews(data.reviews || []);

        setReviewSummary(
          data.summary || emptyReviewSummary
        );
      } catch (error) {
        console.error("LOAD REVIEWS ERROR:", error);

        setReviewsError(
          "Unable to load reviews right now."
        );
      } finally {
        setReviewsLoading(false);
      }
    }

    loadReviews();
  }, [product.slug]);

  /*
   * =====================================================
   * STARS
   * =====================================================
   */

  const renderStars = (
    rating: number,
    size = "text-base"
  ) => {
    const safeRating = Math.max(
      0,
      Math.min(5, Number(rating) || 0)
    );

    return (
      <div
        className="flex items-center gap-0.5"
        aria-label={`${safeRating.toFixed(
          1
        )} out of 5 stars`}
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const fillAmount = Math.max(
            0,
            Math.min(
              1,
              safeRating - (star - 1)
            )
          );

          return (
            <span
              key={star}
              className={`relative inline-block leading-none ${size}`}
            >
              <span className="text-gray-300">
                ★
              </span>

              {fillAmount > 0 && (
                <span
                  className="absolute inset-y-0 left-0 overflow-hidden"
                  style={{
                    width: `${fillAmount * 100}%`,
                  }}
                >
                  <span className="text-amber-400">
                    ★
                  </span>
                </span>
              )}
            </span>
          );
        })}
      </div>
    );
  };

  /*
   * =====================================================
   * REVIEW DATE
   * =====================================================
   */

  const formatReviewDate = (date: string) => {
    try {
      return new Intl.DateTimeFormat("en-PK", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(date));
    } catch {
      return "";
    }
  };

  /*
   * =====================================================
   * REVIEW SUBMIT
   * =====================================================
   */

  async function handleReviewSubmit(
    event: React.FormEvent
  ) {
    event.preventDefault();

    setReviewSubmitError("");
    setReviewSuccess("");

    if (!customerName.trim()) {
      setReviewSubmitError(
        "Please enter your name."
      );
      return;
    }

    if (customerName.trim().length < 2) {
      setReviewSubmitError(
        "Name must be at least 2 characters."
      );
      return;
    }

    if (reviewRating < 1) {
      setReviewSubmitError(
        "Please select a rating."
      );
      return;
    }

    if (!reviewText.trim()) {
      setReviewSubmitError(
        "Please write your review."
      );
      return;
    }

    if (reviewText.trim().length < 5) {
      setReviewSubmitError(
        "Review must be at least 5 characters."
      );
      return;
    }

    setReviewSubmitting(true);

    try {
      const response = await fetch(
        `/api/products/${product.slug}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer_name: customerName.trim(),
            review_title: reviewTitle.trim(),
            review_text: reviewText.trim(),
            rating: reviewRating,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to submit your review."
        );
      }

      setReviewSuccess(
        "Thank you for your review. Your review has been submitted and is awaiting approval."
      );

      setCustomerName("");
      setReviewTitle("");
      setReviewText("");
      setReviewRating(0);
      setHoverRating(0);
    } catch (error) {
      console.error(
        "SUBMIT REVIEW ERROR:",
        error
      );

      setReviewSubmitError(
        error instanceof Error
          ? error.message
          : "Unable to submit your review."
      );
    } finally {
      setReviewSubmitting(false);
    }
  }

  /*
   * =====================================================
   * WHATSAPP
   * =====================================================
   */

  const whatsappNumber =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";

  const whatsappMessage = selectedVariant
    ? `Assalam-o-Alaikum, I would like to order:

Product: ${product.name}
${
  product.name_urdu
    ? `پروڈکٹ: ${product.name_urdu}\n`
    : ""
}
Size: ${selectedVariant.quantity_value} ${selectedVariant.unit}
Quantity: ${quantity}
Price: Rs ${Number(
        selectedVariant.price
      ).toLocaleString("en-PK")}

Please confirm availability and order details.`
    : `Assalam-o-Alaikum, I would like to order ${product.name}.`;

  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        whatsappMessage
      )}`
    : `https://api.whatsapp.com/send?text=${encodeURIComponent(
        whatsappMessage
      )}`;

  /*
   * =====================================================
   * TABS
   * =====================================================
   */

  const tabs: {
    id: Tab;
    label: string;
    urdu: string;
  }[] = [
    {
      id: "description",
      label: "Description",
      urdu: "تفصیل",
    },
    {
      id: "benefits",
      label: "Benefits",
      urdu: "فوائد",
    },
    {
      id: "ingredients",
      label: "Ingredients",
      urdu: "اجزاء",
    },
    {
      id: "usage",
      label: "How to Use",
      urdu: "طریقہ استعمال",
    },
    {
      id: "reviews",
      label: "Reviews",
      urdu: "جائزے",
    },
  ];

  /*
   * =====================================================
   * ADD TO CART
   * =====================================================
   */

  function handleAddToCart() {
    if (!selectedVariant) {
      setCartMessage("Please select a size first.");
      return;
    }

    try {
      const saved =
        localStorage.getItem("isaco-cart");

      const cart = saved
        ? JSON.parse(saved)
        : [];

      const cartItem = {
        product_id: product.id,
        product_name: product.name,
        product_name_urdu:
          product.name_urdu,
        slug: product.slug,
        image:
          selectedImage?.image_url || "",
        variant_id: selectedVariant.id,
        quantity_value:
          selectedVariant.quantity_value,
        unit: selectedVariant.unit,
        price: Number(selectedVariant.price),
        quantity,
      };

      const existingIndex = cart.findIndex(
        (item: {
          product_id: number;
          variant_id: number;
        }) =>
          Number(item.product_id) ===
            Number(product.id) &&
          Number(item.variant_id) ===
            Number(selectedVariant.id)
      );

      if (existingIndex >= 0) {
        cart[existingIndex].quantity +=
          quantity;
      } else {
        cart.push(cartItem);
      }

      localStorage.setItem(
        "isaco-cart",
        JSON.stringify(cart)
      );

      window.dispatchEvent(
        new Event("cart-updated")
      );

      setCartMessage(
        "Product added to cart."
      );

      setTimeout(() => {
        setCartMessage("");
      }, 2500);
    } catch (error) {
      console.error(
        "ADD TO CART ERROR:",
        error
      );

      setCartMessage(
        "Unable to add product to cart."
      );
    }
  }

  /*
   * =====================================================
   * BUY NOW
   * =====================================================
   */

  function handleBuyNow() {
    if (!selectedVariant) {
      setCartMessage("Please select a size first.");
      return;
    }

    handleAddToCart();

    setTimeout(() => {
      window.location.href = "/checkout";
    }, 150);
  }

  return (
    <div className="w-full min-w-0 overflow-x-hidden">
      <section className="grid min-w-0 gap-7 lg:grid-cols-2 lg:gap-10">

        {/* =================================================
            LEFT SIDE
            IMAGE ONLY ON DESKTOP/MOBILE
        ================================================= */}

        <div className="min-w-0">
          <div className="flex min-w-0 items-start gap-2 sm:gap-3">

            {/* THUMBNAILS */}

            {product.images.length > 0 && (
              <div className="flex w-[52px] shrink-0 flex-col gap-2 sm:w-[64px]">
                {product.images.map((image) => {
                  const selected =
                    image.id === selectedImageId;

                  return (
                    <button
                      key={image.id}
                      type="button"
                      onClick={() =>
                        setSelectedImageId(
                          image.id
                        )
                      }
                      aria-label={`View ${
                        image.alt_text ||
                        product.name
                      }`}
                      className={`relative h-[50px] w-[50px] shrink-0 overflow-hidden rounded-lg border bg-white transition sm:h-[62px] sm:w-[62px] ${
                        selected
                          ? "border-green-600 ring-2 ring-green-100"
                          : "border-gray-200 hover:border-green-400"
                      }`}
                    >
                      <Image
                        src={image.image_url}
                        alt={
                          image.alt_text ||
                          product.name
                        }
                        fill
                        sizes="62px"
                        className="object-contain p-1"
                      />
                    </button>
                  );
                })}
              </div>
            )}

            {/* BIG IMAGE */}

            <div className="min-w-0 flex-1">
              <div className="relative w-full overflow-hidden rounded-2xl border border-gray-100 bg-[#f8faf8]">
                <div className="relative aspect-[1/0.9] w-full">
                  {selectedImage ? (
                    <Image
                      key={selectedImage.id}
                      src={
                        selectedImage.image_url
                      }
                      alt={
                        selectedImage.alt_text ||
                        product.name
                      }
                      fill
                      priority
                      sizes="(max-width: 1024px) 90vw, 45vw"
                      className="object-contain p-4 sm:p-7"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

      {/* =================================================
          PRODUCT TABS
          LEFT COLUMN ONLY
      ================================================= */}

      <section className="mt-7 min-w-0 border-t border-gray-100 pt-5">

        {/* TAB BAR */}

        <div className="w-full min-w-0 overflow-x-auto overflow-y-hidden">
          <div className="flex min-w-max border-b border-gray-200">
            {tabs.map((tab) => {
              const active =
                activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() =>
                    setActiveTab(tab.id)
                  }
                  className={`relative shrink-0 px-3 py-2.5 text-center transition sm:min-w-[105px] ${
                    active
                      ? "text-green-700"
                      : "text-gray-500 hover:text-green-700"
                  }`}
                >
                  <span className="block text-xs font-semibold sm:text-sm">
                    {tab.label}
                  </span>

                  <span
                    dir="rtl"
                    className="mt-0.5 block text-[10px] text-gray-500"
                  >
                    {tab.urdu}
                  </span>

                  {active && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-green-700" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* TAB CONTENT */}

        <div className="mt-5 min-w-0">
          {activeTab === "description" && (
            <InfoContent
              englishTitle="Description"
              urduTitle="تفصیل"
              english={product.description}
              urdu={product.description_urdu}
              empty="No description available."
            />
          )}

          {activeTab === "benefits" && (
            <InfoContent
              englishTitle="Benefits"
              urduTitle="فوائد"
              english={product.benefits}
              urdu={product.benefits_urdu}
              empty="No benefits information available."
            />
          )}

          {activeTab === "ingredients" && (
            <InfoContent
              englishTitle="Ingredients"
              urduTitle="اجزاء"
              english={product.ingredients}
              urdu={product.ingredients_urdu}
              empty="No ingredients information available."
            />
          )}

          {activeTab === "usage" && (
            <InfoContent
              englishTitle="How to Use"
              urduTitle="طریقہ استعمال"
              english={product.usage}
              urdu={product.usage_urdu}
              empty="No usage information available."
            />
          )}

          {activeTab === "reviews" && (
            <ReviewsSection
              reviews={reviews}
              reviewSummary={reviewSummary}
              reviewsLoading={reviewsLoading}
              reviewsError={reviewsError}
              showReviewForm={showReviewForm}
              setShowReviewForm={
                setShowReviewForm
              }
              reviewSubmitting={
                reviewSubmitting
              }
              reviewSuccess={reviewSuccess}
              reviewSubmitError={
                reviewSubmitError
              }
              customerName={customerName}
              setCustomerName={
                setCustomerName
              }
              reviewTitle={reviewTitle}
              setReviewTitle={setReviewTitle}
              reviewText={reviewText}
              setReviewText={setReviewText}
              reviewRating={reviewRating}
              setReviewRating={
                setReviewRating
              }
              hoverRating={hoverRating}
              setHoverRating={
                setHoverRating
              }
              handleReviewSubmit={
                handleReviewSubmit
              }
              renderStars={renderStars}
              formatReviewDate={
                formatReviewDate
              }
            />
          )}
        </div>
      </section>
        </div>

        {/* =================================================
            RIGHT SIDE
            PRODUCT INFORMATION
        ================================================= */}

        <div className="min-w-0">

          {/* PRODUCT NAME */}

          <h1 className="break-words text-xl font-bold leading-7 text-gray-900 sm:text-3xl sm:leading-8">
            {product.name}
          </h1>

          {/* URDU NAME */}

          {product.name_urdu && (
            <p
              dir="rtl"
              className="mt-0.5 break-words text-left text-xl font-bold leading-8 text-gray-800 sm:text-2xl"
            >
              {product.name_urdu}
            </p>
          )}

          {/* REVIEWS */}

          <div className="mt-2 flex min-w-0 items-center gap-2">
            {reviewsLoading ? (
              <span className="text-xs text-gray-400">
                Loading rating...
              </span>
            ) : reviewSummary.total_reviews > 0 ? (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setActiveTab("reviews")
                  }
                  className="shrink-0"
                >
                  {renderStars(
                    reviewSummary.average_rating,
                    "text-sm"
                  )}
                </button>

                <span className="text-sm font-semibold text-gray-700">
                  {reviewSummary.average_rating.toFixed(
                    1
                  )}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setActiveTab("reviews")
                  }
                  className="truncate text-xs text-gray-500 hover:text-green-700"
                >
                  ({reviewSummary.total_reviews}{" "}
                  {reviewSummary.total_reviews ===
                  1
                    ? "review"
                    : "reviews"}
                  )
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() =>
                  setActiveTab("reviews")
                }
                className="text-xs text-gray-500 hover:text-green-700"
              >
                No reviews
              </button>
            )}
          </div>

          {/* PRICE */}

          {selectedVariant && (
            <div className="mt-3">
              <div className="text-2xl font-bold leading-none text-green-700 sm:text-3xl">
                Rs{" "}
                {Number(
                  selectedVariant.price
                ).toLocaleString("en-PK")}
              </div>

              {selectedVariant.old_price !==
                null &&
                Number(
                  selectedVariant.old_price
                ) >
                  Number(
                    selectedVariant.price
                  ) && (
                  <span className="mt-1 inline-block text-sm text-gray-400 line-through">
                    Rs{" "}
                    {Number(
                      selectedVariant.old_price
                    ).toLocaleString(
                      "en-PK"
                    )}
                  </span>
                )}
            </div>
          )}

          {/* HEALTH CONCERNS */}

          {product.health_concerns.length > 0 && (
            <div className="mt-4 min-w-0">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                <h2 className="text-sm font-semibold text-gray-900">
                  Health Concerns
                </h2>

                <span
                  dir="rtl"
                  className="text-sm text-gray-500"
                >
                  صحت کے مسائل
                </span>
              </div>

              <div className="mt-2 flex min-w-0 flex-wrap gap-2">
                {product.health_concerns.map(
                  (concern) => (
                    <Link
                      key={concern.id}
                      href={`/health-concern/${concern.slug}`}
                      className="max-w-full rounded-full bg-green-50 px-3 py-1.5 transition hover:bg-green-100"
                    >
                      <span className="block break-words text-xs font-medium text-green-700">
                        {concern.name}
                      </span>

                      {concern.name_urdu && (
                        <span
                          dir="rtl"
                          className="block break-words text-xs text-green-600"
                        >
                          {concern.name_urdu}
                        </span>
                      )}
                    </Link>
                  )
                )}
              </div>
            </div>
          )}

          {/* SHORT PRODUCT DESCRIPTION */}

          {(product.description_urdu ||
            product.description) && (
            <div className="mt-4 space-y-1.5">
              {product.description_urdu && (
                <p
                  dir="rtl"
                  className="break-words text-left text-sm leading-6 text-gray-600"
                >
                  {product.description_urdu}
                </p>
              )}

              {product.description && (
                <p className="whitespace-pre-line break-words text-sm leading-6 text-gray-600">
                  {product.description}
                </p>
              )}
            </div>
          )}

          {/* AVAILABLE SIZES */}

          {product.variants.length > 0 && (
            <div className="mt-4 min-w-0">
              <div className="text-sm font-semibold text-gray-900">
                Available Sizes
              </div>

              <div className="mt-2 flex min-w-0 flex-wrap gap-2">
                {product.variants.map(
                  (variant) => {
                    const selected =
                      variant.id ===
                      selectedVariantId;

                    return (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() => {
                          setSelectedVariantId(
                            variant.id
                          );
                          setCartMessage("");
                        }}
                        className={`relative min-w-[82px] max-w-full rounded-lg border px-3 py-2 text-center transition ${
                          selected
                            ? "border-green-600 bg-green-50 ring-1 ring-green-200"
                            : "border-gray-200 bg-white hover:border-green-400"
                        }`}
                      >
                        {selected && (
                          <span className="absolute right-1 top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-green-600 text-[8px] font-bold text-white">
                            ✓
                          </span>
                        )}

                        <p className="break-words text-xs font-semibold text-gray-900">
                          {variant.quantity_value}{" "}
                          {variant.unit}
                        </p>

                        <p className="mt-0.5 text-xs font-bold text-green-700">
                          Rs{" "}
                          {Number(
                            variant.price
                          ).toLocaleString(
                            "en-PK"
                          )}
                        </p>
                      </button>
                    );
                  }
                )}
              </div>
            </div>
          )}

          {/* =================================================
              QUANTITY + ADD TO CART
          ================================================= */}

          <div className="mt-4 min-w-0">
            <div className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)_minmax(0,1fr)] gap-2">

              {/* QUANTITY */}

              <div className="flex h-11 shrink-0 items-center overflow-hidden rounded-lg border border-gray-200 bg-white">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() =>
                    setQuantity(
                      (current) =>
                        Math.max(
                          1,
                          current - 1
                        )
                    )
                  }
                  className="flex h-full w-9 items-center justify-center text-base text-gray-600 hover:bg-gray-50 hover:text-green-700"
                >
                  −
                </button>

                <span className="flex h-full min-w-[34px] items-center justify-center border-x border-gray-200 text-xs font-semibold text-gray-900">
                  {quantity}
                </span>

                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() =>
                    setQuantity(
                      (current) =>
                        current + 1
                    )
                  }
                  className="flex h-full w-9 items-center justify-center text-base text-gray-600 hover:bg-gray-50 hover:text-green-700"
                >
                  +
                </button>
              </div>

              {/* ADD TO CART */}

              <button
                type="button"
                onClick={handleAddToCart}
                className="h-11 min-w-0 flex-1 rounded-lg bg-green-700 px-3 text-xs font-semibold text-white shadow-sm transition hover:bg-green-800"
              >
                Add to Cart
              </button>

          <button
            type="button"
            onClick={handleBuyNow}
            className="h-11 w-full min-w-0 rounded-lg bg-cyan-500 px-3 text-xs font-semibold text-white shadow-sm transition hover:bg-cyan-600"
          >
            Buy It Now
          </button>
            </div>

            {cartMessage && (
              <p className="col-span-3 mt-2 break-words text-xs font-medium text-green-700">
                {cartMessage}
              </p>
            )}
          </div>

          {/* =================================================
              WHATSAPP
          ================================================= */}

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-green-600 bg-white px-4 text-sm font-semibold text-green-700 transition hover:bg-green-50"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 shrink-0 fill-current"
              aria-hidden="true"
            >
              <path d="M20.52 3.48A11.84 11.84 0 0 0 12.07 0C5.52 0 .2 5.32.2 11.87c0 2.09.55 4.13 1.59 5.92L.1 24l6.35-1.66a11.83 11.83 0 0 0 5.62 1.43h.01c6.54 0 11.86-5.32 11.86-11.87 0-3.17-1.23-6.15-3.42-8.42ZM12.08 21.7h-.01a9.82 9.82 0 0 1-5.01-1.37l-.36-.21-3.77.99 1.01-3.68-.23-.38a9.83 9.83 0 1 1 8.37 4.65Zm5.4-7.37c-.3-.15-1.78-.88-2.05-.98-.28-.1-.48-.15-.69.15-.2.3-.79.98-.97 1.18-.18.2-.36.23-.66.08-.3-.15-1.26-.46-2.4-1.46-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.08-.15-.69-1.66-.94-2.27-.25-.59-.5-.51-.69-.52h-.58c-.2 0-.53.08-.81.38-.28.3-1.06 1.04-1.06 2.54s1.09 2.95 1.24 3.15c.15.2 2.14 3.27 5.19 4.59.73.32 1.3.51 1.74.65.73.23 1.4.2 1.93.12.59-.09 1.78-.73 2.03-1.43.25-.7.25-1.3.18-1.43-.08-.13-.28-.2-.58-.35Z" />
            </svg>

            <span>Order on WhatsApp</span>
          </a>


        </div>
      </section>

    </div>
  );
}

/*
 * =====================================================
 * INFO CONTENT
 * =====================================================
 */

function InfoContent({
  englishTitle,
  urduTitle,
  english,
  urdu,
  empty,
}: {
  englishTitle: string;
  urduTitle: string;
  english: string | null;
  urdu: string | null;
  empty: string;
}) {
  if (!english && !urdu) {
    return (
      <p className="text-sm text-gray-800">
        {empty}
      </p>
    );
  }

  return (
    <div className="w-full min-w-0">

      {/* =================================================
          ENGLISH + URDU TWO COLUMN LAYOUT
      ================================================= */}

      <div className="grid w-full min-w-0 gap-6 md:grid-cols-2">

        {/* =================================================
            ENGLISH
        ================================================= */}

        <div className="min-w-0">
          <h3 className="text-base font-semibold text-gray-900">
            {englishTitle}
          </h3>

          {english ? (
            <p className="mt-2 whitespace-pre-line break-words text-left text-sm leading-7 text-gray-600">
              {english}
            </p>
          ) : (
            <p className="mt-2 text-sm text-gray-400">
              {empty}
            </p>
          )}
        </div>

        {/* =================================================
            URDU
        ================================================= */}

        <div
          dir="rtl"
          className="min-w-0 text-right"
        >
          <h3 className="text-base font-semibold text-gray-900">
            {urduTitle}
          </h3>

          {urdu ? (
            <p className="mt-2 whitespace-pre-line break-words text-right text-sm leading-7 text-gray-600">
              {urdu}
            </p>
          ) : (
            <p className="mt-2 text-sm text-gray-400">
              {empty}
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
/*
 * =====================================================
 * REVIEWS SECTION
 * =====================================================
 */

function ReviewsSection({
  reviews,
  reviewSummary,
  reviewsLoading,
  reviewsError,
  showReviewForm,
  setShowReviewForm,
  reviewSubmitting,
  reviewSuccess,
  reviewSubmitError,
  customerName,
  setCustomerName,
  reviewTitle,
  setReviewTitle,
  reviewText,
  setReviewText,
  reviewRating,
  setReviewRating,
  hoverRating,
  setHoverRating,
  handleReviewSubmit,
  renderStars,
  formatReviewDate,
}: {
  reviews: Review[];
  reviewSummary: ReviewSummary;
  reviewsLoading: boolean;
  reviewsError: string;
  showReviewForm: boolean;
  setShowReviewForm: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  reviewSubmitting: boolean;
  reviewSuccess: string;
  reviewSubmitError: string;
  customerName: string;
  setCustomerName: React.Dispatch<
    React.SetStateAction<string>
  >;
  reviewTitle: string;
  setReviewTitle: React.Dispatch<
    React.SetStateAction<string>
  >;
  reviewText: string;
  setReviewText: React.Dispatch<
    React.SetStateAction<string>
  >;
  reviewRating: number;
  setReviewRating: React.Dispatch<
    React.SetStateAction<number>
  >;
  hoverRating: number;
  setHoverRating: React.Dispatch<
    React.SetStateAction<number>
  >;
  handleReviewSubmit: (
    event: React.FormEvent
  ) => Promise<void>;
  renderStars: (
    rating: number,
    size?: string
  ) => React.ReactNode;
  formatReviewDate: (
    date: string
  ) => string;
}) {
  const ratingRows = [
    {
      rating: 5,
      count: reviewSummary.five_star,
    },
    {
      rating: 4,
      count: reviewSummary.four_star,
    },
    {
      rating: 3,
      count: reviewSummary.three_star,
    },
    {
      rating: 2,
      count: reviewSummary.two_star,
    },
    {
      rating: 1,
      count: reviewSummary.one_star,
    },
  ];

  return (
    <div className="min-w-0">

      {/* HEADER */}

      <div className="flex min-w-0 items-center justify-between gap-3 border-b border-gray-100 pb-4">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-gray-900">
            Customer Reviews
          </h3>

          <p
            dir="rtl"
            className="mt-0.5 text-left text-xs text-gray-500"
          >
            صارفین کے جائزے
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setShowReviewForm(
              (current) => !current
            )
          }
          className="shrink-0 rounded-lg bg-green-700 px-4 py-2 text-xs font-semibold text-white transition hover:bg-green-800"
        >
          {showReviewForm
            ? "Close"
            : "Write a Review"}
        </button>
      </div>

      {/* SUMMARY */}

      {!reviewsLoading && !reviewsError && (
        <div className="mt-5 min-w-0 rounded-xl bg-[#f8faf8] p-4">
          <div className="grid gap-5 sm:grid-cols-[130px_1fr]">
            <div className="flex flex-col items-center justify-center border-b border-gray-200 pb-4 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-5">
              <div className="text-3xl font-bold text-gray-900">
                {reviewSummary.total_reviews >
                0
                  ? reviewSummary.average_rating.toFixed(
                      1
                    )
                  : "0.0"}
              </div>

              <div className="mt-1">
                {renderStars(
                  reviewSummary.average_rating,
                  "text-base"
                )}
              </div>

              <p className="mt-1 text-[11px] text-gray-500">
                {reviewSummary.total_reviews}{" "}
                {reviewSummary.total_reviews ===
                1
                  ? "Review"
                  : "Reviews"}
              </p>
            </div>

            <div className="space-y-1.5">
              {ratingRows.map((row) => {
                const percentage =
                  reviewSummary.total_reviews >
                  0
                    ? Math.round(
                        (row.count /
                          reviewSummary.total_reviews) *
                          100
                      )
                    : 0;

                return (
                  <div
                    key={row.rating}
                    className="flex items-center gap-2"
                  >
                    <span className="w-4 text-[11px] text-gray-600">
                      {row.rating}
                    </span>

                    <span className="text-[11px] text-amber-400">
                      ★
                    </span>

                    <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-amber-400"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>

                    <span className="w-5 text-right text-[10px] text-gray-500">
                      {row.count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* LOADING */}

      {reviewsLoading && (
        <div className="mt-5 rounded-xl bg-gray-50 p-5 text-center">
          <div className="mx-auto h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-green-700" />

          <p className="mt-2 text-xs text-gray-500">
            Loading reviews...
          </p>
        </div>
      )}

      {/* ERROR */}

      {!reviewsLoading && reviewsError && (
        <div className="mt-5 rounded-xl border border-red-100 bg-red-50 p-4 text-xs text-red-700">
          {reviewsError}
        </div>
      )}

      {/* REVIEW FORM */}

      {showReviewForm && (
        <form
          onSubmit={handleReviewSubmit}
          className="mt-5 min-w-0 rounded-xl border border-green-100 bg-green-50/40 p-4"
        >
          <div>
            <h4 className="font-semibold text-gray-900">
              Write a Review
            </h4>

            <p
              dir="rtl"
              className="mt-0.5 text-left text-xs text-gray-500"
            >
              اپنا جائزہ لکھیں
            </p>
          </div>

          <div className="mt-4">
            <label
              htmlFor="review-name"
              className="block text-xs font-medium text-gray-700"
            >
              Your Name
            </label>

            <input
              id="review-name"
              type="text"
              value={customerName}
              onChange={(event) =>
                setCustomerName(
                  event.target.value
                )
              }
              maxLength={100}
              placeholder="Enter your name"
              className="mt-1.5 h-10 w-full min-w-0 rounded-lg border border-gray-200 bg-white px-3 text-xs outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div className="mt-4">
            <label className="block text-xs font-medium text-gray-700">
              Your Rating
            </label>

            <div className="mt-1.5 flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(
                (star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() =>
                      setHoverRating(
                        star
                      )
                    }
                    onMouseLeave={() =>
                      setHoverRating(0)
                    }
                    onClick={() =>
                      setReviewRating(
                        star
                      )
                    }
                    className="p-0.5 text-xl transition hover:scale-110"
                  >
                    <span
                      className={
                        star <=
                        (hoverRating ||
                          reviewRating)
                          ? "text-amber-400"
                          : "text-gray-300"
                      }
                    >
                      ★
                    </span>
                  </button>
                )
              )}
            </div>
          </div>

          <div className="mt-4">
            <label
              htmlFor="review-title"
              className="block text-xs font-medium text-gray-700"
            >
              Review Title{" "}
              <span className="font-normal text-gray-400">
                (Optional)
              </span>
            </label>

            <input
              id="review-title"
              type="text"
              value={reviewTitle}
              onChange={(event) =>
                setReviewTitle(
                  event.target.value
                )
              }
              maxLength={200}
              placeholder="e.g. Excellent quality"
              className="mt-1.5 h-10 w-full min-w-0 rounded-lg border border-gray-200 bg-white px-3 text-xs outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div className="mt-4">
            <label
              htmlFor="review-text"
              className="block text-xs font-medium text-gray-700"
            >
              Your Review
            </label>

            <textarea
              id="review-text"
              value={reviewText}
              onChange={(event) =>
                setReviewText(
                  event.target.value
                )
              }
              maxLength={3000}
              rows={4}
              placeholder="Share your experience with this product..."
              className="mt-1.5 w-full min-w-0 resize-none rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-xs leading-5 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>

          {reviewSubmitError && (
            <div className="mt-3 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-700">
              {reviewSubmitError}
            </div>
          )}

          {reviewSuccess && (
            <div className="mt-3 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-800">
              {reviewSuccess}
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={reviewSubmitting}
              className="h-10 rounded-lg bg-green-700 px-5 text-xs font-semibold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {reviewSubmitting
                ? "Submitting..."
                : "Submit Review"}
            </button>

            <button
              type="button"
              onClick={() =>
                setShowReviewForm(false)
              }
              className="h-10 rounded-lg border border-gray-200 bg-white px-5 text-xs font-medium text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* RECENT REVIEWS */}

      {!reviewsLoading &&
        !reviewsError &&
        reviews.length > 0 && (
          <div className="mt-6 min-w-0">
            <h4 className="font-semibold text-gray-900">
              Recent Reviews
            </h4>

            <p
              dir="rtl"
              className="mt-0.5 text-left text-xs text-gray-500"
            >
              حالیہ جائزے
            </p>

            <div className="mt-3 min-w-0 divide-y divide-gray-100 rounded-xl border border-gray-100 bg-white">
              {reviews.map((review) => (
                <article
                  key={review.id}
                  className="min-w-0 p-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <h5 className="break-words text-xs font-semibold text-gray-900">
                      {review.customer_name}
                    </h5>

                    <span className="text-gray-300">
                      •
                    </span>

                    <span className="text-[10px] text-gray-400">
                      {formatReviewDate(
                        review.created_at
                      )}
                    </span>
                  </div>

                  <div className="mt-1">
                    {renderStars(
                      review.rating,
                      "text-xs"
                    )}
                  </div>

                  {review.review_title && (
                    <h6 className="mt-2 break-words text-xs font-semibold text-gray-900">
                      {review.review_title}
                    </h6>
                  )}

                  <p className="mt-1 whitespace-pre-line break-words text-xs leading-5 text-gray-600">
                    {review.review_text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        )}

      {/* EMPTY */}

      {!reviewsLoading &&
        !reviewsError &&
        reviews.length === 0 && (
          <div className="mt-5 rounded-xl border border-dashed border-gray-200 bg-gray-50 p-5 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
              <span className="text-lg text-green-700">
                ★
              </span>
            </div>

            <h4 className="mt-2 text-sm font-semibold text-gray-900">
              No Reviews
            </h4>
          </div>
        )}
    </div>
  );
}