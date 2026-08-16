import {
  Leaf,
  BookOpen,
  ShieldCheck,
  Truck,
} from "lucide-react";

const features = [
  {
    icon: Leaf,
    titleUrdu: "قدرتی اجزاء",
    title: "Natural Ingredients",
    descriptionUrdu:
      "قدرتی اور منتخب اجزاء جو روزمرہ صحت و تندرستی کے لیے موزوں ہیں۔",
    description:
      "Carefully selected natural ingredients for everyday wellness.",
  },
  {
    icon: BookOpen,
    titleUrdu: "طبِ نبوی ﷺ سے متاثر",
    title: "Tibb-e-Nabawi Inspired",
    descriptionUrdu:
      "روایتی حکمت اور قدرتی صحت کے اصولوں سے متاثر مصنوعات۔",
    description:
      "Inspired by traditional wellness practices and natural remedies.",
  },
  {
    icon: ShieldCheck,
    titleUrdu: "معیار کی یقین دہانی",
    title: "Quality Assured",
    descriptionUrdu:
      "معیار اور اعتماد کو مدِنظر رکھتے ہوئے منتخب کی گئی مصنوعات۔",
    description:
      "Products selected with trusted quality and care.",
  },
  {
    icon: Truck,
    titleUrdu: "قابلِ اعتماد ڈیلیوری",
    title: "Reliable Delivery",
    descriptionUrdu:
      "آپ کے دروازے تک محفوظ اور قابلِ اعتماد ڈیلیوری سروس۔",
    description:
      "Reliable delivery service bringing wellness to your doorstep.",
  },
];

export default function WhyChooseISACO() {
  return (
    <section className="bg-white py-10 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-3 sm:px-6">

        {/* =====================================================
            SECTION HEADING
        ====================================================== */}

        <div className="mx-auto mb-8 max-w-3xl text-center sm:mb-12">

          {/* Small Brand Label */}

          <div className="mb-3 flex items-center justify-center gap-2 sm:mb-4 sm:gap-3">
            <span className="h-px w-6 bg-[#b8a46a] sm:w-8" />

            <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#8b7745] sm:text-xs sm:tracking-[0.22em]">
              ISACO Wellness
            </span>

            <span className="h-px w-6 bg-[#b8a46a] sm:w-8" />
          </div>

          {/* Urdu Heading */}

          <h2
            dir="rtl"
            className="
              text-2xl
              font-bold
              leading-relaxed
              text-[#173f2b]
              sm:text-4xl
            "
          >
            آئی ساکو کا انتخاب کیوں؟
          </h2>

          {/* English Heading */}

          <p
            className="
              mt-1
              text-base
              font-semibold
              tracking-wide
              text-[#315c45]
              sm:mt-2
              sm:text-xl
            "
          >
            Why Choose ISACO?
          </p>

          {/* Divider */}

          <div className="mx-auto mt-3 h-px w-10 bg-[#b8a46a] sm:mt-5 sm:w-14" />

          {/* Urdu Description */}

          <p
            dir="rtl"
            className="
              mx-auto
              mt-3
              max-w-2xl
              text-xs
              leading-6
              text-[#59655e]
              sm:mt-5
              sm:text-base
              sm:leading-8
            "
          >
            قدرت، روایتی حکمت اور اعتماد کا امتزاج، آپ کی روزمرہ صحت و
            تندرستی کے لیے۔
          </p>

          {/* English Description */}

          <p
            className="
              mx-auto
              mt-1
              max-w-2xl
              text-xs
              leading-5
              text-[#737a75]
              sm:text-base
              sm:leading-7
            "
          >
            A thoughtful blend of nature, traditional wisdom and trust for
            your everyday wellness.
          </p>
        </div>

        {/* =====================================================
            FEATURE AREA
        ====================================================== */}

        <div
          className="
            relative
            overflow-hidden
            rounded-[1.25rem]
            bg-[#f1f3ed]
            px-2.5
            py-4
            shadow-[0_8px_30px_rgba(23,63,43,0.05)]
            sm:rounded-[2rem]
            sm:px-8
            sm:py-10
            lg:px-10
            lg:py-12
          "
        >

          {/* Subtle Decorative Elements */}

          <div
            className="
              pointer-events-none
              absolute
              -right-24
              -top-24
              h-64
              w-64
              rounded-full
              bg-green-700
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-28
              -left-24
              h-72
              w-72
              rounded-full
              bg-green-700
            "
          />

          {/* =================================================
              FEATURE GRID
          ================================================== */}

          <div
            className="
              relative
              grid
              grid-cols-2
              gap-2
              sm:grid-cols-2
              sm:gap-4
              lg:grid-cols-4
            "
          >
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="
                    group
                    rounded-xl
                    bg-white
                    px-2
                    py-4
                    text-center
                    shadow-[0_4px_16px_rgba(23,63,43,0.05)]
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:shadow-[0_12px_30px_rgba(23,63,43,0.10)]
                    sm:rounded-[1.5rem]
                    sm:px-5
                    sm:py-8
                  "
                >

                  {/* =================================================
                      ICON
                  ================================================== */}

                  <div
                    className="
                      mx-auto
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-full
                      bg-[#edf3ed]
                      text-[#28583e]
                      ring-1
                      ring-[#dce7dc]
                      transition-all
                      duration-300
                      group-hover:bg-[#e4eee5]
                      group-hover:ring-[#c8dacb]
                      sm:h-[68px]
                      sm:w-[68px]
                    "
                  >
                    <Icon
                      size={21}
                      strokeWidth={1.5}
                      className="sm:h-[29px] sm:w-[29px]"
                    />
                  </div>

                  {/* =================================================
                      URDU TITLE
                  ================================================== */}

                  <h3
                    dir="rtl"
                    className="
                      mt-3
                      text-xs
                      font-bold
                      leading-5
                      text-[#173f2b]
                      sm:mt-5
                      sm:text-lg
                      sm:leading-relaxed
                    "
                  >
                    {feature.titleUrdu}
                  </h3>

                  {/* =================================================
                      ENGLISH TITLE
                  ================================================== */}

                  <p
                    className="
                      mt-0.5
                      text-[9px]
                      font-semibold
                      leading-4
                      text-[#6f603b]
                      sm:mt-1
                      sm:text-sm
                    "
                  >
                    {feature.title}
                  </p>

                  {/* =================================================
                      SMALL ACCENT
                  ================================================== */}

                  <div className="mx-auto mt-2 h-px w-6 bg-[#c4b27d] sm:mt-4 sm:w-8" />

                  {/* =================================================
                      URDU DESCRIPTION
                  ================================================== */}

                  <p
                    dir="rtl"
                    className="
                      mx-auto
                      mt-2
                      max-w-xs
                      text-[9px]
                      leading-4
                      text-[#626c65]
                      sm:mt-4
                      sm:text-sm
                      sm:leading-7
                    "
                  >
                    {feature.descriptionUrdu}
                  </p>

                  {/* =================================================
                      ENGLISH DESCRIPTION
                  ================================================== */}

                  <p
                    className="
                      mx-auto
                      mt-1
                      max-w-xs
                      text-[8px]
                      leading-3.5
                      text-[#7b827d]
                      sm:mt-2
                      sm:text-xs
                      sm:leading-6
                    "
                  >
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}