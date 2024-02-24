import { Database } from '../../sql';

import { Subscriptions } from '../../../interface/subscriptions'

export async function setUserSubscriptions(db: Database,userId: number, newChannels: Array<number>): Promise<Subscriptions | null> {
  const sqlQuery = `UPDATE users_subscription SET channels = ? WHERE user_id = ?;`
  return db.executeQuery<Subscriptions>(sqlQuery, [newChannels, userId]);
}
