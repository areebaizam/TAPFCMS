import { Component, OnDestroy, OnInit } from "@angular/core";
import { RouterLink } from "@angular/router";
import { Subscription, timer } from "rxjs";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import {
  PrayerGridComponent,
  PrayerGridMosqueComponent,
  FooterCopyrightComponent,
} from "@tap/standalone/components/";
//Utilities
import { DateHelper } from "@tap/core/dateHelper.utilities";
//Services
import { CoreService } from "@tap/shared/services/";
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
    PrayerGridMosqueComponent,
    FooterCopyrightComponent,
  ],
  templateUrl: "./prayer.component.html",
  styleUrls: ["./prayer.component.scss"],
})
export class PrayerComponent implements OnInit, OnDestroy {
  constructor(private coreService: CoreService) {}
  subscriptions: Subscription = new Subscription();

  newDate = new Date();
  newDateString = new Date(this.newDate.toDateString()); //Set time 000000
  nextDay = new Date(this.newDateString).setDate(
    this.newDateString.getDate() + 1
  );
  intervalTimeInMilliseconds: number = (60 - this.newDate.getSeconds()) * 1000;
  intervalDayInMilliseconds: number =
    new Date(this.nextDay).getTime() - this.newDate.getTime();
  date: string = "";
  time: string = "";

  ngOnInit(): void {
    this.initTime();
    this.initDate();
    this.initListener();
    this.getSunriseTimings();
  }

  initListener() {
    //Minute Change Timer
    this.subscriptions.add(
      timer(
        0,
        1000
      ).subscribe((n) => {
        this.initTime();
      })
    );

    //Day Change Timer
    this.subscriptions.add(
      timer(
        this.intervalDayInMilliseconds,
        DateHelper.getDayToMilliseconds
      ).subscribe((n) => {
        this.initDate();
      })
    );
  }

  initTime() {
    this.time = new Date().toLocaleTimeString(); //Remove Seconds
  }

  initDate() {
    this.date = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  getSunriseTimings() {
    this.subscriptions.add(
      this.coreService.getSunriseTime$().subscribe(
        (next) => {
          if ((next.status = eSunriseAPIStatusCodes.OK)) {
            //TODO Move to Prayer Service
            this.coreService.getPrayerTimings(next.results);
            this.coreService.setPrayerTimings(next.results);
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
