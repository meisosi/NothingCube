import { Database } from '../../sql';

import { Referals } from 'src/interface/referals';

export async function removeReferal(db: Database,userId: number, referalId: number): Promise<Referals | null> {
  const sqlQuery = "UPDATE referals SET referals = JSON_REMOVE(referals, JSON_SEARCH(referals, 'one', ?)) WHERE user_id = ?;";
  return db.executeQuery<Referals>(sqlQuery, [referalId, userId]);
}
