"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";


const concerns = [
  {
    title: "Digestive Health",
    description: "Support healthy digestion",
    image: "/health-concerns/digestive-health.png",
  },
  {
    title: "Immunity",
    description: "Strengthen natural defense",
    image: "/health-concerns/immunity.png",
  },
  {
    title: "Men's Health",
    description: "Natural wellness support",
    image: "/health-concerns/mens-health.png",
  },
  {
    title: "Women's Health",
    description: "Balanced wellness care",
    image: "/health-concerns/womens-health.png",
  },
  {
    title: "Joint Care",
    description: "Support bones & joints",
    image: "/health-concerns/joint-care.png",
  },
  {
    title: "Skin & Hair",
    description: "Natural beauty care",
    image: "/health-concerns/skin-hair.png",
  },
];


export default function HealthConcerns() {

  const sliderRef = useRef<HTMLDivElement>(null);

  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);


  const updateArrows = () => {

    if (!sliderRef.current) return;

    const {
      scrollLeft,
      scrollWidth,
      clientWidth,
    } = sliderRef.current;


    setShowLeft(scrollLeft > 10);

    setShowRight(
      scrollLeft < scrollWidth - clientWidth - 10
    );
  };


  const slide = (direction: "left" | "right") => {

    sliderRef.current?.scrollBy({
      left: direction === "right" ? 300 : -300,
      behavior: "smooth",
    });

    setTimeout(updateArrows, 400);
  };


  return (

    <section className="mx-auto max-w-7xl px-6 py-12">


      {/* Heading */}
      <div className="mb-10 text-center">

        <h2 className="text-3xl font-bold text-green-800">
          Shop by Health Concerns
        </h2>

        <p className="mt-2 text-sm text-gray-600">
          Find natural solutions for your wellness needs
        </p>

      </div>



      <div className="relative">


        {/* Left Arrow */}

        {showLeft && (

          <button
            onClick={() => slide("left")}
            className="
              absolute
              left-0
              top-1/2
              z-10
              -translate-y-1/2
              flex
              h-9
              w-9
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
            <ChevronLeft size={18}/>
          </button>

        )}



        {/* Right Arrow */}

        {showRight && (

          <button
            onClick={() => slide("right")}
            className="
              absolute
              right-0
              top-1/2
              z-10
              -translate-y-1/2
              flex
              h-9
              w-9
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
            <ChevronRight size={18}/>
          </button>

        )}




        {/* Circular Health Concerns */}

        <div
          ref={sliderRef}
          onScroll={updateArrows}
          className="
            flex
            gap-8
            overflow-hidden
            scroll-smooth
            px-4
          "
        >


          {concerns.map((item) => (

            <Link
              href="#"
              key={item.title}
              className="
                group
                min-w-[190px]
                text-center
                transition-all
                duration-300
                hover:-translate-y-2
              "
            >


              {/* Circle Image */}

              <div
  className="
    mx-auto
    mb-5
    flex
    h-40
    w-40
    items-center
    justify-center
    overflow-hidden
    rounded-full
    bg-green-50
    shadow-md
    transition-all
    duration-500
    group-hover:scale-90
    group-hover:shadow-xl
  "
>

                <Image
                  src={item.image}
                  alt={item.title}
                  width={150}
                  height={150}
                  className="
                    h-36
                    w-36
                    object-contain
                  "
                />

              </div>



              {/* Title */}

              <h3
                className="
                  text-sm
                  font-semibold
                  text-gray-900
                  transition-colors
                  group-hover:text-green-700
                "
              >
                {item.title}
              </h3>



              {/* Description */}

              <p className="mt-1 text-xs text-gray-500">
                {item.description}
              </p>


            </Link>

          ))}


        </div>


      </div>


    </section>

  );
}