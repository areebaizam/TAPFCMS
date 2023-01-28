import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { forkJoin, Subscription, timer } from "rxjs";
import { NgIf } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { RouterLink } from "@angular/router";
//Services
import { PrayerService } from "@tap/shared/services/";
//Models
import { ePrayers } from "@tap/shared/models";
//Utilities
import { DateHelper } from "@tap/core/dateHelper.utilities";

@Component({
  selector: "tap-header-display",
  standalone: true,
  imports: [NgIf, RouterLink, MatButtonModule],
  templateUrl: "./header-display.component.html",
  styleUrls: ["./header-display.component.scss"],
})
export class HeaderDisplayComponent implements OnInit, OnDestroy {
  @Input() showHeader: boolean = false;
  @Input() hideDate: boolean = false;

  subscriptions: Subscription = new Subscription();
  currentDate: Date = new Date();
  formattedDate: string = "";
  formattedTime: string = "";

  constructor(public prayerService: PrayerService) {}

  ngOnInit(): void {
    this.initTime();
    this.getPrayerTimings();
    this.initListener();
  }

  initListener() {
    //Minute Change Timer
    this.subscriptions.add(
      timer(0, 1000).subscribe((n) => {
        this.currentDate = new Date();
        this.initTime();
        this.getActivePrayer(this.currentDate);
      })
    );

    //Day Change Timer
    this.subscriptions.add(
      timer(
        DateHelper.getTomorrowDateInterval(),
        DateHelper.getDayToMilliseconds
      ).subscribe((n) => {
        this.prayerService.invalidateCache();
        this.getPrayerTimings();
      })
    );
  }

  initTime() {
    this.formattedTime = this.currentDate.toLocaleTimeString();
    this.formattedDate = this.currentDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  getPrayerTimings() {
    forkJoin(
      this.prayerService.getPrayerCSVTime$(),
      this.prayerService.getSunriseAPITime$()
    ).subscribe((results) => {
      this.prayerService.setPrayerCsvTimings(results[0]);
      this.prayerService.setSunriseApiTimings(results[1]);
      this.prayerService.setPrayerTimings();
    });
  }

  getActivePrayer(date: Date) {
    this.prayerService.prayers.forEach((prayer) => {
      if (
        prayer.startEpoch &&
        prayer.endEpoch &&
        prayer.startEpoch < date.getTime() &&
        date.getTime() < prayer.endEpoch
      )
        prayer.isActive = true;
      else prayer.isActive = false;
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
