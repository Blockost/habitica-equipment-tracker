import { Component, ViewChild } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { HabiticaService } from "./services/habitica.service";
import { TableModule } from "primeng/table";
import { NgIf, NgOptimizedImage } from "@angular/common";
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
import { Accordion, AccordionModule } from "primeng/accordion";
import { TabViewModule } from "primeng/tabview";
import { StatsTabComponent } from "./tabs/stats/stats-tab.component";
import { TableTabComponent } from "./tabs/table/table-tab.component";
import { GroupedBySetsTabComponent } from "./tabs/groupedBySets/grouped-by-sets.component";
import { AvatarComponent } from "./avatar/avatar.component";
import { version } from "../../version";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    RouterOutlet,
    TableModule,
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
    TabViewModule,
    StatsTabComponent,
    TableTabComponent,
    GroupedBySetsTabComponent,
    AvatarComponent,
    NgOptimizedImage,
  ],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent {
  formGroup!: FormGroup;
  username = "";
  loading = false;
  version = version;

  @ViewChild("accordion")
  private readonly accordion!: Accordion;

  constructor(
    private readonly habiticaService: HabiticaService,
    private readonly contextService: ContextService,
    private readonly fb: NonNullableFormBuilder,
  ) {}

  async ngOnInit(): Promise<void> {
    this.contextService.init();
    const userId = this.contextService.userId;
    const apiToken = this.contextService.apiToken;

    this.formGroup = this.fb.group({
      userId: [userId || "", [Validators.required]],
      apiToken: [apiToken || "", [Validators.required]],
      saveLocally: [false, [Validators.required]],
    });

    if (userId && apiToken) {
      await this.submitUserCredentials();
    }
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

    this.loading = true;
    this.contextService.save(userId, apiToken, saveLocally);

    const userInfo = await this.habiticaService.getUserInfo(userId, apiToken);
    this.username = userInfo.auth.local.username;

    this.loading = false;
    this.accordion.activeIndex = 1;
  }

  async refresh(): Promise<void> {
    // TODO 2024-11-18 Blockost check what to do here
    console.error("FIXME!");
  }

  async reset(): Promise<void> {
    this.contextService.clear();
    this.formGroup.reset({ userId: "", apiToken: "", saveLocally: false });
    this.username = "";
  }
}
