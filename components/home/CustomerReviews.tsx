const reviews = [
  {
    name: "Ahmeduddin Khan",
    location: "Karachi",
    review:
      "Excellent quality herbal products. The packaging and service were impressive.",
    rating: 5,
  },
  {
    name: "Fatima Ali",
    location: "Karachi",
    review:
      "Natural products with great quality. Delivery was fast and reliable.",
    rating: 5,
  },
  {
    name: "Muhammad Hassan",
    location: "Islamabad",
    review:
      "AQ Herbal provides trusted wellness products with premium quality.",
    rating: 5,
  },
];


export default function CustomerReviews() {

  return (

    <section className="bg-gray-50 py-20">

      <div className="mx-auto max-w-7xl px-6">


        {/* Heading */}

        <div className="mb-12 text-center">

          <h2
            className="
              text-4xl
              font-bold
              text-green-800
            "
          >
            Customer Reviews
          </h2>


          <p
            className="
              mt-3
              text-gray-600
            "
          >
            Trusted by customers who choose natural wellness.
          </p>


        </div>



        {/* Reviews */}

        <div
          className="
            grid
            grid-cols-1
            gap-8
            md:grid-cols-3
          "
        >

          {reviews.map((item) => (

            <div
              key={item.name}
              className="
                rounded-3xl
                bg-white
                p-8
                shadow-sm
                transition
                hover:-translate-y-2
                hover:shadow-xl
              "
            >


              {/* Stars */}

              <div className="text-yellow-500">

                {"★".repeat(item.rating)}

              </div>



              {/* Review */}

              <p
                className="
                  mt-5
                  leading-7
                  text-gray-600
                "
              >
                &ldquo;{item.review}&rdquo;
              </p>



              {/* Customer */}

              <div className="mt-6">

                <h3
                  className="
                    font-semibold
                    text-gray-900
                  "
                >
                  {item.name}
                </h3>


                <p
                  className="
                    text-sm
                    text-gray-500
                  "
                >
                  {item.location}
                </p>

              </div>


            </div>

          ))}


        </div>


      </div>


    </section>

  );
}