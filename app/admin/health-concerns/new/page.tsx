"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type ExistingHealthConcern = {
  id: number;
  name: string;
  name_urdu: string | null;
  sort_order: number;
};

export default function NewHealthConcernPage() {
  const router = useRouter();

  const [existingConcerns, setExistingConcerns] = useState<
    ExistingHealthConcern[]
  >([]);

  const [name, setName] = useState("");
  const [nameUrdu, setNameUrdu] = useState("");
  const [slug, setSlug] = useState("");

  const [description, setDescription] = useState("");
  const [descriptionUrdu, setDescriptionUrdu] = useState("");

  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUploading, setImageUploading] = useState(false);

  const [position, setPosition] = useState("last");
  const [afterId, setAfterId] = useState("");

  const [isActive, setIsActive] = useState(true);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // LOAD EXISTING HEALTH CONCERNS
  // =====================================================

  useEffect(() => {
    async function loadHealthConcerns() {
      try {
        const response = await fetch("/api/health-concerns");

        if (!response.ok) {
          throw new Error("Failed to load health concerns");
        }

        const data = await response.json();

        setExistingConcerns(
          Array.isArray(data)
            ? data
            : data.healthConcerns || []
        );
      } catch (err) {
        console.error(err);
        setError("Unable to load existing health concerns.");
      } finally {
        setLoading(false);
      }
    }

    loadHealthConcerns();
  }, []);

  // =====================================================
  // SLUG
  // =====================================================

  function generateSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  function handleNameChange(value: string) {
    setName(value);

    if (!slug) {
      setSlug(generateSlug(value));
    }
  }

  // =====================================================
  // IMAGE UPLOAD
  // =====================================================

  async function handleImageChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");

    // ---------------------------------------------------
    // Validate type
    // ---------------------------------------------------

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      event.target.value = "";
      return;
    }

    // ---------------------------------------------------
    // Validate size
    // ---------------------------------------------------

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      setError("Image must be smaller than 5MB.");
      event.target.value = "";
      return;
    }

    setImageFile(file);
    setImageUploading(true);

    try {
      const formData = new FormData();

      formData.append("file", file);

      const response = await fetch(
        "/api/admin/health-concerns/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Failed to upload image."
        );
      }

      setImage(data.image_url);
    } catch (err) {
      console.error(
        "Health concern image upload error:",
        err
      );

      setImage("");
      setImageFile(null);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to upload image."
      );
    } finally {
      setImageUploading(false);
    }
  }

  function removeImage() {
    setImage("");
    setImageFile(null);

    const input = document.getElementById(
      "health-concern-image"
    ) as HTMLInputElement | null;

    if (input) {
      input.value = "";
    }
  }

  // =====================================================
  // SUBMIT
  // =====================================================

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (imageUploading) {
      setError(
        "Please wait for the image upload to finish."
      );
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        "/api/health-concerns",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            name_urdu:
              nameUrdu.trim() || null,

            slug: slug.trim(),

            description:
              description.trim() || null,

            description_urdu:
              descriptionUrdu.trim() || null,

            image: image.trim() || null,

            position,

            after_id:
              afterId
                ? Number(afterId)
                : null,

            is_active: isActive,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.details
            ? `${data.error}: ${data.details}`
            : data.error ||
                "Failed to create health concern"
        );
      }

      router.push(
        "/admin/health-concerns"
      );

      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } finally {
      setSaving(false);
    }
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-6 py-8">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-8">

          <Link
            href="/admin/health-concerns"
            className="text-sm font-medium text-green-700 hover:underline"
          >
            ← Back to Health Concerns
          </Link>

          <h1 className="mt-3 text-3xl font-bold text-gray-900">
            Add Health Concern
          </h1>

          <p className="mt-2 text-gray-600">
            Add a new health concern to your ISACO website.
          </p>

        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            ✕ {error}
          </div>
        )}

        {/* =================================================
            FORM
        ================================================= */}

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white p-6 shadow-sm sm:p-8"
        >

          {/* =================================================
              BASIC INFORMATION
          ================================================= */}

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Basic Information
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Enter the health concern name and URL information.
            </p>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">

            {/* English Name */}

            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                English Name *
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) =>
                  handleNameChange(e.target.value)
                }
                required
                placeholder="e.g. Digestive Health"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </div>

            {/* Urdu Name */}

            <div>
              <label
                htmlFor="nameUrdu"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Urdu Name
              </label>

              <input
                id="nameUrdu"
                type="text"
                value={nameUrdu}
                onChange={(e) =>
                  setNameUrdu(e.target.value)
                }
                dir="rtl"
                placeholder="مثلاً نظامِ ہاضمہ"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-right text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </div>

            {/* Slug */}

            <div className="sm:col-span-2">

              <label
                htmlFor="slug"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Slug *
              </label>

              <input
                id="slug"
                type="text"
                value={slug}
                onChange={(e) =>
                  setSlug(
                    generateSlug(
                      e.target.value
                    )
                  )
                }
                required
                placeholder="digestive-health"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />

              <p className="mt-2 text-xs text-gray-500">
                URL: /health-concern/
                {slug || "your-slug"}
              </p>

            </div>

          </div>

          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <div className="mt-10 border-t border-gray-100 pt-8">

            <h2 className="text-lg font-semibold text-gray-900">
              Description
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Add information that will appear on the health concern page.
            </p>

          </div>

          <div className="mt-6 space-y-6">

            {/* English Description */}

            <div>

              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                English Description
              </label>

              <textarea
                id="description"
                value={description}
                onChange={(e) =>
                  setDescription(
                    e.target.value
                  )
                }
                rows={5}
                placeholder="Describe this health concern..."
                className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />

            </div>

            {/* Urdu Description */}

            <div>

              <label
                htmlFor="descriptionUrdu"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Urdu Description
              </label>

              <textarea
                id="descriptionUrdu"
                value={descriptionUrdu}
                onChange={(e) =>
                  setDescriptionUrdu(
                    e.target.value
                  )
                }
                rows={5}
                dir="rtl"
                placeholder="اس صحت کے مسئلے کے بارے میں تفصیل لکھیں..."
                className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-right text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />

            </div>

          </div>

          {/* =================================================
              IMAGE UPLOAD
          ================================================= */}

          <div className="mt-10 border-t border-gray-100 pt-8">

            <h2 className="text-lg font-semibold text-gray-900">
              Health Concern Image
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Upload an image for this health concern.
            </p>

            <p className="mt-2 text-xs text-gray-400">
              Recommended: WebP or JPG, preferably
              800 × 800 px or similar square dimensions.
              Maximum file size: 5MB.
            </p>

          </div>

          <div className="mt-6">

            <label
              htmlFor="health-concern-image"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Upload Image
            </label>

            <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 transition hover:border-green-400 hover:bg-green-50/30">

              <input
                id="health-concern-image"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                onChange={handleImageChange}
                disabled={imageUploading}
                className="block w-full cursor-pointer text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-green-700 file:px-5 file:py-3 file:text-sm file:font-medium file:text-white file:transition hover:file:bg-green-800 disabled:cursor-not-allowed"
              />

              <p className="mt-3 text-xs text-gray-500">
                JPG, JPEG, PNG, WebP or GIF. Maximum 5MB.
              </p>

            </div>

            {/* Uploading */}

            {imageUploading && (
              <div className="mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                Uploading image...
              </div>
            )}

            {/* Preview */}

            {image && !imageUploading && (
              <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4">

                <div className="mb-3 flex items-center justify-between">

                  <p className="text-sm font-medium text-gray-700">
                    Image Preview
                  </p>

                  <button
                    type="button"
                    onClick={removeImage}
                    className="text-sm font-medium text-red-600 hover:text-red-700 hover:underline"
                  >
                    Remove Image
                  </button>

                </div>

                <div className="flex min-h-64 items-center justify-center overflow-hidden rounded-xl bg-white">

                  <img
                    src={image}
                    alt="Health concern preview"
                    className="max-h-80 w-full object-contain p-4"
                  />

                </div>

                <p className="mt-3 break-all text-xs text-gray-400">
                  {image}
                </p>

              </div>
            )}

            {/* Selected file */}

            {imageFile && !imageUploading && (
              <p className="mt-2 text-xs text-gray-500">
                Selected:{" "}
                <span className="font-medium text-gray-700">
                  {imageFile.name}
                </span>
              </p>
            )}

          </div>

          {/* =================================================
              DISPLAY POSITION
          ================================================= */}

          <div className="mt-10 border-t border-gray-100 pt-8">

            <h2 className="text-lg font-semibold text-gray-900">
              Display Position
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Choose where this health concern should appear.
            </p>

          </div>

          <div className="mt-6 space-y-4">

            {/* FIRST */}

            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 p-4 transition hover:bg-gray-50">

              <input
                type="radio"
                name="position"
                value="first"
                checked={position === "first"}
                onChange={() => {
                  setPosition("first");
                  setAfterId("");
                }}
                className="mt-1 h-4 w-4 text-green-700 focus:ring-green-600"
              />

              <div>

                <p className="font-medium text-gray-900">
                  First
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Place this health concern at the beginning.
                </p>

              </div>

            </label>

            {/* AFTER */}

            {!loading &&
              existingConcerns.length > 0 && (
                <label className="block rounded-xl border border-gray-200 p-4">

                  <div className="flex items-start gap-3">

                    <input
                      type="radio"
                      name="position"
                      value="after"
                      checked={position === "after"}
                      onChange={() =>
                        setPosition("after")
                      }
                      className="mt-1 h-4 w-4 text-green-700 focus:ring-green-600"
                    />

                    <div className="flex-1">

                      <p className="font-medium text-gray-900">
                        After an existing health concern
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        Choose which health concern should come before this one.
                      </p>

                      {position === "after" && (
                        <select
                          value={afterId}
                          onChange={(e) =>
                            setAfterId(
                              e.target.value
                            )
                          }
                          required
                          className="mt-4 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                        >
                          <option value="">
                            Select health concern
                          </option>

                          {existingConcerns.map(
                            (item) => (
                              <option
                                key={item.id}
                                value={item.id}
                              >
                                {item.name}
                                {item.name_urdu
                                  ? ` — ${item.name_urdu}`
                                  : ""}
                              </option>
                            )
                          )}

                        </select>
                      )}

                    </div>

                  </div>

                </label>
              )}

            {/* LAST */}

            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-green-200 bg-green-50/50 p-4 transition hover:bg-green-50">

              <input
                type="radio"
                name="position"
                value="last"
                checked={position === "last"}
                onChange={() => {
                  setPosition("last");
                  setAfterId("");
                }}
                className="mt-1 h-4 w-4 text-green-700 focus:ring-green-600"
              />

              <div>

                <p className="font-medium text-gray-900">
                  Last
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Place this health concern at the end.
                </p>

              </div>

            </label>

          </div>

          {/* =================================================
              STATUS
          ================================================= */}

          <div className="mt-10 border-t border-gray-100 pt-8">

            <h2 className="text-lg font-semibold text-gray-900">
              Status
            </h2>

            <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 px-4 py-3">

              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) =>
                  setIsActive(
                    e.target.checked
                  )
                }
                className="h-4 w-4 rounded border-gray-300 text-green-700 focus:ring-green-600"
              />

              <span className="text-sm text-gray-700">
                Active
              </span>

            </label>

          </div>

          {/* =================================================
              ACTIONS
          ================================================= */}

          <div className="mt-10 flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">

            <Link
              href="/admin/health-concerns"
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={
                saving ||
                imageUploading
              }
              className="inline-flex items-center justify-center rounded-lg bg-green-700 px-6 py-3 text-sm font-medium text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : imageUploading
                ? "Uploading Image..."
                : "Save Health Concern"}
            </button>

          </div>

        </form>
      </div>
    </main>
  );
}