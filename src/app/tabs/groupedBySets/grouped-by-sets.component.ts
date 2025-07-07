import { Component, OnInit } from "@angular/core";
import { GearService } from "../../services/gear.service";
import { HabiticaService } from "../../services/habitica.service";
import { HabiticaGear } from "../../models/habitica.model";
import { CardModule } from "primeng/card";
import { ButtonModule } from "primeng/button";
import { NgForOf, NgIf } from "@angular/common";
import { DividerModule } from "primeng/divider";
import { HabiticaGearVM, mapToVM } from "../../models/vm.model";
import { TooltipModule } from "primeng/tooltip";
import { TagModule } from "primeng/tag";
import { round } from "../../util/util";

interface GearSetVM {
  nbOfItemsInSet: number;
  nbItemsOwned: number;
  progression: number;
  items: { gear: HabiticaGearVM }[];
}

@Component({
  selector: "app-grouped-by-sets-tab",
  standalone: true,
  templateUrl: "./grouped-by-sets.component.html",
  styleUrls: ["./grouped-by-sets.component.scss"],
  imports: [CardModule, ButtonModule, NgForOf, DividerModule, NgIf, TooltipModule, TagModule],
})
export class GroupedBySetsTabComponent implements OnInit {
  owned!: string[];
  readonly gearSets: { key: string; value: GearSetVM }[] = [];

  constructor(private readonly gearService: GearService) {}

  ngOnInit(): void {
    this.fetchHabiticaContent();
  }

  private async fetchHabiticaContent() {
    this.owned = await this.gearService.getOwnedArmoire();

    const gears = await this.gearService.getAllGears();
    Object.values(gears)
      .filter((item) => item.klass === "armoire")
      .forEach((item) => this.updateSet(item));

    this.gearSets.sort((setA, setB) => {
      const order = setB.value.progression - setA.value.progression;
      if (order === 0) {
        return setA.key.localeCompare(setB.key);
      }

      return order;
    });
  }

  private updateSet(gear: HabiticaGear) {
    const gearVM = mapToVM(gear);
    if (gearVM.set === "-") {
      // Do not show unique items that are not part of a set
      // This might change in the future!
      return;
    }

    if (gearVM.set === "Cleaning Supplies Set Two") {
      // There is a discrepancy in the data we receive from Habitica. These two sets are the same.
      // In the app, only "Set 2" is shown. Remove this when Habitica has fixed the set name on their side
      gearVM.set = "Cleaning Supplies Set 2";
    }

    gearVM.owned = this.isGearOwned(gear);
    const set = this.gearSets.find((set) => set.key === gearVM.set);

    if (!!set) {
      set.value.nbOfItemsInSet += 1;
      set.value.nbItemsOwned += gearVM.owned ? 1 : 0;
      set.value.progression = this.getProgression(set);
      set.value.items.push({ gear: gearVM });
    } else {
      const set: { key: string; value: GearSetVM } = {
        key: gearVM.set,
        value: {
          nbOfItemsInSet: 1,
          nbItemsOwned: gearVM.owned ? 1 : 0,
          progression: gearVM.owned ? 100 : 0,
          items: [{ gear: gearVM }],
        },
      };
      this.gearSets.push(set);
    }
  }

  private isGearOwned(gear: HabiticaGear): boolean {
    return this.owned.includes(gear.key);
  }

  private getProgression(set: { key: string; value: GearSetVM }) {
    return round(set.value.nbItemsOwned / set.value.nbOfItemsInSet) * 100;
  }
}
