import { Component } from "@angular/core";
import { NgFor, NgIf } from "@angular/common";
//Services
import { PrayerService } from "@tap/shared/services/";
//Models and Enums
import { ePrayerType } from "@tap/shared/models";
//Pipes
import { FilterBooleanPipe, FilterStringPipe } from "@tap/standalone/pipes";

@Component({
  selector: "tap-prayer-grid",
  standalone: true,
  imports: [NgFor, NgIf, FilterBooleanPipe],
  templateUrl: "./prayer-grid.component.html",
  styleUrls: ["./prayer-grid.component.scss"],
})
export class PrayerGridComponent {
  prayerType = ePrayerType;
  orgDetails: string;
  constructor(public prayerService: PrayerService) {
    this.orgDetails =
      "BCMA Timings: ( Fajr: " +
      prayerService.prayerOrg?.Fajr +
      "° / Isha: " +
      prayerService.prayerOrg?.Isha +
      "° )";
  }
}
