import Image from "next/image";
import Link from "next/link";

export default function OrganicProducts() {
  return (
    <section className="bg-white py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">

        {/* Section Heading */}
        <div className="mb-8 text-center">

          {/* Urdu */}
          <h2
            dir="rtl"
            className="
              text-3xl
              font-bold
              text-green-800
              sm:text-4xl
            "
          >
            قدرتی اور نامیاتی مجموعہ
          </h2>

          {/* English */}
          <p className="mt-2 text-xl font-semibold text-green-700">
            Natural & Organic Collection
          </p>

          <p
            dir="rtl"
            className="
              mx-auto
              mt-3
              max-w-2xl
              text-sm
              leading-7
              text-gray-600
              sm:text-base
            "
          >
            خالص اجزاء، روایتی حکمت اور قدرتی صحت و تندرستی کے لیے منتخب
            قدرتی مصنوعات۔
          </p>

          <p className="mx-auto mt-1 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
            Pure ingredients, traditional wisdom and carefully selected
            natural products for everyday wellness.
          </p>

        </div>


        {/* Main Collection Banner */}
        <div
          className="
            overflow-hidden
            rounded-3xl
            bg-white
            shadow-sm
          "
        >
          <div
            className="
              grid
              items-center
              lg:grid-cols-2
            "
          >

            {/* Image */}
            <div
              className="
                relative
                flex
                min-h-[300px]
                items-center
                justify-center
                bg-[#f3efe5]
                p-6
                sm:min-h-[380px]
                sm:p-10
                lg:min-h-[450px]
              "
            >
              <Image
                src="/banners/organic-products.png"
                alt="قدرتی اور نامیاتی مصنوعات - Natural and Organic Collection"
                width={600}
                height={500}
                className="
                  h-auto
                  max-h-[360px]
                  w-full
                  max-w-[520px]
                  object-contain
                "
              />
            </div>


            {/* Content */}
            <div
              className="
                px-6
                py-10
                sm:px-10
                sm:py-14
                lg:px-16
              "
            >

              {/* Badge */}
           


              {/* Urdu Heading */}
              <h3
                dir="rtl"
                className="
                  mt-5
                  text-2xl
                  font-bold
                  leading-relaxed
                  text-gray-900
                  sm:text-3xl
                  text-left
                "
              >
                خالص اجزاء، روایتی حکمت
              </h3>


              {/* English Heading */}
              <p
                className="
                  mt-1
                  text-xl
                  font-semibold
                  text-green-700
                  sm:text-2xl
                "
              >
                Pure Ingredients. Traditional Wisdom.
              </p>


              {/* Urdu Description */}
              <p
                dir="rtl"
                className="
                  mt-5
                  max-w-lg
                  text-sm
                  leading-7
                  text-gray-600
                  sm:text-base
                "
              >
                قدرتی شہد، خالص تیل، جڑی بوٹیوں اور منتخب قدرتی اجزاء پر
                مشتمل ہماری کلیکشن، روزمرہ صحت اور تندرستی کے لیے۔
              </p>


              {/* English Description */}
              <p
                className="
                  mt-2
                  max-w-lg
                  text-sm
                  leading-7
                  text-gray-600
                  sm:text-base
                "
              >
                Discover naturally sourced honey, oils, herbs and carefully
                selected ingredients for everyday wellness.
              </p>


              {/* CTA Buttons */}
              <div
                className="
                  mt-7
                  flex
                  flex-col
                  gap-3
                  sm:flex-row
                "
              >

                {/* Urdu Button */}
                <Link
                  href="/shop"
                  dir="rtl"
                  className="
                    inline-flex
                    min-h-[48px]
                    items-center
                    justify-center
                    rounded-full
                    bg-green-700
                    px-7
                    text-sm
                    font-semibold
                    text-white
                    shadow-sm
                    transition-all
                    duration-200
                    hover:bg-green-800
                    active:scale-[0.98]
                  "
                >
                  قدرتی کلیکشن دیکھیں →
                </Link>


                {/* English Button */}
                <Link
                  href="/shop"
                  className="
                    inline-flex
                    min-h-[48px]
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-green-700
                    px-7
                    text-sm
                    font-semibold
                    text-green-700
                    transition-all
                    duration-200
                    hover:bg-green-50
                    active:scale-[0.98]
                  "
                >
                  Explore Natural Collection →
                </Link>

              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}