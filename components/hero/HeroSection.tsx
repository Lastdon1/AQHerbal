import Image from "next/image";

export default function HeroSection() {
  return (
    <section
      className="
        relative
        h-[260px]
        sm:h-[320px]
        md:h-[70vh]
        md:min-h-[450px]
        md:max-h-[600px]
        overflow-hidden
      "
    >

      <Image
        src="/banners/hero-herbal.png"
        alt="AQ Herbal Natural Products"
        fill
        className="
          object-cover
          object-center
        "
        priority
      />


      <div className="absolute inset-0 bg-black/20"></div>


      <div className="relative z-10 flex h-full items-center">

        <div className="mx-auto w-full max-w-7xl px-6">

          <div
            className="
              max-w-xl
              text-white
              text-center
              md:text-left
            "
          >

            <h1
              className="
                text-2xl
                sm:text-3xl
                md:text-5xl
                font-bold
              "
            >
              Natural Herbal Wellness
            </h1>


            <p
              className="
                mt-3
                text-sm
                sm:text-base
                md:text-lg
              "
            >
              Pure herbal products inspired by nature for your healthy lifestyle.
            </p>


            <button
              className="
                mt-4
                rounded-full
                bg-green-700
                px-6
                py-2
                md:px-8
                md:py-3
                text-white
                transition
                hover:bg-green-900
              "
            >
              Shop Now
            </button>


          </div>

        </div>

      </div>

    </section>
  );
}