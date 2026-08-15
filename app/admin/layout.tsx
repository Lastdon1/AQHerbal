import Link from "next/link";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* =====================================================
          ADMIN HEADER
      ====================================================== */}

      <header className="border-b bg-white">
        <div className="mx-auto flex min-h-[70px] max-w-7xl items-center justify-between px-6">

          {/* BRAND */}

          <Link
            href="/admin"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-700 text-lg font-bold text-white">
              I
            </div>

            <div>
              <p className="text-lg font-bold leading-tight text-green-800">
                ISACO CMS
              </p>

              <p className="text-xs text-gray-500">
                Admin Dashboard
              </p>
            </div>
          </Link>

          {/* NAVIGATION */}

          <div className="flex items-center gap-2">

            <Link
              href="/admin"
              className="
                rounded-lg
                px-4
                py-2
                text-sm
                font-medium
                text-gray-600
                transition
                hover:bg-green-50
                hover:text-green-700
              "
            >
              Dashboard
            </Link>

            <AdminLogoutButton />

          </div>
        </div>
      </header>

      {/* =====================================================
          ADMIN CONTENT
      ====================================================== */}

      <div>
        {children}
      </div>
    </div>
  );
}