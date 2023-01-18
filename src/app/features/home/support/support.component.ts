import { Component } from "@angular/core";
import {
  HeadingComponent,
  CardSupportComponent,
} from "@tap/standalone/components/";
import {
  TopicHeading,
  topicList,
  eTopicHeading,
  FeatureCard,
  cardData,
} from "@tap/shared/models";

@Component({
  selector: "tap-support",
  standalone: true,
  imports: [HeadingComponent, CardSupportComponent],
  templateUrl: "./support.component.html",
  styleUrls: ["./support.component.scss"],
})
export class SupportComponent {
  heading: TopicHeading = topicList.filter(
    (t) => t.type == eTopicHeading.SUPPORT
  )[0];
  data: Array<FeatureCard> = cardData.filter(
    (t) => t.type == eTopicHeading.SUPPORT
  );
}
