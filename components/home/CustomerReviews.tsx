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
    <section className="relative overflow-hidden bg-white py-10 sm:py-12">

      {/* =====================================================
          LIGHT BLUE CURVED WAVE BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none absolute inset-x-0 top-0 h-[52%] overflow-hidden">
        <div
          className="
            absolute
            -left-[8%]
            -top-[42%]
            h-[115%]
            w-[116%]
            rounded-[0_0_50%_50%]
            bg-[#eaf5fa]
          "
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">

        {/* =====================================================
            HEADING
        ====================================================== */}

        <div className="mb-9 text-center">

          <div className="mb-3 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#b8d7e5] sm:w-12" />

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

            <span className="h-px w-8 bg-[#b8d7e5] sm:w-12" />
          </div>

          {/* Urdu Heading */}

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

          {/* English Heading */}

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

          {/* Urdu Description */}

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

          {/* English Description */}

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
            bg-[#eaf5fa]
            px-3
            py-6
            sm:px-8
            sm:py-10
            lg:px-10
            lg:py-12
          "
        >

          {/* =================================================
              DECORATIVE LIGHT BLUE SHAPES
          ================================================== */}

          <div
            className="
              pointer-events-none
              absolute
              -right-20
              -top-24
              h-56
              w-56
              rounded-full
              bg-[#cfe9f3]
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-28
              -left-20
              h-64
              w-64
              rounded-full
              bg-[#d8edf5]
            "
          />

          {/* =================================================
              REVIEW CARDS
              Mobile: 2 cards per row
              Desktop: 3 cards per row
          ================================================== */}

          <div
            className="
              relative
              grid
              grid-cols-2
              gap-3
              md:grid-cols-3
              md:gap-5
            "
          >
            {reviews.map((item) => (
              <article
                key={item.name}
                className="
                  group
                  min-w-0
                  rounded-[1.25rem]
                  border
                  border-[#d9e8da]
                  bg-[#f0f6f0]
                  p-3.5
                  shadow-[0_8px_25px_rgba(36,84,58,0.07)]
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:bg-[#edf5ed]
                  hover:shadow-[0_14px_32px_rgba(36,84,58,0.12)]
                  sm:rounded-[1.75rem]
                  sm:p-7
                "
              >

                {/* =================================================
                    QUOTE
                ================================================== */}

                <div
                  className="
                    font-serif
                    text-3xl
                    leading-none
                    text-[#c4b27d]
                    sm:text-5xl
                  "
                >
                  “
                </div>

                {/* =================================================
                    STARS
                ================================================== */}

                <div
                  className="
                    mt-1
                    flex
                    items-center
                    gap-0.5
                    text-[#d6b64c]
                    sm:mt-2
                    sm:gap-1
                  "
                  aria-label={`${item.rating} out of 5 stars`}
                >
                  {Array.from(
                    { length: item.rating },
                    (_, index) => (
                      <span
                        key={`${item.name}-star-${index}`}
                        className="
                          text-[13px]
                          leading-none
                          drop-shadow-[0_1px_1px_rgba(0,0,0,0.08)]
                          sm:text-[22px]
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
                    mt-3
                    break-words
                    text-[10px]
                    font-medium
                    leading-5
                    text-[#315441]
                    sm:mt-4
                    sm:text-sm
                    sm:leading-7
                  "
                >
                  {item.reviewUrdu}
                </p>

                {/* =================================================
                    ENGLISH REVIEW
                ================================================== */}

                <p
                  className="
                    mt-2
                    break-words
                    text-[10px]
                    leading-4
                    text-[#68776e]
                    sm:mt-3
                    sm:text-sm
                    sm:leading-6
                  "
                >
                  “{item.review}”
                </p>

                {/* =================================================
                    DIVIDER
                ================================================== */}

                <div className="my-3 h-px bg-[#d8e4d9] sm:my-5" />

                {/* =================================================
                    CUSTOMER
                ================================================== */}

                <div className="flex min-w-0 items-center gap-2 sm:gap-3">

                  {/* Avatar */}

                  <div
                    className="
                      flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-[#c8dccb]
                      bg-[#dfeee1]
                      text-[10px]
                      font-bold
                      text-[#24543a]
                      sm:h-11
                      sm:w-11
                      sm:text-sm
                    "
                  >
                    {item.name.charAt(0)}
                  </div>

                  {/* Customer Info */}

                  <div className="min-w-0">
                    <h3
                      className="
                        truncate
                        text-[10px]
                        font-semibold
                        text-[#173f2b]
                        sm:text-sm
                      "
                    >
                      {item.name}
                    </h3>

                    <p
                      className="
                        mt-0.5
                        text-[9px]
                        text-[#718078]
                        sm:text-xs
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