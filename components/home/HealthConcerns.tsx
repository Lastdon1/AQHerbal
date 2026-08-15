
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import type { HealthConcern } from "@/lib/health-concerns";

type Props = {
  healthConcerns: HealthConcern[];
};

export default function HealthConcerns({
  healthConcerns,
}: Props) {
  const sliderRef =
    useRef<HTMLDivElement>(null);

  const [showLeft, setShowLeft] =
    useState(false);

  const [showRight, setShowRight] =
    useState(false);

  /* ============================================================
     UPDATE ARROWS
  ============================================================ */

  const updateArrows = () => {
    const slider =
      sliderRef.current;

    if (!slider) {
      return;
    }

    const {
      scrollLeft,
      scrollWidth,
      clientWidth,
    } = slider;

    setShowLeft(
      scrollLeft > 10
    );

    setShowRight(
      scrollLeft <
        scrollWidth -
          clientWidth -
          10
    );
  };

  /* ============================================================
     SLIDE
  ============================================================ */

  const slide = (
    direction: "left" | "right"
  ) => {
    const slider =
      sliderRef.current;

    if (!slider) {
      return;
    }

    slider.scrollBy({
      left:
        direction === "right"
          ? 300
          : -300,
      behavior: "smooth",
    });

    /*
     * Give the browser a moment to update the
     * scroll position before checking the arrows.
     */
    window.setTimeout(
      updateArrows,
      350
    );
  };

  /* ============================================================
     INITIAL ARROW STATE + RESIZE
  ============================================================ */

  useEffect(() => {
    const frame =
      window.requestAnimationFrame(
        updateArrows
      );

    const handleResize = () => {
      updateArrows();
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      window.cancelAnimationFrame(
        frame
      );

      window.removeEventListener(
        "resize",
        handleResize
      );
    };
  }, [healthConcerns]);

  return (
    <section
      id="health-concerns"
      className="
        mx-auto
        max-w-7xl
        scroll-mt-20
        px-6
        py-12
      "
    >
      {/* ========================================================
          HEADING
      ========================================================= */}

      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold text-green-800">
          صحت کے مسائل
        </h2>

        <p className="mt-1 text-lg text-gray-700">
          Health Concerns
        </p>
      </div>

      <div className="relative">
        {/* ======================================================
            LEFT ARROW
        ======================================================= */}

        {showLeft && (
          <button
            type="button"
            onClick={() =>
              slide("left")
            }
            aria-label="Previous health concerns"
            className="
              absolute
              left-0
              top-1/2
              z-10
              flex
              h-9
              w-9
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              bg-white
              shadow-md
              transition
              hover:bg-green-700
              hover:text-white
            "
          >
            <ChevronLeft
              size={18}
            />
          </button>
        )}

        {/* ======================================================
            RIGHT ARROW
        ======================================================= */}

        {showRight && (
          <button
            type="button"
            onClick={() =>
              slide("right")
            }
            aria-label="Next health concerns"
            className="
              absolute
              right-0
              top-1/2
              z-10
              flex
              h-9
              w-9
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              bg-white
              shadow-md
              transition
              hover:bg-green-700
              hover:text-white
            "
          >
            <ChevronRight
              size={18}
            />
          </button>
        )}

        {/* ======================================================
            HEALTH CONCERNS SLIDER
        ======================================================= */}

        <div
          ref={sliderRef}
          onScroll={updateArrows}
          className="
            flex
            gap-6
            overflow-x-auto
            overflow-y-hidden
            scroll-smooth
            px-4
            pb-2
            touch-pan-x
            [-ms-overflow-style:none]
            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
          "
        >
          {healthConcerns.length === 0 ? (
            <div className="w-full py-10 text-center">
              <p className="text-sm text-gray-500">
                No health concerns available.
              </p>
            </div>
          ) : (
            healthConcerns.map(
              (item) => (
                <Link
                  href={`/health-concern/${item.slug}`}
                  key={item.id}
                  className="
                    group
                    min-w-[140px]
                    flex-shrink-0
                    text-center
                    transition-transform
                    duration-200
                    hover:-translate-y-1
                    sm:min-w-[170px]
                    lg:min-w-[190px]
                  "
                >
                  {/* ==========================================
                      IMAGE
                  =========================================== */}

                  <div
                    className="
                      mx-auto
                      mb-0
                      flex
                      h-40
                      w-40
                      items-center
                      justify-center
                      transition-transform
                      duration-200
                      group-hover:scale-[1.04]
                    "
                  >
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={160}
                        height={160}
                        sizes="160px"
                        loading="lazy"
                        className="
                          h-40
                          w-40
                          object-contain
                        "
                      />
                    ) : (
                      <div
                        className="
                          flex
                          h-40
                          w-40
                          items-center
                          justify-center
                          rounded-full
                          bg-gray-100
                          text-xs
                          text-gray-400
                        "
                      >
                        No image
                      </div>
                    )}
                  </div>

                  {/* ==========================================
                      URDU TITLE
                  =========================================== */}

                  <p
                    dir="rtl"
                    className="
                      text-lg
                      font-semibold
                      leading-tight
                      text-green-700
                    "
                  >
                    {item.name_urdu}
                  </p>

                  {/* ==========================================
                      ENGLISH TITLE
                  =========================================== */}

                  <h3
                    className="
                      mt-1
                      text-sm
                      font-medium
                      text-gray-800
                      transition-colors
                      duration-150
                      group-hover:text-green-700
                    "
                  >
                    {item.name}
                  </h3>

                  {/* ==========================================
                      DESCRIPTION
                  =========================================== */}

                  {item.description && (
                    <p className="mt-1 text-xs text-gray-500">
                      {item.description}
                    </p>
                  )}
                </Link>
              )
            )
          )}
        </div>
      </div>
    </section>
  );
}

