import Link from "next/link";
import pool from "@/lib/db";

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

async function getConsultations(): Promise<Consultation[]> {
  const result = await pool.query(`
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
    ORDER BY
      CASE
        WHEN status = 'pending' THEN 0
        ELSE 1
      END,
      created_at DESC
  `);

  return result.rows;
}

export default async function MashoraPage() {
  const consultations = await getConsultations();

  const pendingCount = consultations.filter(
    (consultation) => consultation.status === "pending"
  ).length;

  const answeredCount = consultations.filter(
    (consultation) => consultation.status === "answered"
  ).length;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-8">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/admin"
              className="text-sm font-medium text-green-700 hover:underline"
            >
              ← Back to Dashboard
            </Link>

            <h1 className="mt-3 text-3xl font-bold text-gray-900">
              Mashora
            </h1>

            <p className="mt-2 text-gray-600">
              Manage patient consultations and Hakeem Sahib&apos;s advice.
            </p>
          </div>
        </div>

        {/* =================================================
            SUMMARY CARDS
        ================================================= */}

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">

          {/* Total */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Consultations
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {consultations.length}
            </p>
          </div>

          {/* Pending */}
          <div className="rounded-xl border border-amber-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Pending
            </p>

            <p className="mt-2 text-3xl font-bold text-amber-600">
              {pendingCount}
            </p>
          </div>

          {/* Answered */}
          <div className="rounded-xl border border-green-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Answered
            </p>

            <p className="mt-2 text-3xl font-bold text-green-700">
              {answeredCount}
            </p>
          </div>
        </div>

        {/* =================================================
            CONSULTATIONS
        ================================================= */}

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

          {/* Table Header */}
          <div className="border-b border-gray-200 px-6 py-5">
            <h2 className="text-lg font-semibold text-gray-900">
              Consultation Requests
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              New consultations appear at the top of the list.
            </p>
          </div>

          {consultations.length === 0 ? (
            /* =================================================
               EMPTY STATE
            ================================================= */

            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
                <svg
                  className="h-7 w-7 text-green-700"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 10h8M8 14h5"
                  />

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20 11.5a8.5 8.5 0 01-12.9 7.3L4 20l1.2-3.1A8.5 8.5 0 1120 11.5z"
                  />
                </svg>
              </div>

              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                No consultations yet
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                New Mashora requests submitted by customers will appear here.
              </p>

              <p
                dir="rtl"
                className="mt-1 text-sm text-gray-500"
              >
                ابھی کوئی مشورہ موصول نہیں ہوا۔
              </p>
            </div>
          ) : (
            /* =================================================
               TABLE
            ================================================= */

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">

                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                    >
                      Reference
                    </th>

                    <th
                      scope="col"
                      className="whitespace-nowrap px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                    >
                      Customer
                    </th>

                    <th
                      scope="col"
                      className="whitespace-nowrap px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                    >
                      Concern
                    </th>

                    <th
                      scope="col"
                      className="whitespace-nowrap px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                    >
                      Status
                    </th>

                    <th
                      scope="col"
                      className="whitespace-nowrap px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                    >
                      Date
                    </th>

                    <th
                      scope="col"
                      className="whitespace-nowrap px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500"
                    >
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 bg-white">

                  {consultations.map((consultation) => (
                    <tr
                      key={consultation.id}
                      className="transition hover:bg-gray-50"
                    >

                      {/* Reference */}
                      <td className="whitespace-nowrap px-6 py-5">
                        <span className="font-mono text-sm font-semibold text-green-700">
                          ISACO-MASHORA-{consultation.id}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="px-6 py-5">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {consultation.name}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            {consultation.age} years ·{" "}
                            {consultation.gender === "male"
                              ? "Male"
                              : consultation.gender === "female"
                                ? "Female"
                                : consultation.gender}
                          </p>

                          <p className="mt-1 max-w-[220px] truncate text-xs text-gray-400">
                            {consultation.email}
                          </p>
                        </div>
                      </td>

                      {/* Concern */}
                      <td className="max-w-md px-6 py-5">
                        <p className="line-clamp-2 text-sm leading-6 text-gray-700">
                          {consultation.concern}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="whitespace-nowrap px-6 py-5">
                        {consultation.status === "answered" ? (
                          <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                            Answered
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                            Pending
                          </span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="whitespace-nowrap px-6 py-5 text-sm text-gray-500">
                        {new Date(
                          consultation.created_at
                        ).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      {/* Action */}
                      <td className="whitespace-nowrap px-6 py-5 text-right">
                        <Link
                          href={`/admin/mashora/${consultation.id}`}
                          className="inline-flex items-center rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-800"
                        >
                          View
                        </Link>
                      </td>

                    </tr>
                  ))}

                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* =================================================
            BOTTOM NAVIGATION
        ================================================= */}

        <div className="mt-6">
          <Link
            href="/admin"
            className="text-sm font-medium text-green-700 hover:underline"
          >
            ← Back to Dashboard
          </Link>
        </div>

      </div>
    </main>
  );
}