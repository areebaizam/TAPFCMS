import { Component, Inject, LOCALE_ID, OnDestroy, OnInit } from "@angular/core";
import { RouterLink } from "@angular/router";
import { Subscription, timer } from "rxjs";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { formatDate } from "@angular/common";
import { FooterCopyrightComponent } from "@tap/standalone/components/";
//Services
import { CoreService } from "@tap/shared/services/";
//Models
import {
  SunriseTimingsUTCModel,
  eSunriseAPIStatusCodes,
} from "@tap/shared/models";

@Component({
  selector: "tap-prayer",
  standalone: true,
  imports: [RouterLink, MatToolbarModule, MatButtonModule],
  templateUrl: "./prayer.component.html",
  styleUrls: ["./prayer.component.scss"],
})
export class PrayerComponent implements OnInit, OnDestroy {
  constructor(
    @Inject(LOCALE_ID) public locale: string,
    private coreService: CoreService
  ) {}
  subscriptions: Subscription = new Subscription();

  date: string = "";
  time: string = "";
  curr = formatDate("03-march-0303", "yyyy-dd-MM", this.locale);

  ngOnInit(): void {
    this.initListener();
    this.getSunriseTimings();
  }

  initListener() {
    this.subscriptions.add(
      timer(0, 1000).subscribe((n) => {
        this.date = new Date().toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "short",
          day: "numeric",
        });
        this.time = new Date().toLocaleTimeString();
      })
    );
  }

  getSunriseTimings() {
    this.subscriptions.add(
      //TODO Fix this
      this.coreService.getSunriseTime$().subscribe(
        (next) => {
          console.log("next", next);
          if ((next.status = eSunriseAPIStatusCodes.OK)) {
            this.getPrayerTimings(next.results);
          } else console.log(next, "console.error(");
        },
        (error) => {
          console.log(
            error,
            error.error.status,
            error.statusText,
            "APi console.error("
          );
        }
      )
    );
  }

  getPrayerTimings(sunriseAPIResult: SunriseTimingsUTCModel) {
    //TODO Move this to Date Helper
    //https://www.bennadel.com/blog/3925-adjusting-dates-by-adding-date-time-parts-in-angular-11-0-0.htm
    let Israq =new Date(sunriseAPIResult.sunrise).getTime() + 20*60*1000;
    let Chast = new Date(sunriseAPIResult.sunrise).getTime() + (sunriseAPIResult.day_length*250);//sunriseAPIResult.day_length/(4*60)*60*1000
    let Zuhr = new Date(sunriseAPIResult.sunrise).getTime() + (sunriseAPIResult.day_length*500);//sunriseAPIResult.day_length/(4*60)*60*1000
    let Zawal =new Date(sunriseAPIResult.solar_noon).getTime() - 40*60*1000;
    let Maghrib =new Date(sunriseAPIResult.sunset).getTime() + 7*60*1000;

    console.log(
      "Sunrise",
      formatDate(sunriseAPIResult.sunrise, "hh:mm a", this.locale),sunriseAPIResult.sunrise,
      formatDate('2023-03-19T15:56:35+00:00', "hh:mm a", this.locale)
    );
    console.log(
      "Ishraq",
      formatDate(Israq, "hh:mm a", this.locale)
    );
    console.log(
      "Chast",
      formatDate(Chast, "hh:mm a", this.locale)
    );
    console.log(
      "Zawal",
      formatDate(Zawal, "hh:mm a", this.locale)
    );   
    console.log(
      "Noon",
      formatDate(sunriseAPIResult.solar_noon, "hh:mm a", this.locale)
    );
    console.log(
      "Zuhr",
      formatDate(Zuhr, "hh:mm a", this.locale)
    );
    console.log(
      "Sunset",
      formatDate(sunriseAPIResult.sunset, "hh:mm a", this.locale)
    );
    console.log(
      "Maghrib",
      formatDate(Maghrib, "hh:mm a", this.locale)
    );  
    console.log(
      "DayLength",
      sunriseAPIResult.day_length/(4*60),
      sunriseAPIResult.day_length
    );  
   
    // console.log("Day Length", sunriseAPIResult.day_length,new Date(sunriseAPIResult.sunset).setTime(new Date(sunriseAPIResult.sunset).getTime() + 20*60*1000));//in mminutes
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
