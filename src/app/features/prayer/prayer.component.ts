import { Component, OnDestroy, OnInit } from "@angular/core";
import { RouterLink } from "@angular/router";
import { Subscription, timer } from "rxjs";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { FooterCopyrightComponent } from "@tap/standalone/components/";
//Utilities
import { DateHelper } from "@tap/core/dateHelper.utilities";
//Services
import { CoreService } from "@tap/shared/services/";
//Models
import { eSunriseAPIStatusCodes } from "@tap/shared/models";

@Component({
  selector: "tap-prayer",
  standalone: true,
  imports: [RouterLink, MatToolbarModule, MatButtonModule],
  templateUrl: "./prayer.component.html",
  styleUrls: ["./prayer.component.scss"],
})
export class PrayerComponent implements OnInit, OnDestroy {
  constructor(private coreService: CoreService) {}
  subscriptions: Subscription = new Subscription();

  date: string = "";
  time: string = "";

  ngOnInit(): void {
    this.initListener();
    this.getSunriseTimings();
  }

  initListener() {
    this.subscriptions.add(
      timer(0, DateHelper.getMinutesToMilliseconds).subscribe((n) => {
        let date = new Date()
        this.date = date.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "short",
          day: "numeric",
        });
        this.time = date.toLocaleTimeString().replace(/(.*)\D\d+/, '$1'); //Remove Seconds
      })
    );
  }

  getSunriseTimings() {
    this.subscriptions.add(
      this.coreService.getSunriseTime$().subscribe(
        (next) => {
          if ((next.status = eSunriseAPIStatusCodes.OK)) {
            //TODO Move to Prayer Service
            this.coreService.getPrayerTimings(next.results);
            this.coreService.setPrayerTimings(next.results);
            console.log(
              this.coreService.prayers,
            );
          } else console.log(next, "Error");
        },
        (error) => {
          console.log(error, error.error.status, error.statusText);
        }
      )
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
