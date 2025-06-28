import { Component } from "@angular/core";
import { GearService } from "../services/gear.service";
import { EquipmentSetInfo } from "../models/habitica.model";
import { CommonModule, NgOptimizedImage } from "@angular/common";
import { UserService } from "../services/user.service";

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
export class AvatarComponent {
  avatarInfoVm: AvatarInfoVm | undefined;
  loading = false;

  constructor(
    private readonly gearService: GearService,
    private readonly userService: UserService,
  ) {}

  async ngOnInit(): Promise<void> {
    this.loading = true;
    let mergedGear: EquipmentSetInfo;
    const battleGear = await this.gearService.getEquippedItems();

    // Merge equipment info if necessary
    const userPrefs = await this.userService.getUserPreferences();
    if (userPrefs.costume) {
      const costume = await this.gearService.getCostumeItems();
      mergedGear = Object.assign(battleGear, costume);
    } else {
      mergedGear = battleGear;
    }

    this.avatarInfoVm = this.sanitize(mergedGear);
    this.avatarInfoVm.bodyType = userPrefs.size;
    this.avatarInfoVm.shirtColor = userPrefs.shirt;
    this.avatarInfoVm.bgColor = userPrefs.background;
    this.avatarInfoVm.skinColor = userPrefs.skin;
    this.avatarInfoVm.hairType = userPrefs.hair.bangs;
    this.avatarInfoVm.hairColor = userPrefs.hair.color;

    this.loading = false;
  }

  private sanitize(e: EquipmentSetInfo): AvatarInfoVm {
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
}
