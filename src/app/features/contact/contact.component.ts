import { Component } from "@angular/core";
import {
  HeadingComponent,
  ContactUsDetailComponent,
  FooterCopyrightComponent,
} from "@tap/standalone/components/";
import { TopicHeading, topicList, eTopicHeading } from "@tap/shared/models";

@Component({
  selector: "tap-contact",
  standalone: true,
  imports: [
    HeadingComponent,
    ContactUsDetailComponent,
    FooterCopyrightComponent,
  ],
  templateUrl: "./contact.component.html",
  styleUrls: ["./contact.component.scss"],
})
export class ContactComponent {
  heading: TopicHeading = topicList.filter(
    (t) => t.type == eTopicHeading.CONTACT
  )[0];
}
