import { Database } from "../sql";
import { User } from "../../interfaces/user";

export async function getUser(
  db: Database,
  userId: number
): Promise<User | null> {
  const sqlQuery = "SELECT * FROM users WHERE id = ?";
  return db.executeQuery<User>(sqlQuery, [userId]);
}
