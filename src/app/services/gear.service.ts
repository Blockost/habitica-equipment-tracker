import { Injectable } from "@angular/core";
import { HabiticaService } from "./habitica.service";
import { ContextService } from "./context.service";

@Injectable({ providedIn: "root" })
export class GearService {
  constructor(
    private readonly context: ContextService,
    private readonly habiticaService: HabiticaService,
  ) {}

  async getOwnedArmoire(): Promise<string[]> {
    const userId = this.context.userId;
    const token = this.context.apiToken;
    const userInfo = await this.habiticaService.getUserInfo(userId, token);

    const ownedGears = userInfo.items.gear.owned;
    console.log("All owned", ownedGears);

    const ownedArmoire = Object.keys(ownedGears).filter(
      (item) => ownedGears[item] && item.includes("_armoire_"),
    );
    console.log("Armoire owned", ownedArmoire);
    return ownedArmoire;
  }
}
