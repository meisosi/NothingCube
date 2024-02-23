import { Context } from "telegraf";
import { EventHandler } from "../events/eventHandler";
import { Listener } from "../events/listener";
import { StartModule } from "./startModule";
import { StartEvent } from "./startEvent";
import { NotNull } from "../utils/decorators";
import { PromocodeUse } from "../../src/promocode/promocodeEvent";
import { NewReferalEvent } from "../../src/referal/referalEvent";

export class StartListener extends Listener {
  constructor(private readonly module: StartModule) {
    super();
  }

  @EventHandler.Handler.handle(StartEvent)
  private async onStart(@NotNull context: Context, argument: any) {
    const userId: number = context.from.id; 
    const username: string = context.from.first_name;
    let userDB = await this.module.getUser(userId);
    let userInventory = await this.module.getInventory(userId);
    let userStat = await this.module.getStats(userId);
    if(!userDB) {
      await this.module.createUser(userId, username);
      userDB = await this.module.getUser(userId);
    }
    if(!userInventory) {
      await this.module.createInventory(userId);
      userInventory = await this.module.getInventory(userId);
    }
    if(!userStat) {
      await this.module.createStats(userId);
      userStat = await this.module.getStats(userId);
    }

    if(argument) {
      const action = argument.split('_')[0];
      if(action == 'promo') {
        const code: string = argument.slice(argument.indexOf('_') + 1);
        PromocodeUse.execute(context, code);
      }
      else if(action == 'ref') {
        const referal: string = argument.slice(argument.indexOf('_') + 1);
        NewReferalEvent.execute(context, referal);
      }
    }
    if(this.module.getAccessLevel(userStat.status) == 0) {
      context.reply(this.module.getMessage("startUser", userDB.name, userDB.premium? userDB.premium:"нет"))
    }
    else if(this.module.getAccessLevel(userStat.status) >= 1) {
      context.reply(this.module.getMessage("startUser", userDB.name, userDB.premium? userDB.premium:"нет"))
    }
  }
}
