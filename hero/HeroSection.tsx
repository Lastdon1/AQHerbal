import Image from "next/image";

export default function HeroSection() {
  return (
   <section className="relative h-[70vh] min-h-[450px] max-h-[600px]">
      <Image
        src="/banners/hero-herbal.png"
        alt="AQ Herbal Natural Products"
        fill
        className="object-cover"
        priority
      />

      <div className="absolute inset-0 bg-black/20"></div>

      <div className="relative z-10 flex h-full items-center">
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="max-w-xl text-white">
            <h1 className="text-5xl font-bold">
              Natural Herbal Wellness
            </h1>

            <p className="mt-4 text-lg">
              Pure herbal products inspired by nature for your healthy lifestyle.
            </p>

           <button
  className="mt-6 rounded-full bg-green-700 px-8 py-3 text-white transition duration-300 hover:bg-green-900 hover:scale-105"
>
  Shop Now
</button>
          </div>
        </div>
      </div>
    </section>
  );
}