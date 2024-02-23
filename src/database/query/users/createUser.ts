import { Database } from '../../sql';

import { User } from '../../../interface/user'

export async function createUser(db: Database, user: User): Promise<User | null> {
    if(!user.user_id || !user.name) {
        throw new Error("User id and name is required for create a new user")
    }
    user.premium = user.premium || 0;
    user.title_id = user.title_id || -1;
    user.guild_id = user.guild_id || -1;
    const sqlQuery = "INSERT INTO users (id, name, premium, title_id, guild_id) VALUES (?, ?, ?, ?, ?)";
    return db.executeQuery(sqlQuery, [
        user.user_id,
        user.name,
        user.premium,
        user.title_id,
        user.guild_id,
    ]);
}
