"use client";

import { ChangeEvent, FormEvent, useState } from "react";

type ConsultationResponse = {
  id: number;
  reference: string;
  status: string;
  createdAt: string;
};

export default function MashoraForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [consultation, setConsultation] =
    useState<ConsultationResponse | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    email: "",
    phone: "",
    concern: "",
    duration: "",
    bloodPressure: "",
    diabetes: "",
    cholesterol: "",
    medicines: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/mashora", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to submit your consultation."
        );
      }

      setConsultation(data.consultation);
      setSubmitted(true);
    } catch (error) {
      console.error("Mashora form error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setConsultation(null);
    setError("");

    setFormData({
      name: "",
      age: "",
      gender: "",
      email: "",
      phone: "",
      concern: "",
      duration: "",
      bloodPressure: "",
      diabetes: "",
      cholesterol: "",
      medicines: "",
    });
  };

  /* =========================================================
     SUCCESS SCREEN
  ========================================================= */

  if (submitted) {
    return (
      <div className="py-10 text-center">
        {/* Success Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#eaf6ef]">
          <svg
            className="h-8 w-8 text-[#287a52]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h3 className="mt-6 text-2xl font-semibold text-gray-900">
          Consultation Submitted
        </h3>

        <p
          dir="rtl"
          className="mt-2 text-xl font-medium text-[#287a52]"
        >
          آپ کا مشورہ حکیم صاحب کو بھیج دیا گیا ہے
        </p>

        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-gray-500">
          Your consultation has been submitted successfully. Hakeem Sahib
          will review your concern and send his advice to your email address.
        </p>

        {/* Reference */}
        <div className="mx-auto mt-6 max-w-sm rounded-2xl bg-[#f6faf7] px-5 py-5">
          <p className="text-xs uppercase tracking-wide text-gray-400">
            Consultation Reference
          </p>

          <p className="mt-1 text-lg font-semibold text-[#287a52]">
            {consultation?.reference || "ISACO-MASHORA"}
          </p>

          <div className="mt-3 flex items-center justify-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-500" />

            <p className="text-xs text-gray-500">
              Pending · انتظار میں ہے
            </p>
          </div>
        </div>

        {/* Email Confirmation */}
        <div className="mx-auto mt-4 max-w-sm rounded-2xl border border-gray-100 bg-white px-5 py-4">
          <p className="text-xs text-gray-400">
            Response will be sent to
          </p>

          <p className="mt-1 break-all text-sm font-medium text-gray-700">
            {formData.email}
          </p>

          <p
            dir="rtl"
            className="mt-2 text-xs text-gray-400"
          >
            حکیم صاحب کا جواب اسی ای میل پر بھیجا جائے گا۔
          </p>
        </div>

        <button
          type="button"
          onClick={resetForm}
          className="mt-8 rounded-xl border border-[#287a52] px-6 py-3 text-sm font-semibold text-[#287a52] transition hover:bg-[#287a52] hover:text-white"
        >
          Submit Another Consultation
        </button>
      </div>
    );
  }

  /* =========================================================
     FORM
  ========================================================= */

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      {/* Error */}
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
        >
          {error}
        </div>
      )}

      {/* =====================================================
          NAME
      ===================================================== */}

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-semibold text-gray-800"
        >
          Your Name
          <span
            dir="rtl"
            className="ml-2 font-medium text-[#287a52]"
          >
            / آپ کا نام
          </span>
        </label>

        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          required
          disabled={loading}
          placeholder="Enter your name"
          className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#287a52] focus:ring-2 focus:ring-[#287a52]/10 disabled:cursor-not-allowed disabled:bg-gray-50"
        />
      </div>

      {/* =====================================================
          EMAIL
      ===================================================== */}

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-semibold text-gray-800"
        >
          Email Address
          <span
            dir="rtl"
            className="ml-2 font-medium text-[#287a52]"
          >
            / ای میل
          </span>
        </label>

        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={loading}
          placeholder="you@example.com"
          className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#287a52] focus:ring-2 focus:ring-[#287a52]/10 disabled:cursor-not-allowed disabled:bg-gray-50"
        />

        <p className="mt-2 text-xs leading-5 text-gray-400">
          Your email will be used to send Hakeem Sahib&apos;s response.
        </p>

        <p
          dir="rtl"
          className="mt-1 text-xs leading-6 text-gray-400"
        >
          آپ کا ای میل حکیم صاحب کا جواب بھیجنے کے لیے استعمال ہوگا۔
        </p>
      </div>

      {/* =====================================================
          AGE + GENDER
      ===================================================== */}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Age */}
        <div>
          <label
            htmlFor="age"
            className="block text-sm font-semibold text-gray-800"
          >
            Age
            <span
              dir="rtl"
              className="ml-2 font-medium text-[#287a52]"
            >
              / عمر
            </span>
          </label>

          <input
            id="age"
            name="age"
            type="number"
            min="1"
            max="120"
            value={formData.age}
            onChange={handleChange}
            required
            disabled={loading}
            placeholder="Your age"
            className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#287a52] focus:ring-2 focus:ring-[#287a52]/10 disabled:cursor-not-allowed disabled:bg-gray-50"
          />
        </div>

        {/* Gender */}
        <div>
          <label
            htmlFor="gender"
            className="block text-sm font-semibold text-gray-800"
          >
            Gender
            <span
              dir="rtl"
              className="ml-2 font-medium text-[#287a52]"
            >
              / جنس
            </span>
          </label>

          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            disabled={loading}
            className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 outline-none transition focus:border-[#287a52] focus:ring-2 focus:ring-[#287a52]/10 disabled:cursor-not-allowed disabled:bg-gray-50"
          >
            <option value="">Select gender</option>
            <option value="male">Male / مرد</option>
            <option value="female">Female / خواتین</option>
          </select>
        </div>
      </div>

      {/* =====================================================
          PHONE
      ===================================================== */}

      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-semibold text-gray-800"
        >
          Phone Number
          <span
            dir="rtl"
            className="ml-2 font-medium text-[#287a52]"
          >
            / فون نمبر
          </span>

          <span className="ml-2 text-xs font-normal text-gray-400">
            Optional
          </span>
        </label>

        <input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          disabled={loading}
          placeholder="03XX XXXXXXX"
          className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#287a52] focus:ring-2 focus:ring-[#287a52]/10 disabled:cursor-not-allowed disabled:bg-gray-50"
        />

        <p className="mt-2 text-xs leading-5 text-gray-400">
          Optional — You may leave this blank if you prefer not to share your
          phone number.
        </p>

        <p
          dir="rtl"
          className="mt-1 text-xs leading-6 text-gray-400"
        >
          اختیاری — اگر آپ فون نمبر شیئر نہیں کرنا چاہتے تو اسے خالی چھوڑ سکتے ہیں۔
        </p>
      </div>

      {/* =====================================================
          MAIN CONCERN
      ===================================================== */}

      <div>
        <label
          htmlFor="concern"
          className="block text-sm font-semibold text-gray-800"
        >
          Your Concern
          <span
            dir="rtl"
            className="ml-2 font-medium text-[#287a52]"
          >
            / آپ کی تکلیف
          </span>
        </label>

        <textarea
          id="concern"
          name="concern"
          value={formData.concern}
          onChange={handleChange}
          required
          disabled={loading}
          rows={7}
          placeholder="Apni kaifiyat, alamat aur jis maslay ke liye mashora chahte hain woh tafseel se likhein..."
          className="mt-2 w-full resize-y rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm leading-7 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#287a52] focus:ring-2 focus:ring-[#287a52]/10 disabled:cursor-not-allowed disabled:bg-gray-50"
        />

        <div className="mt-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-gray-400">
            You may write in English or Urdu.
          </p>

          <p
            dir="rtl"
            className="text-xs text-gray-400"
          >
            آپ اردو یا English میں لکھ سکتے ہیں
          </p>
        </div>
      </div>

      {/* =====================================================
          DURATION
      ===================================================== */}

      <div>
        <label
          htmlFor="duration"
          className="block text-sm font-semibold text-gray-800"
        >
          How long have you had this concern?
          <span
            dir="rtl"
            className="ml-2 font-medium text-[#287a52]"
          >
            / یہ تکلیف کب سے ہے؟
          </span>

          <span className="ml-2 text-xs font-normal text-gray-400">
            Optional
          </span>
        </label>

        <input
          id="duration"
          name="duration"
          type="text"
          value={formData.duration}
          onChange={handleChange}
          disabled={loading}
          placeholder="e.g. 2 weeks, 3 months, since childhood"
          className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#287a52] focus:ring-2 focus:ring-[#287a52]/10 disabled:cursor-not-allowed disabled:bg-gray-50"
        />
      </div>

      {/* =====================================================
          HEALTH INFORMATION
      ===================================================== */}

      <div className="rounded-2xl bg-[#f6faf7] p-5 sm:p-6">
        <div className="mb-5">
          <h3 className="text-base font-semibold text-gray-900">
            Health Information
          </h3>

          <p
            dir="rtl"
            className="mt-1 text-base font-medium text-[#287a52]"
          >
            صحت سے متعلق معلومات
          </p>

          <p className="mt-2 text-xs leading-5 text-gray-500">
            These fields are optional. Please provide them if you know your
            current readings or condition.
          </p>

          <p
            dir="rtl"
            className="mt-1 text-xs leading-6 text-gray-500"
          >
            یہ تمام معلومات اختیاری ہیں۔ اگر آپ کو اپنی موجودہ کیفیت یا رپورٹس
            کا علم ہے تو درج کر سکتے ہیں۔
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {/* Blood Pressure */}
          <div>
            <label
              htmlFor="bloodPressure"
              className="block text-sm font-semibold text-gray-800"
            >
              Blood Pressure
              <span
                dir="rtl"
                className="ml-1 font-medium text-[#287a52]"
              >
                / بلڈ پریشر
              </span>
            </label>

            <input
              id="bloodPressure"
              name="bloodPressure"
              type="text"
              value={formData.bloodPressure}
              onChange={handleChange}
              disabled={loading}
              placeholder="e.g. 120/80"
              className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#287a52] focus:ring-2 focus:ring-[#287a52]/10 disabled:cursor-not-allowed disabled:bg-gray-50"
            />
          </div>

          {/* Diabetes */}
          <div>
            <label
              htmlFor="diabetes"
              className="block text-sm font-semibold text-gray-800"
            >
              Diabetes
              <span
                dir="rtl"
                className="ml-1 font-medium text-[#287a52]"
              >
                / ذیابیطس
              </span>
            </label>

            <input
              id="diabetes"
              name="diabetes"
              type="text"
              value={formData.diabetes}
              onChange={handleChange}
              disabled={loading}
              placeholder="e.g. No / Yes / 110"
              className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#287a52] focus:ring-2 focus:ring-[#287a52]/10 disabled:cursor-not-allowed disabled:bg-gray-50"
            />
          </div>

          {/* Cholesterol */}
          <div>
            <label
              htmlFor="cholesterol"
              className="block text-sm font-semibold text-gray-800"
            >
              Cholesterol
              <span
                dir="rtl"
                className="ml-1 font-medium text-[#287a52]"
              >
                / کولیسٹرول
              </span>
            </label>

            <input
              id="cholesterol"
              name="cholesterol"
              type="text"
              value={formData.cholesterol}
              onChange={handleChange}
              disabled={loading}
              placeholder="e.g. 190 mg/dL"
              className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#287a52] focus:ring-2 focus:ring-[#287a52]/10 disabled:cursor-not-allowed disabled:bg-gray-50"
            />
          </div>
        </div>
      </div>

      {/* =====================================================
          MEDICINES
      ===================================================== */}

      <div>
        <label
          htmlFor="medicines"
          className="block text-sm font-semibold text-gray-800"
        >
          Current Medicines or Supplements
          <span
            dir="rtl"
            className="ml-2 font-medium text-[#287a52]"
          >
            / موجودہ ادویات یا سپلیمنٹس
          </span>

          <span className="ml-2 text-xs font-normal text-gray-400">
            Optional
          </span>
        </label>

        <textarea
          id="medicines"
          name="medicines"
          value={formData.medicines}
          onChange={handleChange}
          disabled={loading}
          rows={4}
          placeholder="Please mention any medicines or supplements you are currently using..."
          className="mt-2 w-full resize-y rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm leading-6 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#287a52] focus:ring-2 focus:ring-[#287a52]/10 disabled:cursor-not-allowed disabled:bg-gray-50"
        />
      </div>

      {/* =====================================================
          SUBMIT
      ===================================================== */}

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="group flex w-full items-center justify-center gap-3 rounded-xl bg-[#287a52] px-6 py-4 text-base font-semibold text-white shadow-sm transition hover:bg-[#216b47] hover:shadow-md active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? (
            <>
              <svg
                className="h-5 w-5 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-30"
                  cx="12"
                  cy="12"
                  r="9"
                  stroke="currentColor"
                  strokeWidth="3"
                />

                <path
                  className="opacity-90"
                  fill="currentColor"
                  d="M21 12a9 9 0 00-9-9v3a6 6 0 016 6h3z"
                />
              </svg>

              <span>Submitting...</span>

              <span dir="rtl">جمع ہو رہا ہے...</span>
            </>
          ) : (
            <>
              <span dir="rtl">مشورہ حاصل کریں</span>

              <span className="h-5 w-px bg-white/30" />

              <span>Get Advice</span>

              <svg
                className="h-5 w-5 transition-transform group-hover:translate-x-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 12h14M13 6l6 6-6 6"
                />
              </svg>
            </>
          )}
        </button>
      </div>

      {/* =====================================================
          PRIVACY
      ===================================================== */}

      <div className="text-center">
        <p className="text-xs leading-5 text-gray-400">
          Your information will be used only for providing consultation and
          sending Hakeem Sahib&apos;s response.
        </p>

        <p
          dir="rtl"
          className="mt-1 text-xs leading-6 text-gray-400"
        >
          آپ کی معلومات صرف مشورہ فراہم کرنے اور حکیم صاحب کا جواب بھیجنے کے لیے
          استعمال کی جائیں گی۔
        </p>
      </div>
    </form>
  );
}