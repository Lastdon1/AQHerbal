"use client";

export default function AdminLogoutButton() {
  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("ADMIN LOGOUT ERROR:", error);
    } finally {
      window.location.href = "/login";
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="
        rounded-lg
        px-4
        py-2
        text-sm
        font-semibold
        text-red-600
        transition
        hover:bg-red-50
        hover:text-red-700
      "
    >
      Logout
    </button>
  );
}