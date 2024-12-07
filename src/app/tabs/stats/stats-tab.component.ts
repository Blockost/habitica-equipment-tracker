import { Component, OnInit } from "@angular/core";
import { StatsModel, StatsService } from "../../services/stats.service";
import { MeterGroupModule, MeterItem } from "primeng/metergroup";
import { round } from "../../util/util";

@Component({
  selector: "app-stats-tab",
  standalone: true,
  templateUrl: "./stats-tab.component.html",
  styleUrls: [],
  imports: [MeterGroupModule],
})
export class StatsTabComponent implements OnInit {
  stats!: StatsModel;
  meterItems: MeterItem[] = [];

  constructor(private readonly statsService: StatsService) {}

  async ngOnInit(): Promise<void> {
    console.log("StatsTabComponent init now!");

    this.stats = await this.statsService.getStats();
    const percentage = Math.fround(this.stats.nbItemsOwned / this.stats.nbItemsTotal);

    console.log(percentage, round(percentage));
    this.meterItems = [
      {
        label: `Items owned (${this.stats.nbItemsOwned} out of ${this.stats.nbItemsTotal} items in total)`,
        value: round(percentage),
        color: "var(--primary-color)",
      },
    ];
  }
}
