import { Context } from "telegraf";
import { EventHandler } from "../events/eventHandler";
import { Listener } from "../events/listener";
import { CaseModule } from "./casesModule";
import { 
  HRCaseEvent, HRPremCaseEvent, 
} from "./casesEvent";
import { NotNull } from "../utils/decorators";
import { Promocode, PromocodeType } from "../interface/promocode";

export class CaseListener extends Listener {
  constructor(private readonly module: CaseModule) {
    super();
  }

  @EventHandler.Handler.handle(HRCaseEvent)
  private async onHRMenu(@NotNull context: Context, argument: any) {
    
  }
  private async onHROpen(@NotNull context: Context, argument: any) {
    
  }

  @EventHandler.Handler.handle(HRPremCaseEvent)
  private async onHRPremMenu(@NotNull context: Context, argument: any) {
    
  }
  private async onHRPremOpen(@NotNull context: Context, argument: any) {
    
  }
}
