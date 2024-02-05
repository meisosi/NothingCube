import { User } from 'src/interface/user';
import { Database } from '../database/sql';

export class BotUtils {
    private database: Database = new Database();

    async getUser(userId: number) {
        return await this.database.getUser(userId);
    }
    async deleteUser(userId: number) {
        return await this.database.deleteUser(userId);
    }
    async createUser(userId: number, username: string, premium_days: number, status: number, guild: number, ban: boolean) {
        const user : User = {
            user_id: userId || null,
            name: username || null,
            premium: premium_days || 0,
            status_id: status || -1,
            guild_id: guild || -1,
            isBan: ban || false
        }
        return await this.database.createUser(user);
    }

    async getPromocode(code: string) {
        return await this.database.getPromocode(code);
    }

    refreshUserSubscriptionChannals(userId: number) {

    }
}