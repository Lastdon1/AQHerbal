"use client";

import Link from "next/link";
import {
  FormEvent,
  useEffect,
  useState,
} from "react";

type SiteSettings = {
  id: number;

  logo_url: string | null;

  logo_text: string | null;
  logo_text_urdu: string | null;

  tagline: string | null;
  tagline_urdu: string | null;

  whatsapp_number: string | null;
  contact_number: string | null;
  email: string | null;
  address: string | null;
  business_hours: string | null;

  facebook_url: string | null;
  instagram_url: string | null;
  youtube_url: string | null;
  tiktok_url: string | null;

  updated_at: string;
};

export default function SiteSettingsPage() {
  /* ============================================================
     STATE
  ============================================================ */

  const [settings, setSettings] =
    useState<SiteSettings | null>(null);

  /*
   * These are the two editable Urdu lines
   * displayed beside the fixed ISACO logo.
   */
  const [logoTextUrdu, setLogoTextUrdu] =
    useState("");

  const [logoTextUrdu2, setLogoTextUrdu2] =
    useState("");

  const [whatsappNumber, setWhatsappNumber] =
    useState("");

  const [contactNumber, setContactNumber] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [address, setAddress] =
    useState("");

  const [businessHours, setBusinessHours] =
    useState("");

  const [facebookUrl, setFacebookUrl] =
    useState("");

  const [instagramUrl, setInstagramUrl] =
    useState("");

  const [youtubeUrl, setYoutubeUrl] =
    useState("");

  const [tiktokUrl, setTiktokUrl] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  /* ============================================================
     LOAD SETTINGS
  ============================================================ */

  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "/api/admin/site-settings"
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error ||
              "Failed to load site settings."
          );
        }

        setSettings(data);

        /*
         * Existing database field:
         * logo_text_urdu
         *
         * We use it for the first Urdu line.
         */
        setLogoTextUrdu(
          data.logo_text_urdu || ""
        );

        /*
         * The second line is stored in
         * tagline_urdu.
         */
        setLogoTextUrdu2(
          data.tagline_urdu || ""
        );

        setWhatsappNumber(
          data.whatsapp_number || ""
        );

        setContactNumber(
          data.contact_number || ""
        );

        setEmail(
          data.email || ""
        );

        setAddress(
          data.address || ""
        );

        setBusinessHours(
          data.business_hours || ""
        );

        setFacebookUrl(
          data.facebook_url || ""
        );

        setInstagramUrl(
          data.instagram_url || ""
        );

        setYoutubeUrl(
          data.youtube_url || ""
        );

        setTiktokUrl(
          data.tiktok_url || ""
        );
      } catch (err) {
        console.error(err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load site settings."
        );
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  /* ============================================================
     SAVE SETTINGS
  ============================================================ */

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const response =
        await fetch(
          "/api/admin/site-settings",
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              /*
               * Logo itself is intentionally NOT
               * changed from Admin.
               *
               * We only update the two Urdu
               * branding lines.
               */

              logo_url:
                settings?.logo_url || null,

              logo_text:
                settings?.logo_text || null,

              logo_text_urdu:
                logoTextUrdu.trim() ||
                null,

              tagline:
                settings?.tagline || null,

              tagline_urdu:
                logoTextUrdu2.trim() ||
                null,

              whatsapp_number:
                whatsappNumber.trim() ||
                null,

              contact_number:
                contactNumber.trim() ||
                null,

              email:
                email.trim() ||
                null,

              address:
                address.trim() ||
                null,

              business_hours:
                businessHours.trim() ||
                null,

              facebook_url:
                facebookUrl.trim() ||
                null,

              instagram_url:
                instagramUrl.trim() ||
                null,

              youtube_url:
                youtubeUrl.trim() ||
                null,

              tiktok_url:
                tiktokUrl.trim() ||
                null,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Failed to save site settings."
        );
      }

      setSettings(
        data.settings
      );

      setSuccess(
        "Site settings saved successfully."
      );
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to save site settings."
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
      <main>
        <div className="mx-auto max-w-5xl px-6 py-12">
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <p className="text-sm text-gray-500">
              Loading site settings...
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
    <main>
      <div className="mx-auto max-w-5xl px-6 py-8">

        {/* ======================================================
            PAGE HEADER
        ======================================================= */}

        <div className="mb-8">
          <Link
            href="/admin"
            className="text-sm font-medium text-green-700 hover:underline"
          >
            ← Back to Dashboard
          </Link>

          <h1 className="mt-3 text-3xl font-bold text-gray-900">
            Site Settings
          </h1>

          <p className="mt-2 text-gray-600">
            Manage your ISACO branding, contact
            information and social media links.
          </p>
        </div>

        {/* ======================================================
            ERROR
        ======================================================= */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* ======================================================
            SUCCESS
        ======================================================= */}

        {success && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">
            {success}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >

          {/* ====================================================
              BRANDING TEXT
          ===================================================== */}

          <section className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Logo Text
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                The ISACO logo is fixed. You can
                change the two Urdu lines displayed
                beside the logo.
              </p>
            </div>

            <div className="mt-6 space-y-6">

              {/* ------------------------------------------------
                  FIRST URDU LINE
              ------------------------------------------------- */}

              <div>
                <label
                  htmlFor="logoTextUrdu"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  First Urdu Line
                </label>

                <input
                  id="logoTextUrdu"
                  type="text"
                  value={logoTextUrdu}
                  onChange={(e) =>
                    setLogoTextUrdu(
                      e.target.value
                    )
                  }
                  dir="rtl"
                  placeholder="مرحوم حکیم عبدالعلی خان رحمہ اللہ علیہ"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-right text-base outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />

                <p
                  dir="rtl"
                  className="mt-2 text-sm text-gray-500"
                >
                  مرحوم حکیم عبدالعلی خان رحمہ اللہ علیہ
                </p>
              </div>

              {/* ------------------------------------------------
                  SECOND URDU LINE
              ------------------------------------------------- */}

              <div>
                <label
                  htmlFor="logoTextUrdu2"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Second Urdu Line
                </label>

                <input
                  id="logoTextUrdu2"
                  type="text"
                  value={logoTextUrdu2}
                  onChange={(e) =>
                    setLogoTextUrdu2(
                      e.target.value
                    )
                  }
                  dir="rtl"
                  placeholder="بانیِ مشرقی دواخانہ"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-right text-base outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />

                <p
                  dir="rtl"
                  className="mt-2 text-sm text-gray-500"
                >
                  بانیِ مشرقی دواخانہ
                </p>
              </div>

            </div>
          </section>

          {/* ====================================================
              CONTACT INFORMATION
          ===================================================== */}

          <section className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Contact Information
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                These details can be used by the
                Header, Footer, Contact page and
                WhatsApp buttons.
              </p>
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">

              {/* WhatsApp */}

              <div>
                <label
                  htmlFor="whatsapp"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  WhatsApp Number
                </label>

                <input
                  id="whatsapp"
                  type="text"
                  value={whatsappNumber}
                  onChange={(e) =>
                    setWhatsappNumber(
                      e.target.value
                    )
                  }
                  placeholder="03001234567"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />

                <p className="mt-2 text-xs text-gray-500">
                  Example: 03001234567
                </p>
              </div>

              {/* Contact Number */}

              <div>
                <label
                  htmlFor="contactNumber"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Contact Number
                </label>

                <input
                  id="contactNumber"
                  type="text"
                  value={contactNumber}
                  onChange={(e) =>
                    setContactNumber(
                      e.target.value
                    )
                  }
                  placeholder="021-12345678"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>

              {/* Email */}

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  placeholder="info@example.com"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>

              {/* Business Hours */}

              <div>
                <label
                  htmlFor="businessHours"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Business Hours
                </label>

                <input
                  id="businessHours"
                  type="text"
                  value={businessHours}
                  onChange={(e) =>
                    setBusinessHours(
                      e.target.value
                    )
                  }
                  placeholder="Mon - Sat: 10:00 AM - 8:00 PM"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>

              {/* Address */}

              <div className="sm:col-span-2">
                <label
                  htmlFor="address"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Address
                </label>

                <textarea
                  id="address"
                  value={address}
                  onChange={(e) =>
                    setAddress(
                      e.target.value
                    )
                  }
                  rows={3}
                  placeholder="ISACO office address"
                  className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>

            </div>
          </section>

          {/* ====================================================
              SOCIAL MEDIA
          ===================================================== */}

          <section className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Social Media
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Add your official social media
                profile links.
              </p>
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">

              {/* Facebook */}

              <div>
                <label
                  htmlFor="facebook"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Facebook URL
                </label>

                <input
                  id="facebook"
                  type="url"
                  value={facebookUrl}
                  onChange={(e) =>
                    setFacebookUrl(
                      e.target.value
                    )
                  }
                  placeholder="https://facebook.com/..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>

              {/* Instagram */}

              <div>
                <label
                  htmlFor="instagram"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Instagram URL
                </label>

                <input
                  id="instagram"
                  type="url"
                  value={instagramUrl}
                  onChange={(e) =>
                    setInstagramUrl(
                      e.target.value
                    )
                  }
                  placeholder="https://instagram.com/..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>

              {/* YouTube */}

              <div>
                <label
                  htmlFor="youtube"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  YouTube URL
                </label>

                <input
                  id="youtube"
                  type="url"
                  value={youtubeUrl}
                  onChange={(e) =>
                    setYoutubeUrl(
                      e.target.value
                    )
                  }
                  placeholder="https://youtube.com/..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>

              {/* TikTok */}

              <div>
                <label
                  htmlFor="tiktok"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  TikTok URL
                </label>

                <input
                  id="tiktok"
                  type="url"
                  value={tiktokUrl}
                  onChange={(e) =>
                    setTiktokUrl(
                      e.target.value
                    )
                  }
                  placeholder="https://tiktok.com/@..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>

            </div>
          </section>

          {/* ====================================================
              SAVE BUTTON
          ===================================================== */}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

            <Link
              href="/admin"
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center rounded-lg bg-green-700 px-7 py-3 text-sm font-medium text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>

          </div>

        </form>
      </div>
    </main>
  );
}
