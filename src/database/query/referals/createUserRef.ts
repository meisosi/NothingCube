import { Database } from '../../sql';

import { Referals } from 'src/interface/referals';

export async function createReferal(db: Database,userId: number): Promise<Referals | null> {
  const sqlQuery = "INSERT INTO referals (user_id, referals) VALUES (?, NULL);";
  return db.executeQuery<Referals>(sqlQuery, [userId]);
}
