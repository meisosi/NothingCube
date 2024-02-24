import { Database } from '../../sql';

import { Referals } from 'src/interface/referals';

export async function getReferal(db: Database,userId: number): Promise<Referals | null> {
  const sqlQuery = "SELECT referals FROM referals WHERE user_id = ?;";
  return db.executeQuery<Referals>(sqlQuery, [userId]);
}
