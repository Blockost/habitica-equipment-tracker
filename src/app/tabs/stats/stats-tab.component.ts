import { Component, OnInit } from "@angular/core";
import { StatsModel, StatsService } from "../../services/stats.service";
import { MeterGroupModule, MeterItem } from "primeng/metergroup";

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

    console.log(percentage, this.round(percentage));
    this.meterItems = [
      {
        label: `Items owned (${this.stats.nbItemsOwned} out of ${this.stats.nbItemsTotal} items in total)`,
        value: this.round(percentage),
        color: "var(--primary-color)",
      },
    ];
  }

  private round(n: number): number {
    return +(Math.round(n * 100) / 100).toFixed(3);
  }
}
