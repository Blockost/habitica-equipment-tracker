import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { HabiticaService } from "./services/habitica.service";
import { HabiticaGear } from "./models/habitica.model";
import { Table, TableModule } from "primeng/table";
import { NgIf, TitleCasePipe } from "@angular/common";
import { TagModule } from "primeng/tag";
import { ButtonModule } from "primeng/button";
import {
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { InputTextModule } from "primeng/inputtext";
import { IconFieldModule } from "primeng/iconfield";
import { InputIconModule } from "primeng/inputicon";
import { PanelModule } from "primeng/panel";
import { CheckboxModule } from "primeng/checkbox";
import { ContextService } from "./services/context.service";
import { AccordionModule } from "primeng/accordion";

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
    IconFieldModule,
    InputIconModule,
    PanelModule,
    CheckboxModule,
    ReactiveFormsModule,
    AccordionModule,
  ],
  providers: [TitleCasePipe],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent {
  formGroup!: FormGroup;
  gears: HabiticaGearVM[] = [];
  owned: string[] = [];
  username = "";

  /**
   * Search value for global search input field.
   */
  searchValue: string | undefined;

  constructor(
    private readonly habiticaService: HabiticaService,
    private readonly titleCasePipe: TitleCasePipe,
    private readonly contextService: ContextService,
    private readonly fb: NonNullableFormBuilder,
  ) {}

  ngOnInit(): void {
    this.contextService.init();
    const userId = this.contextService.userId;
    const apiToken = this.contextService.apiToken;

    this.formGroup = this.fb.group({
      userId: [userId || "", [Validators.required]],
      apiToken: [apiToken || "", [Validators.required]],
      saveLocally: [false, [Validators.required]],
    });
  }

  async submitUserCredentials(): Promise<void> {
    console.debug("Submit user credentials");

    if (this.formGroup.invalid) {
      console.error("Form contains errors", this.formGroup);
      return;
    }

    const userId = this.formGroup.get("userId")?.value;
    if (!userId) {
      throw new Error("User ID cannot be null");
    }

    const apiToken = this.formGroup.get("apiToken")?.value;
    if (!apiToken) {
      throw new Error("API Token cannot be null");
    }

    const saveLocally = this.formGroup.get("saveLocally")?.value;
    if (saveLocally === undefined || saveLocally === null) {
      throw new Error("Save locally consent cannot be null");
    }

    this.contextService.save(userId, apiToken, saveLocally);
    await this.refresh();
  }

  clearFilters(table: Table) {
    table.clear();
  }

  async refresh(): Promise<void> {
    await this.fetchUserData();
    await this.fetchHabiticaContent();
  }

  async reset(): Promise<void> {
    this.contextService.clear();
    this.formGroup.reset({ userId: "", apiToken: "", saveLocally: false });
    this.username = "";
    this.gears = [];
    this.owned = [];
  }

  private async fetchUserData(): Promise<void> {
    const userId = this.contextService.userId;
    const apiToken = this.contextService.apiToken;

    try {
      const userInfo = await this.habiticaService.getUserInfo(userId, apiToken);
      this.username = userInfo.auth.local.username;
      const ownedGears = userInfo.items.gear.owned;
      console.log("All owned", ownedGears);

      this.owned = Object.keys(ownedGears).filter(
        (item) => ownedGears[item] && item.includes("_armoire_"),
      );
      console.log("Armoire owned", this.owned);
    } catch (error) {
      console.error(error);
    }
  }

  private async fetchHabiticaContent() {
    const content = await this.habiticaService.getAllContent();
    console.log(content);

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
