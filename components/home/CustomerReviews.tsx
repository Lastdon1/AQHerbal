const reviews = [
  {
    name: "Ahmeduddin Khan",
    location: "Karachi",
    reviewUrdu:
      "معیاری قدرتی مصنوعات، بہترین پیکنگ اور قابلِ اعتماد سروس۔ مجموعی تجربہ بہت اچھا رہا۔",
    review:
      "Excellent quality herbal products. The packaging and service were impressive.",
    rating: 5,
  },
  {
    name: "Fatima Ali",
    location: "Karachi",
    reviewUrdu:
      "قدرتی مصنوعات کا معیار بہت اچھا ہے۔ ڈیلیوری بھی تیز اور قابلِ اعتماد تھی۔",
    review:
      "Natural products with great quality. Delivery was fast and reliable.",
    rating: 5,
  },
  {
    name: "Muhammad Hassan",
    location: "Islamabad",
    reviewUrdu:
      "آئی ساکو کی مصنوعات میں معیار اور قدرتی صحت کے حوالے سے اعتماد محسوس ہوتا ہے۔",
    review:
      "ISACO provides trusted wellness products with premium quality.",
    rating: 5,
  },
];

export default function CustomerReviews() {
  return (
    <section className="bg-white py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">

        {/* =====================================================
            HEADING
        ====================================================== */}

        <div className="mb-9 text-center">

          <div className="mb-3 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#d8c9a8] sm:w-12" />

            <span
              className="
                text-[11px]
                font-semibold
                tracking-[0.25em]
                text-[#008a3e]
              "
            >
              ISACO COMMUNITY
            </span>

            <span className="h-px w-8 bg-[#d8c9a8] sm:w-12" />
          </div>

          <h2
            dir="rtl"
            className="
              text-3xl
              font-bold
              leading-relaxed
              text-[#24543a]
              sm:text-4xl
            "
          >
            ہمارے صارفین کیا کہتے ہیں؟
          </h2>

          <p
            className="
              mt-1
              text-xl
              font-semibold
              text-[#008a3e]
              sm:text-2xl
            "
          >
            Customer Reviews
          </p>

          <p
            dir="rtl"
            className="
              mx-auto
              mt-2
              max-w-2xl
              text-sm
              leading-7
              text-gray-600
              sm:text-base
            "
          >
            ان صارفین کے تجربات جنہوں نے آئی ساکو پر اعتماد کیا۔
          </p>

          <p
            className="
              mx-auto
              mt-1
              max-w-2xl
              text-sm
              leading-6
              text-gray-500
              sm:text-base
            "
          >
            Experiences from customers who trust ISACO for natural wellness.
          </p>
        </div>

        {/* =====================================================
            REVIEWS PANEL
        ====================================================== */}

        <div
          className="
            relative
            overflow-hidden
            rounded-[2rem]
            bg-[#f1f4ee]
            px-5
            py-8
            sm:px-8
            sm:py-10
            lg:px-10
            lg:py-12
          "
        >

          {/* Decorative Green Shape — Top Right */}

          <div
            className="
              pointer-events-none
              absolute
              -right-20
              -top-24
              h-56
              w-56
              rounded-full
              bg-[#008a3e]
            "
          />

          {/* Decorative Green Shape — Bottom Left */}

          <div
            className="
              pointer-events-none
              absolute
              -bottom-28
              -left-20
              h-64
              w-64
              rounded-full
              bg-[#008a3e]
            "
          />

          {/* =================================================
              REVIEW CARDS
          ================================================== */}

          <div
            className="
              relative
              grid
              grid-cols-1
              gap-5
              md:grid-cols-3
            "
          >
            {reviews.map((item) => (
              <article
                key={item.name}
                className="
                  group
                  rounded-[1.75rem]
                  bg-white
                  p-6
                  shadow-[0_8px_30px_rgba(36,84,58,0.07)]
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-[0_14px_35px_rgba(36,84,58,0.12)]
                  sm:p-7
                "
              >

                {/* =================================================
                    QUOTE
                ================================================== */}

                <div
                  className="
                    font-serif
                    text-5xl
                    leading-none
                    text-[#d8c9a8]
                  "
                >
                  “
                </div>

                {/* =================================================
                    STARS
                ================================================== */}

                <div
                  className="
                    mt-2
                    flex
                    items-center
                    gap-1
                    text-[#dc2626]
                  "
                  aria-label={`${item.rating} out of 5 stars`}
                >
                  {Array.from(
                    { length: item.rating },
                    (_, index) => (
                      <span
                        key={`${item.name}-star-${index}`}
                        className="
                          text-[22px]
                          leading-none
                          drop-shadow-[0_1px_1px_rgba(0,0,0,0.08)]
                        "
                      >
                        ★
                      </span>
                    )
                  )}
                </div>

                {/* =================================================
                    URDU REVIEW
                ================================================== */}

                <p
                  dir="rtl"
                  className="
                    mt-4
                    text-sm
                    font-medium
                    leading-7
                    text-[#3f5147]
                  "
                >
                  {item.reviewUrdu}
                </p>

                {/* =================================================
                    ENGLISH REVIEW
                ================================================== */}

                <p
                  className="
                    mt-3
                    text-sm
                    leading-6
                    text-gray-500
                  "
                >
                  “{item.review}”
                </p>

                {/* =================================================
                    DIVIDER
                ================================================== */}

                <div className="my-5 h-px bg-[#e8e9e3]" />

                {/* =================================================
                    CUSTOMER
                ================================================== */}

                <div className="flex items-center gap-3">

                  <div
                    className="
                      flex
                      h-11
                      w-11
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-[#d9e4da]
                      bg-[#eef3ed]
                      text-sm
                      font-bold
                      text-[#24543a]
                    "
                  >
                    {item.name.charAt(0)}
                  </div>

                  <div>
                    <h3
                      className="
                        text-sm
                        font-semibold
                        text-gray-900
                      "
                    >
                      {item.name}
                    </h3>

                    <p
                      className="
                        mt-0.5
                        text-xs
                        text-gray-500
                      "
                    >
                      {item.location}
                    </p>
                  </div>

                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}