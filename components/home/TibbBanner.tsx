import Image from "next/image";
import Link from "next/link";

export default function TibbBanner() {
  return (
    <section className="bg-white py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">

        <div
          className="
            relative
            overflow-hidden
            rounded-3xl
            bg-white
            shadow-sm
          "
        >

          {/* =================================================
              BANNER IMAGE
          ================================================== */}

          <Image
            src="/banners/tibb-banner.webp"
            alt="Tibb-e-Nabawi Wellness"
            width={1920}
            height={1080}
            loading="lazy"
            sizes="
              (max-width: 640px) calc(100vw - 32px),
              (max-width: 1280px) calc(100vw - 48px),
              1200px
            "
            className="
              h-[360px]
              w-full
              object-cover
              sm:h-[400px]
              md:h-[440px]
            "
          />

          {/* =================================================
              SOFT OVERLAY
          ================================================== */}

          <div
            className="
              pointer-events-none
              absolute
              inset-0
              bg-gradient-to-r
              from-white/95
              via-white/75
              to-transparent
            "
          />

          {/* =================================================
              CONTENT
          ================================================== */}

          <div
            className="
              absolute
              inset-0
              flex
              items-center
            "
          >

            <div
              className="
                max-w-xl
                px-6
                sm:px-10
                md:px-14
              "
            >

              {/* =================================================
                  URDU HEADING
              ================================================== */}

              <h2
                dir="rtl"
                className="
                  text-2xl
                  font-bold
                  leading-relaxed
                  text-green-900
                  sm:text-3xl
                  md:text-4xl
                "
              >
                طبِ نبوی ﷺ سے متاثر
              </h2>

              {/* =================================================
                  ENGLISH HEADING
              ================================================== */}

              <p
                className="
                  mt-1
                  text-xl
                  font-semibold
                  text-green-800
                  sm:text-2xl
                  md:text-3xl
                "
              >
                Inspired by Tibb-e-Nabawi ﷺ
              </p>

              {/* =================================================
                  URDU DESCRIPTION
              ================================================== */}

              <p
                dir="rtl"
                className="
                  mt-4
                  max-w-lg
                  text-sm
                  leading-7
                  text-gray-700
                  sm:text-base
                "
              >
                قدرتی صحت اور روایتی حکمت کے اصولوں سے واقفیت حاصل کریں۔
              </p>

              {/* =================================================
                  ENGLISH DESCRIPTION
              ================================================== */}

              <p
                className="
                  mt-1
                  max-w-lg
                  text-sm
                  leading-6
                  text-gray-600
                  sm:text-base
                "
              >
                Discover the wisdom of traditional wellness and natural
                approaches to a healthier lifestyle.
              </p>

              {/* =================================================
                  BUTTON
              ================================================== */}

              <Link
                href="/knowledge-center"
                className="
                  mt-6
                  inline-flex
                  min-h-[46px]
                  items-center
                  justify-center
                  rounded-full
                  bg-green-800
                  px-7
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  shadow-sm
                  transition-all
                  duration-300
                  hover:bg-green-900
                  hover:shadow-md
                  active:scale-[0.98]
                "
              >
                Explore Knowledge →
              </Link>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}