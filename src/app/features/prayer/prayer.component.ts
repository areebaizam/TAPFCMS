import { Component, OnDestroy, OnInit } from "@angular/core";
import { RouterLink } from "@angular/router";
import { Subscription, timer } from "rxjs";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import {
  PrayerGridComponent,
  HeaderDisplayComponent,
  FooterCopyrightComponent,
} from "@tap/standalone/components/";
//Utilities
import { DateHelper } from "@tap/core/dateHelper.utilities";
//Services
import { PrayerService } from "@tap/shared/services/";
//Models and Enums
import { eSunriseAPIStatusCodes } from "@tap/shared/models";

@Component({
  selector: "tap-prayer",
  standalone: true,
  imports: [
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    PrayerGridComponent,
    HeaderDisplayComponent,
    FooterCopyrightComponent,
  ],
  templateUrl: "./prayer.component.html",
  styleUrls: ["./prayer.component.scss"],
})
export class PrayerComponent implements OnInit, OnDestroy {
  constructor(private prayerService: PrayerService) {}
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
