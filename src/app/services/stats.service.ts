import { Injectable } from "@angular/core";
import { GearService } from "./gear.service";
import { HabiticaService } from "./habitica.service";

export interface StatsModel {
  nbItemsOwned: number;
  nbItemsTotal: number;
}

@Injectable({
  providedIn: "root",
})
export class StatsService {
  constructor(private readonly gearService: GearService) {}

  async getStats(): Promise<StatsModel> {
    const ownedArmoire = await this.gearService.getOwnedArmoire();
    const gears = await this.gearService.getAllGears();
    const allArmoire = Object.values(gears).filter((item) => item.klass === "armoire");

    return {
      nbItemsOwned: (ownedArmoire ?? []).length,
      nbItemsTotal: (allArmoire ?? []).length,
    };
  }
}
