import { Component, OnDestroy, OnInit } from "@angular/core";
import { GearService } from "../services/gear.service";
import {
  EquipmentSetInfo,
  HabiticaUserItemsInfo,
  HabiticaUserPreferences,
} from "../models/habitica.model";
import { CommonModule, NgOptimizedImage } from "@angular/common";
import { UserService } from "../services/user.service";
import { AppEventManager } from "../services/event/event-manager";
import { AppEvent } from "../models/events.model";
import { Subscription } from "rxjs";

interface AvatarInfoVm extends Partial<EquipmentSetInfo> {
  bodyType?: string;
  shirtColor?: string;
  skinColor?: string;
  bgColor?: string;
  hairType?: number;
  hairColor?: string;
}

const EMPTY_SPRITE_STR = "_base_0";

@Component({
  selector: "app-avatar",
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: "./avatar.component.html",
  styleUrl: "./avatar.component.scss",
})
export class AvatarComponent implements OnInit, OnDestroy {
  avatarInfoVm!: AvatarInfoVm;
  loading = false;

  private readonly subscriptions: Subscription[] = [];

  constructor(
    private readonly gearService: GearService,
    private readonly userService: UserService,
    private readonly eventManager: AppEventManager,
  ) {}

  async ngOnInit(): Promise<void> {
    this.loading = true;

    // Retrieve gear info
    const battleGear = await this.gearService.getEquippedItems();
    const costume = await this.gearService.getCostumeItems();

    // Refresh avatar visual
    this.avatarInfoVm = await this.buildVm(battleGear, costume);

    // Listen to updates
    this.registerListeners();
    this.loading = false;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  private mapUserPrefsToVm(userPrefs: HabiticaUserPreferences): AvatarInfoVm {
    return {
      bodyType: userPrefs.size,
      shirtColor: userPrefs.shirt,
      bgColor: userPrefs.background,
      skinColor: userPrefs.skin,
      hairType: userPrefs.hair.bangs,
      hairColor: userPrefs.hair.color,
    };
  }

  private mapToVM(e: EquipmentSetInfo): AvatarInfoVm {
    const vm: AvatarInfoVm = {};

    Object.keys(e).forEach((k) => {
      const key = k as keyof EquipmentSetInfo;
      const value = e[key];
      if (value !== undefined && !value.includes(EMPTY_SPRITE_STR)) {
        vm[key] = value;
      }
    });

    return vm;
  }

  private async buildVm(
    battleGear: EquipmentSetInfo,
    costume: EquipmentSetInfo,
  ): Promise<AvatarInfoVm> {
    const userPrefs = await this.userService.getUserPreferences();
    // Map partial info to VM to set up the object
    const vm = this.mapUserPrefsToVm(userPrefs);

    // If configuration allows to use costume over regular battle gear, override it
    let equipment = battleGear;
    if (userPrefs.costume) {
      equipment = Object.assign(battleGear, costume);
    }

    return Object.assign(vm, this.mapToVM(equipment));
  }

  private registerListeners() {
    this.subscriptions.push(
      // Refresh avatar visuals on items change
      this.eventManager.subscribe<HabiticaUserItemsInfo>(
        AppEvent.USER_ITEMS_INFO_UPDATED,
        async (content) => {
          this.avatarInfoVm = await this.buildVm(content.gear.equipped, content.gear.costume);
        },
      ),
    );
  }
}
