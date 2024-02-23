import { Database } from '../../sql';

import { Stats } from '../../../interface/stats'

export async function getStats(db: Database,userId: number): Promise<Stats | null> {
  const sqlQuery = "SELECT * FROM users_stats WHERE user_id = ?";
  return db.executeQuery<Stats>(sqlQuery, [userId]);
}
