import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgFor, NgIf } from "@angular/common";
import { forkJoin, Subscription } from "rxjs";
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
export class PrayerTimeComponent implements OnInit, OnDestroy {
  prayerType = ePrayerType;
  constructor(public prayerService: PrayerService) {}
  subscriptions: Subscription = new Subscription();
  ngOnInit(): void {
    this.initListener();
  }

  initListener() {
    this.getPrayerTimings();
  }

  getPrayerTimings() {
    let csvTimings$ = this.prayerService.getPrayerTime$();
    let sunriseTimings$ = this.prayerService.getSunriseTime$();

    this.subscriptions.add(
      forkJoin([csvTimings$, sunriseTimings$]).subscribe((results) => {
        this.prayerService.setPrayerCsvTimings(results[0]);
        this.prayerService.setSunriseApiTimings(results[1]?.results);
        this.prayerService.setPrayerTimings();
      })
    );
  }
  

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
