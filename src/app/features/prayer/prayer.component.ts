import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import {
  PrayerGridComponent,
  HeaderDisplayComponent,
  FooterCopyrightComponent,
} from "@tap/standalone/components/";

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
export class PrayerComponent {}
