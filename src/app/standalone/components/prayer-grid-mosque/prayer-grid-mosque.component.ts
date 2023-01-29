import { Component } from "@angular/core";
import { NgFor, NgIf } from "@angular/common";
//Services
import { PrayerService } from "@tap/shared/services/";
//Models and Enums
import { ePrayerType } from "@tap/shared/models";
//Pipes
import { FilterBooleanPipe, FilterStringPipe } from "@tap/standalone/pipes";

@Component({
  selector: 'tap-prayer-grid-mosque',
  standalone: true,
  imports: [NgFor, NgIf, FilterBooleanPipe, FilterStringPipe],
  templateUrl: './prayer-grid-mosque.component.html',
  styleUrls: ['./prayer-grid-mosque.component.scss']
})
export class PrayerGridMosqueComponent {
  prayerType = ePrayerType;
  orgDetails: string;
  constructor(public prayerService: PrayerService) {
    this.orgDetails =
    "BCMA & Sharia Council of B.C. Timings: ( Fajr: " +
    prayerService.prayerOrg?.Fajr +
    "° / Isha: " +
    prayerService.prayerOrg?.Isha +
    "° )";
  }
}
