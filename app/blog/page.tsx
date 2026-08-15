
import Image from "next/image";
import Link from "next/link";

const blogPosts = [
  {
    title: "Understanding Natural Wellness",
    titleUrdu: "قدرتی صحت اور تندرستی کو سمجھیں",
    excerpt:
      "Discover simple ways to support your everyday wellness through natural habits, balanced living, and informed choices.",
    image: "/blog/natural-wellness.jpg",
    category: "Wellness",
    href: "/blog/understanding-natural-wellness",
  },
  {
    title: "The Benefits of Herbal Ingredients",
    titleUrdu: "جڑی بوٹیوں کے قدرتی فوائد",
    excerpt:
      "Learn more about commonly used herbal ingredients and their traditional role in natural wellness.",
    image: "/blog/herbal-ingredients.jpg",
    category: "Herbs",
    href: "/blog/benefits-of-herbal-ingredients",
  },
  {
    title: "Healthy Habits for Everyday Life",
    titleUrdu: "روزمرہ زندگی میں صحت مند عادات",
    excerpt:
      "Small daily habits can make a meaningful difference. Explore practical ideas for a healthier lifestyle.",
    image: "/blog/healthy-habits.jpg",
    category: "Healthy Living",
    href: "/blog/healthy-habits",
  },
];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-green-50">
        <div className="mx-auto max-w-7xl px-6 py-14 text-center sm:py-16">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-green-700">
            ISACO Blog
          </p>

          <h1 className="text-3xl font-bold text-green-950 sm:text-4xl md:text-5xl">
            Knowledge for Better Wellness
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
            Explore helpful articles, wellness tips, herbal knowledge, and
            insights to help you make informed choices for your wellbeing.
          </p>

          <p className="mt-3 text-xl font-medium text-green-800">
            صحت، علم اور قدرتی تندرستی
          </p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="mx-auto max-w-7xl px-6 py-14 sm:py-16">
        <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-green-700">
              Latest Articles
            </p>

            <h2 className="mt-1 text-2xl font-bold text-green-950 sm:text-3xl">
              From Our Blog
            </h2>
          </div>

          <p className="max-w-xl text-sm leading-6 text-gray-600 sm:text-right">
            Useful information about natural wellness, herbs, healthy living,
            and traditional knowledge.
          </p>
        </div>

        <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <article
              key={post.href}
              className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Image */}
              <Link href={post.href}>
                <div className="relative aspect-[16/10] overflow-hidden bg-green-50">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </Link>

              {/* Content */}
              <div className="p-6">
                <span className="inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                  {post.category}
                </span>

                <p className="mt-4 text-sm font-medium text-green-700">
                  {post.titleUrdu}
                </p>

                <h3 className="mt-1 text-xl font-semibold leading-7 text-green-950">
                  {post.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  {post.excerpt}
                </p>

                <Link
                  href={post.href}
                  className="mt-5 inline-flex items-center text-sm font-semibold text-green-700 transition-colors hover:text-green-900"
                >
                  Read Article
                  <span className="ml-2 transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="bg-green-950">
        <div className="mx-auto max-w-4xl px-6 py-14 text-center sm:py-16">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Stay Connected With ISACO
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-green-100">
            Discover more wellness knowledge, herbal insights, and useful
            information through our Knowledge Center and blog.
          </p>

          <Link
            href="/knowledge-center"
            className="mt-7 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-green-900 transition hover:bg-green-50"
          >
            Visit Knowledge Center
          </Link>
        </div>
      </section>
    </main>
  );
}

