import Link from "next/link";
import {
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";

import ContactForm from "@/components/contact/ContactForm";

const contactDetails = [
  {
    icon: Phone,
    title: "Call Us",
    titleUrdu: "ہمیں کال کریں",
    value: "+92 XXX XXXXXXX",
    href: "tel:+92XXXXXXXXXX",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    titleUrdu: "واٹس ایپ",
    value: "Chat with us on WhatsApp",
    href: "https://wa.me/92XXXXXXXXXX",
  },
  {
    icon: Mail,
    title: "Email",
    titleUrdu: "ای میل",
    value: "info@isaco.pk",
    href: "mailto:info@isaco.pk",
  },
  {
    icon: MapPin,
    title: "Our Location",
    titleUrdu: "ہمارا پتہ",
    value: "Pakistan",
    href: "#",
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="bg-green-50">
        <div className="mx-auto max-w-7xl px-6 py-14 text-center sm:py-16">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-700">
            Contact ISACO
          </p>

          <h1 className="mt-3 text-3xl font-bold text-green-950 sm:text-4xl md:text-5xl">
            We&apos;re Here to Help
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
            Have a question about our products, orders, or natural wellness?
            Get in touch with our team.
          </p>

          <p className="mt-3 text-xl font-medium text-green-800">
            ہم آپ کی مدد کے لیے موجود ہیں
          </p>
        </div>
      </section>

      {/* =====================================================
          CONTACT CONTENT
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-6 py-14 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          {/* =================================================
              CONTACT DETAILS
          ================================================== */}

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-green-700">
              Get In Touch
            </p>

            <h2 className="mt-2 text-3xl font-bold text-green-950">
              Contact Us
            </h2>

            <p className="mt-4 max-w-lg leading-7 text-gray-600">
              Our team is here to answer your questions and help you find the
              right information about ISACO products and services.
            </p>

            <div className="mt-8 space-y-4">
              {contactDetails.map((item) => {
                const Icon = item.icon;

                return (
                  <a
                    key={item.title}
                    href={item.href}
                    className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700">
                      <Icon size={22} />
                    </div>

                    <div>
                      <p className="text-sm text-green-700">
                        {item.titleUrdu}
                      </p>

                      <h3 className="font-semibold text-green-950">
                        {item.title}
                      </h3>

                      <p className="mt-0.5 text-sm text-gray-600">
                        {item.value}
                      </p>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>

          {/* =================================================
              CONTACT FORM
          ================================================== */}

          <ContactForm />
        </div>
      </section>

      {/* =====================================================
          WHATSAPP CTA
      ====================================================== */}

      <section className="bg-green-950">
        <div className="mx-auto max-w-4xl px-6 py-14 text-center sm:py-16">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Need a Quick Response?
          </h2>

          <p className="mx-auto mt-3 max-w-xl leading-7 text-green-100">
            Contact us directly through WhatsApp for quick assistance with
            your questions.
          </p>

          <Link
            href="https://wa.me/92XXXXXXXXXX"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-green-900 transition-colors hover:bg-green-50"
          >
            <MessageCircle size={18} />
            Chat on WhatsApp
          </Link>
        </div>
      </section>
    </main>
  );
}