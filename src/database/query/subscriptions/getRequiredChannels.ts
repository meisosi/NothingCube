import { Database } from '../../sql';

import { Channal } from 'src/interface/channal';

export async function getRequiredChannels(db: Database): Promise<Array<Channal> | null> {
  const sqlQuery = "SELECT * FROM required_channels";
  return db.executeQuery<Array<Channal>>(sqlQuery);
}
