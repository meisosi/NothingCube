import { Database } from "../../sql";

export async function usagePromocode(db: Database, userId: number, promoCode: string): Promise<number | null> {
  const sqlQuery = "INSERT INTO usage_promocodes (user_id, code, usage_count) VALUES (?, ?, 1)";
  return await db.executeQuery<number | null>(sqlQuery, [userId, promoCode]);
}
