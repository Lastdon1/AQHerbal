import Link from "next/link";
import Image from "next/image";

const knowledgeCategories = [
  {
    title: "Health Guides",
    titleUrdu: "صحت کے رہنما",
    description:
      "Learn about common health concerns, their symptoms, lifestyle guidance, and natural wellness approaches.",
    image: "/knowledge-center/health-guides.jpg",
    href: "/knowledge-center/health-guides",
  },
  {
    title: "Herbal Ingredients",
    titleUrdu: "جڑی بوٹیوں اور اجزاء",
    description:
      "Explore herbs, natural ingredients, their traditional uses, and how they are commonly used in herbal wellness.",
    image: "/knowledge-center/herbal-ingredients.jpg",
    href: "/knowledge-center/herbal-ingredients",
  },
  {
    title: "Tibb & Wellness",
    titleUrdu: "طب اور صحت",
    description:
      "Discover traditional wellness knowledge and learn more about natural approaches to maintaining wellbeing.",
    image: "/knowledge-center/tibb-wellness.jpg",
    href: "/knowledge-center/tibb-wellness",
  },
  {
    title: "Frequently Asked Questions",
    titleUrdu: "اکثر پوچھے گئے سوالات",
    description:
      "Find answers to common questions about herbal products, usage, ingredients, and wellness.",
    image: "/knowledge-center/faqs.jpg",
    href: "/knowledge-center/faqs",
  },
];

export default function KnowledgeCenterPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-green-50">
        <div className="mx-auto max-w-7xl px-6 py-14 text-center sm:py-16">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-green-700">
            Knowledge Center
          </p>

          <h1 className="text-3xl font-bold text-green-950 sm:text-4xl md:text-5xl">
            Learn. Understand. Live Better.
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
            Explore useful information about natural wellness, herbal
            ingredients, health concerns, and traditional approaches to
            wellbeing.
          </p>

          <p className="mt-3 text-xl font-medium text-green-800">
            علم حاصل کریں، صحت کو سمجھیں
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-6 py-14 sm:py-16">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-green-950 sm:text-3xl">
            Explore Our Knowledge Center
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            Helpful resources to help you make better-informed wellness
            decisions.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {knowledgeCategories.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-green-50">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-5">
                <p className="text-sm font-medium text-green-700">
                  {item.titleUrdu}
                </p>

                <h3 className="mt-1 text-xl font-semibold text-green-950">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  {item.description}
                </p>

                <span className="mt-4 inline-flex items-center text-sm font-semibold text-green-700">
                  Explore
                  <span className="ml-2 transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Knowledge */}
      <section className="bg-green-950">
        <div className="mx-auto max-w-7xl px-6 py-14 text-center sm:py-16">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Natural Wellness Knowledge
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-green-100">
            Our Knowledge Center is designed to provide simple, educational
            information about herbs, traditional wellness, health concerns,
            and natural living.
          </p>

          <Link
            href="/shop"
            className="mt-7 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-green-900 transition hover:bg-green-50"
          >
            Explore Our Products
          </Link>
        </div>
      </section>
    </main>
  );
}