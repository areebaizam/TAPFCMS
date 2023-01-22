import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgFor, NgIf } from "@angular/common";
import { Subscription } from "rxjs";
//Pipes
import { FilterBooleanPipe, FilterStringPipe } from "@tap/standalone/pipes";
//Services
import { PrayerService } from "@tap/shared/services/";
//Models and Enums
import { eSunriseAPIStatusCodes, ePrayerType } from "@tap/shared/models";
@Component({
  selector: "tap-prayer-time",
  standalone: true,
  imports: [NgFor, NgIf, FilterBooleanPipe, FilterStringPipe],
  templateUrl: "./prayer-time.component.html",
  styleUrls: ["./prayer-time.component.scss"],
})
export class PrayerTimeComponent implements OnInit, OnDestroy {
  prayerType = ePrayerType;
  constructor(public prayerService: PrayerService) {}
  subscriptions: Subscription = new Subscription();
  ngOnInit(): void {
    this.initListener();
  }

  initListener() {
    this.getPrayerCsvTimings();
    this.getSunriseTimings();
  }

  getPrayerCsvTimings() {
    this.subscriptions.add(
      this.prayerService.getPrayerTime$().subscribe(
        (data) => {
          this.prayerService.setPrayerCsvTimings(data);
        },
        (error) => {
          console.log(error);
        }
      )
    );
  }

  getSunriseTimings() {
    this.subscriptions.add(
      this.prayerService.getSunriseTime$().subscribe(
        (next) => {
          if ((next.status = eSunriseAPIStatusCodes.OK)) {
            //TODO Move to Prayer Service
            this.prayerService.setSunriseApiTimings(next.results);
          } else console.log(next, "Error");
        },
        (error) => {
          console.log(error);
        }
      )
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
