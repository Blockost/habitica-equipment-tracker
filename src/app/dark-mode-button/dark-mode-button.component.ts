import { Component } from "@angular/core";
import { ButtonDirective } from "primeng/button";
import { TooltipModule } from "primeng/tooltip";

@Component({
  selector: "app-dark-mode-button",
  standalone: true,
  imports: [ButtonDirective, TooltipModule],
  templateUrl: "./dark-mode-button.component.html",
  styleUrl: "./dark-mode-button.component.scss",
})
export class DarkModeButtonComponent {
  isDarkModeEnabled = false;
  icon = this.isDarkModeEnabled ? "pi pi-moon" : "pi pi-sun";

  toggleDarkMode(): void {
    console.log("Toggle dark mode");
  }
}
