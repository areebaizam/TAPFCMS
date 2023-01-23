import { Component, OnDestroy, OnInit } from "@angular/core";
import { RouterLink } from "@angular/router";
import { forkJoin, Subscription } from "rxjs";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import {
  PrayerGridComponent,
  HeaderDisplayComponent,
  FooterCopyrightComponent,
} from "@tap/standalone/components/";
//Services
import { PrayerService } from "@tap/shared/services/";

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
