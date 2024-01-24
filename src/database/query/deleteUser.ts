import { Database } from "../sql";
import { User } from "../../interfaces/user";

export async function deleteUser(
  db: Database,
  userId: number
): Promise<User | null> {
  const sqlQuery = "DELETE FROM users WHERE id = ?";
  return await db.executeQuery<User>(sqlQuery, [userId]);
}
