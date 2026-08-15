"use client";

import { FormEvent, useEffect, useState } from "react";

/* ============================================================
   ABOUT CONTENT TYPE
============================================================ */

type AboutContent = {
  image_url: string;

  hero_label: string;
  hero_title: string;
  hero_description: string;
  hero_urdu: string;

  story_label: string;
  story_title: string;
  story_paragraph_1: string;
  story_paragraph_2: string;
  story_paragraph_3: string;

  mission_label: string;
  mission_title: string;
  mission_description: string;
  mission_urdu: string;

  values_label: string;
  values_title: string;
  values_description: string;

  value_1_title: string;
  value_1_title_urdu: string;
  value_1_description: string;

  value_2_title: string;
  value_2_title_urdu: string;
  value_2_description: string;

  value_3_title: string;
  value_3_title_urdu: string;
  value_3_description: string;

  value_4_title: string;
  value_4_title_urdu: string;
  value_4_description: string;

  cta_title: string;
  cta_description: string;
};

/* ============================================================
   EMPTY CONTENT
============================================================ */

const emptyContent: AboutContent = {
  image_url: "",

  hero_label: "",
  hero_title: "",
  hero_description: "",
  hero_urdu: "",

  story_label: "",
  story_title: "",
  story_paragraph_1: "",
  story_paragraph_2: "",
  story_paragraph_3: "",

  mission_label: "",
  mission_title: "",
  mission_description: "",
  mission_urdu: "",

  values_label: "",
  values_title: "",
  values_description: "",

  value_1_title: "",
  value_1_title_urdu: "",
  value_1_description: "",

  value_2_title: "",
  value_2_title_urdu: "",
  value_2_description: "",

  value_3_title: "",
  value_3_title_urdu: "",
  value_3_description: "",

  value_4_title: "",
  value_4_title_urdu: "",
  value_4_description: "",

  cta_title: "",
  cta_description: "",
};

/* ============================================================
   TEXT INPUT
============================================================ */

function TextInput({
  label,
  value,
  onChange,
  placeholder,
  dir = "ltr",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  dir?: "ltr" | "rtl";
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        dir={dir}
        className="
          w-full
          rounded-xl
          border
          border-gray-200
          bg-white
          px-4
          py-3
          text-sm
          text-gray-900
          outline-none
          transition
          focus:border-green-600
          focus:ring-2
          focus:ring-green-100
        "
      />
    </div>
  );
}

/* ============================================================
   TEXTAREA
============================================================ */

function TextArea({
  label,
  value,
  onChange,
  rows = 4,
  dir = "ltr",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  dir?: "ltr" | "rtl";
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        dir={dir}
        className="
          w-full
          resize-y
          rounded-xl
          border
          border-gray-200
          bg-white
          px-4
          py-3
          text-sm
          leading-7
          text-gray-900
          outline-none
          transition
          focus:border-green-600
          focus:ring-2
          focus:ring-green-100
        "
      />
    </div>
  );
}

/* ============================================================
   SECTION CARD
============================================================ */

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-sm text-gray-500">
            {description}
          </p>
        )}
      </div>

      <div className="space-y-5">
        {children}
      </div>
    </section>
  );
}

/* ============================================================
   ADMIN ABOUT PAGE
============================================================ */

export default function AdminAboutPage() {
  const [content, setContent] =
    useState<AboutContent>(emptyContent);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [uploadingImage, setUploadingImage] =
    useState(false);

  const [imagePreview, setImagePreview] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  /* ============================================================
     LOAD CONTENT
  ============================================================ */

  useEffect(() => {
    let mounted = true;

    async function loadContent() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "/api/admin/about",
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error ||
              "Failed to load About page content."
          );
        }

        if (!mounted) {
          return;
        }

        setContent({
          ...emptyContent,
          ...data,
        });
      } catch (err) {
        if (!mounted) {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load About page content."
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadContent();

    return () => {
      mounted = false;
    };
  }, []);

  /* ============================================================
     UPDATE FIELD
  ============================================================ */

  function updateField(
    field: keyof AboutContent,
    value: string
  ) {
    setContent((current) => ({
      ...current,
      [field]: value,
    }));

    setMessage("");
    setError("");
  }

  /* ============================================================
     IMAGE UPLOAD
  ============================================================ */

  async function handleImageUpload(
    file: File
  ) {
    setMessage("");
    setError("");

    /* ----------------------------------------------------------
       Validate MIME type
    ---------------------------------------------------------- */

    if (file.type !== "image/webp") {
      setError(
        "Only WebP images are allowed. Please select a .webp file."
      );

      return;
    }

    /* ----------------------------------------------------------
       Validate extension
    ---------------------------------------------------------- */

    const extension =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase();

    if (extension !== "webp") {
      setError(
        "Only .webp image files are allowed."
      );

      return;
    }

    /* ----------------------------------------------------------
       Validate file size
    ---------------------------------------------------------- */

    const maxSize =
      5 * 1024 * 1024;

    if (file.size > maxSize) {
      setError(
        "Image must be smaller than 5MB."
      );

      return;
    }

    /* ----------------------------------------------------------
       Create local preview
    ---------------------------------------------------------- */

    const previewUrl =
      URL.createObjectURL(file);

    setImagePreview(previewUrl);

    /* ----------------------------------------------------------
       Upload
    ---------------------------------------------------------- */

    try {
      setUploadingImage(true);

      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      const response =
        await fetch(
          "/api/admin/about/upload",
          {
            method: "POST",
            body: formData,
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Failed to upload About image."
        );
      }

      if (!data.image_url) {
        throw new Error(
          "Image was uploaded but no image URL was returned."
        );
      }

      /*
       * Put the uploaded image URL into the
       * About page content state.
       *
       * It will be saved to the database when
       * the admin clicks "Save About Page".
       */
      updateField(
        "image_url",
        data.image_url
      );

      setMessage(
        "Image uploaded successfully. Click Save About Page to apply it."
      );
    } catch (err) {
      setImagePreview("");

      setError(
        err instanceof Error
          ? err.message
          : "Failed to upload About image."
      );
    } finally {
      setUploadingImage(false);
    }
  }

  /* ============================================================
     FILE INPUT
  ============================================================ */

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    handleImageUpload(file);

    /*
     * Allow selecting the same file again later.
     */
    event.target.value = "";
  }

  /* ============================================================
     SAVE
  ============================================================ */

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (uploadingImage) {
      setError(
        "Please wait until the image upload finishes."
      );

      return;
    }

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const response =
        await fetch(
          "/api/admin/about",
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(content),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Failed to save About page content."
        );
      }

      setContent({
        ...emptyContent,
        ...data.content,
      });

      setMessage(
        "About page content saved successfully."
      );

      /*
       * The uploaded image is now saved to the database,
       * so the preview can be cleared.
       */
      setImagePreview("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save About page content."
      );
    } finally {
      setSaving(false);
    }
  }

  /* ============================================================
     LOADING
  ============================================================ */

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <p className="text-sm text-gray-500">
              Loading About page content...
            </p>
          </div>
        </div>
      </main>
    );
  }

  /* ============================================================
     PAGE
  ============================================================ */

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-5xl">

        {/* ==================================================
            PAGE HEADER
        ================================================== */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            About Us
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage the content displayed on the
            public About Us page.
          </p>
        </div>

        {/* ==================================================
            SUCCESS
        ================================================== */}

        {message && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
            {message}
          </div>
        )}

        {/* ==================================================
            ERROR
        ================================================== */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* ==================================================
              ABOUT IMAGE
          ================================================== */}

          <SectionCard
            title="About Page Image"
            description="Upload the image displayed in the Our Story section."
          >

            <div className="grid gap-6 md:grid-cols-2">

              {/* ------------------------------------------------
                  CURRENT IMAGE
              ------------------------------------------------- */}

              <div>
                <p className="mb-3 text-sm font-medium text-gray-700">
                  Current Image
                </p>

                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100">

                  {content.image_url ? (
                    <img
                      src={content.image_url}
                      alt="Current About Us"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center px-6 text-center text-sm text-gray-400">
                      No About Us image uploaded yet.
                    </div>
                  )}

                </div>
              </div>

              {/* ------------------------------------------------
                  NEW IMAGE
              ------------------------------------------------- */}

              <div>
                <p className="mb-3 text-sm font-medium text-gray-700">
                  Upload New Image
                </p>

                <label
                  htmlFor="about-image"
                  className="
                    flex
                    min-h-[250px]
                    cursor-pointer
                    flex-col
                    items-center
                    justify-center
                    rounded-2xl
                    border-2
                    border-dashed
                    border-gray-200
                    bg-gray-50
                    px-6
                    text-center
                    transition
                    hover:border-green-400
                    hover:bg-green-50
                  "
                >

                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="New About Us preview"
                      className="h-full max-h-[250px] w-full rounded-xl object-cover"
                    />
                  ) : (
                    <>
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          className="h-6 w-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 16V4m0 0-4 4m4-4 4 4M5 20h14"
                          />
                        </svg>
                      </div>

                      <p className="text-sm font-semibold text-gray-800">
                        Click to upload image
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        WebP only
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        Maximum size: 5MB
                      </p>
                    </>
                  )}

                </label>

                <input
                  id="about-image"
                  type="file"
                  accept="image/webp,.webp"
                  onChange={handleFileChange}
                  disabled={uploadingImage}
                  className="hidden"
                />

                {uploadingImage && (
                  <p className="mt-3 text-sm font-medium text-green-700">
                    Uploading image...
                  </p>
                )}

                {imagePreview && !uploadingImage && (
                  <p className="mt-3 text-sm font-medium text-green-700">
                    New image uploaded. Click Save About Page to apply it.
                  </p>
                )}

                <p className="mt-4 text-xs leading-5 text-gray-500">
                  Recommended format: WebP. Use a landscape image with a
                  4:3 aspect ratio for the best result.
                </p>
              </div>

            </div>

          </SectionCard>

          {/* ==================================================
              HERO
          ================================================== */}

          <SectionCard
            title="Hero Section"
            description="The main introduction displayed at the top of the About page."
          >
            <TextInput
              label="Small Heading"
              value={content.hero_label}
              onChange={(value) =>
                updateField(
                  "hero_label",
                  value
                )
              }
            />

            <TextInput
              label="Main Heading"
              value={content.hero_title}
              onChange={(value) =>
                updateField(
                  "hero_title",
                  value
                )
              }
            />

            <TextArea
              label="Description"
              value={content.hero_description}
              onChange={(value) =>
                updateField(
                  "hero_description",
                  value
                )
              }
              rows={3}
            />

            <TextInput
              label="Urdu Text"
              value={content.hero_urdu}
              onChange={(value) =>
                updateField(
                  "hero_urdu",
                  value
                )
              }
              dir="rtl"
            />
          </SectionCard>

          {/* ==================================================
              OUR STORY
          ================================================== */}

          <SectionCard
            title="Our Story"
            description="Content displayed beside the About page image."
          >
            <TextInput
              label="Section Label"
              value={content.story_label}
              onChange={(value) =>
                updateField(
                  "story_label",
                  value
                )
              }
            />

            <TextInput
              label="Heading"
              value={content.story_title}
              onChange={(value) =>
                updateField(
                  "story_title",
                  value
                )
              }
            />

            <TextArea
              label="Paragraph 1"
              value={
                content.story_paragraph_1
              }
              onChange={(value) =>
                updateField(
                  "story_paragraph_1",
                  value
                )
              }
            />

            <TextArea
              label="Paragraph 2"
              value={
                content.story_paragraph_2
              }
              onChange={(value) =>
                updateField(
                  "story_paragraph_2",
                  value
                )
              }
            />

            <TextArea
              label="Paragraph 3"
              value={
                content.story_paragraph_3
              }
              onChange={(value) =>
                updateField(
                  "story_paragraph_3",
                  value
                )
              }
            />
          </SectionCard>

          {/* ==================================================
              MISSION
          ================================================== */}

          <SectionCard title="Mission">
            <TextInput
              label="Section Label"
              value={content.mission_label}
              onChange={(value) =>
                updateField(
                  "mission_label",
                  value
                )
              }
            />

            <TextInput
              label="Heading"
              value={content.mission_title}
              onChange={(value) =>
                updateField(
                  "mission_title",
                  value
                )
              }
            />

            <TextArea
              label="Description"
              value={
                content.mission_description
              }
              onChange={(value) =>
                updateField(
                  "mission_description",
                  value
                )
              }
            />

            <TextInput
              label="Urdu Text"
              value={content.mission_urdu}
              onChange={(value) =>
                updateField(
                  "mission_urdu",
                  value
                )
              }
              dir="rtl"
            />
          </SectionCard>

          {/* ==================================================
              VALUES INTRO
          ================================================== */}

          <SectionCard title="Values Section">
            <TextInput
              label="Section Label"
              value={content.values_label}
              onChange={(value) =>
                updateField(
                  "values_label",
                  value
                )
              }
            />

            <TextInput
              label="Heading"
              value={content.values_title}
              onChange={(value) =>
                updateField(
                  "values_title",
                  value
                )
              }
            />

            <TextArea
              label="Description"
              value={
                content.values_description
              }
              onChange={(value) =>
                updateField(
                  "values_description",
                  value
                )
              }
              rows={3}
            />
          </SectionCard>

          {/* ==================================================
              VALUE 1
          ================================================== */}

          <SectionCard title="Value 1">
            <TextInput
              label="Title"
              value={content.value_1_title}
              onChange={(value) =>
                updateField(
                  "value_1_title",
                  value
                )
              }
            />

            <TextInput
              label="Urdu Title"
              value={
                content.value_1_title_urdu
              }
              onChange={(value) =>
                updateField(
                  "value_1_title_urdu",
                  value
                )
              }
              dir="rtl"
            />

            <TextArea
              label="Description"
              value={
                content.value_1_description
              }
              onChange={(value) =>
                updateField(
                  "value_1_description",
                  value
                )
              }
              rows={3}
            />
          </SectionCard>

          {/* ==================================================
              VALUE 2
          ================================================== */}

          <SectionCard title="Value 2">
            <TextInput
              label="Title"
              value={content.value_2_title}
              onChange={(value) =>
                updateField(
                  "value_2_title",
                  value
                )
              }
            />

            <TextInput
              label="Urdu Title"
              value={
                content.value_2_title_urdu
              }
              onChange={(value) =>
                updateField(
                  "value_2_title_urdu",
                  value
                )
              }
              dir="rtl"
            />

            <TextArea
              label="Description"
              value={
                content.value_2_description
              }
              onChange={(value) =>
                updateField(
                  "value_2_description",
                  value
                )
              }
              rows={3}
            />
          </SectionCard>

          {/* ==================================================
              VALUE 3
          ================================================== */}

          <SectionCard title="Value 3">
            <TextInput
              label="Title"
              value={content.value_3_title}
              onChange={(value) =>
                updateField(
                  "value_3_title",
                  value
                )
              }
            />

            <TextInput
              label="Urdu Title"
              value={
                content.value_3_title_urdu
              }
              onChange={(value) =>
                updateField(
                  "value_3_title_urdu",
                  value
                )
              }
              dir="rtl"
            />

            <TextArea
              label="Description"
              value={
                content.value_3_description
              }
              onChange={(value) =>
                updateField(
                  "value_3_description",
                  value
                )
              }
              rows={3}
            />
          </SectionCard>

          {/* ==================================================
              VALUE 4
          ================================================== */}

          <SectionCard title="Value 4">
            <TextInput
              label="Title"
              value={content.value_4_title}
              onChange={(value) =>
                updateField(
                  "value_4_title",
                  value
                )
              }
            />

            <TextInput
              label="Urdu Title"
              value={
                content.value_4_title_urdu
              }
              onChange={(value) =>
                updateField(
                  "value_4_title_urdu",
                  value
                )
              }
              dir="rtl"
            />

            <TextArea
              label="Description"
              value={
                content.value_4_description
              }
              onChange={(value) =>
                updateField(
                  "value_4_description",
                  value
                )
              }
              rows={3}
            />
          </SectionCard>

          {/* ==================================================
              CTA
          ================================================== */}

          <SectionCard title="Call To Action">
            <TextInput
              label="Heading"
              value={content.cta_title}
              onChange={(value) =>
                updateField(
                  "cta_title",
                  value
                )
              }
            />

            <TextArea
              label="Description"
              value={
                content.cta_description
              }
              onChange={(value) =>
                updateField(
                  "cta_description",
                  value
                )
              }
              rows={3}
            />
          </SectionCard>

          {/* ==================================================
              SAVE
          ================================================== */}

          <div className="sticky bottom-4 z-10 flex justify-end">
            <button
              type="submit"
              disabled={
                saving ||
                uploadingImage
              }
              className="
                rounded-xl
                bg-green-800
                px-8
                py-3
                text-sm
                font-semibold
                text-white
                shadow-lg
                transition
                hover:bg-green-900
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {saving
                ? "Saving..."
                : uploadingImage
                ? "Uploading Image..."
                : "Save About Page"}
            </button>
          </div>

        </form>
      </div>
    </main>
  );
}