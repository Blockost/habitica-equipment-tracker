import { Component } from "@angular/core";
import { GearService } from "../services/gear.service";
import { EquipmentSetInfo } from "../models/habitica.model";
import { CommonModule } from "@angular/common";

interface AvatarInfoVm extends EquipmentSetInfo {
  skin?: string;
  background?: string;
}

@Component({
  selector: "app-avatar",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./avatar.component.html",
  styleUrl: "./avatar.component.scss",
})
export class AvatarComponent {
  costume: AvatarInfoVm | undefined;
  loading = false;

  constructor(private readonly gearService: GearService) {}

  async ngOnInit(): Promise<void> {
    this.loading = true;
    const battleGear = await this.gearService.getEquippedItems();
    const costume = await this.gearService.getCostumeItems();

    // Merge equipment info
    Object.keys(costume).map((k: Array<keyof EquipmentSetInfo>) => {
      const value = costume[k];
    });

    this.loading = false;
  }
}
