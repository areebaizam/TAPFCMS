import { Component } from "@angular/core";
import {
  FooterCopyrightComponent,
  CardIconComponent,
  ContactUsComponent,
  HeroComponent,
} from "@tap/standalone/components/";

@Component({
  selector: "tap-home",
  standalone: true,
  imports: [
    FooterCopyrightComponent,
    CardIconComponent,
    ContactUsComponent,
    HeroComponent,
  ],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent {}
