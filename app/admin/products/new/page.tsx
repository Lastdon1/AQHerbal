"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Category = {
  id: number;
  name: string;
  name_urdu: string | null;
};

type HealthConcern = {
  id: number;
  name: string;
  name_urdu: string | null;
};

type ProductImage = {
  image_url: string;
  alt_text: string;
  is_primary: boolean;
  uploading?: boolean;
};

type ProductVariant = {
  quantity_value: string;
  unit: string;
  price: string;
  old_price: string;
  is_default: boolean;
  is_active: boolean;
};



export default function NewProductPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] =
    useState(true);

  const [healthConcerns, setHealthConcerns] = useState<
    HealthConcern[]
  >([]);
  const [healthConcernsLoading, setHealthConcernsLoading] =
    useState(true);

  const [selectedHealthConcerns, setSelectedHealthConcerns] =
    useState<number[]>([]);

  const [form, setForm] = useState({
    name: "",
    name_urdu: "",
    slug: "",
    category_id: "",
    description: "",
    description_urdu: "",
    benefits: "",
    benefits_urdu: "",
    ingredients: "",
    ingredients_urdu: "",
    usage: "",
    usage_urdu: "",
    is_active: true,
  });



  const [images, setImages] = useState<ProductImage[]>([
    {
      image_url: "",
      alt_text: "",
      is_primary: true,
      uploading: false,
    },
  ]);

  const [variants, setVariants] = useState<ProductVariant[]>([
    {
      quantity_value: "",
      unit: "",
      price: "",
      old_price: "",
      is_default: true,
      is_active: true,
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  /* =====================================================
     LOAD CATEGORIES
  ===================================================== */

  useEffect(() => {
    async function loadCategories() {
      try {
        setCategoriesLoading(true);

        const response = await fetch(
          "/api/admin/products/categories"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error || "Failed to load categories."
          );
        }

        setCategories(data.categories || []);
      } catch (error) {
        console.error("Load categories error:", error);

        setMessage(
          error instanceof Error
            ? error.message
            : "Failed to load categories."
        );
      } finally {
        setCategoriesLoading(false);
      }
    }

    loadCategories();
  }, []);

  /* =====================================================
     LOAD HEALTH CONCERNS
  ===================================================== */

  useEffect(() => {
    async function loadHealthConcerns() {
      try {
        setHealthConcernsLoading(true);

        const response = await fetch(
          "/api/admin/health-concerns"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error ||
              "Failed to load health concerns."
          );
        }

        setHealthConcerns(data.healthConcerns || []);
      } catch (error) {
        console.error(
          "Load health concerns error:",
          error
        );

        setMessage(
          error instanceof Error
            ? error.message
            : "Failed to load health concerns."
        );
      } finally {
        setHealthConcernsLoading(false);
      }
    }

    loadHealthConcerns();
  }, []);

  /* =====================================================
     FORM HELPERS
  ===================================================== */

  function updateForm(
    field: keyof typeof form,
    value: string | boolean
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function generateSlug() {
    const slug = form.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    updateForm("slug", slug);
  }

  /* =====================================================
     HEALTH CONCERN HELPERS
  ===================================================== */

  function toggleHealthConcern(id: number) {
    setSelectedHealthConcerns((previous) =>
      previous.includes(id)
        ? previous.filter(
            (concernId) => concernId !== id
          )
        : [...previous, id]
    );
  }

 
  /* =====================================================
     IMAGE UPLOAD
  ===================================================== */

  async function uploadImage(
    index: number,
    file: File
  ) {
    setMessage("");

    setImages((previous) =>
      previous.map((image, imageIndex) =>
        imageIndex === index
          ? {
              ...image,
              uploading: true,
            }
          : image
      )
    );

    const formData = new FormData();

    formData.append("file", file);

    try {
      const response = await fetch(
        "/api/admin/products/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Failed to upload image."
        );
      }

      setImages((previous) =>
        previous.map((image, imageIndex) =>
          imageIndex === index
            ? {
                ...image,
                image_url: data.image_url,
                uploading: false,
              }
            : image
        )
      );
    } catch (error) {
      console.error(
        "Image upload error:",
        error
      );

      setImages((previous) =>
        previous.map((image, imageIndex) =>
          imageIndex === index
            ? {
                ...image,
                uploading: false,
              }
            : image
        )
      );

      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to upload image."
      );
    }
  }

  /* =====================================================
     IMAGE HELPERS
  ===================================================== */

  function addImage() {
    setImages((previous) => [
      ...previous,
      {
        image_url: "",
        alt_text: "",
        is_primary: false,
        uploading: false,
      },
    ]);
  }

  function updateImage(
    index: number,
    field: "alt_text",
    value: string
  ) {
    setImages((previous) =>
      previous.map((image, imageIndex) =>
        imageIndex === index
          ? {
              ...image,
              [field]: value,
            }
          : image
      )
    );
  }

  function setPrimaryImage(index: number) {
    setImages((previous) =>
      previous.map((image, imageIndex) => ({
        ...image,
        is_primary: imageIndex === index,
      }))
    );
  }

  function removeImage(index: number) {
    setImages((previous) => {
      const remaining = previous.filter(
        (_, imageIndex) =>
          imageIndex !== index
      );

      if (remaining.length === 0) {
        return [
          {
            image_url: "",
            alt_text: "",
            is_primary: true,
            uploading: false,
          },
        ];
      }

      if (
        !remaining.some(
          (image) => image.is_primary
        )
      ) {
        remaining[0].is_primary = true;
      }

      return remaining;
    });
  }

  /* =====================================================
     VARIANT HELPERS
  ===================================================== */

  function addVariant() {
    setVariants((previous) => [
      ...previous,
      {
        quantity_value: "",
        unit: "",
        price: "",
        old_price: "",
        is_default: false,
        is_active: true,
      },
    ]);
  }

  function updateVariant(
    index: number,
    field: keyof ProductVariant,
    value: string | boolean
  ) {
    setVariants((previous) =>
      previous.map((variant, variantIndex) =>
        variantIndex === index
          ? {
              ...variant,
              [field]: value,
            }
          : variant
      )
    );
  }

  function setDefaultVariant(index: number) {
    setVariants((previous) =>
      previous.map((variant, variantIndex) => ({
        ...variant,
        is_default:
          variantIndex === index,
      }))
    );
  }

  function removeVariant(index: number) {
    setVariants((previous) => {
      const remaining = previous.filter(
        (_, variantIndex) =>
          variantIndex !== index
      );

      if (remaining.length === 0) {
        return [
          {
            quantity_value: "",
            unit: "",
            price: "",
            old_price: "",
            is_default: true,
            is_active: true,
          },
        ];
      }

      if (
        !remaining.some(
          (variant) => variant.is_default
        )
      ) {
        remaining[0].is_default = true;
      }

      return remaining;
    });
  }

  /* =====================================================
     SUBMIT PRODUCT
  ===================================================== */

  async function handleSubmit(
    event: React.SyntheticEvent
  ) {
    event.preventDefault();

    setMessage("");

    /* ---------------------------------------------
       BASIC VALIDATION
    --------------------------------------------- */

    if (!form.name.trim()) {
      setMessage(
        "Product name is required."
      );
      return;
    }

    if (!form.slug.trim()) {
      setMessage(
        "Product slug is required."
      );
      return;
    }

    if (!form.category_id) {
      setMessage(
        "Please select a category."
      );
      return;
    }

    /* ---------------------------------------------
       IMAGE VALIDATION
    --------------------------------------------- */

    if (
      images.some(
        (image) => image.uploading
      )
    ) {
      setMessage(
        "Please wait until all images finish uploading."
      );
      return;
    }

    const cleanedImages = images.map(
      (image) => ({
        image_url:
          image.image_url.trim(),
        alt_text:
          image.alt_text.trim() ||
          null,
        is_primary:
          image.is_primary,
      })
    );

    if (
      cleanedImages.length === 0 ||
      cleanedImages.some(
        (image) => !image.image_url
      )
    ) {
      setMessage(
        "Please upload an image for every image slot."
      );
      return;
    }

    /* ---------------------------------------------
       ENSURE ONE PRIMARY IMAGE
    --------------------------------------------- */

    const primaryImageIndex =
      cleanedImages.findIndex(
        (image) => image.is_primary
      );

    if (primaryImageIndex === -1) {
      cleanedImages[0].is_primary =
        true;
    } else {
      cleanedImages.forEach(
        (image, index) => {
          image.is_primary =
            index === primaryImageIndex;
        }
      );
    }

    /* ---------------------------------------------
       VARIANT VALIDATION
    --------------------------------------------- */

    const cleanedVariants =
      variants.map((variant) => ({
        quantity_value: Number(
          variant.quantity_value
        ),
        unit: variant.unit.trim(),
        price: Number(
          variant.price
        ),
        old_price:
          variant.old_price.trim() === ""
            ? null
            : Number(
                variant.old_price
              ),
        is_default:
          variant.is_default,
        is_active:
          variant.is_active,
      }));

    if (cleanedVariants.length === 0) {
      setMessage(
        "At least one product variant is required."
      );
      return;
    }

    const invalidVariant =
      cleanedVariants.some(
        (variant) =>
          !Number.isFinite(
            variant.quantity_value
          ) ||
          variant.quantity_value <=
            0 ||
          !variant.unit ||
          !Number.isFinite(
            variant.price
          ) ||
          variant.price < 0 ||
          (variant.old_price !== null &&
            (!Number.isFinite(
              variant.old_price
            ) ||
              variant.old_price < 0))
      );

    if (invalidVariant) {
      setMessage(
        "Please enter valid values for every product variant."
      );
      return;
    }

    /* ---------------------------------------------
       ENSURE ONE DEFAULT VARIANT
    --------------------------------------------- */

    const defaultVariantIndex =
      cleanedVariants.findIndex(
        (variant) =>
          variant.is_default
      );

    if (defaultVariantIndex === -1) {
      cleanedVariants[0].is_default =
        true;
    } else {
      cleanedVariants.forEach(
        (variant, index) => {
          variant.is_default =
            index ===
            defaultVariantIndex;
        }
      );
    }

    /* ---------------------------------------------
       API PAYLOAD
       No homepage display-order fields.
    --------------------------------------------- */

    const payload = {
      name: form.name.trim(),

      name_urdu:
        form.name_urdu.trim() ||
        null,

      slug: form.slug.trim(),

      category_id: Number(
        form.category_id
      ),

      description:
        form.description.trim() ||
        null,

      description_urdu:
        form.description_urdu.trim() ||
        null,

      benefits:
        form.benefits.trim() ||
        null,

      benefits_urdu:
        form.benefits_urdu.trim() ||
        null,

      ingredients:
        form.ingredients.trim() ||
        null,

      ingredients_urdu:
        form.ingredients_urdu.trim() ||
        null,

      usage:
        form.usage.trim() ||
        null,

      usage_urdu:
        form.usage_urdu.trim() ||
        null,

      is_active:
        form.is_active,

   

      

      health_concern_ids:
        selectedHealthConcerns,

      images:
        cleanedImages.map(
          (image, index) => ({
            image_url:
              image.image_url,
            alt_text:
              image.alt_text,
            sort_order: index,
            is_primary:
              image.is_primary,
          })
        ),

      variants:
        cleanedVariants,
    };

    /* ---------------------------------------------
       CREATE PRODUCT
    --------------------------------------------- */

    setLoading(true);

    try {
      const response = await fetch(
        "/api/admin/products",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(
            payload
          ),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Failed to create product."
        );
      }

      setMessage(
        "Product created successfully."
      );

      window.location.href =
        "/admin/products";
    } catch (error) {
      console.error(
        "Create product error:",
        error
      );

      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to create product."
      );
    } finally {
      setLoading(false);
    }
  }

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <div>
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Add New Product
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Create a new product for
              the ISACO store.
            </p>
          </div>

          <Link
            href="/admin/products"
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            ← Back to Products
          </Link>

        </div>
      </div>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="mx-auto max-w-7xl px-6 py-8">

        <form onSubmit={handleSubmit}>

          <div className="space-y-8">

            {/* =================================================
                BASIC INFORMATION
            ================================================= */}

            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Basic Information
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Enter the main information
                  for this product.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">

                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Product Name *
                  </label>

                  <input
                    id="name"
                    type="text"
                    value={form.name}
                    onChange={(event) =>
                      updateForm(
                        "name",
                        event.target.value
                      )
                    }
                    placeholder="Natural Honey"
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="name_urdu"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Product Name (Urdu)
                  </label>

                  <input
                    id="name_urdu"
                    type="text"
                    dir="rtl"
                    value={form.name_urdu}
                    onChange={(event) =>
                      updateForm(
                        "name_urdu",
                        event.target.value
                      )
                    }
                    placeholder="خالص شہد"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-right text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  />
                </div>

                <div className="md:col-span-2">

                  <label
                    htmlFor="slug"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Slug *
                  </label>

                  <div className="flex gap-2">

                    <input
                      id="slug"
                      type="text"
                      value={form.slug}
                      onChange={(event) =>
                        updateForm(
                          "slug",
                          event.target.value
                        )
                      }
                      placeholder="natural-honey"
                      required
                      className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                    />

                    <button
                      type="button"
                      onClick={generateSlug}
                      className="rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                    >
                      Generate
                    </button>

                  </div>

                  <p className="mt-2 text-xs text-gray-500">
                    Use lowercase letters,
                    numbers and hyphens.
                  </p>

                </div>

                <div>

                  <label
                    htmlFor="category_id"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Category *
                  </label>

                  <select
                    id="category_id"
                    value={
                      form.category_id
                    }
                    onChange={(event) =>
                      updateForm(
                        "category_id",
                        event.target.value
                      )
                    }
                    required
                    disabled={
                      categoriesLoading
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:bg-gray-100"
                  >
                    <option value="">
                      {categoriesLoading
                        ? "Loading categories..."
                        : "Select a category"}
                    </option>

                    {categories.map(
                      (category) => (
                        <option
                          key={
                            category.id
                          }
                          value={
                            category.id
                          }
                        >
                          {category.name}

                          {category.name_urdu
                            ? ` — ${category.name_urdu}`
                            : ""}
                        </option>
                      )
                    )}
                  </select>

                  {!categoriesLoading &&
                    categories.length ===
                      0 && (
                    <p className="mt-2 text-xs text-red-600">
                      No active
                      categories found.
                    </p>
                  )}

                </div>

                <div>

                  <label
                    htmlFor="is_active"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Product Status
                  </label>

                  <select
                    id="is_active"
                    value={
                      form.is_active
                        ? "active"
                        : "inactive"
                    }
                    onChange={(event) =>
                      updateForm(
                        "is_active",
                        event.target
                          .value ===
                          "active"
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  >
                    <option value="active">
                      Active
                    </option>

                    <option value="inactive">
                      Inactive
                    </option>
                  </select>

                </div>

              </div>
            </section>

            

            {/* =================================================
                HEALTH CONCERNS
            ================================================= */}

            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Health Concerns
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Select the health concerns this
                  product is related to. You can
                  select multiple.
                </p>
              </div>

              {healthConcernsLoading ? (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-5 text-sm text-gray-500">
                  Loading health concerns...
                </div>
              ) : healthConcerns.length === 0 ? (
                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-5 text-sm text-yellow-800">
                  No active health concerns are
                  available.
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

                  {healthConcerns.map(
                    (concern) => {
                      const selected =
                        selectedHealthConcerns.includes(
                          concern.id
                        );

                      return (
                        <label
                          key={concern.id}
                          className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                            selected
                              ? "border-green-500 bg-green-50"
                              : "border-gray-200 bg-white hover:border-green-300 hover:bg-green-50/50"
                          }`}
                        >

                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() =>
                              toggleHealthConcern(
                                concern.id
                              )
                            }
                            className="mt-1 h-4 w-4 rounded border-gray-300 text-green-700 focus:ring-green-600"
                          />

                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {concern.name}
                            </p>

                            {concern.name_urdu && (
                              <p
                                dir="rtl"
                                className="mt-1 text-sm text-gray-600"
                              >
                                {concern.name_urdu}
                              </p>
                            )}
                          </div>

                        </label>
                      );
                    }
                  )}

                </div>
              )}

              {selectedHealthConcerns.length >
                0 && (
                <p className="mt-4 text-sm text-green-700">
                  {selectedHealthConcerns.length}{" "}
                  health concern
                  {selectedHealthConcerns.length ===
                  1
                    ? ""
                    : "s"}{" "}
                  selected
                </p>
              )}

            </section>

            {/* =================================================
                PRODUCT IMAGES
            ================================================= */}

            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

              <div className="mb-6 flex items-start justify-between gap-4">

                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Product Images
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Upload one or more images
                    for this product.
                  </p>

                  <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4">

                    <p className="text-sm font-semibold text-green-800">
                      Recommended Image Size
                    </p>

                    <p className="mt-1 text-sm text-green-700">
                      For best results, upload a
                      square image of{" "}
                      <strong>
                        1200 × 1200 px
                      </strong>
                      .
                    </p>

                    <p className="mt-1 text-xs text-green-700">
                      Accepted formats: JPG, PNG,
                      WEBP or GIF • Maximum 5MB
                    </p>

                    <p className="mt-1 text-xs text-green-600">
                      Different image sizes are
                      allowed, but square images
                      provide the most consistent
                      appearance across the store.
                    </p>

                  </div>
                </div>

                <button
                  type="button"
                  onClick={addImage}
                  className="shrink-0 rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-800"
                >
                  + Add Image
                </button>

              </div>

              <div className="space-y-5">

                {images.map(
                  (image, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-gray-200 bg-gray-50 p-5"
                    >

                      <div className="mb-4 flex items-center justify-between">

                        <div className="flex items-center gap-3">

                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-sm font-semibold text-green-700">
                            {index + 1}
                          </span>

                          <h3 className="text-sm font-semibold text-gray-800">
                            Image{" "}
                            {index + 1}
                          </h3>

                        </div>

                        {images.length >
                          1 && (
                          <button
                            type="button"
                            onClick={() =>
                              removeImage(
                                index
                              )
                            }
                            className="text-sm font-medium text-red-600 transition hover:text-red-700"
                          >
                            Remove
                          </button>
                        )}

                      </div>

                      <div className="grid gap-5 md:grid-cols-2">

                        <div>

                          <label className="mb-2 block text-sm font-medium text-gray-700">
                            Product Image *
                          </label>

                          <label className="flex min-h-[240px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-white px-6 py-6 text-center transition hover:border-green-600 hover:bg-green-50">

                            {image.uploading ? (
                              <div className="flex flex-col items-center">

                                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-green-700" />

                                <span className="mt-3 text-sm font-medium text-gray-700">
                                  Uploading...
                                </span>

                              </div>
                            ) : image.image_url ? (
                              <div className="flex w-full flex-col items-center">

                                <div className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-white">

                                  <img
                                    src={
                                      image.image_url
                                    }
                                    alt={
                                      image.alt_text ||
                                      `Product image ${
                                        index +
                                        1
                                      }`
                                    }
                                    className="h-full w-full object-contain p-2"
                                  />

                                </div>

                                <span className="mt-3 text-sm font-semibold text-green-700">
                                  Change Image
                                </span>

                                <span className="mt-1 text-xs text-gray-400">
                                  Recommended:
                                  1200 × 1200 px
                                </span>

                              </div>
                            ) : (
                              <div className="flex flex-col items-center">

                                <span className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-2xl font-light text-green-700">
                                  +
                                </span>

                                <span className="text-sm font-semibold text-gray-700">
                                  Upload Image
                                </span>

                                <span className="mt-1 text-xs text-gray-500">
                                  JPG, PNG, WEBP
                                  or GIF
                                </span>

                                <span className="mt-1 text-xs text-gray-400">
                                  Maximum 5MB
                                </span>

                                <span className="mt-2 text-xs font-medium text-green-700">
                                  Best size: 1200 ×
                                  1200 px
                                </span>

                              </div>
                            )}

                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp,image/gif"
                              className="hidden"
                              disabled={
                                image.uploading
                              }
                              onChange={(
                                event
                              ) => {
                                const file =
                                  event
                                    .target
                                    .files?.[0];

                                if (
                                  file
                                ) {
                                  uploadImage(
                                    index,
                                    file
                                  );
                                }

                                event.currentTarget.value =
                                  "";
                              }}
                            />

                          </label>

                        </div>

                        <div>

                          <label
                            htmlFor={`alt-text-${index}`}
                            className="mb-2 block text-sm font-medium text-gray-700"
                          >
                            Alt Text
                          </label>

                          <input
                            id={`alt-text-${index}`}
                            type="text"
                            value={
                              image.alt_text
                            }
                            onChange={(
                              event
                            ) =>
                              updateImage(
                                index,
                                "alt_text",
                                event.target
                                  .value
                              )
                            }
                            placeholder="Natural Honey"
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                          />

                          <p className="mt-2 text-xs text-gray-500">
                            Describe the image
                            for SEO and
                            accessibility.
                          </p>

                          <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4">

                            <p className="text-sm font-medium text-gray-700">
                              Image guidelines
                            </p>

                            <ul className="mt-2 space-y-1 text-xs text-gray-500">

                              <li>
                                • Use a clear product
                                photo.
                              </li>

                              <li>
                                • Prefer a square
                                1200 × 1200 px image.
                              </li>

                              <li>
                                • Keep the product
                                centered.
                              </li>

                              <li>
                                • Avoid very small
                                or blurry images.
                              </li>

                            </ul>

                          </div>

                        </div>

                      </div>

                      <label className="mt-5 flex cursor-pointer items-center gap-3">

                        <input
                          type="radio"
                          name="primary-image"
                          checked={
                            image.is_primary
                          }
                          onChange={() =>
                            setPrimaryImage(
                              index
                            )
                          }
                          disabled={
                            image.uploading
                          }
                          className="h-4 w-4 border-gray-300 text-green-700 focus:ring-green-600"
                        />

                        <span className="text-sm font-medium text-gray-700">
                          Primary image
                        </span>

                        {image.is_primary && (
                          <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                            Primary
                          </span>
                        )}

                      </label>

                    </div>
                  )
                )}

              </div>

            </section>

            {/* =================================================
                PRODUCT VARIANTS
            ================================================= */}

            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

              <div className="mb-6 flex items-start justify-between gap-4">

                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Product Variants
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Add different quantities,
                    units and prices for
                    this product.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addVariant}
                  className="rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-800"
                >
                  + Add Variant
                </button>

              </div>

              <div className="space-y-5">

                {variants.map(
                  (variant, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-gray-200 bg-gray-50 p-5"
                    >

                      <div className="mb-4 flex items-center justify-between">

                        <div className="flex items-center gap-3">

                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-sm font-semibold text-green-700">
                            {index + 1}
                          </span>

                          <h3 className="text-sm font-semibold text-gray-800">
                            Variant{" "}
                            {index + 1}
                          </h3>

                        </div>

                        {variants.length >
                          1 && (
                          <button
                            type="button"
                            onClick={() =>
                              removeVariant(
                                index
                              )
                            }
                            className="text-sm font-medium text-red-600 transition hover:text-red-700"
                          >
                            Remove
                          </button>
                        )}

                      </div>

                      <div className="grid gap-4 md:grid-cols-4">

                        <div>
                          <label
                            htmlFor={`quantity-${index}`}
                            className="mb-2 block text-sm font-medium text-gray-700"
                          >
                            Quantity *
                          </label>

                          <input
                            id={`quantity-${index}`}
                            type="number"
                            min="0"
                            step="any"
                            value={
                              variant.quantity_value
                            }
                            onChange={(
                              event
                            ) =>
                              updateVariant(
                                index,
                                "quantity_value",
                                event.target
                                  .value
                              )
                            }
                            placeholder="100"
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor={`unit-${index}`}
                            className="mb-2 block text-sm font-medium text-gray-700"
                          >
                            Unit *
                          </label>

                          <input
                            id={`unit-${index}`}
                            type="text"
                            value={
                              variant.unit
                            }
                            onChange={(
                              event
                            ) =>
                              updateVariant(
                                index,
                                "unit",
                                event.target
                                  .value
                              )
                            }
                            placeholder="ml"
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor={`price-${index}`}
                            className="mb-2 block text-sm font-medium text-gray-700"
                          >
                            Price (PKR) *
                          </label>

                          <input
                            id={`price-${index}`}
                            type="number"
                            min="0"
                            step="0.01"
                            value={
                              variant.price
                            }
                            onChange={(
                              event
                            ) =>
                              updateVariant(
                                index,
                                "price",
                                event.target
                                  .value
                              )
                            }
                            placeholder="1450"
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor={`old-price-${index}`}
                            className="mb-2 block text-sm font-medium text-gray-700"
                          >
                            Old Price
                          </label>

                          <input
                            id={`old-price-${index}`}
                            type="number"
                            min="0"
                            step="0.01"
                            value={
                              variant.old_price
                            }
                            onChange={(
                              event
                            ) =>
                              updateVariant(
                                index,
                                "old_price",
                                event.target
                                  .value
                              )
                            }
                            placeholder="1650"
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                          />
                        </div>

                      </div>

                      <div className="mt-5 flex flex-wrap gap-6">

                        <label className="flex cursor-pointer items-center gap-3">

                          <input
                            type="radio"
                            name="default-variant"
                            checked={
                              variant.is_default
                            }
                            onChange={() =>
                              setDefaultVariant(
                                index
                              )
                            }
                            className="h-4 w-4 border-gray-300 text-green-700 focus:ring-green-600"
                          />

                          <span className="text-sm font-medium text-gray-700">
                            Default variant
                          </span>

                        </label>

                        <label className="flex cursor-pointer items-center gap-3">

                          <input
                            type="checkbox"
                            checked={
                              variant.is_active
                            }
                            onChange={(
                              event
                            ) =>
                              updateVariant(
                                index,
                                "is_active",
                                event.target
                                  .checked
                              )
                            }
                            className="h-4 w-4 rounded border-gray-300 text-green-700 focus:ring-green-600"
                          />

                          <span className="text-sm font-medium text-gray-700">
                            Active
                          </span>

                        </label>

                      </div>

                    </div>
                  )
                )}

              </div>

            </section>

            {/* =================================================
                ADDITIONAL PRODUCT INFORMATION
            ================================================= */}

            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Additional Product Information
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Add detailed information about this
                  product. This information will be
                  displayed in the product detail tabs.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">

                <div>
                  <label
                    htmlFor="description"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>

                  <textarea
                    id="description"
                    rows={7}
                    value={form.description}
                    onChange={(event) =>
                      updateForm(
                        "description",
                        event.target.value
                      )
                    }
                    placeholder="Write the complete product description..."
                    className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="description_urdu"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Description (Urdu)
                  </label>

                  <textarea
                    id="description_urdu"
                    rows={7}
                    dir="rtl"
                    value={form.description_urdu}
                    onChange={(event) =>
                      updateForm(
                        "description_urdu",
                        event.target.value
                      )
                    }
                    placeholder="مصنوعات کی مکمل تفصیل یہاں لکھیں..."
                    className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-right text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  />
                </div>

              </div>

              <div className="mt-8">

                <div className="mb-4">
                  <h3 className="text-base font-semibold text-gray-900">
                    Benefits / فوائد
                  </h3>

                  <p className="mt-1 text-xs text-gray-500">
                    Explain the main benefits and wellness
                    properties of this product.
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">

                  <div>
                    <label
                      htmlFor="benefits"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Benefits
                    </label>

                    <textarea
                      id="benefits"
                      rows={7}
                      value={form.benefits}
                      onChange={(event) =>
                        updateForm(
                          "benefits",
                          event.target.value
                        )
                      }
                      placeholder="Write the product benefits..."
                      className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="benefits_urdu"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Benefits (Urdu)
                    </label>

                    <textarea
                      id="benefits_urdu"
                      rows={7}
                      dir="rtl"
                      value={form.benefits_urdu}
                      onChange={(event) =>
                        updateForm(
                          "benefits_urdu",
                          event.target.value
                        )
                      }
                      placeholder="مصنوعات کے فوائد یہاں لکھیں..."
                      className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-right text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                    />
                  </div>

                </div>

              </div>

              <div className="mt-8">

                <div className="mb-4">
                  <h3 className="text-base font-semibold text-gray-900">
                    Ingredients / اجزاء
                  </h3>

                  <p className="mt-1 text-xs text-gray-500">
                    List the ingredients or components used
                    in this product.
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">

                  <div>
                    <label
                      htmlFor="ingredients"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Ingredients
                    </label>

                    <textarea
                      id="ingredients"
                      rows={7}
                      value={form.ingredients}
                      onChange={(event) =>
                        updateForm(
                          "ingredients",
                          event.target.value
                        )
                      }
                      placeholder="List the product ingredients..."
                      className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="ingredients_urdu"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Ingredients (Urdu)
                    </label>

                    <textarea
                      id="ingredients_urdu"
                      rows={7}
                      dir="rtl"
                      value={form.ingredients_urdu}
                      onChange={(event) =>
                        updateForm(
                          "ingredients_urdu",
                          event.target.value
                        )
                      }
                      placeholder="مصنوعات کے اجزاء یہاں لکھیں..."
                      className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-right text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                    />
                  </div>

                </div>

              </div>

              <div className="mt-8">

                <div className="mb-4">
                  <h3 className="text-base font-semibold text-gray-900">
                    Usage / طریقہ استعمال
                  </h3>

                  <p className="mt-1 text-xs text-gray-500">
                    Explain how the customer should use the
                    product.
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">

                  <div>
                    <label
                      htmlFor="usage"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      How to Use
                    </label>

                    <textarea
                      id="usage"
                      rows={7}
                      value={form.usage}
                      onChange={(event) =>
                        updateForm(
                          "usage",
                          event.target.value
                        )
                      }
                      placeholder="Write the recommended method of use..."
                      className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="usage_urdu"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      How to Use (Urdu)
                    </label>

                    <textarea
                      id="usage_urdu"
                      rows={7}
                      dir="rtl"
                      value={form.usage_urdu}
                      onChange={(event) =>
                        updateForm(
                          "usage_urdu",
                          event.target.value
                        )
                      }
                      placeholder="طریقہ استعمال یہاں لکھیں..."
                      className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-right text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                    />
                  </div>

                </div>

              </div>

            </section>

            {/* =================================================
                MESSAGE
            ================================================= */}

            {message && (
              <div
                className={`rounded-lg border p-4 text-sm ${
                  message
                    .toLowerCase()
                    .includes("successfully")
                    ? "border-green-200 bg-green-50 text-green-800"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {message}
              </div>
            )}

            {/* =================================================
                ACTIONS
            ================================================= */}

            <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-end">

              <Link
                href="/admin/products"
                className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-center text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={
                  loading ||
                  categoriesLoading ||
                  healthConcernsLoading
                }
                className="rounded-lg bg-green-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Creating Product..."
                  : "Create Product"}
              </button>

            </div>

          </div>

        </form>

      </main>
    </div>
  );
}