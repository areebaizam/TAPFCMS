import { Component, OnDestroy, OnInit } from "@angular/core";
import { RouterLink } from "@angular/router";
import { Subscription, timer } from "rxjs";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { FooterCopyrightComponent } from "@tap/standalone/components/";
@Component({
  selector: "tap-prayer",
  standalone: true,
  imports: [RouterLink,MatToolbarModule, MatButtonModule, FooterCopyrightComponent],
  templateUrl: "./prayer.component.html",
  styleUrls: ["./prayer.component.scss"],
})
export class PrayerComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  date: string = "";
  time: string = "";

  ngOnInit(): void {
    this.initListener();
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

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
