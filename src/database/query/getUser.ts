import { Database } from '../sql';

interface User {
  id: number;
  username: string;
  premium: number;
}

export async function getUser(db: Database, userId: number): Promise<User | null> {
  const sqlQuery = 'SELECT * FROM users WHERE id = ?';
  return db.executeQuery<User>(sqlQuery, [userId]);
}
