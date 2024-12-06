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

const NO_SET_KEY = "NO_SET";

interface GearSetVM {
  nbOfItemsInSet: number;
  nbItemsOwned: number;
  items: { gear: HabiticaGearVM; owned: boolean }[];
}

@Component({
  selector: "app-grouped-by-sets-tab",
  standalone: true,
  templateUrl: "./grouped-by-sets.component.html",
  styleUrls: ["./grouped-by-sets.component.scss"],
  imports: [CardModule, ButtonModule, NgForOf, DividerModule, NgIf, TooltipModule],
})
export class GroupedBySetsTabComponent implements OnInit {
  owned!: string[];
  readonly gearsBySet: { key: string; value: GearSetVM }[] = [];

  constructor(
    private readonly gearService: GearService,
    // TODO 2024-11-18 Blockost HabiticaService should never be called from a component ! Change that !
    private readonly habiticaService: HabiticaService,
  ) {}

  ngOnInit(): void {
    this.fetchHabiticaContent();
  }

  private async fetchHabiticaContent() {
    const content = await this.habiticaService.getAllContent();
    console.log(content);

    this.owned = await this.gearService.getOwnedArmoire();

    const gears = content.gear.flat;
    Object.values(gears)
      .filter((item) => item.klass === "armoire")
      .forEach((item) => this.addToMap(item));

    console.log("gearsBySet:", this.gearsBySet);
  }

  private addToMap(gear: HabiticaGear) {
    if (gear === undefined) {
      return;
    }

    if (gear.set === undefined || gear.set?.trim()?.length < 1) {
      this.updateSet(NO_SET_KEY, gear);
      return;
    }

    this.updateSet(gear.set, gear);
  }

  private updateSet(name: string, gear: HabiticaGear) {
    const gearVM = mapToVM(gear);
    if (gearVM.set === "-") {
      // Do not show unique items that are not part of a set
      // This might change in the future!
      return;
    }

    gearVM.owned = this.isGearOwned(gear);
    const set = this.gearsBySet.find((set) => set.key === gearVM.set);

    if (!!set) {
      const owned = this.isGearOwned(gear);
      set.value.nbOfItemsInSet += 1;
      set.value.nbItemsOwned += owned ? 1 : 0;
      set.value.items.push({ gear: gearVM, owned });
    } else {
      const set: { key: string; value: GearSetVM } = {
        key: gearVM.set,
        value: {
          nbOfItemsInSet: 1,
          nbItemsOwned: 0,
          items: [{ gear: gearVM, owned: false }],
        },
      };
      this.gearsBySet.push(set);
    }
  }

  private isGearOwned(gear: HabiticaGear): boolean {
    return false;
  }
}
