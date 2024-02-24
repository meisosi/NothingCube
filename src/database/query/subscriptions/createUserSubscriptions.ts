import { Database } from '../../sql';

import { Subscriptions } from '../../../interface/subscriptions'

export async function createUserSubscriptions(db: Database,userId: number): Promise<Subscriptions | null> {
  const sqlQuery = "INSERT INTO users_subscription (user_id, channels) VALUES (?, NULL);";
  return db.executeQuery<Subscriptions>(sqlQuery, [userId]);
}
