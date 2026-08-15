"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type DeleteHealthConcernButtonProps = {
  id: number;
  name: string;
};

type DeleteResponse = {
  error?: string;
  products?: {
    id: number;
    name: string;
  }[];
};

export default function DeleteHealthConcernButton({
  id,
  name,
}: DeleteHealthConcernButtonProps) {
  const router = useRouter();

  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      `ISACO\n\nAre you sure you want to delete "${name}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);

      const response = await fetch("/api/admin/health-concerns", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });

      const data: DeleteResponse = await response.json();

      if (!response.ok) {
        if (response.status === 409 && data.products?.length) {
          const productList = data.products
            .map((product) => `• ${product.name}`)
            .join("\n");

          window.alert(
            `ISACO\n\nCannot delete "${name}".\n\nThis health concern is linked to the following product${
              data.products.length === 1 ? "" : "s"
            }:\n\n${productList}\n\nPlease remove "${name}" from these product(s) first.`
          );
        } else {
          window.alert(
            `ISACO\n\n${data.error || "Failed to delete health concern."}`
          );
        }

        return;
      }

      window.alert("ISACO\n\nHealth concern deleted successfully.");

      router.refresh();
    } catch (error) {
      console.error("Delete health concern error:", error);

      window.alert(
        "ISACO\n\nSomething went wrong while deleting the health concern."
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={deleting}
      className="ml-4 font-medium text-red-600 hover:text-red-700 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
    >
      {deleting ? "Deleting..." : "Delete"}
    </button>
  );
}