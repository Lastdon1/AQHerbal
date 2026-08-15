import { NextResponse } from "next/server";
import pool from "@/lib/db";

/* ============================================================
   GET ABOUT PAGE
============================================================ */

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT
        id,

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
        cta_description,

        updated_at

      FROM about_page

      WHERE id = 1

      LIMIT 1
    `);

    if (result.rows.length === 0) {
      return NextResponse.json(
        {
          error: "About page content was not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error(
      "Get about page error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to load About page content.",
      },
      {
        status: 500,
      }
    );
  }
}

/* ============================================================
   UPDATE ABOUT PAGE
============================================================ */

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const {
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
      cta_description,
    } = body;

    const result = await pool.query(
      `
        UPDATE about_page
        SET
          image_url = $1,

          hero_label = $2,
          hero_title = $3,
          hero_description = $4,
          hero_urdu = $5,

          story_label = $6,
          story_title = $7,
          story_paragraph_1 = $8,
          story_paragraph_2 = $9,
          story_paragraph_3 = $10,

          mission_label = $11,
          mission_title = $12,
          mission_description = $13,
          mission_urdu = $14,

          values_label = $15,
          values_title = $16,
          values_description = $17,

          value_1_title = $18,
          value_1_title_urdu = $19,
          value_1_description = $20,

          value_2_title = $21,
          value_2_title_urdu = $22,
          value_2_description = $23,

          value_3_title = $24,
          value_3_title_urdu = $25,
          value_3_description = $26,

          value_4_title = $27,
          value_4_title_urdu = $28,
          value_4_description = $29,

          cta_title = $30,
          cta_description = $31,

          updated_at = NOW()

        WHERE id = 1

        RETURNING
          id,

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
          cta_description,

          updated_at
      `,
      [
        image_url?.trim() || null,

        hero_label?.trim() || null,
        hero_title?.trim() || null,
        hero_description?.trim() || null,
        hero_urdu?.trim() || null,

        story_label?.trim() || null,
        story_title?.trim() || null,
        story_paragraph_1?.trim() || null,
        story_paragraph_2?.trim() || null,
        story_paragraph_3?.trim() || null,

        mission_label?.trim() || null,
        mission_title?.trim() || null,
        mission_description?.trim() || null,
        mission_urdu?.trim() || null,

        values_label?.trim() || null,
        values_title?.trim() || null,
        values_description?.trim() || null,

        value_1_title?.trim() || null,
        value_1_title_urdu?.trim() || null,
        value_1_description?.trim() || null,

        value_2_title?.trim() || null,
        value_2_title_urdu?.trim() || null,
        value_2_description?.trim() || null,

        value_3_title?.trim() || null,
        value_3_title_urdu?.trim() || null,
        value_3_description?.trim() || null,

        value_4_title?.trim() || null,
        value_4_title_urdu?.trim() || null,
        value_4_description?.trim() || null,

        cta_title?.trim() || null,
        cta_description?.trim() || null,
      ]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        {
          error:
            "About page content could not be updated.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      content: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Update about page error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to update About page content.",
      },
      {
        status: 500,
      }
    );
  }
}