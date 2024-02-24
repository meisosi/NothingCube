import { Database } from '../../sql';

import { Referals } from 'src/interface/referals';

export async function addReferal(db: Database,userId: number, referalId: number): Promise<Referals | null> {
  const sqlQuery = "UPDATE referals"+
  "SET referals = CASE" + 
                      "WHEN referals IS NULL OR JSON_TYPE(referals) <> 'ARRAY' " +
                      `THEN JSON_ARRAY(${referalId})` +
                      `ELSE JSON_ARRAY_APPEND(referals, '$', ${referalId})` +
                "END" +
  `WHERE user_id = ${userId};`;
  return db.executeQuery<Referals>(sqlQuery);
}
