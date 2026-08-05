import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-green-900 text-white">

      <div className="mx-auto max-w-7xl px-6 py-16">

       <div
  className="
    grid
    grid-cols-1
    gap-10
    divide-y
    divide-white/20
    md:grid-cols-2
    md:divide-y-0
    md:divide-x
    md:divide-white/20
    lg:grid-cols-4
  "
>

          {/* Brand */}

          <div>

            {/* Logo + AQ Herbal Name */}

            <div className="mb-5 flex items-center gap-3">

              <Image
                src="/logos/logo.png"
                alt="AQ Herbal"
                width={60}
                height={60}
              />

              <div>

                <h2
                  className="
                    text-2xl
                    font-bold
                    text-white
                    text-center
                  "
                >
                  AQ 
                </h2>

                <p
                  className="
                    text-sm
                    text-green-100
                  "
                >
                  Herbal Store
                </p>

              </div>

            </div>



            <p
              className="
                text-sm
                leading-7
                text-green-100
              "
            >
              Inspired by Tibb-e-Nabawi ﷺ,
              Trusted for Wellness.
              Natural herbal solutions rooted in
              tradition, purity and quality.
            </p>


          </div>



          {/* Quick Links */}

          <div>

            <h3
              className="
                mb-5
                text-lg
                font-semibold
              "
            >
              Quick Links
            </h3>


            <ul
              className="
                space-y-3
                text-sm
                text-green-100
              "
            >

              <li>Home</li>
              <li>About AQ Herbal</li>
              <li>Products</li>
              <li>Knowledge Center</li>
              <li>Contact Us</li>

            </ul>


          </div>



          {/* Categories */}

          <div>

            <h3
              className="
                mb-5
                text-lg
                font-semibold
              "
            >
              Categories
            </h3>


            <ul
              className="
                space-y-3
                text-sm
                text-green-100
              "
            >

              <li>Herbal Oils</li>
              <li>Natural Honey</li>
              <li>Organic Products</li>
              <li>Health Concerns</li>
              <li>Wellness Guides</li>

            </ul>


          </div>



          {/* Contact */}

          <div>

            <h3
              className="
                mb-5
                text-lg
                font-semibold
              "
            >
              Contact
            </h3>


            <ul
              className="
                space-y-3
                text-sm
                text-green-100
              "
            >

              <li>
                📞 WhatsApp: +92 XXX XXXXXXX
              </li>

              <li>
                ✉ Email: info@aqherbal.com
              </li>

              <li>
                🌿 Natural Wellness Store
              </li>

            </ul>


          </div>


        </div>


      </div>



      {/* Bottom Bar */}

      <div
        className="
          border-t
          border-green-800
          py-5
          text-center
          text-sm
          text-green-100
        "
      >

        © {new Date().getFullYear()} AQ Herbal.
        All rights reserved.

      </div>


    </footer>
  );
}