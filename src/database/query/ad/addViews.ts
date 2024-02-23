import { Database } from '../../sql';

import { Ad } from '../../../interface/ad'

export async function addAdViews(db: Database, adcode: string): Promise<Ad | null> {
    const sqlQuery = `UPDATE ad SET views = views + 1 WHERE ad_code = ?;`;
    return db.executeQuery<Ad>(sqlQuery, [adcode]);
  }
  
