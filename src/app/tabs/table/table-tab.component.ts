import { Component, OnInit } from "@angular/core";
import { Button, ButtonDirective } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { NgIf, TitleCasePipe } from "@angular/common";
import { PrimeTemplate, SortMeta } from "primeng/api";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { HabiticaGear } from "../../models/habitica.model";
import { GearService } from "../../services/gear.service";
import { HabiticaGearVM, mapToVM } from "../../models/vm.model";
import { TooltipModule } from "primeng/tooltip";
import { MultiSelectModule } from "primeng/multiselect";
import { OverlayPanelModule } from "primeng/overlaypanel";
import { InputIconModule } from "primeng/inputicon";
import { IconFieldModule } from "primeng/iconfield";

interface Column {
  header: string;
  field: string;
  disabled?: boolean;
}

const DEFAULT_COLUMNS = ["name", "image", "description", "setFullName", "type", "owned"];

@Component({
  selector: "app-table-tab",
  standalone: true,
  templateUrl: "./table-tab.component.html",
  styleUrls: ["./table-tab.component.scss"],
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
    MultiSelectModule,
    TitleCasePipe,
    OverlayPanelModule,
    ButtonDirective,
    InputIconModule,
    IconFieldModule,
  ],
  providers: [TitleCasePipe],
})
export class TableTabComponent implements OnInit {
  gears: HabiticaGearVM[] = [];
  /**
   * Search value for global search input field.
   */
  searchValue: string | undefined;

  cols: Column[] = [];

  /**
   * By default, table should be sorted by "name" in ascending order.
   * In multiple sort mode, we must define a SortMeta array.
   */
  defaultSort: SortMeta[] = [{ field: "name", order: 1 }];

  private _selectedColumns: Column[] = [];

  private owned: string[] = [];
  private equipped: string[] = [];
  private costume: string[] = [];

  constructor(private readonly gearService: GearService) {}

  async ngOnInit(): Promise<void> {
    this.cols = [
      { header: "Name", field: "name", disabled: true },
      { header: "Image", field: "image" },
      { header: "Description", field: "description" },
      { header: "Set", field: "setFullName" },
      { header: " Strength (STR)", field: "str" },
      { header: "Intelligence (INT)", field: "int" },
      { header: "Constitution (CON)", field: "con" },
      { header: "Perception (PER)", field: "per" },
      { header: "Type", field: "type" },
      { header: "Owned", field: "owned", disabled: true },
    ];

    this._selectedColumns = this.cols.filter((col) => DEFAULT_COLUMNS.includes(col.field));

    await this.fetchHabiticaContent();
  }

  get selectedColumns(): Column[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: Column[]) {
    // Restore original order
    this._selectedColumns = this.cols.filter((col) => val.includes(col));
  }

  isColumnSelected(colField: string): boolean {
    return this._selectedColumns.findIndex((col: Column) => col.field == colField) !== -1;
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
    this.owned = await this.gearService.getOwnedArmoire();
    this.equipped = Object.values(await this.gearService.getEquippedItems());
    this.costume = Object.values(await this.gearService.getCostumeItems());

    const gears = await this.gearService.getAllGears();
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
