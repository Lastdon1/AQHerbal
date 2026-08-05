export default function WhyChooseAQ() {

  const features = [
    {
      icon: "🌿",
      title: "Natural Ingredients",
      description:
        "Carefully selected natural ingredients for everyday wellness."
    },
    {
      icon: "🕌",
      title: "Tibb-e-Nabawi Inspired",
      description:
        "Inspired by traditional wellness practices and natural remedies."
    },
    {
      icon: "✓",
      title: "Quality Assured",
      description:
        "Premium products prepared with trusted quality standards."
    },
    {
      icon: "🚚",
      title: "Fast Delivery",
      description:
        "Reliable delivery service bringing wellness to your doorstep."
    }
  ];


  return (
    <section className="bg-white py-16">

      <div className="mx-auto max-w-7xl px-6">


        {/* Section Heading */}

        <div className="mb-12 text-center">

          <h2 className="
            text-3xl
            font-semibold
            text-gray-900
          ">
            Why Choose AQ Herbal
          </h2>


          <p className="
            mt-3
            text-gray-600
          ">
            Inspired by Tibb-e-Nabawi ﷺ, rooted in nature, trusted for wellness
          </p>

        </div>



        {/* Features */}

        <div className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-4
          gap-8
        ">


          {features.map((feature) => (

            <div
              key={feature.title}
              className="
                group
                rounded-3xl
                bg-white
                p-8
                text-center
                shadow-sm
                transition
                hover:shadow-lg
              "
            >


              {/* Icon */}

              <div
                className="
                  mx-auto
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-full
                  bg-green-50
                  text-3xl
                  transition
                  group-hover:scale-110
                "
              >

                {feature.icon}

              </div>



              {/* Title */}

              <h3
                className="
                  mt-5
                  text-lg
                  font-semibold
                  text-gray-900
                "
              >
                {feature.title}
              </h3>



              {/* Description */}

              <p
                className="
                  mt-3
                  text-sm
                  leading-6
                  text-gray-600
                "
              >
                {feature.description}
              </p>


            </div>

          ))}


        </div>


      </div>

    </section>
  );
}