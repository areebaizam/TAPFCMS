import { Component } from "@angular/core";
import {
  HeaderDisplayComponent,
  PrayerGridMosqueComponent,
  FooterDisplayComponent,
} from "@tap/standalone/components/";
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
export class PrayersComponent {}
