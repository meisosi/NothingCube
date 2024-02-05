import { Database } from '../../sql';

import { User } from '../../../interface/user'

export async function getUser(db: Database,userId: number): Promise<User | null> {
  const sqlQuery = "SELECT * FROM users WHERE user_id = ?";
  return db.executeQuery<User>(sqlQuery, [userId]);
}
