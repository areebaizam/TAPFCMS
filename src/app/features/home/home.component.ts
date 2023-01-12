import { Component } from "@angular/core";
import { FooterCopyrightComponent } from "@tap/standalone/components/";

@Component({
  selector: "tap-home",
  standalone: true,
  imports: [FooterCopyrightComponent],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent {}
