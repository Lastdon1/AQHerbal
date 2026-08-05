import Image from "next/image";
export default function HeroSection() {
  return (
    <section className="bg-green-50">
      <div className="container mx-auto grid items-center gap-10 px-6 py-16 md:grid-cols-2">

        {/* Left Content */}
        <div>

          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-green-700">
            Natural Herbal Wellness
          </p>

          <h1 className="text-4xl font-bold leading-tight text-gray-900 md:text-6xl">
            Pure Herbal Products
            <span className="block text-green-700">
              For A Healthier Life
            </span>
          </h1>


          <p className="mt-6 max-w-lg text-lg text-gray-600">
            Discover premium herbal remedies made from natural ingredients.
            AQ Herbal brings you trusted wellness products inspired by nature.
          </p>


          <div className="mt-8 flex gap-4">

            <button
  className="mt-6 rounded-full bg-green-600 px-8 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:bg-green-800 hover:shadow-xl hover:-translate-y-1"
>
  Shop Now
</button>

            <button className="rounded-full border border-green-700 px-8 py-3 font-semibold text-green-700 hover:bg-green-100">
              Explore Products
            </button>

          </div>


          {/* Trust Badges */}
          <div className="mt-10 flex gap-8">

            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                100%
              </h3>
              <p className="text-sm text-gray-600">
                Natural
              </p>
            </div>


            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                50+
              </h3>
              <p className="text-sm text-gray-600">
                Herbal Products
              </p>
            </div>


            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                10K+
              </h3>
              <p className="text-sm text-gray-600">
                Happy Customers
              </p>
            </div>

          </div>

        </div>


        {/* Right Image */}
        <div className="flex justify-center">

          <div className="relative">

            <div className="absolute inset-0 rounded-full bg-green-200 blur-3xl"></div>

            <Image
  src="/banners/hero-herbal.png"
  alt="AQ Herbal Products"
  width={600}
  height={600}
  className="relative z-10 w-full max-w-md object-contain"
/>

          </div>

        </div>


      </div>
    </section>
  );
}