import { Database } from '../../sql';

import { Channel } from '../../../interface/channel';

export async function getChannel(db: Database, channelId: number): Promise<Channel | null> {
  const sqlQuery = "SELECT * FROM required_channels WHERE id = ?";
  return db.executeQuery<Channel>(sqlQuery, [channelId]);
}
