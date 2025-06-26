import { Component, OnInit } from "@angular/core";
import { Button } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { NgIf, TitleCasePipe } from "@angular/common";
import { PrimeTemplate } from "primeng/api";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Table, TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { HabiticaService } from "../../services/habitica.service";
import { HabiticaGear } from "../../models/habitica.model";
import { GearService } from "../../services/gear.service";
import { HabiticaGearVM, mapToVM } from "../../models/vm.model";
import { TooltipModule } from "primeng/tooltip";

@Component({
  selector: "app-table-tab",
  standalone: true,
  templateUrl: "./table-tab.component.html",
  styleUrls: [],
  imports: [
    Button,
    InputTextModule,
    NgIf,
    PrimeTemplate,
    ReactiveFormsModule,
    TableModule,
    TagModule,
    FormsModule,
    TooltipModule,
  ],
  providers: [TitleCasePipe],
})
export class TableTabComponent implements OnInit {
  gears: HabiticaGearVM[] = [];
  /**
   * Search value for global search input field.
   */
  searchValue: string | undefined;

  private owned: string[] = [];
  private equipped: string[] = [];
  private costume: string[] = [];

  constructor(
    private readonly gearService: GearService,
    // TODO 2024-11-18 Blockost HabiticaService should never be called from a component ! Change that !
    private readonly habiticaService: HabiticaService,
  ) {}

  async ngOnInit(): Promise<void> {
    console.log("TableTabComponent init now!");

    await this.fetchHabiticaContent();
  }

  clearFilters(table: Table) {
    table.clear();
  }

  async equipBattleGear(vm: HabiticaGearVM) {
    vm.loading = true;

    try {
      const userItemsInfo = await this.gearService.equipBattleGear(vm.key);

      // Reset equipped marker on all gears
      this.resetEquippedGearVM();

      // Add marker based on service response
      Object.values(userItemsInfo.gear.equipped).forEach((gearKey) => {
        const gear = this.gears.find((gear) => gear.key === gearKey);
        if (gear) {
          gear.equipped = true;
        }
      });
    } finally {
      vm.loading = false;
    }
  }

  async equipCostume(vm: HabiticaGearVM) {
    vm.loading = true;

    try {
      const userItemsInfo = await this.gearService.equipCostume(vm.key);

      // Reset equipped marker on all gears
      this.resetEquippedAsCostumeGearVM();

      // Add marker based on service response
      Object.values(userItemsInfo.gear.costume).forEach((gearKey) => {
        const gear = this.gears.find((gear) => gear.key === gearKey);
        if (gear) {
          gear.equippedAsCostume = true;
        }
      });
    } finally {
      vm.loading = false;
    }
  }

  private async fetchHabiticaContent() {
    const content = await this.habiticaService.getAllContent();
    console.log(content);

    this.owned = await this.gearService.getOwnedArmoire();
    this.equipped = await this.gearService.getEquippedItems();
    this.costume = await this.gearService.getCostumeItems();

    const gears = content.gear.flat;
    this.gears = Object.values(gears)
      .filter((item) => item.klass === "armoire")
      .map((item) => this.mapToVM(item));
  }

  private mapToVM(gear: HabiticaGear): HabiticaGearVM {
    const vm = mapToVM(gear);
    // TODO: This method does not seem to be scalable enough to work with big dataset. Is it
    //  necessary to think about a better solution ? Worst case, we display a loading component
    //  during computation (along other stats) and we cache the result for a time.
    vm.owned = this.owned.includes(gear.key);
    vm.equipped = vm.owned && this.equipped.includes(gear.key);
    vm.equippedAsCostume = vm.owned && this.costume.includes(gear.key);
    return vm;
  }

  private resetEquippedGearVM() {
    this.gears.filter((gear) => (gear.equipped = false));
  }

  private resetEquippedAsCostumeGearVM() {
    this.gears.filter((gear) => (gear.equippedAsCostume = false));
  }
}
