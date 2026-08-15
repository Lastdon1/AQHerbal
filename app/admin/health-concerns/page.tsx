import DeleteHealthConcernButton from "@/components/admin/DeleteHealthConcernButton";
import Link from "next/link";
import pool from "@/lib/db";

type HealthConcern = {
  id: number;
  name: string;
  name_urdu: string | null;
  slug: string;
  description: string | null;
  description_urdu: string | null;
  image: string | null;
  sort_order: number;
  is_active: boolean;
};

async function getHealthConcerns(): Promise<HealthConcern[]> {
  const result = await pool.query(`
    SELECT
      id,
      name,
      name_urdu,
      slug,
      description,
      description_urdu,
      image,
      sort_order,
      is_active
    FROM health_concerns
    ORDER BY sort_order ASC, id DESC
  `);

  return result.rows;
}

export default async function HealthConcernsPage() {
  const healthConcerns = await getHealthConcerns();

  return (
    <main>
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
              Health Concerns
            </h1>

            <p className="mt-2 text-gray-600">
              Manage health concerns for your ISACO website.
            </p>
          </div>

          <Link
            href="/admin/health-concerns/new"
            className="inline-flex w-fit items-center rounded-lg bg-green-700 px-5 py-3 font-medium text-white transition hover:bg-green-800"
          >
            + Add Health Concern
          </Link>

        </div>

        {/* =================================================
            COUNT
        ================================================= */}

        <div className="mb-5">
          <p className="text-sm text-gray-500">
            Total Health Concerns:{" "}
            <span className="font-semibold text-gray-900">
              {healthConcerns.length}
            </span>
          </p>
        </div>

        {/* =================================================
            HEALTH CONCERNS
        ================================================= */}

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">

          {healthConcerns.length === 0 ? (

            /* =================================================
                EMPTY STATE
            ================================================= */

            <div className="px-6 py-16 text-center">

              <h2 className="text-lg font-semibold text-gray-900">
                No health concerns found
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                You do not have any health concerns in the
                database yet.
              </p>

              <Link
                href="/admin/health-concerns/new"
                className="mt-5 inline-flex rounded-lg bg-green-700 px-5 py-3 font-medium text-white transition hover:bg-green-800"
              >
                Add Your First Health Concern
              </Link>

            </div>

          ) : (

            /* =================================================
                TABLE
            ================================================= */

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1000px]">

                <thead className="border-b bg-gray-50">

                  <tr>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Health Concern
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Slug
                    </th>

                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                      Position
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y">

                  {healthConcerns.map((item) => (

                    <tr
                      key={item.id}
                      className="transition hover:bg-gray-50"
                    >

                      {/* =================================================
                          HEALTH CONCERN
                      ================================================= */}

                      <td className="px-6 py-4">

                        <div className="flex items-center gap-4">

                          {/* Image */}

                          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-100">

                            {item.image ? (

                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-full w-full object-cover"
                              />

                            ) : (

                              <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                                No Image
                              </div>

                            )}

                          </div>

                          {/* Names */}

                          <div>

                            <p className="font-semibold text-gray-900">
                              {item.name}
                            </p>

                            {item.name_urdu && (
                              <p
                                dir="rtl"
                                className="mt-1 text-sm text-gray-600"
                              >
                                {item.name_urdu}
                              </p>
                            )}

                            {item.description && (
                              <p className="mt-1 max-w-md truncate text-xs text-gray-400">
                                {item.description}
                              </p>
                            )}

                          </div>

                        </div>

                      </td>

                      {/* =================================================
                          SLUG
                      ================================================= */}

                      <td className="px-6 py-4">

                        <span className="text-sm text-gray-600">
                          /{item.slug}
                        </span>

                      </td>

                      {/* =================================================
                          POSITION
                      ================================================= */}

                      <td className="px-6 py-4 text-center">

                        <span
                          title="Position is managed from Edit"
                          className="inline-flex min-w-8 items-center justify-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700"
                        >
                          {item.sort_order}
                        </span>

                      </td>

                      {/* =================================================
                          STATUS
                      ================================================= */}

                      <td className="px-6 py-4">

                        <span
                          className={
                            item.is_active
                              ? "rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700"
                              : "rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
                          }
                        >
                          {item.is_active
                            ? "Active"
                            : "Inactive"}
                        </span>

                      </td>

                      {/* =================================================
                          ACTION
                      ================================================= */}

                      <td className="px-6 py-4 text-right">
  <div className="flex items-center justify-end">
    <Link
      href={`/admin/health-concerns/${item.id}/edit`}
      className="font-medium text-green-700 hover:underline"
    >
      Edit
    </Link>

    <DeleteHealthConcernButton
      id={item.id}
      name={item.name}
    />
  </div>
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

