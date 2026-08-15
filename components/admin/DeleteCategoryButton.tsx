
"use client";

import { useState } from "react";

type DeleteCategoryButtonProps = {
  id: number;
  name: string;
};

export default function DeleteCategoryButton({
  id,
  name,
}: DeleteCategoryButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  function openConfirm() {
    setError("");
    setShowConfirm(true);
  }

  function closeConfirm() {
    if (!deleting) {
      setShowConfirm(false);
      setError("");
    }
  }

  async function handleDelete() {
    setDeleting(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("id", String(id));

      const response = await fetch(
        "/api/admin/categories/delete",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error || "Unable to delete this category."
        );

        setDeleting(false);
        return;
      }

      window.location.href = "/admin/categories";
    } catch (error) {
      console.error("Delete category error:", error);

      setError(
        "Something went wrong while deleting the category."
      );

      setDeleting(false);
    }
  }

  return (
    <>
      {/* Delete Button */}
      <button
        type="button"
        onClick={openConfirm}
        disabled={deleting}
        className="font-medium text-red-600 transition hover:text-red-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Delete
      </button>

      {/* Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

            {/* Header */}
            <div className="mb-5 flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                <span className="text-xl">!</span>
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Admin
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Category deletion
                </p>
              </div>
            </div>

            {/* Error */}
            {error ? (
              <div className="rounded-xl bg-red-50 p-4">
                <p className="text-sm font-semibold text-red-800">
                  Cannot delete category
                </p>

                <p className="mt-2 text-sm leading-6 text-red-700">
                  {error}
                </p>
              </div>
            ) : (
              <div>
                <p className="text-gray-700">
                  Are you sure you want to delete:
                </p>

                <p className="mt-2 font-semibold text-gray-900">
                  "{name}"
                </p>

                <p className="mt-3 text-sm text-gray-500">
                  This action cannot be undone.
                </p>
              </div>
            )}

            {/* Buttons */}
            <div className="mt-6 flex justify-end gap-3">

              {error ? (
                <button
                  type="button"
                  onClick={closeConfirm}
                  className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
                >
                  Close
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={closeConfirm}
                    disabled={deleting}
                    className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleting}
                    className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {deleting ? "Deleting..." : "Delete Category"}
                  </button>
                </>
              )}

            </div>
          </div>
        </div>
      )}
    </>
  );
}

