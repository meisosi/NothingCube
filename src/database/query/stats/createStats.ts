import { Database } from '../../sql';

import { Stats, StatusType } from '../../../interface/stats'

export async function createStats(db: Database,userId: number, referal: number|null = null): Promise<Stats | null> {
  const sqlQuery = "INSERT INTO users_stats" + 
  "(user_id, status, cases, rolls, earend, win, gems_earn, moons_earn, created_at, referalId)" +
  "VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)";

  return db.executeQuery<Stats>(sqlQuery, [userId, StatusType.user, 0, 0, 0, 0, 0, 0, referal]);
}