import { Database } from '../../sql';

import { Subscriptions } from '../../../interface/subscriptions'

export async function getUserSubscriptions(db: Database,userId: number): Promise<Subscriptions | null> {
  const sqlQuery = "SELECT * FROM users_subscription WHERE user_id = ?";
  return db.executeQuery<Subscriptions>(sqlQuery, [userId]);
}
