import { Component } from "@angular/core";
import { MenuComponent } from "../menu/menu.component";
import { DarkModeButtonComponent } from "../dark-mode-button/dark-mode-button.component";

@Component({
  selector: "app-topbar",
  standalone: true,
  imports: [MenuComponent, DarkModeButtonComponent],
  templateUrl: "./topbar.component.html",
  styleUrl: "./topbar.component.scss",
})
export class TopbarComponent {}
