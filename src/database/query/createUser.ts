import { Database } from "../sql";
import { User } from "../../interfaces/user";

export async function createUser(
  db: Database,
  user: User
): Promise<User | null> {
  const sqlQuery = "INSERT INTO users (id, username, premium) VALUES (?, ?, ?)";
  return db.executeQuery<User>(sqlQuery, [
    user.id,
    user.username,
    user.premium,
  ]);
}
