import ProductCard from "../product/ProductCard";

const products = [
  {
    slug: "black-seed-oil",
    name: "Black Seed Oil Premium",
    image: "/products/black-seed-oil.png",
    price: 1450,
    oldPrice: 1650,
    rating: 5,
    description:
      "A premium natural oil traditionally used for daily wellness.",
  },
  {
    slug: "natural-honey",
    name: "Pure Sidr Honey",
    image: "/products/honey.png",
    price: 2200,
    oldPrice: 2500,
    rating: 5,
    description:
      "Premium quality honey selected for natural goodness.",
  },
  {
    slug: "moringa-powder",
    name: "Moringa Superfood Powder",
    image: "/products/moringa.png",
    price: 1100,
    oldPrice: 1300,
    rating: 5,
    description:
      "Nutrient-rich herbal powder for everyday nutrition.",
  },
  {
    slug: "olive-oil",
    name: "Extra Virgin Olive Oil",
    image: "/products/olive-oil.png",
    price: 1700,
    oldPrice: 1900,
    rating: 5,
    description:
      "Natural olive oil inspired by traditional wellness.",
  },
];

export default function BestSellers() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-6">

        {/* Heading */}
        <div className="relative mb-12">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-green-800">
              Best Sellers
            </h2>

            <p className="mt-3 text-gray-600">
              Customer favourites trusted for natural wellness.
            </p>
          </div>

          <button
            className="
              absolute
              right-0
              top-2
              font-semibold
              text-green-700
              transition
              hover:text-green-900
            "
          >
            View All →
          </button>
        </div>


        {/* Products */}
        <div
          className="
            grid
            grid-cols-1
            gap-8
            sm:grid-cols-2
            lg:grid-cols-4
          "
        >
          {products.map((product) => (
            <ProductCard
              key={product.slug}
              slug={product.slug}
              name={product.name}
              image={product.image}
              price={product.price}
              oldPrice={product.oldPrice}
              rating={product.rating}
              description={product.description}
            />
          ))}
        </div>

      </div>
    </section>
  );
}