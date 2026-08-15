"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";

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

type ExistingHealthConcern = {
  id: number;
  name: string;
  name_urdu: string | null;
  sort_order: number;
};

export default function EditHealthConcernPage() {
  const router = useRouter();
  const params = useParams();

  const id = params.id as string;

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [healthConcern, setHealthConcern] =
    useState<HealthConcern | null>(null);

  const [existingConcerns, setExistingConcerns] = useState<
    ExistingHealthConcern[]
  >([]);

  const [name, setName] = useState("");
  const [nameUrdu, setNameUrdu] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionUrdu, setDescriptionUrdu] = useState("");
  const [image, setImage] = useState("");

  const [position, setPosition] = useState("keep");
  const [afterId, setAfterId] = useState("");

  const [isActive, setIsActive] = useState(true);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [error, setError] = useState("");
  const [imageUploadError, setImageUploadError] = useState("");

  // =====================================================
  // LOAD HEALTH CONCERN + ALL HEALTH CONCERNS
  // =====================================================

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const [concernResponse, allResponse] = await Promise.all([
          fetch(`/api/admin/health-concerns/${id}`),
          fetch("/api/admin/health-concerns"),
        ]);

        if (!concernResponse.ok) {
          const data = await concernResponse.json().catch(() => null);

          throw new Error(
            data?.error || "Failed to load health concern"
          );
        }

        if (!allResponse.ok) {
          const data = await allResponse.json().catch(() => null);

          throw new Error(
            data?.error || "Failed to load health concerns"
          );
        }

        const concernData = await concernResponse.json();
        const allData = await allResponse.json();

        setHealthConcern(concernData);

        setName(concernData.name || "");
        setNameUrdu(concernData.name_urdu || "");
        setSlug(concernData.slug || "");
        setDescription(concernData.description || "");
        setDescriptionUrdu(concernData.description_urdu || "");
        setImage(concernData.image || "");
        setIsActive(concernData.is_active ?? true);

        // Admin GET returns:
        // { healthConcerns: [...] }
        const concerns: ExistingHealthConcern[] =
          Array.isArray(allData.healthConcerns)
            ? allData.healthConcerns
            : [];

        // Remove the current concern.
        // The API already returns them by sort_order,
        // but we sort again here for safety.
        const filteredConcerns = concerns
          .filter((item) => item.id !== Number(id))
          .sort(
            (a, b) =>
              Number(a.sort_order) -
              Number(b.sort_order)
          );

        setExistingConcerns(filteredConcerns);
      } catch (err) {
        console.error(err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load health concern"
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadData();
    }
  }, [id]);

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

  async function handleImageUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setImageUploadError("");

    // Client-side validation
    if (!file.type.startsWith("image/")) {
      setImageUploadError(
        "Only image files are allowed."
      );

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      setImageUploadError(
        "Image must be smaller than 5MB."
      );

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return;
    }

    try {
      setUploadingImage(true);

      const formData = new FormData();

      formData.append("file", file);

      const response = await fetch(
        "/api/admin/products/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.error || "Failed to upload image."
        );
      }

      if (!data?.image_url) {
        throw new Error(
          "Image uploaded but no image URL was returned."
        );
      }

      // Replace the image URL in the form.
      setImage(data.image_url);
    } catch (err) {
      console.error("Health concern image upload error:", err);

      setImageUploadError(
        err instanceof Error
          ? err.message
          : "Failed to upload image."
      );
    } finally {
      setUploadingImage(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
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

    // Prevent saving while image upload is still running.
    if (uploadingImage) {
      setError(
        "Please wait for the image upload to finish."
      );
      return;
    }

    setSaving(true);

    try {
      // -----------------------------------------------
      // Validate "After"
      // -----------------------------------------------

      if (position === "after" && !afterId) {
        throw new Error(
          "Please select a health concern to place this after."
        );
      }

      const response = await fetch(
        `/api/admin/health-concerns/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            name_urdu: nameUrdu.trim() || null,
            slug: slug.trim(),
            description:
              description.trim() || null,
            description_urdu:
              descriptionUrdu.trim() || null,
            image: image.trim() || null,
            position,
            after_id:
              position === "after" && afterId
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
                "Failed to update health concern"
        );
      }

      router.push("/admin/health-concerns");
      router.refresh();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  }

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <main>
        <div className="mx-auto max-w-4xl px-6 py-12">
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <p className="text-sm text-gray-500">
              Loading health concern...
            </p>
          </div>
        </div>
      </main>
    );
  }

  // =====================================================
  // NOT FOUND
  // =====================================================

  if (!healthConcern) {
    return (
      <main>
        <div className="mx-auto max-w-4xl px-6 py-12">
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <h1 className="text-xl font-semibold text-gray-900">
              Health Concern Not Found
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              The health concern you are trying to edit
              does not exist.
            </p>

            <Link
              href="/admin/health-concerns"
              className="mt-5 inline-flex rounded-lg bg-green-700 px-5 py-3 text-sm font-medium text-white hover:bg-green-800"
            >
              Back to Health Concerns
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <main>
      <div className="mx-auto max-w-4xl px-6 py-8">

        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/health-concerns"
            className="text-sm font-medium text-green-700 hover:underline"
          >
            ← Back to Health Concerns
          </Link>

          <h1 className="mt-3 text-3xl font-bold text-gray-900">
            Edit Health Concern
          </h1>

          <p className="mt-2 text-gray-600">
            Update the information for this health
            concern.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white p-6 shadow-sm sm:p-8"
        >

          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Basic Information
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Update the health concern name and URL.
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
                    generateSlug(e.target.value)
                  )
                }
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />

              <p className="mt-2 text-xs text-gray-500">
                URL: /health-concern/
                {slug || "your-slug"}
              </p>
            </div>

          </div>

          {/* Description */}
          <div className="mt-10 border-t border-gray-100 pt-8">
            <h2 className="text-lg font-semibold text-gray-900">
              Description
            </h2>
          </div>

          <div className="mt-6 space-y-6">

            {/* English */}
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
                  setDescription(e.target.value)
                }
                rows={5}
                className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </div>

            {/* Urdu */}
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
                  setDescriptionUrdu(e.target.value)
                }
                rows={5}
                dir="rtl"
                className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-right text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </div>

          </div>

          {/* Image */}
          <div className="mt-10 border-t border-gray-100 pt-8">
            <h2 className="text-lg font-semibold text-gray-900">
              Image
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Replace the current health concern image
              by uploading a new image.
            </p>
          </div>

          <div className="mt-6">

            {/* Current Image */}
            {image && (
              <div className="mb-5">
                <p className="mb-2 text-sm font-medium text-gray-700">
                  Current Image
                </p>

                <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                  <img
                    src={image}
                    alt={name}
                    className="h-56 w-full object-contain p-4"
                    onError={(e) => {
                      e.currentTarget.style.display =
                        "none";
                    }}
                  />
                </div>
              </div>
            )}

            {/* Upload */}
            <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-5">

              <label
                htmlFor="healthConcernImage"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Upload New Image
              </label>

              <input
                ref={fileInputRef}
                id="healthConcernImage"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                onChange={handleImageUpload}
                disabled={uploadingImage || saving}
                className="block w-full cursor-pointer text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-green-700 file:px-4 file:py-2.5 file:text-sm file:font-medium file:text-white hover:file:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
              />

              <p className="mt-2 text-xs text-gray-500">
                JPG, JPEG, PNG, WEBP or GIF. Maximum
                file size: 5MB.
              </p>

              {uploadingImage && (
                <div className="mt-4 flex items-center gap-2 text-sm font-medium text-green-700">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-green-200 border-t-green-700" />
                  Uploading image...
                </div>
              )}

              {imageUploadError && (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {imageUploadError}
                </div>
              )}

              {!uploadingImage &&
                !imageUploadError &&
                image && (
                  <p className="mt-4 text-sm font-medium text-green-700">
                    Image ready. Save the health concern
                    to apply the new image.
                  </p>
                )}
            </div>

            {/* New/Selected Image Preview */}
            {image && (
              <div className="mt-5">
                <p className="mb-2 text-sm font-medium text-gray-700">
                  Image Preview
                </p>

                <div className="overflow-hidden rounded-xl border border-green-200 bg-green-50">
                  <img
                    src={image}
                    alt={`${name} preview`}
                    className="h-56 w-full object-contain p-4"
                    onError={(e) => {
                      e.currentTarget.style.display =
                        "none";
                    }}
                  />
                </div>
              </div>
            )}

          </div>

          {/* Display Position */}
          <div className="mt-10 border-t border-gray-100 pt-8">
            <h2 className="text-lg font-semibold text-gray-900">
              Display Position
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Keep the current position or move this
              health concern.
            </p>
          </div>

          <div className="mt-6 space-y-4">

            {/* Keep */}
            <label
              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 ${
                position === "keep"
                  ? "border-green-200 bg-green-50/50"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <input
                type="radio"
                name="position"
                value="keep"
                checked={position === "keep"}
                onChange={() => {
                  setPosition("keep");
                  setAfterId("");
                }}
                className="mt-1 h-4 w-4 text-green-700 focus:ring-green-600"
              />

              <div>
                <p className="font-medium text-gray-900">
                  Keep current position
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Leave this health concern where it
                  currently appears.
                </p>
              </div>
            </label>

            {/* First */}
            <label
              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 ${
                position === "first"
                  ? "border-green-200 bg-green-50/50"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
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
                  Move to first
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Place this health concern at the
                  beginning of the list.
                </p>
              </div>
            </label>

            {/* After */}
            {existingConcerns.length > 0 && (
              <div
                className={`rounded-xl border p-4 ${
                  position === "after"
                    ? "border-green-200 bg-green-50/50"
                    : "border-gray-200"
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="position"
                    value="after"
                    checked={position === "after"}
                    onChange={() => {
                      setPosition("after");
                      setAfterId("");
                    }}
                    className="mt-1 h-4 w-4 text-green-700 focus:ring-green-600"
                  />

                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      Move after another health concern
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Place this health concern immediately
                      after the selected concern.
                    </p>

                    {position === "after" && (
                      <select
                        value={afterId}
                        onChange={(e) =>
                          setAfterId(e.target.value)
                        }
                        required
                        className="mt-4 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
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
              </div>
            )}

            {/* Last */}
            <label
              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 ${
                position === "last"
                  ? "border-green-200 bg-green-50/50"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
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
                  Move to last
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Place this health concern at the end
                  of the list.
                </p>
              </div>
            </label>

          </div>

          {/* Status */}
          <div className="mt-10 border-t border-gray-100 pt-8">
            <h2 className="text-lg font-semibold text-gray-900">
              Status
            </h2>

            <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 px-4 py-3">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) =>
                  setIsActive(e.target.checked)
                }
                className="h-4 w-4 rounded border-gray-300 text-green-700 focus:ring-green-600"
              />

              <span className="text-sm text-gray-700">
                Active
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="mt-10 flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">

            <Link
              href="/admin/health-concerns"
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving || uploadingImage}
              className="inline-flex items-center justify-center rounded-lg bg-green-700 px-6 py-3 text-sm font-medium text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {uploadingImage
                ? "Uploading Image..."
                : saving
                ? "Saving..."
                : "Update Health Concern"}
            </button>

          </div>

        </form>
      </div>
    </main>
  );
}