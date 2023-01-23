import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgFor, NgIf } from "@angular/common";
import { Subscription } from "rxjs";
//Services
import { PrayerService } from "@tap/shared/services/";
//Models and Enums
import { ePrayerType, eSunriseAPIStatusCodes } from "@tap/shared/models";


@Component({
  selector: "tap-prayer-grid",
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: "./prayer-grid.component.html",
  styleUrls: ["./prayer-grid.component.scss"],
})
export class PrayerGridComponent implements OnInit, OnDestroy {
  prayerType = ePrayerType;
  constructor(public prayerService: PrayerService) {}
  subscriptions: Subscription = new Subscription();
  ngOnInit(): void {
    // this.initListener();
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
