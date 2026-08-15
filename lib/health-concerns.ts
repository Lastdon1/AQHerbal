import pool from "@/lib/db";

export type HealthConcern = {
  id: number;
  name: string;
  name_urdu: string | null;
  slug: string;
  description: string | null;
  image: string | null;
};

export async function getHealthConcerns(): Promise<
  HealthConcern[]
> {
  const result = await pool.query<HealthConcern>(`
    SELECT
      id,
      name,
      name_urdu,
      slug,
      description,
      image
    FROM health_concerns
    WHERE is_active = true
    ORDER BY sort_order ASC, id DESC
  `);

  return result.rows;
}