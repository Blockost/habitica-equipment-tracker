import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { HabiticaService } from "./services/habitica.service";
import { HabiticaGear } from "./models/habitica.model";

const IMAGES_REPO_URL = `https://habitica-assets.s3.amazonaws.com/mobileApp/images`;

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent {
  title = "habitica-equipment-tracker";
  gears: HabiticaGear[] = [];

  constructor(private readonly habiticaService: HabiticaService) {}

  async ngOnInit() {
    const content = await this.habiticaService.getAllContent();
    console.log(content);

    const gears = content.gear.flat;
    this.gears = Object.values(gears)
      .filter((item) => item.klass === "armoire")
      .slice(0, 10);
  }
}
