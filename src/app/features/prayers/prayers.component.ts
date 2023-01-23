import { Component, OnDestroy, OnInit } from "@angular/core";
import { forkJoin, Subscription } from "rxjs";
import {
  HeaderDisplayComponent,
  PrayerGridMosqueComponent,
  FooterDisplayComponent,
} from "@tap/standalone/components/";
//Services
import { PrayerService } from "@tap/shared/services/";
@Component({
  selector: "tap-prayers",
  standalone: true,
  imports: [
    HeaderDisplayComponent,
    PrayerGridMosqueComponent,
    FooterDisplayComponent,
  ],
  templateUrl: "./prayers.component.html",
  styleUrls: ["./prayers.component.scss"],
})
export class PrayersComponent implements OnInit, OnDestroy {
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
