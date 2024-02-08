import { Database } from '../../sql';

import { Channel } from 'src/interface/channel';

export async function getRequiredChannels(db: Database): Promise<Array<Channel> | null> {
  const sqlQuery = "SELECT * FROM required_channels";
  return db.executeQuery<Array<Channel>>(sqlQuery);
}
