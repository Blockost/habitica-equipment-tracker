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

const IMAGES_REPO_URL = `https://habitica-assets.s3.amazonaws.com/mobileApp/images`;
const REGEXP = /Enchanted Armoire: (.*) \(Item (.*)\)/i;
const REGEXP_ARMOIRE = /Enchanted Armoire: /i;

interface HabiticaGearVM {
  key: string;
  icon: string;
  name: string;
  description: string;
  set: string;
  type: string;
  owned: boolean;
}

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
    return {
      key: gear.key,
      icon: `${IMAGES_REPO_URL}/shop_${gear.key}.png`,
      name: gear.text,
      description: this.mapDescription(gear),
      set: this.mapGearSet(gear),
      type: this.titleCasePipe.transform(gear.type),
      // TODO: This method does not seem to be scalable enough to work with big dataset. Is it
      //  necessary to think about a better solution ? Worst case, we display a loading component
      //  during computation (along other stats) and we cache the result for a time.
      owned: this.owned.includes(gear.key),
    };
  }

  private mapDescription(gear: HabiticaGear): string {
    if (gear == null || gear.notes == null || gear.notes.length < 1) {
      return "-";
    }

    const match = gear.notes.match(REGEXP_ARMOIRE);
    if (match == null) {
      return gear.notes.trim();
    }

    return gear.notes.slice(0, match.index).trim();
  }

  private mapGearSet(gear: HabiticaGear): string {
    if (gear == null || gear.set == null || gear.set.length < 1) {
      return "-";
    }

    if (gear.set.startsWith("armoire-")) {
      return "-";
    }

    const match = gear.notes.match(REGEXP);
    if (match == null) {
      return "-";
    }

    const setName = match[1];
    const setIndex = match[2];
    return `${setName} (${setIndex})`.trim();
  }
}
