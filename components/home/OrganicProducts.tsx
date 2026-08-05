import ProductCard from "../product/ProductCard";

const products = [
  {
    slug: "organic-honey",
    name: "Organic Natural Honey",
    image: "/products/honey.png",
    price: 2200,
    oldPrice: 2500,
    rating: 5,
    description:
      "Pure organic honey collected naturally for everyday wellness.",
  },
  {
    slug: "black-seed-oil",
    name: "Organic Black Seed Oil",
    image: "/products/black-seed-oil.png",
    price: 1450,
    oldPrice: 1650,
    rating: 5,
    description:
      "Premium cold-pressed black seed oil inspired by traditional wellness.",
  },
  {
    slug: "moringa-powder",
    name: "Organic Moringa Powder",
    image: "/products/moringa.png",
    price: 1100,
    oldPrice: 1300,
    rating: 5,
    description:
      "Natural moringa powder rich in daily nutrition.",
  },
  {
    slug: "olive-oil",
    name: "Extra Virgin Olive Oil",
    image: "/products/olive-oil.png",
    price: 1700,
    oldPrice: 1900,
    rating: 5,
    description:
      "Premium olive oil for natural healthy living.",
  },
];

export default function OrganicProducts() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-6">

        {/* Heading */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-green-800">
            Organic Products
          </h2>

          <p className="mt-3 text-gray-600">
            Naturally sourced products for a healthier lifestyle.
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