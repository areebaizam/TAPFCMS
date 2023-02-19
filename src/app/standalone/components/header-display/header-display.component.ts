import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { forkJoin, Subscription, timer } from "rxjs";
import { NgIf } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { RouterLink } from "@angular/router";
//Services
import { PrayerService } from "@tap/shared/services/";
//Models
import { ePrayerType } from "@tap/shared/models";
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
  formattedRemainingTime: string = "";

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
        this.getActivePrayer();
        if (
          !this.prayerService.prayers.some(
            (p) => p.type === ePrayerType.PRAYER && p.isActive === true
          )
        )
          this.getNextPrayerTime();
      })
    );

    //Day Change Timer
    this.subscriptions.add(
      timer(
        DateHelper.getTomorrowDateInterval(),
        DateHelper.getDayToMilliseconds
      ).subscribe((n) => {
        console.log('Last Refresh',Date(),DateHelper.getTomorrowDateInterval());
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
    this.prayerService.getPrayerCSVTime$().subscribe((result) => {
      this.prayerService.setPrayerCsvTimings(result);
      this.prayerService.setPrayerTimings();
    });
  }

  getActivePrayer() {
    this.prayerService.prayers.forEach((prayer) => {
      if (
        prayer.startEpoch &&
        prayer.endEpoch &&
        prayer.startEpoch < this.currentDate.getTime() &&
        this.currentDate.getTime() < prayer.endEpoch
      ) {
        prayer.isActive = true;
        if (prayer.type === ePrayerType.PRAYER)
          this.formattedRemainingTime =
            prayer.name +
            " ends in " +
            DateHelper.convertSecondsToTime(
              prayer.endEpoch - this.currentDate.getTime()
            );
      } else prayer.isActive = false;
    });
  }

  getNextPrayerTime() {
    const prayer = this.prayerService.prayers.find(
      (prayer) =>
        prayer.type === ePrayerType.PRAYER &&
        prayer.startEpoch &&
        this.currentDate.getTime() < prayer.startEpoch
    );
    if (prayer && prayer.startEpoch)
      this.formattedRemainingTime =
        prayer.name +
        " starts in " +
        DateHelper.convertSecondsToTime(
          prayer.startEpoch - this.currentDate.getTime()
        );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
