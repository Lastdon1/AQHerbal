"use client";

import Image from "next/image";
import { useState } from "react";

const banners = [
  {
    src: "/banners/hero-herbal.webp",
    alt: "ISACO Herbal Wellness",

    label: "TRADITIONAL TIBB • NATURAL WELLNESS",

    title: "Natural Wellness,",
    titleSecond: "Rooted in Tradition",

    urdu: "قدرتی صحت، روایتی طب کی بنیاد پر",
  },

  {
    src: "/banners/honey-banner.webp",
    alt: "ISACO Natural Honey",
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const currentBanner = banners[currentSlide];

  function previousSlide() {
    setCurrentSlide((current) =>
      current === 0
        ? banners.length - 1
        : current - 1
    );
  }

  function nextSlide() {
    setCurrentSlide((current) =>
      current === banners.length - 1
        ? 0
        : current + 1
    );
  }

  const hasTextContent =
    currentBanner.label ||
    currentBanner.title ||
    currentBanner.titleSecond ||
    currentBanner.urdu;

  return (
    <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6">
      <div className="relative overflow-hidden rounded-2xl shadow-sm sm:rounded-3xl">

        {/* =================================================
            BANNER
        ================================================== */}

        <div className="relative">
          <Image
            src={currentBanner.src}
            alt={currentBanner.alt}
            width={1920}
            height={420}
            priority={currentSlide === 0}
            sizes="(max-width: 640px) calc(100vw - 32px), (max-width: 1280px) calc(100vw - 48px), 1200px"
            className="
              h-auto
              min-h-[220px]
              w-full
              object-cover
              object-center
              sm:min-h-[280px]
              lg:min-h-0
            "
          />

          {/* =================================================
              SUBTLE OVERLAY
          ================================================== */}

          <div
            className="
              pointer-events-none
              absolute
              inset-0
              bg-gradient-to-r
              from-black/10
              via-transparent
              to-transparent
            "
          />

          {/* =================================================
              HERO CONTENT
          ================================================== */}

          {hasTextContent && (
            <div
              className="
                absolute
                inset-5
                flex
                items-start
              "
            >
              <div
                className="
                  w-full
                  px-5
                  sm:px-8
                  lg:px-12
                "
              >

                {/* Small Brand Label */}

                {currentBanner.label && (
                  <div
                    className="
                      mb-2
                      inline-flex
                      rounded-full
                      bg-white/85
                      px-3
                      py-1
                      text-[10px]
                      font-semibold
                      tracking-wide
                      text-green-800
                      shadow-sm
                      backdrop-blur-sm
                      sm:mb-3
                      sm:px-4
                      sm:py-1.5
                      sm:text-xs
                    "
                  >
                    {currentBanner.label}
                  </div>
                )}

                {/* Main Heading */}

                {(currentBanner.title ||
                  currentBanner.titleSecond) && (
                  <h1
                    className="
                      max-w-[230px]
                      text-xl
                      font-bold
                      leading-tight
                      text-green-800
                      sm:max-w-md
                      sm:text-3xl
                      lg:max-w-xl
                      lg:text-4xl
                      xl:text-5xl
                    "
                  >
                    {currentBanner.title}

                    {currentBanner.titleSecond && (
                      <>
                        <br />
                        {currentBanner.titleSecond}
                      </>
                    )}
                  </h1>
                )}

                {/* Urdu Heading */}

                {currentBanner.urdu && (
                  <p
                    dir="rtl"
                    lang="ur"
                    className="
                      mt-1
                      max-w-[230px]
                      text-base
                      font-semibold
                      leading-8
                      text-green-900
                      sm:max-w-md
                      sm:text-xl
                      lg:text-2xl
                    "
                  >
                    {currentBanner.urdu}
                  </p>
                )}

              </div>
            </div>
          )}
        </div>

        {/* =================================================
            PREVIOUS BUTTON
        ================================================== */}

        <button
          type="button"
          onClick={previousSlide}
          aria-label="Previous banner"
          className="
            absolute
            left-2
            top-1/2
            z-20
            flex
            h-9
            w-9
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            bg-white/80
            text-gray-700
            shadow-sm
            backdrop-blur-sm
            transition
            hover:bg-white
            hover:text-green-700
            sm:left-4
            sm:h-10
            sm:w-10
          "
        >
          <span className="mb-1 text-2xl leading-none">
            ‹
          </span>
        </button>

        {/* =================================================
            NEXT BUTTON
        ================================================== */}

        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next banner"
          className="
            absolute
            right-2
            top-1/2
            z-20
            flex
            h-9
            w-9
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            bg-white/80
            text-gray-700
            shadow-sm
            backdrop-blur-sm
            transition
            hover:bg-white
            hover:text-green-700
            sm:right-4
            sm:h-10
            sm:w-10
          "
        >
          <span className="mb-1 text-2xl leading-none">
            ›
          </span>
        </button>

        {/* =================================================
            SLIDE DOTS
        ================================================== */}

        <div
          className="
            absolute
            bottom-3
            left-1/2
            z-20
            flex
            -translate-x-1/2
            items-center
            gap-1.5
            sm:bottom-4
          "
        >
          {banners.map((banner, index) => (
            <button
              key={banner.src}
              type="button"
              onClick={() =>
                setCurrentSlide(index)
              }
              aria-label={`Go to banner ${index + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "w-6 bg-green-700"
                  : "w-1.5 bg-white/80 hover:bg-white"
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}