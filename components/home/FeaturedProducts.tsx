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

export default function FeaturedProducts() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">

        {/* Heading */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-green-800">
            Featured Products
          </h2>

          <p className="mt-3 text-gray-600">
            Explore our premium herbal wellness collection.
          </p>
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