import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { HabiticaService } from "./services/habitica.service";
import { HabiticaGear } from "./models/habitica.model";
import { Table, TableModule } from "primeng/table";
import { NgIf, TitleCasePipe } from "@angular/common";
import { TagModule } from "primeng/tag";
import { ButtonModule } from "primeng/button";
import { FormsModule } from "@angular/forms";
import { InputTextModule } from "primeng/inputtext";

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
  selector: "app-root",
  standalone: true,
  imports: [
    RouterOutlet,
    TableModule,
    TitleCasePipe,
    TagModule,
    NgIf,
    ButtonModule,
    FormsModule,
    InputTextModule,
  ],
  providers: [TitleCasePipe],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent {
  title = "habitica-equipment-tracker";
  gears: HabiticaGearVM[] = [];
  owned: string[] = [];

  /**
   * Search value for global search input field.
   */
  searchValue: string | undefined;

  constructor(
    private readonly habiticaService: HabiticaService,
    private readonly titleCasePipe: TitleCasePipe,
  ) {}

  async ngOnInit() {
    const userInfo = await this.habiticaService.getUserInfo();
    const ownedGears = userInfo.data.items.gear.owned;
    console.log("All owned", ownedGears);

    this.owned = Object.keys(ownedGears).filter(
      (item) => ownedGears[item] && item.includes("_armoire_"),
    );
    console.log("Armoire owned", this.owned);

    const content = await this.habiticaService.getAllContent();
    console.log(content);

    const gears = content.gear.flat;
    this.gears = Object.values(gears)
      .filter((item) => item.klass === "armoire")
      .map((item) => this.mapToVM(item))
      .slice(50, 100);
  }

  clear(table: Table) {
    table.clear();
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
