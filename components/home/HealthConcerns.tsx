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
  const sliderRef = useRef<HTMLDivElement>(null);

  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  /* ============================================================
     UPDATE ARROWS
  ============================================================ */

  const updateArrows = () => {
    const slider = sliderRef.current;

    if (!slider) {
      return;
    }

    const {
      scrollLeft,
      scrollWidth,
      clientWidth,
    } = slider;

    setShowLeft(scrollLeft > 10);

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
    const slider = sliderRef.current;

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
        w-full
        max-w-7xl
        min-w-0
        scroll-mt-20
        px-4
        py-8
        sm:px-6
        sm:py-12
      "
    >
      {/* ========================================================
          HEADING
      ========================================================= */}

      <div
        className="
          mb-7
          text-center
          sm:mb-10
        "
      >
        <h2
          dir="rtl"
          lang="ur"
          className="
            text-3xl
            font-bold
            leading-tight
            text-green-800
          "
        >
          صحت کے مسائل
        </h2>

        <p
          className="
            mt-1
            text-base
            text-gray-700
            sm:text-lg
          "
        >
          Health Concerns
        </p>
      </div>

      {/* ========================================================
          SLIDER WRAPPER

          IMPORTANT:
          This wrapper stays inside viewport.
      ========================================================= */}

      <div
        className="
          relative
          w-full
          min-w-0
          max-w-full
        "
      >
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
            <ChevronLeft size={18} />
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
            <ChevronRight size={18} />
          </button>
        )}

        {/* ======================================================
            HORIZONTAL SLIDER

            IMPORTANT:

            Mobile:
            - remains horizontally scrollable
            - does NOT make whole page wider

            Desktop:
            - same horizontal slider
        ======================================================= */}

        <div
          ref={sliderRef}
          onScroll={updateArrows}
          className="
            flex
            w-full
            max-w-full
            min-w-0
            gap-5
            overflow-x-auto
            overflow-y-hidden
            scroll-smooth
            px-3
            pb-3

            [-ms-overflow-style:none]
            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden

            sm:gap-6
            sm:px-4
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
                    w-[145px]
                    min-w-[145px]
                    max-w-[145px]
                    flex-shrink-0
                    text-center
                    transition-transform
                    duration-200
                    hover:-translate-y-1

                    sm:w-[170px]
                    sm:min-w-[170px]
                    sm:max-w-[170px]

                    lg:w-[190px]
                    lg:min-w-[190px]
                    lg:max-w-[190px]
                  "
                >
                  {/* ==========================================
                      IMAGE
                  =========================================== */}

                  <div
                    className="
                      mx-auto
                      mb-1
                      flex
                      h-[135px]
                      w-[135px]
                      items-center
                      justify-center
                      transition-transform
                      duration-200
                      group-hover:scale-[1.04]

                      sm:h-40
                      sm:w-40
                    "
                  >
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={160}
                        height={160}
                        sizes="
                          (max-width: 639px) 135px,
                          160px
                        "
                        loading="lazy"
                        className="
                          h-full
                          w-full
                          object-contain
                        "
                      />
                    ) : (
                      <div
                        className="
                          flex
                          h-full
                          w-full
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
                    lang="ur"
                    className="
                      text-base
                      font-semibold
                      leading-tight
                      text-green-700

                      sm:text-lg
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
                      text-[13px]
                      font-medium
                      leading-tight
                      text-gray-800
                      transition-colors
                      duration-150
                      group-hover:text-green-700

                      sm:text-sm
                    "
                  >
                    {item.name}
                  </h3>

                  {/* ==========================================
                      DESCRIPTION
                  =========================================== */}

                  {item.description && (
                    <p
                      className="
                        mt-1
                        line-clamp-2
                        text-[11px]
                        leading-4
                        text-gray-500

                        sm:text-xs
                      "
                    >
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