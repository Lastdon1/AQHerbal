import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

/* =========================================
   GET REVIEWS
   Returns approved reviews + rating summary
========================================= */

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    /* Find product */

    const productResult = await pool.query(
      `
      SELECT id, name, name_urdu
      FROM products
      WHERE slug = $1
        AND is_active = true
      LIMIT 1
      `,
      [slug]
    );

    if (productResult.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found.",
        },
        { status: 404 }
      );
    }

    const product = productResult.rows[0];

    /* Get approved reviews */

    const reviewsResult = await pool.query(
      `
      SELECT
        id,
        customer_name,
        review_title,
        review_text,
        rating,
        created_at
      FROM product_reviews
      WHERE product_id = $1
        AND is_approved = true
      ORDER BY created_at DESC
      `,
      [product.id]
    );

    /* Rating summary */

    const summaryResult = await pool.query(
      `
      SELECT
        COUNT(*)::integer AS total_reviews,
        COALESCE(ROUND(AVG(rating)::numeric, 1), 0)::numeric AS average_rating,

        COUNT(*) FILTER (
          WHERE rating = 5
        )::integer AS five_star,

        COUNT(*) FILTER (
          WHERE rating = 4
        )::integer AS four_star,

        COUNT(*) FILTER (
          WHERE rating = 3
        )::integer AS three_star,

        COUNT(*) FILTER (
          WHERE rating = 2
        )::integer AS two_star,

        COUNT(*) FILTER (
          WHERE rating = 1
        )::integer AS one_star

      FROM product_reviews
      WHERE product_id = $1
        AND is_approved = true
      `,
      [product.id]
    );

    const summary = summaryResult.rows[0];

    return NextResponse.json({
      success: true,

      product: {
        id: product.id,
        name: product.name,
        name_urdu: product.name_urdu,
      },

      summary: {
        total_reviews: Number(summary.total_reviews || 0),
        average_rating: Number(summary.average_rating || 0),
        five_star: Number(summary.five_star || 0),
        four_star: Number(summary.four_star || 0),
        three_star: Number(summary.three_star || 0),
        two_star: Number(summary.two_star || 0),
        one_star: Number(summary.one_star || 0),
      },

      reviews: reviewsResult.rows.map((review) => ({
        id: review.id,
        customer_name: review.customer_name,
        review_title: review.review_title,
        review_text: review.review_text,
        rating: Number(review.rating),
        created_at: review.created_at,
      })),
    });
  } catch (error) {
    console.error("GET REVIEWS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load reviews.",
      },
      { status: 500 }
    );
  }
}

/* =========================================
   POST REVIEW
   New reviews require admin approval
========================================= */

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const body = await request.json();

    const customerName =
      typeof body.customer_name === "string"
        ? body.customer_name.trim()
        : "";

    const reviewTitle =
      typeof body.review_title === "string"
        ? body.review_title.trim()
        : "";

    const reviewText =
      typeof body.review_text === "string"
        ? body.review_text.trim()
        : "";

    const rating = Number(body.rating);

    /* =====================================
       VALIDATION
    ===================================== */

    if (!customerName) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter your name.",
        },
        { status: 400 }
      );
    }

    if (customerName.length < 2) {
      return NextResponse.json(
        {
          success: false,
          message: "Name must be at least 2 characters.",
        },
        { status: 400 }
      );
    }

    if (customerName.length > 100) {
      return NextResponse.json(
        {
          success: false,
          message: "Name cannot exceed 100 characters.",
        },
        { status: 400 }
      );
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json(
        {
          success: false,
          message: "Please select a rating from 1 to 5 stars.",
        },
        { status: 400 }
      );
    }

    if (!reviewText) {
      return NextResponse.json(
        {
          success: false,
          message: "Please write your review.",
        },
        { status: 400 }
      );
    }

    if (reviewText.length < 5) {
      return NextResponse.json(
        {
          success: false,
          message: "Review must be at least 5 characters.",
        },
        { status: 400 }
      );
    }

    if (reviewText.length > 3000) {
      return NextResponse.json(
        {
          success: false,
          message: "Review cannot exceed 3000 characters.",
        },
        { status: 400 }
      );
    }

    if (reviewTitle.length > 200) {
      return NextResponse.json(
        {
          success: false,
          message: "Review title cannot exceed 200 characters.",
        },
        { status: 400 }
      );
    }

    /* =====================================
       FIND PRODUCT
    ===================================== */

    const productResult = await pool.query(
      `
      SELECT id
      FROM products
      WHERE slug = $1
        AND is_active = true
      LIMIT 1
      `,
      [slug]
    );

    if (productResult.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found.",
        },
        { status: 404 }
      );
    }

    const productId = productResult.rows[0].id;

    /* =====================================
       INSERT REVIEW

       IMPORTANT:
       is_approved = false
       so admin must approve it first.
    ===================================== */

    const reviewResult = await pool.query(
      `
      INSERT INTO product_reviews (
        product_id,
        customer_name,
        review_title,
        review_text,
        rating,
        is_approved
      )
      VALUES ($1, $2, $3, $4, $5, false)
      RETURNING
        id,
        customer_name,
        review_title,
        review_text,
        rating,
        is_approved,
        created_at
      `,
      [
        productId,
        customerName,
        reviewTitle || null,
        reviewText,
        rating,
      ]
    );

    return NextResponse.json(
      {
        success: true,
        message:
          "Thank you for your review. Your review has been submitted and is awaiting approval.",

        review: {
          id: reviewResult.rows[0].id,
          customer_name:
            reviewResult.rows[0].customer_name,
          review_title:
            reviewResult.rows[0].review_title,
          review_text:
            reviewResult.rows[0].review_text,
          rating: Number(
            reviewResult.rows[0].rating
          ),
          is_approved:
            reviewResult.rows[0].is_approved,
          created_at:
            reviewResult.rows[0].created_at,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST REVIEW ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to submit your review.",
      },
      { status: 500 }
    );
  }
}