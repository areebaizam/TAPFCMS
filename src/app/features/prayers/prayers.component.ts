import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import {
  HeaderDisplayComponent,
  PrayerGridMosqueComponent,
  FooterDisplayComponent,
} from "@tap/standalone/components/";
//Services
import { PrayerService } from "@tap/shared/services/";
//Models and Enums
import { eSunriseAPIStatusCodes } from "@tap/shared/models";
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
