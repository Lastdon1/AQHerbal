import ProductCard from "../products/ProductCard";


const products = [
  {
    name: "Black Seed Oil",
    image: "/products/black-seed-oil.png",
    price: "Rs. 1,250",
    rating: 5,
    description:
      "Premium black seed oil inspired by traditional wellness practices."
  },
  {
    name: "Honey",
    image: "/products/honey.png",
    price: "Rs. 1,850",
    rating: 5,
    description:
      "Pure natural honey selected for quality and everyday wellness."
  },
  {
    name: "Moringa Powder",
    image: "/products/moringa.png",
    price: "Rs. 950",
    rating: 5,
    description:
      "Nutrient-rich moringa powder for natural daily nutrition."
  },
  {
    name: "Olive Oil",
    image: "/products/olive-oil.png",
    price: "Rs. 1,450",
    rating: 5,
    description:
      "Premium olive oil inspired by traditional healthy living."
  },
];


export default function FeaturedProducts() {

  return (

    <section className="bg-gray-50 py-20">

      <div className="mx-auto max-w-7xl px-6">


        {/* Heading */}

        <div className="relative mb-12">

          <div className="text-center">

            <h2 className="
              text-4xl
              font-bold
              text-green-800
            ">
              Featured Products
            </h2>


            <p className="
              mt-3
              text-gray-600
            ">
              Discover our most popular herbal products.
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



        {/* Product Grid */}

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
              key={product.name}
              name={product.name}
              image={product.image}
              price={product.price}
              rating={product.rating}
               description={product.description}
            />

          ))}


        </div>


      </div>

    </section>

  );
}