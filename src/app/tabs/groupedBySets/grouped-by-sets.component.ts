import { Component, OnInit } from "@angular/core";
import { GearService } from "../../services/gear.service";
import { HabiticaGear } from "../../models/habitica.model";
import { CardModule } from "primeng/card";
import { ButtonModule } from "primeng/button";
import { NgForOf, NgIf } from "@angular/common";
import { DividerModule } from "primeng/divider";
import { HabiticaGearVM, mapToVM } from "../../models/vm.model";
import { TooltipModule } from "primeng/tooltip";
import { TagModule } from "primeng/tag";
import { round } from "../../util/util";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { CheckboxModule } from "primeng/checkbox";

const SHOW_COMPLETED_SET = false;

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
  imports: [
    CardModule,
    ButtonModule,
    NgForOf,
    DividerModule,
    NgIf,
    TooltipModule,
    TagModule,
    ReactiveFormsModule,
    CheckboxModule,
  ],
})
export class GroupedBySetsTabComponent implements OnInit {
  owned!: string[];
  private readonly _allGearSets: { key: string; value: GearSetVM }[] = [];
  gearSetsFiltered: { key: string; value: GearSetVM }[] = [];
  formGroup!: FormGroup;

  constructor(private readonly gearService: GearService) {}

  async ngOnInit(): Promise<void> {
    await this.fetchHabiticaContent();

    this.formGroup = new FormGroup({
      showCompletedSets: new FormControl(SHOW_COMPLETED_SET, {
        validators: [Validators.required],
      }),
    });

    this.formGroup
      .get("showCompletedSets")
      ?.valueChanges.subscribe((showCompletedSets: boolean) => {
        this.gearSetsFiltered = this._allGearSets.filter(
          (set) => showCompletedSets || set.value.progression < 100,
        );
      });
  }

  private async fetchHabiticaContent() {
    this.owned = await this.gearService.getOwnedArmoire();

    const gears = await this.gearService.getAllGears();
    Object.values(gears)
      .filter((item) => item.klass === "armoire")
      .forEach((item) => this.updateSet(item));

    // Sort gears by decreasing progression and alphabetical order
    this._allGearSets.sort((setA, setB) => {
      const order = setB.value.progression - setA.value.progression;
      if (order === 0) {
        return setA.key.localeCompare(setB.key);
      }

      return order;
    });

    if (SHOW_COMPLETED_SET) {
      this.gearSetsFiltered = this._allGearSets;
    } else {
      this.gearSetsFiltered = this._allGearSets.filter((set) => set.value.progression < 100);
    }
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
    const set = this._allGearSets.find((set) => set.key === gearVM.set);

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
      this._allGearSets.push(set);
    }
  }

  private isGearOwned(gear: HabiticaGear): boolean {
    return this.owned.includes(gear.key);
  }

  private getProgression(set: { key: string; value: GearSetVM }) {
    return round(set.value.nbItemsOwned / set.value.nbOfItemsInSet) * 100;
  }
}
