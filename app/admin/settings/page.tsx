"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Globe,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Save,
  Settings,
  Clock,
  ExternalLink,
} from "lucide-react";
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
  const [settings, setSettings] =
    useState<SiteSettings | null>(null);

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
          "/api/admin/site-settings",
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
              "Failed to load site settings."
          );
        }

        setSettings(data);

        setLogoTextUrdu(
          data.logo_text_urdu || ""
        );

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
     SAVE
  ============================================================ */

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const response = await fetch(
        "/api/admin/site-settings",
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            logo_url:
              settings?.logo_url || null,

            logo_text:
              settings?.logo_text || null,

            logo_text_urdu:
              logoTextUrdu.trim() || null,

            tagline:
              settings?.tagline || null,

            tagline_urdu:
              logoTextUrdu2.trim() || null,

            whatsapp_number:
              whatsappNumber.trim() || null,

            contact_number:
              contactNumber.trim() || null,

            email:
              email.trim() || null,

            address:
              address.trim() || null,

            business_hours:
              businessHours.trim() || null,

            facebook_url:
              facebookUrl.trim() || null,

            instagram_url:
              instagramUrl.trim() || null,

            youtube_url:
              youtubeUrl.trim() || null,

            tiktok_url:
              tiktokUrl.trim() || null,
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

      setSettings(data.settings);

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
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
            <Settings className="mx-auto h-8 w-8 text-green-700" />

            <p className="mt-4 text-sm text-gray-500">
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
    <main className="min-h-screen bg-gradient-to-b from-green-50/70 via-gray-50 to-gray-50 p-4 sm:p-6">
      <div className="mx-auto max-w-6xl">

        {/* ======================================================
            HEADER
        ======================================================= */}

        <div className="mb-8">

          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-sm font-medium text-green-700 transition hover:text-green-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <div className="mt-5 flex items-start gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-800 text-white shadow-sm">
              <Settings className="h-6 w-6" />
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Site Settings
              </h1>

              <p className="mt-1 text-sm text-gray-600">
                Manage your ISACO branding, contact
                information and social media links.
              </p>
            </div>

          </div>
        </div>

        {/* ======================================================
            ALERTS
        ======================================================= */}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-red-500" />

            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />

            <span>{success}</span>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* ====================================================
              BRANDING
          ===================================================== */}

          <section className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-100">

            <div className="border-b border-gray-100 bg-gradient-to-r from-green-50 to-white px-6 py-5 sm:px-8">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-700">
                  <Globe className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    ISACO Branding
                  </h2>

                  <p className="text-sm text-gray-500">
                    Manage the Urdu branding text shown
                    with your logo.
                  </p>
                </div>

              </div>
            </div>

            <div className="grid gap-6 p-6 sm:p-8">

              {/* First Urdu line */}

              <div>
                <label
                  htmlFor="logoTextUrdu"
                  className="mb-2 block text-sm font-semibold text-gray-700"
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
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-right text-base text-gray-900 outline-none transition focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-50"
                />

                <p
                  dir="rtl"
                  className="mt-2 text-sm text-gray-500"
                >
                  مرحوم حکیم عبدالعلی خان رحمہ اللہ علیہ
                </p>
              </div>

              {/* Second Urdu line */}

              <div>
                <label
                  htmlFor="logoTextUrdu2"
                  className="mb-2 block text-sm font-semibold text-gray-700"
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
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-right text-base text-gray-900 outline-none transition focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-50"
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
              CONTACT
          ===================================================== */}

          <section className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-100">

            <div className="border-b border-gray-100 bg-gradient-to-r from-green-50 to-white px-6 py-5 sm:px-8">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-700">
                  <Phone className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Contact Information
                  </h2>

                  <p className="text-sm text-gray-500">
                    Contact details used throughout
                    the storefront.
                  </p>
                </div>

              </div>
            </div>

            <div className="grid gap-6 p-6 sm:grid-cols-2 sm:p-8">

              {/* WhatsApp */}

              <div>
                <label
                  htmlFor="whatsapp"
                  className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700"
                >
                  <MessageCircle className="h-4 w-4 text-green-600" />
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
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-50"
                />
              </div>

              {/* Contact */}

              <div>
                <label
                  htmlFor="contactNumber"
                  className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700"
                >
                  <Phone className="h-4 w-4 text-green-600" />
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
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-50"
                />
              </div>

              {/* Email */}

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700"
                >
                  <Mail className="h-4 w-4 text-green-600" />
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="info@example.com"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-50"
                />
              </div>

              {/* Hours */}

              <div>
                <label
                  htmlFor="businessHours"
                  className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700"
                >
                  <Clock className="h-4 w-4 text-green-600" />
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
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-50"
                />
              </div>

              {/* Address */}

              <div className="sm:col-span-2">
                <label
                  htmlFor="address"
                  className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700"
                >
                  <MapPin className="h-4 w-4 text-green-600" />
                  Address
                </label>

                <textarea
                  id="address"
                  value={address}
                  onChange={(e) =>
                    setAddress(e.target.value)
                  }
                  rows={3}
                  placeholder="ISACO office address"
                  className="w-full resize-y rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-50"
                />
              </div>

            </div>
          </section>

          {/* ====================================================
              SOCIAL MEDIA
          ===================================================== */}

          <section className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-100">

            <div className="border-b border-gray-100 bg-gradient-to-r from-green-50 to-white px-6 py-5 sm:px-8">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-700">
                  <ExternalLink className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Social Media
                  </h2>

                  <p className="text-sm text-gray-500">
                    Add your official social media
                    profile links.
                  </p>
                </div>

              </div>
            </div>

            <div className="grid gap-6 p-6 sm:grid-cols-2 sm:p-8">

              {/* Facebook */}

              <div>
                <label
                  htmlFor="facebook"
                  className="mb-2 block text-sm font-semibold text-gray-700"
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
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-50"
                />
              </div>

              {/* Instagram */}

              <div>
                <label
                  htmlFor="instagram"
                  className="mb-2 block text-sm font-semibold text-gray-700"
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
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-50"
                />
              </div>

              {/* YouTube */}

              <div>
                <label
                  htmlFor="youtube"
                  className="mb-2 block text-sm font-semibold text-gray-700"
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
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-50"
                />
              </div>

              {/* TikTok */}

              <div>
                <label
                  htmlFor="tiktok"
                  className="mb-2 block text-sm font-semibold text-gray-700"
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
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-50"
                />
              </div>

            </div>
          </section>

          {/* ====================================================
              SAVE
          ===================================================== */}

          <div className="sticky bottom-4 z-20 flex justify-end">

            <div className="flex w-full items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white/95 p-3 shadow-xl backdrop-blur sm:w-auto">

              <Link
                href="/admin"
                className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-800 px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save className="h-4 w-4" />

                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>

            </div>
          </div>

        </form>
      </div>
    </main>
  );
}