import { Component } from "@angular/core";
import { SupportComponent } from "./support/support.component";
import { ServicesComponent } from "./services/services.component";
import { AlertService } from "@tap/lib/alert";
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
export class HomeComponent {
  options = {
    autoClose: true,
    keepAfterRouteChange: false,
  };

  longtxt: string = `<b>It is a long established fact</b> <br>that a reader will be distracted by the readable 
  content of a page when looking at its layout. <u>The point</u> of using Lorem Ipsum is that it has a 
  more-or-less normal distribution of letters, as opposed to using  making it look like readable English. 
  Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, 
  and a search for  will uncover many web sites still in their infancy. Various versions have evolved over 
  the years, sometimes by accident, sometimes on purpose (injected humour and the like).`;
  constructor(private alertService: AlertService) {
    // this.alertService.info(this.longtxt, this.options);
    // this.alertService.success("success Alert", this.options);
    // this.alertService.error("error Alert", this.options);
    // this.alertService.warn("home Alert", this.options);
  }
}
