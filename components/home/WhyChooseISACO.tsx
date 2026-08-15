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
    <section className="bg-white py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">

        {/* =====================================================
            SECTION HEADING
        ====================================================== */}

        <div className="mx-auto mb-12 max-w-3xl text-center">

          {/* Small Brand Label */}
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#b8a46a]" />

            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8b7745]">
              ISACO Wellness
            </span>

            <span className="h-px w-8 bg-[#b8a46a]" />
          </div>

          {/* Urdu Heading */}
          <h2
            dir="rtl"
            className="
              text-3xl
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
              mt-2
              text-lg
              font-semibold
              tracking-wide
              text-[#315c45]
              sm:text-xl
            "
          >
            Why Choose ISACO?
          </p>

          {/* Divider */}
          <div className="mx-auto mt-5 h-px w-14 bg-[#b8a46a]" />

          {/* Urdu Description */}
          <p
            dir="rtl"
            className="
              mx-auto
              mt-5
              max-w-2xl
              text-sm
              leading-8
              text-[#59655e]
              sm:text-base
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
              text-sm
              leading-7
              text-[#737a75]
              sm:text-base
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
            rounded-[2rem]
            bg-[#f1f3ed]
            px-5
            py-8
            shadow-[0_12px_40px_rgba(23,63,43,0.06)]
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
              grid-cols-1
              gap-4
              sm:grid-cols-2
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
                    rounded-[1.5rem]
                    bg-white
                    px-5
                    py-8
                    text-center
                    shadow-[0_6px_24px_rgba(23,63,43,0.05)]
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:shadow-[0_12px_30px_rgba(23,63,43,0.10)]
                  "
                >
                  {/* =================================================
                      ICON
                  ================================================== */}

                  <div
                    className="
                      mx-auto
                      flex
                      h-[68px]
                      w-[68px]
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
                    "
                  >
                    <Icon
                      size={29}
                      strokeWidth={1.5}
                    />
                  </div>

                  {/* =================================================
                      URDU TITLE
                  ================================================== */}

                  <h3
                    dir="rtl"
                    className="
                      mt-5
                      text-lg
                      font-bold
                      leading-relaxed
                      text-[#173f2b]
                    "
                  >
                    {feature.titleUrdu}
                  </h3>

                  {/* =================================================
                      ENGLISH TITLE
                  ================================================== */}

                  <p
                    className="
                      mt-1
                      text-sm
                      font-semibold
                      text-[#6f603b]
                    "
                  >
                    {feature.title}
                  </p>

                  {/* =================================================
                      SMALL ACCENT
                  ================================================== */}

                  <div className="mx-auto mt-4 h-px w-8 bg-[#c4b27d]" />

                  {/* =================================================
                      URDU DESCRIPTION
                  ================================================== */}

                  <p
                    dir="rtl"
                    className="
                      mx-auto
                      mt-4
                      max-w-xs
                      text-sm
                      leading-7
                      text-[#626c65]
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
                      mt-2
                      max-w-xs
                      text-xs
                      leading-6
                      text-[#7b827d]
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