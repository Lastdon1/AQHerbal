"use client";

import { useState } from "react";

type ProductTabsProps = {
  description?: string;
  descriptionUrdu?: string;
  benefits?: string;
  benefitsUrdu?: string;
  ingredients?: string;
  ingredientsUrdu?: string;
  usage?: string;
  usageUrdu?: string;
};

const tabs = [
  { id: "description", label: "Description", urdu: "تفصیل" },
  { id: "benefits", label: "Benefits", urdu: "فوائد" },
  { id: "ingredients", label: "Ingredients", urdu: "اجزاء" },
  { id: "usage", label: "How to Use", urdu: "طریقہ استعمال" },
  { id: "reviews", label: "Reviews", urdu: "جائزے" },
];

export default function ProductTabs({
  description,
  descriptionUrdu,
  benefits,
  benefitsUrdu,
  ingredients,
  ingredientsUrdu,
  usage,
  usageUrdu,
}: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState("description");

  function renderContent() {
    switch (activeTab) {
      case "description":
        return (
          <div className="space-y-5">
            {description && (
              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  Description
                </h3>
                <p className="whitespace-pre-line leading-7 text-gray-600">
                  {description}
                </p>
              </div>
            )}

            {descriptionUrdu && (
              <div dir="rtl" className="text-right">
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  تفصیل
                </h3>
                <p className="whitespace-pre-line leading-8 text-gray-600">
                  {descriptionUrdu}
                </p>
              </div>
            )}

            {!description && !descriptionUrdu && (
              <p className="text-gray-500">
                No description available.
              </p>
            )}
          </div>
        );

      case "benefits":
        return (
          <div className="space-y-5">
            {benefits && (
              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  Benefits
                </h3>
                <p className="whitespace-pre-line leading-7 text-gray-600">
                  {benefits}
                </p>
              </div>
            )}

            {benefitsUrdu && (
              <div dir="rtl" className="text-right">
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  فوائد
                </h3>
                <p className="whitespace-pre-line leading-8 text-gray-600">
                  {benefitsUrdu}
                </p>
              </div>
            )}

            {!benefits && !benefitsUrdu && (
              <p className="text-gray-500">
                No benefits information available.
              </p>
            )}
          </div>
        );

      case "ingredients":
        return (
          <div className="space-y-5">
            {ingredients && (
              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  Ingredients
                </h3>
                <p className="whitespace-pre-line leading-7 text-gray-600">
                  {ingredients}
                </p>
              </div>
            )}

            {ingredientsUrdu && (
              <div dir="rtl" className="text-right">
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  اجزاء
                </h3>
                <p className="whitespace-pre-line leading-8 text-gray-600">
                  {ingredientsUrdu}
                </p>
              </div>
            )}

            {!ingredients && !ingredientsUrdu && (
              <p className="text-gray-500">
                No ingredients information available.
              </p>
            )}
          </div>
        );

      case "usage":
        return (
          <div className="space-y-5">
            {usage && (
              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  How to Use
                </h3>
                <p className="whitespace-pre-line leading-7 text-gray-600">
                  {usage}
                </p>
              </div>
            )}

            {usageUrdu && (
              <div dir="rtl" className="text-right">
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  طریقہ استعمال
                </h3>
                <p className="whitespace-pre-line leading-8 text-gray-600">
                  {usageUrdu}
                </p>
              </div>
            )}

            {!usage && !usageUrdu && (
              <p className="text-gray-500">
                No usage information available.
              </p>
            )}
          </div>
        );

      case "reviews":
        return (
          <div className="py-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Customer Reviews
            </h3>

            <p className="mt-2 text-gray-500">
              No reviews yet. Be the first to review this product.
            </p>

            <button
              type="button"
              className="mt-5 rounded-lg bg-green-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
            >
              Write a Review
            </button>
          </div>
        );

      default:
        return null;
    }
  }

  return (
    <section className="mt-10 border-t border-gray-200 pt-8">
      {/* Tabs */}
      <div className="overflow-x-auto">
        <div className="flex min-w-max border-b border-gray-200">
          {tabs.map((tab) => {
            const active = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-5 py-4 text-sm font-semibold transition ${
                  active
                    ? "text-green-700"
                    : "text-gray-500 hover:text-green-700"
                }`}
              >
                <span>{tab.label}</span>

                <span
                  dir="rtl"
                  className="ml-2 text-xs font-normal"
                >
                  {tab.urdu}
                </span>

                {active && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-700" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="py-8">
        {renderContent()}
      </div>
    </section>
  );
}