import { Component } from "@angular/core";
import { SupportComponent } from "./support/support.component";
import { ServicesComponent } from "./services/services.component";
import {
  FooterCopyrightComponent,
  ContactUsComponent,
  HeroComponent,
} from "@tap/standalone/components/";

@Component({
  selector: "tap-home",
  standalone: true,
  imports: [
    FooterCopyrightComponent,
    ContactUsComponent,
    HeroComponent,
    SupportComponent,
    ServicesComponent,
  ],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent {}
