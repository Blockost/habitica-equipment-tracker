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
  ],
  providers: [TitleCasePipe],
})
export class TableTabComponent implements OnInit {
  gears: HabiticaGearVM[] = [];
  owned: string[] = [];
  /**
   * Search value for global search input field.
   */
  searchValue: string | undefined;

  constructor(
    private readonly gearService: GearService,
    // TODO 2024-11-18 Blockost HabiticaService should never be called from a component ! Change that !
    private readonly habiticaService: HabiticaService,
    private readonly titleCasePipe: TitleCasePipe,
  ) {}

  async ngOnInit(): Promise<void> {
    console.log("TableTabComponent init now!");

    await this.fetchHabiticaContent();
  }

  clearFilters(table: Table) {
    table.clear();
  }

  private async fetchHabiticaContent() {
    const content = await this.habiticaService.getAllContent();
    console.log(content);

    this.owned = await this.gearService.getOwnedArmoire();

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
    return vm;
  }
}
