import ProductCard from "../products/ProductCard";


const products = [
  {
    name: "Organic Honey",
    image: "/products/organic-honey.png",
    price: "Rs. 1,500",
    rating: 5,
    description:
      "Pure natural honey collected from trusted sources."
  },
  {
    name: "Black Seed Oil",
    image: "/products/black-seed-oil.png",
    price: "Rs. 1,200",
    rating: 5,
    description:
      "Traditional wellness oil made from premium black seeds."
  },
  {
    name: "Organic Herbal Powder",
    image: "/products/herbal-powder.png",
    price: "Rs. 900",
    rating: 5,
    description:
      "Naturally processed herbal ingredients for daily wellness."
  },
  {
    name: "Organic Dates",
    image: "/products/organic-dates.png",
    price: "Rs. 1,800",
    rating: 5,
    description:
      "Premium quality natural dates selected for wellness."
  },
];


export default function OrganicProducts() {

  return (

    <section className="bg-white py-20">

      <div className="mx-auto max-w-7xl px-6">


        {/* Heading */}

        <div className="relative mb-12">

          <div className="text-center">

            <h2
              className="
                text-4xl
                font-bold
                text-green-800
              "
            >
              Organic Products
            </h2>


            <p
              className="
                mt-3
                text-gray-600
              "
            >
              Pure natural products selected for your everyday wellness.
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