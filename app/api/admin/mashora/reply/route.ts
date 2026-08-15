import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const consultationId = Number(body.consultationId);
    const advice = String(body.advice || "").trim();

    // ---------------------------------------------------------
    // VALIDATION
    // ---------------------------------------------------------

    if (!Number.isInteger(consultationId) || consultationId <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid consultation ID.",
        },
        { status: 400 }
      );
    }

    if (!advice) {
      return NextResponse.json(
        {
          success: false,
          message: "Please write the advice before saving.",
        },
        { status: 400 }
      );
    }

    // ---------------------------------------------------------
    // FIND CONSULTATION
    // ---------------------------------------------------------

    const consultationResult = await pool.query(
      `
        SELECT
          id,
          name,
          email,
          advice,
          status
        FROM mashora_consultations
        WHERE id = $1
        LIMIT 1
      `,
      [consultationId]
    );

    if (consultationResult.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Consultation not found.",
        },
        { status: 404 }
      );
    }

    const consultation = consultationResult.rows[0];

    // ---------------------------------------------------------
    // SAVE ADVICE
    // ---------------------------------------------------------

    const updateResult = await pool.query(
      `
        UPDATE mashora_consultations
        SET
          advice = $1,
          status = 'answered'
        WHERE id = $2
        RETURNING
          id,
          name,
          email,
          advice,
          status
      `,
      [advice, consultationId]
    );

    const updatedConsultation = updateResult.rows[0];

    // ---------------------------------------------------------
    // EMAIL STATUS
    // ---------------------------------------------------------

    const hasEmail =
      typeof consultation.email === "string" &&
      consultation.email.trim().length > 0;

    // ---------------------------------------------------------
    // OLD CONSULTATION WITHOUT EMAIL
    // ---------------------------------------------------------

    if (!hasEmail) {
      console.log(
        `Mashora #${consultationId}: advice saved, but no email address is available.`
      );

      return NextResponse.json(
        {
          success: true,
          emailSent: false,
          message:
            "Advice has been saved successfully. No email address was available for this consultation.",
          consultation: updatedConsultation,
        },
        { status: 200 }
      );
    }

    // ---------------------------------------------------------
    // CONSULTATION HAS EMAIL
    //
    // Actual email sending will be connected next.
    // ---------------------------------------------------------

    console.log(
      `Mashora #${consultationId}: advice saved for ${consultation.email}`
    );

    return NextResponse.json(
      {
        success: true,
        emailSent: false,
        message:
          "Advice has been saved successfully. Email sending will be connected next.",
        consultation: updatedConsultation,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Mashora reply API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to save the advice.",
      },
      { status: 500 }
    );
  }
}