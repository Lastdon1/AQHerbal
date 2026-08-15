"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

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

export default function HealthConcernsPage() {
  const [healthConcerns, setHealthConcerns] = useState<HealthConcern[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHealthConcerns() {
      try {
        const response = await fetch("/api/health-concerns", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to load health concerns.");
        }

        const data: HealthConcern[] = await response.json();

        setHealthConcerns(
          data.filter((item) => item.is_active)
        );
      } catch (error) {
        console.error("Health concerns error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadHealthConcerns();
  }, []);

  return (
    <main className="min-h-screen bg-white">
      {/* Page Header */}
      <section className="bg-green-900 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p
            dir="rtl"
            className="mb-2 text-xl leading-relaxed text-white/90"
          >
            صحت کے مسائل
          </p>

          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Health Concerns
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
            Explore our natural wellness products based on
            different health and wellness needs.
          </p>
        </div>
      </section>

      {/* Health Concerns */}
      <section className="mx-auto max-w-7xl px-6 py-10 sm:py-14">
        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl bg-white shadow-sm"
              >
                <div className="aspect-square animate-pulse bg-gray-100" />

                <div className="space-y-3 p-4">
                  <div className="mx-auto h-5 w-24 animate-pulse rounded bg-gray-100" />
                  <div className="mx-auto h-4 w-32 animate-pulse rounded bg-gray-100" />
                  <div className="mx-auto h-3 w-20 animate-pulse rounded bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        ) : healthConcerns.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-12 text-center">
            <p className="text-sm text-gray-500">
              No health concerns available.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {healthConcerns.map((item) => (
              <Link
                key={item.id}
                href={`/health-concern/${item.slug}`}
                className="
                  group
                  overflow-hidden
                  rounded-2xl
                  bg-white
                  shadow-sm
                  transition
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-lg
                "
              >
                {/* Image */}
                <div className="relative aspect-square bg-green-50">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="
                        (max-width: 640px) 50vw,
                        (max-width: 1024px) 33vw,
                        25vw
                      "
                      className="
                        object-contain
                        p-3
                        transition
                        duration-500
                        group-hover:scale-105
                      "
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-gray-400">
                      No image
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-3 text-center sm:p-4">
                  <p
                    dir="rtl"
                    className="
                      text-base
                      font-bold
                      leading-relaxed
                      text-green-800
                      sm:text-lg
                    "
                  >
                    {item.name_urdu}
                  </p>

                  <h2 className="mt-1 text-sm font-semibold text-gray-900 sm:text-base">
                    {item.name}
                  </h2>

                  {item.description && (
                    <p className="mt-1 hidden text-xs leading-5 text-gray-500 sm:block">
                      {item.description}
                    </p>
                  )}

                  <span
                    className="
                      mt-2
                      inline-block
                      text-xs
                      font-semibold
                      text-green-700
                      transition
                      group-hover:text-green-900
                      sm:mt-3
                      sm:text-sm
                    "
                  >
                    Explore Products →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}