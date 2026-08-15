import { NextResponse } from "next/server";
import pool from "@/lib/db";

/* ============================================================
   GET SITE SETTINGS
============================================================ */

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT
        id,
        logo_url,
        logo_text,
        logo_text_urdu,
        tagline,
        tagline_urdu,
        whatsapp_number,
        contact_number,
        email,
        address,
        business_hours,
        facebook_url,
        instagram_url,
        youtube_url,
        tiktok_url,
        updated_at
      FROM site_settings
      WHERE id = 1
      LIMIT 1
    `);

    if (result.rows.length === 0) {
      return NextResponse.json(
        {
          error: "Site settings were not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error(
      "Get site settings error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to load site settings.",
      },
      {
        status: 500,
      }
    );
  }
}

/* ============================================================
   UPDATE SITE SETTINGS
============================================================ */

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const {
      logo_text_urdu,
      tagline_urdu,
      whatsapp_number,
      contact_number,
      email,
      address,
      business_hours,
      facebook_url,
      instagram_url,
      youtube_url,
      tiktok_url,
    } = body;

    /* ========================================================
       IMPORTANT

       The logo is intentionally NOT updated here.

       logo_url and logo_text remain unchanged in the database.

       Admin can only change:
       - logo_text_urdu
       - tagline_urdu
       - contact information
       - social media information
    ======================================================== */

    const result = await pool.query(
      `
        UPDATE site_settings
        SET
          logo_text_urdu = $1,
          tagline_urdu = $2,
          whatsapp_number = $3,
          contact_number = $4,
          email = $5,
          address = $6,
          business_hours = $7,
          facebook_url = $8,
          instagram_url = $9,
          youtube_url = $10,
          tiktok_url = $11,
          updated_at = NOW()

        WHERE id = 1

        RETURNING
          id,
          logo_url,
          logo_text,
          logo_text_urdu,
          tagline,
          tagline_urdu,
          whatsapp_number,
          contact_number,
          email,
          address,
          business_hours,
          facebook_url,
          instagram_url,
          youtube_url,
          tiktok_url,
          updated_at
      `,
      [
        logo_text_urdu?.trim() || null,
        tagline_urdu?.trim() || null,
        whatsapp_number?.trim() || null,
        contact_number?.trim() || null,
        email?.trim() || null,
        address?.trim() || null,
        business_hours?.trim() || null,
        facebook_url?.trim() || null,
        instagram_url?.trim() || null,
        youtube_url?.trim() || null,
        tiktok_url?.trim() || null,
      ]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        {
          error:
            "Site settings could not be updated.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      settings: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Update site settings error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to update site settings.",
      },
      {
        status: 500,
      }
    );
  }
}