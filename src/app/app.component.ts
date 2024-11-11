import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { HabiticaService } from "./services/habitica.service";
import { HabiticaGear } from "./models/habitica.model";
import { TableModule } from "primeng/table";
import { NgIf, TitleCasePipe } from "@angular/common";
import { TagModule } from "primeng/tag";

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
  imports: [RouterOutlet, TableModule, TitleCasePipe, TagModule, NgIf],
  providers: [TitleCasePipe],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent {
  title = "habitica-equipment-tracker";
  gears: HabiticaGearVM[] = [];

  constructor(
    private readonly habiticaService: HabiticaService,
    private readonly titleCasePipe: TitleCasePipe,
  ) {}

  async ngOnInit() {
    const content = await this.habiticaService.getAllContent();
    console.log(content);

    const gears = content.gear.flat;
    this.gears = Object.values(gears)
      .filter((item) => item.klass === "armoire")
      .map((item) => this.mapToVM(item))
      .slice(0, 10);
  }

  private mapToVM(gear: HabiticaGear): HabiticaGearVM {
    return {
      key: gear.key,
      icon: `${IMAGES_REPO_URL}/shop_${gear.key}.png`,
      name: gear.text,
      description: this.mapDescription(gear),
      set: this.mapGearSet(gear),
      type: this.titleCasePipe.transform(gear.type),
      owned: false,
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
