import { Database } from "../../sql";

export async function getPromocodeUsage(db: Database, userId: number, promoCode: string): Promise<number | null> {
  const sqlQuery = "SELECT COUNT(*) AS usage_count FROM usage_promocodes WHERE user_id = ? AND code = ?";
  return await db.executeQuery<number | null>(sqlQuery, [userId, promoCode]);
}
