import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaWhatsapp,
} from "react-icons/fa";

export default function AnnouncementBar() {
  return (
    <div className="bg-green-800 text-white">
      <div className="mx-auto flex h-10 max-w-7xl items-center justify-between px-6">

        {/* Left Side - Social Media */}
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

        {/* Center */}
        <p className="hidden lg:block text-sm font-medium">
          Inspired by Tibb-e-Nabawi (ﷺ), Trusted for Wellness
        </p>

        {/* Right Side */}
        <div className="flex items-center gap-3 text-sm">

          <button className="font-semibold text-yellow-300 transition hover:text-white">
            EN
          </button>

          <span className="text-green-300">|</span>

          <button className="transition hover:text-yellow-300">
            اردو
          </button>

        </div>

      </div>
    </div>
  );
}