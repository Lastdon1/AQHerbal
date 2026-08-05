export default function Newsletter() {
  return (
    <section className="py-20">

      <div className="mx-auto max-w-7xl px-6">

        <div
          className="
            rounded-3xl
            bg-green-50
            px-6
            py-14
            text-center
            md:px-16
          "
        >

          <h2
            className="
              text-3xl
              font-bold
              text-green-900
              md:text-4xl
            "
          >
            Join AQ Herbal Wellness
          </h2>


          <p
            className="
              mx-auto
              mt-4
              max-w-2xl
              text-gray-600
            "
          >
            Get natural health tips, herbal guides,
            and exclusive offers delivered to your inbox.
          </p>



          <form
            className="
              mx-auto
              mt-8
              flex
              max-w-xl
              flex-col
              gap-4
              sm:flex-row
            "
          >

            <input
              type="email"
              placeholder="Enter your email"
              className="
                flex-1
                rounded-full
                border
                border-gray-200
                px-6
                py-3
                outline-none
                focus:border-green-600
              "
            />


            <button
              className="
                rounded-full
                bg-green-700
                px-8
                py-3
                font-medium
                text-white
                transition
                hover:bg-green-800
              "
            >
              Subscribe
            </button>


          </form>


        </div>

      </div>

    </section>
  );
}