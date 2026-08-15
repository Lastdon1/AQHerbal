import MashoraForm from "@/components/mashora/MashoraForm";

export default function MashoraPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#f6faf7]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-medium text-[#287a52] shadow-sm">
              Mashora · مشورہ
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              Get Personalised Tibb Advice
            </h1>

            <p
              dir="rtl"
              className="mt-3 text-2xl font-medium text-[#287a52] sm:text-3xl"
            >
              حکیم صاحب سے مشورہ حاصل کریں
            </p>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
              Share your health concern with our Hakeem Sahib. You can write
              your question or describe your condition in either English or
              Urdu.
            </p>

            <p
              dir="rtl"
              className="mx-auto mt-2 max-w-2xl text-base leading-8 text-gray-600"
            >
              اپنی صحت سے متعلق اپنی کیفیت، علامات اور سوال اردو یا English
              میں تفصیل سے لکھیں۔
            </p>
          </div>
        </div>
      </section>

      {/* Consultation Form */}
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
          {/* Form Header */}
          <div className="border-b border-gray-100 bg-white px-6 py-7 sm:px-10">
            <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">
              Consultation Details
            </h2>

            <p
              dir="rtl"
              className="mt-1 text-lg font-medium text-[#287a52]"
            >
              مشورے کے لیے اپنی معلومات درج کریں
            </p>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              Please provide as much relevant information as possible so
              Hakeem Sahib can better understand your concern.
            </p>
          </div>

          <div className="px-6 py-8 sm:px-10 sm:py-10">
            <MashoraForm />
          </div>
        </div>

        {/* Important Note */}
        <div className="mx-auto mt-8 max-w-3xl rounded-2xl bg-[#f6faf7] px-5 py-5 text-center">
          <p className="text-sm font-medium text-gray-700">
            Important Note
          </p>

          <p
            dir="rtl"
            className="mt-1 text-sm leading-7 text-gray-600"
          >
            اہم: بہتر مشورے کے لیے اپنی علامات اور متعلقہ معلومات واضح طور پر
            درج کریں۔
          </p>

          <p className="mt-2 text-xs leading-5 text-gray-500">
            This consultation is intended for general Tibb guidance. In case
            of an emergency or serious medical condition, please seek
            immediate professional medical care.
          </p>
        </div>
      </section>
    </main>
  );
}