import { User } from 'src/interface/user';
import { Database } from '../database/sql';
import { Promocode, PromocodeType } from 'src/interface/promocode';
import { Inventory } from 'src/interface/inventory';
import { Channel } from 'src/interface/channel';

import { Bot } from 'bot'
import { StatusType } from 'src/interface/stats';
import { AccessLevel } from 'src/interface/security';

export class BotUtils extends Bot {
    private database: Database = new Database();

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
    async getUserStatus(userId: number) {
        return (await this.database.getUserStats(userId)).status;
    }

    async getPromocode(code: string) {
        return await this.database.getPromocode(code);
    }
    async createPromocode(code: string, type: PromocodeType, activations: number, count: number, expires_at: Date | boolean) {
        const promocode : Promocode = {
            code: code ?? null,
            type: type ?? PromocodeType.coins,
            activations: activations ?? 0,
            count: count ?? 0,
            expires_at: expires_at ?? false
        }
        return await this.database.createPromocode(promocode);
    }
    async getPromocodeUsage(userId: number, code: string): Promise<boolean> {
        const promoUsage = await this.database.getPromocodeUsage(userId, code);
        return promoUsage !== null && promoUsage > 0;
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

    checkAccess(role: string, level: number) {
        return getAccessLevel(role) >= level;
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

function getAccessLevel(status: string) {
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
