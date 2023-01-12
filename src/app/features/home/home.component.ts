import { Component } from "@angular/core";
import { FooterCopyrightComponent, CardIconComponent } from "@tap/standalone/components/";

@Component({
  selector: "tap-home",
  standalone: true,
  imports: [FooterCopyrightComponent, CardIconComponent],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent {}
