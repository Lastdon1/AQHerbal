"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";

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
  sort_order?: number;
  is_primary: boolean;
  uploading?: boolean;
};

type ProductVariant = {
  id?: number;
  quantity_value: string;
  unit: string;
  price: string;
  old_price: string;
  is_default: boolean;
  is_active: boolean;
};

type ProductForm = {
  name: string;
  name_urdu: string;
  slug: string;
  category_id: string;

  description: string;
  description_urdu: string;

  benefits: string;
  benefits_urdu: string;

  ingredients: string;
  ingredients_urdu: string;

  usage: string;
  usage_urdu: string;

  is_active: boolean;
};

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function EditProductPage({
  params,
}: PageProps) {
  const { id } = use(params);

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

  const [form, setForm] = useState<ProductForm>({
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

  const [images, setImages] = useState<ProductImage[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /*
  =====================================================
  LOAD CATEGORIES
  =====================================================
  */

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

        setError(
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

  /*
  =====================================================
  LOAD HEALTH CONCERNS
  =====================================================
  */

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

        setError(
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

  /*
  =====================================================
  LOAD PRODUCT
  =====================================================
  */

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        setError("");
        setMessage("");

        const response = await fetch(
          `/api/admin/products/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error || "Failed to load product."
          );
        }

        const product = data.product;

        setForm({
          name: product.name || "",
          name_urdu: product.name_urdu || "",
          slug: product.slug || "",

          category_id:
            product.category_id !== null &&
            product.category_id !== undefined
              ? String(product.category_id)
              : "",

          description: product.description || "",
          description_urdu:
            product.description_urdu || "",

          benefits: product.benefits || "",
          benefits_urdu:
            product.benefits_urdu || "",

          ingredients: product.ingredients || "",
          ingredients_urdu:
            product.ingredients_urdu || "",

          usage: product.usage || "",
          usage_urdu: product.usage_urdu || "",

          is_active: product.is_active ?? true,
        });

        setImages(
          (data.images || []).map(
            (image: ProductImage) => ({
              image_url: image.image_url || "",
              alt_text: image.alt_text || "",
              sort_order: image.sort_order ?? 0,
              is_primary: image.is_primary || false,
              uploading: false,
            })
          )
        );

        setVariants(
          (data.variants || []).map(
            (variant: {
              id: number;
              quantity_value: string | number;
              unit: string;
              price: string | number;
              old_price: string | number | null;
              is_default: boolean;
              is_active: boolean;
            }) => ({
              id: variant.id,
              quantity_value: String(
                variant.quantity_value
              ),
              unit: variant.unit || "",
              price: String(variant.price),
              old_price:
                variant.old_price !== null &&
                variant.old_price !== undefined
                  ? String(variant.old_price)
                  : "",
              is_default:
                variant.is_default || false,
              is_active:
                variant.is_active ?? true,
            })
          )
        );

        setSelectedHealthConcerns(
          (data.health_concerns || []).map(
            (concern: { id: number }) => concern.id
          )
        );
      } catch (error) {
        console.error("Load product error:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load product."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  /*
  =====================================================
  FORM HELPERS
  =====================================================
  */

  function updateForm(
    field: keyof ProductForm,
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

  /*
  =====================================================
  HEALTH CONCERNS
  =====================================================
  */

  function toggleHealthConcern(id: number) {
    setSelectedHealthConcerns((previous) =>
      previous.includes(id)
        ? previous.filter(
            (concernId) => concernId !== id
          )
        : [...previous, id]
    );
  }

  /*
  =====================================================
  IMAGE UPLOAD
  =====================================================
  */

  async function uploadImage(
    index: number,
    file: File
  ) {
    setMessage("");
    setError("");

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
          data?.error || "Failed to upload image."
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
      console.error("Image upload error:", error);

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

      setError(
        error instanceof Error
          ? error.message
          : "Failed to upload image."
      );
    }
  }

  function addImage() {
    setImages((previous) => [
      ...previous,
      {
        image_url: "",
        alt_text: "",
        sort_order: previous.length,
        is_primary: previous.length === 0,
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
        (_, imageIndex) => imageIndex !== index
      );

      if (remaining.length === 0) {
        return [];
      }

      if (
        !remaining.some(
          (image) => image.is_primary
        )
      ) {
        remaining[0].is_primary = true;
      }

      return remaining.map((image, imageIndex) => ({
        ...image,
        sort_order: imageIndex,
      }));
    });
  }

  /*
  =====================================================
  VARIANTS
  =====================================================
  */

  function addVariant() {
    setVariants((previous) => [
      ...previous,
      {
        quantity_value: "",
        unit: "",
        price: "",
        old_price: "",
        is_default: previous.length === 0,
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
        is_default: variantIndex === index,
      }))
    );
  }

  function removeVariant(index: number) {
    setVariants((previous) => {
      const remaining = previous.filter(
        (_, variantIndex) => variantIndex !== index
      );

      if (remaining.length === 0) {
        return [];
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

  /*
  =====================================================
  SAVE PRODUCT
  =====================================================
  */

  async function handleSubmit(
    event: React.SyntheticEvent
  ) {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!form.name.trim()) {
      setError("Product name is required.");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    if (!form.slug.trim()) {
      setError("Product slug is required.");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    if (!form.category_id) {
      setError("Please select a category.");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    if (
      images.some(
        (image) => image.uploading
      )
    ) {
      setError(
        "Please wait until all images finish uploading."
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    const cleanedImages = images.map(
      (image, index) => ({
        image_url: image.image_url.trim(),
        alt_text:
          image.alt_text.trim() || null,
        sort_order: index,
        is_primary: image.is_primary,
      })
    );

    if (cleanedImages.length === 0) {
      setError(
        "Please add at least one product image."
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    if (
      cleanedImages.some(
        (image) => !image.image_url
      )
    ) {
      setError(
        "Please upload an image for every image slot."
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    const primaryImageIndex =
      cleanedImages.findIndex(
        (image) => image.is_primary
      );

    if (primaryImageIndex === -1) {
      cleanedImages[0].is_primary = true;
    } else {
      cleanedImages.forEach(
        (image, index) => {
          image.is_primary =
            index === primaryImageIndex;
        }
      );
    }

    if (variants.length === 0) {
      setError(
        "At least one product variant is required."
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    const cleanedVariants = variants.map(
      (variant) => ({
        id: variant.id,

        quantity_value: Number(
          variant.quantity_value
        ),

        unit: variant.unit.trim(),

        price: Number(variant.price),

        old_price:
          variant.old_price.trim() === ""
            ? null
            : Number(variant.old_price),

        is_default: variant.is_default,
        is_active: variant.is_active,
      })
    );

    const invalidVariant =
      cleanedVariants.some(
        (variant) =>
          !Number.isFinite(
            variant.quantity_value
          ) ||
          variant.quantity_value <= 0 ||
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
      setError(
        "Please enter valid values for every product variant."
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    const defaultVariantIndex =
      cleanedVariants.findIndex(
        (variant) => variant.is_default
      );

    if (defaultVariantIndex === -1) {
      cleanedVariants[0].is_default = true;
    } else {
      cleanedVariants.forEach(
        (variant, index) => {
          variant.is_default =
            index === defaultVariantIndex;
        }
      );
    }

    /*
    IMPORTANT:
    No homepage section fields are sent here.
    No display order is sent here.
    Editing the product does not control homepage placement.
    */

    const payload = {
      name: form.name.trim(),

      name_urdu:
        form.name_urdu.trim() || null,

      slug: form.slug.trim(),

      category_id: Number(
        form.category_id
      ),

      description:
        form.description.trim() || null,

      description_urdu:
        form.description_urdu.trim() ||
        null,

      benefits:
        form.benefits.trim() || null,

      benefits_urdu:
        form.benefits_urdu.trim() ||
        null,

      ingredients:
        form.ingredients.trim() || null,

      ingredients_urdu:
        form.ingredients_urdu.trim() ||
        null,

      usage:
        form.usage.trim() || null,

      usage_urdu:
        form.usage_urdu.trim() || null,

      is_active: form.is_active,

      health_concern_ids:
        selectedHealthConcerns,

      images: cleanedImages,

      variants: cleanedVariants,
    };

    setSaving(true);

    try {
      const response = await fetch(
        `/api/admin/products/${id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Failed to update product."
        );
      }

      setError("");
      setMessage(
        "Product updated successfully."
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      setTimeout(() => {
        setMessage("");
      }, 4000);
    } catch (error) {
      console.error(
        "Update product error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update product."
      );

      setMessage("");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } finally {
      setSaving(false);
    }
  }

  /*
  =====================================================
  DELETE PRODUCT
  =====================================================
  */

  async function handleDelete() {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this product? This will also delete its images, variants, and health concern relationships."
      );

    if (!confirmed) {
      return;
    }

    setDeleting(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `/api/admin/products/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Failed to delete product."
        );
      }

      window.location.href =
        "/admin/products";
    } catch (error) {
      console.error(
        "Delete product error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete product."
      );

      setDeleting(false);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }

  /*
  =====================================================
  LOADING
  =====================================================
  */

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="border-b bg-white">
          <div className="mx-auto max-w-7xl px-6 py-5">
            <h1 className="text-2xl font-semibold text-gray-900">
              Edit Product
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Loading product information...
            </p>
          </div>
        </div>

        <main className="mx-auto max-w-7xl px-6 py-12">
          <div className="flex items-center justify-center rounded-xl border border-gray-200 bg-white p-12 shadow-sm">
            <div className="text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-green-700" />

              <p className="mt-4 text-sm text-gray-500">
                Loading product...
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  /*
  =====================================================
  PAGE
  =====================================================
  */

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}

      <div className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Edit Product
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Update product information,
              images, variants and health
              concerns.
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

      {/* MAIN */}

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* SUCCESS / ERROR */}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
            <span className="text-base">
              ✕
            </span>

            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-800">
            <span className="text-base">
              ✓
            </span>

            <span>{message}</span>
          </div>
        )}

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
                  Update the main information
                  for this product.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {/* PRODUCT NAME */}

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
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  />
                </div>

                {/* URDU NAME */}

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
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-right text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  />
                </div>

                {/* SLUG */}

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

                {/* CATEGORY */}

                <div>
                  <label
                    htmlFor="category_id"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Category *
                  </label>

                  <select
                    id="category_id"
                    value={form.category_id}
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
                          key={category.id}
                          value={category.id}
                        >
                          {category.name}

                          {category.name_urdu
                            ? ` — ${category.name_urdu}`
                            : ""}
                        </option>
                      )
                    )}
                  </select>
                </div>

                {/* STATUS */}

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
                        event.target.value ===
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
                  Select the health concerns
                  related to this product.
                </p>
              </div>

              {healthConcernsLoading ? (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-5 text-sm text-gray-500">
                  Loading health concerns...
                </div>
              ) : healthConcerns.length === 0 ? (
                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-5 text-sm text-yellow-800">
                  No active health concerns
                  are available.
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
                                {
                                  concern.name_urdu
                                }
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
                  {
                    selectedHealthConcerns.length
                  }{" "}
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
                    Manage all images for this
                    product.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addImage}
                  className="rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-800"
                >
                  + Add Image
                </button>
              </div>

              {images.length === 0 ? (
                <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center">
                  <p className="text-sm text-gray-500">
                    No product images.
                  </p>

                  <button
                    type="button"
                    onClick={addImage}
                    className="mt-3 text-sm font-semibold text-green-700 hover:text-green-800"
                  >
                    + Add first image
                  </button>
                </div>
              ) : (
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
                              Image {index + 1}
                            </h3>
                          </div>

                          {images.length > 1 && (
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

                            <label className="flex min-h-[180px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-white px-6 py-6 text-center transition hover:border-green-600 hover:bg-green-50">
                              {image.uploading ? (
                                <div className="flex flex-col items-center">
                                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-green-700" />

                                  <span className="mt-3 text-sm font-medium text-gray-700">
                                    Uploading...
                                  </span>
                                </div>
                              ) : image.image_url ? (
                                <div className="flex flex-col items-center">
                                  <img
                                    src={
                                      image.image_url
                                    }
                                    alt={
                                      image.alt_text ||
                                      `Product image ${
                                        index + 1
                                      }`
                                    }
                                    className="h-28 w-28 rounded-lg border border-gray-200 object-cover"
                                  />

                                  <span className="mt-3 text-sm font-semibold text-green-700">
                                    Change Image
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

                                  if (file) {
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
                              onChange={(event) =>
                                updateImage(
                                  index,
                                  "alt_text",
                                  event.target.value
                                )
                              }
                              placeholder="Premium Black Seed Oil"
                              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                            />

                            <p className="mt-2 text-xs text-gray-500">
                              Describe the image
                              for SEO and
                              accessibility.
                            </p>
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
              )}
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
                    Manage quantities, units
                    and prices for this
                    product.
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

              {variants.length === 0 ? (
                <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center">
                  <p className="text-sm text-red-600">
                    This product has no
                    variants.
                  </p>

                  <button
                    type="button"
                    onClick={addVariant}
                    className="mt-3 text-sm font-semibold text-green-700 hover:text-green-800"
                  >
                    + Add Variant
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  {variants.map(
                    (variant, index) => (
                      <div
                        key={
                          variant.id ??
                          `new-${index}`
                        }
                        className="rounded-xl border border-gray-200 bg-gray-50 p-5"
                      >
                        <div className="mb-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-sm font-semibold text-green-700">
                              {index + 1}
                            </span>

                            <h3 className="text-sm font-semibold text-gray-800">
                              Variant {index + 1}
                            </h3>
                          </div>

                          {variants.length > 1 && (
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
                              onChange={(event) =>
                                updateVariant(
                                  index,
                                  "quantity_value",
                                  event.target.value
                                )
                              }
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
                              onChange={(event) =>
                                updateVariant(
                                  index,
                                  "unit",
                                  event.target.value
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
                              onChange={(event) =>
                                updateVariant(
                                  index,
                                  "price",
                                  event.target.value
                                )
                              }
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
                              onChange={(event) =>
                                updateVariant(
                                  index,
                                  "old_price",
                                  event.target.value
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
                              onChange={(event) =>
                                updateVariant(
                                  index,
                                  "is_active",
                                  event.target.checked
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
              )}
            </section>

            {/* =================================================
                PRODUCT INFORMATION
            ================================================= */}

            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Product Information
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Add the description, benefits,
                  ingredients and usage instructions
                  in English and Urdu.
                </p>
              </div>

              <div className="space-y-8">
                {/* DESCRIPTION */}

                <div>
                  <h3 className="mb-4 text-base font-semibold text-gray-900">
                    Description
                  </h3>

                  <div className="space-y-5">
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
                        value={
                          form.description
                        }
                        onChange={(event) =>
                          updateForm(
                            "description",
                            event.target.value
                          )
                        }
                        placeholder="Enter product description..."
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
                        value={
                          form.description_urdu
                        }
                        onChange={(event) =>
                          updateForm(
                            "description_urdu",
                            event.target.value
                          )
                        }
                        placeholder="مصنوعات کی تفصیل درج کریں..."
                        className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-right text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                      />
                    </div>
                  </div>
                </div>

                {/* BENEFITS */}

                <div className="border-t border-gray-100 pt-8">
                  <h3 className="mb-4 text-base font-semibold text-gray-900">
                    Benefits
                  </h3>

                  <div className="space-y-5">
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
                        value={
                          form.benefits
                        }
                        onChange={(event) =>
                          updateForm(
                            "benefits",
                            event.target.value
                          )
                        }
                        placeholder="Enter product benefits..."
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
                        value={
                          form.benefits_urdu
                        }
                        onChange={(event) =>
                          updateForm(
                            "benefits_urdu",
                            event.target.value
                          )
                        }
                        placeholder="مصنوعات کے فوائد درج کریں..."
                        className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-right text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                      />
                    </div>
                  </div>
                </div>

                {/* INGREDIENTS */}

                <div className="border-t border-gray-100 pt-8">
                  <h3 className="mb-4 text-base font-semibold text-gray-900">
                    Ingredients
                  </h3>

                  <div className="space-y-5">
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
                        value={
                          form.ingredients
                        }
                        onChange={(event) =>
                          updateForm(
                            "ingredients",
                            event.target.value
                          )
                        }
                        placeholder="Enter product ingredients..."
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
                        value={
                          form.ingredients_urdu
                        }
                        onChange={(event) =>
                          updateForm(
                            "ingredients_urdu",
                            event.target.value
                          )
                        }
                        placeholder="مصنوعات کے اجزاء درج کریں..."
                        className="w-full resize-y rounded-lg border border-gray-300 bg-white px-4 py-3 text-right text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                      />
                    </div>
                  </div>
                </div>

                {/* HOW TO USE */}

                <div className="border-t border-gray-100 pt-8">
                  <h3 className="mb-4 text-base font-semibold text-gray-900">
                    How to Use
                  </h3>

                  <div className="space-y-5">
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
                        placeholder="Enter instructions for use..."
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
                        value={
                          form.usage_urdu
                        }
                        onChange={(event) =>
                          updateForm(
                            "usage_urdu",
                            event.target.value
                          )
                        }
                        placeholder="طریقہ استعمال درج کریں..."
                        className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-right text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* =================================================
                ACTIONS
            ================================================= */}

            <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={handleDelete}
                disabled={
                  deleting || saving
                }
                className="rounded-lg border border-red-200 bg-white px-6 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting
                  ? "Deleting..."
                  : "Delete Product"}
              </button>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/admin/products"
                  className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-center text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={
                    saving ||
                    categoriesLoading ||
                    healthConcernsLoading
                  }
                  className="rounded-lg bg-green-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving Changes..."
                    : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}