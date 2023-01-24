import { Component } from "@angular/core";
import { NgFor, NgIf } from "@angular/common";
//Pipes
import { FilterBooleanPipe, FilterStringPipe } from "@tap/standalone/pipes";
//Services
import { PrayerService } from "@tap/shared/services/";
//Models and Enums
import { ePrayerType } from "@tap/shared/models";
@Component({
  selector: "tap-prayer-time",
  standalone: true,
  imports: [NgFor, NgIf, FilterBooleanPipe, FilterStringPipe],
  templateUrl: "./prayer-time.component.html",
  styleUrls: ["./prayer-time.component.scss"],
})
export class PrayerTimeComponent {
  prayerType = ePrayerType;
  constructor(public prayerService: PrayerService) {}
}
