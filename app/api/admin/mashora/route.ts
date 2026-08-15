import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      name,
      age,
      gender,
      email,
      phone,
      concern,
      duration,
      bloodPressure,
      diabetes,
      cholesterol,
      medicines,
    } = body;

    if (!name || !age || !gender || !email || !concern) {
      return NextResponse.json(
        {
          success: false,
          message: "Please fill in all required fields.",
        },
        { status: 400 }
      );
    }

    const parsedAge = Number(age);

    if (
      !Number.isInteger(parsedAge) ||
      parsedAge < 1 ||
      parsedAge > 120
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid age.",
        },
        { status: 400 }
      );
    }

    const emailValue = String(email).trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(emailValue)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid email address.",
        },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `
        INSERT INTO mashora_consultations
        (
          name,
          age,
          gender,
          email,
          phone,
          concern,
          duration,
          blood_pressure,
          diabetes,
          cholesterol,
          medicines,
          status
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'pending')
        RETURNING
          id,
          name,
          age,
          gender,
          email,
          phone,
          concern,
          duration,
          blood_pressure,
          diabetes,
          cholesterol,
          medicines,
          status,
          created_at
      `,
      [
        String(name).trim(),
        parsedAge,
        String(gender).trim(),
        emailValue,
        phone ? String(phone).trim() : null,
        String(concern).trim(),
        duration ? String(duration).trim() : null,
        bloodPressure ? String(bloodPressure).trim() : null,
        diabetes ? String(diabetes).trim() : null,
        cholesterol ? String(cholesterol).trim() : null,
        medicines ? String(medicines).trim() : null,
      ]
    );

    const consultation = result.rows[0];

    return NextResponse.json(
      {
        success: true,
        message: "Consultation submitted successfully.",
        consultation: {
          id: consultation.id,
          reference: `ISACO-MASHORA-${consultation.id}`,
          status: consultation.status,
          createdAt: consultation.created_at,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Mashora submission error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to submit consultation.",
      },
      { status: 500 }
    );
  }
}