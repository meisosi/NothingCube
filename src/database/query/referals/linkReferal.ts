import { Database } from '../../sql';

import { Stats } from '../../../interface/stats'

export async function linkReferal(db: Database,userId: number, referalId: number): Promise<Stats | null> {
  const sqlQuery = "UPDATE users_stats SET referalId = ? WHERE user_id = ?";
  return db.executeQuery<Stats>(sqlQuery, [referalId, userId]);
}
