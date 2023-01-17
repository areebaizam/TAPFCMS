import { Component } from "@angular/core";
import { ContactUsDetailComponent } from "@tap/standalone/components";

@Component({
  selector: "tap-contact-us",
  standalone: true,
  imports: [ContactUsDetailComponent],
  templateUrl: "./contact-us.component.html",
  styleUrls: ["./contact-us.component.scss"],
})
export class ContactUsComponent {}
