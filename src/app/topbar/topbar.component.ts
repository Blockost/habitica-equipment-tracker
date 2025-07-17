import { Component } from "@angular/core";
import { MenuComponent } from "../menu/menu.component";
import { DarkModeButtonComponent } from "../dark-mode-button/dark-mode-button.component";
import { NgForOf } from "@angular/common";
import { TooltipModule } from "primeng/tooltip";
import { DividerModule } from "primeng/divider";

interface ExternalLink {
  tooltip: string;
  icon: string;
  url: string;
}

@Component({
  selector: "app-topbar",
  standalone: true,
  imports: [MenuComponent, DarkModeButtonComponent, NgForOf, TooltipModule, DividerModule],
  templateUrl: "./topbar.component.html",
  styleUrl: "./topbar.component.scss",
})
export class TopbarComponent {
  links: ExternalLink[] = [
    {
      tooltip: "Explore the source code",
      icon: "pi pi-github",
      url: "https://github.com/Blockost/habitica-equipment-tracker",
    },
  ];
}
