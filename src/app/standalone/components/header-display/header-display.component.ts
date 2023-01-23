import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Subscription, timer } from "rxjs";
import { NgIf } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { RouterLink } from "@angular/router";
//Services
import { PrayerService } from "@tap/shared/services/";
//Models
import { ePrayers } from "@tap/shared/models";


@Component({
  selector: "tap-header-display",
  standalone: true,
  imports: [NgIf,RouterLink, MatButtonModule],
  templateUrl: "./header-display.component.html",
  styleUrls: ["./header-display.component.scss"],
})
export class HeaderDisplayComponent implements OnInit, OnDestroy {
  @Input() showHeader: boolean = false;

  subscriptions: Subscription = new Subscription();
  currentDate: Date = new Date();
  formattedDate: string = "";
  formattedTime: string = "";

  constructor(public prayerService: PrayerService) {}

  ngOnInit(): void {
    this.initTime();
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

  getActivePrayer(date: Date) {
    this.prayerService.prayers.forEach((prayer) => {
      if (
        prayer.startEpoch &&
        prayer.endEpoch &&
        prayer.startEpoch < date.getTime() &&
        date.getTime() < prayer.endEpoch
      )
        prayer.isActive = true;
      else false;
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
