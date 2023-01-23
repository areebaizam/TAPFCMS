import { Component } from "@angular/core";
import { NgFor, NgIf } from "@angular/common";
//Services
import { PrayerService } from "@tap/shared/services/";
//Models and Enums
import { ePrayerType } from "@tap/shared/models";

@Component({
  selector: "tap-prayer-grid",
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: "./prayer-grid.component.html",
  styleUrls: ["./prayer-grid.component.scss"],
})
export class PrayerGridComponent {
  prayerType = ePrayerType;
  constructor(public prayerService: PrayerService) {}
}
