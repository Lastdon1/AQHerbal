
"use client";

import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaWhatsapp,
} from "react-icons/fa";
import { useEffect, useState } from "react";

export default function AnnouncementBar() {
  const [language, setLanguage] = useState<"en" | "ur">("en");

  /* ============================================================
     LOAD SAVED LANGUAGE
  ============================================================ */

  useEffect(() => {
    const savedLanguage = localStorage.getItem(
      "site-language"
    ) as "en" | "ur" | null;

    if (savedLanguage === "en" || savedLanguage === "ur") {
      setLanguage(savedLanguage);
    }
  }, []);

  /* ============================================================
     CHANGE LANGUAGE
  ============================================================ */

  const changeLanguage = (newLanguage: "en" | "ur") => {
    setLanguage(newLanguage);

    localStorage.setItem(
      "site-language",
      newLanguage
    );

    window.dispatchEvent(
      new CustomEvent("language-change", {
        detail: newLanguage,
      })
    );
  };

  return (
    <div className="bg-green-800 text-white">

      <div
        className="
          mx-auto
          flex
          h-10
          max-w-7xl
          items-center
          justify-between
          px-6
        "
      >

        {/* ====================================================
            LEFT - SOCIAL MEDIA
        ===================================================== */}

        <div className="flex items-center gap-4">

          <Link
            href="#"
            className="transition hover:text-yellow-300"
            aria-label="Facebook"
          >
            <FaFacebookF size={14} />
          </Link>

          <Link
            href="#"
            className="transition hover:text-yellow-300"
            aria-label="Instagram"
          >
            <FaInstagram size={14} />
          </Link>

          <Link
            href="#"
            className="transition hover:text-yellow-300"
            aria-label="YouTube"
          >
            <FaYoutube size={15} />
          </Link>

          <Link
            href="#"
            className="transition hover:text-yellow-300"
            aria-label="WhatsApp"
          >
            <FaWhatsapp size={15} />
          </Link>

        </div>

        {/* ====================================================
            CENTER
        ===================================================== */}

        <p className="hidden text-sm font-medium lg:block">
          Inspired by Tibb-e-Nabawi (ﷺ), Trusted for Wellness
        </p>

        {/* ====================================================
            RIGHT - LANGUAGE
        ===================================================== */}

        <div className="flex items-center gap-3 text-sm">

          {/* EN */}

          <button
            type="button"
            onClick={() => changeLanguage("en")}
            className={`
              font-semibold
              transition
              ${
                language === "en"
                  ? "text-yellow-300"
                  : "text-white hover:text-yellow-300"
              }
            `}
          >
            EN
          </button>

          <span className="text-green-300">
            |
          </span>

          {/* URDU */}

          <button
            type="button"
            onClick={() => changeLanguage("ur")}
            dir="rtl"
            className={`
              font-semibold
              transition
              ${
                language === "ur"
                  ? "text-yellow-300"
                  : "text-white hover:text-yellow-300"
              }
            `}
          >
            اردو
          </button>

        </div>

      </div>

    </div>
  );
}

