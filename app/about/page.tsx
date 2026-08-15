import Image from "next/image";
import Link from "next/link";
import pool from "@/lib/db";

export const dynamic = "force-dynamic";

type AboutContent = {
  image_url: string | null;

  hero_label: string | null;
  hero_title: string | null;
  hero_description: string | null;
  hero_urdu: string | null;

  story_label: string | null;
  story_title: string | null;
  story_paragraph_1: string | null;
  story_paragraph_2: string | null;
  story_paragraph_3: string | null;

  mission_label: string | null;
  mission_title: string | null;
  mission_description: string | null;
  mission_urdu: string | null;

  values_label: string | null;
  values_title: string | null;
  values_description: string | null;

  value_1_title: string | null;
  value_1_title_urdu: string | null;
  value_1_description: string | null;

  value_2_title: string | null;
  value_2_title_urdu: string | null;
  value_2_description: string | null;

  value_3_title: string | null;
  value_3_title_urdu: string | null;
  value_3_description: string | null;

  value_4_title: string | null;
  value_4_title_urdu: string | null;
  value_4_description: string | null;

  cta_title: string | null;
  cta_description: string | null;
};

/* ============================================================
   GET ABOUT CONTENT
============================================================ */

async function getAboutContent(): Promise<AboutContent | null> {
  try {
    const result = await pool.query(`
      SELECT
        image_url,

        hero_label,
        hero_title,
        hero_description,
        hero_urdu,

        story_label,
        story_title,
        story_paragraph_1,
        story_paragraph_2,
        story_paragraph_3,

        mission_label,
        mission_title,
        mission_description,
        mission_urdu,

        values_label,
        values_title,
        values_description,

        value_1_title,
        value_1_title_urdu,
        value_1_description,

        value_2_title,
        value_2_title_urdu,
        value_2_description,

        value_3_title,
        value_3_title_urdu,
        value_3_description,

        value_4_title,
        value_4_title_urdu,
        value_4_description,

        cta_title,
        cta_description

      FROM about_page

      WHERE id = 1

      LIMIT 1
    `);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0] as AboutContent;
  } catch (error) {
    console.error(
      "Get public About page error:",
      error
    );

    return null;
  }
}

/* ============================================================
   PUBLIC ABOUT PAGE
============================================================ */

export default async function AboutPage() {
  const content = await getAboutContent();

  /* ----------------------------------------------------------
     Fallback content
  ---------------------------------------------------------- */

  if (!content) {
    return (
      <main className="min-h-screen bg-white">
        <section className="mx-auto max-w-7xl px-6 py-20 text-center">
          <h1 className="text-3xl font-bold text-green-950">
            About ISACO
          </h1>

          <p className="mt-4 text-gray-600">
            About page content is currently unavailable.
          </p>
        </section>
      </main>
    );
  }

  /* ----------------------------------------------------------
     About image
     
     If an Admin-uploaded image exists, use it.
     Otherwise keep the original fallback image.
  ---------------------------------------------------------- */

  const aboutImage =
    content.image_url ||
    "/about/about-isaco.jpg";

  /* ----------------------------------------------------------
     Values
  ---------------------------------------------------------- */

  const values = [
    {
      title: content.value_1_title,
      titleUrdu: content.value_1_title_urdu,
      description: content.value_1_description,
    },
    {
      title: content.value_2_title,
      titleUrdu: content.value_2_title_urdu,
      description: content.value_2_description,
    },
    {
      title: content.value_3_title,
      titleUrdu: content.value_3_title_urdu,
      description: content.value_3_description,
    },
    {
      title: content.value_4_title,
      titleUrdu: content.value_4_title_urdu,
      description: content.value_4_description,
    },
  ];

  return (
    <main className="min-h-screen bg-white">

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="bg-green-50">
        <div className="mx-auto max-w-7xl px-6 py-14 text-center sm:py-16">

          {content.hero_label && (
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-green-700">
              {content.hero_label}
            </p>
          )}

          {content.hero_title && (
            <h1 className="text-3xl font-bold text-green-950 sm:text-4xl md:text-5xl">
              {content.hero_title}
            </h1>
          )}

          {content.hero_description && (
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
              {content.hero_description}
            </p>
          )}

          {content.hero_urdu && (
            <p
              dir="rtl"
              className="mt-3 text-xl font-medium text-green-800"
            >
              {content.hero_urdu}
            </p>
          )}

        </div>
      </section>

      {/* =====================================================
          OUR STORY
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-6 py-14 sm:py-20">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">

          {/* --------------------------------------------------
              ABOUT IMAGE
          -------------------------------------------------- */}

          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-green-50">

            <Image
              src={aboutImage}
              alt="ISACO natural wellness"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />

          </div>

          {/* --------------------------------------------------
              STORY CONTENT
          -------------------------------------------------- */}

          <div>

            {content.story_label && (
              <p className="text-sm font-semibold uppercase tracking-wider text-green-700">
                {content.story_label}
              </p>
            )}

            {content.story_title && (
              <h2 className="mt-2 text-3xl font-bold text-green-950">
                {content.story_title}
              </h2>
            )}

            {content.story_paragraph_1 && (
              <p className="mt-5 leading-7 text-gray-600">
                {content.story_paragraph_1}
              </p>
            )}

            {content.story_paragraph_2 && (
              <p className="mt-4 leading-7 text-gray-600">
                {content.story_paragraph_2}
              </p>
            )}

            {content.story_paragraph_3 && (
              <p className="mt-4 leading-7 text-gray-600">
                {content.story_paragraph_3}
              </p>
            )}

            <Link
              href="/store"
              className="mt-7 inline-flex rounded-full bg-green-800 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-900"
            >
              Explore Our Products
            </Link>

          </div>

        </div>
      </section>

      {/* =====================================================
          MISSION
      ====================================================== */}

      <section className="bg-green-950">
        <div className="mx-auto max-w-4xl px-6 py-14 text-center sm:py-20">

          {content.mission_label && (
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-300">
              {content.mission_label}
            </p>
          )}

          {content.mission_title && (
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              {content.mission_title}
            </h2>
          )}

          {content.mission_description && (
            <p className="mx-auto mt-5 max-w-2xl leading-8 text-green-100">
              {content.mission_description}
            </p>
          )}

          {content.mission_urdu && (
            <p
              dir="rtl"
              className="mt-4 text-xl font-medium text-white"
            >
              {content.mission_urdu}
            </p>
          )}

        </div>
      </section>

      {/* =====================================================
          VALUES
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-6 py-14 sm:py-20">

        <div className="mb-10 text-center">

          {content.values_label && (
            <p className="text-sm font-semibold uppercase tracking-wider text-green-700">
              {content.values_label}
            </p>
          )}

          {content.values_title && (
            <h2 className="mt-2 text-3xl font-bold text-green-950">
              {content.values_title}
            </h2>
          )}

          {content.values_description && (
            <p className="mx-auto mt-3 max-w-2xl text-gray-600">
              {content.values_description}
            </p>
          )}

        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

          {values.map((value, index) => {

            if (
              !value.title &&
              !value.titleUrdu &&
              !value.description
            ) {
              return null;
            }

            return (
              <div
                key={`${value.title || "value"}-${index}`}
                className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-gray-100 transition-transform hover:-translate-y-1 hover:shadow-md"
              >

                {value.titleUrdu && (
                  <p
                    dir="rtl"
                    className="text-sm font-medium text-green-700"
                  >
                    {value.titleUrdu}
                  </p>
                )}

                {value.title && (
                  <h3 className="mt-1 text-xl font-semibold text-green-950">
                    {value.title}
                  </h3>
                )}

                {value.description && (
                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    {value.description}
                  </p>
                )}

              </div>
            );
          })}

        </div>
      </section>

      {/* =====================================================
          CTA
      ====================================================== */}

      <section className="border-t border-gray-100 bg-green-50">
        <div className="mx-auto max-w-4xl px-6 py-14 text-center sm:py-16">

          {content.cta_title && (
            <h2 className="text-2xl font-bold text-green-950 sm:text-3xl">
              {content.cta_title}
            </h2>
          )}

          {content.cta_description && (
            <p className="mx-auto mt-3 max-w-xl leading-7 text-gray-600">
              {content.cta_description}
            </p>
          )}

          <div className="mt-7">
            <Link
              href="/store"
              className="inline-flex rounded-full bg-green-800 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-900"
            >
              Shop Products
            </Link>
          </div>

        </div>
      </section>

    </main>
  );
}