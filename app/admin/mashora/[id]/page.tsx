import Link from "next/link";
import { notFound } from "next/navigation";
import pool from "@/lib/db";
import MashoraReplyForm from "@/components/admin/mashora/MashoraReplyForm";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

type Consultation = {
  id: number;
  name: string;
  age: number;
  gender: string;
  email: string;
  phone: string | null;
  concern: string;
  duration: string | null;
  blood_pressure: string | null;
  diabetes: string | null;
  cholesterol: string | null;
  medicines: string | null;
  advice: string | null;
  status: string;
  created_at: string;
};

async function getConsultation(id: number): Promise<Consultation | null> {
  const result = await pool.query(
    `
      SELECT
        id,
        name,
        age,
        gender,
        email,
        phone,
        concern,
        duration,
        blood_pressure,
        diabetes,
        cholesterol,
        medicines,
        advice,
        status,
        created_at
      FROM mashora_consultations
      WHERE id = $1
      LIMIT 1
    `,
    [id]
  );

  return result.rows[0] || null;
}

export default async function MashoraDetailPage({ params }: Props) {
  const { id } = await params;

  const consultationId = Number(id);

  if (!Number.isInteger(consultationId)) {
    notFound();
  }

  const consultation = await getConsultation(consultationId);

  if (!consultation) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-6 py-8">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-8">
          <Link
            href="/admin/mashora"
            className="text-sm font-medium text-green-700 hover:underline"
          >
            ← Back to Mashora
          </Link>

          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Mashora Consultation
              </h1>

              <p className="mt-2 font-mono text-sm font-semibold text-green-700">
                ISACO-MASHORA-{consultation.id}
              </p>
            </div>

            <div>
              {consultation.status === "answered" ? (
                <span className="inline-flex items-center rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">
                  Answered
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">
                  Pending
                </span>
              )}
            </div>
          </div>
        </div>

        {/* =================================================
            PATIENT INFORMATION
        ================================================= */}

        <section className="mb-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

          <div className="border-b border-gray-200 px-6 py-5">
            <h2 className="text-lg font-semibold text-gray-900">
              Patient Information
            </h2>

            <p
              dir="rtl"
              className="mt-1 text-sm text-gray-500"
            >
              مریض کی معلومات
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 px-6 py-6 sm:grid-cols-2">

            {/* Name */}
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Name
              </p>

              <p className="mt-1 text-sm font-semibold text-gray-900">
                {consultation.name}
              </p>
            </div>

            {/* Age */}
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Age
              </p>

              <p className="mt-1 text-sm font-semibold text-gray-900">
                {consultation.age} years
              </p>
            </div>

            {/* Gender */}
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Gender
              </p>

              <p className="mt-1 text-sm font-semibold capitalize text-gray-900">
                {consultation.gender}
              </p>
            </div>

            {/* Email */}
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Email
              </p>

              <p className="mt-1 break-all text-sm font-semibold text-gray-900">
                {consultation.email}
              </p>
            </div>

            {/* Phone */}
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Phone
              </p>

              <p className="mt-1 text-sm font-semibold text-gray-900">
                {consultation.phone || "Not provided"}
              </p>
            </div>

            {/* Date */}
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Submitted
              </p>

              <p className="mt-1 text-sm font-semibold text-gray-900">
                {new Date(
                  consultation.created_at
                ).toLocaleString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

          </div>
        </section>

        {/* =================================================
            HEALTH INFORMATION
        ================================================= */}

        <section className="mb-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

          <div className="border-b border-gray-200 px-6 py-5">
            <h2 className="text-lg font-semibold text-gray-900">
              Health Information
            </h2>

            <p
              dir="rtl"
              className="mt-1 text-sm text-gray-500"
            >
              صحت سے متعلق معلومات
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 px-6 py-6 sm:grid-cols-3">

            {/* Blood Pressure */}
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Blood Pressure
              </p>

              <p className="mt-1 text-sm font-semibold text-gray-900">
                {consultation.blood_pressure || "Not provided"}
              </p>
            </div>

            {/* Diabetes */}
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Diabetes
              </p>

              <p className="mt-1 text-sm font-semibold text-gray-900">
                {consultation.diabetes || "Not provided"}
              </p>
            </div>

            {/* Cholesterol */}
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Cholesterol
              </p>

              <p className="mt-1 text-sm font-semibold text-gray-900">
                {consultation.cholesterol || "Not provided"}
              </p>
            </div>

            {/* Duration */}
            <div className="sm:col-span-3">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Duration of Concern
              </p>

              <p className="mt-1 text-sm font-semibold text-gray-900">
                {consultation.duration || "Not provided"}
              </p>
            </div>

          </div>
        </section>

        {/* =================================================
            CURRENT MEDICINES
        ================================================= */}

        <section className="mb-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

          <div className="border-b border-gray-200 px-6 py-5">
            <h2 className="text-lg font-semibold text-gray-900">
              Current Medicines / Supplements
            </h2>

            <p
              dir="rtl"
              className="mt-1 text-sm text-gray-500"
            >
              موجودہ ادویات / سپلیمنٹس
            </p>
          </div>

          <div className="px-6 py-6">
            <p className="whitespace-pre-wrap text-sm leading-7 text-gray-700">
              {consultation.medicines || "No medicines or supplements provided."}
            </p>
          </div>
        </section>

        {/* =================================================
            PATIENT CONCERN
        ================================================= */}

        <section className="mb-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

          <div className="border-b border-gray-200 px-6 py-5">
            <h2 className="text-lg font-semibold text-gray-900">
              Patient&apos;s Concern
            </h2>

            <p
              dir="rtl"
              className="mt-1 text-sm text-gray-500"
            >
              مریض کی شکایت / تکلیف
            </p>
          </div>

          <div className="px-6 py-7">
            <p className="whitespace-pre-wrap text-[15px] leading-8 text-gray-700">
              {consultation.concern}
            </p>
          </div>
        </section>

        {/* =================================================
            HAKEEM REPLY
        ================================================= */}

        <MashoraReplyForm
          consultationId={consultation.id}
          email={consultation.email}
          currentAdvice={consultation.advice}
          status={consultation.status}
        />

        {/* =================================================
            BOTTOM NAVIGATION
        ================================================= */}

        <div className="mt-6">
          <Link
            href="/admin/mashora"
            className="text-sm font-medium text-green-700 hover:underline"
          >
            ← Back to Mashora
          </Link>
        </div>

      </div>
    </main>
  );
}