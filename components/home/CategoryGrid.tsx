"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const categories = [
  {
    title: "Herbal Medicines",
    description: "Traditional wellness",
    image: "/categories/herbal-medicines.png",
    badge: "Popular",
  },
  {
    title: "Natural Honey",
    description: "Pure natural nutrition",
    image: "/categories/honey.png",
    badge: "Pure",
  },
  {
    title: "Herbal Oils",
    description: "Body & hair care",
    image: "/categories/herbal-oils.png",
    badge: "Natural",
  },
  {
    title: "Immunity",
    description: "Natural defense support",
    image: "/categories/immunity.png",
    badge: "Trending",
  },
  {
    title: "Men's Wellness",
    description: "Natural solutions",
    image: "/categories/men-health.png",
    badge: "Featured",
  },
  {
    title: "Women's Wellness",
    description: "Balanced care",
    image: "/categories/women-health.png",
    badge: "New",
  },

  {
  title: "Skin Care",
  description: "Natural beauty and skincare",
  image: "/categories/skin-care.png",
  badge: "New",
},
];
export default function CategoryGrid() {

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

    if (!sliderRef.current) return;

    sliderRef.current.scrollBy({
      left: direction === "right" ? 300 : -300,
      behavior: "smooth",
    });

    setTimeout(updateArrows, 400);
  };


  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12">


      <div className="mb-8 text-center">

  <h2 className="text-3xl font-bold text-green-800">
    Shop by Category
  </h2>

  <p className="mt-2 text-sm text-gray-600">
    Explore natural wellness products   </p>

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
              border
              bg-white
              shadow-md
              hover:bg-green-700
              hover:text-white
            "
          >
            <ChevronRight size={18}/>
          </button>
        )}



        {/* Cards */}
        <div
          ref={sliderRef}
          onScroll={updateArrows}
          className="
            flex
            gap-4
            overflow-hidden
            scroll-smooth
            px-2
          "
        >

          {categories.map((category)=> (

           <Link
           
  href="#"
  key={category.title}
  className="
    group
    relative
    min-w-[160px] sm:min-w-[190px] lg:min-w-[210px]
    overflow-hidden
    rounded-xl
    bg-white
    p-4
    text-center
    shadow-md
    transition-all
    duration-300
    hover:-translate-y-2
    hover:shadow-2xl
  "
>
{/* Badge */}
  <span
    className="
      absolute
      right-3
      top-3
      rounded-full
      bg-green-50
      px-3
      py-1
      text-[10px]
      font-semibold
      uppercase
      tracking-wide
      text-green-700
      transition
      group-hover:bg-green-700
      group-hover:text-white
    "
  >
    {category.badge}
  </span>
              <div
  className="
    mx-auto
    mb-3
    flex
    h-20
w-20
sm:h-24
sm:w-24
    items-center
    justify-center
    rounded-full
    bg-green-50
    transition-all
    duration-500
    group-hover:bg-green-100
  "
>

                <Image
                  src={category.image}
                  alt={category.title}
                  width={90}
                  height={90}
                  className="
  h-16
w-16
sm:h-20
sm:w-20
  object-contain
  transition-transform
  duration-500
  group-hover:scale-110
"
                />

              </div>


              <h3 className="
  text-sm
  font-semibold
  text-gray-900
  transition-colors
  duration-300
  group-hover:text-green-700
">
                {category.title}
              </h3>


              <p className="mt-1 text-xs text-gray-500">
  {category.description}
</p>

<span
  className="
    mt-3
    inline-block
    text-xs
    font-medium
    text-green-700
    opacity-0
    translate-y-2
    transition-all
    duration-300
    group-hover:opacity-100
    group-hover:translate-y-0
  "
>
  Explore →
</span>

            </Link>

          ))}

        </div>

      </div>

    </section>
  );
}