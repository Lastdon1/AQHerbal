import Image from "next/image";

export default function TibbBanner() {
  return (
    <section className="py-20">

      <div className="mx-auto max-w-7xl px-6">

        <div
          className="
            relative
            overflow-hidden
            rounded-3xl
            bg-green-50
          "
        >

          {/* Banner Image */}

          <Image
            src="/banners/tibb-banner.png"
            alt="Tibb-e-Nabawi Wellness"
            width={1920}
            height={1080}
            className="
              h-[420px]
              w-full
              object-cover
            "
          />


          {/* Overlay Content */}

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
                px-8
                md:px-14
              "
            >

              <h2
                className="
                  text-3xl
                  font-bold
                  text-green-900
                  md:text-5xl
                "
              >
                Inspired by Tibb-e-Nabawi ﷺ
              </h2>


              <p
                className="
                  mt-5
                  text-lg
                  leading-8
                  text-gray-700
                "
              >
                Traditional wisdom combined with natural wellness
                for a healthier lifestyle.
              </p>


              <button
                className="
                  mt-8
                  rounded-full
                  bg-green-700
                  px-8
                  py-3
                  font-medium
                  text-white
                  transition
                  hover:bg-green-800
                "
              >
                Explore Knowledge
              </button>


            </div>

          </div>


        </div>

      </div>

    </section>
  );
}