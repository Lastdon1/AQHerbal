export default function Newsletter() {
  return (
    <section className="bg-white py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-6">

        <div
          className="
            relative
            overflow-hidden
            rounded-[2rem]
            bg-[#f1f4ee]
            px-6
            py-12
            text-center
            sm:px-10
            sm:py-14
            md:px-16
          "
        >

          {/* =====================================================
              DECORATIVE GREEN SHAPE — TOP RIGHT
          ====================================================== */}

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

          {/* =====================================================
              DECORATIVE GREEN SHAPE — BOTTOM LEFT
          ====================================================== */}

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

          {/* =====================================================
              CONTENT
          ====================================================== */}

          <div className="relative">

            {/* Urdu Heading */}

            <h2
              dir="rtl"
              className="
                text-3xl
                font-bold
                leading-relaxed
                text-[#24543a]
                md:text-4xl
                font-[Noto_Nastaliq_Urdu]
              "
            >
              آئی ساکو کی صحت بخش دنیا سے جڑیں
            </h2>

            {/* Urdu Description */}

            <p
              dir="rtl"
              className="
                mx-auto
                mt-4
                max-w-2xl
                text-sm
                leading-8
                text-[#53645a]
                sm:text-base
                font-[Noto_Nastaliq_Urdu]
              "
            >
              قدرتی صحت کے مشورے، جڑی بوٹیوں کے رہنما اور خصوصی پیشکشیں
              اپنے ای میل میں حاصل کریں۔
            </p>

            {/* English Description */}

            <p
              className="
                mx-auto
                mt-2
                max-w-2xl
                text-sm
                leading-6
                text-gray-500
                sm:text-base
              "
            >
              Get natural health tips, herbal guides, and exclusive offers
              delivered to your inbox.
            </p>

            {/* =================================================
                NEWSLETTER FORM
            ================================================== */}

            <form
              className="
                mx-auto
                mt-8
                flex
                max-w-xl
                flex-col
                gap-3
                sm:flex-row
              "
            >
              <input
                type="email"
                placeholder="Enter your email"
                aria-label="Email address"
                className="
                  min-h-[50px]
                  flex-1
                  rounded-full
                  border
                  border-[#d9e2d9]
                  bg-white
                  px-6
                  py-3
                  text-sm
                  text-gray-900
                  shadow-sm
                  outline-none
                  transition
                  placeholder:text-gray-400
                  focus:border-[#008a3e]
                  focus:ring-2
                  focus:ring-[#008a3e]/10
                "
              />

              <button
                type="submit"
                className="
                  min-h-[50px]
                  rounded-full
                  bg-[#008a3e]
                  px-8
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  shadow-sm
                  transition-all
                  duration-200
                  hover:bg-[#007536]
                  hover:shadow-md
                  active:scale-[0.98]
                "
              >
                Subscribe
              </button>
            </form>

          </div>
        </div>
      </div>
    </section>
  );
}