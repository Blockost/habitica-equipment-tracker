import { Injectable } from "@angular/core";
import { HabiticaService } from "./habitica.service";
import { ContextService } from "./context.service";
import { EquipmentSetInfo, HabiticaUserItemsInfo } from "../models/habitica.model";

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

  async getEquippedItems(): Promise<EquipmentSetInfo> {
    const userId = this.context.userId;
    const token = this.context.apiToken;
    const userInfo = await this.habiticaService.getUserInfo(userId, token);

    const equipped = userInfo.items.gear.equipped;
    console.log("Equipped items", equipped);

    return equipped;
  }

  async getCostumeItems(): Promise<EquipmentSetInfo> {
    const userId = this.context.userId;
    const token = this.context.apiToken;
    const userInfo = await this.habiticaService.getUserInfo(userId, token);

    const costume = userInfo.items.gear.costume;
    console.log("Costume items", costume);

    return costume;
  }

  async equipBattleGear(gearKey: string): Promise<HabiticaUserItemsInfo> {
    const userId = this.context.userId;
    const token = this.context.apiToken;

    return await this.habiticaService.equipItem(userId, token, "equipped", gearKey);
  }

  async equipCostume(gearKey: string): Promise<HabiticaUserItemsInfo> {
    const userId = this.context.userId;
    const token = this.context.apiToken;

    return await this.habiticaService.equipItem(userId, token, "costume", gearKey);
  }
}
