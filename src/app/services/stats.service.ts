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
  constructor(
    private readonly gearService: GearService,
    // TODO 2024-11-18 Blockost HabiticaService should never be called directly from a feature service !
    private readonly habiticaService: HabiticaService,
  ) {}

  async getStats(): Promise<StatsModel> {
    const ownedArmoire = await this.gearService.getOwnedArmoire();
    const progression = ownedArmoire?.length;
    const allContent = await this.habiticaService.getAllContent();
    const allArmoire = Object.values(allContent.gear.flat).filter(
      (item) => item.klass === "armoire",
    );

    return {
      nbItemsOwned: (ownedArmoire ?? []).length,
      nbItemsTotal: (allArmoire ?? []).length,
    };
  }
}
