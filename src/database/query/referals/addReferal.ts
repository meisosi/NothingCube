import { Database } from '../../sql';

import { Referals } from 'src/interface/referals';

export async function addReferal(db: Database,userId: number, referalId: number): Promise<Referals | null> {
  const sqlQuery = 
`
UPDATE referals
SET referals = CASE
    WHEN referals IS NULL OR JSON_TYPE(referals) <> 'ARRAY'
    THEN JSON_ARRAY('${userId}')
    ELSE JSON_ARRAY_APPEND(referals, '$', '${userId}')
    END
WHERE user_id = '${referalId}';
`;
  return db.executeQuery<Referals>(sqlQuery);
}
