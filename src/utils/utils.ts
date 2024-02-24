import { User } from '../../src/interface/user';
import { Database } from '../database/sql';
import { Promocode, PromocodeType } from '../../src/interface/promocode';
import { Inventory } from '../../src/interface/inventory';

import { StatusType } from '../../src/interface/stats';
import { AccessLevel } from '../../src/interface/security';
import { WithdrawUser } from '../interface/withdraw';
import { expressPromocode } from 'src/interface/expressPromo';

import { NotNull } from './decorators';


export class BotUtils {
    private database: Database = new Database();

    async initUser(@NotNull userId: number, @NotNull username: string) {
        let userDB = await this.getUser(userId);
        let userInventory = await this.getUserInventory(userId);
        let userStat = await this.getUserStats(userId);
        if(!userDB) {
          await this.createUser(userId, username, 0, -1, -1);
          userDB = await this.getUser(userId);
        }
        if(!userInventory) {
          await this.createUserInventory(userId);
          userInventory = await this.getUserInventory(userId);
        }
        if(!userStat) {
          await this.createUserStats(userId);
          userStat = await this.getUserStats(userId);
        }
      }

    async getUser(userId: number) {
        return await this.database.getUser(userId);
    }
    async deleteUser(userId: number) {
        return await this.database.deleteUser(userId);
    }
    async createUser(userId: number, username: string, premium_days: number, title: number, guild: number) {
        const user : User = {
            user_id: userId || null,
            name: username || null,
            premium: premium_days || 0,
            title_id: title || -1,
            guild_id: guild || -1
        }
        return await this.database.createUser(user);
    }

    async getUserStats(userId: number) {
        return await this.database.getUserStats(userId);
    }
    async createUserStats(userId: number) {
        return await this.database.createUserStats(userId);
    }
    async getUserStatus(userId: number) {
        return (await this.database.getUserStats(userId)).status;
    }

    async getPromocode(code: string): Promise<Promocode | null> {
        return await this.database.getPromocode(code);
    }
    async createPromocode(code: string, type: PromocodeType, activations: number, count: number, expires_at: string | null) {
        const promocode : Promocode = {
            code: code ?? null,
            type: type ?? PromocodeType.coins,
            activations: isNaN(activations) ? 0 : activations,
            count: isNaN(count) ? 0 : count,
            expires_at: parseDate(expires_at) ? new Date(9999, 11) : parseDate(expires_at)
        }
        return await this.database.createPromocode(promocode);
    }
    async getPromocodeUsage(userId: number, code: string): Promise<boolean> {
        const promoUsage = await this.database.getPromocodeUsage(userId, code);
        return ((promoUsage[Object.keys(promoUsage)[0]] !== null) && (promoUsage[Object.keys(promoUsage)[0]] > 0));
    }
    async deletePromo(code: string) {
        return await this.database.deletePromo(code);
    }
    async usagePromocode(userId: number, code: string) {
        return await this.database.usagePromocode(userId, code);
    }
    async foundInactivePromo(code: string): Promise<expressPromocode | null> {
        return (await this.database.foundInactivePromo(code));
    }
    async deductPromocode(promocode: Promocode) {
        return await this.database.deductPromocode(promocode);
    }
    async createInactivePromo(promocode: Promocode) {
        return await this.database.createInactivePromo(promocode);
    }
    async setInactivePromo(promocode: Promocode) {
        await this.deletePromo(promocode.code);
        return await this.createInactivePromo(promocode);
    }

    async getUserInventory(userId: number,  type?: keyof Omit<Inventory, 'user_id'> ) {
        if(type)
            return (await this.database.getUserInventory(userId, type));
        return await this.database.getUserInventory(userId);
    }
    async getUserRolls(userId: number) {
        return (await this.database.getUserInventory(userId)).rolls;
    }
    async getUserCoins(userId: number) {
        return (await this.database.getUserInventory(userId)).coins;
    }
    async updateUserInventory(userId: number, type: keyof Omit<Inventory, 'user_id'>, value: number) {
        return (await this.database.updateUserInventory(userId, type, value));
    }
    async updateUserRolls(userId: number, value: number) {
        return (await this.database.updateUserInventory(userId, 'rolls', value));
    }
    async updateUserCoins(userId: number, value: number) {
        return (await this.database.updateUserInventory(userId, 'coins', value));
    }
    async createUserInventory(userId: number) {
        return await this.database.createUserInventory(userId);
    }

    async addAdViews(adcode: string) {
        return await this.database.addAdViews(adcode);
    }

    async refreshUserSubscriptionChannels(userId: number) {
        const currentSubscriptions = await this.database.getUserSubscriptions(userId);

        if (currentSubscriptions === null) {
            throw new Error('Failed to fetch user subscriptions.');
        }

        const reqChannelsIds = await this.database.getRequiredChannels()
            .then(channels => channels.map(channel => channel.id));

        const newChannels = await updateSubscriptions(userId, currentSubscriptions.сhannals, reqChannelsIds);

        if (newChannels.length > 0) {
            await this.database.setUserSubscriptions(userId, newChannels);
            return newChannels.length;
        } else {
            return 0;
        }
    }


    async tryPutQueue(user: WithdrawUser) {
        return this.database.tryPutQueue(user);
    }
    async deleteWithdrawPromocode(code: string) {
        return this.database.deleteWithdrawPromocode(code);
    }
    async linkWithdrawPromocode(user: WithdrawUser) {
        return this.database.linkWithdrawPromocode(user);
    }
    async getWithdrawUsers() {
        return this.database.getWithdrawUsers();
    }
    public async hasWithdrawUsers() {
        return this.database.hasWithdrawUsers();
    }
    public async hasWithdrawPromocodes() {
        return this.database.hasWithdrawPromocodes();
    }
    public async createUserRef(userId: number) {
        return this.database.createUserRef(userId);
    }
    public async addReferal(userId: number, referalId: number) {
        return this.database.addReferal(userId, referalId);
    }
    public async removeReferal(userId: number, referalId: number) {
        return this.database.removeReferal(userId, referalId);
    }
    public async getReferal(userId: number) {
        return this.database.getReferal(userId);
    }
    public async linkReferal(userId: number, referalId: number) {
        return this.database.linkReferal(userId, referalId)
    }

    checkAccess(role: string, level: number) {
        return this.getAccessLevel(role) >= level;
    }

    getAccessLevel(status: string) {
        let userAccessLevel = -1;
        switch (status) {
            case StatusType.admin:
                userAccessLevel = AccessLevel.admin;
                break;
            case StatusType.support:
                userAccessLevel = AccessLevel.support;
                break;
            case StatusType.user:
                userAccessLevel = AccessLevel.user;
                break;
            default:
                userAccessLevel = AccessLevel.null;
        }
        return userAccessLevel;
    }
}

async function updateSubscriptions(userId: number, currentChannels: number[], reqChannels: number[]): Promise<number[]> {
    const newChannels: number[] = [];

    for (const channelId of reqChannels) {
        if (!currentChannels.includes(channelId) && await checkSubscribe(userId, channelId)) {
            newChannels.push(channelId);
        }
    }

    return newChannels;
}

async function checkSubscribe(userId: number, channelId: number): Promise<boolean> {
    const chatMember = await this.telegraf.getChatMember(channelId, userId);
    return ['member', 'administrator', 'creator'].includes(chatMember.status);
}


function parseDate(input: string): Date|null {
    if(!input) return null
    const currentDate = new Date();
    const parts = input.split('-');

    const dateParts = parts[0].split('.');
    let month = parseInt(dateParts[0], 10);
    let day = parseInt(dateParts[1], 10);
    let year = currentDate.getFullYear();

    if (dateParts.length === 3) {
        year = parseInt(dateParts[2], 10);
    }

    let hours = currentDate.getHours() + 1;
    let minutes = 30;

    if (parts.length === 2) {
        const timeParts = parts[1].split('.');
        if (timeParts.length >= 1) {
            hours = parseInt(timeParts[0], 10);
        }
        if (timeParts.length === 2) {
            minutes = parseInt(timeParts[1], 10);
        }
    }
    return new Date(year, month - 1, day, hours, minutes);
}